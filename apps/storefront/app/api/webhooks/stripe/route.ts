import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@repo/database';
import { orderQueue } from '@/src/lib/queue';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test', {
  apiVersion: '2026-08-26.dahlia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event securely
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata.orderId;
    
    console.log(`[Stripe Webhook] PaymentIntent for ${paymentIntent.amount} succeeded.`);
    
    // 1. Update Order Status in Database
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      });
      
      // 2. Queue Email Dispatch via BullMQ
      // (Fetching user email requires DB lookup for the order in a real scenario)
      await orderQueue.add('send-receipt', { 
        email: 'customer@example.com', 
        orderNumber: orderId 
      });
    }
  }

  return NextResponse.json({ received: true });
}
