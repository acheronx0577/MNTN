import { ReadMoreIcon } from "./Icons";
import FavoriteButton from "./account/FavoriteButton";
import type { Hike } from "@/lib/types";

type ContentSectionsProps = {
  hikes: Hike[];
  favoriteHikeIds: string[];
  isLoggedIn: boolean;
};

const TITLE_LINES: Record<string, [string, string]> = {
  "hiking-essentials": ["Picking the right", "Hiking Gear!"],
  "map-timing": ["Understand Your", "Map & Timing"],
};

export default function ContentSections({
  hikes,
  favoriteHikeIds,
  isLoggedIn,
}: ContentSectionsProps) {
  return (
    <section className="content-section section">
      <div className="container">
        {hikes.map((hike, index) => {
          const counter = String(index + 1).padStart(2, "0");
          const sectionId = `section-${String(index + 1).padStart(2, "0")}`;
          const titleLines = TITLE_LINES[hike.slug];

          return (
            <div className="content-wrapper" id={sectionId} key={hike.id}>
              <div className="content-row">
                <div className="content-image">
                  <img src={hike.image} alt="" />
                </div>
                <div className="content-content">
                  <h5 className="content-subtitle">
                    <span className="counter">{counter}</span>
                    {hike.subtitle.replace(/^\d+\s*/, "")}
                  </h5>
                  {titleLines && (
                    <h2 className="content-title">
                      <span>{titleLines[0]}</span>
                      <span>{titleLines[1]}</span>
                    </h2>
                  )}
                  <p className="content-copy">{hike.description}</p>
                  <a href="#" className="content-action">
                    read more
                    <ReadMoreIcon />
                  </a>
                  {isLoggedIn && (
                    <FavoriteButton
                      hikeId={hike.id}
                      initialSaved={favoriteHikeIds.includes(hike.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
