'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, BarChart3, Menu, X } from 'lucide-react';
import { clearAuthSession } from './login/actions';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await clearAuthSession();
    window.location.href = '/login';
  };

  const navLinks = [
    { section: 'Overview', links: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 }
    ]},
    { section: 'Management', links: [
      { name: '3D Mockup', href: '/mockup', icon: Package },
      { name: 'Orders', href: '/orders', icon: ShoppingBag },
      { name: 'Catalog', href: '/products', icon: Package },
      { name: 'Customers', href: '/users', icon: Users }
    ]},
    { section: 'System', links: [
      { name: 'Settings', href: '/settings', icon: Settings }
    ]}
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-[60] p-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col bg-[#050507] md:bg-black/40 backdrop-blur-md border-r border-white/10 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black font-serif text-burgundy-bright">Æ</span>
            <span className="font-bold tracking-widest text-sm uppercase text-white">Atelier Admin</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((group, i) => (
            <div key={i}>
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 px-3 mt-4">{group.section}</div>
              {group.links.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

      </aside>
    </>
  );
}
