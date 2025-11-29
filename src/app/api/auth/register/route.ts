import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByName } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: 'ユーザー名とパスワードが必要です' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'パスワードは4文字以上にしてください' },
        { status: 400 }
      );
    }

    // ユーザー名が既に存在するかチェック
    const existingUser = await getUserByName(name);
    if (existingUser) {
      return NextResponse.json(
        { error: 'このユーザー名は既に使用されています' },
        { status: 409 }
      );
    }

    // ユーザーを作成
    const user = await createUser(name, password);

    // セッションを作成（クッキーにユーザーIDを保存）
    const response = NextResponse.json(
      { id: user.id, name: user.name },
      { status: 201 }
    );

    response.cookies.set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
    });

    return response;
  } catch (error) {
    console.error('Failed to register user:', error);
    return NextResponse.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    );
  }
}
