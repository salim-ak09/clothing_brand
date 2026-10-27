'use server';

import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function createGarment(data: { 
  title: string; 
  price: number;
  description: string;
  category: string;
  gsmDensity: number;
  fabricSpec: string;
  coverImage?: string;
  images?: string[];
  stock: number;
  isActive: boolean;
}) {
  try {
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const productCode = `AE-${randomSuffix}`;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + randomSuffix.toLowerCase();

    await prisma.product.create({
      data: {
        title: data.title,
        sku: productCode,
        slug: slug,
        basePrice: data.price,
        description: data.description || 'New Garment',
        category: data.category || 'Apparel',
        gsmDensity: data.gsmDensity,
        fabricSpec: data.fabricSpec,
        coverImage: data.coverImage,
        images: data.images || [],
        isActive: data.isActive,
        variants: {
          create: {
            skuVariant: `${productCode}-DEF`,
            colorName: 'Default',
            colorHex: '#000000',
            size: 'OS',
            inventoryQuantity: data.stock,
          }
        }
      } as any
    });
    revalidatePath('/products');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

import fs from 'fs';
import path from 'path';

export async function uploadImage(base64Data: string, filename: string) {
  try {
    const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }
    const data = matches[2];
    if (!data) throw new Error('No data');
    const buffer = Buffer.from(data, 'base64');
    
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const adminPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
    const storefrontPath = path.join(process.cwd(), '..', 'storefront', 'public', 'uploads', uniqueFilename);
    
    fs.writeFileSync(adminPath, buffer);
    fs.writeFileSync(storefrontPath, buffer);
    
    return { success: true, url: `/uploads/${uniqueFilename}` as string };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateGarment(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        basePrice: data.price,
        description: data.description,
        category: data.category,
        gsmDensity: data.gsmDensity,
        fabricSpec: data.fabricSpec,
        coverImage: data.coverImage,
        images: data.images || [],
        isActive: data.isActive
      } as any,
      include: { variants: true }
    }) as any;

    if (product.variants && product.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: product.variants[0].id },
        data: { inventoryQuantity: data.stock }
      });
    } else {
      await prisma.productVariant.create({
        data: {
          productId: id,
          skuVariant: `${product.sku}-DEF`,
          colorName: 'Default',
          colorHex: '#000000',
          size: 'OS',
          inventoryQuantity: data.stock
        }
      });
    }

    revalidatePath('/products');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
