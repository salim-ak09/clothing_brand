export default function StudioManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">3D Asset & Configurator Control</h2>
        <button className="bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200">
          Publish Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Controls */}
        <div className="space-y-4 col-span-1">
          <div className="p-5 border rounded-xl bg-card space-y-4">
            <h3 className="font-semibold border-b pb-2 mb-2">Upload Models (.glb)</h3>
            <div className="border-2 border-dashed border-white/20 p-8 rounded-lg flex items-center justify-center text-muted-foreground text-sm cursor-pointer hover:bg-white/5">
              Drag & Drop .glb file here
            </div>
          </div>

          <div className="p-5 border rounded-xl bg-card space-y-4">
            <h3 className="font-semibold border-b pb-2 mb-2">Material Adjuster</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase">Roughness</label>
                <input type="range" className="w-full mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase">Metalness</label>
                <input type="range" className="w-full mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Canvas */}
        <div className="col-span-2 border rounded-xl bg-black min-h-[500px] flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center text-white/20 font-mono tracking-widest text-sm">
            [ WEBGL LIVE PREVIEW ]
          </div>
        </div>
      </div>
    </div>
  );
}
