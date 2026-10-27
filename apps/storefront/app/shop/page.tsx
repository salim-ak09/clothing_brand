import { prisma } from '@repo/database';
import { Search } from 'lucide-react';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import { ShopClient } from '@/components/shop/ShopClient';

export default async function Shop() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { variants: true },
  });

  const formattedProducts = products.map((p: any) => {
    const firstVariant = p.variants[0];
    return {
      id: p.id,
      slug: p.slug,
      name: p.title,
      category: p.category,
      price: Number(p.basePrice),
      badge: p.fabricSpec || 'PREMIUM',
      desc: p.description || '',
      colorName: firstVariant?.colorName || 'Default',
      hex: firstVariant?.colorHex || '#ffffff',
      coverImage: p.coverImage,
      images: p.images || [],
      firstVariant,
    };
  });

  return (
    <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      {/* Shop Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="text-xs font-mono text-burgundy-bright uppercase tracking-widest font-bold mb-1">COLLECTION 2026</div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tight">ATELIER CATALOG</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">Heavyweight architectural streetwear crafted for high longevity.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
          <span className="text-white font-bold text-sm">{formattedProducts.length}</span>
          <span>PIECES AVAILABLE</span>
        </div>
      </div>

      <ShopClient products={formattedProducts} />
    </div>
  );
}
