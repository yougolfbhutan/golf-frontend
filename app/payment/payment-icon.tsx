import type { ReactNode } from "react";

const Badge = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <span className={`inline-flex h-[30px] w-[46px] items-center justify-center rounded-[4px] ${className}`}>
    {children}
  </span>
);

export const VisaIcon = () => (
  <Badge className="bg-[#0b57d0]">
    <span className="text-[13px] font-extrabold italic tracking-tight text-white">VISA</span>
  </Badge>
);

export const MastercardIcon = () => (
  <Badge className="bg-[#1a1a1a]">
    <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden>
      <circle cx="10" cy="9" r="8" fill="#eb001b" />
      <circle cx="18" cy="9" r="8" fill="#f79e1b" />
      <path d="M14 2.4a8 8 0 0 1 0 13.2 8 8 0 0 1 0-13.2Z" fill="#ff5f00" />
    </svg>
  </Badge>
);

export const AmexIcon = () => (
  <Badge className="bg-[#2e8bdc]">
    <span className="text-[11px] font-black leading-none tracking-tighter text-white">AMEX</span>
  </Badge>
);

export const UpiIcon = () => (
  <span className="inline-flex h-[30px] w-[46px] items-center justify-center rounded-[4px] border border-gray-200 bg-white">
    <span className="text-[12px] font-bold italic tracking-tight text-gray-500">UPI</span>
    <svg width="8" height="12" viewBox="0 0 8 12" className="ml-0.5" aria-hidden>
      <path d="M0 0l6 6-6 6V0Z" fill="#f47920" opacity=".9" />
      <path d="M3 0l5 6-5 6V0Z" fill="#2f9e44" opacity=".9" />
    </svg>
  </span>
);

export const ShopPayLogo = () => (
  <span className="text-[22px] font-extrabold lowercase tracking-tight text-[#5a31f4]">shop</span>
);

export const MoreBadge = ({ count }: { count: number }) => (
  <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-gray-200 bg-white text-[11px] text-[#0b57d0]">
    +{count}
  </span>
);

export const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const HelpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4" />
    <path d="M12 17.5h.01" />
  </svg>
);

export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);