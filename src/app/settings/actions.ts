'use server';
import { updateIpoDataLogic } from "@/functions/updateIpoDataLogic";

/**
 * Server action triggered by the "Sync IPO Data Manually" button.
 * It directly invokes the core business logic and handles error reporting.
 */
export async function handleUpdateData() {
  console.log('[Server Action] "handleUpdateData" invoked.');
  try {
    // Call the centralized logic for updating IPO data.
    const result = await updateIpoDataLogic();
    console.log('[Server Action] "updateIpoDataLogic" completed successfully:', result);

    // The logic was successful, return a success message for the UI.
    return { success: true, message: result.message };

  } catch (err: any) {
    console.error('[Server Action] An exception occurred in "handleUpdateData":', err);
    
    // Default error message.
    let errorMessage = 'An unknown error occurred during the sync process.';

    // Check if it's a specific HttpsError from the logic file.
    if (err.message) {
      errorMessage = err.message;
    }
    
    // Provide a specific, helpful message for the common authentication error.
    if (errorMessage.includes('could not refresh access token')) {
         errorMessage = 'Authentication with Google AI services failed. This is likely an IAM permission issue. Please ensure the service account for App Hosting has the "Vertex AI User" role.';
    }

    // Return a structured error for the client to display.
    return { success: false, message: `Sync failed: ${errorMessage}` };
  }
}
