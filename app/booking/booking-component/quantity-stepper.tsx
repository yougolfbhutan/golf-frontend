"use client";

import { Minus, Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ---------- presets ---------- */

const wrapper = cva("inline-flex items-center", {
  variants: {
    variant: {
      outline: "rounded-full border border-slate-200 bg-white",
      filled: "rounded-full bg-slate-100",
      green: "rounded-full border border-[#1F4D36] bg-[#D9E8DD]",
      minimal: "gap-1",
    },
    size: {
      sm: "p-0.5",
      md: "p-1",
      lg: "p-1.5",
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
});

const button = cva(
  "flex items-center justify-center rounded-full transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D36]/40 disabled:cursor-not-allowed disabled:opacity-30",
  {
    variants: {
      variant: {
        outline: "hover:bg-slate-100 disabled:hover:bg-transparent",
        filled: "hover:bg-white disabled:hover:bg-transparent",
        green: "hover:bg-white/70 disabled:hover:bg-transparent",
        minimal: "border border-slate-300 hover:bg-slate-100 disabled:hover:bg-transparent",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  },
);

const valueText = cva("text-center font-bold tabular-nums", {
  variants: {
    size: {
      sm: "w-8 text-base",
      md: "w-10 text-lg",
      lg: "w-14 text-2xl",
    },
  },
  defaultVariants: { size: "md" },
});

const iconSize = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" } as const;

/* ---------- component ---------- */

type Props = VariantProps<typeof wrapper> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** for screen readers, e.g. "golfer" -> "Add golfer" */
  label?: string;
  disabled?: boolean;
  /** override the outer pill */
  className?: string;
  /** override individual parts */
  classNames?: {
    button?: string;
    value?: string;
    icon?: string;
  };
};

export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  label = "item",
  variant,
  size,
  disabled = false,
  className,
  classNames,
}: Props) {
  const canDecrease = !disabled && value - step >= min;
  const canIncrease = !disabled && value + step <= max;
  const icon = cn(iconSize[size ?? "md"], classNames?.icon);

  return (
    <div
      role="group"
      aria-label={`${label} quantity`}
      className={cn(wrapper({ variant, size }), disabled && "opacity-60", className)}
    >
      <button
        type="button"
        aria-label={`Remove ${label}`}
        disabled={!canDecrease}
        onClick={() => onChange(value - step)}
        className={cn(button({ variant, size }), classNames?.button)}
      >
        <Minus className={icon} />
      </button>

      <span
        aria-live="polite"
        className={cn(valueText({ size }), classNames?.value)}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label={`Add ${label}`}
        disabled={!canIncrease}
        onClick={() => onChange(value + step)}
        className={cn(button({ variant, size }), classNames?.button)}
      >
        <Plus className={icon} />
      </button>
    </div>
  );
}