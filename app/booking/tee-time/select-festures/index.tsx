import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useId } from "react";
import type { FieldProps } from "../tee-time-search/tee-options";
export default function Field({ label, value, options, onValueChange, className }: FieldProps) {
  const id = useId();
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white px-5 py-3 transition-colors",
        "hover:border-neutral-300 focus-within:border-[#2f5d3a] focus-within:ring-2 focus-within:ring-[#2f5d3a]/20",
        className
      )}
    >
      <label
        htmlFor={id}
        className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5b6b5f]"
      >
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className="mt-1 h-auto w-full justify-between gap-3 border-0 bg-transparent p-0 text-base font-medium text-neutral-900 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 [&>svg]:text-neutral-800 [&>svg]:opacity-100"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}