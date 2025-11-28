import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;
let adminProjectId: string | undefined;

// This function initializes the Firebase Admin SDK.
// It's designed to be idempotent (it only initializes once).
function initializeAdmin() {
  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    adminProjectId = (adminApp.options.credential as any)?.projectId || process.env.GCLOUD_PROJECT;
    return;
  }

  // In a deployed Google Cloud environment (like App Hosting or Cloud Functions),
  // the SDK can auto-discover credentials.
  try {
    console.log("Attempting to initialize Firebase Admin with Application Default Credentials...");
    adminApp = initializeApp();
    adminProjectId = process.env.GCLOUD_PROJECT;
    console.log("Firebase Admin initialized successfully with ADC.");
  } catch (e: any) {
    console.warn(`Admin SDK ADC initialization failed: ${e.message}. Falling back to service account key.`);
    
    // For local development, it falls back to a service account key file.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        adminApp = initializeApp({
          credential: cert(serviceAccount)
        });
        adminProjectId = serviceAccount.project_id;
        console.log("Firebase Admin initialized successfully with service account key.");
      } catch (keyError: any) {
         console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.", keyError);
         throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is set but could not be parsed. Initialization failed.");
      }
    } else {
      throw new Error("Firebase Admin SDK initialization failed. No ADC or service account key found.");
    }
  }
}

// Call the initialization function when this module is first loaded.
initializeAdmin();

// This is the function that other server-side modules will import.
export function getFirebaseAdmin() {
  if (!adminApp) {
    // This should theoretically not be reached if the module-level initialization works.
    throw new Error("Firebase Admin SDK has not been initialized. Something went wrong.");
  }
  
  return {
    db: getFirestore(adminApp),
    auth: getAuth(adminApp),
    projectId: adminProjectId,
  };
}
