// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
//   type CarouselApi,
// } from "@/components/ui/carousel";
// import { Check, ArrowUpRight, ImageOff, Languages } from "lucide-react";
// import { useEffect, useState } from "react";
// import type { Carryset } from "../interface";

// /**
//  * NOTE: `description` stays optional since not every package has one.
//  * `price` and `languages` are treated as real package fields below —
//  * update your `Carryset` interface (and API response) to include:
//  *   price: number | string
//  *   caddie.languages: string[]   // e.g. ["English", "Thai"]
//  * then drop the `as any` casts once the types line up.
//  *
//  * Install the shadcn pieces this card depends on (if you haven't already):
//  *   npx shadcn@latest add button badge carousel
//  */

// export function GolfSetCard({
//   set,
//   selected,
//   onSelect,
// }: {
//   set: Carryset & {
//     price?: number | string;
//     description?: string;
//     caddie?: Carryset["caddie"] & { languages?: string[] };
//   };
//   selected: boolean;
//   onSelect: () => void;
// }) {
//   // console.log("set",set)

//   const caddieName = set.caddie?.caddiename?.trim();

//   const STATIC_FALLBACK_LANGUAGES = ["English", "Dzongkha", "Nepali"];



//  const images: string[] = set.urls?.length
//   ? set.urls.map((img) => img.url)
//   : set.url
//     ? [set.url]
//     : [];


//   const [api, setApi] = useState<CarouselApi>();
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     if (!api) return;
//     setActiveIndex(api.selectedScrollSnap());
//     api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
//   }, [api]);

//   return (
//     <div
//       className={cn(
//         "group relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition-all duration-300",
//         "hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10",
//         selected && "ring-2 ring-emerald-600 ring-offset-2",
//         !set.availability && "opacity-60 grayscale-[0.3]",
//       )}
//     >
//       {/* Image */}
//       <div className="relative h-48 w-full overflow-hidden bg-emerald-50">
//         {images.length > 0 ? (
//           <>
//             <Carousel setApi={setApi} opts={{ loop: images.length > 1 }} className="h-full">
//               <CarouselContent className="ml-0 h-48">
//                 {images.map((src, i) => (
//                   <CarouselItem key={src + i} className="h-48 pl-0">
//                     <img
//                       src={src}
//                       alt={`${set.carrysetname} ${i + 1}`}
//                       className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                     />
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>

//               {images.length > 1 && (
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
//                 >
//                   <CarouselPrevious className="left-2 h-7 w-7 border-none bg-black/40 text-white hover:bg-black/60 hover:text-white" />
//                   <CarouselNext className="right-2 h-7 w-7 border-none bg-black/40 text-white hover:bg-black/60 hover:text-white" />
//                 </div>
//               )}
//             </Carousel>

//             {/* Top scrim so the badge reads cleanly against busy photos */}
//             <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
//             {/* Bottom scrim for the dots */}
//             <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent" />


//             {/* Carousel dots */}
//             {images.length > 1 && (
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
//               >
//                 {images.map((_, i) => (
//                   <button
//                     key={i}
//                     type="button"
//                     aria-label={`Go to image ${i + 1}`}
//                     onClick={() => api?.scrollTo(i)}
//                     className={cn(
//                       "h-1.5 rounded-full bg-white/50 transition-all duration-200",
//                       i === activeIndex ? "w-4 bg-white" : "w-1.5 hover:bg-white/80",
//                     )}
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-emerald-700/60">
//             <ImageOff className="h-5 w-5" />
//             <span className="text-xs">No image</span>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div className="flex flex-col gap-2 p-4">
//         {categoryLabel && (
//           <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/70">
//             {categoryLabel}
//           </span>
//         )}

//         <h4 className="font-serif text-xl leading-tight text-emerald-950">
//           {set.carrysetname}
//         </h4>

//         {caddieName && (
//           <p className="text-sm leading-snug text-muted-foreground">
//             Caddie: {caddieName}
//           </p>
//         )}

//         {languages && languages.length > 0 && (
//           <p className="flex items-center gap-1.5 text-sm leading-snug text-muted-foreground">
//             <Languages className="h-3.5 w-3.5 shrink-0 text-emerald-700/70" />
//             <span>{languages.join(", ")}</span>
//           </p>
//         )}

//         {(set as any).description && (
//           <p className="text-sm leading-snug text-muted-foreground">
//             {(set as any).description}
//           </p>
//         )}

//         {/* Price + CTA */}
//         <div className="mt-2 flex items-center justify-between border-t border-emerald-900/10 pt-3">
//           <div className="flex flex-col leading-none">
//             <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
//               Package price
//             </span>
//             <span className="mt-1 text-lg font-semibold text-emerald-950">
//               {(set as any).price ? `$${(set as any).price}` : "—"}
//             </span>
//           </div>

//           <Button
//             type="button"
//             onClick={onSelect}
//             disabled={!set.availability}
//             className={cn(
//               "gap-1.5 rounded-full bg-emerald-950 px-4 text-white hover:bg-emerald-900",
//               selected && "bg-emerald-600 hover:bg-emerald-600",
//             )}
//           >
//             {selected ? "Selected" : "Select"}
//             <ArrowUpRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }