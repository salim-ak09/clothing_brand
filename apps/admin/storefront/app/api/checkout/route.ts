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
            unitPrice: item.price,
            customConfiguration: item.productId === 'custom-hoodie' ? JSON.stringify({ color: item.colorHex, size: item.size }) : null,
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.id, orderNumber });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
