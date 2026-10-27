const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.product3DAsset.deleteMany({});
  await prisma.user.deleteMany({});
  
  await prisma.user.create({
    data: {
      email: 'salim@code.com',
      passwordHash: 'salim123',
      role: 'ADMIN',
      loyaltyTier: 'FOUNDER',
      loyaltyPoints: 100000,
    }
  });

  console.log('Seed completed. ONLY Admin injected: salim@code.com / salim123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
