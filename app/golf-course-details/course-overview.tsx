"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface CourseOverviewProps {
  description: string;
  previewLength?: number;
}

export default function CourseOverview({
  description,
  previewLength = 140,
}: CourseOverviewProps) {
  const [expanded, setExpanded] = useState(false);
  const isTruncatable = description.length > previewLength;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[15px] leading-relaxed text-neutral-700">
        {expanded || !isTruncatable
          ? description
          : `${description.slice(0, previewLength)}…`}{" "}
        {isTruncatable && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-1 align-middle text-sm font-semibold text-neutral-900 hover:underline"
          >
            {expanded ? "Read less" : "Read more"}
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </button>
        )}
      </p>
    </div>
  );
}