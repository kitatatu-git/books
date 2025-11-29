'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookSearchForm from '@/components/BookSearchForm';
import ReadingRecordForm from '@/components/ReadingRecordForm';
import ReadingRecordList from '@/components/ReadingRecordList';
import ReadingRecordDetail from '@/components/ReadingRecordDetail';
import ReadingRecordFilter from '@/components/ReadingRecordFilter';
import { ReadingRecordWithBook } from '@/types';

type BookData = {
  googleBooksId: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate: string;
  pageCount: number;
  categories: string[];
};

export default function ReadingLog() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<ReadingRecordWithBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReadingRecordWithBook | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [filters, setFilters] = useState<{
    searchText: string;
    selectedTags: string[];
  }>({ searchText: '', selectedTags: [] });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user, showAllUsers]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();

      if (!data.user) {
        router.push('/login');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Failed to check auth:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecords = async () => {
    try {
      const url = showAllUsers
        ? '/api/reading-records?showAll=true'
        : '/api/reading-records';
      const res = await fetch(url);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reading records:', error);
      setRecords([]);
    }
  };

  const handleSelectBook = (book: BookData) => {
    setSelectedBook(book);
    setShowRecordForm(true);
  };

  const handleSubmitRecord = async (recordData: {
    rating: number;
    review: string;
    tags: string[];
    finishedDate: string;
  }) => {
    if (!selectedBook) return;

    try {
      const res = await fetch('/api/reading-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookData: selectedBook,
          rating: recordData.rating,
          review: recordData.review,
          tags: recordData.tags,
          finishedDate: recordData.finishedDate,
        }),
      });

      if (res.ok) {
        await fetchRecords();
        setShowRecordForm(false);
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Failed to create reading record:', error);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      const res = await fetch(`/api/reading-records/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchRecords();
      }
    } catch (error) {
      console.error('Failed to delete reading record:', error);
    }
  };

  const handleCancelForm = () => {
    setShowRecordForm(false);
    setSelectedBook(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleUpdateRecord = async (recordData: {
    rating: number;
    review: string;
    tags: string[];
    finishedDate: string;
  }) => {
    if (!selectedRecord) return;

    try {
      const res = await fetch(`/api/reading-records/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });

      if (res.ok) {
        await fetchRecords();
        setSelectedRecord(null);
      }
    } catch (error) {
      console.error('Failed to update reading record:', error);
    }
  };

  // すべてのタグを抽出
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    records.forEach((record) => {
      if (record.tags) {
        try {
          const tags: string[] = JSON.parse(record.tags);
          tags.forEach((tag) => tagSet.add(tag));
        } catch {
          // JSON parse error - skip
        }
      }
    });
    return Array.from(tagSet).sort();
  }, [records]);

  // フィルター適用と並び替え
  const filteredRecords = useMemo(() => {
    const filtered = records.filter((record) => {
      // テキスト検索
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const titleMatch = record.book.title.toLowerCase().includes(searchLower);

        let authorsMatch = false;
        if (record.book.authors) {
          try {
            const authors: string[] = JSON.parse(record.book.authors);
            authorsMatch = authors.some((author) =>
              author.toLowerCase().includes(searchLower)
            );
          } catch {
            // JSON parse error - skip
          }
        }

        if (!titleMatch && !authorsMatch) {
          return false;
        }
      }

      // タグフィルター
      if (filters.selectedTags.length > 0) {
        if (!record.tags) return false;

        try {
          const recordTags: string[] = JSON.parse(record.tags);
          const hasMatchingTag = filters.selectedTags.some((tag) =>
            recordTags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        } catch {
          return false;
        }
      }

      return true;
    });

    // 並び替え
    return filtered.sort((a, b) => {
      if (sortBy === 'rating') {
        // 評価が高い順
        return b.rating - a.rating;
      } else {
        // 読了日が新しい順
        const dateA = a.finishedDate ? new Date(a.finishedDate).getTime() : 0;
        const dateB = b.finishedDate ? new Date(b.finishedDate).getTime() : 0;
        return dateB - dateA;
      }
    });
  }, [records, filters, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #2c1810 0%, #3d2817 25%, #4a3428 50%, #3d2817 75%, #2c1810 100%)',
      }}>
        <div className="text-amber-100 text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, #2c1810 0%, #3d2817 25%, #4a3428 50%, #3d2817 75%, #2c1810 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}>
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-amber-100 drop-shadow-lg">📚 読書記録</h1>
          <div className="flex items-center gap-4">
            {user && (
              <div className="px-4 py-2 bg-amber-800/80 text-amber-50 rounded backdrop-blur-sm">
                👤 {user.name}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-700/80 text-white rounded hover:bg-red-600 transition-colors backdrop-blur-sm"
            >
              ログアウト
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-amber-800/80 text-amber-50 rounded hover:bg-amber-700 transition-colors backdrop-blur-sm"
            >
              メニューに戻る
            </Link>
          </div>
        </div>

        {/* 統計（ヘッダーに統合） */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-3 mb-4">
          <div className="flex gap-6 text-xs justify-center items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">読了:</span>
              <span className="font-semibold text-green-600">{records.length}冊</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">平均:</span>
              <span className="font-semibold text-blue-600">
                {records.length > 0
                  ? (records.reduce((sum, r) => sum + r.rating, 0) / records.length).toFixed(1)
                  : '0'}★
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">高評価:</span>
              <span className="font-semibold text-yellow-600">
                {records.filter((r) => r.rating >= 4).length}冊
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">感想:</span>
              <span className="font-semibold text-purple-600">
                {records.filter((r) => r.review && r.review.length > 0).length}冊
              </span>
            </div>
            <div className="ml-4 pl-4 border-l border-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllUsers}
                  onChange={(e) => setShowAllUsers(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700 font-medium">全員の書庫を表示</span>
              </label>
            </div>
          </div>
        </div>

        {/* 書籍追加と検索を横並び */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* 書籍検索フォーム */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow p-4 relative z-30">
            <h2 className="text-lg font-bold mb-3">読んだ本を追加</h2>
            <BookSearchForm onSelectBook={handleSelectBook} />
          </div>

          {/* 検索フィルター */}
          <div className="bg-amber-50/95 backdrop-blur-sm rounded-lg shadow-lg border border-amber-200/50 relative z-10">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-3">絞り込み検索</h2>
              <ReadingRecordFilter
                allTags={allTags}
                onFilterChange={setFilters}
              />
            </div>
          </div>
        </div>

        {/* 読書記録一覧 */}
        <div className="bg-amber-50/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-amber-200/50 relative z-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">読書記録</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">並び替え:</span>
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    sortBy === 'date'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-amber-100'
                  }`}
                >
                  読了日順
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    sortBy === 'rating'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-amber-100'
                  }`}
                >
                  評価順
                </button>
              </div>
              {filteredRecords.length !== records.length && (
                <p className="text-sm text-gray-600">
                  {filteredRecords.length}件 / 全{records.length}件
                </p>
              )}
            </div>
          </div>
          <ReadingRecordList
            records={filteredRecords}
            onRecordClick={(record) => setSelectedRecord(record)}
            currentUserId={user?.id}
          />
        </div>

        {/* 読書記録登録フォーム（モーダル） */}
        {showRecordForm && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ReadingRecordForm
                selectedBook={selectedBook}
                onSubmit={handleSubmitRecord}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        )}

        {/* 読書記録詳細（モーダル） */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-h-[90vh] overflow-y-auto">
              <ReadingRecordDetail
                record={selectedRecord}
                onUpdate={handleUpdateRecord}
                onDelete={async () => {
                  await handleDeleteRecord(selectedRecord.id);
                  setSelectedRecord(null);
                }}
                onClose={() => setSelectedRecord(null)}
                currentUserId={user?.id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
