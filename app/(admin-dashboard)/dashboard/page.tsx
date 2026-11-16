"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { canAccess } from "@/app/src/lib/auth/menu-access";
import { SYSTEM_ROLES } from "@/app/src/lib/auth/auth-roles";
import { menuContent } from "../../dashboard-coomponent/data/item";
import TopNavbar from "../../dashboard-coomponent/dashboard-nabar";
import Sidebar from "../../dashboard-coomponent/side-bar/side-bar";
import { RoleGuard } from "@/app/src/lib/auth/dasboardguard";

function DashboardContent() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "orange">("light");

  // Apply theme to <body>
  useEffect(() => {
    const classes = ["light", "dark", "theme-orange"];
    document.body.classList.remove(...classes);

    const themeClass =
      theme === "light"
        ? "light"
        : theme === "dark"
          ? "dark"
          : `theme-${theme}`;

    document.body.classList.add(themeClass);
  }, [theme]);

  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [activeApp, setActiveApp] = useState("Home");

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        theme={theme}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
      />

      <main className="flex-1 overflow-y-auto">
        <TopNavbar theme={theme} setTheme={setTheme} />

        <div className="max-w-7xl mx-auto py-5">
          <h1 className="text-xl font-bold mb-12 opacity-80 p-5">
            {activeApp} / {activeMenuItem}
          </h1>

          <div className="min-h-96 flex m-4 backdrop-blur-sm transition-all duration-300">
            <div className="flex-1 w-full">
              {!canAccess(user, activeMenuItem) ? (
                <p className="text-xl opacity-60">
                  You do not have permission to view this page.
                </p>
              ) : (
                menuContent[activeMenuItem] || (
                  <p className="text-3xl opacity-50">Select a menu item</p>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allow={SYSTEM_ROLES}>
      <DashboardContent />
    </RoleGuard>
  );
}