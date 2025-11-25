"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import Logo from "./Logo";

const menuLinks = [
  { href: "#", label: "Equipment" },
  { href: "#", label: "About us" },
  { href: "#", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = {
  user?: { name?: string; email?: string } | null;
};

export default function Header({ user }: HeaderProps) {
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
    const header = headerRef.current;
    const heroSection = document.querySelector(".hero-section");
    if (!header || !heroSection) return;

    const onScroll = () => {
      if (window.scrollY >= (heroSection as HTMLElement).offsetHeight / 2) {
        header.classList.add("on-scroll");
      } else {
        header.classList.remove("on-scroll");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <nav className="navbar">
        <div className="header-container">
          <Link href="/" className="brand">
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
              <Link href="/" className="brand" onClick={closeMenu}>
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
              {menuLinks.map((link) => (
                <li className="menu-itme" key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="menu-link"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="menu-link">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="menu-block">
            <Link href={accountHref} className="menu-block-link">
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
