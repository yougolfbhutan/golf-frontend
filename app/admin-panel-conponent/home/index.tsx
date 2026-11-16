'use client';

import { useState, type ComponentType } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CalendarClock, Flag, List, type LucideIcon } from 'lucide-react';
import DashboardBookingPage from '@/app/dashboard-coomponent/page/Dashboard/booking-page';
import TeeSheetPage from '@/app/dashboard-coomponent/page/Dashboard/teesheet page/tee-sheetpage';
// import ApprovalItemsDashboardPage from '@/app/dashboard-coomponent/page/Dashboard/orderapproval-page';

type Section = {
  key: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
};

/* Add a new section here and a tab appears automatically. */
const sections: Section[] = [
  { key: 'tee-sheet', label: 'Tee sheet', icon: CalendarClock, component: TeeSheetPage },
  { key: 'bookings', label: 'All bookings', icon: List, component: DashboardBookingPage },
  // { key: 'orders', label: 'Order approvals', icon: Package, component: ApprovalItemsDashboardPage },
];

export default function DashboardPage() {
  const [activeKey, setActiveKey] = useState(sections[0].key);
  const reduceMotion = useReducedMotion();
  const active = sections.find((s) => s.key === activeKey) ?? sections[0];
  const ActiveComponent = active.component;
  const showTabs = sections.length > 1;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-800 text-white">
              <Flag className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-stone-900">YouGolf Bhutan</p>
              <p className="text-xs text-stone-500">Admin</p>
            </div>
          </div>

          {showTabs && (
            <nav className="-mb-px flex h-full gap-6 overflow-x-auto" aria-label="Dashboard sections">
              {sections.map((s) => {
                const isActive = s.key === activeKey;
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveKey(s.key)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2 whitespace-nowrap border-b-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                      isActive
                        ? 'border-emerald-800 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {s.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Active section — no extra card around it, the page has its own layout */}
      <AnimatePresence mode="wait">
        <motion.main
          key={active.key}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <ActiveComponent />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}