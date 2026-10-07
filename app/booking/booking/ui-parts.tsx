"use client";

import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const cardBase = cn(
  "relative flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-xl border border-border bg-card p-3.5 pl-11 text-left font-sans text-sm font-normal leading-snug transition-all",
  "hover:border-green-600/40 hover:shadow-sm",
  // Selected card: soft green background + green border/ring
  "has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-green-600",
  "dark:has-[[data-state=checked]]:bg-green-500/10 dark:has-[[data-state=checked]]:border-green-500 dark:has-[[data-state=checked]]:ring-green-500",
  // Keyboard focus
  "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-green-600/40",
);

// Shared control styling: grey outline when off, solid green with white mark when on
const controlBase =
  "absolute left-4 top-4 size-4 border-[1.5px] border-foreground/40 shadow-none " +
  "data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white " +
  "dark:data-[state=checked]:border-green-500 dark:data-[state=checked]:bg-green-500 " +
  "focus-visible:ring-green-600/40";

interface CardTextProps {
  title: ReactNode;
  description?: ReactNode;
  price?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
}

function CardText({ title, description, price, icon, badge }: CardTextProps) {
  return (
    <>
      {icon && (
        <span
          className="mb-1 text-foreground [&_svg]:size-5"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold tracking-tight">
        {title}
        {badge}
      </span>
      {description && (
        <span className="text-[13px] text-muted-foreground">{description}</span>
      )}
      {price && (
        <span className="mt-1 text-sm font-semibold tabular-nums">{price}</span>
      )}
    </>
  );
}

/** A large, fully clickable radio option. Use inside a shadcn <RadioGroup>. */
export function RadioCard({
  id,
  value,
  className,
  ...text
}: CardTextProps & { id: string; value: string; className?: string }) {
  return (
    <Label htmlFor={id} className={cn(cardBase, className)}>
      <RadioGroupItem
        id={id}
        value={value}
        className={cn(controlBase, "[&_svg]:fill-white [&_svg]:text-white")}
      />
      <CardText {...text} />
    </Label>
  );
}

/** A large, fully clickable checkbox option. */
export function CheckCard({
  id,
  checked,
  onCheckedChange,
  className,
  ...text
}: CardTextProps & {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <Label htmlFor={id} className={cn(cardBase, className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="absolute left-4 top-4 size-4 border-[1.5px] border-foreground/40 data-[state=checked]:border-primary"
      />
      <CardText {...text} />
    </Label>
  );
}

export function StepHeading({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="mb-2">
      <h2
        id="step-heading"
        tabIndex={-1}
        className="font-heading text-base font-semibold leading-tight tracking-tight outline-none md:text-2xl"
      >
        {children}
      </h2>
      {hint && (
        <p className="mt-1.5 font-sans text-sm text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

export function Question({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6", className)}>
      <p
        id={id}
        className="mb-2.5 font-sans text-[15px] font-semibold tracking-tight"
      >
        {label}
      </p>
      {children}
    </div>
  );
}

/** Errors use dark text plus an icon, so meaning never depends on colour alone. */
export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-center gap-1.5 font-sans text-sm font-medium text-foreground"
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
