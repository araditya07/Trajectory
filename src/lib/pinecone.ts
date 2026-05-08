// Pinecone client + helpers.
//
// We use Pinecone Inference API to embed text via llama-text-embed-v2 (1024d),
// then upsert/query vectors against the existing `trajectory` index.

import { Pinecone } from '@pinecone-database/pinecone';

let _client: Pinecone | null = null;

const EMBED_MODEL = 'llama-text-embed-v2';

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

async function embedTexts(
  texts: string[],
  inputType: 'passage' | 'query',
): Promise<number[][]> {
  const client = getPinecone();
  if (!client) return [];
  const res = await client.inference.embed(EMBED_MODEL, texts, { inputType });
  const data = (res as any)?.data ?? [];
  return data.map((d: any) => d.values as number[]);
}

export async function upsertEntry(opts: {
  userId: string;
  entryId: string;
  text: string;
  metadata?: Record<string, string | number | boolean>;
}) {
  const idx = getIndex();
  if (!idx) return;
  const [vector] = await embedTexts([opts.text], 'passage');
  if (!vector) return;
  await idx.namespace(opts.userId).upsert([
    {
      id: opts.entryId,
      values: vector,
      metadata: { chunk_text: opts.text, ...(opts.metadata ?? {}) },
    },
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
  const [vector] = await embedTexts([opts.query], 'query');
  if (!vector) return [];
  const res = await idx.namespace(opts.userId).query({
    vector,
    topK: opts.topK ?? 8,
    includeMetadata: true,
  });
  return (res.matches ?? []).map((m) => ({
    id: m.id,
    score: m.score ?? 0,
    text: (m.metadata as any)?.chunk_text,
    metadata: m.metadata as any,
  }));
}
