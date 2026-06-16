import PocketBase, { ClientResponseError } from "pocketbase";
import { getServerPB, setAuthCookie } from "@/lib/pocketbase/server";
import type { Note } from "@/lib/types";

function notesLoadError(err: unknown): string {
  if (err instanceof ClientResponseError) {
    if (err.status === 401 || err.status === 403) {
      return "Your session expired or cannot access notes. Sign out and sign in again.";
    }
    if (err.status === 404) {
      return "Notes are not set up in PocketBase yet. Run the project migrations on your backend.";
    }
    if (err.status === 0 || err.message.toLowerCase().includes("fetch")) {
      return "Cannot reach PocketBase. Check NEXT_PUBLIC_POCKETBASE_URL in your environment.";
    }
  }

  return "Could not load notes. Refresh the page or try again in a moment.";
}

async function fetchUserNotes(pb: PocketBase) {
  return pb.collection("notes").getFullList({
    sort: "-created",
  });
}

export async function listUserNotes(_userId: string): Promise<{
  notes: Note[];
  error?: string;
}> {
  try {
    const pb = await getServerPB();

    if (!pb.authStore.isValid) {
      return { notes: [], error: "Your session expired. Sign in again." };
    }

    let records;

    try {
      records = await fetchUserNotes(pb);
    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 401) {
        await pb.collection("users").authRefresh();
        await setAuthCookie(pb);
        records = await fetchUserNotes(pb);
      } else {
        throw err;
      }
    }

    return {
      notes: records.map((r) => ({
        id: r.id,
        title: r.title as string,
        body: r.body as string,
        hike: r.hike as string | undefined,
        created: r.created,
        updated: r.updated,
      })),
    };
  } catch (err) {
    console.error("listUserNotes failed:", err);
    return {
      notes: [],
      error: notesLoadError(err),
    };
  }
}
