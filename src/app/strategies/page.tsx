'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Download, TestTube, LineChart as LineChartIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- Mock Data ---

const backtestResults = {
  dates: Array.from({ length: 12 }, (_, i) => `2023-${i + 1}-01`),
  strategy: [10000, 10200, 10500, 10300, 10800, 11200, 11500, 11300, 11800, 12200, 12500, 12800],
  benchmark: [10000, 10100, 10200, 10150, 10400, 10600, 10700, 10650, 10900, 11100, 11300, 11500],
};

const chartData = backtestResults.dates.map((date, index) => ({
  date,
  strategy: backtestResults.strategy[index],
  benchmark: backtestResults.benchmark[index],
}));

const chartConfig = {
  strategy: { label: 'My Strategy', color: 'hsl(var(--chart-1))' },
  benchmark: { label: 'Nifty 50 Benchmark', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const performanceMetrics = {
  totalReturn: '28.00%',
  annualizedReturn: '31.50%',
  maxDrawdown: '-4.50%',
  sharpeRatio: '2.15',
  winRate: '75.00%',
};


// --- Main Component ---

export default function StrategiesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [rules, setRules] = useState([
    { id: 1, feature: 'predictionScore', operator: '>', value: '75' },
    { id: 2, feature: 'gmp', operator: '>', value: '20' },
  ]);

  const addRule = () => {
    setRules([...rules, { id: Date.now(), feature: 'successProbability', operator: '>', value: '80' }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter(rule => rule.id !== id));
  };
  
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
            Create, backtest, and analyze your own IPO investment strategies. This is a PRO feature.
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
                {rules.map((rule, index) => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Select defaultValue={rule.feature}>
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
                     <Select defaultValue={rule.operator}>
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Op" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">&gt;</SelectItem>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Value" defaultValue={rule.value} className="w-[100px]"/>
                    <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                      <Trash2 className="h-4 w-4 text-destructive"/>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                 <Button variant="outline" onClick={addRule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
                <Button disabled>
                  Run Backtest
                </Button>
              </div>
               <p className="text-xs text-muted-foreground pt-4 text-center">Backtesting is a PRO feature. Upgrade your plan to run custom simulations.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LineChartIcon />
                  Backtest Results
                </div>
                <Button variant="outline" size="sm" disabled>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardTitle>
              <CardDescription>Hypothetical performance of the defined strategy (mock data).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-60 w-full mb-6">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                            <YAxis type="number" domain={['dataMin - 500', 'dataMax + 500']} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}/>
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Line type="monotone" dataKey="strategy" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                             <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm text-muted-foreground">Total Return</p>
                        <p className="text-lg font-bold text-green-600">{performanceMetrics.totalReturn}</p>
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
