import { NextRequest, NextResponse } from 'next/server';
import { getUserByName, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードが必要です' },
        { status: 400 }
      );
    }

    // ユーザーを検索
    const user = await getUserByName(name);
    if (!user) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // パスワードを確認
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'ユーザー名またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // セッションを作成
    const response = NextResponse.json({
      id: user.id,
      name: user.name,
    });

    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
    });

    return response;
  } catch (error) {
    console.error('Failed to login:', error);
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    );
  }
}
