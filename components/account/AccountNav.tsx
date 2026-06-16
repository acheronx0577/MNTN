"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/account", label: "Profile" },
  { href: "/account/favorites", label: "Favorites" },
  { href: "/account/notes", label: "Notes" },
];

type AccountNavProps = {
  userName?: string;
};

export default function AccountNav({ userName }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = () => {
    router.refresh();
  };

  return (
    <nav className="account-nav" aria-label="Account navigation">
      {userName && (
        <p
          className="account-welcome"
          style={{ fontSize: "1rem", marginBottom: "8px" }}
        >
          Hi, {userName}
        </p>
      )}
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          prefetch={false}
          onClick={handleNavClick}
          className={`account-nav__link ${
            pathname === link.href ||
            (link.href !== "/account" && pathname.startsWith(link.href))
              ? "is-active"
              : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
      <form action={logoutAction}>
        <button type="submit" className="account-nav__link account-nav__logout">
          Log out
        </button>
      </form>
    </nav>
  );
}
