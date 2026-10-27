'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, CheckCircle2, X, Upload, Link as LinkIcon, Package } from 'lucide-react';
import { createGarment, uploadImage, updateGarment } from './actions';

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [showToast, setShowToast] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '10',
    category: 'Hoodie',
    description: '',
    gsmDensity: '450',
    fabricSpec: '100% Combed Organic Cotton',
    images: [] as string[],
    isActive: false
  });

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      stock: '10',
      category: 'Hoodie',
      description: '',
      gsmDensity: '450',
      fabricSpec: '100% Combed Organic Cotton',
      images: [],
      isActive: false
    });
    setEditingId(null);
    setGalleryUrlInput('');
  };

  const handleEdit = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      const totalStock = p.variants ? p.variants.reduce((sum: number, v: any) => sum + v.inventoryQuantity, 0) : 0;
      
      let loadedImages = p.images || [];
      if (p.coverImage && !loadedImages.includes(p.coverImage)) {
        loadedImages = [p.coverImage, ...loadedImages];
      }

      setFormData({
        title: p.title,
        price: p.basePrice.toString(),
        stock: totalStock.toString(),
        category: p.category,
        description: p.description || '',
        gsmDensity: p.gsmDensity?.toString() || '450',
        fabricSpec: p.fabricSpec || '',
        images: loadedImages,
        isActive: p.isActive || false
      });
      setEditingId(id);
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this garment?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setShowToast('Garment deleted successfully.');
      setTimeout(() => setShowToast(''), 3000);
    }
  };

  const toggleRow = (id: string) => {
    if (window.innerWidth < 768) {
      setExpandedRow(prev => prev === id ? null : id);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (!file) continue;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (!base64) return;
        const res = await uploadImage(base64, file.name);
        if (res.success && res.url) {
          setFormData(prev => ({ ...prev, images: [...prev.images, res.url!] }));
        } else {
          alert('Upload failed: ' + res.error);
        }
      };
      reader.readAsDataURL(file);
    }
    
    setLoading(false);
    e.target.value = '';
  };

  const handleAddGalleryUrl = () => {
    if (galleryUrlInput.trim() !== '') {
      setFormData(prev => ({ ...prev, images: [...prev.images, galleryUrlInput.trim()] }));
      setGalleryUrlInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      title: formData.title,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description,
      gsmDensity: parseInt(formData.gsmDensity),
      fabricSpec: formData.fabricSpec,
      coverImage: formData.images[0] || undefined,
      images: formData.images,
      isActive: formData.isActive
    };

    let res;
    if (editingId) {
      res = await updateGarment(editingId, payload);
    } else {
      res = await createGarment(payload);
    }
    
    setLoading(false);
    if (res?.success) {
      setShowModal(false);
      setShowToast(editingId ? 'Garment updated successfully!' : 'New Garment saved to database!');
      resetForm();
      setTimeout(() => window.location.reload(), 1000);
    } else {
      alert('Error saving garment: ' + res?.error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-bold">{showToast}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-serif uppercase tracking-tight text-white mb-1">Garment Catalog</h1>
          <p className="text-gray-400 text-xs md:text-sm font-mono">Manage your brand's clothing items and pricing.</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="flex w-full md:w-auto items-center justify-center space-x-2 bg-burgundy-bright hover:bg-red-600 text-white px-4 py-3 md:py-2 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" />
          <span>NEW GARMENT</span>
        </button>
      </div>

      <div className="glass-panel p-4 rounded-t-2xl border-x border-t border-white/10 bg-black/40 flex items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search code or name..." className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-burgundy-bright" />
        </div>
      </div>

      <div className="overflow-x-auto glass-panel border border-white/10 rounded-b-2xl bg-black/20">
        <table className="w-full text-left border-collapse min-w-full md:min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-[10px] uppercase font-mono text-gray-500 tracking-wider">
              <th className="p-4 font-semibold">Item</th>
              <th className="p-4 font-semibold hidden md:table-cell">Product Code</th>
              <th className="p-4 font-semibold hidden md:table-cell">Price</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right hidden md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-gray-300 font-mono">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No garments found in database.</td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants ? product.variants.reduce((sum: number, v: any) => sum + v.inventoryQuantity, 0) : 0;
                const isExpanded = expandedRow === product.id;
                
                return (
                  <React.Fragment key={product.id}>
                    <tr 
                      className="hover:bg-white/5 transition-colors cursor-pointer md:cursor-default"
                      onClick={() => toggleRow(product.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {product.coverImage || (product.images && product.images.length > 0) ? (
                            <img src={product.coverImage || product.images[0]} alt={product.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center font-bold text-white text-xs shrink-0">Æ</div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs md:text-sm uppercase truncate max-w-[150px] md:max-w-xs">{product.title}</div>
                            <div className="text-[10px] text-gray-500 truncate">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs text-gray-400 hidden md:table-cell">{product.sku}</td>
                      <td className="p-4 text-xs font-bold text-emerald-400 hidden md:table-cell">${product.basePrice.toFixed(2)}</td>
                      <td className="p-4 text-xs">
                        {totalStock > 0 ? <span className="text-white">{totalStock} pcs</span> : <span className="text-red-500 font-bold">Out</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[9px] uppercase font-bold tracking-widest whitespace-nowrap ${product.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                          {product.isActive ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right hidden md:table-cell">
                        <div className="flex justify-end space-x-2">
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(product.id); }} className="p-2 md:p-1.5 text-gray-400 hover:text-white bg-black border border-white/10 rounded transition-all"><Edit3 className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="p-2 md:p-1.5 text-gray-400 hover:text-red-400 bg-black border border-white/10 rounded transition-all"><Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Mobile Expanded Row */}
                    {isExpanded && (
                      <tr className="md:hidden bg-black/40 border-b border-white/5">
                        <td colSpan={6} className="p-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <span>Product Code:</span>
                              <span className="text-white font-mono">{product.sku}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                              <span>Price:</span>
                              <span className="text-emerald-400 font-bold font-mono">${product.basePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end space-x-3 mt-2 border-t border-white/10 pt-3">
                              <button onClick={() => handleEdit(product.id)} className="flex items-center space-x-2 px-4 py-2 text-white bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20"><Edit3 className="w-4 h-4"/> <span>EDIT</span></button>
                              <button onClick={() => handleDelete(product.id)} className="flex items-center space-x-2 px-4 py-2 text-white bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/40"><Trash2 className="w-4 h-4"/> <span>DELETE</span></button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#050507] border border-white/10 rounded-2xl w-full max-w-2xl p-4 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[95vh]">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 p-1 rounded-full"><X className="w-5 h-5"/></button>
            <h2 className="text-xl font-bold font-serif uppercase text-white mb-6 pr-8">
              {editingId ? 'Edit Garment' : 'Create New Garment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Item Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Obsidian Hoodie"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none"
                  >
                    <option value="Hoodie">Hoodie</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Pants">Pants</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.02] p-4 rounded-xl">
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-3 block">Product Images (Multi-Upload)</label>
                <div className="flex flex-col gap-3">
                  
                  {/* URL Input for Gallery */}
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="url"
                        value={galleryUrlInput}
                        onChange={(e) => setGalleryUrlInput(e.target.value)}
                        placeholder="Add image via URL"
                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                      />
                    </div>
                    <button type="button" onClick={handleAddGalleryUrl} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 rounded-lg transition border border-white/5">
                      ADD
                    </button>
                  </div>

                  <div className="flex items-center justify-center my-1">
                    <span className="text-[10px] text-gray-600 font-mono uppercase">OR</span>
                  </div>

                  {/* File Upload for Gallery */}
                  <label className="flex items-center justify-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 cursor-pointer hover:bg-white/10 transition text-xs font-bold text-gray-300">
                    <Upload className="w-4 h-4 mr-2 text-gray-400" />
                    SELECT IMAGES FROM DEVICE
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                  
                  {/* Gallery Previews */}
                  {formData.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} className="h-20 w-20 object-cover rounded-lg border border-white/10 bg-black" />
                          {idx === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-burgundy-bright/90 text-[8px] font-bold text-center text-white py-0.5 rounded-b-lg">
                              MAIN COVER
                            </div>
                          )}
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 md:opacity-0 group-hover:opacity-100 transition shadow-lg"><X className="w-3 h-3"/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Short Description</label>
                <textarea 
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the garment's fit and story..."
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none h-20 resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Price ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="120"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Stock Qty</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Weight (GSM)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.gsmDensity}
                    onChange={(e) => setFormData({ ...formData, gsmDensity: e.target.value })}
                    placeholder="450"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Fabric</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fabricSpec}
                    onChange={(e) => setFormData({ ...formData, fabricSpec: e.target.value })}
                    placeholder="100% Cotton"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" 
                  />
                </div>
              </div>

              {/* Enhanced Product Status Checkbox */}
              <div className="p-4 mt-2 bg-gradient-to-r from-black/80 to-black/40 border border-white/10 rounded-xl">
                <label className="flex items-center space-x-4 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={formData.isActive} 
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                      className="sr-only" 
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                      <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${formData.isActive ? 'text-emerald-400' : 'text-gray-300'} transition-colors`}>
                      {formData.isActive ? 'Product is LIVE' : 'Product is HIDDEN'}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {formData.isActive ? 'Customers can see and purchase this on the storefront.' : 'Saved as a draft. Not visible to customers.'}
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex flex-col md:flex-row justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="w-full md:w-auto px-4 py-3 md:py-2 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5">CANCEL</button>
                <button type="submit" disabled={loading} className="w-full md:w-auto px-4 py-3 md:py-2 bg-burgundy-bright text-white rounded-xl text-xs font-bold hover:bg-red-600 disabled:opacity-50">
                  {loading ? 'SAVING...' : (editingId ? 'UPDATE GARMENT' : 'SAVE GARMENT')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
