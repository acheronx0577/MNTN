import { ReadMoreIcon } from "./Icons";

type ContentBlock = {
  id: string;
  counter: string;
  subtitle: string;
  title?: [string, string];
  image: string;
  copy: string;
};

const contentBlocks: ContentBlock[] = [
  {
    id: "section-01",
    counter: "01",
    subtitle: "GEt Started",
    image: "/images/step-1.png",
    copy: "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker. What type of hiker are you – novice, moderate, advanced moderate, expert, or expert backpacker?",
  },
  {
    id: "section-02",
    counter: "02",
    subtitle: "Hiking Essentials",
    title: ["Picking the right", "Hiking Gear!"],
    image: "/images/step-2.png",
    copy: "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker. What type of hiker are you – novice, moderate, advanced moderate, expert, or expert backpacker?",
  },
  {
    id: "section-03",
    counter: "03",
    subtitle: "where you go is the key",
    title: ["Understand Your", "Map & Timing"],
    image: "/images/step-3.png",
    copy: "Determining what level of hiker you are can be an important tool when planning future hikes. This hiking level guide will help you plan hikes according to different hike ratings set by various websites like All Trails and Modern Hiker. What type of hiker are you – novice, moderate, advanced moderate, expert, or expert backpacker?",
  },
];

export default function ContentSections() {
  return (
    <section className="content-section section">
      <div className="container">
        {contentBlocks.map((block) => (
          <div className="content-wrapper" id={block.id} key={block.id}>
            <div className="content-row">
              <div className="content-image">
                <img src={block.image} alt="" />
              </div>
              <div className="content-content">
                <h5 className="content-subtitle">
                  <span className="counter">{block.counter}</span>
                  {block.subtitle}
                </h5>
                {block.title && (
                  <h2 className="content-title">
                    <span>{block.title[0]}</span>
                    <span>{block.title[1]}</span>
                  </h2>
                )}
                <p className="content-copy">{block.copy}</p>
                <a href="#" className="content-action">
                  read more
                  <ReadMoreIcon />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
