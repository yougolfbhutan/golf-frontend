"use client";

import { useAuth } from "@/app/context/auth-context";
import { useEffect, useState } from "react";
import { menuContent } from "../../dashboard-coomponent/data/item";
// import { getInitials } from "../../dashboard-coomponent/helper-function";
import TopNavbar from "../../dashboard-coomponent/dashboard-nabar";
import Sidebar from "../../dashboard-coomponent/side-bar/side-bar";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log("user ", user);
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

  // Rename this to avoid conflict
  // const bodyTheme = useSyncExternalStore(
  //   (callback) => {
  //     if (typeof document === "undefined") return () => { };

  //     const observer = new MutationObserver(callback);
  //     observer.observe(document.body, {
  //       attributes: true,
  //       attributeFilter: ["class"],
  //     });
  //     return () => observer.disconnect();
  //   },
  //   () => {
  //     if (typeof document === "undefined") return "light";

  //     if (document.body.classList.contains("dark")) return "dark";
  //     if (document.body.classList.contains("theme-orange")) return "orange";
  //     // if (document.body.classList.contains("theme-blue")) return "blue";
  //     // if (document.body.classList.contains("theme-green")) return "green";
  //     return "light";
  //   },
  //   () => "light"
  // );

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
              {menuContent[activeMenuItem] || (
                <p className="text-3xl opacity-50">Select a menu item</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
