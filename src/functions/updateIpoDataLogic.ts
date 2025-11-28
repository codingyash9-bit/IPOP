/**
 * @fileoverview This file contains the core logic for the IPO data synchronization process.
 * It's designed to be run in a secure, server-side environment like a Cloud Function.
 */

// Note: In a real Cloud Functions environment, you would import these from the 'firebase-admin' package.
// We are placing them here to simulate that structure.
import { getFirebaseAdmin } from '@/firebase/admin';
import { generateIpoPrediction } from '@/ai/flows/generate-ipo-prediction';
import { getThirdPartyIPOList } from './thirdPartyApi';
import type { Ipo } from '@/lib/types';


/**
 * The main logic for updating IPO data. This function can be called from a scheduled
 * Cloud Function or any other server-side process.
 *
 * It uses the Firebase Admin SDK, which has full read/write access to the database,
 * bypassing client-side security rules. This is necessary for a backend process
 * that manages data on behalf of all users.
 */
export async function updateIpoDataLogic() {
  const { db } = getFirebaseAdmin();
  const iposCollection = db.collection('ipos');

  try {
    // 1. Fetch current IPO list from the external provider
    const providerIpos = await getThirdPartyIPOList();
    console.log(`Fetched ${providerIpos.length} IPOs from the third-party API.`);

    // 2. Get the list of IPO symbols we already have in our database.
    // .select('symbol') is a performance optimization - it only fetches the 'symbol' field.
    const existingIposSnapshot = await iposCollection.select('symbol').get();
    const existingIpoSymbols = new Set(existingIposSnapshot.docs.map(doc => (doc.data().symbol || '').trim().toLowerCase()));
    console.log(`Found ${existingIposSymbols.size} existing IPOs in Firestore.`);

    // 3. Filter out the IPOs that are truly new, using normalized symbols for robust deduplication.
    const newIposFromProvider = providerIpos.filter(ipo => {
      const normalizedSymbol = (ipo.symbol || '').trim().toLowerCase();
      // An IPO is new if its normalized symbol is not empty and not in our existing set.
      return normalizedSymbol && !existingIpoSymbols.has(normalizedSymbol);
    });

    console.log(`Identified ${newIposFromProvider.length} new IPOs.`);

    if (newIposFromProvider.length === 0) {
      const message = 'Data is already up-to-date. No new IPOs found.';
      console.log(message);
      return {
        success: true,
        message,
        newIposAdded: 0,
        newIpoNames: [],
        aiTriggeredCount: 0,
      };
    }

    // Use a Firestore batch to perform all writes as a single atomic operation.
    const batch = db.batch();
    const newIpoNames: string[] = [];
    let aiTriggeredCount = 0;

    // 4. For each new IPO, enrich it with details and run the AI prediction flow.
    for (const newIpo of newIposFromProvider) {
      console.log(`Processing new IPO: ${newIpo.companyName} (${newIpo.symbol})...`);
      newIpoNames.push(newIpo.companyName);

      // In a real app, you would fetch more detailed data here. We use mock data for this demo.
      const predictionInput = {
        ipoDetails: `Company: ${newIpo.companyName}, Industry: Tech, Description: A new and innovative tech company.`,
        marketConditions: 'Current market sentiment is cautiously optimistic.',
        companyFinancials: `TTM Revenue: 5000000000, Profit Margin: 10%, ROE: 15%, D/E Ratio: 0.5`,
      };

      // 5. Trigger the AI prediction flow. This can be called directly from the server-side environment.
      const analysisResult = await generateIpoPrediction(predictionInput);
      aiTriggeredCount++;
      console.log(`AI prediction generated for ${newIpo.companyName}.`);

      // 6. Create the full IPO document to be saved to Firestore, combining provider data and AI analysis.
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
        ...analysisResult, // Spread the AI-generated fields into the document.
      };

      // Add the operation to create the new document to the batch.
      const docRef = iposCollection.doc(newIpo.id);
      batch.set(docRef, fullIpoDocument);
    }

    // 7. Commit the batch write to Firestore. This executes all the 'set' operations at once.
    await batch.commit();
    console.log(`Batch commit successful. Added ${newIposFromProvider.length} new IPOs.`);

    const message = `Successfully updated IPO data. Added and analyzed ${newIposFromProvider.length} new IPO(s): ${newIpoNames.join(', ')}.`;
    return {
      success: true,
      message: message,
      newIposAdded: newIposFromProvider.length,
      newIpoNames: newIpoNames,
      aiTriggeredCount: aiTriggeredCount,
    };

  } catch (error: any) {
    console.error('Failed to update IPO data in server-side logic:', error);
    // Re-throw the error to be caught by the calling function (e.g., the .onRun handler).
    throw new functions.https.HttpsError('internal', `An error occurred: ${error.message}`);
  }
}

