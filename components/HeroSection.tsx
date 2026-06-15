import { ScrollDownIcon } from "./Icons";

export default function HeroSection() {
  return (
    <section className="hero-section section" id="section-00">
      <div className="hero-image-wrapper">
        <img src="/images/sky.png" className="sky" alt="" />
        <img src="/images/mountains.png" className="mountains" alt="" />
        <img src="/images/man-standing.png" className="man-standing" alt="" />
      </div>

      <div className="hero-content">
        <h5 className="hero-subtitle">A Hiking guide</h5>
        <h1 className="hero-title">
          <span>Be prepared for the</span>
          <br />
          <span>Mountains and beyond!</span>
        </h1>
        <a href="#section-01" className="hero-action">
          Scroll down
          <ScrollDownIcon />
        </a>
      </div>
    </section>
  );
}
