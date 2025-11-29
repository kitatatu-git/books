// src/db/schema.ts
import { pgTable, serial, text, integer, real, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD 形式
  status: varchar('status', { length: 20 }).notNull(), // 'present', 'vacation', 'am_off', 'pm_off'
  location: text('location'),
  tasks: text('tasks'),
  consultation: text('consultation'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  googleBooksId: varchar('google_books_id', { length: 255 }).notNull().unique(), // Google Books API ID
  title: text('title').notNull(),
  authors: text('authors'), // JSON array of authors
  description: text('description'),
  thumbnail: text('thumbnail'), // Cover image URL
  publishedDate: varchar('published_date', { length: 20 }),
  pageCount: integer('page_count'),
  categories: text('categories'), // JSON array of categories
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const readingRecords = pgTable('reading_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  bookId: integer('book_id')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  rating: real('rating').notNull(), // 0.5-5.0 (0.5 increments)
  review: text('review'),
  tags: text('tags'), // JSON array of tags
  finishedDate: varchar('finished_date', { length: 10 }), // YYYY-MM-DD 形式
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
