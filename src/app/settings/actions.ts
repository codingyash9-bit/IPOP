
'use server';

import { getFirebaseAdmin } from "@/firebase/admin";
import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { getThirdPartyIPOList } from '@/functions/thirdPartyApi';
import type { Ipo } from '@/lib/types';


/**
 * The definitive, robust server action for manually syncing IPO data.
 * This action is self-contained and handles all logic:
 * 1. Fetches external IPO data.
 * 2. Compares against existing Firestore data to find new IPOs.
 * 3. Triggers the Genkit AI prediction flow for each new IPO.
 * 4. Writes the new, enriched IPO data back to Firestore in a batch.
 * 5. Returns a detailed success or error message to the client.
 */
export async function handleUpdateData(): Promise<{ success: boolean; message: string; }> {
  console.log('[Server Action] "handleUpdateData" invoked.');
  
  const { db } = getFirebaseAdmin();
  const iposCollection = db.collection('ipos');

  try {
    // 1. Fetch current IPO list from the external provider
    const providerIpos = await getThirdPartyIPOList();
    console.log(`[Server Action] Fetched ${providerIpos.length} IPOs from the third-party API.`);

    // 2. Get existing IPO symbols from Firestore for deduplication.
    const existingIposSnapshot = await iposCollection.select('symbol').get();
    const existingIpoSymbols = new Set(existingIposSnapshot.docs.map(doc => (doc.data().symbol || '').trim().toLowerCase()));
    console.log(`[Server Action] Found ${existingIposSymbols.size} existing IPOs in Firestore.`);

    // 3. Filter for truly new IPOs.
    const newIposFromProvider = providerIpos.filter(ipo => {
      const normalizedSymbol = (ipo.symbol || '').trim().toLowerCase();
      return normalizedSymbol && !existingIpoSymbols.has(normalizedSymbol);
    });

    console.log(`[Server Action] Identified ${newIposFromProvider.length} new IPOs to process.`);

    if (newIposFromProvider.length === 0) {
      const message = 'Data is already up-to-date. No new IPOs found.';
      console.log(`[Server Action] ${message}`);
      return { success: true, message };
    }

    const batch = db.batch();
    const newIpoNames: string[] = [];

    // 4. Process each new IPO.
    for (const newIpo of newIposFromProvider) {
      console.log(`[Server Action] Processing new IPO: ${newIpo.companyName} (${newIpo.symbol})`);
      newIpoNames.push(newIpo.companyName);

      // Prepare input for the AI flow
      const predictionInput = {
        ipoDetails: `Company: ${newIpo.companyName}, Industry: Tech, Description: A new and innovative tech company.`,
        marketConditions: 'Current market sentiment is cautiously optimistic.',
        companyFinancials: `TTM Revenue: 5000000000, Profit Margin: 10%, ROE: 15%, D/E Ratio: 0.5`,
      };

      // 5. Trigger the AI prediction flow.
      console.log(`[Server Action] Calling 'generateIpoPrediction' for ${newIpo.companyName}.`);
      const analysisResult = await generateIpoPrediction(predictionInput);
      console.log(`[Server Action] AI analysis complete for ${newIpo.companyName}.`);

      // 6. Assemble the full document for Firestore.
      const fullIpoDocument: Ipo = {
        id: newIpo.id,
        companyName: newIpo.companyName,
        symbol: newIpo.symbol.trim(),
        ipoDate: newIpo.ipoDate,
        logoUrl: `https://picsum.photos/seed/${newIpo.id}/100/100`,
        market: 'NSE',
        priceRange: newIpo.priceRange as [number, number],
        sharesOffered: 30000000,
        dealSize: (newIpo.priceRange[0] + newIpo.priceRange[1]) / 2 * 30000000,
        description: 'A newly discovered, exciting company preparing for its market debut. Full details are being populated by our AI.',
        industry: 'Technology',
        promoterHoldingPost: 60,
        revenueTtm: 5000000000,
        profitMargin: 10,
        roe: 15,
        debtToEquity: 0.5,
        qibSubscription: 0,
        niiSubscription: 0,
        retailSubscription: 0,
        gmp: 0,
        ...analysisResult,
      };

      const docRef = iposCollection.doc(newIpo.id);
      batch.set(docRef, fullIpoDocument);
    }

    // 7. Commit all writes to Firestore atomically.
    await batch.commit();
    console.log(`[Server Action] Batch commit successful. Added ${newIpoNames.length} IPOs.`);
    const message = `Successfully updated and analyzed ${newIpoNames.length} new IPO(s): ${newIpoNames.join(', ')}.`;
    return { success: true, message };

  } catch (err: any) {
    console.error('[Server Action] CRITICAL FAILURE in "handleUpdateData":', err);
    
    let errorMessage = err.message || 'An unknown error occurred during the sync process.';
    
    // Provide a specific, helpful message for the common authentication error.
    if (errorMessage.includes('could not refresh access token')) {
         errorMessage = 'Authentication with Google AI failed. This is an IAM permission issue. Please follow the instructions in FIXING_ADC_ERROR.md to grant the "Vertex AI User" role to your App Hosting service account.';
    }

    return { success: false, message: `Sync failed: ${errorMessage}` };
  }
}
