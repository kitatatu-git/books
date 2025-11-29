'use client';

import { useState } from 'react';
import StarRatingInput from './StarRatingInput';

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

type ReadingRecordFormProps = {
  selectedBook: BookData;
  onSubmit: (data: { rating: number; review: string; tags: string[]; finishedDate: string }) => void;
  onCancel: () => void;
};

export default function ReadingRecordForm({
  selectedBook,
  onSubmit,
  onCancel,
}: ReadingRecordFormProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [finishedDate, setFinishedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }
    onSubmit({ rating, review, tags, finishedDate });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">読書記録を登録</h2>

      {/* 選択した本の情報 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4 mb-3">
          {selectedBook.thumbnail && (
            <img
              src={selectedBook.thumbnail}
              alt={selectedBook.title}
              className="w-20 h-28 object-cover rounded flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1">{selectedBook.title}</h3>
            {selectedBook.authors.length > 0 && (
              <p className="text-sm text-gray-600 mb-2">
                著者: {selectedBook.authors.join(', ')}
              </p>
            )}
            {selectedBook.publishedDate && (
              <p className="text-xs text-gray-500">
                発行日: {selectedBook.publishedDate}
              </p>
            )}
          </div>
        </div>
        {selectedBook.description && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">概要</p>
            <p className="text-sm text-gray-600 line-clamp-4">
              {selectedBook.description}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* 評価 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            評価 <span className="text-red-500">*</span>
          </label>
          <StarRatingInput rating={rating} onChange={setRating} />
        </div>

        {/* 読了日 */}
        <div>
          <label className="block text-sm font-medium mb-2">読了日</label>
          <input
            type="date"
            value={finishedDate}
            onChange={(e) => setFinishedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* タグ */}
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

        {/* 感想 */}
        <div>
          <label className="block text-sm font-medium mb-2">感想・メモ</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="この本の感想を書いてください..."
            className="w-full px-3 py-2 border border-gray-300 rounded h-32"
          />
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            登録
          </button>
        </div>
      </div>
    </form>
  );
}
