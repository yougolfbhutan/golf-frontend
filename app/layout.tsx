import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { AuthProvider } from "./context/auth-context";
import { BookingDraftProvider } from "./context/booking-draft-context";
import WhatsAppButton from "@/whats-app/whatsappbutton";
import { CheckoutProvider } from "./context/checkout-context";
import { getServerUser } from "@/lib/get-server-user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouGolfBhutan",
  description: "Book golf tee times, rentals and packages in Bhutan",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 0.86,
  minimumScale: 0.86,
  maximumScale: 3,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  console.log("RootLayout: Fetching initial user from server...");
  const initialUser = await getServerUser();
  console.log("Initial user from server:", initialUser); // Log the initial user for debugging

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider initialUser={initialUser}>
          <Providers>
            <BookingDraftProvider>
              <CheckoutProvider>{children}</CheckoutProvider>
            </BookingDraftProvider>
          </Providers>
        </AuthProvider>

        <WhatsAppButton />
      </body>
    </html>
  );
}