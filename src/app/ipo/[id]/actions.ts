'use server';

import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { getFirebaseAdmin } from '@/firebase/admin';
import type { Ipo } from '@/lib/types';

export async function runPrediction(ipoId: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Server Action] Starting prediction for IPO ID: ${ipoId}`);
  
  // Use the admin SDK on the server-side for privileged access
  const { db } = getFirebaseAdmin();
  const ipoRef = db.collection('ipos').doc(ipoId);

  try {
    const ipoDoc = await ipoRef.get();
    if (!ipoDoc.exists) {
      console.error(`[Server Action] IPO with ID ${ipoId} not found in Firestore.`);
      return { success: false, message: 'IPO not found' };
    }
    const ipo = ipoDoc.data() as Ipo;
    console.log(`[Server Action] Found IPO: ${ipo.companyName}`);

    // Prepare the input for the AI prediction flow using data from the existing document.
    const predictionInput = {
        ipoDetails: `Company: ${ipo.companyName}, Industry: ${ipo.industry}, Description: ${ipo.description}`,
        marketConditions: 'Current market sentiment is cautiously optimistic, with the index up 5% in the last month.',
        companyFinancials: `TTM Revenue: ${ipo.revenueTtm}, Profit Margin: ${ipo.profitMargin}%, ROE: ${ipo.roe}%, D/E Ratio: ${ipo.debtToEquity}`
    };
    
    console.log('[Server Action] Calling generateIpoPrediction flow with input:', predictionInput);
    
    // This is the call that interacts with the Google AI platform.
    const result = await generateIpoPrediction(predictionInput);
    
    console.log('[Server Action] Received AI analysis result:', result);
    
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
    console.log(`[Server Action] Updating Firestore document for ${ipo.companyName}...`);
    await ipoRef.update(updatedData);
    console.log(`[Server Action] Firestore update successful for ${ipo.companyName}.`);

    // Return a success message. The client UI will update automatically via its onSnapshot listener.
    return { success: true, message: 'Prediction updated successfully.' };

  } catch (error: any) {
    console.error('[Server Action] Prediction failed:', error);
    
    // Check for the specific access token error to provide a more helpful message.
    if (error.message && error.message.includes('could not refresh access token')) {
         const detailedMessage = 'The server failed to authenticate with Google AI. This is often an IAM permission issue. Ensure the App Hosting service account has the "Vertex AI User" role.';
         console.error(`[Server Action] Specific Error: ${detailedMessage}`);
         return { success: false, message: detailedMessage };
    }

    const errorMessage = error.message || 'An unknown error occurred during prediction.';
    return { success: false, message: errorMessage };
  }
}
