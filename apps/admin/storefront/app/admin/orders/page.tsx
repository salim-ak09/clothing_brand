import { prisma } from '@repo/database';
import { Search, Eye, Download, CheckCircle2 } from 'lucide-react';

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-1">Global Orders</h1>
          <p className="text-gray-400 text-sm font-mono">Process fulfillment and track international shipments.</p>
        </div>
        <button className="flex items-center space-x-2 bg-black hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-t-2xl border-x border-t border-white/10 bg-black/40 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search tracking or ID..." className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" />
        </div>
        <div className="flex space-x-2">
           <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-burgundy-bright cursor-pointer">
             <option>All Statuses</option>
             <option>Pending</option>
             <option>Shipped</option>
             <option>Delivered</option>
           </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto glass-panel border border-white/10 rounded-b-2xl bg-black/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-mono text-gray-500 tracking-wider">
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300 font-mono">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => {
                const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                
                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold text-xs">{order.orderNumber}</td>
                    <td className="p-4 text-xs">
                      <div>{order.user?.email || 'Guest Checkout'}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{order.shippingAddress}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-400">{date}</td>
                    <td className="p-4 text-xs font-bold text-white">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest border ${
                        order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        order.status === 'SHIPPED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded hover:border-white/30 transition-all" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {order.status === 'PENDING' && (
                          <button className="p-1.5 text-gray-400 hover:text-emerald-400 bg-black border border-white/10 rounded hover:border-emerald-500/30 transition-all" title="Mark as Shipped">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
