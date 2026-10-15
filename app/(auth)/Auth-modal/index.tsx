"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { User } from "@/app/context/auth-context";
import { SignInForm } from "../login/login-page";
import { RegisterForm } from "../register/register-page";

export type AuthTab = "signin" | "register";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: AuthTab;
  /** Called after a successful sign in or register, with the logged-in user */
  onSuccess: (user: User) => void;
};

const TITLES: Record<AuthTab, string> = {
  signin: "Welcome back",
  register: "Create your golfer ID",
};

export function AuthTabs({
  value,
  onChange,
}: {
  value: AuthTab;
  onChange: (tab: AuthTab) => void;
}) {
  const tabs: { key: AuthTab; label: string }[] = [
    { key: "signin", label: "Sign in" },
    { key: "register", label: "Register" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Account"
      className="relative mb-5 grid grid-cols-2 rounded-full bg-[#e6ece3] p-1 dark:bg-white/10"
    >
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_2px_6px_rgba(20,37,28,0.14)] transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-neutral-700 ${
          value === "register" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          id={`auth-tab-${t.key}`}
          aria-selected={value === t.key}
          aria-controls="auth-panel"
          onClick={() => onChange(t.key)}
          className={`relative z-10 rounded-full py-3 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21503a] ${
            value === t.key
              ? "text-[#14251c] dark:text-white"
              : "text-[#6b7a70] hover:text-[#14251c] dark:text-white/60 dark:hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "signin",
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = React.useState<AuthTab>(defaultTab);

  React.useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92dvh] max-w-[440px] gap-0 overflow-y-auto rounded-[28px] p-7
          [&>button]:right-6 [&>button]:top-6 [&>button]:flex [&>button]:size-10
          [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-muted"
      >
        <DialogHeader className="mb-5 space-y-1 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Golfer account
          </p>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {TITLES[tab]}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Sign in or register to confirm your tee time booking.
          </DialogDescription>
        </DialogHeader>

        <AuthTabs value={tab} onChange={setTab} />

        <div id="auth-panel" role="tabpanel" aria-labelledby={`auth-tab-${tab}`}>
          {tab === "signin" ? (
            <SignInForm
              onSuccess={onSuccess}
              onSwitchToRegister={() => setTab("register")}
            />
          ) : (
            <RegisterForm     onRegistered={() => setTab("signin")}
/>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}