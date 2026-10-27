import { prisma } from '@repo/database';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-1">Catalog Management</h1>
          <p className="text-gray-400 text-sm font-mono">Control AETHER SKUs, variants, and pricing.</p>
        </div>
        <button className="flex items-center space-x-2 bg-burgundy-bright hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" />
          <span>NEW GARMENT</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-t-2xl border-x border-t border-white/10 bg-black/40 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search SKU or name..." className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" />
        </div>
        <div className="flex space-x-2">
           <select className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-burgundy-bright cursor-pointer">
             <option>All Categories</option>
             <option>Hoodies</option>
             <option>Crewnecks</option>
             <option>Bottoms</option>
             <option>Accessories</option>
           </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto glass-panel border border-white/10 rounded-b-2xl bg-black/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-mono text-gray-500 tracking-wider">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300 font-mono">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce((sum: number, v: any) => sum + v.inventoryQuantity, 0);
                
                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center font-display font-bold text-white text-xs">
                          Æ
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs uppercase tracking-wide">{product.title}</div>
                          <div className="text-[10px] text-gray-500">{product.variants.length} Variants</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-400">{product.sku}</td>
                    <td className="p-4 text-xs uppercase">{product.category}</td>
                    <td className="p-4 text-xs font-bold text-burgundy-bright">${product.basePrice.toFixed(2)}</td>
                    <td className="p-4 text-xs">
                      {totalStock > 0 ? (
                        <span className="text-white">{totalStock} units</span>
                      ) : (
                        <span className="text-red-500 font-bold">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest ${product.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded hover:border-white/30 transition-all">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-400 bg-black border border-white/10 rounded hover:border-red-500/30 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
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
