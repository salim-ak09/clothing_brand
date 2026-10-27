import { ReactNode } from 'react';
import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, BarChart3 } from 'lucide-react';
import { clearAuthSession } from './login/actions';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { prisma } from '@repo/database';
import './globals.css';

export const metadata = {
  title: 'AETHER Admin Dashboard',
  description: 'Control center for AETHER storefront',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('aether_admin_auth');
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '';
  const isLogin = pathname.startsWith('/login');
  
  let adminName = 'Admin User';
  if (authCookie && authCookie.value !== 'authenticated-session-token-v1') {
    try {
      const user = await prisma.user.findUnique({ where: { id: authCookie.value } });
      if (user && user.email) adminName = user.email.split('@')[0] || 'Admin User';
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050507] text-white flex font-sans antialiased">
        {/* Sidebar */}
        {!isLogin && authCookie && (
          <Sidebar />
        )}

        {/* Main Content */}
        <main className={`flex-1 flex flex-col overflow-x-hidden ${isLogin ? 'bg-[#050507]' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-[#050507] to-[#050507]'}`}>
          {!isLogin && authCookie && (
            <Navbar adminName={adminName} />
          )}
          {children}
        </main>
      </body>
    </html>
  );
}
