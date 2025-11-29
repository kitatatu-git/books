import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await getUserById(parseInt(userId));

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Failed to get current user:', error);
    return NextResponse.json({ user: null });
  }
}
