import PocketBase, { ClientResponseError, type RecordModel } from "pocketbase";
import { getServerPB, setAuthCookie } from "@/lib/pocketbase/server";
import type { Note } from "@/lib/types";

export const MAX_USER_NOTES = 10;

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
    if (err.message) {
      return `Could not load notes: ${err.message}`;
    }
  }

  return "Could not load notes. Refresh the page or try again in a moment.";
}

async function fetchUserNotes(pb: PocketBase) {
  // PocketBase returns 400 when sorting notes by system date fields (created/updated).
  const records = await pb.collection("notes").getFullList();

  return records.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );
}

export async function countUserNotes(pb: PocketBase): Promise<number> {
  const page = await pb.collection("notes").getList(1, 1);
  return page.totalItems;
}

export function isAtNoteLimit(count: number): boolean {
  return count >= MAX_USER_NOTES;
}

export function mapNoteRecord(record: RecordModel): Note {
  return {
    id: record.id,
    title: record.title as string,
    body: record.body as string,
    hike: record.hike as string | undefined,
    created: record.created,
    updated: record.updated,
  };
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
      notes: records.map(mapNoteRecord),
    };
  } catch (err) {
    console.error("listUserNotes failed:", err);
    return {
      notes: [],
      error: notesLoadError(err),
    };
  }
}
