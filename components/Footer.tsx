import Logo from "./Logo";

const blogLinks = [
  "About MNTN",
  "Contributors & Writers",
  "Write For Us",
  "Contact Us",
  "Privacy Policy",
];

const mntnLinks = ["The Team", "Jobs", "Press"];

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-row">
          <div className="footer-column footer-column-logo">
            <div className="footer-logo">
              <a href="#">
                <Logo clipId="clip0_footer_logo" />
              </a>
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
                <li className="footer-links-item" key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column footer-column-link">
            <h4 className="footer-heading">More on MNTN</h4>
            <ul className="footer-links-list">
              {mntnLinks.map((link) => (
                <li className="footer-links-item" key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
