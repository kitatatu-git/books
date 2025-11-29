import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const startIndex = searchParams.get('startIndex') || '0';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Google Books APIで検索
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40&startIndex=${startIndex}&langRestrict=ja`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Google Books API');
    }

    const data = await response.json();

    // レスポンスを整形
    const books = (data.items || []).map((item: any) => ({
      googleBooksId: item.id,
      title: item.volumeInfo?.title || 'タイトル不明',
      authors: item.volumeInfo?.authors || [],
      description: item.volumeInfo?.description || '',
      thumbnail: item.volumeInfo?.imageLinks?.thumbnail || item.volumeInfo?.imageLinks?.smallThumbnail || '',
      publishedDate: item.volumeInfo?.publishedDate || '',
      pageCount: item.volumeInfo?.pageCount || 0,
      categories: item.volumeInfo?.categories || [],
    }));

    return NextResponse.json({
      books,
      totalItems: data.totalItems || 0,
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    );
  }
}
