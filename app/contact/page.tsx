import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Navbar from "@/custom-components/navbar/navbar";
import Footer from "@/custom-components/footer/footer";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact us | YouGolf Bhutan",
  description:
    "Questions about a booking or a course? Get in touch with the YouGolf Bhutan team.",
};

// TODO: replace these with your real details
const DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@yougolfbhutan.com",
    href: "mailto:hello@yougolfbhutan.com",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+975 17 000 000",
    href: "tel:+97517000000",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Norzin Lam, Thimphu, Bhutan",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon to Sat, 9:00 am to 5:00 pm (BTT)",
  },
];

export default function ContactPage() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <Navbar />

      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-emerald-950 px-6 pb-20 pt-40 lg:px-10 lg:pb-24 lg:pt-48">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(16,183,89,0.35),transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Get in touch
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-100/80">
            Questions about a course, a booking or planning a golf trip to
            Bhutan? Send us a message and we&apos;ll reply within one working
            day.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* Contact details */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
              Reach us directly
            </h2>
            <ul className="mt-8 space-y-7">
              {DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="font-medium text-emerald-950 transition hover:text-[#10B759]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-emerald-950">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-emerald-50/60 p-6 sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
              Send a message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}