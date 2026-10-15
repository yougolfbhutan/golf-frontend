import { cn } from "@/lib/utils";

export type BookingStep = {
  label: string;
  /** Shows "Step 4 · optional" instead of "Step 4". */
  optional?: boolean;
};

export const BOOKING_STEPS: BookingStep[] = [
  { label: "Course & golfers" },
  { label: "Tee time" },
  { label: "Package" },
  // { label: "Pro shop", optional: true },
  { label: "Review & pay" },
];

type Props = {
  /** 1-based index of the current step. */
  currentStep: number;
  steps?: BookingStep[];
  title?: string;
  /** Called with the 1-based step when a reachable step is clicked. */
  onStepClick?: (step: number) => void;
  /** Highest 1-based step the user may jump to. Defaults to the current step. */
  maxReachableStep?: number;
  className?: string;
};

export default function BookingHeader({
  currentStep,
  steps = BOOKING_STEPS,
  title = "Book a round",
  onStepClick,
  maxReachableStep = currentStep,
  className,
}: Props) {
  const current = steps[currentStep - 1];

  return (
    <header className={className}>
      <h1 className="font-display text-2xl font-bold sm:text-4xl">{title}</h1>

      {/* Mobile: which step am I on? */}
      {current && (
        <p className="mt-4 sm:hidden" aria-hidden>
          <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Step {currentStep} of {steps.length}
            {current.optional && " · optional"}
          </span>
          <span className="block text-base font-semibold">{current.label}</span>
        </p>
      )}

      <ol className="mt-3 flex gap-1.5 sm:mt-6 sm:gap-3">
        {steps.map((step, i) => {
          const n = i + 1;
          const isCurrent = n === currentStep;
          const isDone = n < currentStep;
          const reachable = !!onStepClick && n <= maxReachableStep;

          return (
            <li key={step.label} className="min-w-0 flex-1">
              <button
                type="button"
                disabled={!reachable}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onStepClick?.(n)}
                className={cn(
                  // mobile: a tappable bar; sm+: bar with text below
                  "block h-5 w-full border-t-4 text-left text-sm font-semibold disabled:cursor-not-allowed sm:h-auto sm:pt-2",
                  isDone && "border-primary",
                  isCurrent && "border-accent",
                  !isDone && !isCurrent && "border-border text-muted-foreground",
                )}
              >
                {/* screen readers on mobile, where the text is hidden */}
                <span className="sr-only sm:hidden">
                  Step {n}: {step.label}
                </span>

                <span className="hidden text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:block">
                  Step {n}
                  {step.optional && " · optional"}
                </span>
                <span className="hidden sm:block">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </header>
  );
}