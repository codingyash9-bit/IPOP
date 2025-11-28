/**
 * @fileoverview This file is the main entry point for your Firebase Cloud Functions.
 * It is not part of the Next.js application build process and is deployed separately.
 */

import * as functions from 'firebase-functions';
import { stripeWebhookHandler } from './stripe';
// import { updateIpoDataLogic } from './updateIpoDataLogic';

/**
 * Stripe Webhook:
 * A secure endpoint that listens for events from Stripe, such as successful payments.
 * 
 * To deploy this function and get its URL:
 * 1. Run `firebase deploy --only functions`
 * 2. The CLI will output the URL for this function.
 * 3. In your Stripe Dashboard, go to Developers > Webhooks.
 * 4. Add a new endpoint, paste the URL, and select the events to listen for:
 *    - `checkout.session.completed`
 *    - `customer.subscription.updated`
 *    - `customer.subscription.deleted`
 */
export const stripeWebhook = functions.https.onRequest(stripeWebhookHandler);

/**
 * OPTIONAL: Scheduled IPO Data Sync
 * A scheduled function that runs automatically to keep your IPO data fresh.
 * 
 * To enable this function:
 * 1. Uncomment the function below.
 * 2. Deploy it by running `firebase deploy --only functions`.
 * 
 * This function is configured to run every 12 hours. You can change the schedule
 * by modifying the string (e.g., 'every 1 hours', 'every day 09:00').
 * See https://firebase.google.com/docs/functions/schedule-functions for more options.
 */
/*
export const scheduledIpoSync = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async (context) => {
    console.log('Running scheduled IPO data sync...');
    try {
      const result = await updateIpoDataLogic();
      console.log('Scheduled sync completed successfully:', result.message);
    } catch (error) {
      console.error('Scheduled IPO data sync failed:', error);
    }
  });
*/
