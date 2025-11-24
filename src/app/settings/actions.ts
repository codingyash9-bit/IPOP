'use server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE; // e.g., https://api.yourdomain.com
const SECRET_TOKEN = process.env.NEXT_PUBLIC_BACKEND_TOKEN; // for dev only; avoid exposing in prod

export async function handleUpdateData() {
  if (!BACKEND_BASE) {
    return { success: false, message: 'Backend service is not configured.' };
  }
  
  try {
    const res = await fetch(`${BACKEND_BASE}/sync/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": SECRET_TOKEN || ''
      },
      body: JSON.stringify({ source: "thirdparty", force: true })
    });

    const j = await res.json();
    if (!res.ok) {
        // Use a generic message for the UI but log the specific error
        console.error('Sync failed:', j.detail || 'Unknown error');
        throw new Error("Failed to sync data from the provider.");
    }
    
    return { success: true, message: `Successfully synced ${j.count} IPOs.` };
  } catch (err: any) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    // For the demo, we show a friendlier error message
    return { success: false, message: `This is a demo. The backend returned: "${errorMessage}"` };
  }
}
