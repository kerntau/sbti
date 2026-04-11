import { NextRequest, NextResponse } from 'next/server';
import { isValidQQ, sanitizeQQ } from '@/lib/profile';

const sizeMap = new Set(['40', '100', '140', '640']);

export async function GET(request: NextRequest) {
  const qq = sanitizeQQ(request.nextUrl.searchParams.get('qq') ?? '');
  const requestedSize = request.nextUrl.searchParams.get('size') ?? '140';
  const size = sizeMap.has(requestedSize) ? requestedSize : '140';

  if (!isValidQQ(qq)) {
    return NextResponse.json({ message: 'Invalid QQ number' }, { status: 400 });
  }

  const upstream = `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`;
  const response = await fetch(upstream, {
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ message: 'Avatar fetch failed' }, { status: 502 });
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg';
  const bytes = await response.arrayBuffer();

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
