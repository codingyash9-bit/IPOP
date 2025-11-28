'use server';

/**
 * @fileOverview A flow to update IPO data from a 3rd party API, identify new IPOs, and trigger their analysis.
 *
 * - updateIpoData - A function that handles the IPO data update process.
 * - UpdateIpoDataInput - The input type for the updateIpoData function.
 * - UpdateIpoDataOutput - The return type for the updateIpoData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getFirebaseAdmin } from '@/firebase/admin';
import { generateIpoPrediction } from './generate-ipo-prediction';
import type { Ipo } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';


const UpdateIpoDataInputSchema = z.object({
    // In a real scenario, you might pass an API key here.
});
export type UpdateIpoDataInput = z.infer<typeof UpdateIpoDataInputSchema>;

const UpdateIpoDataOutputSchema = z.object({
  success: z.boolean().describe('Whether the IPO data update was successful.'),
  message: z.string().describe('A message indicating the result of the update.'),
  newIposAdded: z.number().describe('The number of new IPOs that were added.'),
  newIpoNames: z.array(z.string()).describe('The names of the new IPOs added.'),
  aiTriggeredCount: z.number().describe('The number of AI prediction flows triggered.'),
});
export type UpdateIpoDataOutput = z.infer<typeof UpdateIpoDataOutputSchema>;

// This function is the entry point that would be called by your server or a manual trigger.
export async function updateIpoData(input: UpdateIpoDataInput): Promise<UpdateIpoDataOutput> {
  return updateIpoDataFlow(input);
}


// This tool simulates fetching data from an external financial data provider.
// In production, this would make a real HTTP request.
const getThirdPartyIPOList = ai.defineTool(
  {
    name: 'getThirdPartyIPOList',
    description: 'Simulates fetching a list of upcoming IPOs from a financial data provider.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
        id: z.string(),
        companyName: z.string(),
        symbol: z.string(),
        ipoDate: z.string(),
        priceRange: z.array(z.number()),
    })),
  },
  async () => {
    // This is where you would use `fetch` to call a real API like IEX Cloud or a local market data provider.
    // We return a mock list that includes existing and new IPOs.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 'physicswallah', companyName: 'PhysicsWallah', symbol: 'PW', ipoDate: '2024-11-25', priceRange: [450, 475] },
      { id: 'capillary-technologies', companyName: 'Capillary Technologies', symbol: 'CAPTECH', ipoDate: '2024-12-02', priceRange: [380, 400] },
      { id: 'ola-electric', companyName: 'Ola Electric', symbol: 'OLAELECT', ipoDate: '2025-02-15', priceRange: [1200, 1250] },
      // This is the NEW IPO that is not yet in our database.
      { id: 'aurora-innovations', companyName: 'Aurora Innovations', symbol: 'AURORA', ipoDate: '2025-04-10', priceRange: [700, 750] },
    ];
  }
);


const updateIpoDataFlow = ai.defineFlow(
  {
    name: 'updateIpoDataFlow',
    inputSchema: UpdateIpoDataInputSchema,
    outputSchema: UpdateIpoDataOutputSchema,
  },
  async () => {
    const { db } = getFirebaseAdmin();
    const iposCollection = db.collection('ipos');

    try {
      // 1. Fetch current IPO list from the external provider
      const providerIpos = await getThirdPartyIPOList();
      console.log(`Fetched ${providerIpos.length} IPOs from the third-party API.`);
      
      // 2. Get the list of IPO IDs we already have in our database and normalize them
      const existingIposSnapshot = await iposCollection.select('symbol').get();
      const existingIpoSymbols = new Set(existingIposSnapshot.docs.map(doc => (doc.data().symbol || '').trim().toLowerCase()));
      console.log(`Found ${existingIposSymbols.size} existing IPOs in Firestore.`);

      // 3. Filter out the IPOs that are truly new, using normalized symbols
      const newIposFromProvider = providerIpos.filter(ipo => {
          const normalizedSymbol = (ipo.symbol || '').trim().toLowerCase();
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

      const batch = db.batch();
      const newIpoNames: string[] = [];
      let aiTriggeredCount = 0;

      // 4. For each new IPO, enrich it with details and run AI prediction
      for (const newIpo of newIposFromProvider) {
        console.log(`Processing new IPO: ${newIpo.companyName} (${newIpo.symbol})...`);
        newIpoNames.push(newIpo.companyName);
        
        // In a real app, you would fetch more detailed data for the new IPO here.
        // For this demo, we'll use mock data to run the AI flows.
        const predictionInput = {
            ipoDetails: `Company: ${newIpo.companyName}, Industry: Tech, Description: A new and innovative tech company.`,
            marketConditions: 'Current market sentiment is cautiously optimistic.',
            companyFinancials: `TTM Revenue: 5000000000, Profit Margin: 10%, ROE: 15%, D/E Ratio: 0.5`
        };

        const analysisResult = await generateIpoPrediction(predictionInput);
        aiTriggeredCount++;
        console.log(`AI prediction generated for ${newIpo.companyName}.`);

        // 5. Create the full IPO document to be saved to Firestore
        const fullIpoDocument: Ipo = {
            id: newIpo.id,
            companyName: newIpo.companyName,
            symbol: newIpo.symbol.trim(), // Ensure whitespace is trimmed
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

        // Add the new document to the batch
        const docRef = iposCollection.doc(newIpo.id);
        batch.set(docRef, fullIpoDocument);
      }
      
      // 6. Commit the batch write to Firestore
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
      console.error('Failed to update IPO data:', error);
      return {
        success: false,
        message: `An error occurred: ${error.message}`,
        newIposAdded: 0,
        newIpoNames: [],
        aiTriggeredCount: 0,
      };
    }
  }
);
