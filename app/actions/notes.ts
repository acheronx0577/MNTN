"use server";

import { ClientResponseError } from "pocketbase";
import { getServerPB } from "@/lib/pocketbase/server";
import { recordOwnedByUser } from "@/lib/pocketbase/relation-id";
import { countUserNotes, isAtNoteLimit, MAX_USER_NOTES } from "@/lib/notes-server";
import { requireAuth } from "@/lib/auth";
import { isPocketBaseRecordId, isSafeRecordId } from "@/lib/security/pocketbase-id";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function notePayload(
  userId: string,
  title: string,
  body: string,
  hike: string
) {
  const payload: {
    user: string;
    title: string;
    body: string;
    hike?: string;
  } = {
    user: userId,
    title,
    body,
  };

  if (hike && isPocketBaseRecordId(hike)) {
    payload.hike = hike;
  }

  return payload;
}

export async function createNoteAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireAuth();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const hike = String(formData.get("hike") ?? "").trim();

  if (!title) return { ok: false, error: "Title is required" };
  if (!body) return { ok: false, error: "Note body is required" };

  try {
    const pb = await getServerPB();
    const noteCount = await countUserNotes(pb);

    if (isAtNoteLimit(noteCount)) {
      return {
        ok: false,
        error: `You can only have ${MAX_USER_NOTES} notes. Delete one to create another.`,
      };
    }

    await pb.collection("notes").create(
      notePayload(user.id, title, body, hike)
    );
    revalidatePath("/account/notes", "page");
  } catch (err) {
    console.error("Create note failed:", err);
    return { ok: false, error: "Could not create note." };
  }

  redirect("/account/notes?created=1");
}

export async function updateNoteAction(
  noteId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireAuth();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const hike = String(formData.get("hike") ?? "").trim();

  if (!title) return { ok: false, error: "Title is required" };
  if (!body) return { ok: false, error: "Note body is required" };

  try {
    const pb = await getServerPB();
    const note = await pb.collection("notes").getOne(noteId);
    if (!recordOwnedByUser(note.user, user.id)) {
      return { ok: false, error: "Not authorized." };
    }

    await pb.collection("notes").update(noteId, {
      title,
      body,
      hike: hike && isPocketBaseRecordId(hike) ? hike : null,
    });
    revalidatePath("/account/notes", "page");
    revalidatePath(`/account/notes/${noteId}`, "page");
    return { ok: true };
  } catch (err) {
    console.error("Update note failed:", err);
    return { ok: false, error: "Could not update note." };
  }
}

export async function deleteNoteAction(noteId: string): Promise<void> {
  const user = await requireAuth();
  const pb = await getServerPB();

  try {
    const note = await pb.collection("notes").getOne(noteId);
    if (!recordOwnedByUser(note.user, user.id)) return;
    await pb.collection("notes").delete(noteId);
    revalidatePath("/account/notes", "page");
    revalidatePath("/account/favorites", "page");
  } catch (err) {
    console.error("Delete note failed:", err);
    return;
  }

  redirect("/account/notes");
}

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

    const starred = !Boolean(note.starred);
    await pb.collection("notes").update(noteId, { starred });
    revalidatePath("/account/notes", "page");
    revalidatePath("/account/favorites", "page");
    revalidatePath(`/account/notes/${noteId}`, "page");

    return { ok: true, starred };
  } catch (err) {
    console.error("Toggle note star failed:", err);

    if (err instanceof ClientResponseError) {
      if (err.status === 401 || err.status === 403) {
        return { ok: false, error: "Your session expired. Sign in again." };
      }

      const message = err.message?.toLowerCase() ?? "";
      if (
        err.status === 400 ||
        message.includes("unknown field") ||
        message.includes("starred")
      ) {
        return {
          ok: false,
          error:
            "Starring is not set up in PocketBase. Add a starred (bool) field to the notes collection, then restart PocketBase.",
        };
      }
    }

    return { ok: false, error: "Could not save to favorites." };
  }
}
