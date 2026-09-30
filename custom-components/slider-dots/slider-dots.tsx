import { cn } from "@/lib/utils";
import type { CarouselApi } from "@/components/ui/carousel";

export function SliderDots({
  count,
  activeIndex,
  api,
  className,
}: {
  count: number;
  activeIndex: number;
  api?: CarouselApi;
  className?: string;
}) {
  if (count <= 1) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to image ${i + 1}`}
          aria-current={i === activeIndex}
          onClick={() => api?.scrollTo(i)}
          className={cn(
            "h-1.5 rounded-full bg-white/50 transition-all duration-200",
            i === activeIndex ? "w-4 bg-white" : "w-1.5 hover:bg-white/80",
          )}
        />
      ))}
    </div>
  );
}