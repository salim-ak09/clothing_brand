import { NextResponse } from 'next/server';
import { prisma } from '@repo/database';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        variants: true,
      },
    });

    // Map Prisma schema to the expected frontend schema
    const formattedProducts = products.map((p: any) => {
      const firstVariant = p.variants[0];
      return {
        id: p.id,
        name: p.title,
        category: p.category,
        price: Number(p.basePrice),
        badge: p.fabricSpec || 'PREMIUM',
        desc: p.description || '',
        colorName: firstVariant?.colorName || 'Default',
        hex: firstVariant?.colorHex || '#ffffff',
      };
    });

    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
