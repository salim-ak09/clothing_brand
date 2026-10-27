'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

export function ShopClient({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <>
      {/* Filter & Search Toolbar */}
      <div className="glass-panel p-3.5 sm:p-5 rounded-2xl mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto">
          <button className="cat-pill active px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono bg-burgundy-bright text-white font-semibold transition-all">ALL</button>
          <button className="cat-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono glass-btn text-gray-300 hover:text-white transition-all">HOODIES</button>
          <button className="cat-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono glass-btn text-gray-300 hover:text-white transition-all">CREWNECKS</button>
          <button className="cat-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono glass-btn text-gray-300 hover:text-white transition-all">BOTTOMS</button>
          <button className="cat-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono glass-btn text-gray-300 hover:text-white transition-all">ACCESSORIES</button>
        </div>

        <div className="flex items-center space-x-2.5 w-full lg:w-auto justify-between lg:justify-end">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search pieces..." className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 font-mono text-xs">
            No archive garments match your criteria.
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between group cursor-pointer" onClick={() => setSelectedProduct(p)}>
              <div>
                <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 overflow-hidden mb-3.5 flex items-center justify-center">
                  <Image src="/luxury_hoodie.png" alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono bg-black/70 border border-white/10 text-white font-semibold">{p.badge}</span>
                  <button className="absolute bottom-2.5 right-2.5 glass-btn px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    QUICK VIEW
                  </button>
                </div>
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: p.hex }}></div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">{p.colorName}</span>
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-burgundy-bright transition-colors">{p.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{p.desc}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <span className="font-mono font-bold text-sm sm:text-base text-white">${p.price.toFixed(2)}</span>
                <AddToCartButton 
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
          ))
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-4xl glass-panel border border-white/10 rounded-3xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row h-auto max-h-[90vh]">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white glass-btn rounded-xl">
              <X className="w-5 h-5" />
            </button>
            
            {/* Image side */}
            <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full bg-black">
               <Image src="/luxury_hoodie.png" alt={selectedProduct.name} fill className="object-cover" />
            </div>

            {/* Details side */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
               <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-burgundy-bright/20 text-burgundy-bright border border-burgundy-bright/40 font-bold self-start mb-4 uppercase">{selectedProduct.badge}</span>
               <h2 className="text-2xl md:text-3xl font-black font-display text-white uppercase tracking-tight mb-2">{selectedProduct.name}</h2>
               <div className="font-mono font-bold text-xl text-white mb-6">${selectedProduct.price.toFixed(2)}</div>
               
               <p className="text-sm text-gray-400 leading-relaxed mb-8">{selectedProduct.desc}</p>
               
               <div className="space-y-6 mt-auto border-t border-white/10 pt-6">
                 <div>
                   <h4 className="text-[10px] font-mono text-gray-500 uppercase mb-2">Color</h4>
                   <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: selectedProduct.hex }}></div>
                     <span className="text-xs font-mono text-white">{selectedProduct.colorName}</span>
                   </div>
                 </div>

                 <AddToCartButton 
                  product={{
                    productId: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    colorName: selectedProduct.colorName,
                    colorHex: selectedProduct.hex,
                    size: selectedProduct.firstVariant?.size || 'L',
                  }}
                  variantId={selectedProduct.firstVariant?.id || 'default'}
                />
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
