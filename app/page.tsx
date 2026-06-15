import ContentSections from "@/components/ContentSections";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HashScroll from "@/components/HashScroll";
import MntnAnimations from "@/components/MntnAnimations";
import SideSlider from "@/components/SideSlider";
import { getCurrentUser } from "@/lib/auth";
import { getHikes } from "@/lib/hikes";
import { getServerPB } from "@/lib/pocketbase/server";

export default async function Home() {
  const hikes = await getHikes();
  const user = await getCurrentUser();
  let favoriteHikeIds: string[] = [];

  if (user) {
    try {
      const pb = await getServerPB();
      const favs = await pb.collection("favorites").getFullList({
        filter: `user = "${user.id}"`,
      });
      favoriteHikeIds = favs.map((f) => f.hike as string);
    } catch {
      favoriteHikeIds = [];
    }
  }

  return (
    <>
      <HashScroll />
      <MntnAnimations />
      <main>
        <HeroSection />
        <ContentSections
          hikes={hikes}
          favoriteHikeIds={favoriteHikeIds}
          isLoggedIn={!!user}
        />
        <SideSlider />
      </main>
      <Footer />
    </>
  );
}
