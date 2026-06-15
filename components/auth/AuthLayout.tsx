import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "default" | "large";
  variant?: "centered" | "split";
  imageSrc?: string;
  imageAlt?: string;
  imageTagline?: string;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  size = "default",
  variant = "centered",
  imageSrc = "/images/auth/login-hero.webp",
  imageAlt = "Mountain landscape",
  imageTagline = "Be prepared for the mountains and beyond.",
}: AuthLayoutProps) {
  if (variant === "split") {
    return (
      <div className="page-shell auth-layout auth-layout--split">
        <div className="auth-split">
          <aside className="auth-split__visual" aria-hidden="false">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 50vw"
              className="auth-split__visual-img"
            />
            <div className="auth-split__visual-shade" aria-hidden="true" />
            <div className="auth-split__visual-top">
              <Link href="/" className="auth-split__logo" aria-label="MNTN home">
                <Logo clipId="clip0_auth_split_logo" />
              </Link>
              <Link href="/" className="auth-split__back">
                Back to website
                <i className="bx bx-right-arrow-alt" aria-hidden="true" />
              </Link>
            </div>
            <p className="auth-split__tagline">{imageTagline}</p>
          </aside>

          <section className="auth-split__panel">
            <div className="auth-split__panel-inner">
              <div className="auth-split__header">
                <p className="auth-split__eyebrow">A Hiking guide</p>
                <h1 className="auth-split__title">{title}</h1>
                <p className="auth-split__subtitle">{subtitle}</p>
              </div>
              <div className="auth-split__body">{children}</div>
              {footer && <div className="auth-split__footer">{footer}</div>}
            </div>
          </section>
        </div>
      </div>
    );
  }

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
