import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** small tip shown on phones only, set to "" to hide */
  hint?: string;
};

/**
 * Phones: a horizontal row you swipe, one card snaps into view at a time.
 * Tablet (sm) and up: a normal grid (2 columns, then 3 on lg).
 */
export default function CardSlider({
  children,
  className,
  hint = "Swipe to see more",
}: Props) {
  return (
    <div>
      <div
        className={cn(
          // phones: swipe row that snaps card by card
          "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // tablet and up: grid
          "sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3",
          // cards are 82% wide on phones so the next one peeks in
          "[&>*]:w-[82%] [&>*]:shrink-0 [&>*]:snap-center sm:[&>*]:w-auto",
          className,
        )}
      >
        {children}
      </div>

      {hint && (
        <p className="mt-1 text-center text-xs text-slate-500 sm:hidden">
          {hint}
        </p>
      )}
    </div>
  );
}