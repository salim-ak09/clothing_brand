'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ images, productName, badge }: { images: string[], productName: string, badge: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full rounded-2xl bg-black/60 border border-white/10 overflow-hidden">
        <Image src={images[currentIndex] || '/demo/default-product.png'} alt={productName} fill className="object-cover transition-opacity duration-300" />
      </div>
      
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${
                idx === currentIndex ? 'border-burgundy-bright opacity-100' : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
              }`}
            >
              <Image src={img} alt={`${productName} view ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
