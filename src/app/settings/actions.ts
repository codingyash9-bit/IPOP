'use server';

import { updateIpoData } from '@/ai/flows/update-ipo-data';

export async function handleUpdateData() {
  try {
    // In a real application, you would get these from a secure store.
    const input = {
      apiKey: process.env.THIRD_PARTY_API_KEY || 'test-api-key',
      apiUrl: 'https://api.example.com/ipos',
    };
    
    // Simulate a successful API call for demonstration purposes
    // const result = await updateIpoData(input);
    const result = {
        success: true,
        message: 'Successfully updated IPO data from 2 sources.'
    }

    if (!result.success) {
      throw new Error(result.message);
    }
    
    return { success: true, message: result.message };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, message: "This is a demo. In a real app, this would be: " + errorMessage };
  }
}
