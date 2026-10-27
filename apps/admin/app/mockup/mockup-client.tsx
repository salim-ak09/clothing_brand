'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Package, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { updateMockupUrl, uploadMockupFile } from './actions';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function MockupClient({ initialAsset }: { initialAsset: any }) {
  const defaultUrl = '/t_shirt_hoodie_3d_model.glb';
  const [url, setUrl] = useState(initialAsset?.glbLowPolyUrl || defaultUrl);
  const [previewUrl, setPreviewUrl] = useState(url);
  const [showToast, setShowToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePreview = () => {
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    setLoading(true);
    await updateMockupUrl(initialAsset?.id, url);
    setLoading(false);
    setShowToast('3D Mockup updated globally across storefront.');
    setTimeout(() => setShowToast(''), 3000);
  };

  const resetToDefault = () => {
    setUrl(defaultUrl);
    setPreviewUrl(defaultUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload-mockup', {
        method: 'POST',
        body: formData,
      });
      
      const res = await response.json();
      
      if (res.success && res.url) {
        setUrl(res.url);
        setPreviewUrl(res.url); // Auto preview when uploaded
      } else {
        alert('Upload failed: ' + res.error);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    }
    
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-bold">{showToast}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black font-serif uppercase tracking-tight text-white mb-1">3D Mockup Manager</h1>
        <p className="text-gray-400 text-sm font-mono">Upload or link your global 3D .glb file for the storefront experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Editor Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5 text-burgundy-bright" />
              <span>Asset Source</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-2 block">Upload GLB Model</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className="w-full bg-black/50 border border-white/10 hover:border-burgundy-bright/50 rounded-lg p-3 flex justify-center items-center text-sm font-mono text-gray-300 transition-colors">
                    {uploading ? 'Uploading...' : 'Click to Upload .glb'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-2 block">Current Active Path</label>
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-gray-400 font-mono cursor-not-allowed"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={resetToDefault}
                  title="Reset to Demo Hoodie"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET TO DEMO</span>
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-burgundy-bright hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-burgundy-bright/20 mt-4 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'SAVING...' : 'PUBLISH GLOBALLY'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-burgundy-bright/30 bg-burgundy-900/10">
            <h3 className="text-xs font-bold text-burgundy-bright uppercase mb-2">Notice: Engine Limits</h3>
            <p className="text-[10px] font-mono text-gray-400">
              The AETHER storefront relies on heavily optimized Draco compressed .glb files. Ensure your assets are compressed and ideally under 2MB for immediate WebGL hydration.
            </p>
          </div>
        </div>

        {/* 3D Canvas Preview */}
        <div className="lg:col-span-2">
          <div className="glass-panel border border-white/10 rounded-2xl bg-[#09090b] relative overflow-hidden h-[600px] w-full flex items-center justify-center">

            {/* Background Gradient */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-black to-black pointer-events-none"></div>

            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">preview</span>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Suspense fallback={null}>
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <Model url={previewUrl} />

                <OrbitControls enableZoom={true} minDistance={2} maxDistance={10} autoRotate={true} autoRotateSpeed={2} />
              </Suspense>
            </Canvas>
          </div>
        </div>

      </div>
    </div>
  );
}
