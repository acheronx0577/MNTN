"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { scrollToTarget } from "@/lib/lenis";
import Logo from "./Logo";

const menuLinks = [
  { href: "/#section-01", label: "Equipment" },
  { href: "/#section-01", label: "About us" },
  { href: "/#section-02", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = {
  user?: { name?: string; email?: string } | null;
};

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const accountHref = user ? "/account" : "/login";
  const accountLabel = user?.name ?? "Account";

  const closeMenu = useCallback(() => {
    const header = headerRef.current;
    const burger = burgerRef.current;
    if (!header || !burger) return;

    burger.classList.remove("is-active");
    header.classList.remove("menu-is-active");
    document.body.classList.remove("overflow-hidden");
    document.body.removeAttribute("data-lenis-prevent");
  }, []);

  const toggleMenu = useCallback(() => {
    const header = headerRef.current;
    const burger = burgerRef.current;
    if (!header || !burger) return;

    burger.classList.toggle("is-active");
    header.classList.toggle("menu-is-active");
    document.body.classList.toggle("overflow-hidden");

    if (header.classList.contains("menu-is-active")) {
      document.body.setAttribute("data-lenis-prevent", "");
    } else {
      document.body.removeAttribute("data-lenis-prevent");
    }
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const header = headerRef.current;
    const heroSection = document.querySelector(".hero-section");
    if (!header || !heroSection) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (window.scrollY >= (heroSection as HTMLElement).offsetHeight / 2) {
          header.classList.add("on-scroll");
        } else {
          header.classList.remove("on-scroll");
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      closeMenu();

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const id = href.slice(hashIndex + 1);
      if (pathname !== "/" || !id) return;

      event.preventDefault();
      window.history.pushState(null, "", `/#${id}`);
      scrollToTarget(`#${id}`);
    },
    [closeMenu, pathname]
  );

  const handleLogoClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      closeMenu();

      if (pathname !== "/") return;

      event.preventDefault();
      window.history.pushState(null, "", "/");
      headerRef.current?.classList.remove("on-scroll");
      scrollToTarget(0);
    },
    [closeMenu, pathname]
  );

  return (
    <header className="header" ref={headerRef}>
      <nav className="navbar">
        <div className="header-container">
          <Link
            href="/"
            className="brand"
            aria-label="MNTN home"
            prefetch
            onClick={handleLogoClick}
          >
            <Logo clipId="clip0_header_brand" />
          </Link>

          <div
            className="burger"
            ref={burgerRef}
            onClick={toggleMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
            aria-label="Toggle menu"
          >
            <div className="burger-line-wrapper">
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </div>
          </div>

          <div className="menu">
            <div className="menu-header">
              <Link
                href="/"
                className="brand"
                aria-label="MNTN home"
                prefetch
                onClick={handleLogoClick}
              >
                <Logo clipId="clip0_menu_brand" />
              </Link>
              <div
                className="burger is-active close-menu"
                onClick={closeMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && closeMenu()}
                aria-label="Close menu"
              >
                <div className="burger-line-wrapper">
                  <span className="burger-line" />
                  <span className="burger-line" />
                  <span className="burger-line" />
                </div>
              </div>
            </div>

            <ul className="menu-inner">
              {menuLinks.map((link) => {
                const isActive =
                  link.href === "/contact" && pathname === "/contact";

                return (
                  <li className="menu-itme" key={link.label}>
                    <Link
                      href={link.href}
                      className={`menu-link${isActive ? " is-active" : ""}`}
                      onClick={(event) => handleNavClick(event, link.href)}
                      prefetch
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="menu-block">
            <Link
              href={accountHref}
              className={`menu-block-link${pathname === accountHref ? " is-active" : ""}`}
              prefetch
              onClick={closeMenu}
            >
              <i className="bx bx-user-circle" />
              {accountLabel}
            </Link>
          </div>
        </div>
      </nav>

      <div className="header-backdrop" onClick={closeMenu} aria-hidden="true" />
    </header>
  );
}
