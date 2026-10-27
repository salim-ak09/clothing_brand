import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/10 bg-[#050507] pt-8 pb-8 px-4 sm:px-8 md:px-12 lg:px-16 mt-20 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
        <div>© 2026 AETHER LUXURY APPAREL. ALL RIGHTS RESERVED.</div>
        <div className="flex space-x-6">
          <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
        </div>
      </div>
    </footer>
  );
}
