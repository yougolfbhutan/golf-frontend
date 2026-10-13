"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  selected: boolean;
  onClick: () => void;
  /** Colored bar across the top (used by course cards) */
  accentColor?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function SelectableCard({
  selected,
  onClick,
  accentColor,
  disabled,
  className,
  children,
}: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col rounded-2xl border p-4 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40",
        selected
          ? "border-[#1F4D36] bg-[#D9E8DD] shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-50 hover:border-slate-200 hover:shadow-none",
        className,
      )}
    >
      {/* check / empty circle */}
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200",
          selected
            ? "border-[#1F4D36] bg-[#1F4D36] text-white"
            : "border-slate-300 bg-white",
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>

      {/* optional accent bar */}
      {accentColor && (
        <span
          aria-hidden
          className="mb-3 mr-7 block h-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {children}
    </button>
  );
}