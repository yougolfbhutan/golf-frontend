"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NavBar from "@/custom-components/navbar/navbar";
import { useAuth } from "./app/context/auth-context";

const queryClient = new QueryClient();

interface Props {
  children: ReactNode;
}

const hideHeaderPaths = ["/dashboard", "/login", "/register", "/signin"];
const protectedPaths = ["/dashboard"];

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user,isLoading } = useAuth()

  const shouldHideHeader = pathname
    ? hideHeaderPaths.some((path) => pathname.startsWith(path))
    : false;

  const isProtected = pathname
    ? protectedPaths.some((path) => pathname.startsWith(path))
    : false;

  useEffect(() => {
    if (!isLoading && isProtected && !user) {
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, isProtected, pathname, router]);

  // Don't render protected pages until we know the user is signed in
  if (isProtected && (isLoading || !user)) {
    return null; // or a spinner
  }

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