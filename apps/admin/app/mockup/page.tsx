import { prisma } from '@repo/database';
import MockupClient from './mockup-client';

export default async function AdminMockupPage() {
  const assets = await prisma.product3DAsset.findMany({ take: 1 });
  const currentAsset = assets[0] || null;

  return <MockupClient initialAsset={currentAsset} />;
}
