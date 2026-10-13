"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabItem<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
};

type Props<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** "line" = underlined tabs, "pill" = modern segmented tabs */
  variant?: "line" | "pill";
  className?: string;
  /** extra classes for each trigger */
  triggerClassName?: string;
};

export default function AppTabs<T extends string>({
  items,
  value,
  onValueChange,
  variant = "pill",
  className,
  triggerClassName,
}: Props<T>) {
  const isLine = variant === "line";

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList
        className={cn(
          // pill: neutral glassy track, lets the green active button pop
          !isLine &&
            "h-auto gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 backdrop-blur " +
              "dark:border-white/10 dark:bg-white/5",

          // line: clean baseline
          isLine &&
            "h-auto w-full justify-start gap-6 rounded-none border-b border-slate-200 bg-transparent p-0 dark:border-white/10",

          className,
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(
              "relative text-sm font-medium transition-all duration-200 motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-[#10B759]/40 focus-visible:ring-offset-0",

              // pill: gradient green active button with soft glow
              !isLine &&
                "rounded-xl border-0 px-5 py-2 text-slate-500 hover:bg-white hover:text-slate-900 " +
                  "dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white " +
                  "data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#22D36F] data-[state=active]:to-[#10B759] " +
                  "data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_-8px_rgba(16,183,89,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] " +
                  "dark:data-[state=active]:border-transparent dark:data-[state=active]:from-[#22D36F] dark:data-[state=active]:to-[#10B759] dark:data-[state=active]:text-white",

              // line: green text + gradient underline that slides in
              isLine &&
                "rounded-none border-0 bg-transparent px-1 pb-3 pt-1 text-slate-500 shadow-none hover:text-slate-900 " +
                  "dark:text-slate-400 dark:hover:text-white " +
                  "data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#0E9F4F] data-[state=active]:shadow-none " +
                  "dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-[#34E27F] " +
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:origin-center after:scale-x-0 after:rounded-full " +
                  "after:bg-gradient-to-r after:from-[#22D36F] after:to-[#10B759] after:transition-transform after:duration-300 " +
                  "motion-reduce:after:transition-none data-[state=active]:after:scale-x-100",

              triggerClassName,
            )}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}