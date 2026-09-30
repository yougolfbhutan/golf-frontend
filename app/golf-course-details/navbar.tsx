"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";





export default function NavbarDetails()  {
  return (
   <header className={`absolute inset-x-0 top-0 z-40 bg-gray-100`}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="YouGolf Bhutan icon"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-tight">
          
              <>
                <span className="text-emerald-800">YouGolf</span>
                <span className="text-amber-500">Bhutan</span>
              </>
            
          </span>
        </Link>

        {/* Right-hand links */}
        <div className="flex items-center gap-6 text-sm font-medium text-black">
          <Link href="/contact" className="hidden hover:text-white/80 sm:inline">
            Contact Us
          </Link>

          <Link href="/help" className="hidden hover:text-white/80 sm:inline">
            Help
          </Link>

          <button
            type="button"
            aria-label="Change language"
            className="flex items-center gap-1 rounded-full border border-white/40 px-2 py-1 transition hover:border-white"
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  );
}