import { NextRequest, NextResponse } from 'next/server';
import { querySimilar } from '@/lib/pinecone';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { userId, query, topK } = await req.json();
  if (!userId || !query) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  if (!process.env.PINECONE_API_KEY) {
    return NextResponse.json({ matches: [], offline: true });
  }
  const matches = await querySimilar({ userId, query, topK: topK ?? 8 });
  return NextResponse.json({ matches });
}
