import { prisma } from '@repo/database';
import UsersClient from './UsersClient';

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return <UsersClient initialUsers={users} />;
}
