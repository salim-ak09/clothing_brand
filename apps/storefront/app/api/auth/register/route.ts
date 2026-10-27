import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';

export async function POST(req: Request) {
  try {
    const { email, password, orderId } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // In a real app we'd hash the password here with bcrypt or similar
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // For prototype only
      },
    });

    // Link guest order if provided
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { userId: user.id }
      });
    }

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
