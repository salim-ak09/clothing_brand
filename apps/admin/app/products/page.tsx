import { prisma } from '@repo/database';
import ProductsClient from './ProductsClient';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true }
  });

  return <ProductsClient initialProducts={products} />;
}
