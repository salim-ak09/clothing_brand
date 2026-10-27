'use client';

import { useState } from 'react';
import { ShieldAlert, KeyRound, Mail, ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import { verifyAdminCredentials, verifyAdminOtp, createAuthSession } from './actions';

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('salim@code.com');
  const [password, setPassword] = useState('salim123');
  
  // 2FA state
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [twoFaMethod, setTwoFaMethod] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await verifyAdminCredentials(email, password);
    setLoading(false);

    if (res.success) {
      if (res.requires2fa) {
        setUserId(res.userId || '');
        setTwoFaMethod(res.method || 'authenticator');
        setStep(2);
      } else {
        await createAuthSession(res.userId || '');
        window.location.href = '/'; 
      }
    } else {
      setError(res.error || 'Authentication Failed');
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await verifyAdminOtp(userId, otp);
    if (res.success) {
      await createAuthSession(userId);
      window.location.href = '/'; 
    } else {
      setError(res.error || 'Invalid OTP code.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-burgundy-900/20 via-black to-black opacity-60"></div>
      
      <div className="relative w-full max-w-md">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-burgundy-accent to-burgundy-bright flex items-center justify-center shadow-lg shadow-burgundy-bright/20 border border-white/10">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black font-serif text-white text-center tracking-widest uppercase mb-2">AETHER ADMIN</h2>
          <p className="text-gray-400 text-xs font-mono text-center mb-8">Restricted Access. Level 4 Clearance Required.</p>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center space-x-2 text-red-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Admin Identity</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="salim@code.com" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Master Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-burgundy-bright transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors mt-6 disabled:opacity-50">
                <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPVerify} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">
                  {twoFaMethod === 'authenticator' && "Enter the 6-digit code from Google Authenticator."}
                  {twoFaMethod === 'email' && "An OTP has been sent to your secure email."}
                  {twoFaMethod === 'telegram' && "An OTP has been sent to your Telegram bot."}
                </p>
                <div className="mt-6">
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••" 
                    className="w-48 h-14 bg-black/50 border border-white/20 rounded-lg text-center text-3xl tracking-[0.5em] font-bold text-white focus:border-burgundy-bright focus:outline-none transition-colors mx-auto block" 
                  />
                </div>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-burgundy-bright text-white font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-red-600 transition-colors mt-6 shadow-lg shadow-burgundy-bright/20 disabled:opacity-50">
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify & Login'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
