import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@repo/database';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-08-26.dahlia', // Use the latest compatible API version
});

export async function POST(req: Request) {
  try {
    const { items, currency = 'usd' } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Server-side price validation
    let totalAmount = 0;
    for (const item of items) {
      // Validate the item price from the database, do not trust client prices
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });

      if (!variant || !variant.product) {
        return NextResponse.json({ error: `Invalid item: ${item.variantId}` }, { status: 400 });
      }

      // Check inventory
      if (variant.inventoryQuantity < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${variant.product.title}` }, { status: 400 });
      }

      // Calculate total (in cents for Stripe)
      const price = variant.priceOverride || variant.product.basePrice;
      totalAmount += Number(price) * item.quantity * 100;
    }

    // Create a PaymentIntent with the verified total amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: 'TBD', // In a real flow, create a PENDING order in DB first
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error('Stripe Intent Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
