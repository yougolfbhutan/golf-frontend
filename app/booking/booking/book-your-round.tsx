"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronUp,
  Loader2,
  Lock,
  Pencil,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { STEP_NAMES, type Step } from "./booking-data";
import {
  type BookingState,
  initialState,
  type Errors,
  toISODate,
  earliestDate,
  // validatePayment,
  formatMoney,
  bookingTotal,
  toBackendPayload,
} from "./booking-logic";
import { ImageSlider, type Slide } from "./image-slider";
import { Scorecard } from "./scorecard";
import { Confirmation } from "./steps/confirmation";
import { StepCourse } from "./steps/step-course";
import { StepDate } from "./steps/step-date";
import { StepEquipment } from "./steps/step-equipment";
import { StepPayment } from "./steps/step-payment";
import { StepExperience } from "./steps/step-experience";
import { useCreateBookingMutation } from "@/app/homepagecomponents/golfcourse/tanstack-function";
import { showToast } from "nextjs-toast-notify";
type BookYourRoundProps = {
  /** Course chosen on the previous page (from /reserve/[id]) */
  courseId?: string;
  /** Photos for the slider at the top (passed from the page) */
  images?: Slide[];
  coursename: string;
};

const DEFAULT_SLIDES: Slide[] = [
  { src: "/images/course-1.jpg", alt: "Fairway at sunrise" },
  { src: "/images/course-2.jpg", alt: "Clubhouse view" },
  { src: "/images/course-3.jpg", alt: "Putting green" },
];

const SLIDER_UNDER_NAVBAR = "-mt-16 md:-mt-20";
const STICKY_TOP = "top-16 md:top-20";

const BRAND = "#10B759";
const SECTIONS = [1, 2, 3, 4, 5] as const;
type SectionNo = (typeof SECTIONS)[number];
const REQUIRED: Record<SectionNo, boolean> = {
  1: true,
  2: false,
  3: false,
  4: true,
  5: true,
};

/** One friendly line under each step title — tells people *why* we ask. */
// const STEP_HINT: Record<SectionNo, string> = {
//   1: "Pick where you'd like to play.",
//   2: "Helps us pair you with the right tee time and caddie. Totally optional.",
//   3: "Bring your own clubs or rent ours. You can skip this.",
//   4: "Choose a day that suits you — at least 48 hours ahead.",
//   5: "Last step. You won't be charged until you tap Pay.",
// };

const stepName = (n: number) => STEP_NAMES[n as keyof typeof STEP_NAMES];

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type Status = "open" | "done" | "skipped" | "locked";

/* ------------------------------------------------------------------ */
/* Progress bar (sticky) — only steps already reached are clickable     */
/* ------------------------------------------------------------------ */
function ProgressNav({
  open,
  reached,
  complete,
  onJump,
}: {
  open: SectionNo;
  reached: SectionNo;
  complete: Record<SectionNo, boolean>;
  onJump: (n: SectionNo) => void;
}) {
  const pct = ((reached - 1) / SECTIONS.length) * 100;
  const left = SECTIONS.length - reached + 1;

  return (
    <nav
      aria-label="Booking progress"
      className={cn(
        "sticky z-30 -mx-4 mb-6 border-b bg-background/85 px-4 backdrop-blur-md sm:-mx-5 sm:px-5",
        STICKY_TOP,
      )}
    >
      <div className="flex items-center justify-between gap-3 py-3">
        <ol className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] md:gap-2">
          {SECTIONS.map((n, i) => {
            const isOpen = open === n;
            const isDone = complete[n];
            const canJump = n <= reached;
            return (
              <li key={n} className="flex shrink-0 items-center">
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => onJump(n)}
                  aria-current={isOpen ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]/50",
                    isOpen
                      ? "bg-[#10B759]/10 text-foreground"
                      : "text-muted-foreground",
                    canJump && !isOpen && "hover:bg-muted",
                    !canJump && "cursor-default opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs font-bold transition-all",
                      isDone
                        ? "bg-[#10B759] text-white"
                        : isOpen
                          ? "border-2 border-[#10B759] text-[#10B759]"
                          : "border border-border",
                    )}
                  >
                    {isDone ? (
                      <Check className="size-3.5" strokeWidth={3} />
                    ) : (
                      n
                    )}
                  </span>
                  <span className={cn(isOpen ? "inline" : "hidden lg:inline")}>
                    {stepName(n)}
                  </span>
                </button>
                {i < SECTIONS.length - 1 && (
                  <span
                    aria-hidden
                    className="mx-0.5 hidden h-px w-3 bg-border md:block lg:w-6"
                  />
                )}
              </li>
            );
          })}
        </ol>
        {/* <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
          {left === 1 ? "Last step" : `${left} quick steps left`}
        </span> */}
      </div>
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: BRAND }}
        />
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* One step: open (full form), done/skipped (one-line summary), locked  */
/* ------------------------------------------------------------------ */
function StepCard({
  n,
  status,
  summary,
  onEdit,
  footer,
  children,
}: {
  n: SectionNo;
  status: Status;
  summary?: string;
  onEdit: () => void;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  /* Collapsed: finished or skipped — show what they chose, let them edit */
  if (status === "done" || status === "skipped") {
    return (
      <Card
        id={`section-${n}`}
        className="scroll-mt-40 rounded-2xl border py-0 transition-all"
      >
        <button
          type="button"
          onClick={onEdit}
          className="flex w-full items-center gap-3 rounded-2xl p-4 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B759]/50 md:px-6"
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
              status === "done"
                ? "bg-[#10B759] text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            {status === "done" ? (
              <Check className="size-4" strokeWidth={3} />
            ) : (
              n
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{stepName(n)}</span>
            <span className="block truncate text-sm text-muted-foreground">
              {summary}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#0b8a43]">
            <Pencil className="size-3.5" /> Edit
          </span>
        </button>
      </Card>
    );
  }

  /* Locked: future step — just the title, so the form looks short */
  if (status === "locked") {
    return (
      <div
        id={`section-${n}`}
        className="flex items-center gap-3 rounded-2xl border border-dashed px-4 py-3.5 opacity-60 md:px-6"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border text-sm font-bold text-muted-foreground">
          {n}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {stepName(n)}
        </span>
        {!REQUIRED[n] && (
          <span className="ml-auto text-xs text-muted-foreground">
            Optional
          </span>
        )}
      </div>
    );
  }

  /* Open: the only step with fields on screen */
  return (
    <Card
      id={`section-${n}`}
      aria-labelledby={`section-${n}-title`}
      className="scroll-mt-40 rounded-3xl border border-[#10B759]/40 py-0 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <CardContent className="p-5 md:p-8">
        {/* <header className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#10B759]/10 text-base font-bold text-[#10B759]">
              {n}
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {n} of 5
              </p>
              <h2
                id={`section-${n}-title`}
                className="text-lg font-semibold leading-tight md:text-xl"
              >
                {stepName(n)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {STEP_HINT[n]}
              </p>
            </div>
          </div>
          {!REQUIRED[n] && (
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Optional
            </span>
          )}
        </header> */}
        {children}
        {footer}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */
export function BookYourRound({
  courseId,
  images,
  coursename,
}: BookYourRoundProps) {
  // Always start at step 1. The course from the previous page is pre-selected, but the user confirms it.
  const startAt: SectionNo = 1;
  // Nothing opens until the user taps "Start booking".
  const [started, setStarted] = useState(false);
   const { createBooking } = useCreateBookingMutation({
    onSuccess: (data) => {
      showToast.success(data.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
      
    },
    onError: (error) => {
      showToast.error(error?.data?.message, {
        duration: 5000,
        position: "top-right",
        transition: "topBounce",
        icon: "",
        sound: true,
      });
    },
  });
  const [state, setState] = useState<BookingState>(() =>
    courseId
      ? { ...initialState, course: courseId as BookingState["course"] }
      : initialState,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [courseMissing, setCourseMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState("");
  const [open, setOpen] = useState<SectionNo>(startAt);
  const [reached, setReached] = useState<SectionNo>(startAt);
  const [skipped, setSkipped] = useState<SectionNo[]>([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollOnOpen = useRef(false);

  const done = (state.step as unknown as number) === 6;
  const slides = images?.length ? images : DEFAULT_SLIDES;
  const total = formatMoney(state.who, bookingTotal(state));
  /** Everything the user picked, in one object ready to send to the backend. */
  const buildBookingPayload = () => ({
    who: state.who,
    passport: state.passport,
    course: state.course,
    level: state.level,
    coaching: state.addons.includes("coaching"),
    companion: state.addons.includes("companion"),
    players: state.players,
    setQuantities: state.setQuantities,
    accessoryQuantities: state.accessoryQuantities ?? {},
    date: state.date,
    slot: state.slot,
    details: {
      name: state.details.name,
      phone: state.details.phone,
      email: state.details.email,
      specialRequests: state.details.specialRequests ?? "",
    },
    payment:
      state.payment.method === "dk"
        ? { method: "dk", dkAccount: state.payment.dkAccount }
        : {
            method:
              state.payment.method /* + token from your payment provider */,
          },
  });
  const update = (patch: Partial<BookingState>) => {
    setState((s) => ({ ...s, ...patch }));
    if (patch.date) setErrors((e) => ({ ...e, date: undefined }));
    if (patch.course) setCourseMissing(false);
  };

  const getDateError = () =>
    !state.date
      ? "Please choose a date for your round."
      : state.date < toISODate(earliestDate())
        ? "Please book at least 48 hours ahead."
        : undefined;

  const complete: Record<SectionNo, boolean> = {
    1: !!state.course && reached > 1,
    2: reached > 2 && !skipped.includes(2),
    3: reached > 3 && !skipped.includes(3),
    4: !getDateError() && reached > 4,
    5: false,
  };

  const statusOf = (n: SectionNo): Status => {
    if (n === open) return "open";
    if (n > reached) return "locked";
    if (skipped.includes(n)) return "skipped";
    return n < reached ? "done" : "locked";
  };

  /** Short recap shown on a collapsed step. Swap 2 & 3 for real values from your state if you like. */
  const summaryOf = (n: SectionNo): string => {
    if (skipped.includes(n)) return "Skipped — you can add this any time";
    switch (n) {
      case 1:
        return state.course === courseId ? coursename : "Course selected";
      case 2:
        return "Experience saved";
      case 3:
        return "Equipment saved";
      case 4:
        return state.date ? formatDate(state.date) : "";
      default:
        return "";
    }
  };

  /* Scroll the newly opened step into view */
  const scrollTo = (n: SectionNo) =>
    requestAnimationFrame(() =>
      document
        .getElementById(`section-${n}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );

  useEffect(() => {
    if (!scrollOnOpen.current) return;
    scrollOnOpen.current = false;
    scrollTo(open);
  }, [open]);

  /* Lock body scroll while the mobile summary sheet is open */
  useEffect(() => {
    document.body.style.overflow = summaryOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [summaryOpen]);

  const focusFirstInvalid = () =>
    window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>("[aria-invalid='true']");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
    }, 60);

  const openStep = (n: SectionNo) => {
    if (n > reached) return;
    if (n === open) return scrollTo(n);
    scrollOnOpen.current = true;
    setOpen(n);
  };

  /** Validate only the step the user is on — never show errors for steps they haven't seen. */
  const validateStep = (n: SectionNo) => {
    if (n === 1 && !state.course) {
      setCourseMissing(true);
      return false;
    }
    if (n === 4) {
      const date = getDateError();
      if (date) {
        setErrors((e) => ({ ...e, date }));
        focusFirstInvalid();
        return false;
      }
    }
    return true;
  };

  const next = (n: SectionNo, skip = false) => {
    if (!skip && !validateStep(n)) return;
    setSkipped((s) =>
      skip ? Array.from(new Set([...s, n])) : s.filter((x) => x !== n),
    );
    // Editing an earlier step? Send them back to where they were.
    const target = (
      reached > n + 1 ? reached : Math.min(n + 1, 5)
    ) as SectionNo;
    setReached((r) => (target > r ? target : r));
    scrollOnOpen.current = true;
    setOpen(target);
  };

  // StepPayment uses goTo to jump back to a step.
  const goTo = (step: Step) => {
    const n = step as unknown as number;
    if (n >= 6) {
      setState((s) => ({ ...s, step }));
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    openStep(n as SectionNo);
  };

  const pay = () => {
    console.log("pay clicked", state.course, state.date);

    setSummaryOpen(false);

    if (!state.course) {
      setCourseMissing(true);
      return openStep(1);
    }

    const date = getDateError();
    const found: Errors = {
      // ...validatePayment(state),
      ...(date ? { date } : {}),
    };
    setErrors(found);

    if (date) {
      openStep(4);
      return focusFirstInvalid();
    }
    if (Object.keys(found).length) {
      openStep(5);
      return focusFirstInvalid();
    }

    // ✅ Everything is valid, so this is what gets submitted
    const payload = buildBookingPayload();
    console.log("Booking submitted:", payload);
    console.table(payload); // easier to read in DevTools

    setBusy(true);
      createBooking(toBackendPayload(state)); // sends the request

    window.setTimeout(() => {
      setReference(`YGB-${Math.floor(1000 + Math.random() * 9000)}`);
      setBusy(false);
      goTo(6 as unknown as Step);
    }, 1600);
  };

  const errorCount =
    Object.values(errors).filter(Boolean).length + (courseMissing ? 1 : 0);
  const payLabel = busy
    ? state.payment.method === "dk"
      ? "Approve in DK Bank…"
      : "Processing…"
    : `Pay ${total}`;
  const stepProps = { state, update, errors };
  const onPayStep = open === 5;

  const payButton = (className?: string) => (
    <Button
      size="lg"
      onClick={pay}
      disabled={busy}
      className={cn(
        "h-14 rounded-2xl bg-[#10B759] text-base font-bold text-white shadow-lg shadow-[#10B759]/25 hover:bg-[#0ea350] active:scale-[0.99]",
        className,
      )}
    >
      {busy ? (
        <Loader2 className="mr-2 size-5 animate-spin" />
      ) : (
        <Lock className="mr-2 size-4" />
      )}
      {payLabel}
    </Button>
  );

  /** Continue / Skip row at the bottom of steps 1–4 */
  const stepFooter = (n: SectionNo) => {
    if (n === 5) {
      return (
        <div className="mt-8 space-y-3 border-t pt-6">
          {payButton("hidden w-full md:flex lg:hidden")}
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3" /> Encrypted payment · You&rsquo;ll get a
            confirmation instantly
          </p>
        </div>
      );
    }
    const returning = reached > n + 1;
    return (
      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        {!REQUIRED[n] ? (
          <button
            type="button"
            onClick={() => next(n, true)}
            className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Skip for now
          </button>
        ) : (
          <span />
        )}
        <Button
          onClick={() => next(n)}
          className="h-12 rounded-2xl bg-[#10B759] px-6 text-base font-semibold text-white hover:bg-[#0ea350]"
        >
          {returning ? "Save changes" : `Continue to ${stepName(n + 1)}`}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    );
  };

  const stepBody = (n: SectionNo) => {
    switch (n) {
      case 1:
        return (
          <>
            {courseMissing && (
              <p
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="size-4" /> Please choose a course to
                continue.
              </p>
            )}
            <StepCourse {...stepProps} />
          </>
        );
      case 2:
        return <StepExperience {...stepProps} />;
      case 3:
        return <StepEquipment {...stepProps} />;
      case 4:
        return <StepDate {...stepProps} />;
      case 5:
        return <StepPayment {...stepProps} goTo={goTo} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="book"
      aria-labelledby="book-title"
      className="scroll-mt-20 bg-muted/30 text-foreground"
    >
      {/* ---------- Hero ---------- */}
      <div className="relative">
        <ImageSlider
          images={slides}
          fullWidth
          className={SLIDER_UNDER_NAVBAR}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-5 md:pb-12">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <ShieldCheck className="size-3.5" /> Secure booking · Instant
              confirmation
            </span>
            <h1
              id="book-title"
              className="font-heading text-3xl font-bold leading-tight text-white drop-shadow md:text-5xl"
            >
              Book {coursename}
            </h1>
            <p className="mt-2 max-w-xl text-base text-white/85 md:text-lg">
              About 2 minutes · Two steps are optional · Pay only at the end
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-36 pt-6 sm:px-5 lg:pb-20">
        {!done && (
          <ProgressNav
            open={open}
            reached={reached}
            complete={complete}
            onJump={openStep}
          />
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* ---------- Form column ---------- */}
          <div>
            {done ? (
              <Card className="rounded-3xl border py-0 shadow-sm">
                <CardContent className="p-5 md:p-8">
                  <Confirmation
                    state={state}
                    reference={reference}
                    onNewBooking={() => {
                      setState({
                        ...initialState,
                        who: state.who,
                        passport: state.passport,
                      });
                      setErrors({});
                      setSkipped([]);
                      setOpen(1);
                      setReached(1);
                      sectionRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {SECTIONS.map((n) => {
                  const status = statusOf(n);
                  return (
                    <StepCard
                      key={n}
                      n={n}
                      status={status}
                      summary={summaryOf(n)}
                      onEdit={() => openStep(n)}
                      footer={status === "open" ? stepFooter(n) : undefined}
                    >
                      {status === "open" ? stepBody(n) : null}
                    </StepCard>
                  );
                })}

                {onPayStep && errorCount > 0 && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
                  >
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                    <p>
                      <strong className="font-semibold">
                        Almost there — {errorCount}{" "}
                        {errorCount === 1 ? "detail needs" : "details need"} a
                        quick fix.
                      </strong>{" "}
                      We&#39;ve highlighted {errorCount === 1 ? "it" : "them"}{" "}
                      above.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------- Desktop sidebar ---------- */}
          <aside className="sticky top-40 hidden lg:block">
            <div className="overflow-hidden rounded-3xl border bg-background shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="font-semibold">Your round</h2>
              </div>
              <div className="p-6">
                <Scorecard state={state} />
              </div>
              {!done && (
                <div className="space-y-3 border-t bg-muted/40 p-6">
                  {onPayStep ? (
                    <>
                      {payButton("w-full")}
                      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <Lock className="size-3" /> Payments are encrypted &
                        secure
                      </p>
                    </>
                  ) : (
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#10B759]" />
                      Nothing is charged yet. You&#39;ll review everything
                      before paying.
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- Mobile: summary sheet + sticky action bar ---------- */}
      {!done && (
        <div className="md:hidden">
          {summaryOpen && (
            <button
              aria-label="Close summary"
              onClick={() => setSummaryOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] animate-in fade-in"
            />
          )}

          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t bg-background">
            {summaryOpen && (
              <div className="max-h-[65vh] overflow-y-auto px-5 pt-5 animate-in slide-in-from-bottom-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold">Your round</h2>
                  <button
                    onClick={() => setSummaryOpen(false)}
                    aria-label="Close"
                    className="rounded-full p-1.5 hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <Scorecard state={state} />
              </div>
            )}

            <div className="flex items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <button
                type="button"
                onClick={() => setSummaryOpen((o) => !o)}
                aria-expanded={summaryOpen}
                className="flex flex-col items-start rounded-xl px-1 text-left"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  Total{" "}
                  <ChevronUp
                    className={cn(
                      "size-3.5 transition-transform",
                      summaryOpen && "rotate-180",
                    )}
                  />
                </span>
                <span className="text-lg font-bold leading-tight">{total}</span>
              </button>
              {onPayStep ? (
                payButton("h-12 flex-1")
              ) : (
                <Button
                  onClick={() => next(open)}
                  className="h-12 flex-1 rounded-2xl bg-[#10B759] text-base font-semibold text-white hover:bg-[#0ea350]"
                >
                  Continue <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
