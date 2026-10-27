'use client';

import { ShoppingBag, X, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState, useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotals } = useCartStore();
  const { subtotal } = getTotals();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 w-full sm:w-[380px] h-full z-50 glass-panel border-l border-white/10 p-5 flex flex-col justify-between transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-burgundy-bright" />
              <h3 className="font-bold font-display text-white text-sm">ATELIER BAG</h3>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1 scrollbar-hide">
            {items.length === 0 ? (
              <p className="text-gray-500 text-xs text-center mt-10 font-mono">Your bag is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-3 bg-black/40 border border-white/5 p-2 rounded-xl">
                  {/* Thumbnail Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-br from-white/5 to-white/0 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.colorHex }} />
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-white text-xs font-bold line-clamp-1">{item.name}</h4>
                    <p className="text-gray-400 text-[10px] font-mono mt-0.5">{item.colorName} / {item.size}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 border border-white/10 rounded-md px-1.5 py-0.5">
                        <button 
                          onClick={() => item.qty > 1 ? updateQuantity(item.id, item.qty - 1) : removeItem(item.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white text-[10px] font-mono w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-mono text-xs">${(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 space-y-3 mt-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400">SUBTOTAL:</span>
            <span className="text-base font-bold text-white">${mounted ? subtotal.toFixed(2) : '0.00'}</span>
          </div>
          <button 
            onClick={onCheckout} 
            disabled={items.length === 0}
            className="w-full bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center space-x-2 shadow-xl shadow-burgundy-accent/30 active:scale-95 transition-all"
          >
            <span>CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
