import { NextRequest, NextResponse } from 'next/server';
import { firestore, FieldValue } from '@/lib/firebase-admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, location, tasks, consultation } = await request.json();

    const docRef = firestore.collection('attendance').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    const updateData: any = { updatedAt: FieldValue.serverTimestamp() };
    if (status !== undefined) updateData.status = status;
    if (location !== undefined) updateData.location = location;
    if (tasks !== undefined) updateData.tasks = tasks;
    if (consultation !== undefined) updateData.consultation = consultation;

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    console.error('Failed to update attendance:', error);
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docRef = firestore.collection('attendance').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}
