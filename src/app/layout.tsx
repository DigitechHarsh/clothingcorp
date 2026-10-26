import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clothing Corp. | Single-Vendor Craft Apparel",
  description: "Mindfully constructed daily apparel, tailoring, and essentials engineered with natural fibres and enduring craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${newsreader.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
