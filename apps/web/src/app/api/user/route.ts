// app/api/headers/route.ts

import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

import { headers } from "next/headers";



export async function GET(request: NextRequest) {

  
  const session = await auth.api.getSession({
    headers: await headers() // some endpoints might require headers
  })


  const token = await auth.api.getAccessToken({
    body: {
      providerId: "test-app-local", // or any other provider id
      accountId: "VNfiJSgbhPmkYgpNmxzrLZHOXkmfBGXl", // optional, if you want to get the access token for a specific account
      userId: session?.user.id, // optional, if you don't provide headers with authenticated token
    },
    headers: await headers(),
  });


  return NextResponse.json({
    session: session,
    token: token

  });
}
