// app/api/headers/route.ts

import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

import { headers } from "next/headers";



export async function GET(request: NextRequest) {
  // Get headers as a plain object
  const headersObj: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})

  return NextResponse.json({
    session: session,
    headers: headersObj,
  });
}
