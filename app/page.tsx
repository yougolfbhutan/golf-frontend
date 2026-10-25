"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Users, User } from "lucide-react";
import Footer from "@/custom-components/footer/footer";
import Navbar from "@/custom-components/navbar/navbar";
import { cn } from "@/lib/utils";

// pro booking = your existing flow, untouched
import CustomerBookingPage from "./booking/booking-page";
// bulk booking = new flow for tourism guides and tour operators
import BulkBookingPage from "./booking/bulk-booking/bulk-booking-page";

type Tab = "bulk" | "pro";

// One shared container so the heading, tabs and (ideally) both booking pages
// all start and end at exactly the same left/right edges.
const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

const TABS: {
  id: Tab;
  label: string;
  hint: string;
  icon: typeof Users;
}[] = [
  { id: "bulk", label: "Bulk booking", hint: "Tourism guides & groups", icon: Users },
  { id: "pro", label: "Pro booking", hint: "Book a round or session", icon: User },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("bulk");
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    bulk: null,
    pro: null,
  });

  // left / right arrow keys move between tabs (standard tab behaviour)
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = TABS[(i + step + TABS.length) % TABS.length].id;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    // overflow-x-clip (not overflow-hidden) so the sticky tab bar keeps working
    <div className="w-full max-w-full overflow-x-clip bg-[#E9ECEF]">
      <Navbar />

      {/* spacer that clears the fixed navbar */}
      <div className="h-24 sm:h-28" />

      {/* page heading */}
      <header className="pb-6 pt-2">
        <div className={CONTAINER}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Reservations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book your time on the course
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
            Choose how you&lsquo;d like to book. Groups and tour operators can reserve
            several players at once.
          </p>
        </div>
      </header>

      {/* tab bar: stays pinned under the navbar while the page scrolls.
          top-16 = navbar height (use top-20 if your navbar is taller) */}
      <div className="sticky top-16 z-20 bg-[#E9ECEF]/85 py-3 backdrop-blur-md">
        <div className={CONTAINER}>
          <div
            role="tablist"
            aria-label="Booking type"
            onKeyDown={onKeyDown}
            className="grid w-full grid-cols-2 gap-1.5 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200 sm:inline-grid sm:w-auto"
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 sm:min-w-[220px] sm:px-4",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700",
                    active
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-white/15 text-white"
                        : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold sm:text-base">
                      {t.label}
                    </span>
                    <span
                      className={cn(
                        "block truncate text-xs",
                        active ? "text-emerald-100" : "text-slate-500",
                      )}
                    >
                      {t.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* both panels stay mounted so nothing a person typed is lost when they switch tabs.
          Each booking page brings its own container (same max-w-6xl + padding as CONTAINER),
          so the panels are NOT wrapped again here. */}
      <div
        role="tabpanel"
        id="panel-bulk"
        aria-labelledby="tab-bulk"
        className={cn(tab !== "bulk" && "hidden")}
      >
        <BulkBookingPage />
      </div>

      <div
        role="tabpanel"
        id="panel-pro"
        aria-labelledby="tab-pro"
        className={cn(tab !== "pro" && "hidden")}
      >
        <CustomerBookingPage />
      </div>

      <Footer />
    </div>
  );
}