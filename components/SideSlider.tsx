const sliderItems = [
  { href: "#section-00", label: "Start" },
  { href: "#section-01", label: "01" },
  { href: "#section-02", label: "02" },
  { href: "#section-03", label: "03" },
];

export default function SideSlider() {
  return (
    <nav className="slider">
      <div className="container">
        <ul className="slider-list">
          {sliderItems.map((item) => (
            <li className="slider-list-item" key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="slider-progress">
          <div className="slider-progress-bar" style={{ height: "20%" }} />
        </div>
      </div>
    </nav>
  );
}
