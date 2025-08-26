"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function toggleFavoriteAction(
  hikeId: string
): Promise<ActionResult & { saved?: boolean }> {
  const user = await requireAuth();
  const pb = await getServerPB();

  try {
    const existing = await pb.collection("favorites").getList(1, 1, {
      filter: `user = "${user.id}" && hike = "${hikeId}"`,
    });

    if (existing.items.length > 0) {
      await pb.collection("favorites").delete(existing.items[0].id);
      revalidatePath("/account/favorites");
      revalidatePath("/");
      return { ok: true, saved: false };
    }

    await pb.collection("favorites").create({
      user: user.id,
      hike: hikeId,
    });
    revalidatePath("/account/favorites");
    revalidatePath("/");
    return { ok: true, saved: true };
  } catch {
    return { ok: false, error: "Could not update favorite." };
  }
}

export async function removeFavoriteAction(favoriteId: string): Promise<void> {
  const user = await requireAuth();
  const pb = await getServerPB();

  try {
    const fav = await pb.collection("favorites").getOne(favoriteId);
    if (fav.user !== user.id) return;
    await pb.collection("favorites").delete(favoriteId);
    revalidatePath("/account/favorites");
  } catch {
    // ignore
  }
}

export async function getUserFavoriteHikeIds(): Promise<string[]> {
  const user = await requireAuth();
  const pb = await getServerPB();
  try {
    const list = await pb.collection("favorites").getFullList({
      filter: `user = "${user.id}"`,
    });
    return list.map((f) => f.hike as string);
  } catch {
    return [];
  }
}
