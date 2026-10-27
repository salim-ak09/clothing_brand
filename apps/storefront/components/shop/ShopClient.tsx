'use client';

import { useState } from 'react';
import { Search, X, Eye } from 'lucide-react';
import Image from 'next/image';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

import Link from 'next/link';

function ProductCard({ p }: { p: any }) {
  const [imgIndex, setImgIndex] = useState(0);
  const allImages = p.images?.length > 0 ? p.images : (p.coverImage ? [p.coverImage] : ['/luxury_hoodie.png']);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="glass-card rounded-xl sm:rounded-3xl p-3 sm:p-5 border border-white/10 flex flex-col justify-between group">
      <div>
        <div 
          className="relative aspect-square w-full rounded-lg sm:rounded-2xl bg-black/60 border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center cursor-pointer"
          onClick={handleImageClick}
        >
          <Image src={allImages[imgIndex]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {allImages.length > 1 && (
            <>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono bg-black/70 border border-white/10 text-gray-400 font-semibold pointer-events-none">
                {imgIndex + 1}/{allImages.length}
              </span>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
                {allImages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/30'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1.5 mb-1">
          <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: p.hex }}></div>
          <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">{p.colorName}</span>
        </div>
        <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-burgundy-bright transition-colors">{p.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{p.desc}</p>
      </div>
      <div className="mt-3 space-y-3">
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono font-bold text-sm sm:text-base text-white">${p.price.toFixed(2)}</span>
          <Link 
            href={`/product/${p.slug}`}
            className="flex items-center space-x-2 px-2.5 py-1.5 sm:px-4 sm:py-2 glass-btn rounded-xl text-white font-mono text-[9px] sm:text-xs font-bold hover:text-burgundy-bright transition-all"
          >
            <Eye className="w-3.5 h-3.5 sm:hidden" />
            <span className="hidden sm:inline">VIEW DETAILS</span>
          </Link>
        </div>
        <div className="w-full">
          <AddToCartButton 
            fullWidth={true}
            product={{
              productId: p.id,
              name: p.name,
              price: p.price,
              colorName: p.colorName,
              colorHex: p.hex,
              size: p.firstVariant?.size || 'L',
            }}
            variantId={p.firstVariant?.id || 'default'}
          />
        </div>
      </div>
    </div>
  );
}

export function ShopClient({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories from available products
  const uniqueCategories = Array.from(new Set(products.map(p => p.category?.toUpperCase()).filter(Boolean)));
  const categories = ['ALL', ...uniqueCategories];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'ALL' || p.category?.toUpperCase() === activeCategory;
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cat-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeCategory === cat 
                  ? 'bg-burgundy-bright text-white' 
                  : 'glass-btn text-gray-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2.5 w-full lg:w-auto justify-between lg:justify-end">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search pieces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" 
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-mono text-xs">
            No archive garments match your criteria.
          </div>
        ) : (
          filteredProducts.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))
        )}
      </div>
    </>
  );
}
