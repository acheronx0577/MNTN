import ContentSections from "@/components/ContentSections";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HashScroll from "@/components/HashScroll";
import MntnAnimations from "@/components/MntnAnimations";
import SideSlider from "@/components/SideSlider";
import SiteHub from "@/components/SiteHub";
import { getHikes } from "@/lib/hikes";

export default async function Home() {
  const hikes = await getHikes();

  return (
    <>
      <HashScroll />
      <MntnAnimations />
      <SiteHub />
      <main>
        <HeroSection />
        <ContentSections hikes={hikes} />
        <SideSlider />
      </main>
      <Footer />
    </>
  );
}
