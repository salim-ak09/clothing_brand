'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, CartItem } from '@/store/cart';

interface AddToCartButtonProps {
  product: Omit<CartItem, 'qty' | 'id' | 'variantId'>;
  variantId: string;
}

export function AddToCartButton({ product, variantId }: AddToCartButtonProps) {
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
      className="glass-btn p-2 rounded-xl text-white hover:bg-burgundy-bright hover:border-burgundy-bright transition-all"
    >
      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );
}
