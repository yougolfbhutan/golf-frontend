"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/app/context/auth-context";

import { type AuthTab, AuthTabs } from "./components/auth-tabs";
import { SignInForm } from "./components/sign-in-form";
import { RegisterForm } from "./components/register-form";
import { homeFor } from "../src/lib/auth/auth-roles";

const TITLES: Record<AuthTab, string> = {
  signin: "Welcome back",
  register: "Create your account",
};

const SUBTITLES: Record<AuthTab, string> = {
  signin: "Sign in to access your account.",
  register: "Sign up to get started. It only takes a minute.",
};

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<AuthTab>("signin");

  const handleSuccess = (user: User) => {
    // admin / super admin / staff / system → /admin/dashboard, everyone else → /
    router.replace(homeFor(user));
    router.refresh();
  };

  return (
    <main className="flex min-h-dvh w-full max-w-full items-center justify-center overflow-x-hidden bg-gradient-to-b from-[#F3F8F4] to-white px-4 py-10">
      <div className="w-full max-w-[440px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl shadow-[#1F4D36]/5 sm:p-9">
          <header className="mb-6 space-y-1.5 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{TITLES[tab]}</h1>
            <p className="text-sm text-slate-500">{SUBTITLES[tab]}</p>
          </header>

          <AuthTabs value={tab} onChange={setTab} />

          <div id="auth-panel" role="tabpanel" aria-labelledby={`auth-tab-${tab}`} className="mt-6">
            {tab === "signin" ? (
              <SignInForm onSuccess={handleSuccess} onSwitchToRegister={() => setTab("register")} />
            ) : (
              <RegisterForm onSuccess={handleSuccess} onSwitchToSignIn={() => setTab("signin")} />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}