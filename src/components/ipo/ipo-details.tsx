import { ipos } from '@/lib/ipo-data';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowLeft, Briefcase, Calendar, Info, BarChart2, DollarSign, Tag, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ShapChart } from './shap-chart';
import { PredictionGauge } from './prediction-gauge';
import Image from 'next/image';

type IpoDetailsProps = {
  ipoId: string;
};

export function IpoDetails({ ipoId }: IpoDetailsProps) {
  const ipo = ipos.find((i) => i.id === ipoId);

  if (!ipo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold">IPO Not Found</h2>
        <p className="text-muted-foreground">The IPO you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <header className="flex items-center gap-4">
         <Image
            src={ipo.logoUrl}
            alt={`${ipo.companyName} logo`}
            width={64}
            height={64}
            className="rounded-full border"
            data-ai-hint="logo"
          />
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{ipo.companyName} ({ipo.symbol})</h1>
          <p className="text-muted-foreground">{ipo.industry}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Info className="text-primary"/> About the Company</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{ipo.description}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 className="text-primary"/> AI Prediction Analysis</CardTitle>
                    <CardDescription>Factors influencing the AI prediction score.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ShapChart data={ipo.shapExplanations} />
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">AI Prediction</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <PredictionGauge value={ipo.predictionScore} size={140} strokeWidth={12} />
                    <div className="w-full grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{ipo.successProbability}%</p>
                            <p className="text-sm opacity-80">Success Probability</p>
                        </div>
                         <div>
                            <p className="text-2xl font-bold">{ipo.expectedReturn.toFixed(1)}%</p>
                            <p className="text-sm opacity-80">Expected Return</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase className="text-primary"/> Deal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> IPO Date</span>
                        <span className="font-medium">{new Date(ipo.ipoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <Separator/>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4"/> Price Range</span>
                        <span className="font-medium">${ipo.priceRange[0]} - ${ipo.priceRange[1]}</span>
                    </div>
                     <Separator/>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Tag className="w-4 h-4"/> Market</span>
                        <span className="font-medium">{ipo.market}</span>
                    </div>
                     <Separator/>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4"/> Deal Size</span>
                        <span className="font-medium">{formatCurrency(ipo.dealSize)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
