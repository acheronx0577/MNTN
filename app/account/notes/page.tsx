import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import NotesList from "@/components/account/NotesList";
import {
  isAtNoteLimit,
  listUserNotes,
  MAX_USER_NOTES,
} from "@/lib/notes-server";
import { getStarredNoteIds } from "@/lib/note-favorites-server";
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
  const starredNoteIds = await getStarredNoteIds();
  const atLimit = isAtNoteLimit(notes.length);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 className="account-welcome" style={{ marginBottom: 0 }}>
            Trail notes
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            {notes.length}/{MAX_USER_NOTES} notes
          </p>
        </div>
        {atLimit ? (
          <span
            className="btn-primary"
            style={{
              width: "auto",
              flexShrink: 0,
              opacity: 0.5,
              cursor: "not-allowed",
            }}
            aria-disabled="true"
            title={`Maximum of ${MAX_USER_NOTES} notes reached`}
          >
            New note
          </span>
        ) : (
          <Link
            href="/account/notes/new"
            className="btn-primary"
            style={{ width: "auto", flexShrink: 0 }}
            prefetch={false}
          >
            New note
          </Link>
        )}
      </div>
      {atLimit && (
        <div className="form-alert form-alert--error" style={{ marginBottom: "16px" }}>
          You&apos;ve reached the limit of {MAX_USER_NOTES} notes. Delete one to
          create another.
        </div>
      )}
      {created && notes.length > 0 && (
        <div className="form-alert form-alert--success" style={{ marginBottom: "16px" }}>
          Note saved. It appears in your list below.
        </div>
      )}
      {error && (
        <div className="form-alert form-alert--error" style={{ marginBottom: "16px" }}>
          {error}
        </div>
      )}
      <NotesList
        notes={notes}
        atLimit={atLimit}
        starredNoteIds={[...starredNoteIds]}
      />
    </>
  );
}
