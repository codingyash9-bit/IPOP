export interface Ipo {
  id: string;
  companyName: string;
  symbol: string;
  logoUrl: string;
  market: string;
  ipoDate: string;
  priceRange: [number, number];
  sharesOffered: number;
  dealSize: number;
  description: string;
  industry: string;
  // AI Generated Data
  predictionScore: number;
  successProbability: number;
  expectedReturn: number;
  shapExplanations: Record<string, number>;
  naturalLanguageExplanation: string;
  newsSentiment?: {
    aggregatedScore: number;
    positiveHeadlines: { source: string; title: string }[];
    negativeHeadlines: { source: string; title: string }[];
  };
  // Engineered Features
  promoterHoldingPost: number;
  revenueTtm: number;
  profitMargin: number;
  roe: number;
  debtToEquity: number;
  qibSubscription: number;
  niiSubscription: number;
  retailSubscription: number;
  gmp: number;
}
