import type Lenis from "lenis";

type ScrollOptions = {
  duration?: number;
  immediate?: boolean;
};

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTarget(
  target: number | string | HTMLElement,
  options: ScrollOptions = {}
) {
  const { duration = 1.15, immediate = false } = options;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: immediate ? 0 : duration,
      immediate,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
    return;
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  element?.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
}
