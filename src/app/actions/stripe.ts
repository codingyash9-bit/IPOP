'use server';

import { getFirebaseAdmin } from '@/firebase/admin';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createStripeCheckoutSession() {
  const { auth } = getFirebaseAdmin();
  const headersList = headers();
  const origin = headersList.get('origin');
  
  // This is a placeholder for getting the current user's session
  // In a real app with Next-Auth or similar, you'd get the user from the session
  // For this demo, we'll hardcode a user ID for the server action
  const user = await auth.getUserByEmail('demo@example.com').catch(() => null);

  if (!user) {
    return { error: 'You must be logged in to upgrade.' };
  }

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

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
      // Pass the Firebase UID to Stripe. We'll use this in the webhook
      // to identify which user to provision the "pro" role for.
      client_reference_id: user.uid,
    });

    if (session.url) {
      redirect(session.url);
    } else {
        return { error: 'Could not create a checkout session.' };
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return { error: 'Something went wrong with the Stripe checkout process.' };
  }
}
