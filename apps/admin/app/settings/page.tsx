import { prisma } from '@repo/database';
import { cookies } from 'next/headers';
import SettingsClient from './SettingsClient';

export default async function AdminSettings() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('aether_admin_auth');
  
  let adminName = 'Admin';
  let adminEmail = 'admin@aether.com';
  let settings = null;
  
  if (auth) {
    const userId = auth.value;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      adminName = user.email?.split('@')[0] || 'Admin';
      adminEmail = user.email || 'admin@aether.com';
      settings = user;
    }
  }

  return <SettingsClient initialAdminName={adminName} initialAdminEmail={adminEmail} settings={settings} />;
}
