import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Kegiatan dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus kegiatan' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update kegiatan' }, { status: 500 });
  }
}