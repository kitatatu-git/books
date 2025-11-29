import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/client';
import { books, readingRecords } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 読書記録の一覧取得
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // クエリパラメータで全ユーザーの記録を表示するか判定
    const showAll = request.nextUrl.searchParams.get('showAll') === 'true';

    const records = await db
      .select({
        id: readingRecords.id,
        userId: readingRecords.userId,
        bookId: readingRecords.bookId,
        rating: readingRecords.rating,
        review: readingRecords.review,
        tags: readingRecords.tags,
        finishedDate: readingRecords.finishedDate,
        createdAt: readingRecords.createdAt,
        updatedAt: readingRecords.updatedAt,
        book: {
          id: books.id,
          googleBooksId: books.googleBooksId,
          title: books.title,
          authors: books.authors,
          description: books.description,
          thumbnail: books.thumbnail,
          publishedDate: books.publishedDate,
          pageCount: books.pageCount,
          categories: books.categories,
          createdAt: books.createdAt,
        },
      })
      .from(readingRecords)
      .leftJoin(books, eq(readingRecords.bookId, books.id))
      .where(showAll ? undefined : eq(readingRecords.userId, parseInt(userId)))
      .orderBy(readingRecords.createdAt);

    return NextResponse.json(records);
  } catch (error) {
    console.error('Failed to fetch reading records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading records' },
      { status: 500 }
    );
  }
}

// 読書記録の登録
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookData, rating, review, tags, finishedDate } = body;

    if (!bookData || !rating) {
      return NextResponse.json(
        { error: 'Book data and rating are required' },
        { status: 400 }
      );
    }

    // 書籍が既に存在するか確認
    let book = await db
      .select()
      .from(books)
      .where(eq(books.googleBooksId, bookData.googleBooksId))
      .limit(1)
      .get();

    // 書籍が存在しない場合は新規作成
    if (!book) {
      const result = await db
        .insert(books)
        .values({
          googleBooksId: bookData.googleBooksId,
          title: bookData.title,
          authors: JSON.stringify(bookData.authors || []),
          description: bookData.description || null,
          thumbnail: bookData.thumbnail || null,
          publishedDate: bookData.publishedDate || null,
          pageCount: bookData.pageCount || null,
          categories: JSON.stringify(bookData.categories || []),
        })
        .returning();
      book = result[0];
    }

    // 読書記録を作成
    const record = await db
      .insert(readingRecords)
      .values({
        userId: parseInt(userId),
        bookId: book.id,
        rating,
        review: review || null,
        tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
        finishedDate: finishedDate || null,
      })
      .returning();

    return NextResponse.json(record[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create reading record:', error);
    return NextResponse.json(
      { error: 'Failed to create reading record' },
      { status: 500 }
    );
  }
}
