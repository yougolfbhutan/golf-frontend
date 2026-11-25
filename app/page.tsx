"use client";
import Footer from "@/custom-components/footer/footer";
import { cn } from "@/lib/utils";

import BulkBookingPage from "./booking/bulk-booking/bulk-booking-page";

// One shared container so the heading, tabs and (ideally) both booking pages
// all start and end at exactly the same left/right edges.
const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export default function Home() {
  return (
    // overflow-x-clip (not overflow-hidden) so the sticky tab bar keeps working
    <div className="w-full max-w-full overflow-x-clip bg-[#E9ECEF]">

      <section className="relative h-[40svh] min-h-[420px] w-full overflow-hidden bg-[#0F3D2E] sm:h-[55svh] sm:min-h-[440px] lg:h-[60svh] lg:min-h-[480px] xl:h-[55svh]">
        {" "}
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          src="/golf-video.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* poster shown for people who prefer reduced motion */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
          style={{ backgroundImage: "url(/hero-poster.jpg)" }}
        />
        {/* dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
        <div
          className={cn(
            CONTAINER,
            "relative z-10 flex h-full flex-col justify-end pb-14 sm:pb-20",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Reservations
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Book your time on the course
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Groups and tour operators can reserve several players at once.
          </p>
        </div>
      </section>
      <div>
        <BulkBookingPage />
      </div>

      <Footer />
    </div>
  );
}
