"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/account", label: "Profile" },
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
      <p className="account-nav__eyebrow">Account</p>
      {userName && <p className="account-nav__greeting">Hi, {userName}</p>}
      <div className="account-nav__links">
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
      </div>
      <form action={logoutAction} className="account-nav__logout-form">
        <button type="submit" className="account-nav__link account-nav__logout">
          Log out
        </button>
      </form>
    </nav>
  );
}
