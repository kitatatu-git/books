import { NextRequest, NextResponse } from 'next/server';
import { firestore, FieldValue } from '@/lib/firebase-admin';

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
    const recordRef = firestore.collection('reading_records').doc(id);
    const recordDoc = await recordRef.get();

    if (!recordDoc.exists) {
      return NextResponse.json(
        { error: 'Reading record not found' },
        { status: 404 }
      );
    }

    const existingRecord = recordDoc.data();
    if (existingRecord?.userId !== userId) {
      return NextResponse.json(
        { error: 'この記録を更新する権限がありません' },
        { status: 403 }
      );
    }

    // Update the record
    await recordRef.update({
      rating,
      review: review || null,
      tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
      finishedDate: finishedDate || null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedDoc = await recordRef.get();
    const result = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    return NextResponse.json(result);
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
    const recordRef = firestore.collection('reading_records').doc(id);
    const recordDoc = await recordRef.get();

    if (!recordDoc.exists) {
      return NextResponse.json(
        { error: 'Reading record not found' },
        { status: 404 }
      );
    }

    const existingRecord = recordDoc.data();
    if (existingRecord?.userId !== userId) {
      return NextResponse.json(
        { error: 'この記録を削除する権限がありません' },
        { status: 403 }
      );
    }

    // Delete the record
    await recordRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete reading record:', error);
    return NextResponse.json(
      { error: 'Failed to delete reading record' },
      { status: 500 }
    );
  }
}
