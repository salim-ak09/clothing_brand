'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle, Mail, ArrowRight, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserLatestDetails } from './actions';

export default function Checkout() {
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{ id: string, number: string } | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  
  // Registration State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postcode: ''
  });

  useEffect(() => {
    setMounted(true);
    if (status === 'authenticated') {
      getUserLatestDetails().then((data) => {
        if (data) {
          setForm(data);
        }
      });
    }
  }, [status]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          subtotal,
          shippingAddress: form,
          notes: 'Cash on Delivery',
        })
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        setOrderComplete({ id: data.orderId, number: data.orderNumber });
        if (!session?.user) {
          setShowRegisterModal(true);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderComplete) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, orderId: orderComplete.id })
      });

      if (res.ok) {
        await signIn('credentials', { email, password, redirect: false });
        setShowRegisterModal(false);
        router.push('/profile');
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (orderComplete && !showRegisterModal) {
    return (
      <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-3xl mx-auto min-h-screen text-center">
        <div className="glass-panel p-10 rounded-3xl border border-white/10 flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-burgundy-bright mb-6" />
          <h1 className="text-3xl font-black font-display text-white uppercase mb-2">ORDER SECURED</h1>
          <p className="text-gray-400 font-mono mb-6">Order #{orderComplete.number}</p>
          <p className="text-gray-300 text-sm mb-8">Your transaction will be completed via Cash on Delivery. Our dispatch team is preparing your garments.</p>
          <button onClick={() => router.push('/shop')} className="glass-btn px-8 py-3 rounded-xl text-white font-mono text-xs tracking-widest uppercase hover:bg-white/5 transition-colors">
            RETURN TO CATALOG
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto min-h-screen">
      <div className="mb-6">
        <span className="text-[10px] sm:text-xs font-mono text-burgundy-bright font-bold uppercase tracking-widest">ENCRYPTED CHECKOUT</span>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-white uppercase mt-0.5">ORDER DETAILS</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-5">
          <form onSubmit={handleCheckout} className="space-y-5">
            <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-burgundy-bright text-white text-[10px] flex items-center justify-center font-mono font-bold">1</span>
                <span>SHIPPING DESTINATION</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">FIRST NAME</label>
                  <input required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">LAST NAME</label>
                  <input required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">STREET ADDRESS</label>
                <input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">CITY</label>
                  <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">STATE</label>
                  <input required value={form.state} onChange={e => setForm({...form, state: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">POSTCODE</label>
                  <input required value={form.postcode} onChange={e => setForm({...form, postcode: e.target.value})} type="text" className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-burgundy-bright" />
                </div>
              </div>
            </div>

            {/* Payment Block */}
            <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-burgundy-bright text-white text-[10px] flex items-center justify-center font-mono font-bold">2</span>
                <span>PAYMENT METHOD</span>
              </h3>
              
              <div className="p-4 bg-burgundy-bright/10 border border-burgundy-bright/30 rounded-xl flex items-center space-x-3 text-white text-xs font-mono">
                <CheckCircle className="w-4 h-4 text-burgundy-bright" />
                <span>CASH ON DELIVERY (COD) SELECTED</span>
              </div>

              <button disabled={!mounted || loading || items.length === 0} type="submit" className="w-full bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 text-white font-bold py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center space-x-2 shadow-xl shadow-burgundy-accent/30 active:scale-95 transition-all mt-6 disabled:opacity-50">
                <Lock className="w-4 h-4" />
                <span>{loading ? 'PROCESSING...' : `CONFIRM ORDER · $${mounted ? subtotal.toFixed(2) : '0.00'}`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-5">
           <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 sticky top-28">
              <h3 className="font-bold font-display text-white text-sm mb-4">ATELIER SUMMARY</h3>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {!mounted || items.length === 0 ? (
                  <p className="text-gray-500 font-mono text-xs">Your bag is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-burgundy-accent/40 border border-burgundy-bright/40 flex items-center justify-center font-display font-bold text-xs text-white">Æ</div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                            <p className="text-[11px] font-mono text-gray-400">Size {item.size} {item.colorName && `· ${item.colorName}`}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold font-mono text-white">${item.price.toFixed(2)}</div>
                            <div className="text-[10px] font-mono text-gray-500">Qty: {item.qty}</div>
                        </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 mb-4 text-xs font-mono">
                  <div className="flex justify-between text-gray-400">
                      <span>SUBTOTAL</span>
                      <span>${mounted ? subtotal.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                      <span>SHIPPING</span>
                      <span>$0.00</span>
                  </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="font-bold font-display text-white">TOTAL</span>
                  <span className="font-bold font-mono text-white text-lg">${mounted ? subtotal.toFixed(2) : '0.00'}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Register Modal for Guests */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-md glass-panel border border-white/10 rounded-3xl p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setShowRegisterModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white glass-btn rounded-xl">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-8">
              <CheckCircle className="w-12 h-12 text-burgundy-bright mx-auto mb-4" />
              <h2 className="text-2xl font-black font-display text-white uppercase tracking-tight">
                TRACK YOUR ORDER
              </h2>
              <p className="text-gray-400 text-xs font-mono mt-2">
                Save your purchase and track delivery status by creating an Aether account.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors placeholder-gray-600 font-mono"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors placeholder-gray-600 font-mono"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 text-white font-bold py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center space-x-2 shadow-xl shadow-burgundy-accent/30 active:scale-95 transition-all mt-6"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="w-full glass-btn py-3 text-xs font-mono text-gray-400 rounded-xl hover:text-white mt-2"
              >
                CONTINUE AS GUEST
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
