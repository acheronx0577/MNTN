"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireAuth();
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatar = String(formData.get("avatar") ?? "").trim();

  if (!name) return { ok: false, error: "Name is required" };

  try {
    const pb = await getServerPB();
    await pb.collection("users").update(user.id, { name, bio, avatar });
    revalidatePath("/account");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update profile." };
  }
}
