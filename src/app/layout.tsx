import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ember & Ash — Luxury Custom Furniture",
  description: "A premium, minimalist e-commerce platform for luxury custom furniture. Crafting raw natural materials into refined modern structures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
    >
      <body className="flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
