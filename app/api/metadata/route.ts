import { NextRequest, NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/services/metadata';

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing URL parameter', {
      status: 400,
    });
  }

  const metadata = await extractMetadata(url);

  return NextResponse.json(metadata);
};
