import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  _client = new OpenAI({ apiKey: key });
  return _client;
}

export async function embed(text: string): Promise<number[] | null> {
  const client = getOpenAI();
  if (!client) return null;
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0]?.embedding ?? null;
}
