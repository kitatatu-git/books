import { firestore, Timestamp } from '@/lib/firebase-admin';
import crypto from 'crypto';

// シンプルなパスワードハッシュ（本番環境ではbcryptなどを使用してください）
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function getUserByName(name: string) {
  const usersRef = firestore.collection('users');
  const snapshot = await usersRef.where('name', '==', name).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as { id: string; name: string; password: string; createdAt: Date };
}

export async function createUser(name: string, password: string) {
  const hashedPassword = hashPassword(password);
  const usersRef = firestore.collection('users');

  const docRef = await usersRef.add({
    name,
    password: hashedPassword,
    createdAt: Timestamp.now(),
  });

  const doc = await docRef.get();
  return {
    id: doc.id,
    ...doc.data(),
  } as { id: string; name: string; password: string; createdAt: Date };
}

export async function getUserById(id: string) {
  const docRef = firestore.collection('users').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  } as { id: string; name: string; password: string; createdAt: Date };
}
