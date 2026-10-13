import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  step: number;
  lastStep: number;
  canContinue: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function BookingNavigation({
  step,
  lastStep,
  canContinue,
  onBack,
  onNext,
}: Props) {
  return (
    <div
      className={cn(
        // mobile: fixed bar at the bottom with a blurred background
        "fixed inset-x-0 bottom-0 z-40 border-t bg-white/80 px-4 py-3 backdrop-blur-md",
        // desktop: normal block under the content
        "lg:static lg:mt-10 lg:border-t lg:bg-transparent lg:px-0 lg:py-6 lg:backdrop-blur-none",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        {/* Back */}
        <Button
          type="button"
          variant="ghost"
          disabled={step === 1}
          onClick={onBack}
          className="h-12 gap-2 rounded-full px-5 text-sm font-semibold text-black hover:bg-slate-100 hover:text-slate-900 boder border-black "
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Small progress text, visible on larger screens */}
        <span className="hidden text-sm font-medium text-slate-500 sm:block">
          Step {step} of {lastStep}
        </span>

        {/* Next */}
        {step < lastStep && (
          <Button
            type="button"
            disabled={!canContinue}
            onClick={onNext}
            className={cn(
              "group h-12 gap-2 rounded-full bg-[#10B759] px-7 text-sm font-semibold text-white",
              "shadow-[0_8px_20px_-6px_rgba(16,183,89,0.6)] transition-all duration-200",
              "hover:bg-[#0EA04F] hover:shadow-[0_10px_24px_-6px_rgba(16,183,89,0.7)]",
              "active:scale-[0.97]",
              "focus-visible:ring-4",
    "disabled:cursor-not-allowed disabled:opacity-100 disabled:pointer-events-auto",
            )}
          >
            {step === 4 ? "Continue" : "Next"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

