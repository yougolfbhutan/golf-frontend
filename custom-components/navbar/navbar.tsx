"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  /** Starts transparent over a hero image and turns into a floating bar on scroll.
   * Set to false on plain/light pages so it is always solid. */
  transparent?: boolean;
}

const NAV_LINKS = [
  { href: "/#golf-courses", label: "Courses" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ transparent = true }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = !transparent || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out motion-reduce:transition-none ${
        solid ? "px-3 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-out motion-reduce:transition-none ${
          solid
            ? "max-w-6xl rounded-2xl bg-white/85 shadow-[0_8px_30px_-12px_rgba(6,40,24,0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "max-w-7xl rounded-none bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className={`flex items-center justify-between transition-all duration-500 ease-out motion-reduce:transition-none ${
            solid ? "h-16 px-4 sm:px-6" : "h-24 px-6 lg:px-10"
          }`}
        >
          {/* Logo: white over the hero, original colors once scrolled */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span
              className={`relative shrink-0 transition-all duration-500 ${
                solid ? "h-8 w-8" : "h-10 w-10"
              }`}
            >
              <Image
                src="/logo-mark-white.png"
                alt=""
                fill
                sizes="40px"
                priority
                className={`object-contain drop-shadow-md transition-opacity duration-500 ${
                  solid ? "opacity-0" : "opacity-100"
                }`}
              />
              <Image
                src="/logo.png"
                alt=""
                fill
                sizes="40px"
                priority
                className={`object-contain transition-opacity duration-500 ${
                  solid ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
            <span
              className={`font-bold tracking-tight transition-all duration-500 ${
                solid ? "text-lg" : "text-xl drop-shadow-md"
              }`}
            >
              <span className={`transition-colors duration-500 ${solid ? "text-emerald-800" : "text-white"}`}>
                YouGolf
              </span>
              <span className={`transition-colors duration-500 ${solid ? "text-amber-500" : "text-white"}`}>
                Bhutan
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-2 md:flex">
            <ul className="flex items-center gap-1 text-sm font-medium">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        solid
                          ? active
                            ? "bg-emerald-50 text-emerald-800"
                            : "text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-800"
                          : active
                            ? "bg-white/15 text-white"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/#golf-courses"
              className="ml-3 rounded-full bg-[#10B759] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:-translate-y-px hover:bg-emerald-600 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            >
              Book a tee time
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`rounded-full p-2 transition md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              solid
                ? "text-emerald-900 hover:bg-emerald-50"
                : "text-white hover:bg-white/10"
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`grid transition-all duration-300 ease-out md:hidden motion-reduce:transition-none ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="flex flex-col gap-1 px-3 pb-4">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-base font-medium transition ${
                        active
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href="/#golf-courses"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl bg-[#10B759] py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-600"
                >
                  Book a tee time
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}