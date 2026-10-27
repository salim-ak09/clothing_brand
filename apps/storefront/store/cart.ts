import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // combination of productId and variantId
  productId: string;
  variantId: string;
  name: string;
  price: number;
  qty: number;
  colorName: string;
  colorHex: string;
  size: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotals: () => { subtotal: number; count: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        });
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      getTotals: () => {
        const { items } = get();
        return {
          subtotal: items.reduce((acc, i) => acc + i.price * i.qty, 0),
          count: items.reduce((acc, i) => acc + i.qty, 0),
        };
      },
    }),
    {
      name: 'aether-cart-storage',
      // Don't persist isOpen state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
