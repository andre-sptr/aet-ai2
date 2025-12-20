import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, summary, imageUrl, published } = body;

    const newNews = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        summary,
        imageUrl,
        published: published || false,
      },
    });

    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat berita' }, { status: 500 });
  }
}