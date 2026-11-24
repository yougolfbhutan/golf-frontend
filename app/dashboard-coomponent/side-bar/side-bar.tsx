/* eslint-disable react/jsx-no-undef */
// app/components/Sidebar.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Grid3X3,
  ShoppingCart,
  Menu,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/auth-context";
import { canAccess } from "@/app/src/lib/auth/menu-access";

interface SidebarProps {
  theme: string;
  activeApp: string;
  setActiveApp: (app: string) => void;
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
}

/*
  Green palette (matches TopNavbar)
  ─────────────────────────────
  forest   #14532D  active text / strong accents
  emerald  #0F9D58  primary brand green
  fresh    #34D399  light accent
  sage     #5C7A69  muted text
  mist     #F1F8F4  sidebar background
  active   #DDEFE4  active item background
  hover    #E8F4EC  hover background
  line     #D5EBDD  borders
*/

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

export default function Sidebar({
  theme,
  setActiveApp,
  activeMenuItem,
  setActiveMenuItem,
}: SidebarProps) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "Dashboard",
  );

  const isDark = theme === "dark";
  const primaryRole = user?.roles?.[0]?.name;

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  /* ── theme tokens ── */
  const shell = isDark
    ? "bg-[#0d1512] border-[#1f3a2d]"
    : "bg-[#F1F8F4] border-[#D5EBDD]";

  const idleItem = isDark
    ? "text-[#8FB5A0] hover:bg-[#16261f] hover:text-[#6EE7B7]"
    : "text-[#5C7A69] hover:bg-[#E8F4EC] hover:text-[#14532D]";

  const activeItem = isDark
    ? "bg-[#1b3a2b] text-[#6EE7B7] font-medium"
    : "bg-[#DDEFE4] text-[#14532D] font-medium";

  const sidebarStructure = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: Grid3X3,
      hasSubmenu: false,
      onClick: () => {
        setActiveApp("Home");
        setActiveMenuItem("Dashboard");
      },
    },
    {
      id: "User Management",
      label: "Access Management",
      icon: User,
      hasSubmenu: true,
      subItems: [
        {
          label: "User",
          menuKey: "User",
          onClick: () => {
            setActiveApp("Access Management");
            setActiveMenuItem("User");
          },
        },
        {
          label: "Roles",
          menuKey: "Role",
          onClick: () => {
            setActiveApp("Access Management");
            setActiveMenuItem("Role");
          },
        },
        {
          label: "Permission",
          menuKey: "Permission",
          onClick: () => {
            setActiveApp("Access Management");
            setActiveMenuItem("Permission");
          },
        },
      ],
    },
    {
      id: "golfkits",
      label: "Golf kits",
      icon: ShoppingCart,
      hasSubmenu: true,
      subItems: [
        {
          label: "Gloves",
          menuKey: "Gloves",
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("Gloves");
          },
        },
        {
          label: "GolfSet",
          menuKey: "GolfSet",
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("GolfSet");
          },
        },
        {
          label: "Golf Balls",
          menuKey: "Golf Balls",
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("Golf Balls");
          },
        },
      ],
    },
  ];

  // Role-based menu: keep only what this user may open,
  // and drop any section that ends up empty.
  const visibleSections = sidebarStructure
    .map((section) =>
      section.hasSubmenu
        ? {
            ...section,
            subItems: section.subItems?.filter((item) =>
              canAccess(user, item.menuKey),
            ),
          }
        : section,
    )
    .filter((section) =>
      section.hasSubmenu
        ? (section.subItems?.length ?? 0) > 0
        : canAccess(user, section.label),
    );

  return (
    <div
      className={`
        h-screen flex flex-col border-r transition-all duration-300 ease-in-out
        ${shell}
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span
            className={`group relative grid shrink-0 place-items-center rounded-full h-10 w-10 ring-1 transition-all duration-500 hover:-rotate-6 motion-reduce:transition-none ${
              isDark
                ? "bg-[#16261f] ring-[#2f5a43] hover:ring-[#34D399]"
                : "bg-white ring-[#BFDECB] hover:ring-[#0F9D58]"
            }`}
          >
            <span className="relative h-[72%] w-[72%]">
              <Image
                src="/logo.png"
                alt="YouGolfBhutan logo"
                fill
                sizes="40px"
                priority
                className="object-contain"
              />
            </span>
          </span>
          {!isCollapsed && (
            <span
              className={`text-lg font-semibold ${
                isDark ? "text-[#E6F4EC]" : "text-[#14532D]"
              }`}
            >
              YouGolfBhutan
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`h-8 w-8 ${
            isDark
              ? "text-[#8FB5A0] hover:bg-[#16261f] hover:text-[#6EE7B7]"
              : "text-[#5C7A69] hover:bg-[#DDEFE4] hover:text-[#14532D]"
          }`}
        >
          {isCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {visibleSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          const isDirectActive =
            !section.hasSubmenu && activeMenuItem === section.label;

          return (
            <div key={section.id} className="mb-1">
              {/* Main Section Button */}
              <button
                onClick={() => {
                  if (section.hasSubmenu) {
                    toggleSection(section.id);
                  } else {
                    section.onClick?.();
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg
                  transition-colors relative group
                  ${isDirectActive ? activeItem : idleItem}
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                {isDirectActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-[#0F9D58]" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{section.label}</span>
                    {section.hasSubmenu && (
                      <span className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>

              {/* Submenu Items */}
              {section.hasSubmenu && isExpanded && !isCollapsed && (
                <div
                  className={`ml-6 pl-4 py-1 border-l ${
                    isDark ? "border-[#24402f]" : "border-[#CFE6D8]"
                  }`}
                >
                  {section.subItems?.map((item) => {
                    const isActive = activeMenuItem === item.menuKey;

                    return (
                      <button
                        key={item.label}
                        onClick={item.onClick}
                        className={`
                          w-full text-left px-3 py-2 text-sm rounded-md
                          transition-colors
                          ${isActive ? activeItem : idleItem}
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logged-in user */}
      {user && (
        <div
          className={`border-t p-3 ${
            isDark ? "border-[#1f3a2d]" : "border-[#D5EBDD]"
          }`}
        >
          <div
            title={isCollapsed ? `${user.name} (${user.name})` : undefined}
            className={`flex items-center gap-3 rounded-xl p-2 ${
              isCollapsed ? "justify-center" : ""
            } ${isDark ? "bg-[#16261f]" : "bg-white"}`}
          >
            <span
              aria-hidden
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300 text-sm font-semibold text-emerald-950"
            >
              {getInitials(user.name)}
            </span>

            {!isCollapsed && (
              <div className="min-w-0">
                <p
                  className={`truncate text-sm font-semibold ${
                    isDark ? "text-[#E6F4EC]" : "text-[#14532D]"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`truncate text-xs ${
                    isDark ? "text-[#8FB5A0]" : "text-[#5C7A69]"
                  }`}
                >
                  {user.name}
                </p>
                {primaryRole && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                      isDark
                        ? "bg-[#1b3a2b] text-[#6EE7B7]"
                        : "bg-[#DDEFE4] text-[#14532D]"
                    }`}
                  >
                    {primaryRole}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}