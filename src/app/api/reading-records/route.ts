import { NextRequest, NextResponse } from 'next/server';
import { firestore, FieldValue } from '@/lib/firebase-admin';

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

    // 読書記録を取得
    let recordsQuery = firestore.collection('reading_records').orderBy('createdAt', 'desc');

    if (!showAll) {
      recordsQuery = recordsQuery.where('userId', '==', userId) as any;
    }

    const recordsSnapshot = await recordsQuery.get();

    // 関連する書籍情報を取得
    const records = await Promise.all(
      recordsSnapshot.docs.map(async (doc) => {
        const recordData = doc.data();

        // 書籍情報を取得
        const bookDoc = await firestore.collection('books').doc(recordData.bookId).get();
        const bookData = bookDoc.exists ? { id: bookDoc.id, ...bookDoc.data() } : null;

        return {
          id: doc.id,
          userId: recordData.userId,
          bookId: recordData.bookId,
          rating: recordData.rating,
          review: recordData.review || null,
          tags: recordData.tags || null,
          finishedDate: recordData.finishedDate || null,
          createdAt: recordData.createdAt?.toDate?.() || null,
          updatedAt: recordData.updatedAt?.toDate?.() || null,
          book: bookData,
        };
      })
    );

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
    const booksSnapshot = await firestore
      .collection('books')
      .where('googleBooksId', '==', bookData.googleBooksId)
      .limit(1)
      .get();

    let bookId: string;

    if (booksSnapshot.empty) {
      // 書籍が存在しない場合は新規作成
      const bookRef = await firestore.collection('books').add({
        googleBooksId: bookData.googleBooksId,
        title: bookData.title,
        authors: JSON.stringify(bookData.authors || []),
        description: bookData.description || null,
        thumbnail: bookData.thumbnail || null,
        publishedDate: bookData.publishedDate || null,
        pageCount: bookData.pageCount || null,
        categories: JSON.stringify(bookData.categories || []),
        createdAt: FieldValue.serverTimestamp(),
      });
      bookId = bookRef.id;
    } else {
      bookId = booksSnapshot.docs[0].id;
    }

    // 読書記録を作成
    const recordRef = await firestore.collection('reading_records').add({
      userId,
      bookId,
      rating,
      review: review || null,
      tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
      finishedDate: finishedDate || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const recordDoc = await recordRef.get();
    const record = {
      id: recordDoc.id,
      ...recordDoc.data(),
    };

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('Failed to create reading record:', error);
    return NextResponse.json(
      { error: 'Failed to create reading record' },
      { status: 500 }
    );
  }
}
