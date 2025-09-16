// app/api/headers/route.ts

import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

import { headers } from "next/headers";



export async function GET(request: NextRequest) {

  
  const session = await auth.api.getSession({
    headers: await headers() // some endpoints might require headers
  })
  return NextResponse.json({
    session: session
  });
}
