'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Maximize, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';

const COLORS = [
  { hex: '#6f1b31', name: 'BURGUNDY RED' },
  { hex: '#09080c', name: 'OBSIDIAN BLACK' },
  { hex: '#e3e1da', name: 'BONE OFF-WHITE' },
  { hex: '#233026', name: 'FOREST GREEN' },
  { hex: '#362742', name: 'ROYAL VIOLET' },
];

const SIZES = ['S', 'M', 'L', 'XL'];

export function StudioConfigurator() {
  const [activeColor, setActiveColor] = useState<{hex: string, name: string}>(COLORS[0] as {hex: string, name: string});
  const [activeSize, setActiveSize] = useState('L');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { addItem } = useCartStore();

  // Sync with prototype.js if it exists
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).appState) {
      (window as any).appState.currentColor = activeColor.hex;
    }
  }, [activeColor]);

  // Sync preview mode state to the 3D Engine
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-preview-mode', { detail: { active: isPreviewMode } }));
    }
  }, [isPreviewMode]);

  const handleAddToCart = () => {
    addItem({
      id: `custom-hoodie-${activeColor.hex}-${activeSize}`,
      productId: 'custom-hoodie',
      variantId: `${activeColor.hex}-${activeSize}`,
      name: 'Custom 450GSM Heavyweight Hoodie',
      price: 145.00,
      qty: 1,
      colorName: activeColor.name,
      colorHex: activeColor.hex,
      size: activeSize,
    });
  };

  return (
    <>
      {/* 3D Interactive Preview Exit Button (in front of 3D model) */}
      {isPreviewMode && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-end pb-24 pointer-events-none transition-all">
          <button 
            onClick={() => setIsPreviewMode(false)}
            className="pointer-events-auto bg-black/80 glass-panel border border-white/20 hover:border-burgundy-bright text-white font-mono font-bold tracking-widest text-xs px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all"
          >
            <X className="w-4 h-4 text-burgundy-bright" />
            <span>EXIT PREVIEW MODE</span>
          </button>
        </div>
      )}

      {/* Main Configurator Panel */}
      <div id="studioPanel" className={`w-full max-w-md lg:w-[420px] glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl relative z-30 pointer-events-auto transition-all duration-700 ${isPreviewMode ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono text-burgundy-bright font-bold uppercase tracking-widest">ATELIER STUDIO</span>
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">SELECT SPECIFICATION</h3>
          </div>
          <button onClick={() => setIsPreviewMode(true)} className="p-2 sm:p-2.5 glass-btn rounded-xl text-gray-300 hover:text-white hover:text-burgundy-bright hover:border-burgundy-bright/50 transition-all group flex items-center space-x-2" title="Enter 3D Preview Mode">
            <span className="text-[9px] font-mono font-bold tracking-widest uppercase hidden sm:block group-hover:text-white">PREVIEW</span>
            <Maximize className="w-4 h-4" />
          </button>
        </div>

      <div className="space-y-4">
        {/* Color Swatches */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] sm:text-[11px] font-mono text-gray-300 uppercase tracking-wider font-semibold">COLOR SPECIFICATION</label>
            <span id="activeColorLabel" className="text-[10px] font-mono text-burgundy-bright font-bold">{activeColor.name}</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((c) => (
              <button 
                key={c.hex}
                onClick={() => {
                  setActiveColor(c);
                  // Fire vanilla event so prototype.js triggers 3D color change
                  if (typeof window !== 'undefined') {
                    const event = new CustomEvent('atelier-color-change', { detail: { hex: c.hex } });
                    window.dispatchEvent(event);
                  }
                }}
                className={`color-swatch w-full aspect-square rounded-xl border border-white/20 transition-transform ${activeColor.hex === c.hex ? 'active-swatch border-burgundy-bright scale-110' : ''}`} 
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Garment Features */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-3 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400">EMBROIDERY</span>
            <span className="text-white font-bold">ÆTHER ARCHIVAL SILICONE</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-gray-400">HARDWARE</span>
            <span className="text-white font-bold">SOLID OXIDIZED GUNMETAL</span>
          </div>
        </div>

        {/* Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] sm:text-[11px] font-mono text-gray-300 uppercase tracking-wider font-semibold">ATELIER FIT SIZE</label>
            <span className="text-[10px] font-mono text-gray-400">BOXY DROPPED FIT</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button 
                key={s}
                onClick={() => setActiveSize(s)}
                className={`size-btn glass-btn py-2 rounded-xl text-xs font-mono transition-all ${activeSize === s ? 'border-burgundy-bright text-burgundy-bright font-bold' : 'text-gray-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-mono text-gray-400">PRICE</div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">$145.00</div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 text-white font-bold px-5 py-3 rounded-xl font-mono text-xs tracking-wider flex items-center space-x-2 shadow-lg shadow-burgundy-bright/60 ring-2 ring-burgundy-bright animate-pulse active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
