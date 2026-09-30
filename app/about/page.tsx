import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/custom-components/navbar/navbar";
import Footer from "@/custom-components/footer/footer";

export const metadata: Metadata = {
  title: "About us | YouGolf Bhutan",
  description:
    "YouGolf Bhutan helps golfers find, plan and book rounds at courses across Bhutan.",
};

const STEPS = [
  {
    title: "Discover",
    text: "Browse Bhutan's courses with photos, hole layouts, green fees and the best season to play each one.",
  },
  {
    title: "Plan",
    text: "Pick your dates and group size. We help fit your rounds around travel, permits and the rest of your trip.",
  },
  {
    title: "Book",
    text: "Reserve your tee time online and get a confirmation straight away, with club and caddie hire if you need it.",
  },
  {
    title: "Play",
    text: "Show up and tee off. Our local team is a message away if anything changes on the day.",
  },
];

const REASONS = [
  {
    title: "Local team",
    text: "We're based in Thimphu and know the courses, the clubs and the people who run them.",
  },
  {
    title: "Clear pricing",
    text: "Green fees, caddie fees and equipment hire are shown up front, before you book.",
  },
  {
    title: "Flexible changes",
    text: "Mountain weather can turn quickly. We help you move tee times when it does.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-emerald-950 px-6 pb-20 pt-40 lg:px-10 lg:pb-28 lg:pt-48">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(16,183,89,0.35),transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Golf in the Land of the Thunder Dragon
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100/80">
            YouGolf Bhutan makes it simple to find a course, plan your round
            and book a tee time anywhere in the country, whether you live here
            or are visiting for the first time.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            Why we started
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-slate-600">
            <p>
              Playing golf in Bhutan used to mean phone calls, word of mouth and
              a lot of guesswork about when a course was open. We wanted
              golfers to see everything in one place and book in a few minutes.
            </p>
            <p>
              Today we work directly with courses across the country to keep
              tee times, prices and course details up to date, so you can spend
              less time arranging and more time playing.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-emerald-50/60 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B759] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-emerald-950">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why book with us */}
      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            Why book with us
          </h2>
          <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title}>
                <dt className="text-lg font-semibold text-emerald-900">
                  {r.title}
                </dt>
                <dd className="mt-2 leading-relaxed text-slate-600">
                  {r.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 pb-24 lg:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 rounded-3xl bg-emerald-950 px-8 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready for your first round?
            </h2>
            <p className="mt-2 text-emerald-100/80">
              See every course and book a tee time in minutes.
            </p>
          </div>
          <Link
            href="/#golf-courses"
            className="shrink-0 rounded-full bg-[#10B759] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-px hover:bg-emerald-500"
          >
            Book a tee time
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}