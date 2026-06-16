import PocketBase, { ClientResponseError } from "pocketbase";
import { mapNoteRecord } from "@/lib/notes-server";
import { relationRecordId } from "@/lib/pocketbase/relation-id";
import { getServerPB } from "@/lib/pocketbase/server";
import type { Note } from "@/lib/types";

async function fetchNoteFavorites(pb: PocketBase) {
  return pb.collection("note_favorites").getFullList({
    expand: "note",
  });
}

export async function getStarredNoteIds(): Promise<Set<string>> {
  try {
    const pb = await getServerPB();
    if (!pb.authStore.isValid) return new Set();

    const favorites = await fetchNoteFavorites(pb);
    const ids = favorites
      .map((favorite) => relationRecordId(favorite.note))
      .filter((id): id is string => Boolean(id));

    return new Set(ids);
  } catch (err) {
    if (err instanceof ClientResponseError && err.status === 404) {
      return new Set();
    }
    console.error("getStarredNoteIds failed:", err);
    return new Set();
  }
}

export async function isNoteStarred(noteId: string): Promise<boolean> {
  const starredIds = await getStarredNoteIds();
  return starredIds.has(noteId);
}

export async function listStarredNotes(): Promise<{
  notes: Note[];
  error?: string;
}> {
  try {
    const pb = await getServerPB();
    if (!pb.authStore.isValid) {
      return { notes: [], error: "Your session expired. Sign in again." };
    }

    const favorites = await fetchNoteFavorites(pb);
    const notes = favorites
      .map((favorite) => {
        const expanded = favorite.expand?.note;
        if (!expanded || typeof expanded !== "object" || !("id" in expanded)) {
          return null;
        }
        return mapNoteRecord(expanded as Parameters<typeof mapNoteRecord>[0]);
      })
      .filter((note): note is Note => note !== null);

    return { notes };
  } catch (err) {
    console.error("listStarredNotes failed:", err);

    if (err instanceof ClientResponseError) {
      if (err.status === 404) {
        return {
          notes: [],
          error:
            "Note favorites are not set up in PocketBase. Run migrations or create the note_favorites collection.",
        };
      }
      if (err.status === 401 || err.status === 403) {
        return { notes: [], error: "Your session expired. Sign in again." };
      }
    }

    return { notes: [], error: "Could not load starred notes." };
  }
}
