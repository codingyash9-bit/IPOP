'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, AreaChart, PieChart, Info, TrendingUp, TrendingDown, Target, HelpCircle } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Line, LineChart as RechartsLineChart, Area, AreaChart as RechartsAreaChart, Pie, PieChart as RechartsPieChart, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';

// --- Mock Data ---

const modelPerformanceData = {
  classification: {
    auc: 0.82,
    precision: 0.75,
    recall: 0.78,
    f1: 0.76,
  },
  regression: {
    mae: 8.5,
    rmse: 12.3,
    r2: 0.65,
  },
  trainingDate: '2024-07-28',
  dataRange: '2022-01-01 to 2024-06-30',
};

const backtestResults = {
  strategyA: {
    totalReturn: 45.2,
    annualizedReturn: 21.5,
    sharpeRatio: 1.8,
    maxDrawdown: -15.8,
    winRate: 0.68,
  },
  strategyB: {
    totalReturn: 78.5,
    annualizedReturn: 35.1,
    sharpeRatio: 2.5,
    maxDrawdown: -10.2,
    winRate: 0.82,
  },
};

const returnHistoryData = [
  { date: '2023-01', "Strategy A": 100, "Strategy B": 100 },
  { date: '2023-02', "Strategy A": 102, "Strategy B": 105 },
  { date: '2023-03', "Strategy A": 105, "Strategy B": 110 },
  { date: '2023-04', "Strategy A": 103, "Strategy B": 108 },
  { date: '2023-05', "Strategy A": 110, "Strategy B": 120 },
  { date: '2023-06', "Strategy A": 115, "Strategy B": 125 },
  { date: '2023-07', "Strategy A": 112, "Strategy B": 122 },
  { date: '2023-08', "Strategy A": 120, "Strategy B": 135 },
  { date: '2023-09', "Strategy A": 125, "Strategy B": 145 },
  { date: '2023-10', "Strategy A": 130, "Strategy B": 155 },
  { date: '2023-11', "Strategy A": 140, "Strategy B": 170 },
  { date: '2023-12', "Strategy A": 145.2, "Strategy B": 178.5 },
];

const featureImportanceData = [
    { name: 'gmp_score', value: 0.35, fill: 'hsl(var(--chart-1))' },
    { name: 'qib_subscription_rate', value: 0.25, fill: 'hsl(var(--chart-2))' },
    { name: 'sector_return_30d', value: 0.15, fill: 'hsl(var(--chart-3))' },
    { name: 'promoter_holding_pct_after', value: 0.10, fill: 'hsl(var(--chart-4))' },
    { name: 'revenue_cagr_3y', value: 0.08, fill: 'hsl(var(--chart-5))' },
    { name: 'other', value: 0.07, fill: 'hsl(var(--muted))' },
];

// --- Chart Configurations ---

const lineChartConfig = {
  "Strategy A": { label: "Strategy A", color: "hsl(var(--chart-2))" },
  "Strategy B": { label: "Strategy B (AI-Powered)", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const pieChartConfig = {
    value: { label: "Importance" },
    ...featureImportanceData.reduce((acc, cur) => ({...acc, [cur.name]: {label: cur.name, color: cur.fill}}), {})
} satisfies ChartConfig;


// --- Main Component ---

export default function AnalysisPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-12 w-1/3 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-96 animate-pulse rounded-lg bg-muted" />
            <div className="lg:col-span-2 h-96 animate-pulse rounded-lg bg-muted" />
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
            Model & Backtest Analysis
          </h1>
          <p className="text-muted-foreground">
            Performance metrics for the prediction models and backtested strategies.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target /> Classification Model</CardTitle>
                    <CardDescription>Predicts if listing price will go up or down.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <MetricDisplay label="AUC" value={modelPerformanceData.classification.auc.toFixed(2)} />
                    <MetricDisplay label="F1-Score" value={modelPerformanceData.classification.f1.toFixed(2)} />
                    <MetricDisplay label="Precision" value={modelPerformanceData.classification.precision.toFixed(2)} />
                    <MetricDisplay label="Recall" value={modelPerformanceData.classification.recall.toFixed(2)} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Regression Model</CardTitle>
                    <CardDescription>Predicts the percentage change on listing day.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <MetricDisplay label="R² Score" value={modelPerformanceData.regression.r2.toFixed(2)} />
                    <MetricDisplay label="RMSE" value={`${modelPerformanceData.regression.rmse.toFixed(1)}%`} />
                    <MetricDisplay label="MAE" value={`${modelPerformanceData.regression.mae.toFixed(1)}%`} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info /> Model Details</CardTitle>
                    <CardDescription>Training and data version information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Training Date:</span> <span className="font-medium">{modelPerformanceData.trainingDate}</span></div>
                    <div className="flex justify-between"><span>Data Range:</span> <span className="font-medium">{modelPerformanceData.dataRange}</span></div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LineChart/> Backtest: Strategy Performance</CardTitle>
                <CardDescription>Simulated equity curve of trading strategies over the backtest period.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-80">
                    <ChartContainer config={lineChartConfig} className="h-full w-full">
                        <RechartsLineChart data={returnHistoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                             <YAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Line type="monotone" dataKey="Strategy A" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="Strategy B" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart/> Feature Importance</CardTitle>
                    <CardDescription>Top factors driving model predictions.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <ChartContainer config={pieChartConfig} className="h-64 w-full">
                        <RechartsPieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                            <Pie data={featureImportanceData} dataKey="value" nameKey="name" innerRadius={50}>
                                {featureImportanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </RechartsPieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <StrategyCard title="Strategy A: Baseline" description="Buy all IPOs, hold for 7 days." results={backtestResults.strategyA} />
                <StrategyCard title="Strategy B: AI-Powered" description="Buy if prob > 60%, hold 7 days." results={backtestResults.strategyB} isAI={true}/>
            </div>
        </div>

      </div>
    </AppShell>
  );
}

// --- Sub Components ---

function MetricDisplay({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col gap-1 p-2 rounded-md bg-muted/50">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-bold text-lg text-foreground">{value}</span>
        </div>
    );
}

function StrategyCard({ title, description, results, isAI = false }: { title: string, description: string, results: typeof backtestResults.strategyA, isAI?: boolean }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">{title}</span>
                    {isAI && <Badge>AI</Badge>}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <MetricDisplay label="Total Return" value={`${results.totalReturn.toFixed(1)}%`} />
                <MetricDisplay label="Annualized Return" value={`${results.annualizedReturn.toFixed(1)}%`} />
                <MetricDisplay label="Sharpe Ratio" value={results.sharpeRatio.toFixed(1)} />
                <MetricDisplay label="Max Drawdown" value={`${results.maxDrawdown.toFixed(1)}%`} />
            </CardContent>
        </Card>
    );
}
