import type { Ipo } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { PredictionGauge } from './prediction-gauge';

type IpoCardProps = {
  ipo: Ipo;
};

export function IpoCard({ ipo }: IpoCardProps) {
  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="font-headline text-xl">{ipo.companyName}</CardTitle>
            <CardDescription>{ipo.symbol}</CardDescription>
          </div>
          <Image
            src={ipo.logoUrl}
            alt={`${ipo.companyName} logo`}
            width={48}
            height={48}
            className="rounded-full border"
            data-ai-hint="logo"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <PredictionGauge value={ipo.predictionScore} />
            <p className="text-sm font-medium text-muted-foreground">Prediction Score</p>
        </div>
        <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-md text-accent">
                    <Percent className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-bold text-lg">{ipo.successProbability}%</p>
                    <p className="text-xs text-muted-foreground">Success Probability</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-md ${ipo.expectedReturn >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {ipo.expectedReturn >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
                <div>
                    <p className={`font-bold text-lg ${ipo.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>{ipo.expectedReturn.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Expected Return</p>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/ipo/${ipo.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
