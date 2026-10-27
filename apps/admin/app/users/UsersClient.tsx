'use client';

import { useState } from 'react';
import { Search, Mail, ShieldAlert, CheckCircle2, Crown, AlertTriangle } from 'lucide-react';

export default function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [showToast, setShowToast] = useState('');

  const handlePromote = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, loyaltyTier: 'VIP', loyaltyPoints: u.loyaltyPoints + 1000 } : u));
    setShowToast('Customer upgraded to VIP Status and awarded 1000 points.');
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleSendEmail = (email: string) => {
    setShowToast(`Opening encrypted mail composer for ${email}...`);
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleSuspend = (email: string) => {
    if (window.confirm(`Are you sure you want to suspend account: ${email}?`)) {
      setShowToast(`Account ${email} has been suspended.`);
      setTimeout(() => setShowToast(''), 3000);
    }
  };

  return (
    <div className="p-8">
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-bold">{showToast}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight text-white mb-1">Customer CRM</h1>
          <p className="text-gray-400 text-sm font-mono">Manage VIP clients, accounts, and loyalty tiers.</p>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-t-2xl border-x border-t border-white/10 bg-black/40 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search email or ID..." className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" />
        </div>
        <div className="flex space-x-2">
           <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-burgundy-bright cursor-pointer">
             <option>All Tiers</option>
             <option>Standard</option>
             <option>VIP</option>
             <option>Founders</option>
           </select>
        </div>
      </div>

      <div className="overflow-x-auto glass-panel border border-white/10 rounded-b-2xl bg-black/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-mono text-gray-500 tracking-wider">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Loyalty Tier</th>
              <th className="p-4 font-semibold">Points</th>
              <th className="p-4 font-semibold">Orders</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300 font-mono">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center font-bold text-white text-[10px]">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs text-white">{user.email}</div>
                      <div className="text-[10px] text-gray-500 tracking-tighter">ID: {user.id.substring(0,8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs">
                  {user.role === 'ADMIN' ? (
                    <span className="flex items-center space-x-1 text-burgundy-bright font-bold">
                      <ShieldAlert className="w-3 h-3" />
                      <span>ADMIN</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">CUSTOMER</span>
                  )}
                </td>
                <td className="p-4 text-xs font-bold uppercase text-white flex items-center space-x-1 mt-1">
                  {user.loyaltyTier === 'FOUNDER' && <Crown className="w-3 h-3 text-yellow-500" />}
                  {user.loyaltyTier === 'VIP' && <Crown className="w-3 h-3 text-blue-400" />}
                  <span className={user.loyaltyTier === 'FOUNDER' ? 'text-yellow-500' : user.loyaltyTier === 'VIP' ? 'text-blue-400' : 'text-gray-400'}>{user.loyaltyTier || 'STANDARD'}</span>
                </td>
                <td className="p-4 text-xs text-gray-400">{(user.loyaltyPoints || 0).toLocaleString()}</td>
                <td className="p-4 text-xs text-gray-400">{user._count?.orders || 0}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {user.loyaltyTier !== 'VIP' && user.loyaltyTier !== 'FOUNDER' && (
                      <button onClick={() => handlePromote(user.id)} className="p-1.5 text-gray-400 hover:text-blue-400 bg-black border border-white/10 rounded transition-all" title="Promote to VIP">
                        <Crown className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => handleSendEmail(user.email)} className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded transition-all" title="Send Email">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    {user.role !== 'ADMIN' && (
                      <button onClick={() => handleSuspend(user.email)} className="p-1.5 text-gray-400 hover:text-red-400 bg-black border border-white/10 rounded transition-all" title="Suspend Account">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
