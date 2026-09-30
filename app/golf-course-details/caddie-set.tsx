/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Check, ImageOff, Languages } from "lucide-react";
import { useEffect, useState } from "react";
import type { Carryset } from "../homepagecomponents/tabs-booking/tabs-component/golf-equiment/interface";

const FALLBACK_LANGUAGES = ["English", "Dzongkha", "Nepali"];
const ACCENT = "#10B759";
const MOCK_SET = {
  carrysetname: "Royal Thimphu Package",
  availability: true,
  urls: [] as { url: string }[],
  url: undefined as string | undefined,
  caddie: { caddiename: "Sonam Dorji", languages: ["English", "Dzongkha"] },
  price: 180,
  description: "Full 18-hole round with caddie, cart, and clubs included.",
};

type CarrysetInput = Carryset & {
  price?: number | string;
  description?: string;
  caddie?: Carryset["caddie"] & { languages?: string[] };
};

export function GolfSetCard({
  set = MOCK_SET as CarrysetInput,
  selected,
  onSelect,
}: {
  set?: CarrysetInput;
  selected: boolean;
  onSelect: () => void;
}) {
  const caddieName = set.caddie?.caddiename?.trim();
  const languages = set.caddie?.languages?.length
    ? set.caddie.languages
    : FALLBACK_LANGUAGES;

  const images: string[] = set.urls?.length
    ? set.urls.map((img) => img.url)
    : set.url
      ? [set.url]
      : [];

  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
  }, [api]);

  return (
    <>
      <h1>Choose the carryset</h1>
      <div
        className={cn(
          "group relative flex w-full max-w-sm flex-col m-0 p-0 overflow-hidden rounded-xl border bg-white transition-all duration-300",
          selected
            ? "border-[#10B759] shadow-[0_1px_0_0_#10B759]"
            : "border-[#E4DFD2] hover:border-[#B7E9CC] hover:shadow-md hover:shadow-black/5",
          !set.availability && "opacity-60 grayscale-[0.4]",
        )}
      >
        {/* Title (now at the top, above the image) */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4">
          {/* <h4 className="font-serif text-xl leading-tight text-[#1F3B2C]">
          {set.carrysetname}
        </h4> */}

          {!set.availability && (
            <Badge className="shrink-0 border-none bg-black/60 text-white hover:bg-black/60">
              Not available
            </Badge>
          )}
        </div>

        {/* Image */}
        {/* Image */}
        <div className="relative mt-3 h-48 w-full overflow-hidden rounded-lg bg-[#EFEAD9] px-4">
          {" "}
          {images.length > 0 ? (
            <>
              <Carousel
                setApi={setApi}
                opts={{ loop: images.length > 1 }}
                className="h-full"
              >
                <CarouselContent className="ml-0 h-48">
                  {images.map((src, i) => (
                    <CarouselItem key={src + i} className="h-48 pl-0">
                      <img
                        src={src}
                        alt={`${set.carrysetname} ${i + 1}`}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {images.length > 1 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  >
                    <CarouselPrevious className="left-2 h-7 w-7 border-none bg-black/40 text-white hover:bg-black/60 hover:text-white" />
                    <CarouselNext className="right-2 h-7 w-7 border-none bg-black/40 text-white hover:bg-black/60 hover:text-white" />
                  </div>
                )}
              </Carousel>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent" />

              {images.length > 1 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => api?.scrollTo(i)}
                      className={cn(
                        "h-1.5 rounded-full bg-white/50 transition-all duration-200",
                        i === activeIndex
                          ? "w-4 bg-white"
                          : "w-1.5 hover:bg-white/80",
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className=" p-0 m-0 flex h-full w-full flex-col items-center justify-center gap-1.5 text-[#8A8574]">
              <ImageOff className="h-5 w-5" />
              <span className="text-xs">No image</span>
            </div>
          )}
          {selected && (
            <div
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm"
              style={{ backgroundColor: ACCENT }}
            >
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          {caddieName && (
            <p className="text-sm leading-snug text-[#6B6656]">
              Caddie: {caddieName}
            </p>
          )}

          {languages.length > 0 && (
            <p className="flex items-center gap-1.5 text-sm leading-snug text-[#6B6656]">
              <Languages className="h-3.5 w-3.5 shrink-0 text-[#B58A3D]" />
              <span>{languages.join(", ")}</span>
            </p>
          )}

          {(set as any).description && (
            <p className="text-sm leading-snug text-[#6B6656]">
              {(set as any).description}
            </p>
          )}

          {/* Price + CTA */}
          <div className="mt-2 flex items-center justify-between border-t border-[#E4DFD2] pt-3">
            <div className="flex flex-col leading-none">
              <span className="text-xs text-[#8A8574]">Package price</span>
              <span className="mt-1 text-lg font-semibold text-[#1F3B2C]">
                {(set as any).price ? `$${(set as any).price}` : "—"}
              </span>
            </div>

            <Button
              type="button"
              onClick={onSelect}
              disabled={!set.availability}
              className="gap-1.5 rounded-full px-4 text-white hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              {selected && <Check className="h-4 w-4" />}
              {selected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
