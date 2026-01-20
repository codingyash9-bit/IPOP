'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripeCheckoutSession(idToken: string): Promise<{ error: string } | void> {
  const { auth, db } = getFirebaseAdmin();
  
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Invalid ID token:', error);
    return { error: 'Authentication failed. Please sign in again.' };
  }
  
  const uid = decodedToken.uid;
  const userRef = db.collection('users').doc(uid);
  
  let stripeCustomerId: string | undefined;
  
  try {
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      stripeCustomerId = userDoc.data()?.stripeCustomerId;
    } else {
        console.log(`User document for UID ${uid} does not exist yet.`);
    }
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return { error: "Could not retrieve user data." };
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || headers().get('origin')!;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/pro/success`,
      cancel_url: `${appUrl}/pro/canceled`,
      // Use existing Stripe customer if available, otherwise Stripe creates one
      customer: stripeCustomerId, 
      // Pass the Firebase UID to Stripe. We'll use this in the webhook
      // to identify which user to provision the "pro" role for.
      client_reference_id: uid,
      // If we are creating a new customer, we can pass user email
      customer_email: stripeCustomerId ? undefined : decodedToken.email,
    });

    if (session.url) {
      redirect(session.url);
    } else {
        return { error: 'Could not create a checkout session.' };
    }
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return { error: 'Something went wrong with the Stripe checkout process.' };
  }
}
