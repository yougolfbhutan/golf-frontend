"use client";

export type AuthTab = "signin" | "register";

type Props = {
  value: AuthTab;
  onChange: (tab: AuthTab) => void;
};

const TABS: { id: AuthTab; label: string }[] = [
  { id: "signin", label: "Sign in" },
  { id: "register", label: "Register" },
];

export function AuthTabs({ value, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Authentication" className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
      {TABS.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            id={`auth-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="auth-panel"
            onClick={() => onChange(t.id)}
            className={`rounded-xl py-2.5 text-sm font-semibold transition ${
              active ? "bg-white text-[#1F4D36] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}