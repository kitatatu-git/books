'use client';

import { useState } from 'react';
import { ReadingRecordWithBook } from '@/types';
import StarRating from './StarRating';
import StarRatingInput from './StarRatingInput';

type ReadingRecordDetailProps = {
  record: ReadingRecordWithBook;
  onUpdate: (data: { rating: number; review: string; tags: string[]; finishedDate: string }) => void;
  onDelete: () => void;
  onClose: () => void;
  currentUserId?: number;
};

export default function ReadingRecordDetail({
  record,
  onUpdate,
  onDelete,
  onClose,
  currentUserId,
}: ReadingRecordDetailProps) {
  const isOwnRecord = currentUserId ? record.userId === currentUserId : true;
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(record.rating);
  const [review, setReview] = useState(record.review || '');
  const [finishedDate, setFinishedDate] = useState(
    record.finishedDate || new Date().toISOString().split('T')[0]
  );

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

  const authors = parseAuthors(record.book.authors);
  const initialTags = parseTags(record.tags);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');

  const commonGenres = [
    '小説', 'ビジネス', '技術書', 'エッセイ', '自己啓発',
    'ノンフィクション', 'ファンタジー', 'ミステリー', 'SF'
  ];

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleUpdate = () => {
    onUpdate({ rating, review, tags, finishedDate });
    setIsEditing(false);
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">読書記録の詳細</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {/* 本の情報 */}
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          {record.book.thumbnail && (
            <img
              src={record.book.thumbnail}
              alt={record.book.title}
              className="w-32 h-44 object-cover rounded shadow flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl mb-2">{record.book.title}</h3>
            {authors.length > 0 && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">著者:</span> {authors.join(', ')}
              </p>
            )}
            {record.book.publishedDate && (
              <p className="text-sm text-gray-500 mb-2">
                発行日: {record.book.publishedDate}
              </p>
            )}
            {record.book.pageCount && (
              <p className="text-sm text-gray-500">
                ページ数: {record.book.pageCount}ページ
              </p>
            )}
          </div>
        </div>

        {record.book.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">概要</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {record.book.description}
            </p>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        {!isEditing ? (
          <>
            {/* 表示モード */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">評価</p>
                <StarRating rating={record.rating} size="lg" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">読了日</p>
                <p className="text-gray-600">{formatDate(record.finishedDate)}</p>
              </div>

              {initialTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">タグ</p>
                  <div className="flex flex-wrap gap-2">
                    {initialTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {record.review && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">感想・メモ</p>
                  <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {record.review}
                  </p>
                </div>
              )}

              {isOwnRecord ? (
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('この読書記録を削除しますか？')) {
                        onDelete();
                      }
                    }}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              ) : (
                <div className="pt-4 text-center text-gray-500 text-sm">
                  この記録は他のユーザーのものです
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* 編集モード */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  評価 <span className="text-red-500">*</span>
                </label>
                <StarRatingInput rating={rating} onChange={setRating} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">読了日</label>
                <input
                  type="date"
                  value={finishedDate}
                  onChange={(e) => setFinishedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* タグ編集 */}
              <div>
                <label className="block text-sm font-medium mb-2">タグ</label>

                {/* 選択済みタグの表示 */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* タグ入力 */}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="タグを入力してEnterまたは,で追加"
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                />

                {/* よく使うジャンル */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">よく使うジャンル:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonGenres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleAddTag(genre)}
                        disabled={tags.includes(genre)}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                          tags.includes(genre)
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">感想・メモ</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="この本の感想を書いてください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded h-32"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setRating(record.rating);
                    setReview(record.review || '');
                    setTags(initialTags);
                    setTagInput('');
                    setFinishedDate(
                      record.finishedDate || new Date().toISOString().split('T')[0]
                    );
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
