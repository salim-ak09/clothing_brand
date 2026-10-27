import { prisma } from '@repo/database';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { AddToCartButton } from '@/components/ui/AddToCartButton';
import Link from 'next/link';
import { ProductGallery } from './ProductGallery';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { variants: true },
  });

  if (!product || !product.isActive) {
    return notFound();
  }

  // Fetch similar products (same category, excluding this one)
  const similarProducts = await prisma.product.findMany({
    where: { 
      category: product.category,
      isActive: true,
      id: { not: product.id }
    },
    take: 4,
    include: { variants: true }
  });

  const allImages = product.images?.length > 0 ? product.images : (product.coverImage ? [product.coverImage] : ['/luxury_hoodie.png']);
  const firstVariant = product.variants[0];

  return (
    <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto min-h-screen">
      
      {/* Product Details Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-24">
        
        {/* Images Gallery */}
        <div className="w-full lg:w-1/2">
          <ProductGallery images={allImages as string[]} productName={product.title} badge={product.fabricSpec || 'PREMIUM'} />
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <Link href="/shop" className="text-[10px] font-mono text-gray-400 hover:text-white uppercase tracking-widest mb-6 block">&larr; BACK TO SHOP</Link>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-burgundy-bright/20 text-burgundy-bright border border-burgundy-bright/40 font-bold self-start mb-4 uppercase">
            {product.fabricSpec || 'PREMIUM'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-display text-white uppercase tracking-tight mb-4">
            {product.title}
          </h1>
          <div className="font-mono font-bold text-2xl text-white mb-8">${Number(product.basePrice).toFixed(2)}</div>
          
          <p className="text-sm text-gray-400 leading-relaxed mb-10 whitespace-pre-line">
            {product.description || 'No description available for this item.'}
          </p>

          <div className="space-y-8 mt-auto border-t border-white/10 pt-8">
            <div>
              <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-3">Color / Finish</h4>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: firstVariant?.colorHex || '#ffffff' }}></div>
                <span className="text-sm font-mono text-white">{firstVariant?.colorName || 'Default'}</span>
              </div>
            </div>

            <div className="flex justify-end w-full">
              <AddToCartButton 
                product={{
                  productId: product.id,
                  name: product.title,
                  price: Number(product.basePrice),
                  colorName: firstVariant?.colorName || 'Default',
                  colorHex: firstVariant?.colorHex || '#ffffff',
                  size: firstVariant?.size || 'L',
                }}
                variantId={firstVariant?.id || 'default'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="border-t border-white/10 pt-16">
          <h3 className="text-xl md:text-2xl font-black font-display text-white uppercase tracking-tight mb-8">SIMILAR PIECES</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map(p => {
              const pImages = p.images?.length > 0 ? p.images : (p.coverImage ? [p.coverImage] : ['/luxury_hoodie.png']);
              return (
                <div key={p.id} className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between group">
                  <div>
                    <div className="relative aspect-square w-full rounded-xl bg-black/60 border border-white/10 overflow-hidden mb-3.5">
                      <Image src={pImages[0] as string} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-burgundy-bright transition-colors">{p.title}</h4>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-white">${Number(p.basePrice).toFixed(2)}</span>
                    </div>
                    <Link 
                      href={`/product/${p.slug}`}
                      className="w-full block text-center glass-btn py-2 rounded-xl text-xs font-mono tracking-widest text-white hover:text-burgundy-bright transition-colors"
                    >
                      VIEW DETAILS
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
