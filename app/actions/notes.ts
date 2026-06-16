"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { recordOwnedByUser } from "@/lib/pocketbase/relation-id";
import { countUserNotes, isAtNoteLimit, MAX_USER_NOTES } from "@/lib/notes-server";
import { requireAuth } from "@/lib/auth";
import { isPocketBaseRecordId } from "@/lib/security/pocketbase-id";
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
