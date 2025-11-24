import type { Ipo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Newspaper, ThumbsDown, ThumbsUp } from 'lucide-react';

type NewsSentimentCardProps = {
  sentiment: NonNullable<Ipo['newsSentiment']>;
};

export function NewsSentimentCard({ sentiment }: NewsSentimentCardProps) {
  const getSentimentBadge = (score: number) => {
    if (score > 0.7)
      return (
        <Badge className="bg-green-600/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-none">
          Very Positive
        </Badge>
      );
    if (score > 0.3)
      return (
        <Badge className="bg-emerald-600/20 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none">
          Positive
        </Badge>
      );
    if (score < -0.7)
      return (
        <Badge variant="destructive" className="bg-red-600/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-none">
          Very Negative
        </Badge>
      );
    if (score < -0.3)
      return (
        <Badge variant="destructive" className="bg-rose-600/20 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-none">
          Negative
        </Badge>
      );
    return <Badge variant="secondary">Neutral</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="text-primary" />
            News & Sentiment
          </div>
          {getSentimentBadge(sentiment.aggregatedScore)}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-green-500">
            <ThumbsUp /> Positive Headlines
          </h3>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {sentiment.positiveHeadlines.length > 0 ? (
              sentiment.positiveHeadlines.map((item, index) => (
                <li key={index}>
                  <span className="font-medium text-foreground">{item.title}</span>{' '}
                  <span className="text-xs">({item.source})</span>
                </li>
              ))
            ) : (
              <li>No significant positive news found.</li>
            )}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-red-500">
            <ThumbsDown /> Negative Headlines
          </h3>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            {sentiment.negativeHeadlines.length > 0 ? (
              sentiment.negativeHeadlines.map((item, index) => (
                <li key={index}>
                  <span className="font-medium text-foreground">{item.title}</span>{' '}
                  <span className="text-xs">({item.source})</span>
                </li>
              ))
            ) : (
              <li>No significant negative news found.</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
