'use client';

type StarRatingProps = {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
};

export default function StarRating({ rating, size = 'md', showNumber = true }: StarRatingProps) {
  const sizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const difference = rating - index;

    if (difference >= 1) {
      // Full star
      return <span key={index} className={`${sizeClass} text-yellow-400`}>★</span>;
    } else if (difference >= 0.5) {
      // Half star - using CSS to clip the star
      return (
        <span key={index} className={`${sizeClass} relative inline-block`}>
          <span className="text-gray-300">★</span>
          <span
            className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
            style={{ width: '50%' }}
          >
            ★
          </span>
        </span>
      );
    } else {
      // Empty star
      return <span key={index} className={`${sizeClass} text-gray-300`}>★</span>;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </div>
      {showNumber && (
        <span className={`ml-1 ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600`}>
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );
}
