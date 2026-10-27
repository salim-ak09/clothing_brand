import { LogOut, Package } from 'lucide-react';
import { auth } from '@/auth';
import { prisma } from '@repo/database';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: true,
        }
      }
    }
  });

  if (!user) {
    redirect('/');
  }

  const displayName = session.user.name || user.email.split('@')[0] || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-5xl mx-auto min-h-screen">
      <div className="glass-panel p-5 sm:p-8 rounded-3xl border border-white/10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-burgundy-accent to-red-600 border border-white/20 flex items-center justify-center font-display font-black text-xl sm:text-2xl text-white shadow-xl">
            {initials}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold font-display text-white uppercase">{displayName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-burgundy-bright/20 text-burgundy-bright border border-burgundy-bright/40 font-bold">{user.loyaltyTier || 'MEMBER'}</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">{user.email}</p>
            <p className="text-[10px] font-mono text-gray-500 mt-0.5">Atelier Member &nbsp; {user.loyaltyPoints || 0} Points</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
            <Package className="w-4 h-4 text-burgundy-bright" />
            <span>RECENT PURCHASES</span>
          </h3>

          {user.orders.length === 0 ? (
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center text-gray-400 text-xs font-mono">
              You haven't made any purchases yet.
            </div>
          ) : (
            user.orders.map((order: any) => (
              <div key={order.id} className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-2.5 gap-2">
                  <div>
                    <span className="text-xs font-mono text-gray-400">#{order.orderNumber}</span>
                    <div className="text-[10px] font-mono text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-green-500/20 text-green-400 border border-green-500/30 font-bold uppercase">{order.status}</span>
                </div>
                
                {order.orderItems.map((item: any, idx: number) => {
                  const config = item.customConfiguration ? JSON.parse(item.customConfiguration) : null;
                  return (
                    <div key={idx} className="flex items-center space-x-3 mt-2">
                      <div className="w-12 h-12 rounded-xl bg-burgundy-accent/40 border border-burgundy-bright/40 flex items-center justify-center font-display font-bold text-xs text-white">Æ</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Product ID: {item.variantId || 'Custom'}</h4>
                        <p className="text-[11px] font-mono text-gray-400">
                          {config ? `Color: ${config.color} | Size: ${config.size}` : `Qty: ${item.quantity}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold font-mono text-white">${item.unitPrice.toFixed(2)}</div>
                        <div className="text-[10px] font-mono text-gray-500">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
