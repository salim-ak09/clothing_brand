import { prisma } from '@repo/database';
import OrdersClient from './client';

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return <OrdersClient initialOrders={orders} />;
}
