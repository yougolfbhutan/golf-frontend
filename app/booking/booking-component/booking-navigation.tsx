import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEP_NAMES = [
  "Course & golfers",
  "Tee time",
  "Package",
  "Pro shop",
  "Review & pay",
];

type Props = {
  step: number; // 1-based
  lastStep: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
  /** Optional override for the step names (index 0 = step 1). */
  stepNames?: string[];
};

export default function BookingNavigation({
  step,
  lastStep,
  canContinue,
  onBack,
  onNext,
  stepNames = STEP_NAMES,
}: Props) {
  const nextName = stepNames[step] ?? "Next"; // step is 1-based, so stepNames[step] is the next step
  const showBack = step > 1;
  const showNext = step < lastStep;

  return (
    <div className="flex items-center gap-3">
      {/* Back */}
      {showBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          aria-label="Go back to the previous step"
          className={cn(
            "group h-12 shrink-0 gap-2 rounded-full border-[1.5px] border-black bg-white px-5",
            "text-sm font-semibold text-black transition-all duration-200",
            "hover:bg-slate-50 hover:text-black active:scale-[0.97]",
            "focus-visible:ring-4 focus-visible:ring-black/10",
            !showNext && "flex-1",
          )}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back
        </Button>
      )}

      {/* Next */}
      {showNext && (
        <Button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          aria-label={`Continue to ${nextName}`}
          className={cn(
            "group relative h-12 min-w-0 flex-1 justify-between rounded-full py-0 pl-6 pr-1.5",
            "text-sm font-semibold transition-all duration-200",
            // enabled
            "bg-[#10B759] text-white shadow-[0_10px_24px_-8px_rgba(16,183,89,0.65)]",
            "hover:bg-[#0EA04F] hover:shadow-[0_12px_28px_-8px_rgba(16,183,89,0.75)]",
            "active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-[#10B759]/25",
            // disabled
            "disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400",
            "disabled:opacity-100 disabled:shadow-none disabled:pointer-events-auto",
          )}
        >
          <span className="truncate">{nextName}</span>
          <span
            className={cn(
              "ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
              "bg-white/20 group-hover:bg-white/30",
              "group-disabled:bg-white/60",
            )}
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-disabled:translate-x-0" />
          </span>
        </Button>
      )}
    </div>
  );
}