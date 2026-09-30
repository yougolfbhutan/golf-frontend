"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface HeroSlide {
  src: string;
  alt: string;
  /** Small caption shown bottom-right, e.g. the course name. */
  caption?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  headline?: string;
  subheading?: string;
  /** Autoplay interval in ms. Set to 0 to disable autoplay. */
  intervalMs?: number;
}

export default function HeroSlider({
  slides,

  intervalMs = 6000,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const startTimer = useCallback(() => {
    if (!intervalMs) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
  }, [intervalMs, slides.length]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  return (
    <section
      className="relative h-[640px] w-full overflow-hidden bg-slate-900 sm:h-[720px]"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
        </div>
      ))}
      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      {/* Dots */}+{" "}
      <div className="absolute top-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:top-auto sm:bottom-24">
        {" "}
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
      {/* Headline + CTA */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-10 lg:px-10">
        <h1 className="flex flex-wrap items-baseline gap-x-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span>DISCOVER</span>
          <span className="text-white/50">·</span>
          <span>PLAN</span>
          <span className="text-white/50">·</span>
          <span className="text-amber-400">BOOK</span>
          <span className="text-white/50">·</span>
          <span>PLAY</span>
        </h1>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("golf-courses")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#10B759] px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-emerald-900/40 ring-1 ring-white/10 transition-all hover:bg-emerald-600 hover:shadow-emerald-700/50 hover:-translate-y-0.5 active:translate-y-0"
        >
          BOOK NOW
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
