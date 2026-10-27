import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiStylist: () => void;
  onOpenAuth: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenAiStylist, onOpenAuth }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-6 pt-24 space-y-5 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-xs font-mono text-burgundy-bright uppercase tracking-widest font-bold">DIRECTORY</span>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <Link href="/" onClick={onClose} className="text-left text-xl sm:text-2xl font-bold font-display text-white hover:text-burgundy-bright transition-colors">HOME</Link>
      <Link href="/shop" onClick={onClose} className="text-left text-xl sm:text-2xl font-bold font-display text-white hover:text-burgundy-bright transition-colors">SHOP</Link>
      <Link href="/about" onClick={onClose} className="text-left text-xl sm:text-2xl font-bold font-display text-white hover:text-burgundy-bright transition-colors">ABOUT US</Link>

      <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
        <button onClick={() => { onOpenAiStylist(); onClose(); }} className="w-full py-3 bg-burgundy-bright/20 border border-burgundy-bright/50 rounded-xl font-mono text-xs text-white uppercase tracking-wider flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-burgundy-bright animate-spin" />
          <span>CONSULT AI STYLIST</span>
        </button>
        <button onClick={() => { onOpenAuth(); onClose(); }} className="w-full py-3 glass-btn rounded-xl font-mono text-xs text-white uppercase tracking-wider">LOGIN / REGISTER</button>
        <div className="text-center text-[10px] font-mono text-gray-500">AETHER DIGITAL ATELIER &copy; 450GSM</div>
      </div>
    </div>
  );
}
