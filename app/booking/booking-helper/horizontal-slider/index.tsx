"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HorizontalSlider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, children]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow = (visible: boolean) =>
    cn(
      "absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center",
      "rounded-full border border-green-600/20 bg-white text-green-700 shadow-lg",
      "transition-all hover:bg-green-600 hover:text-white md:flex",
      visible ? "opacity-100" : "pointer-events-none opacity-0",
    );

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scroll(-1)}
        className={cn(arrow(canPrev), "-left-3")}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={update}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-4 pt-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={() => scroll(1)}
        className={cn(arrow(canNext), "-right-3")}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}