import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // In a real GCP environment, service account credentials can be auto-discovered.
    // For local development, you'd use a service account file.
    // IMPORTANT: Do NOT commit service account keys to your repository.
    try {
        initializeApp(); // For GCP environments
    } catch (e) {
        console.warn("Could not auto-initialize Firebase Admin. Are you in a GCP environment? Falling back to service account key if available.", e)
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            initializeApp({
                credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
            });
        } else {
            throw new Error("Firebase Admin SDK initialization failed. No credentials found.");
        }
    }
  }

  return {
    db: getFirestore(),
    auth: getAuth(),
  };
}

export { getFirebaseAdmin };
