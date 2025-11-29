import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { attendance } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attendanceId = parseInt(id);

    if (isNaN(attendanceId)) {
      return NextResponse.json(
        { error: 'Invalid attendance ID' },
        { status: 400 }
      );
    }

    const { status, location, tasks, consultation } = await request.json();

    const updateData: any = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (location !== undefined) updateData.location = location;
    if (tasks !== undefined) updateData.tasks = tasks;
    if (consultation !== undefined) updateData.consultation = consultation;

    const result = await db
      .update(attendance)
      .set(updateData)
      .where(eq(attendance.id, attendanceId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
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
    const attendanceId = parseInt(id);

    if (isNaN(attendanceId)) {
      return NextResponse.json(
        { error: 'Invalid attendance ID' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(attendance)
      .where(eq(attendance.id, attendanceId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete attendance:', error);
    return NextResponse.json(
      { error: 'Failed to delete attendance' },
      { status: 500 }
    );
  }
}
