"use client";

import { Children, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** index of the card to bring into view, e.g. the selected one */
  scrollToIndex?: number;
  /**
   * true  = slider on phones only; from `sm` up it becomes a normal grid
   *         (no arrows, no dots, no dragging)
   * false = slider on every screen size
   */
  mobileOnly?: boolean;
  /** grid classes used from `sm` up when mobileOnly is true */
  gridClassName?: string;
  /** tip shown under the slider on phones, "" to hide */
  hint?: string;
  className?: string;
};

export default function CardCarousel({
  children,
  scrollToIndex,
  mobileOnly = false,
  gridClassName = "sm:grid-cols-3",
  hint = "Swipe to see more",
  className,
}: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const items = Children.toArray(children);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  // bring the chosen card into view (e.g. when coming back from review)
  useEffect(() => {
    if (api && typeof scrollToIndex === "number" && scrollToIndex >= 0) {
      api.scrollTo(scrollToIndex, true);
    }
  }, [api, scrollToIndex]);

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          breakpoints: mobileOnly
            ? // from sm up the slider switches itself off and the grid takes over
              { "(min-width: 640px)": { active: false } }
            : // finger swipes the cards on phones; arrows on sm and up
              { "(min-width: 640px)": { watchDrag: false } },
        }}
        aria-label="Choose an option"
      >
        {/* py-2 stops the selected card's shadow from being clipped */}
        <CarouselContent
          className={cn(
            "-ml-3 py-2",
            mobileOnly
              ? cn("sm:ml-0 sm:grid sm:gap-4", gridClassName)
              : "sm:-ml-4",
          )}
        >
          {items.map((child, i) => (
            <CarouselItem
              key={i}
              className={cn(
                "basis-[85%] pl-3 [&>*]:h-full",
                mobileOnly
                  ? "sm:min-w-0 sm:basis-auto sm:pl-0"
                  : "sm:basis-1/2 sm:pl-4 lg:basis-1/3",
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* arrows: never on phones (swipe instead).
            sm:disabled:hidden hides an arrow when there is nothing to scroll
            in that direction (start / end / all cards fit). */}
        {items.length > 1 && !mobileOnly && (
          <>
            <CarouselPrevious className="-left-3 hidden size-10 border-slate-200 bg-white shadow-md sm:flex sm:disabled:hidden lg:-left-5" />
            <CarouselNext className="-right-3 hidden size-10 border-slate-200 bg-white shadow-md sm:flex sm:disabled:hidden lg:-right-5" />
          </>
        )}
      </Carousel>

      {/* dots + counter (only when there is more than one slide to scroll to) */}
      {count > 1 && (
        <div
          className={cn(
            "mt-2 flex flex-col items-center gap-1.5",
            mobileOnly && "sm:hidden",
          )}
        >
          <div className="flex gap-1.5" role="tablist" aria-label="Slides">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40",
                  i === current
                    ? "w-6 bg-[#1F4D36]"
                    : "w-2 bg-slate-300 hover:bg-slate-400",
                )}
              />
            ))}
          </div>
          {hint && (
            <p className="text-xs text-slate-500 sm:hidden">
              {current + 1} of {count} · {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}