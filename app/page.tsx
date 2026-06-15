import ContentSections from "@/components/ContentSections";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MntnAnimations from "@/components/MntnAnimations";
import SideSlider from "@/components/SideSlider";

export default function Home() {
  return (
    <>
      <MntnAnimations />
      <main>
        <HeroSection />
        <ContentSections />
        <SideSlider />
      </main>
      <Footer />
    </>
  );
}
