/**
 * @fileoverview This file contains the Cloud Function logic for handling Stripe webhooks.
 */

import * as functions from 'firebase-functions';
import { getFirebaseAdmin } from '@/firebase/admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

/**
 * The main handler for the Stripe webhook Cloud Function.
 * It validates the request signature and routes events to specific handlers.
 */
export const stripeWebhookHandler = async (req: functions.https.Request, res: functions.Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) {
            console.error('Stripe signature or webhook secret is missing.');
            return res.status(400).send('Webhook Error: Missing signature or secret.');
        }

        // The 'rawBody' is essential for signature verification.
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    console.log(`Received Stripe event: ${event.type}`);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
        case 'customer.subscription.deleted':
        case 'customer.subscription.updated':
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionChange(subscription);
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
};

/**
 * Handles the 'checkout.session.completed' event.
 * This is where we provision the "pro" role for a new subscriber.
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const { auth } = getFirebaseAdmin();
    const firebaseUid = session.client_reference_id;
    const stripeCustomerId = session.customer as string;

    if (!firebaseUid) {
        console.error('Missing firebaseUid in checkout session.', session.id);
        return;
    }
    
    if (!stripeCustomerId) {
        console.error('Missing stripeCustomerId in checkout session.', session.id);
        return;
    }

    try {
        // Set custom claim for 'pro' status
        await auth.setCustomUserClaims(firebaseUid, { pro: true });
        
        // Also update the user document in Firestore
        const { db } = getFirebaseAdmin();
        const userRef = db.collection('users').doc(firebaseUid);
        await userRef.set({
            stripeCustomerId: stripeCustomerId,
            proStatus: true // Keep this for easier client-side checks
        }, { merge: true });

        console.log(`Successfully granted pro access to user ${firebaseUid}`);
    } catch (error) {
        console.error(`Failed to update user ${firebaseUid} for pro access:`, error);
    }
}

/**
 * Handles subscription changes, like cancellations.
 * This ensures that when a user cancels their subscription, their "pro" role is revoked.
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
    const { auth, db } = getFirebaseAdmin();
    const stripeCustomerId = subscription.customer as string;

    const userQuery = db.collection('users').where('stripeCustomerId', '==', stripeCustomerId).limit(1);

    try {
        const userSnapshot = await userQuery.get();
        if (userSnapshot.empty) {
            console.error('No user found with Stripe customer ID:', stripeCustomerId);
            return;
        }

        const userDoc = userSnapshot.docs[0];
        const firebaseUid = userDoc.id;
        const proStatus = subscription.status === 'active' || subscription.status === 'trialing';
        
        // Update custom claim
        await auth.setCustomUserClaims(firebaseUid, { pro: proStatus });
        
        // Update Firestore document
        await userDoc.ref.update({ proStatus: proStatus });

        console.log(`Subscription status for ${firebaseUid} updated to ${proStatus}`);
    } catch (error) {
        console.error(`Failed to handle subscription change for customer ${stripeCustomerId}:`, error);
    }
}
