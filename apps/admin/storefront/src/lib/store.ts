import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  colorHex: string;
  size: string;
  price: number;
  title: string;
}

interface StoreState {
  // UI State
  isCartOpen: boolean;
  toggleCart: () => void;
  
  // 3D Model State
  activeColorHex: string;
  setActiveColorHex: (hex: string) => void;
  
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      activeColorHex: '#6f1b31', // Burgundy Red default
      setActiveColorHex: (hex) => set({ activeColorHex: hex }),
      
      cart: [],
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(i => i.id === item.id);
        if (existingItem) {
          return {
            cart: state.cart.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(i => i.id === id ? { ...i, quantity } : i)
      }))
    }),
    {
      name: 'aether-storage',
      partialize: (state) => ({ cart: state.cart }) // Only persist cart
    }
  )
);
