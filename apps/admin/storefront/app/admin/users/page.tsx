import { prisma } from '@repo/database';
import { Search, Mail, ShieldAlert, MoreVertical } from 'lucide-react';

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-1">Customer CRM</h1>
          <p className="text-gray-400 text-sm font-mono">Manage VIP clients, accounts, and loyalty tiers.</p>
        </div>
      </div>

      {/* Toolbar */}
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

      {/* Table */}
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user) => {
                return (
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
                    <td className="p-4 text-xs font-bold uppercase text-white">
                      {user.loyaltyTier || 'STANDARD'}
                    </td>
                    <td className="p-4 text-xs text-gray-400">{user.loyaltyPoints || 0}</td>
                    <td className="p-4 text-xs text-gray-400">{user._count.orders}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded hover:border-white/30 transition-all">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded hover:border-white/30 transition-all">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
