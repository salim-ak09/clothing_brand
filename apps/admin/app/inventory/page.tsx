export default function InventoryManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Stock Controller</h2>
        <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200">
          Sync Pricing Matrix
        </button>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-muted-foreground text-xs uppercase border-b">
            <tr>
              <th className="px-6 py-4">SKU / Variant</th>
              <th className="px-6 py-4">Colorway</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4 text-right">In Stock</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Example row */}
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 font-mono">AE-H-BRG-L</td>
              <td className="px-6 py-4 flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-[#6f1b31]"></div>
                <span>Burgundy Red</span>
              </td>
              <td className="px-6 py-4">L</td>
              <td className="px-6 py-4 text-right font-mono">24</td>
              <td className="px-6 py-4 text-right">
                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  In Stock
                </span>
              </td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="px-6 py-4 font-mono">AE-H-BRG-XL</td>
              <td className="px-6 py-4 flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-[#6f1b31]"></div>
                <span>Burgundy Red</span>
              </td>
              <td className="px-6 py-4">XL</td>
              <td className="px-6 py-4 text-right font-mono text-red-400">2</td>
              <td className="px-6 py-4 text-right">
                <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-[10px] font-bold uppercase tracking-wider">
                  Low Stock
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
