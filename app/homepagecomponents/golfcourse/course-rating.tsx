interface StarRatingProps {
  count: number;
}

export default function StarRating({ count }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#a8862f">
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9 3,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
      ))}
    </div>
  );
}