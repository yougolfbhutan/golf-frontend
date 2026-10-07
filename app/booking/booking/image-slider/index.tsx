"use client";

import Image, { type StaticImageData } from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/** src can be a string path/URL or an imported image file. */
export type Slide = { src: string | StaticImageData; alt: string };

const keyOf = (src: Slide["src"]) => (typeof src === "string" ? src : src.src);

type ImageSliderProps = {
  images: Slide[];
  /** Milliseconds between auto-slides. Set to 0 to turn autoplay off. */
  delay?: number;
  /** Edge-to-edge hero (no rounded corners, tall, dark top fade for the navbar). */
  fullWidth?: boolean;
  className?: string;
};

export function ImageSlider({ images, delay = 4000, fullWidth = false, className }: ImageSliderProps) {
  if (!images.length) return null;
  const many = images.length > 1;

  return (
    <Carousel
      // key resets the slider when the image set changes
      key={keyOf(images[0].src)}
      opts={{ loop: many }}
      plugins={delay > 0 && many ? [Autoplay({ delay, stopOnInteraction: true })] : []}
      className={cn("relative w-full", className)}
      aria-label="Course photos"
    >
      <CarouselContent className="ml-0">
        {images.map((img, i) => (
          <CarouselItem key={`${keyOf(img.src)}-${i}`} className="pl-0">
            <div
              className={cn(
                "relative overflow-hidden bg-muted",
                fullWidth
                  ? "h-[60vh] min-h-[380px] md:h-[75vh] md:max-h-[760px]"
                  : "aspect-[4/3] rounded-2xl sm:aspect-[16/8]"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {fullWidth && (
        <>
          {/* Dark fade at the top so a transparent navbar stays readable */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
          {/* Soft fade at the bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </>
      )}

      {many && (
        <>
          <CarouselPrevious className="left-4 hidden sm:flex md:left-8" />
          <CarouselNext className="right-4 hidden sm:flex md:right-8" />
        </>
      )}
    </Carousel>
  );
}