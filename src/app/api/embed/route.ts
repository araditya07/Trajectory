import { NextRequest, NextResponse } from 'next/server';
import { upsertEntry } from '@/lib/pinecone';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { userId, entryId, content, metadata } = await req.json();
  if (!userId || !entryId || !content) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  if (!process.env.PINECONE_API_KEY) {
    return NextResponse.json({ ok: false, reason: 'no PINECONE_API_KEY' });
  }
  await upsertEntry({ userId, entryId, text: content, metadata });
  return NextResponse.json({ ok: true });
}
