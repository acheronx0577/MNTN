"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");
    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    requestAnimationFrame(scrollToTarget);
    const timer = window.setTimeout(scrollToTarget, 120);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
