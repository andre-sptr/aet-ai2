import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data tim' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        position: body.position,
        bio: body.bio,
        photoUrl: body.photoUrl,
        order: body.order || 0,
        socials: body.socials,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah anggota tim' }, { status: 500 });
  }
}