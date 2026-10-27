import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    // Placeholder for Meilisearch / Algolia logic
    // const results = await meiliClient.index('products').search(query);
    const mockResults = [
      { id: '1', title: 'Burgundy Heavyweight Hoodie', price: 145 },
      { id: '2', title: 'Obsidian Black Hoodie', price: 145 },
    ];
    
    return NextResponse.json({ results: mockResults });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
