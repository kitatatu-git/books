import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { events } from '@/db/schema';

export async function GET() {
  try {
    const allEvents = await db.select().from(events).all();
    return NextResponse.json(allEvents);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, startTime, endTime, userId } = await request.json();

    if (!title || !startTime || !endTime || !userId) {
      return NextResponse.json(
        { error: 'Title, startTime, endTime, and userId are required' },
        { status: 400 }
      );
    }

    const result = await db
      .insert(events)
      .values({
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId,
      })
      .returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
