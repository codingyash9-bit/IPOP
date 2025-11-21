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
}
