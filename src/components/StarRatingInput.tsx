'use client';

import { useState } from 'react';

type StarRatingInputProps = {
  rating: number;
  onChange: (rating: number) => void;
};

export default function StarRatingInput({ rating, onChange }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newRating = starIndex + (isHalf ? 0.5 : 1);
    onChange(newRating);
  };

  const handleMouseMove = (starIndex: number, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(starIndex + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStar = (index: number) => {
    const displayRating = hoverRating || rating;
    const difference = displayRating - index;

    let starClass = 'text-gray-300';
    let halfStar = false;

    if (difference >= 1) {
      starClass = 'text-yellow-400';
    } else if (difference >= 0.5) {
      halfStar = true;
    }

    return (
      <button
        key={index}
        type="button"
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isHalf = x < rect.width / 2;
          handleClick(index, isHalf);
        }}
        className="text-4xl transition-colors focus:outline-none relative cursor-pointer"
      >
        {halfStar ? (
          <span className="relative inline-block">
            <span className="text-gray-300">★</span>
            <span
              className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
              style={{ width: '50%' }}
            >
              ★
            </span>
          </span>
        ) : (
          <span className={starClass}>★</span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </div>
      {rating > 0 && (
        <span className="text-sm text-gray-600">
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );
}
