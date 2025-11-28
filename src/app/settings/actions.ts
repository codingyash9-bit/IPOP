
'use server';

import { parseProspectus } from "@/ai/flows/parse-prospectus-flow";
import { ipos } from "@/lib/ipo-data";
import { getFirebaseAdmin } from "@/firebase/admin";

export async function parseProspectusAction(prospectusDataUri: string): Promise<{ success: boolean; data?: any; message: string; }> {
    console.log('[Server Action] "parseProspectusAction" invoked.');

    if (!prospectusDataUri) {
        return { success: false, message: "No prospectus file data provided." };
    }

    try {
        const result = await parseProspectus({ prospectusDataUri });
        console.log('[Server Action] Prospectus parsing complete.');
        
        return {
            success: true,
            data: result,
            message: `Successfully parsed prospectus for ${result.companyName}.`
        };

    } catch (err: any) {
        console.error('[Server Action] CRITICAL FAILURE in "parseProspectusAction":', err);
        
        let errorMessage = err.message || 'An unknown error occurred during parsing.';
        
        if (errorMessage.includes('could not refresh access token')) {
            errorMessage = 'Authentication with Google AI failed. This is an IAM permission issue. Please follow the instructions in FIXING_ADC_ERROR.md to grant the "Vertex AI User" role to your App Hosting service account.';
        }

        return { success: false, message: `Parsing failed: ${errorMessage}` };
  }
}

export async function seedDatabaseAction(): Promise<{ success: boolean; message: string; }> {
    console.log('[Server Action] "seedDatabaseAction" invoked.');
    
    // Use the admin SDK for a privileged, server-side write operation.
    const { db } = getFirebaseAdmin();
    const batch = db.batch();
    const iposCollectionRef = db.collection('ipos');

    ipos.forEach((ipo) => {
        const docRef = iposCollectionRef.doc(ipo.id);
        batch.set(docRef, ipo);
    });

    try {
        await batch.commit();
        const message = `Successfully seeded ${ipos.length} IPOs to the database.`;
        console.log(`[Server Action] ${message}`);
        return { success: true, message: message };
    } catch (error) {
        console.error('[Server Action] CRITICAL FAILURE in "seedDatabaseAction":', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during database seeding.';
        return { success: false, message: `Database seeding failed: ${errorMessage}` };
    }
}

    