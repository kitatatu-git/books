'use client';

import { useState, useEffect, useRef } from 'react';

type BookSearchResult = {
  googleBooksId: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate: string;
  pageCount: number;
  categories: string[];
};

type BookSearchFormProps = {
  onSelectBook: (book: BookSearchResult) => void;
};

export default function BookSearchForm({ onSelectBook }: BookSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'author'>('title');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setStartIndex(0);
      setTotalItems(0);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setStartIndex(0);
      try {
        const prefix = searchType === 'author' ? 'inauthor:' : 'intitle:';
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(prefix + searchQuery)}&startIndex=0`);
        const data = await res.json();
        setSearchResults(data.books || []);
        setTotalItems(data.totalItems || 0);
        setShowResults(true);
      } catch (error) {
        console.error('Failed to search books:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  const handleSelectBook = (book: BookSearchResult) => {
    onSelectBook(book);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextIndex = startIndex + 40;
      const prefix = searchType === 'author' ? 'inauthor:' : 'intitle:';
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(prefix + searchQuery)}&startIndex=${nextIndex}`);
      const data = await res.json();
      setSearchResults([...searchResults, ...(data.books || [])]);
      setStartIndex(nextIndex);
    } catch (error) {
      console.error('Failed to load more books:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = searchResults.length < totalItems;

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex gap-3 mb-3">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'title' | 'author')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
        >
          <option value="title">書籍名</option>
          <option value="author">著者名</option>
        </select>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === 'title' ? '本のタイトルを入力...' : '著者名を入力...'}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto" style={{ top: '100%' }}>
          {searchResults.map((book) => (
            <div
              key={book.googleBooksId}
              onClick={() => handleSelectBook(book)}
              className="flex gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b"
            >
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
                {book.authors.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    {book.authors.join(', ')}
                  </p>
                )}
                {book.publishedDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    発行日: {book.publishedDate}
                  </p>
                )}
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="p-3 border-t bg-gray-50">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    読み込み中...
                  </span>
                ) : (
                  `もっと見る (${searchResults.length} / ${totalItems}件)`
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500" style={{ top: '100%' }}>
          該当する書籍が見つかりませんでした
        </div>
      )}
    </div>
  );
}
