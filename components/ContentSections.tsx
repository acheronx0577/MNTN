import { ReadMoreIcon } from "./Icons";
import type { Hike } from "@/lib/types";

type ContentSectionsProps = {
  hikes: Hike[];
};

const TITLE_LINES: Record<string, [string, string]> = {
  "get-started": ["Get started", "on the trail!"],
  "hiking-essentials": ["Picking the right", "Hiking Gear!"],
  "map-timing": ["Understand Your", "Map & Timing"],
};

function getTitleLines(hike: Hike): [string, string] {
  const custom = TITLE_LINES[hike.slug];
  if (custom) return custom;

  const words = hike.title.trim().split(/\s+/);
  if (words.length < 2) {
    return [hike.title, ""];
  }

  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function ContentSections({ hikes }: ContentSectionsProps) {
  return (
    <section className="content-section section">
      <div className="container">
        {hikes.map((hike, index) => {
          const counter = String(index + 1).padStart(2, "0");
          const sectionId = `section-${String(index + 1).padStart(2, "0")}`;
          const titleLines = getTitleLines(hike);

          return (
            <div className="content-wrapper" id={sectionId} key={hike.id}>
              <div className="content-row">
                <div className="content-image">
                  <img src={hike.image} alt="" />
                </div>
                <div className="content-content">
                  <h5 className="content-subtitle">
                    <span className="counter">{counter}</span>
                    {hike.subtitle.replace(/^\d+\s*/i, "")}
                  </h5>
                  <h2 className="content-title">
                    <span>{titleLines[0]}</span>
                    {titleLines[1] ? <span>{titleLines[1]}</span> : null}
                  </h2>
                  <p className="content-copy">{hike.description}</p>
                  <a href="#" className="content-action">
                    read more
                    <ReadMoreIcon />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
