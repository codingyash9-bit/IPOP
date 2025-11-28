/**
 * @fileoverview This is the entry point for all Firebase Cloud Functions for this project.
 * It defines the scheduled function that will periodically fetch and update IPO data.
 */

// We are aliasing the 'firebase-functions' import to 'functions' for clarity.
// This is a common convention in Firebase Cloud Functions development.
import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { updateIpoDataLogic } from './updateIpoDataLogic';
import { stripeWebhookHandler } from './stripe';

// Initialize the Firebase Admin SDK.
// This is done once when the function instance is created.
// It allows the function to have secure, admin-level access to Firebase services.
initializeApp();

/**
 * A scheduled Cloud Function that runs every 6 hours to synchronize IPO data.
 *
 * This function is triggered by Google Cloud Pub/Sub, a messaging service that
 * allows for reliable, asynchronous communication. Firebase uses Pub/Sub under
 * the hood to power its scheduled functions.
 *
 * .runWith() is used to configure the function's runtime options:
 * - timeoutSeconds: 540 (9 minutes). The default is 60s, which might not be
 *   enough for fetching data and running multiple AI predictions.
 * - memory: '1GB'. We allocate more memory to handle potentially large datasets
 *   and the overhead of the AI models.
 *
 * .pubsub.schedule() defines the trigger interval.
 *
 * .onRun() is the handler that executes when the schedule is met.
 */
export const scheduledFetchIPOs = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .pubsub.schedule('every 6 hours')
  .onRun(async (context) => {
    console.log('Running scheduled IPO data update...');
    try {
      // We call the core logic function, which is kept separate for better
      // organization and testability.
      const result = await updateIpoDataLogic();
      console.log('Scheduled function completed successfully:', result.message);
    } catch (error) {
      console.error('An error occurred during the scheduled execution:', error);
      // In a production system, you might add more robust error reporting here,
      // such as sending a notification to an error monitoring service.
    }
    // A scheduled function should return null or a Promise that resolves to null.
    return null;
  });

/**
 * An HTTP-triggered Cloud Function to handle webhooks from Stripe.
 *
 * This function creates a public URL that Stripe can send events to.
 * The logic for handling these events is in `src/functions/stripe.ts`.
 */
export const stripeWebhook = functions.https.onRequest(stripeWebhookHandler);
