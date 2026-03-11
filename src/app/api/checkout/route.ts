import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  // ビルド時のエラー回避：環境変数未設定時は早期リターン
  if (!stripe || !process.env.STRIPE_PRICE_ID || !process.env.NEXTAUTH_URL) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  try {
    // Stripe Checkoutセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/login?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/`
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (error) {
    console.error('Stripe Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
