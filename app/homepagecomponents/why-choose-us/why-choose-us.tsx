import { useEffect, useRef, useState } from "react";
import { stats } from "./data";

export default function GolfStats() {
  const sectionRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div
          ref={sectionRef}
          className="mt-14 flex flex-wrap items-start justify-center gap-x-14 gap-y-12 sm:justify-between sm:gap-x-8"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex w-36 flex-col items-center text-center"
                style={{
                  transitionDelay: revealed ? `${i * 80}ms` : "0ms",
                }}
              >
                <Icon className={`h-8 w-8 ${stat.color}`} strokeWidth={2} />

                <div
                  className={`whitespace-pre-line font-medium text-black/80  "mt-4 text-base"}`}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
