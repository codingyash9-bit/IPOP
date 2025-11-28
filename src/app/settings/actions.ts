'use server';
import { updateIpoData } from "@/ai/flows/update-ipo-data";

export async function handleUpdateData() {
  try {
    const result = await updateIpoData({apiKey: 'dummy', apiUrl: 'dummy'});
    if (result.success) {
        return { success: true, message: result.message };
    } else {
        return { success: false, message: result.message };
    }
  } catch (err: any) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return { success: false, message: `This is a demo. The backend returned: "${errorMessage}"` };
  }
}
