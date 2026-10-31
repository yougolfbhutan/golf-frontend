/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  Bell,
  Globe,
  HelpCircle,
  Sun,
  LogOut,
  Leaf,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";

// NOTE: the "orange" key is kept so the parent component doesn't break.
// It now represents the green accent theme.
const themes = ["light", "dark", "orange"] as const;
type ThemeType = (typeof themes)[number];

/*
  Green palette
  ─────────────────────────────
  forest   #14532D  deep text / strong accents
  emerald  #0F9D58  primary brand green
  fresh    #34D399  light end of gradients
  sage     #6B8F7B  muted icons
  mist     #F1F8F4  soft backgrounds
  line     #D5EBDD  borders
*/

export default function TopNavbar({
  theme,
  setTheme,
  user,
  Role,
  NameLetter,
}: {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  user?: string;
  Role?: string;
  NameLetter?: string;
}) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const isGreen = theme === "orange"; // "orange" key = green theme now
  const isDark = theme === "dark";

  /* ── per-theme token maps ── */
  const glass = isDark
    ? "bg-[#0d1512]/80 border-[#1f3a2d]"
    : isGreen
      ? "bg-[#F1F8F4]/85 border-[#CFE6D8]"
      : "bg-white/90 border-[#E1F0E7]";

  const iconCls = isDark
    ? "text-[#7FA895] hover:text-[#6EE7B7]"
    : isGreen
      ? "text-[#4F7A63] hover:text-[#14532D]"
      : "text-[#7FA895] hover:text-[#0F9D58]";

  const iconHoverBg = isDark
    ? "hover:bg-[#16261f]"
    : isGreen
      ? "hover:bg-[#DDEFE4]"
      : "hover:bg-[#EDF7F1]";

  const dividerCls = isDark
    ? "text-[#7FA895]"
    : isGreen
      ? "text-[#4F7A63]"
      : "text-[#9CC4AE]";

  const accent = isDark
    ? "from-[#0B7A43] to-[#22C58B]"
    : "from-[#0F9D58] to-[#34D399]";

  const badgeColor = "bg-[#10B981]";

  return (
    <>
      {/* Google Fonts — Syne (display) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&display=swap');

        .nav-icon-btn {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 12px;
          transition: background 0.18s, transform 0.15s;
        }
        .nav-icon-btn:hover { transform: translateY(-1px); }
        .nav-icon-btn:active { transform: scale(0.93); }

        .theme-pill {
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px -6px rgba(15,157,88,0.55);
        }
        .theme-pill:hover { transform: translateY(-1px); box-shadow: 0 8px 22px -6px rgba(15,157,88,0.6); }
        .theme-pill:active { transform: scale(0.96); }

        .logout-btn {
          transition: box-shadow 0.2s, transform 0.15s, opacity 0.15s;
        }
        .logout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px -6px rgba(20,83,45,0.3); }
        .logout-btn:active { transform: scale(0.95); }

        .badge-dot {
          position: absolute; top: 7px; right: 7px;
          width: 8px; height: 8px; border-radius: 50%;
          box-shadow: 0 0 0 2px var(--bg-base, white);
          animation: pulse-badge 2s infinite;
        }
        @keyframes pulse-badge {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.65; }
        }

        .divider {
          width: 1px; height: 24px; opacity: 0.3;
          background: currentColor;
          margin: 0 4px;
        }
      `}</style>

      <header
        className={`
          h-16 px-5 flex items-center justify-between sticky top-0 z-50
          backdrop-blur-xl border-b ${glass}
          shadow-[0_1px_12px_-4px_rgba(20,83,45,0.12)]
          transition-colors duration-300
        `}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {/* ── LEFT: utility icon cluster ── */}
        <div className="flex items-center gap-1">
          <button
            className={`nav-icon-btn ${iconCls} ${iconHoverBg}`}
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className={`badge-dot ${badgeColor}`} />
          </button>

          <button
            className={`nav-icon-btn ${iconCls} ${iconHoverBg}`}
            aria-label="Language / Region"
          >
            <Globe className="h-[18px] w-[18px]" />
          </button>

          <button
            className={`nav-icon-btn ${iconCls} ${iconHoverBg}`}
            aria-label="Help"
          >
            <HelpCircle className="h-[18px] w-[18px]" />
          </button>

          <span className={`divider ${dividerCls}`} />

          <span
            className={`text-[13px] font-semibold tracking-tight select-none
              ${isDark ? "text-[#D1E7DB]" : isGreen ? "text-[#14532D]" : "text-[#2E7D52]"}`}
          >
            Dashboard
          </span>
        </div>

        {/* ── RIGHT: profile + controls ── */}
        <div className="flex items-center gap-3">
          {/* User Profile */}
          <div
            className={`flex items-center gap-2.5 pl-1.5 pr-3.5 py-1 rounded-2xl cursor-pointer group transition-colors ${
              isDark
                ? "bg-[#16261f] hover:bg-[#1b2f26]"
                : isGreen
                  ? "bg-white/70 hover:bg-white"
                  : "bg-[#F6FBF8] hover:bg-[#EDF7F1]"
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#34D399] via-[#0F9D58] to-[#0B6B3A] flex items-center justify-center text-sm font-semibold text-white tracking-wide shadow-[0_4px_12px_-4px_rgba(15,157,88,0.6)]">
                {NameLetter}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4ADE80] border-2 ${
                  isDark ? "border-[#16261f]" : "border-white"
                }`}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`text-[13px] font-semibold ${
                  isDark ? "text-[#E6F4EC]" : "text-[#14291E]"
                }`}
              >
                {user}
              </span>
              <span
                className={`text-[10px] font-medium mt-1 ${
                  isDark ? "text-[#6EE7B7]" : "text-[#0F9D58]"
                }`}
              >
                {Role}
              </span>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            className={`
              theme-pill flex items-center gap-1.5 px-3 h-9 rounded-xl
              text-[13px] font-semibold tracking-tight border
              bg-gradient-to-r ${accent}
              text-white border-transparent
            `}
            onClick={() => setTheme(isGreen ? "light" : "orange")}
            aria-label="Toggle theme"
          >
            {isGreen ? (
              <>
                <Sun className="w-[15px] h-[15px]" />
                Light
              </>
            ) : (
              <>
                <Leaf className="w-[15px] h-[15px]" />
                Green
              </>
            )}
          </button>

          <span className={`divider ${dividerCls}`} />

          {/* Logout */}
          <button
            className={`
              logout-btn flex items-center gap-2 pl-1 pr-3 h-9 rounded-xl
              text-[13px] font-semibold tracking-tight border
              ${
                isDark
                  ? "bg-[#16261f] border-[#24402f] text-[#D1E7DB] hover:bg-[#1d3328]"
                  : isGreen
                    ? "bg-[#DDEFE4] border-[#BFDECB] text-[#14532D] hover:bg-[#CFE7D8]"
                    : "bg-white border-[#CFE6D8] text-[#1E6B42] hover:bg-[#F1F8F4]"
              }
            `}
            onClick={handleLogout}
          >
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