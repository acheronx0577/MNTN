import NoteForm from "@/components/account/NoteForm";
import { getLinkableHikes } from "@/lib/hikes";
import { getServerPB } from "@/lib/pocketbase/server";
import {
  countUserNotes,
  isAtNoteLimit,
  MAX_USER_NOTES,
} from "@/lib/notes-server";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "New note | MNTN",
};

export default async function NewNotePage() {
  await requireAuth();
  const pb = await getServerPB();
  const hikes = await getLinkableHikes();
  const noteCount = await countUserNotes(pb);
  const atLimit = isAtNoteLimit(noteCount);

  if (atLimit) {
    return (
      <>
        <h1 className="account-welcome">New note</h1>
        <div className="account-panel">
          <div className="form-alert form-alert--error">
            You&apos;ve reached the limit of {MAX_USER_NOTES} notes. Delete one
            from your list before creating another.
          </div>
          <Link href="/account/notes" className="btn-primary" prefetch={false}>
            Back to notes
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="account-welcome">New note</h1>
      <p className="account-meta">
        {noteCount}/{MAX_USER_NOTES} notes used
      </p>
      <div className="account-panel">
        <NoteForm hikes={hikes.map((h) => ({ id: h.id, title: h.title }))} />
      </div>
    </>
  );
}
