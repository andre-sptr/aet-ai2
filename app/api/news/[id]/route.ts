import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    await prisma.news.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Berita dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        summary: body.summary,
        imageUrl: body.imageUrl,
        published: body.published,
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate berita' }, { status: 500 });
  }
}