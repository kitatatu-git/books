import { NextRequest, NextResponse } from 'next/server';
import { firestore, Timestamp } from '@/lib/firebase-admin';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    const members = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    const docRef = await firestore.collection('users').add({
      name,
      password: hashedPassword,
      createdAt: Timestamp.now(),
    });

    const doc = await docRef.get();
    return NextResponse.json(
      { id: doc.id, ...doc.data() },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
