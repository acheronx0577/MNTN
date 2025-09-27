import Link from "next/link";
import Logo from "@/components/Logo";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "default" | "large";
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  size = "default",
}: AuthLayoutProps) {
  return (
    <div className="page-shell auth-layout">
      <div className="page-shell-inner auth-layout">
        <Link href="/" className="auth-layout__logo" aria-label="MNTN home">
          <Logo clipId="clip0_auth_logo" />
        </Link>
        <div
          className={`auth-card${size === "large" ? " auth-card--large" : ""}`}
        >
          <div className="auth-card__header">
            <p className="auth-card__eyebrow">A Hiking guide</p>
            <h1 className="auth-card__title">{title}</h1>
            <p className="auth-card__subtitle">{subtitle}</p>
          </div>
          <div className="auth-card__body">{children}</div>
          {footer && <div className="auth-card__footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
