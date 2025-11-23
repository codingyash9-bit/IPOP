'use client';
import { useAuth } from '@/hooks/use-auth';
import { LoginPage } from '@/components/auth/login-page';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, Bell, Bot, Calendar, FileWarning, LineChart, TrendingUp } from 'lucide-react';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart as RechartsAreaChart, Bar, BarChart as RechartsBarChart, Line, LineChart as RechartsLineChart, XAxis, YAxis, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- Mock Data ---

const modelPerformanceHistory = [
  { date: '2024-07-01', auc: 0.82, 'mae%': 8.5 },
  { date: '2024-07-08', auc: 0.81, 'mae%': 8.7 },
  { date: '2024-07-15', auc: 0.83, 'mae%': 8.4 },
  { date: '2024-07-22', auc: 0.79, 'mae%': 9.1 },
  { date: '2024-07-29', auc: 0.78, 'mae%': 9.5 },
];

const dataDriftData = [
    { feature: 'gmp_score', psi: 0.08, status: 'Normal' },
    { feature: 'qib_subscription_rate', psi: 0.15, status: 'Warning' },
    { feature: 'sector_return_30d', psi: 0.28, status: 'Alert' },
    { feature: 'revenue_cagr_3y', psi: 0.05, status: 'Normal' },
    { feature: 'promoter_holding_pct_after', psi: 0.02, status: 'Normal' },
];

const alertHistory = [
    { id: 1, time: '2024-07-29 10:00', type: 'Data Drift', message: 'High drift detected in `sector_return_30d` (PSI=0.28)', status: 'Alert' },
    { id: 2, time: '2024-07-29 08:00', type: 'Model Retraining', message: 'Model v1.3.1 promoted to production. AUC improved by 3%.', status: 'Info' },
    { id: 3, time: '2024-07-28 14:00', type: 'Model Performance', message: 'Regression MAE increased by 15% WoW.', status: 'Warning' },
    { id: 4, time: '2024-07-27 09:00', type: 'Data Ingestion', message: 'Daily data ingestion pipeline failed.', status: 'Alert' },
];

const lastRetraining = {
    date: '2024-07-29 08:00',
    newVersion: 'v1.3.1',
    trigger: 'Scheduled (Weekly)',
    previousAuc: 0.79,
    newAuc: 0.82,
}

// --- Chart Configurations ---

const performanceChartConfig = {
  auc: { label: "AUC", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const driftChartConfig = {
  psi: { label: "PSI", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


// --- Main Component ---

export default function MonitoringPage() {
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
            Model Monitoring
          </h1>
          <p className="text-muted-foreground">
            Live metrics for data drift, model performance, and system health.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp/> Classification Performance</CardTitle>
                    <CardDescription>Weekly AUC for listing day success prediction.</CardDescription>
                </CardHeader>
                <CardContent className="h-40">
                    <ChartContainer config={performanceChartConfig} className="h-full w-full">
                        <RechartsAreaChart data={modelPerformanceHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                            <YAxis type="number" domain={[0.7, 0.9]} tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Area type="monotone" dataKey="auc" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1), 0.2)" strokeWidth={2} dot={true} />
                        </RechartsAreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileWarning/> Data Drift (PSI)</CardTitle>
                    <CardDescription>Population Stability Index for key features.</CardDescription>
                </CardHeader>
                <CardContent className="h-40">
                   <ChartContainer config={driftChartConfig} className="h-full w-full">
                        <RechartsBarChart data={dataDriftData} layout="vertical" margin={{ top: 0, right: 20, left: -10, bottom: -10 }}>
                             <YAxis dataKey="feature" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={140}/>
                             <XAxis type="number" domain={[0, 0.4]} hide/>
                            <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="psi" radius={4}>
                                {dataDriftData.map((item) => (
                                    <Cell key={item.feature} fill={item.status === 'Alert' ? 'hsl(var(--destructive))' : item.status === 'Warning' ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-2))'} />
                                ))}
                            </Bar>
                        </RechartsBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot/> Last Retraining Run</CardTitle>
                    <CardDescription>Details of the latest automated model training.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Trigger Time:</span> <span className="font-medium">{lastRetraining.date}</span></div>
                    <div className="flex justify-between"><span>New Version:</span> <Badge variant="secondary">{lastRetraining.newVersion}</Badge></div>
                    <div className="flex justify-between items-center">
                        <span>AUC Change:</span> 
                        <span className="font-medium text-green-600 flex items-center gap-1">
                            {lastRetraining.previousAuc.toFixed(2)} → {lastRetraining.newAuc.toFixed(2)}
                            <TrendingUp className="h-4 w-4"/>
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell/> Recent Alerts & Events</CardTitle>
                <CardDescription>Log of automated monitoring alerts and system events.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[150px]">Type</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {alertHistory.map((alert) => (
                            <TableRow key={alert.id}>
                                <TableCell className="font-medium">{alert.time}</TableCell>
                                <TableCell>
                                    <Badge variant={alert.status === 'Alert' ? 'destructive' : alert.status === 'Warning' ? 'secondary' : 'default'} className={alert.status === 'Warning' ? 'bg-yellow-500/20 text-yellow-700 border-none' : ''}>
                                        {alert.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{alert.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
