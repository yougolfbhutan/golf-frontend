"use client";

import { useState } from "react";
import Image from "next/image";
import type { CourseCardProps } from "./interface";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function CourseCard({ course }: CourseCardProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const images = Array.isArray(course.image)
    ? course.image.filter(Boolean)
    : course.image
      ? [course.image]
      : [];

  return (
    <article className="group relative overflow-hidden rounded-sm border border-neutral-200 bg-white">
      {/* image slider */}
      <div
        className="relative h-[340px] overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Carousel className="h-full w-full" opts={{ loop: true }}>
          <CarouselContent className="ml-0 h-[340px]">
            {images.map((src, i) => (
              <CarouselItem key={i} className="relative h-[340px] pl-0">
                <Image
                  src={src}
                  alt={`${course.name} fairway ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover transition-transform duration-700"
                  // style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-3 h-8 w-8 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
              <CarouselNext className="right-3 h-8 w-8 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white" />
            </>
          )}
        </Carousel>

        {/* gradient overlay — only visible on hover */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "linear-gradient(to top, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.25) 50%, transparent 100%)",
          }}
        />

        {/* name + location — only visible on hover */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-6 transition-opacity duration-300"
          // style={{ opacity: hovered ? 1 : 0 }}
        >
          <p className="mb-2 text-xs font-medium tracking-widest text-[#d4b968]">
            {course.location}
          </p>
          <h2 className="mb-1 font-serif text-[2.1rem] font-semibold leading-tight text-white">
            {course.name}
          </h2>
          <p className="font-serif text-sm italic text-white/80">
            {course.tagline}
          </p>
        </div>
      </div>

      {/* stats row */}
      <div className="grid grid-cols-4 border-b border-neutral-200 text-center">
        {[
          { label: "Holes", value: course.holes },
          { label: "Par", value: course.par },
          { label: "Length", value: course.length },
          { label: "Founded", value: course.founded },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-1 py-4 ${i < 3 ? "border-r border-neutral-200" : ""}`}
          >
            <span className="font-serif text-xl font-semibold text-neutral-900">
              {stat.value}
            </span>
            <span className="text-xs tracking-widest text-neutral-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 px-6 py-5">
        {/* description */}
        {course.description && (
          <div>
            <p
              className={`text-sm leading-relaxed text-neutral-600 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {course.description}
            </p>
            {course.description.length > 140 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-xs font-semibold tracking-wide text-[#10B759] hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 px-6 py-5">
        {/* <div className="flex flex-wrap gap-2">
          {course.features.map((f) => (
            <span
              key={f}
              className="border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs tracking-wide text-neutral-600"
            >
              {f}
            </span>
          ))}
        </div> */}

        <div className="h-px bg-neutral-200" />

        <div className="flex items-center justify-between">
          {/* <div>
            <p className="mb-0.5 text-xs tracking-widest text-neutral-500">
              Green Fee
            </p>
            <p className="font-serif text-2xl font-bold text-[#10B759]">
              {course.green_fee}
              <span className="ml-1 font-sans text-sm font-normal text-neutral-500">
                / round
              </span>
            </p>
          </div> */}

         <Link
  href={`/reserve/${course.id}`}
  className="border border-[#10B759] bg-transparent px-6 py-3 text-sm font-semibold tracking-widest text-[#10B759] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#10B759] hover:text-white hover:shadow-md hover:shadow-[#10B759]/30 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]/50 focus-visible:ring-offset-2"
>
  Book Your round
</Link>
        </div>
      </div>
    </article>
  );
}
