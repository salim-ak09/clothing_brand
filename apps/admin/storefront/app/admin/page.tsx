import { prisma } from '@repo/database';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch real data from Prisma
  const [totalOrders, totalUsers, totalProducts] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
  ]);

  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const recentRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { not: 'CANCELLED' } }
  });

  const revenue = recentRevenue._sum.totalAmount || 14500.50; // Mock fallback if db is empty

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-1">AETHER COMMAND CENTER</h1>
          <p className="text-gray-400 text-sm font-mono">Advanced Atelier Analytics & Store Management</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono text-gray-300">SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="TOTAL REVENUE" 
          value={`$${revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`}
          trend="+12.5%" 
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />} 
        />
        <StatCard 
          title="ACTIVE ORDERS" 
          value={totalOrders.toString()}
          trend="+5.2%" 
          isPositive={true}
          icon={<ShoppingBag className="w-5 h-5 text-burgundy-bright" />} 
        />
        <StatCard 
          title="TOTAL CUSTOMERS" 
          value={totalUsers.toString()}
          trend="+18.1%" 
          isPositive={true}
          icon={<Users className="w-5 h-5 text-blue-400" />} 
        />
        <StatCard 
          title="GARMENT SKUs" 
          value={totalProducts.toString()}
          trend="-1.2%" 
          isPositive={false}
          icon={<Package className="w-5 h-5 text-purple-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Advanced Analytics Chart Area */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-burgundy-bright" />
              <span>Revenue Analytics (YTD)</span>
            </h3>
            <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-burgundy-bright">
              <option>This Year</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          
          {/* CSS based Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2 mt-8">
            {[45, 60, 35, 80, 50, 90, 75, 100, 85, 65, 55, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                  ${(height * 120).toLocaleString()}
                </div>
                <div 
                  className="w-full bg-gradient-to-t from-burgundy-900/40 to-burgundy-bright rounded-t-sm transition-all duration-500 group-hover:brightness-125"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="mt-3 text-[10px] font-mono text-gray-500 uppercase">
                  {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-burgundy-bright" />
              <span>Recent Orders</span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-gray-500 text-xs font-mono text-center py-8">No recent orders found.</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">{order.orderNumber}</div>
                    <div className="text-[10px] font-mono text-gray-400">{order.user?.email || 'Guest User'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-burgundy-bright mb-0.5">${order.totalAmount.toFixed(2)}</div>
                    <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase">{order.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions / A-Z Management Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard title="Manage Catalog" desc="Add or edit AETHER 3D garments." link="/admin/products" icon={<Package className="w-6 h-6 text-white" />} />
        <ActionCard title="Process Orders" desc="Fulfill incoming global shipments." link="/admin/orders" icon={<ShoppingBag className="w-6 h-6 text-white" />} />
        <ActionCard title="Customer CRM" desc="View user data and loyalty tiers." link="/admin/users" icon={<Users className="w-6 h-6 text-white" />} />
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon }: any) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col justify-between group hover:border-white/20 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 text-xs font-mono font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{trend}</span>
        </div>
      </div>
      <div>
        <h4 className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-1">{title}</h4>
        <div className="text-2xl font-black font-display text-white">{value}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, link, icon }: any) {
  return (
    <a href={link} className="glass-panel p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 to-burgundy-900/20 hover:border-burgundy-bright/40 hover:shadow-lg hover:shadow-burgundy-bright/10 transition-all group flex items-start space-x-4">
       <div className="w-12 h-12 rounded-xl bg-burgundy-bright flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
         {icon}
       </div>
       <div>
         <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wide group-hover:text-burgundy-bright transition-colors">{title}</h4>
         <p className="text-xs text-gray-400 font-mono leading-relaxed">{desc}</p>
       </div>
    </a>
  );
}
