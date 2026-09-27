import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
  showLabel = false
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const activeValue = hoverValue || value || 0;

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Rating">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => {
                if (!readOnly && onChange) {
                  onChange(star);
                }
              }}
              onMouseEnter={() => !readOnly && setHoverValue(star)}
              onMouseLeave={() => !readOnly && setHoverValue(0)}
              className={`p-0.5 rounded transition-transform ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-115 active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400'
              }`}
              title={`${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={`transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                    : 'text-zinc-600 hover:text-zinc-500'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && value > 0 && (
        <span className="text-xs font-semibold text-amber-300 ml-1">
          {Number(value).toFixed(1)}
        </span>
      )}
    </div>
  );
}
