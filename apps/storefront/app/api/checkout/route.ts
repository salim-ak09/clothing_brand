import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, subtotal, shippingAddress, notes } = body;
    const session = await auth();
    
    // Determine user ID if logged in
    const userId = session?.user?.id || null;
    
    const orderNumber = `ATH-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING_COD', // Cash on Delivery
        subtotal,
        totalAmount: subtotal,
        shippingAddress: JSON.stringify(shippingAddress),
        notes,
        orderItems: {
          create: items.map((item: any) => ({
            quantity: item.qty,
            unitPrice: item.price || 0,
            customConfiguration: item.productId === 'custom-hoodie' ? JSON.stringify({ color: item.colorHex, size: item.size }) : null,
            variantId: (item.variantId !== 'default' && item.productId !== 'custom-hoodie') ? item.variantId : null
          }))
        }
      }
    });

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            firstName: shippingAddress.firstName || null,
            lastName: shippingAddress.lastName || null,
            address: shippingAddress.address || null,
            city: shippingAddress.city || null,
            state: shippingAddress.state || null,
            postcode: shippingAddress.postcode || null,
          }
        });
      } catch (err) {
        console.error('Failed to update user profile with shipping address:', err);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id, orderNumber });
  } catch (error: any) {
    console.error('Checkout Error:', error);
    
    try {
      require('fs').writeFileSync(
        require('path').join(process.cwd(), 'checkout-error.log'), 
        error?.stack || error?.message || String(error)
      );
    } catch(e) {}

    // Handle stale cart items pointing to old database variants
    if (error.code === 'P2003' || (error.message && error.message.includes('Foreign key constraint'))) {
      return NextResponse.json({ error: 'Some items in your cart are no longer available. Please clear your cart and try again.' }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create order' }, { status: 500 });
  }
}
