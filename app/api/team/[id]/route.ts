import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ message: 'Anggota dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus anggota' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        position: body.position,
        bio: body.bio,
        photoUrl: body.photoUrl,
        order: parseInt(body.order),
        socials: body.socials,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update anggota' }, { status: 500 });
  }
}