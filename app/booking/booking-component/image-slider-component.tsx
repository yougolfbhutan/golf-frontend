"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  images?: string[];
  title: string;
  location?: string;
  description?: string;
  meta?: string;
  badge?: string;
  tags?: string[];
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export default function ImageSliderCard({
  images = [],
  title,
  location,
  description,
  meta,
  badge,
  tags,
  selected = false,
  onClick,
  className,
  children,
}: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const selectable = typeof onClick === "function";
  const hasMany = images.length > 1;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Card
      role={selectable ? "radio" : undefined}
      aria-checked={selectable ? selected : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (selectable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "group relative gap-0 overflow-hidden rounded-2xl p-0 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40",
        selectable && "cursor-pointer",
        selected
          ? "border-[#1F4D36] bg-[#D9E8DD] shadow-md"
          : "border-slate-200 hover:border-slate-400 hover:shadow-md",
        className,
      )}
    >
      {/* ---------- image slider ---------- */}
      <div
        className="relative"
        // arrow clicks should slide, not select the card
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) e.stopPropagation();
        }}
      >
        <Carousel
          setApi={setApi}
          opts={{
            loop: hasMany,
            // phones: the card row owns finger swiping, so photos change
            // with the arrows/dots instead of fighting the row's scroll
            breakpoints: { "(max-width: 639px)": { watchDrag: false } },
          }}
        >
          <CarouselContent className="ml-0">
            {(images.length ? images : [""]).map((src, i) => (
              <CarouselItem key={src + i} className="pl-0">
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-[#D9E8DD] to-[#B7D1BE]">
                  {src && (
                    <Image
                      src={src}
                      alt={`${title} photo ${i + 1}`}
                      fill
                      sizes="(max-width: 639px) 82vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover"
                      draggable={false}
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {hasMany && (
            <>
              {/* always visible on phones (no hover on touch), hover-only from sm up */}
              <CarouselPrevious className="left-2 size-8 border-0 bg-white/90 shadow transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100" />
              <CarouselNext className="right-2 size-8 border-0 bg-white/90 shadow transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100" />
            </>
          )}
        </Carousel>

        {/* badge */}
        {badge && (
          <Badge className="absolute left-3 top-3 border-0 bg-white/90 text-slate-900 shadow-sm backdrop-blur hover:bg-white/90">
            {badge}
          </Badge>
        )}

        {/* check circle */}
        {selectable && (
          <span
            aria-hidden
            className={cn(
              "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200",
              selected
                ? "border-[#1F4D36] bg-[#1F4D36] text-white"
                : "border-white bg-white/70 backdrop-blur",
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
        )}

        {/* dots: phones only (hidden from sm / 640px and up) */}
        {hasMany && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5 sm:hidden">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all duration-200",
                  i === index ? "w-4 opacity-100" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------- details ---------- */}
      <CardContent className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-bold leading-tight">{title}</h3>
        {location && (
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        {description && <p className="text-xs text-slate-600">{description}</p>}
        {meta && <p className="text-xs text-slate-500">{meta}</p>}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="rounded-full bg-slate-100 text-[11px] font-medium text-slate-600"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}

        {children && <div className="mt-auto pt-3">{children}</div>}
      </CardContent>
    </Card>
  );
}