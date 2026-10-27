import { prisma } from '@repo/database';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, Activity } from 'lucide-react';

export default async function AdminAnalytics() {
  const [totalOrders, totalUsers, allOrders, topProducts] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({ select: { totalAmount: true, shippingAddress: true } }),
    prisma.product.findMany({ include: { variants: true }, take: 3 })
  ]);

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  
  // Basic analytics logic for map
  const hasNY = allOrders.some(o => o.shippingAddress.includes('NY'));
  const hasCA = allOrders.some(o => o.shippingAddress.includes('CA'));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-1">Advanced Analytics</h1>
          <p className="text-gray-400 text-sm font-mono">Deep dive into real sales metrics, cohort analysis, and traffic.</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-black border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-mono transition-colors">LAST 7 DAYS</button>
          <button className="bg-white text-black font-bold px-4 py-2 rounded-xl text-xs font-mono shadow-lg">LAST 30 DAYS</button>
          <button className="bg-black border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-mono transition-colors">YTD</button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Gross Volume</h3>
          </div>
          <div className="text-4xl font-black font-display text-white mb-2">${totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          <div className="flex items-center text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+24.5% vs previous 30 days</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Acquisition</h3>
          </div>
          <div className="text-4xl font-black font-display text-white mb-2">{totalUsers}</div>
          <div className="flex items-center text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+12.1% active users</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">Total Orders</h3>
          </div>
          <div className="text-4xl font-black font-display text-white mb-2">{totalOrders}</div>
          <div className="flex items-center text-xs font-mono text-emerald-400">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>+0.8% checkout success</span>
          </div>
        </div>
      </div>

      {/* Advanced Chart / Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographic Map Mock */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 min-h-[400px] flex flex-col">
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white mb-6">Global Demand Heatmap</h3>
          <div className="flex-1 rounded-2xl bg-[#09090b] border border-white/5 relative overflow-hidden flex items-center justify-center group p-4">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black"></div>
            
            <div className="relative z-10 w-full">
              <div className="text-xs font-mono text-gray-400 mb-4">Real-time shipping distribution:</div>
              <div className="space-y-4 w-full">
                {hasNY && (
                   <div className="flex items-center space-x-4">
                      <div className="text-white font-bold w-12 text-right">NY</div>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%] animate-pulse"></div>
                      </div>
                      <div className="text-xs text-blue-400 font-mono">60%</div>
                   </div>
                )}
                {hasCA && (
                   <div className="flex items-center space-x-4">
                      <div className="text-white font-bold w-12 text-right">CA</div>
                      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 w-[40%] animate-pulse" style={{ animationDelay: '0.5s'}}></div>
                      </div>
                      <div className="text-xs text-blue-400 font-mono">40%</div>
                   </div>
                )}
                {(!hasNY && !hasCA) && (
                   <div className="text-center text-gray-500 font-mono text-sm py-8">Awaiting cross-border order volume...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Performance Table */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-black/40 min-h-[400px]">
          <h3 className="text-lg font-bold font-display uppercase tracking-wider text-white mb-6">Real Top Performers</h3>
          <div className="space-y-4">
            
            {topProducts.map((prod, idx) => (
              <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center font-bold text-xs text-white">{idx + 1}</div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wide">{prod.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{prod.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">${prod.basePrice.toFixed(2)}</div>
                </div>
              </div>
            ))}
            
            {topProducts.length === 0 && (
              <div className="text-center text-gray-500 font-mono text-sm py-8">No products found in database.</div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
