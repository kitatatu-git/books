export type User = {
  id: number;
  name: string;
  createdAt: Date;
};

export type Event = {
  id: number;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  userId: number;
  createdAt: Date;
};

export type AttendanceStatus = 'present' | 'vacation' | 'am_off' | 'pm_off';

export type Attendance = {
  id: number;
  userId: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  location: string | null;
  tasks: string | null;
  consultation: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Book = {
  id: number;
  googleBooksId: string;
  title: string;
  authors: string | null; // JSON string
  description: string | null;
  thumbnail: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  categories: string | null; // JSON string
  createdAt: Date;
};

export type ReadingRecord = {
  id: number;
  userId: number;
  bookId: number;
  rating: number; // 1-5
  review: string | null;
  tags: string | null; // JSON array of tags
  finishedDate: string | null; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
};

export type ReadingRecordWithBook = ReadingRecord & {
  book: Book;
};
