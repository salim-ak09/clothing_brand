'use server';
import { auth } from '@/auth';
import { prisma } from '@repo/database';

export async function getUserLatestDetails() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      }
    }
  });

  if (!user) return null;

  let addressData: any = {};
  if (user.orders && user.orders.length > 0) {
    try {
      addressData = JSON.parse(user.orders[0]?.shippingAddress || '{}');
    } catch (e) {
      // ignore
    }
  }

  return {
    firstName: user.firstName || addressData.firstName || '',
    lastName: user.lastName || addressData.lastName || '',
    address: user.address || addressData.address || '',
    city: user.city || addressData.city || '',
    state: user.state || addressData.state || '',
    postcode: user.postcode || addressData.postcode || '',
  };
}
