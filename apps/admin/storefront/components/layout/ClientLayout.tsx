'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { AiStylist } from '@/components/ai/AiStylist';
import { AuthModal } from '@/components/auth/AuthModal';

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

      <main className="relative z-10 w-full">
        {children}
      </main>
    </>
  );
}
