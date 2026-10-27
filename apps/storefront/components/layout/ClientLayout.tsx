'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { AiStylist } from '@/components/ai/AiStylist';
import { AuthModal } from '@/components/auth/AuthModal';
import { Footer } from '@/components/layout/Footer';
import { Sparkles } from 'lucide-react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();

  if (typeof window !== 'undefined') {
    (window as any).toggleCart = () => setIsCartOpen(!isCartOpen);
    (window as any).toggleAi = () => setIsAiStylistOpen(!isAiStylistOpen);
    (window as any).toggleAuth = () => setIsAuthOpen(!isAuthOpen);
  }

  return (
    <>
      <Navbar 
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onOpenAiStylist={() => setIsAiStylistOpen(true)}
        onOpenAuth={() => console.log('Auth toggle')}
      />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => window.location.href = '/checkout'}
      />
      <AiStylist 
        isOpen={isAiStylistOpen} 
        onClose={() => setIsAiStylistOpen(false)}
      />
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Floating Action Button for AI Stylist */}
      <button 
        onClick={() => setIsAiStylistOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-burgundy-bright hover:bg-red-600 text-white p-4 rounded-full shadow-2xl shadow-burgundy-bright/50 border border-white/20 transition-transform hover:scale-110 flex items-center justify-center group"
        title="Consult AI Stylist"
      >
        <Sparkles className="w-6 h-6 animate-pulse group-hover:animate-none" />
      </button>

      <div id="scrollProgress" className="progress-bar"></div>

      {/* Global Three.js Canvas Container */}
      <div id="webgl-container" className={`interactive ${pathname !== '/' ? 'hidden' : ''}`}>
        <canvas id="hoodieCanvas" className="w-full h-full block"></canvas>
      </div>

      {/* Callout lines overlay for 3D model */}
      <svg id="callout-overlay" className="hidden">
        <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#a81338" />
            </marker>
        </defs>
        <line id="calloutLine" x1="0" y1="0" x2="0" y2="0" className="callout-line" markerEnd="url(#arrowhead)" opacity="0" />
      </svg>

      {/* Hotspot Target Marker */}
      <div id="hotspotPin" className="hotspot-pin opacity-0">
          <div className="w-3 h-3 rounded-full bg-burgundy-bright border border-white animate-pulse shadow-[0_0_15px_rgba(168,19,56,0.8)]"></div>
      </div>

      <main className="relative z-10 w-full pointer-events-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
