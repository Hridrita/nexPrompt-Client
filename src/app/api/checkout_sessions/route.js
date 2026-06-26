import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getUserSession } from '@/lib/core/session'

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData = await req.formData();
    const redirect = formData.get("redirect") || "/all-prompt";
     console.log("Redirect from form:", redirect);

    const user = await getUserSession();
    const priceId = process.env.STRIPE_PRICE_ID;

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
        customer_email: user?.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&redirect=${encodeURIComponent(redirect)}`,
      cancel_url: `${origin}/payment/cancel?redirect=${encodeURIComponent(redirect)}`,
      metadata: {
        redirect: redirect,
        userId: user?.id || '',
      },
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}