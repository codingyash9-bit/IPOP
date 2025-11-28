import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// A variable to hold the initialized app instance.
let adminApp: App | null = null;
let adminProjectId: string | undefined = undefined;

function initializeAdminApp() {
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    // Attempt to get project ID from the already initialized app
    adminProjectId = (adminApp.options.credential as any)?.projectId || process.env.GCLOUD_PROJECT || undefined;
    return;
  }

  // In a real GCP environment, service account credentials can be auto-discovered.
  // For local development, you'd use a service account file.
  // IMPORTANT: Do NOT commit service account keys to your repository.
  try {
    // For GCP environments (like Cloud Functions, Cloud Run)
    // This relies on Application Default Credentials.
    adminApp = initializeApp();
    adminProjectId = process.env.GCLOUD_PROJECT;
  } catch (e) {
    console.warn("Could not auto-initialize Firebase Admin. Are you in a GCP environment? Falling back to service account key if available.");
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = initializeApp({
        credential: cert(serviceAccount)
      });
      adminProjectId = serviceAccount.project_id;
    } else {
      throw new Error("Firebase Admin SDK initialization failed. No credentials found. Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment.");
    }
  }
}

// Initialize on module load.
initializeAdminApp();

function getFirebaseAdmin() {
  if (!adminApp) {
    throw new Error("Firebase Admin SDK has not been initialized.");
  }
  if (!adminProjectId) {
      console.warn("Could not determine project ID from Firebase Admin SDK.");
  }

  return {
    db: getFirestore(adminApp),
    auth: getAuth(adminApp),
    projectId: adminProjectId,
  };
}

export { getFirebaseAdmin };
