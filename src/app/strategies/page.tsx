'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, BrainCircuit, Bot, AreaChart, Wallet, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon, Target } from 'lucide-react';
import { useState, useTransition } from 'react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { runBacktest } from './actions';
import type { BacktestOutput } from '@/ai/flows/run-backtest-types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

type Rule = {
  id: string;
  metric: 'rsi' | 'moving_average' | 'pe_ratio' | 'gmp';
  condition: 'less_than' | 'greater_than';
  value: string;
  action: 'buy' | 'sell';
};

const METRIC_OPTIONS = {
  rsi: 'RSI (14-day)',
  moving_average: '50-day Moving Avg.',
  pe_ratio: 'P/E Ratio',
  gmp: 'Grey Market Premium (%)',
};

const CONDITION_OPTIONS = {
  less_than: '< Less Than',
  greater_than: '> Greater Than',
};

const ACTION_OPTIONS = {
  buy: 'Buy',
  sell: 'Sell',
};

const INITIAL_RULES: Rule[] = [
    { id: 'rule1', metric: 'rsi', condition: 'less_than', value: '30', action: 'buy' },
    { id: 'rule2', metric: 'rsi', condition: 'greater_than', value: '70', action: 'sell' },
]

const chartConfig = {
    equity: { label: "Strategy", color: "hsl(var(--chart-1))" },
    benchmark: { label: "Benchmark", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


export default function StrategiesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [backtestResult, setBacktestResult] = useState<BacktestOutput | null>(null);
  const [backtestChartData, setBacktestChartData] = useState<any[]>([]);
  const [isBacktestRunning, startBacktestTransition] = useTransition();
  const { toast } = useToast();

  const addRule = () => {
    setRules([...rules, { id: `rule${Date.now()}`, metric: 'rsi', condition: 'less_than', value: '0', action: 'buy' }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = <K extends keyof Rule>(id: string, field: K, value: Rule[K]) => {
    setRules(rules.map(rule => rule.id === id ? { ...rule, [field]: value } : rule));
  };
  
  const onRunBacktest = () => {
    const formattedRules = rules.reduce((acc, rule) => {
      acc[rule.id] = `${rule.action.toUpperCase()}: When ${METRIC_OPTIONS[rule.metric]} is ${rule.condition === 'greater_than' ? '>' : '<'} ${rule.value}`;
      return acc;
    }, {} as Record<string, string>);

    startBacktestTransition(async () => {
        const result = await runBacktest({ rules: formattedRules, initialCapital: 100000 });
        if ('error' in result) {
             toast({
                variant: 'destructive',
                title: 'Backtest Failed',
                description: result.error,
            });
            setBacktestResult(null);
            setBacktestChartData([]);
        } else {
            setBacktestResult(result);
            const initialEquity = 100000;
            const chartData = result.equitySeries.map((point: any, index: number) => ({
                ...point,
                benchmark: initialEquity * (1 + (index * 0.0008)) // Simulate NIFTY-like returns
            }));
            setBacktestChartData(chartData);
            toast({
                title: 'Backtest Complete',
                description: 'Your strategy has been successfully backtested.',
            });
        }
    });
  }

  if (authLoading) {
    return (
      <AppShell>
        <div className="p-8 space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
        </div>
      </AppShell>
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
            Strategy Backtester
          </h1>
          <p className="text-muted-foreground">
            Design and test your IPO trading strategies using our AI-powered engine.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="sticky top-24">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Define Your Strategy</CardTitle>
                    <CardDescription>Create rules to define your custom trading logic.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {rules.map((rule, index) => (
                            <div key={rule.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-2 rounded-lg bg-muted/50">
                                <p className="md:col-span-5 text-xs font-semibold text-muted-foreground">RULE {index + 1}</p>
                                <Select value={rule.metric} onValueChange={(v: Rule['metric']) => updateRule(rule.id, 'metric', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{Object.entries(METRIC_OPTIONS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={rule.condition} onValueChange={(v: Rule['condition']) => updateRule(rule.id, 'condition', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{Object.entries(CONDITION_OPTIONS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                                </Select>
                                <Input type="number" value={rule.value} onChange={(e) => updateRule(rule.id, 'value', e.target.value)} placeholder="Value"/>
                                <Select value={rule.action} onValueChange={(v: Rule['action']) => updateRule(rule.id, 'action', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{Object.entries(ACTION_OPTIONS).map(([k,v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></Button>
                            </div>
                        ))}
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={addRule}><Plus className="mr-2"/> Add Rule</Button>
                            <Button onClick={onRunBacktest} disabled={isBacktestRunning}>
                                <Bot className={`mr-2 ${isBacktestRunning ? 'animate-spin' : ''}`}/>
                                {isBacktestRunning ? 'Running Backtest...' : 'Run Backtest'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AreaChart className="text-primary"/> Backtest Results</CardTitle>
                    <CardDescription>Performance of your strategy over a simulated 2-year period.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isBacktestRunning && (
                        <div className="space-y-4">
                            <Skeleton className="h-56 w-full" />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </div>
                    )}
                    {!isBacktestRunning && !backtestResult && (
                        <div className="flex flex-col items-center justify-center text-center h-80 rounded-lg bg-muted/50 p-8">
                            <Bot size={48} className="text-muted-foreground/50 mb-4"/>
                            <h3 className="font-bold text-lg">Run a backtest to see results</h3>
                            <p className="text-muted-foreground text-sm">Define your rules and click "Run Backtest" to see your strategy's performance.</p>
                        </div>
                    )}
                     {backtestResult && (
                        <div className="space-y-4">
                            <ChartContainer config={chartConfig} className="h-56 w-full">
                                <RechartsAreaChart
                                    accessibilityLayer
                                    data={backtestChartData}
                                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                                        </linearGradient>
                                         <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10}/>
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN', { notation: 'compact' })}`}/>
                                    <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                                    <Area type="monotone" dataKey="equity" strokeWidth={2} stroke="hsl(var(--chart-1))" fill="url(#colorEquity)" />
                                    <Area type="monotone" dataKey="benchmark" strokeWidth={2} strokeDasharray="3 3" stroke="hsl(var(--chart-2))" fill="url(#colorBenchmark)" />
                                </RechartsAreaChart>
                            </ChartContainer>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ResultMetricCard title="Total Return" value={`${backtestResult.totalReturn.toFixed(2)}%`} icon={TrendingUpIcon} isPositive={backtestResult.totalReturn > 0} />
                                <ResultMetricCard title="Final Equity" value={`₹${backtestResult.finalEquity.toLocaleString('en-IN')}`} icon={Wallet} />
                                <ResultMetricCard title="Sharpe Ratio" value={backtestResult.sharpeRatio.toFixed(2)} icon={Target} isPositive={backtestResult.sharpeRatio > 1} />
                                <ResultMetricCard title="Max Drawdown" value={`${backtestResult.maxDrawdown.toFixed(2)}%`} icon={TrendingDownIcon} isPositive={false} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </AppShell>
  );
}

function ResultMetricCard({title, value, icon: Icon, isPositive}: {title: string; value: string; icon: React.ElementType; isPositive?: boolean}) {
    const valueColor =
    isPositive === undefined
      ? 'text-foreground'
      : isPositive
      ? 'text-green-600 dark:text-green-500'
      : 'text-red-600 dark:text-red-500';

    return (
        <Card className="p-4 flex flex-col justify-center">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Icon size={14}/> {title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </Card>
    )
}
