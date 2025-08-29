"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import type { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    const record = await pb.collection("notes").create({
      user: user.id,
      title,
      body,
      ...(hike ? { hike } : {}),
    });
    revalidatePath("/account/notes");
    redirect(`/account/notes/${record.id}`);
  } catch {
    return { ok: false, error: "Could not create note." };
  }
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
    if (note.user !== user.id) return { ok: false, error: "Not authorized." };

    await pb.collection("notes").update(noteId, {
      title,
      body,
      hike: hike || null,
    });
    revalidatePath("/account/notes");
    revalidatePath(`/account/notes/${noteId}`);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update note." };
  }
}

export async function deleteNoteAction(noteId: string): Promise<void> {
  const user = await requireAuth();
  const pb = await getServerPB();

  try {
    const note = await pb.collection("notes").getOne(noteId);
    if (note.user !== user.id) return;
    await pb.collection("notes").delete(noteId);
    revalidatePath("/account/notes");
    redirect("/account/notes");
  } catch {
    // ignore
  }
}
