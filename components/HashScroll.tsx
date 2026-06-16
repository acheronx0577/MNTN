"use client";

import { scrollToTarget } from "@/lib/lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    const timer = window.setTimeout(() => {
      scrollToTarget(hash);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
