'use server';

import { prisma } from '@repo/database';
import { cookies } from 'next/headers';
// @ts-ignore
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export async function generateTotpSecret(email: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, 'AetherAdmin', secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
  
  return { secret, qrCodeDataUrl };
}

export async function saveSecuritySettings(formData: any) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('aether_admin_auth');
  if (!authCookie) return { success: false, error: 'Not authenticated' };

  let targetUserId = authCookie.value;

  // Gracefully handle old sessions
  if (targetUserId === 'authenticated-session-token-v1') {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (admin) targetUserId = admin.id;
  }

  try {
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        twoFaEnabled: formData.twoFaEnabled,
        twoFaMethod: formData.twoFaMethod,
        totpSecret: formData.totpSecret,
        telegramBotToken: formData.telegramBotToken,
        telegramChatId: formData.telegramChatId,
        smtpHost: formData.smtpHost,
        smtpPort: formData.smtpPort ? parseInt(formData.smtpPort) : null,
        smtpUser: formData.smtpUser,
        smtpPass: formData.smtpPass,
        twoFaEmail: formData.twoFaEmail,
      } as any
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to update settings' };
  }
}
