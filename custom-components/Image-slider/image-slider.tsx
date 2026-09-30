// "use client"

// /**
//  * GolfCourseSlider
//  * -----------------
//  * A full-bleed, autoplaying hero carousel for a golf course site.
//  * Built on shadcn/ui's Carousel (Embla under the hood).
//  * Palette restricted to green + white per brand.
//  *
//  * INSTALL (run in your Next.js project):
//  *   npx shadcn@latest add carousel button
//  *   npm install embla-carousel-autoplay lucide-react
//  *
//  * USAGE (named import):
//  *   import { GolfCourseSlider } from "@/custom-components/Image-slider/image-slider"
//  *   <GolfCourseSlider />
//  */

// import * as React from "react"
// import Image from "next/image"
// import Autoplay from "embla-carousel-autoplay"
// import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   type CarouselApi,
// } from "@/components/ui/carousel"

// // ---------------------------------------------------------------------------
// // Content — swap these for your own course photography & copy
// // ---------------------------------------------------------------------------

// type Slide = {
//   eyebrow: string
//   title: string
//   description: string
//   image: string
//   cta: { label: string; href: string }
// }

// const slides: Slide[] = [
//   {
//     eyebrow: "HOLE 07 · PAR 5",
//     title: "The Ridgeline",
//     description:
//       "A sweeping 560-yard dogleg along the bluff, with fescue-lined fairways that catch the last light of the day.",
//     image: "/gallery-1.jpg",
//     cta: { label: "View the scorecard", href: "#scorecard" },
//   },
//   {
//     eyebrow: "HOLE 12 · PAR 3",
//     title: "Devil's Pocket",
//     description:
//       "One club, one shot, one green ringed by bunkers — the most photographed hole on the property.",
//     image: "/gallery-2.jpg",
//     cta: { label: "See the layout", href: "#layout" },
//   },
//   {
//     eyebrow: "THE CLUBHOUSE",
//     title: "Nineteenth Hole",
//     description:
//       "Farm-to-table dining and a terrace overlooking the 18th green — open to members and guests daily.",
//     image: "/gallery-3.jpg",
//     cta: { label: "Reserve a table", href: "#dining" },
//   },
//   {
//     eyebrow: "TEE TIMES",
//     title: "Book Your Round",
//     description:
//       "Eighteen championship holes, walkable in under four hours, open to the public every day but Monday.",
//     image: "/gallery-4.jpg",
//     cta: { label: "Check availability", href: "#book" },
//   },
// ]

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------

// export default function GolfCourseSlider() {
//   const [api, setApi] = React.useState<CarouselApi>()
//   const [current, setCurrent] = React.useState(0)
//   const [count, setCount] = React.useState(0)

//   const autoplay = React.useRef(
//     Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
//   )

//   React.useEffect(() => {
//     if (!api) return
//     setCount(api.scrollSnapList().length)
//     setCurrent(api.selectedScrollSnap())
//     api.on("select", () => setCurrent(api.selectedScrollSnap()))
//   }, [api])

//   return (
//     <section
//       aria-label="Golf course highlights"
//       className="relative w-full overflow-hidden "
//     >
//       <Carousel
//         setApi={setApi}
//         opts={{ loop: true }}
//         plugins={[autoplay.current]}
//         className="w-full"
//       >
//         <CarouselContent className="ml-0">
//           {slides.map((slide, index) => (
//             <CarouselItem key={slide.title} className="pl-0">
//               <Slide slide={slide} active={index === current} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         {/* Prev / next arrows */}
//         <button
//           onClick={() => api?.scrollPrev()}
//           aria-label="Previous slide"
//           className="group absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-green-950/40 p-2.5 text-white backdrop-blur-sm transition hover:border-white hover:bg-green-900/60 sm:flex md:left-6"
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </button>
//         <button
//           onClick={() => api?.scrollNext()}
//           aria-label="Next slide"
//           className="group absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-green-950/40 p-2.5 text-white backdrop-blur-sm transition hover:border-white hover:bg-green-900/60 sm:flex md:right-6"
//         >
//           <ChevronRight className="h-5 w-5" />
//         </button>
//       </Carousel>

//       {/* Progress + dot indicators */}
//       <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2 sm:bottom-7">
//         {Array.from({ length: count }).map((_, i) => (
//           <button
//             key={i}
//             onClick={() => api?.scrollTo(i)}
//             aria-label={`Go to slide ${i + 1}`}
//             className="pointer-events-auto group relative h-1.5 w-6 overflow-hidden rounded-full bg-white/30 transition-all sm:w-9"
//           >
//             <span
//               className={cn(
//                 "absolute inset-y-0 left-0 rounded-full bg-white transition-all duration-500",
//                 i === current ? "w-full" : "w-0"
//               )}
//             />
//           </button>
//         ))}
//       </div>
//     </section>
//   )
// }

// // ---------------------------------------------------------------------------
// // Single slide
// // ---------------------------------------------------------------------------

// function Slide({ slide, active }: { slide: Slide; active: boolean }) {
//   return (
//     <div className="relative h-[62vh] min-h-[420px] w-full sm:h-[72vh] md:h-[80vh]">
//       <Image
//         src={slide.image}
//         alt={slide.title}
//         fill
//         priority
//         sizes="100vw"
//         className="object-cover"
//       />

//       {/* Readability gradient — green-tinted instead of pure black
//       <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/30 to-green-950/10" />
//       <div className="absolute inset-0 bg-gradient-to-r from-green-950/50 via-transparent to-transparent" /> */}

//       {/* Copy */}
//       <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-16 sm:px-10 sm:pb-20 md:px-14 md:pb-24">
//         <div className="mx-auto max-w-3xl">
//           <span
//             className={cn(
//               "mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 transition-all duration-700",
//               active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
//             )}
//           >
//             <MapPin className="h-3.5 w-3.5" />
//             {slide.eyebrow}
//           </span>

//           <h2
//             className={cn(
//               "font-serif text-3xl leading-tight text-white transition-all delay-100 duration-700 sm:text-5xl md:text-6xl",
//               active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
//             )}
//           >
//             {slide.title}
//           </h2>

//           <p
//             className={cn(
//               "mt-3 max-w-xl text-sm leading-relaxed text-white/80 transition-all delay-200 duration-700 sm:mt-4 sm:text-base",
//               active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
//             )}
//           >
//             {slide.description}
//           </p>

//           <div
//             className={cn(
//               "mt-6 transition-all delay-300 duration-700 sm:mt-7",
//               active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
//             )}
//           >
//             <Button
//               asChild
//               className="rounded-full bg-white px-6 text-green-900 hover:bg-white/90"
//             >
//               <a href={slide.cta.href}>{slide.cta.label}</a>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }