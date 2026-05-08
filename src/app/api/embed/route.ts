import { NextRequest, NextResponse } from 'next/server';
import { embed } from '@/lib/ai/embeddings';
import { upsertEntry } from '@/lib/pinecone';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { userId, entryId, content, metadata } = await req.json();
  if (!userId || !entryId || !content) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  const vector = await embed(content);
  if (!vector) {
    return NextResponse.json({ ok: false, reason: 'no OPENAI_API_KEY' });
  }
  await upsertEntry({ userId, entryId, vector, metadata: metadata ?? {} });
  return NextResponse.json({ ok: true });
}
