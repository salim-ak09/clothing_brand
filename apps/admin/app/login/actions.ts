'use server';

import { cookies } from 'next/headers';
import { prisma } from '@repo/database';
// @ts-ignore
import { authenticator } from 'otplib';
import nodemailer from 'nodemailer';

export async function verifyAdminCredentials(email: string, pass: string) {
  const userRecord = await prisma.user.findUnique({ where: { email } });
  
  if (!userRecord || userRecord.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized Access. Identity not verified.' };
  }

  const user = userRecord as any;

  if (user.passwordHash !== pass) {
    return { success: false, error: 'Invalid master password.' };
  }

  // If 2FA is not enabled, just return success
  if (!user.twoFaEnabled) {
    return { success: true, requires2fa: false, userId: user.id };
  }

  const fallbackSecret = user.id.replace(/[^A-Z2-7]/ig, 'A').toUpperCase().substring(0, 16).padEnd(16, 'A');
  const secret = user.totpSecret || fallbackSecret;

  // 2FA IS enabled, we must send OTP if method is email or telegram
  if (user.twoFaMethod === 'email' && user.smtpHost && user.smtpUser && user.twoFaEmail) {
    const otp = authenticator.generate(secret);
    const transporter = nodemailer.createTransport({
      host: user.smtpHost,
      port: user.smtpPort || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: user.smtpUser,
        pass: user.smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Aether Security" <${user.smtpUser}>`,
        to: user.twoFaEmail,
        subject: "Aether Admin Login - OTP Verification",
        text: `Your OTP is: ${otp}\nDo not share this code.`,
      });
    } catch (e) {
      console.error('SMTP Error:', e);
      return { success: false, error: 'Failed to send OTP email.' };
    }
  }

  if (user.twoFaMethod === 'telegram' && user.telegramBotToken && user.telegramChatId) {
    const otp = authenticator.generate(secret);
    try {
      await fetch(`https://api.telegram.org/bot${user.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user.telegramChatId,
          text: `🔐 Aether Admin Login\n\nYour OTP is: *${otp}*\n\nDo not share this code.`,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.error('Telegram Error:', e);
      return { success: false, error: 'Failed to send OTP via Telegram.' };
    }
  }

  return { success: true, requires2fa: true, method: user.twoFaMethod, userId: user.id };
}

export async function verifyAdminOtp(userId: string, otp: string) {
  const userRecord = await prisma.user.findUnique({ where: { id: userId } });
  if (!userRecord) return { success: false, error: 'User not found.' };

  const user = userRecord as any;
  
  // Create a deterministic valid base32 secret if totpSecret is missing
  // Base32 chars: A-Z, 2-7
  const fallbackSecret = user.id.replace(/[^A-Z2-7]/ig, 'A').toUpperCase().substring(0, 16).padEnd(16, 'A');
  const secret = user.totpSecret || fallbackSecret;
  
  // Verify using otplib with a larger window for Email/Telegram (e.g. 5 minutes = 10 steps of 30s)
  authenticator.options = { window: 10 };
  const isValid = authenticator.check(otp, secret);
  
  if (!isValid) {
    return { success: false, error: 'Invalid or expired OTP.' };
  }

  return { success: true };
}

export async function createAuthSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('aether_admin_auth', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  return { success: true };
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete('aether_admin_auth');
}
