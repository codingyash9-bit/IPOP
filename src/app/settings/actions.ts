'use server';
import { updateIpoDataLogic } from "@/functions/updateIpoDataLogic";

export async function handleUpdateData() {
  try {
    const result = await updateIpoDataLogic();
    if (result.success) {
        return { success: true, message: result.message };
    } else {
        return { success: false, message: `The backend process failed: "${result.message}"` };
    }
  } catch (err: any) {
    console.error('Error in handleUpdateData server action:', err);
    const errorMessage = err.message || 'An unknown error occurred';
    
    if (errorMessage.includes('could not refresh access token')) {
         return { success: false, message: 'Authentication with AI service failed. Please check server permissions.' };
    }
    return { success: false, message: `The backend process failed with an exception: "${errorMessage}"` };
  }
}
