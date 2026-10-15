"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, UserRound, X } from "lucide-react";

// Fonts are installed from npm (no Google download at build time):
//   npm i @fontsource-variable/fraunces @fontsource-variable/plus-jakarta-sans
import "@fontsource-variable/fraunces";
// import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/plus-jakarta-sans";

const displayFont = { fontFamily: "'Fraunces Variable', Georgia, serif" };
const sansFont = {
  fontFamily: "'Plus Jakarta Sans Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const NAV_LINKS = [
  { href: "/#golf-courses", label: "Courses", note: "Explore every fairway in Bhutan" },
  { href: "/about", label: "About us", note: "Our story in the Himalayas" },
  { href: "/contact", label: "Contact", note: "We usually reply within a day" },
];

// Change this one value if your login route is different (e.g. "/login")
const LOGIN_HREF = "/signin";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sliding hover pill (desktop)
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  // Shrink into a floating bar after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const movePill = (el: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ left: a.left - b.left, width: a.width, visible: true });
  };

  return (
    <header
      style={sansFont}
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out ${
        scrolled ? "px-3 pt-3 sm:px-6" : "px-0 pt-0"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-6xl rounded-full border border-white/10 bg-[#0F3D2E] shadow-[0_10px_40px_-12px_rgba(6,40,30,0.55)]"
            : "max-w-full rounded-none border-b border-white/10 bg-[#0F3D2E]"
        }`}
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-500 ${
            scrolled ? "h-16 px-3 sm:px-4" : "h-20 px-5 sm:px-8 lg:px-12"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F3D2E]"
          >
            <span
              className={`relative grid shrink-0 place-items-center rounded-full bg-[#F7F1E3] ring-1 ring-amber-300/60 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:ring-amber-300 ${
                scrolled ? "h-10 w-10" : "h-12 w-12"
              }`}
            >
              <span className="relative h-[72%] w-[72%]">
                <Image src="/logo.png" alt="" fill sizes="48px" priority className="object-contain" />
              </span>
            </span>
            <span className="flex flex-col">
              <span
                style={displayFont}
                className={`font-semibold leading-none tracking-tight text-[#F7F1E3] transition-all duration-500 ${
                  scrolled ? "text-[22px]" : "text-[26px]"
                }`}
              >
                You
                <span className="italic text-[#6EE7A8]">Golf</span>
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[9.5px] font-semibold uppercase leading-none tracking-[0.42em] text-amber-300">
                <span className="h-px w-3 bg-amber-300" />
                Bhutan
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul
            ref={listRef}
            onMouseLeave={() => setPill((p) => ({ ...p, visible: false }))}
            className="relative hidden items-center rounded-full bg-white/5 p-1 ring-1 ring-white/10 lg:flex"
          >
            <span
              aria-hidden
              className={`absolute top-1 bottom-1 rounded-full bg-white/15 ring-1 ring-white/10 transition-all duration-300 ease-out ${
                pill.visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: pill.left, width: pill.width }}
            />
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onMouseEnter={(e) => movePill(e.currentTarget)}
                    onFocus={(e) => movePill(e.currentTarget)}
                    aria-current={active ? "page" : undefined}
                    className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-[14.5px] font-medium transition-colors duration-200 focus-visible:outline-none ${
                      active ? "text-white" : "text-emerald-100/80 hover:text-white"
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={LOGIN_HREF}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#10B759] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#12C862] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3D2E]"
            >
              {/* shine sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[450%]"
              />
              <span className="relative">Log in</span>
              <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-emerald-700">
                <UserRound className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`relative grid h-11 w-11 place-items-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 md:hidden ${
              open
                ? "bg-[#F7F1E3] text-emerald-900"
                : "bg-white/10 text-[#F7F1E3] ring-1 ring-white/15 hover:bg-white/20"
            }`}
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
              }`}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-x-0 bottom-0 top-0 -z-10 overflow-y-auto bg-[#0F3D2E] transition-all duration-500 ease-out md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="relative flex min-h-full flex-col justify-between px-6 pb-10 pt-28 sm:px-8">
          <div>
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <li
                    key={link.href}
                    style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
                    className={`transition-all duration-500 ease-out ${
                      open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <Link
                      href={link.href}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between gap-4 rounded-3xl px-4 py-4 transition-colors ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="flex flex-col">
                          <span
                            style={displayFont}
                            className={`text-base font-medium leading-tight tracking-tight ${
                              active ? "italic text-[#6EE7A8]" : "text-[#F7F1E3]"
                            }`}
                          >
                            {link.label}
                          </span>
                        </span>
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-emerald-100 transition-all duration-300 group-hover:border-[#10B759] group-hover:bg-[#10B759] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            style={{ transitionDelay: open ? "360ms" : "0ms" }}
            className={`mt-10 space-y-3 transition-all duration-500 ease-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link
              href={LOGIN_HREF}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-full bg-[#10B759] py-2.5 pl-6 pr-2.5 text-base font-semibold text-white transition-colors hover:bg-[#12C862]"
            >
              Log in
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-700">
                <UserRound className="h-5 w-5" />
              </span>
            </Link>
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 pt-3 text-sm text-emerald-100/70 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              Need help? Talk to our team
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}