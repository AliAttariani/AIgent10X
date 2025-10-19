import { NextResponse } from 'next/server';
import { healthSnapshot } from '@/lib/health';

export async function GET() {
  const env = {
    CLERK: Boolean(process.env.CLERK),
    STRIPE: Boolean(process.env.STRIPE),
  } as const;

  return NextResponse.json({
    ok: true,
    env,
    deps: healthSnapshot.versions,
  });
}
