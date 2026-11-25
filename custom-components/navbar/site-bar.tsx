"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/custom-components/navbar/navbar";

const hideHeaderPaths = ["/dashboard", "/login", "/signin", "/register","/payment"];

export default function SiteHeader() {
  const pathname = usePathname();

  const shouldHideHeader = pathname
    ? hideHeaderPaths.some((path) => pathname.startsWith(path))
    : false;

  if (shouldHideHeader) return null;
  return <Navbar />;
}