"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Course = {
  index: string;
  eyebrow: string;
  name: string;
  description: string;
  facts: string[];
  images: { src: string; alt: string }[];
  cta?: string;
  imageSide: "left" | "right";
};

const courses: Course[] = [
  {
    index: "01",
    eyebrow: "North Ridge",
    name: "Chubachu Course",
    description:
      "Winding through ancient willow groves and stone meditation walls, Chubachu offers a technical par-3 challenge with the Thimphu Chu river as a constant companion.",
    facts: ["8 Holes · Par 3", "Elevation: 2,320m", "River-side layout"],
    images: [
      {
        src: "/dechen.jpg",
        alt: "A golfer on a river-side green surrounded by willow trees and mountains",
      },
      {
        src: "/gallery-1.jpg",
        alt: "The Chubachu river winding past the fairway",
      },
      {
        src: "/gallery-2.jpg",
        alt: "Stone meditation walls lining the course",
      },
    ],
    cta: "Quick book Chubachu",
    imageSide: "left",
  },
  {
    index: "02",
    eyebrow: "Monastery View",
    name: "Dechen Phodrang",
    description:
      "Named for the Palace of Great Bliss, this course features elevated tees overlooking the valley. A serene atmosphere where every shot feels like a quiet meditation.",
    facts: ["8 Holes · Par 3", "Signature 5th island green"],
    images: [
      {
        src: "/chubachu.jpg",
        alt: "A monastery on a forested hillside with mountains at sunrise",
      },
      {
        src: "/gallery-4.jpg",
        alt: "Elevated tee overlooking the valley",
      },
    ],
    imageSide: "right",
  },
];

function CourseCard({ course }: { course: Course }) {
  const imageBlock = (
    <Carousel className="group relative w-full">
      <CarouselContent>
        {course.images.map((img, i) => (
          <CarouselItem key={img.src}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-[16/11] lg:aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority={course.index === "01" && i === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-3 border-none bg-cream/90 text-ink-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-cream" />
      <CarouselNext className="right-3 border-none bg-cream/90 text-ink-700 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-cream" />
    </Carousel>
  );

  const contentBlock = (
    <div className="flex flex-col justify-center py-2 lg:py-8">
      <p className="text-xs font-semibold tracking-[0.18em] text-moss-600">
        {course.index} — {course.eyebrow.toUpperCase()}
      </p>
      <h3 className="mt-3 font-display text-3xl italic text-ink-900 sm:text-4xl">
        {course.name}
      </h3>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-600">
        {course.description}
      </p>
      <ul className="mt-5 space-y-2">
        {course.facts.map((fact) => (
          <li key={fact} className="flex items-center gap-2 text-sm text-ink-700">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
            {fact}
          </li>
        ))}
      </ul>
      {course.cta && (
        <div className="mt-7">
          <Button variant="outline" size="default">
            {course.cta}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      {course.imageSide === "left" ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          <div className="lg:order-2">{imageBlock}</div>
          <div className="lg:order-1">{contentBlock}</div>
        </>
      )}
    </div>
  );
}

export default function HimalayanLinks() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-clay">
              THE PORTFOLIO
            </p>
            <h1 className="mt-2 font-display text-4xl italic text-ink-900 sm:text-5xl">
              Our Himalayan Links
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-600 sm:text-right">
            Two distinct 8-hole par-3 courses designed to honor the natural
            topography of the Thimphu Chu riverbanks.
          </p>
        </header>

        {/* Courses */}
        <div className="flex flex-col gap-16 pt-14 sm:gap-20 lg:gap-24 lg:pt-20">
          {courses.map((course) => (
            <CourseCard key={course.index} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}