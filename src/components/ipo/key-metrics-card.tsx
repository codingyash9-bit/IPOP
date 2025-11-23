'use client';
import type { Ipo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  LineChart,
  Users,
  Wallet,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';

type KeyMetricsCardProps = {
  ipo: Ipo;
};

const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);

const subscriptionChartConfig = {
  qib: { label: 'QIB', color: 'hsl(var(--chart-1))' },
  nii: { label: 'NII', color: 'hsl(var(--chart-2))' },
  retail: { label: 'Retail', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export function KeyMetricsCard({ ipo }: KeyMetricsCardProps) {
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setClientReady(true);
  }, []);

  if (!clientReady) {
    return <div className="w-full h-96 animate-pulse bg-muted rounded-lg" />;
  }
  
  const subscriptionData = [
    {
      label: 'Subscription',
      qib: ipo.qibSubscription,
      nii: ipo.niiSubscription,
      retail: ipo.retailSubscription,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="text-primary" /> Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Metrics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Wallet /> Financials
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <MetricItem
              label="Revenue (TTM)"
              value={formatCompact(ipo.revenueTtm)}
            />
            <MetricItem
              label="Profit Margin"
              value={`${ipo.profitMargin.toFixed(1)}%`}
              isPositive={ipo.profitMargin >= 0}
            />
            <MetricItem
              label="Return on Equity"
              value={`${ipo.roe.toFixed(1)}%`}
              isPositive={ipo.roe >= 0}
            />
            <MetricItem
              label="Debt-to-Equity"
              value={ipo.debtToEquity.toFixed(2)}
              isPositive={ipo.debtToEquity < 1}
            />
          </div>
          <Separator />
          <div className="space-y-2">
             <h3 className="font-semibold text-lg flex items-center gap-2">
                <Activity/> Market Sentiment
            </h3>
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Grey Market Premium (GMP)</span>
                 <Badge variant={ipo.gmp >= 0 ? 'default' : 'destructive'} className="bg-green-600/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-none">
                    {ipo.gmp >= 0 ? <ArrowUp className="mr-1 h-3 w-3"/> : <ArrowDown className="mr-1 h-3 w-3"/>}
                    {ipo.gmp}%
                </Badge>
            </div>
          </div>
        </div>

        {/* Subscription Metrics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users /> Subscription (times)
          </h3>
          <div className="w-full h-40">
            <ChartContainer
              config={subscriptionChartConfig}
              className="h-full w-full"
            >
              <BarChart
                accessibilityLayer
                data={subscriptionData}
                layout="vertical"
                margin={{ left: 0, top: 0, right: 20, bottom: 0 }}
              >
                <YAxis dataKey="label" type="category" tick={false} hide />
                <XAxis dataKey="qib" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <Bar dataKey="qib" name="QIB" radius={5} barSize={24}>
                    <YAxis dataKey="nii" type="category" tick={false} hide />
                    <XAxis dataKey="nii" type="number" hide />
                    <Bar dataKey="nii" name="NII" radius={5} barSize={24} />
                    <YAxis dataKey="retail" type="category" tick={false} hide />
                    <XAxis dataKey="retail" type="number" hide />
                    <Bar dataKey="retail" name="Retail" radius={5} barSize={24} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <MetricItem label="QIB" value={`${ipo.qibSubscription.toFixed(1)}x`}/>
              <MetricItem label="NII" value={`${ipo.niiSubscription.toFixed(1)}x`}/>
              <MetricItem label="Retail" value={`${ipo.retailSubscription.toFixed(1)}x`}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string | number;
  isPositive?: boolean;
}) {
  const valueColor =
    isPositive === undefined
      ? 'text-foreground'
      : isPositive
      ? 'text-green-600 dark:text-green-500'
      : 'text-red-600 dark:text-red-500';

  return (
    <div className="flex flex-col gap-1 p-2 rounded-md bg-muted/50">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-bold text-lg ${valueColor}`}>{value}</span>
    </div>
  );
}
