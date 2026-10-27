'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cart';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'qty' | 'id' | 'variantId'>;
  variantId: string;
  fullWidth?: boolean;
}

export function AddToCartButton({ product, variantId, fullWidth }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      ...product,
      id: `${product.productId}-${variantId}`,
      variantId,
      qty: 1,
    });
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={`flex items-center space-x-1 sm:space-x-2 px-2.5 py-1.5 sm:px-4 sm:py-2 glass-btn rounded-xl text-white font-mono text-[9px] sm:text-xs font-bold hover:bg-burgundy-bright hover:border-burgundy-bright transition-all ${fullWidth ? 'w-full justify-center' : ''}`}
    >
      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
      <span>ADD TO CART</span>
    </button>
  );
}
