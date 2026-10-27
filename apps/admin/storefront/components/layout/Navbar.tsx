import Link from 'next/link';
import { User, Sparkles, ShoppingBag, Menu, LogOut, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenCart: () => void;
  onOpenAiStylist: () => void;
  onOpenAuth: () => void;
}

export function Navbar({ onOpenMobileMenu, onOpenCart, onOpenAiStylist, onOpenAuth }: NavbarProps) {
  const pathname = usePathname();
  const { getTotals } = useCartStore();
  const { count } = getTotals();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getLinkClasses = (path: string) => {
    return pathname === path 
      ? "nav-link text-burgundy-bright font-bold hover:text-white transition-colors"
      : "nav-link hover:text-white transition-colors";
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 sm:h-20 px-4 sm:px-6 md:px-10 flex items-center justify-between z-50 glass-panel border-b border-white/10">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-burgundy-accent via-burgundy-bright to-black flex items-center justify-center font-black text-white text-base sm:text-lg shadow-lg shadow-burgundy-accent/40 border border-burgundy-bright/40 group-hover:scale-105 transition-transform">
          Æ
        </div>
        <div className="flex flex-col">
          <span className="font-black text-base sm:text-lg tracking-widest text-white font-display leading-tight">AETHER</span>
          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-burgundy-bright uppercase font-semibold">Burgundy Edition</span>
        </div>
      </Link>

      {/* Desktop Navigation Bar */}
      <nav className="hidden lg:flex items-center space-x-7 text-xs font-mono tracking-widest text-gray-400">
        <Link href="/" className={getLinkClasses('/')}>HOME</Link>
        <Link href="/shop" className={getLinkClasses('/shop')}>SHOP</Link>
        <Link href="/about" className={getLinkClasses('/about')}>ABOUT US</Link>
      </nav>

      {/* Right Quick Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {status === 'authenticated' && session?.user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="glass-btn px-3 py-2 rounded-xl text-xs font-mono tracking-wider font-semibold text-white flex items-center space-x-2 hover:bg-white/5 transition-colors"
            >
              <User className="w-4 h-4 text-burgundy-bright" />
              <span className="hidden sm:inline uppercase">{session.user.name || session.user.email?.split('@')[0]}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-panel border border-white/10 rounded-xl shadow-xl overflow-hidden py-1">
                <Link 
                  href="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2.5 text-xs font-mono text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                >
                  <User className="w-4 h-4 text-burgundy-bright" />
                  <span>MY PROFILE</span>
                </Link>
                <button 
                  onClick={() => { signOut(); setIsDropdownOpen(false); }}
                  className="flex items-center space-x-2 px-4 py-2.5 text-xs font-mono text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onOpenAuth} className="glass-btn p-2 sm:p-2.5 rounded-xl text-gray-300 hover:text-white" title="Sign In">
            <User className="w-4 h-4 text-burgundy-bright" />
          </button>
        )}

        <button onClick={onOpenAiStylist} className="glass-btn px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-mono tracking-wider font-semibold text-white flex items-center space-x-1.5 border-burgundy-bright/40 hover:bg-burgundy-bright/30 transition-colors" title="Atelier AI Stylist">
          <Sparkles className="w-3.5 h-3.5 text-burgundy-bright animate-pulse" />
          <span className="hidden md:inline">AI STYLIST</span>
        </button>
        
        <button onClick={onOpenCart} className="relative glass-btn px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-mono tracking-wider font-semibold text-white flex items-center space-x-2 border-burgundy-bright/40 hover:bg-burgundy-bright transition-colors">
          <ShoppingBag className="w-4 h-4 text-burgundy-bright group-hover:text-white" />
          <span className="hidden md:inline">CART</span>
          {mounted && count > 0 && (
            <span className="w-5 h-5 rounded-full bg-burgundy-bright text-white text-[10px] font-mono flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button onClick={onOpenMobileMenu} className="lg:hidden glass-btn p-2 rounded-xl text-gray-300 hover:text-white" aria-label="Toggle Navigation Menu">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
