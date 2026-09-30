/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Bell,
  Globe,
  HelpCircle,
  Sun,
  LogOut,
  Flame,
} from "lucide-react";

import { useRouter } from "next/navigation";
// import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";

const themes = ["light", "dark", "orange"] as const;
type ThemeType = (typeof themes)[number];

export default function TopNavbar({
  theme,
  setTheme,
  user,
  Role,
  NameLetter
}: {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  user?:string,
  Role?:string,
  NameLetter?:string
}) {
  const { logout } = useAuth();
  const router = useRouter();
//   const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isOrange = theme === "orange";
  const isDark = theme === "dark";

  /* ── per-theme token maps ── */
  const glass = isDark
    ? "bg-zinc-900/70 border-zinc-700/50"
    : isOrange
      ? "bg-orange-50/80 border-orange-200/60"
      : "bg-white border-orange-100";

  const iconCls = isDark
    ? "text-zinc-400 hover:text-white"
    : isOrange
      ? "text-orange-400 hover:text-orange-700"
      : "text-orange-300 hover:text-orange-600";

  // All themes use orange/amber accent — no blue anywhere
  const accent = isDark
    ? "from-orange-600 to-amber-500"
    : "from-orange-500 to-amber-400";

  // const ringColor = "focus-within:ring-orange-400/50";

  const badgeColor = "bg-orange-500";

  return (
    <>
      {/* Google Fonts — Syne (display) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&display=swap');

        .nav-icon-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 10px;
          transition: background 0.18s, transform 0.15s;
        }
        .nav-icon-btn:hover { transform: translateY(-1px); }
        .nav-icon-btn:active { transform: scale(0.93); }

        .search-bar {
          transition: box-shadow 0.25s, width 0.3s cubic-bezier(.4,0,.2,1);
        }
        .search-bar.focused { width: 320px; }

        .theme-pill {
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .theme-pill:hover { transform: translateY(-1px); box-shadow: 0 6px 20px -4px rgba(0,0,0,0.18); }
        .theme-pill:active { transform: scale(0.96); }

        .logout-btn {
          transition: box-shadow 0.2s, transform 0.15s, opacity 0.15s;
        }
        .logout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px -4px rgba(0,0,0,0.22); }
        .logout-btn:active { transform: scale(0.95); }

        .badge-dot {
          position: absolute; top: 6px; right: 6px;
          width: 8px; height: 8px; border-radius: 50%;
          box-shadow: 0 0 0 2px var(--bg-base, white);
          animation: pulse-badge 2s infinite;
        }
        @keyframes pulse-badge {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.65; }
        }

        .divider {
          width: 1px; height: 24px; opacity: 0.25;
          background: currentColor;
          margin: 0 4px;
        }
      `}</style>

      <header
        className={`
          h-16 px-5 flex items-center justify-between sticky top-0 z-50
          backdrop-blur-xl border-b ${glass}
          transition-colors duration-300
        `}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* ── LEFT: utility icon cluster ── */}
        <div className="flex items-center gap-1">
          {/* Notification */}
          <button
            className={`nav-icon-btn ${iconCls} ${isDark ? "hover:bg-zinc-800" : isOrange ? "hover:bg-orange-100" : "hover:bg-orange-50"}`}
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className={`badge-dot ${badgeColor}`} />
          </button>

          {/* Globe */}
          <button
            className={`nav-icon-btn ${iconCls} ${isDark ? "hover:bg-zinc-800" : isOrange ? "hover:bg-orange-100" : "hover:bg-orange-50"}`}
            aria-label="Language / Region"
          >
            <Globe className="h-[18px] w-[18px]" />
          </button>

          {/* Help */}
          <button
            className={`nav-icon-btn ${iconCls} ${isDark ? "hover:bg-zinc-800" : isOrange ? "hover:bg-orange-100" : "hover:bg-orange-50"}`}
            aria-label="Help"
          >
            <HelpCircle className="h-[18px] w-[18px]" />
          </button>

          <span
            className={`divider ${isDark ? "text-zinc-400" : isOrange ? "text-orange-300" : "text-orange-200"}`}
          />

          {/* Subtle breadcrumb / page context */}
          <span
            className={`text-[13px] font-semibold tracking-tight select-none
              ${isDark ? "text-zinc-300" : isOrange ? "text-orange-800" : "text-orange-500"}`}
          >
            Dashboard
          </span>
        </div>

        {/* ── RIGHT: search + controls ── */}
        <div className="flex items-center gap-3">
          {/* User Profile */}
          <div className="flex items-center gap-2.5 px-1.5 pr-3.5 py-1  bg-white  cursor-pointer group">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-[14px] bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-semibold text-white tracking-wide">
               {NameLetter}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            </div>
            {/* Text */}
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold text-gray-900">
                {user}
              </span>
              <span className="text-[10px] font-medium text-orange-500 mt-0.5">
                {Role}
              </span>
            </div>
            {/* Caret */}
          </div>

          {/* Theme toggle */}
          <button
            className={`
              theme-pill flex items-center gap-1.5 px-3 h-9 rounded-xl
              text-[13px] font-semibold tracking-tight border
              bg-gradient-to-r ${accent}
              text-white border-transparent shadow-sm
            `}
            onClick={() => setTheme(isOrange ? "light" : "orange")}
            aria-label="Toggle theme"
          >
            {isOrange ? (
              <>
                <Sun className="w-[15px] h-[15px]" />
                Light
              </>
            ) : (
              <>
                <Flame className="w-[15px] h-[15px]" />
                Orange
              </>
            )}
          </button>

          <span
            className={`divider ${isDark ? "text-zinc-400" : isOrange ? "text-orange-300" : "text-orange-200"}`}
          />

          {/* User / Logout */}
          <button
            className={`
              logout-btn flex items-center gap-2 pl-1 pr-3 h-9 rounded-xl
              text-[13px] font-semibold tracking-tight border
              ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
                  : isOrange
                    ? "bg-orange-100 border-orange-200 text-orange-800 hover:bg-orange-200"
                    : "bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
              }
            `}
            onClick={handleLogout}
          >
            {/* Avatar placeholder */}
            <span
              className={`
                w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0
                bg-gradient-to-br ${accent}
              `}
            >
              U
            </span>
            <span className="hidden sm:inline">Log Out</span>
            <LogOut className="h-[14px] w-[14px] opacity-60" />
          </button>
        </div>
      </header>
    </>
  );
}
