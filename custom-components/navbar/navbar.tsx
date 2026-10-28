"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Menu,
  Phone,
  UserRound,
  X,
} from "lucide-react";


// npm i @fontsource-variable/fraunces @fontsource-variable/plus-jakarta-sans
import "@fontsource-variable/fraunces";
import "@fontsource-variable/plus-jakarta-sans";
import { useAuth } from "@/app/context/auth-context";

const displayFont = { fontFamily: "'Fraunces Variable', Georgia, serif" };
const sansFont = {
  fontFamily:
    "'Plus Jakarta Sans Variable', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const NAV_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

// Optional links shown in the user dropdown / mobile menu.
// Add real routes when you have them, e.g. { href: "/account", label: "My account" }
const ACCOUNT_LINKS: { href: string; label: string }[] = [];

const LOGIN_HREF = "/signin";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-[13px]",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  return (
    <span
      aria-hidden
      style={displayFont}
      className={`grid shrink-0 place-items-center rounded-full bg-amber-300 font-semibold text-emerald-950 ${sizes[size]}`}
    >
      {getInitials(name)}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // desktop user dropdown
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const isActive = (href: string) => !href.includes("#") && pathname === href;
  const primaryRole = user?.roles?.[0]?.name;

  // Floating bar after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes both menus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside closes the user dropdown
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [menuOpen]);

  const movePill = (el: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ left: a.left - b.left, width: a.width, visible: true });
  };

  const handleLogout = async () => {
    setOpen(false);
    setMenuOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  };

  const showSkeleton = isLoading && !user;

  return (
    <header
      style={sansFont}
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out motion-reduce:transition-none ${
        scrolled ? "px-3 pt-3 sm:px-6" : "px-0 pt-0"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-out motion-reduce:transition-none ${
          scrolled
            ? "max-w-6xl rounded-full border border-white/10 bg-[#0F3D2E]/95 shadow-[0_10px_40px_-12px_rgba(6,40,30,0.55)] backdrop-blur-md"
            : "max-w-full rounded-none border-b border-white/10 bg-[#0F3D2E]"
        }`}
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-7xl items-center justify-between gap-3 transition-all duration-500 motion-reduce:transition-none ${
            scrolled ? "h-16 px-3 sm:px-4" : "h-[72px] px-4 sm:px-8 lg:px-12"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F3D2E] sm:gap-3"
          >
            <span
              className={`relative grid shrink-0 place-items-center rounded-full bg-[#F7F1E3] ring-1 ring-amber-300/60 transition-all duration-500 group-hover:-rotate-6 group-hover:ring-amber-300 motion-reduce:transition-none ${
                scrolled ? "h-10 w-10" : "h-11 w-11 sm:h-12 sm:w-12"
              }`}
            >
              <span className="relative h-[72%] w-[72%]">
                <Image
                  src="/logo.png"
                  alt=""
                  fill
                  sizes="48px"
                  priority
                  className="object-contain"
                />
              </span>
            </span>
            <span
              style={displayFont}
              className={`truncate font-semibold leading-none tracking-tight text-[#F7F1E3] transition-all duration-500 motion-reduce:transition-none ${
                scrolled ? "text-[19px] sm:text-[22px]" : "text-[21px] sm:text-[26px]"
              }`}
            >
              You <span className="italic">GolfBhutan</span>
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
              className={`absolute bottom-1 top-1 rounded-full bg-white/15 ring-1 ring-white/10 transition-all duration-300 ease-out motion-reduce:transition-none ${
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
                    className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-[14.5px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                      active ? "text-white" : "text-emerald-100/80 hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            {/* ---------- Desktop (lg+) ---------- */}
            <div className="hidden lg:block">
              {showSkeleton ? (
                <div className="h-11 w-40 animate-pulse rounded-full bg-white/10" />
              ) : user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    className={`flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 ring-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                      menuOpen
                        ? "bg-white/20 ring-white/25"
                        : "bg-white/10 ring-white/15 hover:bg-white/15"
                    }`}
                  >
                    <Avatar name={user.name} size="md" />
                    <span className="max-w-[140px] truncate text-sm font-semibold text-[#F7F1E3] xl:max-w-[180px]">
                      {user.name}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={`h-4 w-4 text-emerald-100/70 transition-transform duration-300 motion-reduce:transition-none ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    role="menu"
                    aria-label="Account"
                    className={`absolute right-0 top-full mt-3 w-72 origin-top-right rounded-3xl bg-[#F7F1E3] p-2 text-emerald-950 shadow-[0_24px_60px_-20px_rgba(6,40,30,0.6)] ring-1 ring-emerald-950/10 transition-all duration-200 motion-reduce:transition-none ${
                      menuOpen
                        ? "visible translate-y-0 scale-100 opacity-100"
                        : "invisible -translate-y-1 scale-95 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
                      <Avatar name={user.name} size="lg" />
                      <div className="min-w-0">
                        <p
                          style={displayFont}
                          className="truncate text-lg font-semibold leading-tight"
                        >
                          {user.name}
                        </p>
                        <p className="truncate text-[13px] text-emerald-900/60">
                          {user.email}
                        </p>
                        {primaryRole && (
                          <span className="mt-1.5 inline-block rounded-full bg-emerald-900/10 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-900">
                            {primaryRole}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-col">
                      {ACCOUNT_LINKS.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          tabIndex={menuOpen ? 0 : -1}
                          className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-emerald-900/10 focus-visible:bg-emerald-900/10 focus-visible:outline-none"
                        >
                          {l.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={handleLogout}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-600/10 focus-visible:bg-red-600/10 focus-visible:outline-none"
                      >
                        Log out
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={LOGIN_HREF}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#10B759] py-2 pl-5 pr-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#12C862] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F3D2E]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-sm transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
                  />
                  <span className="relative">Log in</span>
                  <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white group-hover:text-emerald-700">
                    <UserRound className="h-4 w-4" />
                  </span>
                </Link>
              )}
            </div>

            {/* ---------- Mobile / tablet (below lg) ---------- */}
            {showSkeleton ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/10 lg:hidden" />
            ) : user ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Signed in as ${user.name}. Open menu`}
                className="rounded-full ring-2 ring-white/15 transition-shadow hover:ring-amber-300/60 focus-visible:outline-none focus-visible:ring-emerald-300 lg:hidden"
              >
                <Avatar name={user.name} size="md" />
              </button>
            ) : (
              <Link
                href={LOGIN_HREF}
                className="inline-flex h-10 items-center rounded-full bg-[#10B759] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#12C862] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:px-5 lg:hidden"
              >
                Log in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 lg:hidden ${
                open
                  ? "bg-[#F7F1E3] text-emerald-900"
                  : "bg-white/10 text-[#F7F1E3] ring-1 ring-white/15 hover:bg-white/20"
              }`}
            >
              <Menu
                className={`absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none ${
                  open ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
              />
              <X
                className={`absolute h-5 w-5 transition-all duration-300 motion-reduce:transition-none ${
                  open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
                }`}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 -z-10 overflow-y-auto bg-[#0F3D2E] transition-all duration-500 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-full max-w-xl flex-col justify-between px-5 pb-8 pt-24 sm:px-8">
          <div className="space-y-6">
            {/* User card */}
            {user && (
              <div
                style={{ transitionDelay: open ? "100ms" : "0ms" }}
                className={`flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 transition-all duration-500 ease-out motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <Avatar name={user.name} size="lg" />
                <div className="min-w-0">
                  <p
                    style={displayFont}
                    className="truncate text-xl font-semibold leading-tight text-[#F7F1E3]"
                  >
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-emerald-100/60">{user.email}</p>
                  {primaryRole && (
                    <span className="mt-1.5 inline-block rounded-full bg-amber-300/15 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-200">
                      {primaryRole}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            <ul className="flex flex-col gap-1">
              {[...NAV_LINKS, ...(user ? ACCOUNT_LINKS : [])].map((link, i) => {
                const active = isActive(link.href);
                return (
                  <li
                    key={link.href}
                    style={{ transitionDelay: open ? `${160 + i * 60}ms` : "0ms" }}
                    className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
                      open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <Link
                      href={link.href}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        style={displayFont}
                        className={`text-xl font-medium tracking-tight ${
                          active ? "italic text-[#6EE7A8]" : "text-[#F7F1E3]"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-emerald-100 transition-colors duration-300 group-hover:border-[#10B759] group-hover:bg-[#10B759] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom actions */}
          <div
            style={{ transitionDelay: open ? "300ms" : "0ms" }}
            className={`mt-10 space-y-3 transition-all duration-500 ease-out motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {user ? (
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-full bg-white/10 py-2.5 pl-6 pr-2.5 text-base font-semibold text-[#F7F1E3] ring-1 ring-white/15 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Log out
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F7F1E3] text-emerald-900">
                  <LogOut className="h-5 w-5" />
                </span>
              </button>
            ) : (
              <Link
                href={LOGIN_HREF}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-full bg-[#10B759] py-2.5 pl-6 pr-2.5 text-base font-semibold text-white transition-colors hover:bg-[#12C862] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              >
                Log in
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-700">
                  <UserRound className="h-5 w-5" />
                </span>
              </Link>
            )}
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 pt-3 text-sm text-emerald-100/70 transition-colors hover:text-white"
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