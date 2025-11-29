import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { readingRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';

type Params = {
  params: Promise<{ id: string }>;
};

// 読書記録の更新
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { rating, review, tags, finishedDate } = body;

    // First check if the record exists and belongs to the user
    const existingRecord = await db
      .select()
      .from(readingRecords)
      .where(eq(readingRecords.id, parseInt(id)))
      .limit(1)
      .get();

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Reading record not found' },
        { status: 404 }
      );
    }

    if (existingRecord.userId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'この記録を更新する権限がありません' },
        { status: 403 }
      );
    }

    const result = await db
      .update(readingRecords)
      .set({
        rating,
        review: review || null,
        tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
        finishedDate: finishedDate || null,
        updatedAt: new Date(),
      })
      .where(eq(readingRecords.id, parseInt(id)))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update reading record:', error);
    return NextResponse.json(
      { error: 'Failed to update reading record' },
      { status: 500 }
    );
  }
}

// 読書記録の削除
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // First check if the record exists and belongs to the user
    const existingRecord = await db
      .select()
      .from(readingRecords)
      .where(eq(readingRecords.id, parseInt(id)))
      .limit(1)
      .get();

    if (!existingRecord) {
      return NextResponse.json(
        { error: 'Reading record not found' },
        { status: 404 }
      );
    }

    if (existingRecord.userId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'この記録を削除する権限がありません' },
        { status: 403 }
      );
    }

    await db
      .delete(readingRecords)
      .where(eq(readingRecords.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete reading record:', error);
    return NextResponse.json(
      { error: 'Failed to delete reading record' },
      { status: 500 }
    );
  }
}
