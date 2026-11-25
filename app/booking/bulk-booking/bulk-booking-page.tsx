"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Oswald } from "next/font/google";
import BookingForm, {
  type BookingValues,
  type BookingSummary,
} from "./components/booking-from";
import { golfBooking } from "./data";
import { AuthModal } from "@/app/(auth)/Auth-modal";
import { useAuth } from "@/app/context/auth-context";
import { isSystemUser } from "@/app/src/lib/auth/auth-roles";
import PaymentForm, { type PaymentPayload } from "@/app/payment/payment-form";
import { useCheckout } from "@/app/context/checkout-context";
import type { Course } from "@/app/homepagecomponents/golfcourse/courses";
import ImageSliderCard from "../booking-component/image-slider-component";
import { PENDING_KEY } from "@/app/context/post-login-redirect";

const condensed = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

/* ---------- types ---------- */
type Price = { saarc: number; nonSaarc: number };
type CourseStat = { value: string; label: string };

type GearItem = {
  label: string;
  title: string;
  description: string;
  image: string;
  details: string[];
};

type GolfPackage = {
  id: string;
  title: string;
  items: GearItem[];
  price: Price; // per golfer, also the deduction if they bring their own
};

// the user object that comes from your auth context
type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

// everything the payment step needs, passed by state instead of the URL
type Checkout = {
  orderId: string;
  values: BookingValues;
  summary: BookingSummary;
  user: AuthUser;
};

/* ---------- placeholder data (replace with your API) ---------- */
const COURSES: Course[] = [
  {
    id: 1,
    bookingId: "2",
    name: "Royal Thimphu Golf Course",
    location: "Chhophel Lam, Thimphu",
    tagline: "Where the Himalaya meets perfection",
    holes: 9,
    par: 36,
    length: "5,706 yds",
    founded: "1971",

    features: ["Mountain Views", "Dzong Backdrop", "Open to Public"],
    club_Facilities: [
      "Clubhouse",
      "Pro Shop",
      "Driving Range",
      "Club / Shoe Rental",
    ],
    image: ["/rtgc.jpeg", "/rtgc1.jpeg", "/rtgc3.jpeg"],
    stars: 5,
    description:
      "Founded in 1971 and set near Tashichho Dzong at an altitude of over 7,500 feet, this is Bhutan's most iconic course. Play among pine-lined fairways with Himalayan views, then relax at the clubhouse. Open to the public, with a pro shop and driving range on site.",
  },
  {
    id: 2,
    bookingId: "1",
    name: "Drakpoi Golf Course",
    location: "Thimphu",
    tagline: "Mountain grandeur, immaculate greens",
    holes: 18,
    par: 72,
    length: "6,608 yds",
    rating: "73.1 / 138",
    founded: "1964",
    features: ["Mountain Terrain", "Bentgrass Greens", "Valley Views"],
    club_Facilities: [
      "Practice Facilities",
      "Lessons",
      "Dining",
      "Club / Shoe Rental",
      "On-site Lodging",
      "Spa",
    ],
    image: [
      "/drakpoi-course.jpeg",
      "/drakpoi-course1.jpeg",
      "/drakpoi-course2.jpeg",
    ],
    stars: 5,
    description:
      "An 18-hole championship layout winding through mountain terrain, known for immaculate bentgrass greens and sweeping valley views. Guests can extend their stay with on-site lodging and a full spa after the round.",
  },
];

const PACKAGE: GolfPackage = {
  id: "standard",
  title: "Standard Kit",
  price: { saarc: 200, nonSaarc: 250 },
  items: [
    {
      label: "Golf set",
      title: "Full Set (Right Hand)",
      description:
        "A complete set so you can walk onto the course with nothing.",
      image: "/golf-set.jpg",
      details: ["Driver, woods and irons", "Putter", "Carry bag included"],
    },
    {
      label: "Golf balls",
      title: "Titleist Balls x6",
      description: "Premium balls for your whole round.",
      image: "/ball.jpg",
      details: ["6 balls per golfer", "Premium quality"],
    },
    {
      label: "Gloves",
      title: "FootJoy Glove",
      description: "A comfortable grip glove for every golfer.",
      image: "/glove.jpg",
      details: ["1 glove per golfer", "Sizes S to XL"],
    },
  ],
};

const formatPrice = (n: number) => `USD. ${n.toLocaleString()}`;

/* ---------- reusable single card that slides between slides ---------- */
function SlideCard({
  slides,
  label,
}: {
  slides: React.ReactNode[];
  label: string; // used for accessibility, e.g. "course" or "kit item"
}) {
  const [i, setI] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);

  const go = (dir: 1 | -1) =>
    setI((p) => (p + dir + slides.length) % slides.length);

  // swipe support on touch screens
  const onTouchEnd = (x: number) => {
    if (touchX === null) return;
    const diff = x - touchX;
    if (Math.abs(diff) > 50) go(diff < 0 ? 1 : -1);
    setTouchX(null);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
      {/* sliding track */}
      <div
        className="flex flex-1 items-stretch transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className="flex w-full shrink-0 flex-col"
          >
            {slide}
          </div>
        ))}
      </div>

      {/* controls */}
      {slides.length > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show ${label} ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i
                    ? "w-7 bg-[#0E9F4F]"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={`Previous ${label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-[#0F3D2E] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Next ${label}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-[#0F3D2E] hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- price tiles shared by course and kit slides ---------- */
function PriceTiles({ title, price }: { title: string; price: Price }) {
  return (
    <div className="mt-auto pt-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-[#10B759]/10 p-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-slate-500">
            SAARC
          </p>
          <p className="text-base font-extrabold text-[#0E9F4F]">
            {formatPrice(price.saarc)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-center">
          <p className="text-[10px] font-semibold uppercase text-slate-500">
            Non-SAARC
          </p>
          <p className="text-base font-extrabold text-slate-800">
            {formatPrice(price.nonSaarc)}
          </p>
        </div>
      </div>
    </div>
  );
}
function CoursesSingleCard({ courses }: { courses: Course[] }) {
  const slides = courses.map((course) => {
    const meta = [
      `${course.holes} holes`,
      `Par ${course.par}`,
      course.length,
      course.rating ? `Rating ${course.rating}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <ImageSliderCard
        key={course.id}
        images={course.image}
        title={course.name}
        location={course.location}
        // description={course.tagline}
        meta={meta}
        // badge={`${course.green_fee} green fee`}
        tags={course.features}
        // the outer SlideCard already provides the border and shadow
        className="flex-1 rounded-none border-0 shadow-none"
      ></ImageSliderCard>
    );
  });

  return <SlideCard slides={slides} label="course" />;
}

/* ---------- golf kit: auto-sliding full image + item list ---------- */
function KitSingleCard({ pkg }: { pkg: GolfPackage }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = pkg.items.length;

  // slide automatically every 3 seconds, pause while hovering or touching
  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), 3000);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
      {/* auto-sliding image, fills the whole area */}
      <div
        className="relative h-48 overflow-hidden bg-slate-100"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {pkg.items.map((it, idx) => (
            <div
              key={it.label}
              aria-hidden={idx !== i}
              className="relative h-full w-full shrink-0"
            >
              <Image
                src={it.image}
                alt={it.title}
                fill
                priority={idx === 0}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* soft dark fade so the badges stay readable on any photo */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent" />

        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#0E9F4F] px-2.5 py-1 text-xs font-semibold text-white shadow">
          <Check className="h-3.5 w-3.5" />
          {pkg.items[i].label}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          {i + 1} / {count}
        </span>
      </div>

      {/* what is in the kit */}
      <div className="flex flex-1 flex-col p-3.5">
        <ul className="space-y-1.5">
          {pkg.items.map((it, idx) => (
            <li key={it.label}>
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-current={idx === i}
                className={`flex w-full items-start gap-2.5 rounded-xl border px-2.5 py-2 text-left transition ${
                  idx === i
                    ? "border-[#0E9F4F] bg-[#0E9F4F]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    idx === i
                      ? "bg-[#0E9F4F] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">
                    {it.label}:{" "}
                    <span className="font-normal text-slate-600">
                      {it.title}
                    </span>
                  </span>
                  <span className="block text-xs text-slate-500">
                    {it.details.join(", ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <PriceTiles title="Standard Kit per golfer" price={pkg.price} />
      </div>
    </div>
  );
}

/* ---------- page ---------- */
export default function BulkBookingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  // set after the booking form is submitted: shows the payment step
  const { setCheckout } = useCheckout();
  // holds the "waiting for login" promise while the modal is open
  const pendingAuth = useRef<{
    resolve: (u: AuthUser) => void;
    reject: (e: Error) => void;
  } | null>(null);

  // returns the signed-in user, or opens the modal and waits for login
  function requireUser(): Promise<AuthUser> {
    if (user?.id) return Promise.resolve(user as AuthUser);
    return new Promise<AuthUser>((resolve, reject) => {
      pendingAuth.current = { resolve, reject };
      setAuthOpen(true);
    });
  }

  function handleAuthOpenChange(open: boolean) {
    setAuthOpen(open);
    // modal closed without logging in -> cancel the submit
    if (!open && pendingAuth.current) {
      pendingAuth.current.reject(new Error("Please sign in to continue."));
      pendingAuth.current = null;
    }
  }

  return (
    <div className="relative overflow-x-clip">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-10 sm:px-6 lg:px-8">
        {/* heading */}
        <div>
          <h1
            className={`${condensed.className} text-4xl font-bold uppercase leading-none tracking-tight text-slate-900 sm:text-5xl`}
          >
            Book your <span className="text-[#0E9F4F]">round</span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Pick your date and tee time. We provide golf set, balls and gloves,
            or bring your own and get a deduction.
          </p>
        </div>

        {/* golf courses + golf kit side by side */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-stretch">
          <section className="flex min-w-0 flex-1 flex-col">
            <div className="mb-4">
              <h2
                className={`${condensed.className} text-2xl font-bold uppercase tracking-tight text-slate-900`}
              >
                Our golf courses
              </h2>
              <p className="text-sm text-slate-500">
                Swipe or use the arrows to see each course.
              </p>
            </div>
            <CoursesSingleCard courses={COURSES} />

            {/* <CoursesSingleCard courses={COURSES} /> */}
          </section>

          <section className="flex min-w-0 flex-1 flex-col">
            <div className="mb-4">
              <h2
                className={`${condensed.className} text-2xl font-bold uppercase tracking-tight text-slate-900`}
              >
                Equipment we provide
              </h2>
              <p className="text-sm text-slate-500">
                Bring your own and we deduct the kit price.
              </p>
            </div>
            <KitSingleCard pkg={PACKAGE} />
          </section>
        </div>

        <section id="booking" className="scroll-mt-6">
          <h2
            className={`${condensed.className} mb-4 text-2xl font-bold uppercase tracking-tight text-slate-900`}
          >
            Reserve your tee time
          </h2>
          <BookingForm
            config={golfBooking}
            // showSuccess={false}
            onSubmit={async (values, summary) => {
              const orderId = `ORD-${Date.now()}`;

              // Not logged in: Google login will reload the page, so save the booking
              if (!user?.id) {
                sessionStorage.setItem(
                  PENDING_KEY,
                  JSON.stringify({ orderId, values, summary, ts: Date.now() }),
                );
              }

              let currentUser: AuthUser;
              try {
                currentUser = await requireUser(); // email login resolves here
              } catch (e) {
                sessionStorage.removeItem(PENDING_KEY); // modal closed without login
                throw e;
              }

              sessionStorage.removeItem(PENDING_KEY); // no reload happened, not needed

              if (isSystemUser(currentUser)) {
                router.replace("/dashboard");
                return;
              }

              setCheckout({ orderId, values, summary, user: currentUser });
              router.push("/payment");
            }}
          />
        </section>
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={handleAuthOpenChange}
        onSuccess={(loggedInUser) => {
          // resolve first, so closing the modal doesn't count as a cancel
          pendingAuth.current?.resolve(loggedInUser);
          pendingAuth.current = null;
          setAuthOpen(false);
        }}
      />
    </div>
  );
}
