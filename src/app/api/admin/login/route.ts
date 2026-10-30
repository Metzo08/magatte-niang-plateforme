import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD non configuré' }, { status: 500 });
    }
    if (typeof password === 'string' && password === expected) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
