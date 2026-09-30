/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccessoryCardProps {
  item: any;
  qty: number;
  onUpdateQty: (delta: number) => void;
}

export default function AccessoryCard({
  item,
  qty,
  onUpdateQty,
}: AccessoryCardProps) {
  const [slide, setSlide] = React.useState(0);
  const images: string[] = item.urls?.length
    ? item.urls.map((u: any) => u.url)
    : ["/placeholder.png"];
  const hasMultiple = images.length > 1;
  const selected = qty > 0;
  const outOfStock = item.stockQty === 0;

  const stockLabel = outOfStock
    ? { text: "Out of stock", className: "text-red-600" }
    : item.stockQty <= 5
      ? { text: `${item.stockQty} left`, className: "text-amber-600" }
      : { text: "In stock", className: "text-emerald-600" };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s + 1) % images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s - 1 + images.length) % images.length);
  };
  const atMax = typeof item.stockQty === "number" && qty >= item.stockQty;

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all duration-150",
        outOfStock && "opacity-70",
        selected
          ? "border-emerald-500 shadow-sm"
          : "border-border hover:border-emerald-300 hover:shadow-sm",
      )}
    >
      {/* Image — taller now that cards are bigger */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-emerald-50">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: `${images.length * 100}%`,
            transform: `translateX(-${(100 / images.length) * slide}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-full shrink-0"
              style={{ width: `${100 / images.length}%` }}
            >
              <Image
                src={src}
                alt={item.item?.name ?? item.sku}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/65"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlide(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === slide ? "w-5 bg-white" : "w-1.5 bg-white/60",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-base font-medium leading-snug text-emerald-950 line-clamp-1">
          {item.item?.name ?? item.sku}
        </p>
        <p className="mt-1 text-sm leading-snug text-muted-foreground line-clamp-2">
          {item.item?.description?.trim() || "No description"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-emerald-950">
            ${Number(item.price).toLocaleString()}
          </span>
          <span className={cn("text-xs font-medium", stockLabel.className)}>
            {stockLabel.text}
          </span>
        </div>

        <div className="mt-auto pt-3">
          {outOfStock ? (
            <Button size="sm" disabled className="w-full rounded-full">
              Out of stock
            </Button>
          ) : qty === 0 ? (
            <Button
              size="sm"
              className="w-full rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
              onClick={() => onUpdateQty(1)}
              disabled={atMax}
            >
              Add to bag
            </Button>
          ) : (
            <div className="flex items-center justify-between rounded-full border border-emerald-600 bg-emerald-50 px-1.5 py-1.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-emerald-700 hover:bg-emerald-100"
                onClick={() => onUpdateQty(-1)}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="text-sm font-semibold text-emerald-900 tabular-nums">
                {qty}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 rounded-full text-emerald-700 hover:bg-emerald-100"
                onClick={() => onUpdateQty(1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
