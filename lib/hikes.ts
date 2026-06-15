import { createServerPB } from "@/lib/pocketbase/server";
import type { Hike } from "@/lib/types";

export const FALLBACK_HIKES: Hike[] = [
  {
    id: "step-1",
    slug: "get-started",
    title: "Get Started",
    subtitle: "01 GEt Started",
    description:
      "Determining what level of hiker you are can be an important tool when planning future hikes.",
    image: "/images/step-1.png",
    order: 1,
  },
  {
    id: "step-2",
    slug: "hiking-essentials",
    title: "Picking the right Hiking Gear!",
    subtitle: "02 Hiking Essentials",
    description:
      "Determining what level of hiker you are can be an important tool when planning future hikes.",
    image: "/images/step-2.png",
    order: 2,
  },
  {
    id: "step-3",
    slug: "map-timing",
    title: "Understand Your Map & Timing",
    subtitle: "03 where you go is the key",
    description:
      "Determining what level of hiker you are can be an important tool when planning future hikes.",
    image: "/images/step-3.png",
    order: 3,
  },
];

export async function getHikes(): Promise<Hike[]> {
  try {
    const pb = createServerPB();
    const records = await pb.collection("hikes").getFullList({ sort: "order" });
    if (records.length === 0) {
      return FALLBACK_HIKES;
    }
    return records.map((r) => ({
      id: r.id,
      slug: r.slug as string,
      title: r.title as string,
      subtitle: r.subtitle as string,
      description: r.description as string,
      image: r.image as string,
      difficulty: r.difficulty as string | undefined,
      order: r.order as number,
    }));
  } catch {
    return FALLBACK_HIKES;
  }
}

export async function getHikeBySlug(slug: string): Promise<Hike | null> {
  const hikes = await getHikes();
  return hikes.find((h) => h.slug === slug) ?? null;
}
