// src/db/schema.ts
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  password: text().notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const events = sqliteTable('events', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  startTime: integer({ mode: 'timestamp' }).notNull(),
  endTime: integer({ mode: 'timestamp' }).notNull(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const attendance = sqliteTable('attendance', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: text().notNull(), // YYYY-MM-DD 形式
  status: text().notNull(), // 'present', 'vacation', 'am_off', 'pm_off'
  location: text(),
  tasks: text(),
  consultation: text(),
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const books = sqliteTable('books', {
  id: integer().primaryKey({ autoIncrement: true }),
  googleBooksId: text().notNull().unique(), // Google Books API ID
  title: text().notNull(),
  authors: text(), // JSON array of authors
  description: text(),
  thumbnail: text(), // Cover image URL
  publishedDate: text(),
  pageCount: integer(),
  categories: text(), // JSON array of categories
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const readingRecords = sqliteTable('reading_records', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  bookId: integer()
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  rating: real().notNull(), // 0.5-5.0 (0.5 increments)
  review: text(),
  tags: text(), // JSON array of tags
  finishedDate: text(), // YYYY-MM-DD 形式
  createdAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
