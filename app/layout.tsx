import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "MNTN | Landing Page",
  description: "A hiking guide — be prepared for the mountains and beyond.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <Header
          user={user ? { name: user.name, email: user.email } : null}
        />
        {children}
      </body>
    </html>
  );
}
