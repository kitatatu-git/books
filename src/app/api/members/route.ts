import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const members = await db.select().from(users).all();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const result = await db.insert(users).values({
      name,
      password: hashedPassword
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
