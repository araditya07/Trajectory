// Pinecone integrated-embedding index. The index itself owns the embed model
// (llama-text-embed-v2), so we send raw text — no separate OpenAI/HF call.
//
// Index field map assumed: text content lives in `chunk_text` (Pinecone default
// for integrated indexes). If your index uses a different field name, change it
// in upsertEntry() and querySimilar() below.

import { Pinecone } from '@pinecone-database/pinecone';

let _client: Pinecone | null = null;

export function getPinecone(): Pinecone | null {
  if (_client) return _client;
  const key = process.env.PINECONE_API_KEY;
  if (!key) return null;
  _client = new Pinecone({ apiKey: key });
  return _client;
}

export function getIndex() {
  const client = getPinecone();
  if (!client) return null;
  const name = process.env.PINECONE_INDEX || 'trajectory';
  return client.index(name);
}

export async function upsertEntry(opts: {
  userId: string;
  entryId: string;
  text: string;
  metadata?: Record<string, string | number | boolean>;
}) {
  const idx = getIndex();
  if (!idx) return;
  await idx.namespace(opts.userId).upsertRecords([
    {
      _id: opts.entryId,
      chunk_text: opts.text,
      ...(opts.metadata ?? {}),
    } as any,
  ]);
}

export interface SimilarHit {
  id: string;
  score: number;
  text?: string;
  metadata?: Record<string, any>;
}

export async function querySimilar(opts: {
  userId: string;
  query: string;
  topK?: number;
}): Promise<SimilarHit[]> {
  const idx = getIndex();
  if (!idx) return [];
  const res = await idx.namespace(opts.userId).searchRecords({
    query: { topK: opts.topK ?? 8, inputs: { text: opts.query } },
  } as any);
  const hits = (res as any)?.result?.hits ?? [];
  return hits.map((h: any) => ({
    id: h._id ?? h.id,
    score: h._score ?? h.score ?? 0,
    text: h.fields?.chunk_text ?? h.metadata?.chunk_text,
    metadata: h.fields ?? h.metadata,
  }));
}
