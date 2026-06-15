import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import HeaderUser from "@/components/HeaderUser";

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
        <Suspense fallback={<Header />}>
          <HeaderUser />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
