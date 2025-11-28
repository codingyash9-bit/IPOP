'use server';
import { updateIpoData } from "@/ai/flows/update-ipo-data";
import { getFirebaseAdmin } from "@/firebase/admin";
import { seedDatabase } from "@/lib/seed-db";

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

export async function handleSeedDatabase() {
    try {
        const { db } = getFirebaseAdmin();
        const result = await seedDatabase(db);
        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message };
        }
    } catch (err: any) {
        console.error("Seeding failed:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during seeding.';
        return { success: false, message: errorMessage };
    }
}
