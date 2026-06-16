import { getServerPB, setAuthCookie } from "@/lib/pocketbase/server";
import type { Note } from "@/lib/types";

export async function getAuthenticatedPB() {
  const pb = await getServerPB();

  if (pb.authStore.isValid) {
    try {
      await pb.collection("users").authRefresh();
      await setAuthCookie(pb);
    } catch {
      // Keep the existing session; downstream calls will surface auth errors.
    }
  }

  return pb;
}

export async function listUserNotes(userId: string): Promise<{
  notes: Note[];
  error?: string;
}> {
  try {
    const pb = await getAuthenticatedPB();

    if (!pb.authStore.isValid) {
      return { notes: [], error: "Your session expired. Sign in again." };
    }

    const records = await pb.collection("notes").getFullList({
      sort: "-created",
      filter: `user = "${userId}"`,
    });

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
      error: "Could not load notes. Refresh the page or try again in a moment.",
    };
  }
}
