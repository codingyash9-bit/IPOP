'use server';

import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { getFirebaseAdmin } from '@/firebase/admin';
import type { Ipo } from '@/lib/types';

export async function runPrediction(ipoId: string): Promise<{ success: boolean; message: string }> {
  // Use the admin SDK on the server-side for privileged access
  const { db } = getFirebaseAdmin();
  const ipoRef = db.collection('ipos').doc(ipoId);

  try {
    const ipoDoc = await ipoRef.get();
    if (!ipoDoc.exists) {
      return { success: false, message: 'IPO not found' };
    }
    const ipo = ipoDoc.data() as Ipo;

    // Prepare the input for the AI prediction flow using data from the existing document.
    const predictionInput = {
        ipoDetails: `Company: ${ipo.companyName}, Industry: ${ipo.industry}, Description: ${ipo.description}`,
        marketConditions: 'Current market sentiment is cautiously optimistic, with the index up 5% in the last month.',
        companyFinancials: `TTM Revenue: ${ipo.revenueTtm}, Profit Margin: ${ipo.profitMargin}%, ROE: ${ipo.roe}%, D/E Ratio: ${ipo.debtToEquity}`
    };
    
    // Simulate a slightly longer AI process for better user feedback on the client
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await generateIpoPrediction(predictionInput);
    
    // Create the updated data object with the new analysis
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

    // Return a success message. The client UI will update automatically via its onSnapshot listener.
    return { success: true, message: 'Prediction updated successfully.' };

  } catch (error) {
    console.error('Prediction failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during prediction.';
    return { success: false, message: errorMessage };
  }
}
