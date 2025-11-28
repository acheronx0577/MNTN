import Link from "next/link";
import Logo from "./Logo";

const blogLinks = [
  { label: "About MNTN", href: "#" },
  { label: "Contributors & Writers", href: "#" },
  { label: "Write For Us", href: "#" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "#" },
];

const mntnLinks = [
  { label: "The Team", href: "#" },
  { label: "Jobs", href: "#" },
  { label: "Press", href: "#" },
];

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-row">
          <div className="footer-column footer-column-logo">
            <div className="footer-logo">
              <Link href="/">
                <Logo clipId="clip0_footer_logo" />
              </Link>
            </div>
            <div className="footer-copy">
              Get out there & discover your next <br />
              slope, mountain & destination!
            </div>
            <div className="footer-copy-rights">
              Copyright 2023 MNTN, Inc. Terms & Privacy
            </div>
          </div>
          <div className="footer-column footer-column-link">
            <h4 className="footer-heading">More on The Blog</h4>
            <ul className="footer-links-list">
              {blogLinks.map((link) => (
                <li className="footer-links-item" key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href}>{link.label}</Link>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column footer-column-link">
            <h4 className="footer-heading">More on MNTN</h4>
            <ul className="footer-links-list">
              {mntnLinks.map((link) => (
                <li className="footer-links-item" key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
