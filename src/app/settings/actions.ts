'use server';
import { updateIpoData } from "@/ai/flows/update-ipo-data";

export async function handleUpdateData() {
  try {
    const result = await updateIpoData({});
    if (result.success) {
        return { success: true, message: result.message };
    } else {
        return { success: false, message: result.message };
    }
  } catch (err: any) {
    console.error('Error in handleUpdateData server action:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    // Provide a more specific error message if it's the token issue
    if (errorMessage.includes('could not refresh access token')) {
         return { success: false, message: 'Authentication with AI service failed. Please check server permissions.' };
    }
    return { success: false, message: `The backend process failed: "${errorMessage}"` };
  }
}
