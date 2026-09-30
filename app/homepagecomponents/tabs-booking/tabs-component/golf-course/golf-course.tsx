"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPin,
  Users,
  Mountain,
  TreePine,
  Rabbit,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormikContext } from "formik";
import type { BookingFormValues } from "../../booking-form-values";

/* ----------------------------- Golf courses ----------------------------- */

interface DetailLine {
  icon: React.ElementType;
  text: string;
  className?: string;
}

interface CourseOption {
  id: string;
  name: string;
  images: string[];
  details: DetailLine[];
}

const COURSES: CourseOption[] = [
  {
    id: "royal-thimphu",
    name: "Royal Thimphu Golf Course",
    images: ["/chubachu.jpg", "/gallery-1.jpg", "/gallery-2.jpg"],
    details: [
      { icon: MapPin, text: "Thimphu · 18 Holes · 6,400 yards", className: "text-muted-foreground" },
      { icon: Users, text: "Bhutan's premier championship course", className: "text-emerald-700" },
      { icon: Mountain, text: "Himalayan valley panoramas", className: "text-muted-foreground" },
    ],
  },
  {
    id: "drakpoi",
    name: "Drakpoi Golf Course",
    images: ["/dechen.jpg", "/gallery-3.jpg"],
    details: [
      { icon: MapPin, text: "Thimphu · 9 Holes · 3,100 yards", className: "text-muted-foreground" },
      { icon: TreePine, text: "Scenic forested setting", className: "text-emerald-700" },
      { icon: Rabbit, text: "Wildlife sightings common", className: "text-muted-foreground" },
    ],
  },
];

/* ----------------------------- SAARC status ----------------------------- */

type SaarcStatus = "saarc" | "non-saarc";

interface SaarcOption {
  id: SaarcStatus;
  title: string;
  description: string;
  icon: React.ElementType;
}

const SAARC_OPTIONS: SaarcOption[] = [
  {
    id: "saarc",
    title: "SAARC Country",
    description:
      "India, Bangladesh, Sri Lanka, Nepal, Pakistan, Maldives or Afghanistan — special regional rates apply.",
    icon: Flag,
  },
  {
    id: "non-saarc",
    title: "Non-SAARC Country",
    description: "All other nationalities — standard international rates apply.",
    icon: Globe,
  },
];

function SaarcSelector({
  selected,
  onSelect,
}: {
  selected?: SaarcStatus;
  onSelect: (status: SaarcStatus) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {SAARC_OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        return (
          <div
            key={option.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(option.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(option.id);
              }
            }}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-xl border-2 bg-white p-4 transition-all duration-150",
              isSelected
                ? "border-emerald-900 shadow-md"
                : "border-border hover:border-emerald-300 hover:shadow-sm"
            )}
          >
            <div
              className={cn(
                "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-900/20 transition-all duration-150",
                isSelected ? "bg-emerald-950 border-emerald-950" : "bg-white"
              )}
            >
              {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white mb-3">
              <option.icon className="h-4 w-4" />
            </div>

            <h3 className="mb-1 font-serif text-sm font-semibold text-emerald-900 pr-8">
              {option.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {option.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Image slider -------------------------------- */

function ImageSlider({
  images,
  alt,
  selected,
}: {
  images: string[];
  alt: string;
  selected: boolean;
}) {
  const [index, setIndex] = React.useState(0);

  const go = (delta: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + delta + images.length) % images.length);
  };

  return (
    <div className="group/slider relative h-44 w-full overflow-hidden bg-gradient-to-br from-emerald-800 to-emerald-950">
      {images.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={src}
            alt={`${alt} photo ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      <div
        className={cn(
          "absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/80 transition-all duration-150",
          selected
            ? "bg-emerald-950 opacity-100 scale-100"
            : "bg-black/30 opacity-0 scale-75 group-hover/slider:opacity-100 group-hover/slider:scale-100"
        )}
      >
        {selected && <Check className="h-4 w-4 text-white" />}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(-1, e)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity duration-150 hover:bg-black/50 group-hover/slider:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => go(1, e)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity duration-150 hover:bg-black/50 group-hover/slider:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-150",
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------- Component -------------------------------- */

export function ChooseGolfCourse({
  onBack,
  onNext,
}: {
  onBack?: () => void;
  onNext?: () => void;
}) {
  const { values, setFieldValue } = useFormikContext<BookingFormValues>();

  const selectedCourse = values.golfCourseName;
  const selectedSaarcStatus = values.saarcStatus as SaarcStatus | undefined;

  const canContinue = Boolean(selectedCourse) && Boolean(selectedSaarcStatus);

  return (
    <>
      <div className="mx-auto flex flex-col gap-5 rounded-xl border bg-card shadow-sm">
        {/* ---- Choose Golf Course ---- */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <Flag className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-emerald-900 font-serif">
              Choose Golf Course
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {COURSES.map((course) => {
              const isSelected = selectedCourse === course.name;
              return (
                <div
                  key={course.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setFieldValue("golfCourseName", course.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFieldValue("golfCourseName", course.name);
                    }
                  }}
                  className={cn(
                    "cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all duration-150",
                    isSelected
                      ? "border-emerald-900 shadow-md"
                      : "border-border hover:border-emerald-300 hover:shadow-sm"
                  )}
                >
                  <ImageSlider images={course.images} alt={course.name} selected={isSelected} />
                  <div className="p-4">
                    <h3 className="mb-2 font-serif text-base font-semibold text-emerald-900">
                      {course.name}
                    </h3>
                    <ul className="flex flex-col gap-1">
                      {course.details.map((detail, i) => (
                        <li
                          key={i}
                          className={cn("flex items-center gap-1.5 text-xs", detail.className)}
                        >
                          <detail.icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{detail.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ---- SAARC / Non-SAARC ---- */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <Globe className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-emerald-900 font-serif">
              Are you from a SAARC country?
            </h2>
          </div>

          <SaarcSelector
            selected={selectedSaarcStatus}
            onSelect={(status) => setFieldValue("saarcStatus", status)}
          />
        </Card>
      </div>

      <div className="flex justify-between mt-2">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          disabled={!canContinue}
          className="bg-emerald-900 hover:bg-emerald-800"
          onClick={onNext}
        >
          Next: Equipment
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}

export default ChooseGolfCourse;