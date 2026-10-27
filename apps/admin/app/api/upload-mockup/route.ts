import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });

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
    
    return NextResponse.json({ success: true, url: `/uploads/${uniqueFilename}` });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
