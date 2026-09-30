"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";

interface HeroGalleryProps {
  title: string;
  location: string;
  images: string[];
}

export default function HeroGallery({ title, location, images }: HeroGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-neutral-600">
          <Globe2 className="h-4 w-4" />
          <span>{location}</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={images[active]}
          alt={title}
          className="h-[380px] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-4 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}