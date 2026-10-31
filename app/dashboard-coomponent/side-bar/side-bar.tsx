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
  Magnet,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function Sidebar({
  theme,
  setActiveApp,
  activeMenuItem,
  setActiveMenuItem,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "Dashboard",
  );

  const isDark = theme === "dark";

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
          onClick: () => {
            setActiveApp("Access Management");
            setActiveMenuItem("User");
          },
        },
        {
          label: "Roles",
          onClick: () => {
            setActiveApp("Access Management");
            setActiveMenuItem("Role");
          },
        },
        {
          label: "Permission",
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
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("Gloves");
          },
        },
        {
          label: "GolfSet",
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("GolfSet");
          },
        },
        {
          label: "Golf Balls",
          onClick: () => {
            setActiveApp("golfkits");
            setActiveMenuItem("Golf Balls");
          },
        },
      ],
    },
    {
      id: "Booking Management",
      label: "Booking Management",
      icon: Magnet,
      hasSubmenu: true,
      subItems: [
        {
          label: "Approve Booking",
          onClick: () => {
            setActiveApp("Booking Management");
            setActiveMenuItem("Approve Booking");
          },
        },
        {
          label: "Accessories Items Approval",
          onClick: () => {
            setActiveApp("Booking Management");
            setActiveMenuItem("Accessories Items Approval");
          },
        },
      ],
    },
  ];

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
        {sidebarStructure.map((section) => {
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
                    const isActive = activeMenuItem === item.label;

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
    </div>
  );
}