import { NextRequest, NextResponse } from 'next/server';
import { embed } from '@/lib/ai/embeddings';
import { querySimilar } from '@/lib/pinecone';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { userId, query, topK } = await req.json();
  if (!userId || !query) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  const vector = await embed(query);
  if (!vector) return NextResponse.json({ matches: [], offline: true });
  const matches = await querySimilar({ userId, vector, topK: topK ?? 8 });
  return NextResponse.json({ matches });
}
