import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ habits: [], logs: [], offline: true });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ habits: [], logs: [] }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);
  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user.id).eq('is_active', true),
    supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('logged_date', today),
  ]);
  return NextResponse.json({ habits: habits ?? [], logs: logs ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ offline: true }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('habits')
    .insert({ ...body, user_id: user.id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ habit: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ offline: true }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { habit_id, completed } = await req.json();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      { user_id: user.id, habit_id, logged_date: today, completed: !!completed },
      { onConflict: 'habit_id,logged_date' },
    )
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ log: data });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  if (!supabase) return NextResponse.json({ offline: true }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const { error } = await supabase
    .from('habits')
    .update({ is_active: false })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
