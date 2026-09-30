"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NavBar from "@/custom-components/navbar/navbar";
// import Header from "@/component/website/appbar";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();

  const hideHeaderPaths = ["/dashboard", "/login", "/register"];
  const shouldHideHeader = pathname
    ? hideHeaderPaths.some((path) => pathname.startsWith(path))
    : false;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background text-foreground">
          {!shouldHideHeader && <NavBar />}
          {children}
        </main>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}