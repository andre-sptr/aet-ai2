import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: 'Username atau Password salah!' },
    { status: 401 }
  );
}