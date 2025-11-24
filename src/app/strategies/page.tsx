'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Download, TestTube, LineChart as LineChartIcon, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { runBacktest, exportBacktestResults } from './actions';

// --- Default Data ---

const defaultChartData = [
  { x: 0, y: 100000, strategy: 100000, benchmark: 100000 },
  { x: 1, y: 102000, strategy: 102000, benchmark: 101000 },
  { x: 2, y: 105000, strategy: 105000, benchmark: 102000 },
  { x: 3, y: 103000, strategy: 103000, benchmark: 103000 },
  { x: 4, y: 108000, strategy: 108000, benchmark: 104000 },
  { x: 5, y: 112000, strategy: 112000, benchmark: 105000 },
].map(item => ({...item, benchmark: item.strategy * 0.9 + 10000}));


const defaultMetrics = {
  totalReturn: '12.00%',
  annualizedReturn: 'N/A',
  maxDrawdown: '-1.82%',
  sharpeRatio: 'N/A',
  winRate: 'N/A',
};

const chartConfig = {
  strategy: { label: 'My Strategy', color: 'hsl(var(--chart-1))' },
  benchmark: { label: 'Benchmark', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;


// --- Main Component ---

export default function StrategiesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isBacktesting, startBacktestTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  
  const [rules, setRules] = useState([
    { id: 1, feature: 'predictionScore', operator: '>', value: '75' },
    { id: 2, feature: 'gmp', operator: '>', value: '20' },
  ]);

  const [backtestChartData, setBacktestChartData] = useState(defaultChartData);
  const [performanceMetrics, setPerformanceMetrics] = useState(defaultMetrics);


  const addRule = () => {
    setRules([...rules, { id: Date.now(), feature: 'successProbability', operator: '>', value: '80' }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleRuleChange = (id: number, field: 'feature' | 'operator' | 'value', newValue: string) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, [field]: newValue } : rule));
  };
  
  const onRunBacktest = () => {
    startBacktestTransition(async () => {
      toast({
        title: 'Running Backtest...',
        description: 'Your strategy is being simulated against historical data.',
      });

      const formattedRules = rules.reduce((acc, rule) => {
        // Simple formatter for the demo
        acc[`${rule.feature}_${rule.operator}`] = parseFloat(rule.value);
        return acc;
      }, {} as Record<string, any>);

      const result = await runBacktest({ rules: formattedRules, initialCapital: 100000 });
      
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Backtest Failed',
          description: result.error,
        });
        return;
      }
      
      const newChartData = result.equity_series.map((point: {x:number, y: number}) => ({ x: point.x, strategy: 100000 * point.y, benchmark: 100000 }));
      setBacktestChartData(newChartData);

      setPerformanceMetrics({
        totalReturn: `${result.total_return_pct.toFixed(2)}%`,
        sharpeRatio: result.sharpe ? result.sharpe.toFixed(2) : 'N/A',
        maxDrawdown: result.max_drawdown ? `${result.max_drawdown.toFixed(2)}%` : 'N/A',
        annualizedReturn: 'N/A', // Not provided by this backend
        winRate: 'N/A', // Not provided by this backend
      });

      toast({
        title: 'Backtest Complete',
        description: `${result.n_trades} trades were executed.`,
      });
    });
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    toast({
        title: 'Exporting Data...',
        description: 'Generating your CSV file.',
    });

    const { blob, error, filename } = await exportBacktestResults(backtestChartData, "backtest_results.csv");

    if (error || !blob) {
        toast({
            variant: 'destructive',
            title: 'Export Failed',
            description: error,
        });
    } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast({
            title: 'Export Complete',
            description: 'Your file has been downloaded.',
        });
    }
    setIsExporting(false);
  }

  if (authLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-12 w-1/3 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Strategy Builder
          </h1>
          <p className="text-muted-foreground">
            Create, backtest, and analyze your own IPO investment strategies.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TestTube/> Define Your Strategy</CardTitle>
              <CardDescription>Set the rules for when to invest in an IPO.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Select value={rule.feature} onValueChange={(v) => handleRuleChange(rule.id, 'feature', v)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Feature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="predictionScore">Prediction Score</SelectItem>
                        <SelectItem value="gmp">Grey Market Premium (%)</SelectItem>
                        <SelectItem value="successProbability">Success Probability</SelectItem>
                        <SelectItem value="expectedReturn">Expected Return</SelectItem>
                        <SelectItem value="dealSize">Deal Size (Cr)</SelectItem>
                      </SelectContent>
                    </Select>
                     <Select value={rule.operator} onValueChange={(v) => handleRuleChange(rule.id, 'operator', v)}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">&gt;</SelectItem>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      placeholder="Value" 
                      value={rule.value} 
                      onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                      className="w-[100px]"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4">
                 <Button variant="outline" onClick={addRule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
                <Button onClick={onRunBacktest} disabled={isBacktesting}>
                   <Sparkles className={`mr-2 h-4 w-4 ${isBacktesting ? 'animate-spin' : ''}`} />
                  {isBacktesting ? 'Running...' : 'Run Backtest'}
                </Button>
              </div>
               <p className="text-xs text-muted-foreground pt-4 text-center">Backtesting and data exports are PRO features.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChartIcon />
                  Backtest Results
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                  <Download className={`mr-2 h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
              </CardTitle>
              <CardDescription>Hypothetical performance of the defined strategy.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-60 w-full mb-6">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart data={backtestChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="x" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} label="Trades"/>
                            <YAxis type="number" domain={['auto', 'auto']} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}/>
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Legend />
                            <Line type="monotone" dataKey="strategy" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                             <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className={`text-lg font-bold ${parseFloat(performanceMetrics.totalReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{performanceMetrics.totalReturn}</p>
                    </div>
                     <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-lg font-bold">{performanceMetrics.sharpeRatio}</p>
                    </div>
                     <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-bold text-red-600">{performanceMetrics.maxDrawdown}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
