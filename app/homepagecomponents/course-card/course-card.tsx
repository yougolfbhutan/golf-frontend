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

export type Course = {
  index: string;
  eyebrow: string;
  name: string;
  description: string;
  facts: string[];
  images: { src: string; alt: string }[];
  cta?: string;
  imageSide: "left" | "right";
  onCtaClick?: () => void;
};

type HimalayanLinksProps = {
  courses: Course[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

function CourseCard({
  course,
  priority = false,
}: {
  course: Course;
  priority?: boolean;
}) {
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
                priority={priority && i === 0}
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
    <div className="flex flex-col justify-center px-4 py-2 sm:px-6 lg:px-10 lg:py-8">
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
          <Button variant="outline" size="default" onClick={course.onCtaClick}>
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

export default function HimalayanLinks({
  courses,
  eyebrow = "THE PORTFOLIO",
  title = "Our Himalayan Links",
  subtitle,
}: HimalayanLinksProps) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12">
        <header className="flex flex-col gap-6 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-clay">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-display text-4xl italic text-ink-900 sm:text-5xl">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="max-w-xs text-sm leading-relaxed text-slate-600 sm:text-right">
              {subtitle}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-16 pt-14 sm:gap-20 lg:gap-24 lg:pt-20">
          {courses.map((course, i) => (
            <CourseCard key={course.index} course={course} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}