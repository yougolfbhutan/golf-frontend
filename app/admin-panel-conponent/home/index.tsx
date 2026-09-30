'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Users } from 'lucide-react';
import DashboardBookingPage from '@/app/dashboard-coomponent/page/Dashboard/booking-page';
// import ApprovalItemsDashboardPage from '@/app/dashboard-coomponent/page/Dashboard/orderapproval-page';



const stats = [
  {
    key: 'Booking',
    title: 'Booking',
    // value: 1240,
    icon: <Users size={28} />,
    color: 'from-purple-500 to-indigo-500',
    component: DashboardBookingPage,
  },

  

];

/* ------------------------------------------------------------------ */
/*  3. Dashboard — stat cards act as tabs                              */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [activeKey, setActiveKey] = useState(stats[0].key);
  const active = stats.find((s) => s.key === activeKey)!;
  const ActiveComponent = active.component;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stat cards act as tabs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, idx) => {
          const isActive = stat.key === activeKey;
          return (
            <motion.button
              key={stat.key}
              onClick={() => setActiveKey(stat.key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`text-left flex items-center gap-4 p-6 rounded-xl shadow-lg bg-gradient-to-r ${stat.color} text-white transition-all ${
                isActive ? 'ring-4 ring-white/70 scale-[1.03]' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'
              }`}
            >
              <div className="p-4 bg-white/20 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium opacity-90">{stat.title}</p>
                {/* <p className="text-2xl font-bold">{stat.value}</p> */}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Detail panel — renders whichever component the active stat points to */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}