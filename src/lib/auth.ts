import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// シンプルなパスワードハッシュ（本番環境ではbcryptなどを使用してください）
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function getUserByName(name: string) {
  const user = await db.select().from(users).where(eq(users.name, name)).limit(1).get();
  return user || null;
}

export async function createUser(name: string, password: string) {
  const hashedPassword = hashPassword(password);
  const result = await db.insert(users).values({
    name,
    password: hashedPassword,
  }).returning();
  return result[0];
}

export async function getUserById(id: number) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1).get();
  return user || null;
}
