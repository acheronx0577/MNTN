import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MNTN | Landing Page",
  description: "A hiking guide — be prepared for the mountains and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
