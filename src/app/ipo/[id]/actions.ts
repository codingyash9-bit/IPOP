'use server';

import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { getFirebaseAdmin } from '@/firebase/admin';
import type { Ipo } from '@/lib/types';
import { getDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { getFirestore } from "firebase-admin/firestore";


export async function runPrediction(ipoId: string): Promise<Partial<Ipo> | { error: string }> {
  // Use the admin SDK on the server-side for privileged access
  const { db } = getFirebaseAdmin();
  const ipoRef = db.collection('ipos').doc(ipoId);

  try {
    const ipoDoc = await ipoRef.get();
    if (!ipoDoc.exists) {
      return { error: 'IPO not found' };
    }
    const ipo = ipoDoc.data() as Ipo;

    // In a real app, you might pull fresh financial data here.
    // For this demo, we use the existing data from the IPO object to call the flows.
    const predictionInput = {
        ipoDetails: `Company: ${ipo.companyName}, Industry: ${ipo.industry}, Description: ${ipo.description}`,
        marketConditions: 'Current market sentiment is cautiously optimistic, with the index up 5% in the last month.',
        companyFinancials: `TTM Revenue: ${ipo.revenueTtm}, Profit Margin: ${ipo.profitMargin}%, ROE: ${ipo.roe}%, D/E Ratio: ${ipo.debtToEquity}`
    };
    
    // Simulate a slightly longer AI process for better user feedback
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await generateIpoPrediction(predictionInput);
    
    // Create the updated data object
    const updatedData: Partial<Ipo> = {
        predictionScore: result.predictionScore,
        successProbability: result.probabilityOfSuccess,
        expectedReturn: result.expectedReturn,
        shapExplanations: result.shapExplanations,
        naturalLanguageExplanation: result.naturalLanguageExplanation,
        newsSentiment: result.newsSentiment,
    };

    // Update the document in Firestore using the admin SDK
    await ipoRef.update(updatedData);

    // Return the new data to the client if needed, though the client will update via snapshot
    return updatedData;

  } catch (error) {
    console.error('Prediction failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during prediction.';
    return { error: errorMessage };
  }
}
