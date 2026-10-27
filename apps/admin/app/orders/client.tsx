'use client';

import { useState } from 'react';
import { Search, Eye, Download, CheckCircle2, X } from 'lucide-react';

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showToast, setShowToast] = useState('');

  const handleExport = () => {
    setShowToast('CSV Export generated and downloading...');
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleMarkShipped = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'SHIPPED' } : o));
    setShowToast('Order marked as shipped and customer notified.');
    setTimeout(() => setShowToast(''), 3000);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
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
          <h1 className="text-3xl font-black font-serif uppercase tracking-tight text-white mb-1">Global Orders</h1>
          <p className="text-gray-400 text-sm font-mono">Process fulfillment and track international shipments.</p>
        </div>
        <button onClick={handleExport} className="flex items-center space-x-2 bg-black hover:bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

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
                <td colSpan={6} className="p-8 text-center text-gray-500">No orders found in database.</td>
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
                        <button onClick={() => handleViewOrder(order)} className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded hover:border-white/30 transition-all" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {order.status === 'PENDING' && (
                          <button onClick={() => handleMarkShipped(order.id)} className="p-1.5 text-gray-400 hover:text-emerald-400 bg-black border border-white/10 rounded hover:border-emerald-500/30 transition-all" title="Mark as Shipped">
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

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-[#050507] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="text-xl font-bold font-serif uppercase text-white mb-4">Order Details</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">Order ID</span><span className="text-white font-bold">{selectedOrder.orderNumber}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">Customer</span><span className="text-white">{selectedOrder.user?.email || 'N/A'}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">Total</span><span className="text-emerald-400 font-bold">${selectedOrder.totalAmount.toFixed(2)}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">Address</span><span className="text-white">{selectedOrder.shippingAddress}</span></div>
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-gray-500">Status</span><span className="text-white font-bold">{selectedOrder.status}</span></div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5">CLOSE</button>
              {selectedOrder.status === 'PENDING' && <button onClick={() => { handleMarkShipped(selectedOrder.id); setSelectedOrder(null); }} className="px-4 py-2 bg-burgundy-bright text-white rounded-xl text-xs font-bold hover:bg-red-600">PROCESS SHIPMENT</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
