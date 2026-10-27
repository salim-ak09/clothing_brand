'use client';

import { useState } from 'react';
import { ShieldCheck, Smartphone, Mail, Save, User, KeyRound, Globe, Database, CreditCard, Camera, QrCode } from 'lucide-react';
import { generateTotpSecret, saveSecuritySettings } from './actions';

export default function SettingsClient({ initialAdminName, initialAdminEmail, settings }: any) {
  const [activeTab, setActiveTab] = useState('security');
  const [twoFaEnabled, setTwoFaEnabled] = useState(settings?.twoFaEnabled || false);
  const [defaultMethod, setDefaultMethod] = useState(settings?.twoFaMethod || 'authenticator');
  
  // Profile state
  const [adminName, setAdminName] = useState(initialAdminName);
  const [adminEmail, setAdminEmail] = useState(initialAdminEmail);

  // Security state
  const [totpSecret, setTotpSecret] = useState(settings?.totpSecret || '');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [telegramBotToken, setTelegramBotToken] = useState(settings?.telegramBotToken || '');
  const [telegramChatId, setTelegramChatId] = useState(settings?.telegramChatId || '');

  const [smtpHost, setSmtpHost] = useState(settings?.smtpHost || '');
  const [smtpPort, setSmtpPort] = useState(settings?.smtpPort || '');
  const [smtpUser, setSmtpUser] = useState(settings?.smtpUser || '');
  const [smtpPass, setSmtpPass] = useState(settings?.smtpPass || '');
  const [twoFaEmail, setTwoFaEmail] = useState(settings?.twoFaEmail || '');

  const [showToast, setShowToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTotp = async () => {
    const { secret, qrCodeDataUrl } = await generateTotpSecret(adminEmail);
    setTotpSecret(secret);
    setQrCodeUrl(qrCodeDataUrl);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      twoFaEnabled,
      twoFaMethod: defaultMethod,
      totpSecret,
      telegramBotToken,
      telegramChatId,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      twoFaEmail
    };

    const res = await saveSecuritySettings(formData);
    
    if (res.success) {
      setShowToast('Settings successfully updated.');
    } else {
      setShowToast('Failed to update settings.');
    }
    
    setIsLoading(false);
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto relative">
      {showToast && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-top-4">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-bold">{showToast}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black font-serif uppercase tracking-tight text-white mb-1">System Settings</h1>
        <p className="text-gray-400 text-sm font-mono">Configure platform security, authentication, and global variables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-2">
          <button onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Security & 2FA</button>
          <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>Admin Profile</button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            
            {activeTab === 'security' && (
              <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-burgundy-bright" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Two-Factor Authentication</h2>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mb-8">
                  <div>
                    <div className="font-bold text-white text-sm">Enable 2FA (Recommended)</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1">Require OTP verification on every login</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={twoFaEnabled} onChange={() => setTwoFaEnabled(!twoFaEnabled)} />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-burgundy-bright"></div>
                  </label>
                </div>

                {twoFaEnabled && (
                  <>
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Primary OTP Method</h3>
                    <div className="space-y-3 mb-8">
                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${defaultMethod === 'authenticator' ? 'border-burgundy-bright bg-burgundy-900/20' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                        <input type="radio" name="2fa" value="authenticator" checked={defaultMethod === 'authenticator'} onChange={(e) => setDefaultMethod(e.target.value)} className="hidden" />
                        <Smartphone className={`w-5 h-5 mr-4 ${defaultMethod === 'authenticator' ? 'text-burgundy-bright' : 'text-gray-500'}`} />
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${defaultMethod === 'authenticator' ? 'text-white' : 'text-gray-300'}`}>Google Authenticator</div>
                          <div className="text-[10px] text-gray-500 font-mono">Use a time-based code generator</div>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${defaultMethod === 'telegram' ? 'border-burgundy-bright bg-burgundy-900/20' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                        <input type="radio" name="2fa" value="telegram" checked={defaultMethod === 'telegram'} onChange={(e) => setDefaultMethod(e.target.value)} className="hidden" />
                        <svg className={`w-5 h-5 mr-4 ${defaultMethod === 'telegram' ? 'text-blue-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${defaultMethod === 'telegram' ? 'text-white' : 'text-gray-300'}`}>Telegram Bot</div>
                          <div className="text-[10px] text-gray-500 font-mono">Send OTP via Telegram</div>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${defaultMethod === 'email' ? 'border-burgundy-bright bg-burgundy-900/20' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                        <input type="radio" name="2fa" value="email" checked={defaultMethod === 'email'} onChange={(e) => setDefaultMethod(e.target.value)} className="hidden" />
                        <Mail className={`w-5 h-5 mr-4 ${defaultMethod === 'email' ? 'text-white' : 'text-gray-500'}`} />
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${defaultMethod === 'email' ? 'text-white' : 'text-gray-300'}`}>Encrypted Email (SMTP)</div>
                          <div className="text-[10px] text-gray-500 font-mono">Send OTP via Email</div>
                        </div>
                      </label>
                    </div>

                    {/* Method Specific Configs */}
                    {defaultMethod === 'authenticator' && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <h4 className="font-bold text-sm uppercase">Google Auth Config</h4>
                        {totpSecret ? (
                          <div className="space-y-4">
                            <p className="text-xs text-emerald-400">Secret generated successfully. Save settings to activate.</p>
                            <div className="flex justify-center bg-white p-4 rounded-lg w-max mx-auto">
                              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />}
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] font-mono text-gray-500 uppercase">Secret Key:</span>
                              <div className="font-mono text-sm tracking-widest text-white mt-1">{totpSecret}</div>
                            </div>
                          </div>
                        ) : (
                          <button type="button" onClick={handleGenerateTotp} className="flex items-center space-x-2 bg-burgundy-bright text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <QrCode className="w-4 h-4" />
                            <span>Generate QR & Secret</span>
                          </button>
                        )}
                      </div>
                    )}

                    {defaultMethod === 'telegram' && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <h4 className="font-bold text-sm uppercase">Telegram Config</h4>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Bot Token</label>
                          <input type="text" value={telegramBotToken} onChange={(e) => setTelegramBotToken(e.target.value)} placeholder="123456789:AAHx..." className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Chat ID</label>
                          <input type="text" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="-1001234567" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                        </div>
                      </div>
                    )}

                    {defaultMethod === 'email' && (
                      <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                        <h4 className="font-bold text-sm uppercase">SMTP Config</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">SMTP Host</label>
                            <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">SMTP Port</label>
                            <input type="number" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">SMTP Username</label>
                            <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="user@domain.com" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">SMTP Password</label>
                            <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Target Email for OTP</label>
                          <input type="email" value={twoFaEmail} onChange={(e) => setTwoFaEmail(e.target.value)} placeholder={adminEmail} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-burgundy-bright" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Admin Profile</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Full Name</label>
                    <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Email Address (Login ID)</label>
                    <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-burgundy-bright focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button disabled={isLoading} type="submit" className="bg-white text-black hover:bg-gray-200 px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center space-x-2 transition-colors disabled:opacity-50">
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
