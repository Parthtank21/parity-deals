import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parity Deals | Parth Tank",
  description:
    "Parity Deals is a dynamic pricing platform designed to help SaaS businesses maximize global sales by adapting pricing strategies to local markets and leveraging purchasing power parity (PPP). By implementing price localization, businesses can competitively price their software in every market, considering local purchasing power. The platform also enables localized holiday promotions, allowing companies to boost sales and engagement with discounts tied to regional holidays and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-accent/5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/15 hover:[&::-webkit-scrollbar-thumb]:bg-primary/30"
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
