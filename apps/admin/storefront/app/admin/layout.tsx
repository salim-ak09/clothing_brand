import { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, BarChart3 } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050507] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col h-screen sticky top-0 bg-black/40 backdrop-blur-md z-50">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black font-display text-burgundy-bright">Æ</span>
            <span className="font-bold tracking-widest text-sm uppercase">Atelier Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 px-3 mt-4">Overview</div>
          
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-burgundy-bright text-white font-medium text-sm transition-all shadow-lg shadow-burgundy-bright/20">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </Link>

          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 px-3 mt-8">Management</div>
          
          <Link href="/admin/orders" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            <Package className="w-4 h-4" />
            <span>Products</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </Link>

          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 px-3 mt-8">System</div>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-all">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium text-sm transition-all">
            <LogOut className="w-4 h-4" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-[#050507] to-[#050507]">
        {children}
      </main>
    </div>
  );
}
