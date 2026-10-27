'use server';

import { prisma } from '@repo/database';
import { revalidatePath } from 'next/cache';

export async function updateMockupUrl(assetId: string | undefined, glbUrl: string) {
  if (assetId) {
    await prisma.product3DAsset.update({
      where: { id: assetId },
      data: { glbLowPolyUrl: glbUrl, glbHighPolyUrl: glbUrl }
    });
  } else {
    // create a global one
    await prisma.product3DAsset.create({
      data: {
        glbLowPolyUrl: glbUrl,
        glbHighPolyUrl: glbUrl,
      }
    });
  }
  revalidatePath('/mockup');
  return { success: true };
}
import fs from 'fs';
import path from 'path';

export async function uploadMockupFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const adminUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const storefrontUploadsDir = path.join(process.cwd(), '..', 'storefront', 'public', 'uploads');
    
    if (!fs.existsSync(adminUploadsDir)) fs.mkdirSync(adminUploadsDir, { recursive: true });
    if (!fs.existsSync(storefrontUploadsDir)) fs.mkdirSync(storefrontUploadsDir, { recursive: true });

    const adminPath = path.join(adminUploadsDir, uniqueFilename);
    const storefrontPath = path.join(storefrontUploadsDir, uniqueFilename);
    
    fs.writeFileSync(adminPath, buffer);
    fs.writeFileSync(storefrontPath, buffer);
    
    return { success: true, url: `/uploads/${uniqueFilename}` };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
