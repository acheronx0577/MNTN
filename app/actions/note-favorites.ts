"use server";

import { ClientResponseError } from "pocketbase";
import { recordOwnedByUser, relationRecordId } from "@/lib/pocketbase/relation-id";
import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import { isSafeRecordId } from "@/lib/security/pocketbase-id";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function toggleNoteStarAction(
  noteId: string
): Promise<ActionResult & { starred?: boolean }> {
  const user = await requireAuth();

  if (!isSafeRecordId(noteId)) {
    return { ok: false, error: "Invalid note." };
  }

  const pb = await getServerPB();

  try {
    const note = await pb.collection("notes").getOne(noteId);
    if (!recordOwnedByUser(note.user, user.id)) {
      return { ok: false, error: "Not authorized." };
    }

    const favorites = await pb.collection("note_favorites").getFullList();
    const existing = favorites.find(
      (favorite) => relationRecordId(favorite.note) === noteId
    );

    if (existing) {
      await pb.collection("note_favorites").delete(existing.id);
      revalidatePath("/account/notes", "page");
      revalidatePath("/account/favorites", "page");
      revalidatePath(`/account/notes/${noteId}`, "page");
      return { ok: true, starred: false };
    }

    await pb.collection("note_favorites").create({
      user: user.id,
      note: noteId,
    });
    revalidatePath("/account/notes", "page");
    revalidatePath("/account/favorites", "page");
    revalidatePath(`/account/notes/${noteId}`, "page");
    return { ok: true, starred: true };
  } catch (err) {
    console.error("Toggle note star failed:", err);

    if (err instanceof ClientResponseError) {
      if (err.status === 401 || err.status === 403) {
        return { ok: false, error: "Your session expired. Sign in again." };
      }
      if (err.status === 404) {
        return {
          ok: false,
          error:
            "Note favorites are not set up yet. In PocketBase, create a note_favorites collection (user + note relations) or run project migrations.",
        };
      }
    }

    return { ok: false, error: "Could not save to favorites." };
  }
}
