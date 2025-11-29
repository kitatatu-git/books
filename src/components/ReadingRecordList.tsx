'use client';

import { ReadingRecordWithBook } from '@/types';
import StarRating from './StarRating';

type ReadingRecordListProps = {
  records: ReadingRecordWithBook[];
  onRecordClick: (record: ReadingRecordWithBook) => void;
  currentUserId?: number;
};

export default function ReadingRecordList({
  records,
  onRecordClick,
  currentUserId,
}: ReadingRecordListProps) {
  const parseAuthors = (authorsJson: string | null): string[] => {
    if (!authorsJson) return [];
    try {
      return JSON.parse(authorsJson);
    } catch {
      return [];
    }
  };

  const parseTags = (tagsJson: string | null): string[] => {
    if (!tagsJson) return [];
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [];
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '日付不明';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        まだ読書記録がありません。<br />
        上の検索フォームから本を追加してみましょう！
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {records.map((record) => {
        const authors = parseAuthors(record.book.authors);
        const tags = parseTags(record.tags);
        const isOwnRecord = currentUserId ? record.userId === currentUserId : true;
        return (
          <div
            key={record.id}
            onClick={() => onRecordClick(record)}
            className="relative bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
          >
            {!isOwnRecord && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-gray-500/80 text-white text-xs rounded z-10">
                他のユーザー
              </div>
            )}
            <div className="flex gap-4 p-4">
              {record.book.thumbnail && (
                <img
                  src={record.book.thumbnail}
                  alt={record.book.title}
                  className="w-20 h-28 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                  {record.book.title}
                </h3>
                {authors.length > 0 && (
                  <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                    {authors.join(', ')}
                  </p>
                )}
                <div className="mb-2">
                  <StarRating rating={record.rating} size="sm" />
                </div>
                <p className="text-xs text-gray-500">
                  読了日: {formatDate(record.finishedDate)}
                </p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-500 text-xs">
                        +{tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {record.review && (
              <div className="px-4 pb-4">
                <p className="text-sm text-gray-700 line-clamp-3 bg-gray-50 p-3 rounded">
                  {record.review}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
