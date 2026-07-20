"use client";

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z"
        fill={filled ? "#c9a227" : "none"}
        stroke="#c9a227"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function StarRating({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}) {
  if (!onChange) {
    if (value <= 0) return null;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= value} size={size} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="cursor-pointer"
        >
          <Star filled={n <= value} size={size} />
        </button>
      ))}
    </div>
  );
}
