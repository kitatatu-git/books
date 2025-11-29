import { NextRequest, NextResponse } from 'next/server';
import { firestore, FieldValue, Timestamp } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let query = firestore.collection('attendance');

    if (date) {
      query = query.where('date', '==', date) as any;
    }

    const snapshot = await query.get();
    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
    const existingSnapshot = await firestore
      .collection('attendance')
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      // 既存の記録を更新
      const existingDoc = existingSnapshot.docs[0];
      await existingDoc.ref.update({
        status,
        location: location || null,
        tasks: tasks || null,
        consultation: consultation || null,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await existingDoc.ref.get();
      return NextResponse.json({
        id: updatedDoc.id,
        ...updatedDoc.data(),
      });
    }

    // 新規作成
    const docRef = await firestore.collection('attendance').add({
      userId,
      date,
      status,
      location: location || null,
      tasks: tasks || null,
      consultation: consultation || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const doc = await docRef.get();
    return NextResponse.json(
      { id: doc.id, ...doc.data() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create/update attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create/update attendance' },
      { status: 500 }
    );
  }
}
