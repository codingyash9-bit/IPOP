'use server';

import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { ipos } from '@/lib/ipo-data';
import type { Ipo } from '@/lib/types';

export async function runPrediction(ipoId: string): Promise<Partial<Ipo> | { error: string }> {
  const ipo = ipos.find((i) => i.id === ipoId);
  if (!ipo) {
    return { error: 'IPO not found' };
  }

  try {
    // In a real app, you'd pull fresh data here.
    // For this demo, we use mock data from the IPO object to call the flows.
    const predictionInput = {
        ipoDetails: `Company: ${ipo.companyName}, Industry: ${ipo.industry}, Description: ${ipo.description}`,
        marketConditions: 'Current market sentiment is cautiously optimistic, with the index up 5% in the last month.',
        companyFinancials: `TTM Revenue: ${ipo.revenueTtm}, Profit Margin: ${ipo.profitMargin}%, ROE: ${ipo.roe}%, D/E Ratio: ${ipo.debtToEquity}`
    };
    
    // Simulate a slightly longer AI process
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await generateIpoPrediction(predictionInput);
    
    // In a real app, you'd save this to a database.
    // Here, we just return the new data to be updated in the client state.
    return {
        predictionScore: result.predictionScore,
        successProbability: result.probabilityOfSuccess,
        expectedReturn: result.expectedReturn,
        shapExplanations: result.shapExplanations,
    };

  } catch (error) {
    console.error('Prediction failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during prediction.';
    return { error: errorMessage };
  }
}
