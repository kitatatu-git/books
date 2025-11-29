import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { attendance } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let records;
    if (date) {
      records = await db
        .select()
        .from(attendance)
        .where(eq(attendance.date, date))
        .all();
    } else {
      records = await db.select().from(attendance).all();
    }

    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date, status, location, tasks, consultation } =
      await request.json();

    if (!userId || !date || !status) {
      return NextResponse.json(
        { error: 'userId, date, and status are required' },
        { status: 400 }
      );
    }

    // 同じユーザー・日付の記録が既にあるかチェック
    const existing = await db
      .select()
      .from(attendance)
      .where(and(eq(attendance.userId, userId), eq(attendance.date, date)))
      .limit(1)
      .all();

    if (existing.length > 0) {
      // 既存の記録を更新
      const result = await db
        .update(attendance)
        .set({
          status,
          location: location || null,
          tasks: tasks || null,
          consultation: consultation || null,
          updatedAt: new Date(),
        })
        .where(eq(attendance.id, existing[0].id))
        .returning();

      return NextResponse.json(result[0]);
    }

    // 新規作成
    const result = await db
      .insert(attendance)
      .values({
        userId,
        date,
        status,
        location: location || null,
        tasks: tasks || null,
        consultation: consultation || null,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create/update attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create/update attendance' },
      { status: 500 }
    );
  }
}
