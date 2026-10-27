'use client';

import { useState } from 'react';
import { X, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError('Invalid credentials');
        } else {
          router.refresh();
          onClose();
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        // Login immediately after register
        const loginRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (!loginRes?.error) {
          router.refresh();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass-panel border border-white/10 rounded-3xl p-8 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white glass-btn rounded-xl">
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-burgundy-accent to-burgundy-bright flex items-center justify-center mx-auto mb-4 shadow-lg shadow-burgundy-accent/40">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black font-display text-white uppercase tracking-tight">
            {isLogin ? 'Atelier Access' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-xs font-mono mt-2">
            {isLogin ? 'Enter your credentials to continue' : 'Join the exclusive Aether collective'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1.5 ml-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors placeholder-gray-600 font-mono"
                placeholder="citizen@aether.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-400 mb-1.5 ml-1">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors placeholder-gray-600 font-mono"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-burgundy-accent to-burgundy-bright hover:from-burgundy-bright hover:to-red-600 text-white font-bold py-3.5 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center space-x-2 shadow-xl shadow-burgundy-accent/30 active:scale-95 transition-all mt-6 disabled:opacity-50"
          >
            <span>{loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'REGISTER')}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/10 pt-6">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-burgundy-bright font-bold underline decoration-burgundy-bright/30 underline-offset-4">
              {isLogin ? 'Apply Here' : 'Sign In'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
