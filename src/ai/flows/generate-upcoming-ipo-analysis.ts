'use server';

/**
 * @fileOverview An advanced AI flow to conduct a comprehensive analysis of upcoming IPOs.
 *
 * - generateUpcomingIpoAnalysis - The main function that executes the full research pipeline.
 * - UpcomingIpoAnalysisInput - The input schema for the analysis.
 * - UpcomingIpoAnalysisOutput - The detailed 19-point output schema for the analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const UpcomingIpoAnalysisInputSchema = z.object({
  companyName: z.string().describe('The name of the company for the IPO analysis.'),
  industry: z.string().describe('The industry and sector the company operates in.'),
});
export type UpcomingIpoAnalysisInput = z.infer<typeof UpcomingIpoAnalysisInputSchema>;

export const UpcomingIpoAnalysisOutputSchema = z.object({
  ipoSummary: z.object({
    companyName: z.string(),
    industryAndSegment: z.string(),
    issueType: z.string(),
    totalIssueSize: z.string().describe('In ₹ Cr'),
    priceBand: z.string(),
    lotSizeAndMinInvestment: z.string(),
    issueOpenCloseDates: z.string(),
    expectedListingDate: z.string(),
    listingExchange: z.string(),
    brlms: z.string(),
    registrar: z.string(),
    quotas: z.string().describe('QIB/NII/Retail quotas'),
  }),
  realTimeMarketTrend: z.object({
    ipoMarketMood: z.string(),
    fiiDiiActivity: z.string(),
    sectorSentiment: z.string(),
    globalCues: z.string(),
    indiaVixTrend: z.string(),
    liquidityConditions: z.string(),
    impactOnThisIpo: z.string(),
  }),
  deepCompanyAnalysis: z.object({
    businessModel: z.string(),
    customerSegmentsAndGeography: z.string(),
    promoterBackground: z.string(),
    corporateGovernanceCheck: z.string(),
    competitiveAdvantages: z.string(),
  }),
  industryAndCompetitorAnalysis: z.object({
    industrySizeAndCAGR: z.string(),
    majorCompetitors: z.string(),
    marketShareComparison: z.string(),
    swotAnalysis: z.string(),
    regulatoryEnvironment: z.string(),
  }),
  fullFinancialAnalysis: z.object({
    growthMetrics: z.string().describe('Revenue, EBITDA, Net Profit for 3-5 years'),
    ratios: z.string().describe('ROE, ROCE'),
    cashFlowAndDebt: z.string().describe('Free cash flow, Debt-to-Equity'),
    auditorNotes: z.string(),
  }),
  advancedValuationAnalysis: z.object({
    metrics: z.string().describe('P/E, EV/EBITDA, P/B'),
    comparisonWithPeers: z.string(),
    verdict: z.string().describe('Undervalued, Fairly valued, Overpriced'),
  }),
  anchorInvestorQualityCheck: z.object({
    anchorInvestorsList: z.string(),
    anchorStrengthAnalysis: z.string(),
  }),
  subscriptionTrendAnalysis: z.object({
    subscriptionFigures: z.string().describe('QIB, NII, Retail'),
    sentimentImpact: z.string(),
  }),
  gmpAnalysis: z.object({
    latestGmp: z.string().describe('In ₹ and %'),
    gmpTrend: z.string(),
    gmpReliabilityScore: z.string(),
  }),
  preIpoPlacements: z.object({
    investors: z.string(),
    priceVsIpo: z.string(),
    lockInExpiry: z.string(),
  }),
  utilizationOfIpoProceeds: z.object({
    usageDetails: z.string().describe('Debt repayment, Capex, Working capital'),
    promoterOFS: z.string(),
    growthImpact: z.string(),
  }),
  deepRiskAnalysis: z.object({
    keyRisks: z.string().describe('Competition, Regulatory, Valuation, etc.'),
    riskScore: z.string().describe('Out of 10'),
  }),
  sentimentAnalysisAI: z.object({
    retailBuzz: z.string(),
    analystSentiment: z.string(),
    marketFearGreed: z.string(),
  }),
  comparisonWithPastIpos: z.object({
    similarIpos: z.string(),
    expectedBehavior: z.string(),
  }),
  smartLotAllocationStrategy: z.object({
    allotmentProbability: z.string(),
    timingAndStrategy: z.string(),
  }),
  postListingStrategy: z.object({
    sellOnListing: z.string(),
    swingTrade: z.string(),
    longTermHold: z.string(),
  }),
  uniformScoringModel: z.object({
    financialStrengthScore: z.string().describe('/10'),
    valuationScore: z.string().describe('/10'),
    sectorAndSentimentScore: z.string().describe('/10'),
    riskScore: z.string().describe('/10'),
    finalIpoScore: z.string().describe('/100'),
  }),
  finalInvestmentVerdict: z.object({
    listingGainTraders: z.string(),
    swingShortTerm: z.string(),
    longTermInvestors: z.string(),
  }),
  finalSummary: z.string().describe('A 5-6 line summary with a clear conclusion.'),
});
export type UpcomingIpoAnalysisOutput = z.infer<typeof UpcomingIpoAnalysisOutputSchema>;

const prompt = ai.definePrompt({
    name: 'advancedIpoAnalystPrompt',
    input: { schema: UpcomingIpoAnalysisInputSchema },
    output: { schema: UpcomingIpoAnalysisOutputSchema },
    prompt: `You are an Advanced Indian IPO Investment Analyst AI. Your knowledge is based on real-time simulated data from major financial portals as of late 2024.

TASK: Execute a full, end-to-end research pipeline for the upcoming IPO of {{{companyName}}} in the {{{industry}}} sector.

Instructions:
1.  **Simulate Data Fetching**: Act as if you have fetched all required data from NSE, BSE, SEBI, RHP/DRHP PDFs, Moneycontrol, LiveMint, Chittorgarh, etc.
2.  **Fact-Based Analysis**: Your entire analysis must be based on plausible, simulated data for the given company. Do NOT invent unrealistic numbers. Cross-check your simulated data points for consistency.
3.  **Strict Output Format**: You must populate every single field in the 19-point JSON output structure. Do not skip any fields.

Begin the analysis for {{{companyName}}}.`,
});


const generateUpcomingIpoAnalysisFlow = ai.defineFlow(
  {
    name: 'generateUpcomingIpoAnalysisFlow',
    inputSchema: UpcomingIpoAnalysisInputSchema,
    outputSchema: UpcomingIpoAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateUpcomingIpoAnalysis(input: UpcomingIpoAnalysisInput): Promise<UpcomingIpoAnalysisOutput> {
    return generateUpcomingIpoAnalysisFlow(input);
}
