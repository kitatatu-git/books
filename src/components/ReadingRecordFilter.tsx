'use client';

import { useState, useEffect } from 'react';

type ReadingRecordFilterProps = {
  allTags: string[];
  onFilterChange: (filters: {
    searchText: string;
    selectedTags: string[];
  }) => void;
};

export default function ReadingRecordFilter({
  allTags,
  onFilterChange,
}: ReadingRecordFilterProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    onFilterChange({ searchText, selectedTags });
  }, [searchText, selectedTags, onFilterChange]);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedTags([]);
  };

  const displayedTags = showAllTags ? allTags : allTags.slice(0, 10);
  const hasActiveFilters = searchText.length > 0 || selectedTags.length > 0;

  return (
    <div>
      {hasActiveFilters && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            クリア
          </button>
        </div>
      )}

      {/* テキスト検索 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          書籍名・著者名で検索
        </label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="検索キーワードを入力..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">タグで絞り込み</label>
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {allTags.length > 10 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              {showAllTags ? '少なく表示' : `他${allTags.length - 10}件を表示`}
            </button>
          )}
        </div>
      )}

      {/* アクティブフィルター表示 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">適用中のフィルター:</p>
          <div className="flex flex-wrap gap-2">
            {searchText && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                検索: {searchText}
                <button
                  onClick={() => setSearchText('')}
                  className="hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => handleToggleTag(tag)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
