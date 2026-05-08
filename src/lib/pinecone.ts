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
  const idx = process.env.PINECONE_INDEX || 'trajectory-entries';
  return client.index(idx);
}

export async function upsertEntry(opts: {
  userId: string;
  entryId: string;
  vector: number[];
  metadata: Record<string, any>;
}) {
  const idx = getIndex();
  if (!idx) return;
  await idx.namespace(opts.userId).upsert([
    { id: opts.entryId, values: opts.vector, metadata: opts.metadata },
  ]);
}

export async function querySimilar(opts: {
  userId: string;
  vector: number[];
  topK?: number;
}) {
  const idx = getIndex();
  if (!idx) return [];
  const res = await idx.namespace(opts.userId).query({
    vector: opts.vector,
    topK: opts.topK ?? 8,
    includeMetadata: true,
  });
  return res.matches ?? [];
}
