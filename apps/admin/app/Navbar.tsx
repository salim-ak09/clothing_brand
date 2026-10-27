'use client';

import { Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { clearAuthSession } from './login/actions';

export default function Navbar({ adminName }: { adminName: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       alert(`Global search is looking for: "${searchQuery}"`);
       setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await clearAuthSession();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#050507]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between pl-16 md:pl-8">
      {/* Search Bar - Space reserved on left for sidebar toggler on mobile */}
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders, customers, products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright focus:bg-white/10 transition-colors"
          />
        </form>
      </div>

      {/* Admin Profile with Dropdown */}
      <div className="relative ml-4" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 md:space-x-3 hover:bg-white/5 p-1 rounded-xl transition-colors text-left"
        >
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-bold text-white">{adminName}</span>
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Superadmin</span>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-burgundy-bright flex items-center justify-center border border-white/20 shadow-lg shadow-burgundy-bright/20 shrink-0">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 z-50">
            <Link 
              href="/settings" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <div className="h-px bg-white/10 my-1"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
