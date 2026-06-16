import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import NotesList from "@/components/account/NotesList";
import {
  isAtNoteLimit,
  listUserNotes,
  MAX_USER_NOTES,
} from "@/lib/notes-server";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notes | MNTN",
};

type Props = {
  searchParams: Promise<{ created?: string }>;
};

export default async function NotesPage({ searchParams }: Props) {
  noStore();
  const user = await requireAuth();
  const { created } = await searchParams;
  const { notes, error } = await listUserNotes(user.id);
  const atLimit = isAtNoteLimit(notes.length);

  return (
    <>
      <div className="account-page-header">
        <div>
          <h1 className="account-welcome">Trail notes</h1>
          <p className="account-meta">
            {notes.length}/{MAX_USER_NOTES} notes
          </p>
        </div>
        {atLimit ? (
          <span
            className="btn-primary btn-primary--inline is-disabled"
            aria-disabled="true"
            title={`Maximum of ${MAX_USER_NOTES} notes reached`}
          >
            New note
          </span>
        ) : (
          <Link
            href="/account/notes/new"
            className="btn-primary btn-primary--inline"
            prefetch={false}
          >
            New note
          </Link>
        )}
      </div>

      <div className="account-stack">
        {atLimit && (
          <div className="form-alert form-alert--error">
            You&apos;ve reached the limit of {MAX_USER_NOTES} notes. Delete one
            to create another.
          </div>
        )}
        {created && notes.length > 0 && (
          <div className="form-alert form-alert--success">
            Note saved. It appears in your list below.
          </div>
        )}
        {error && <div className="form-alert form-alert--error">{error}</div>}
      </div>

      <div className="account-panel account-panel--flush">
        <NotesList notes={notes} atLimit={atLimit} />
      </div>
    </>
  );
}
