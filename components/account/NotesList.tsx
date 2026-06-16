import Link from "next/link";
import { deleteNoteAction } from "@/app/actions/notes";
import NoteStarButton from "@/components/account/NoteStarButton";
import { MAX_USER_NOTES } from "@/lib/notes-server";
import type { Note } from "@/lib/types";

type NotesListProps = {
  notes: Note[];
  atLimit?: boolean;
  starredNoteIds?: string[];
};

export default function NotesList({
  notes,
  atLimit = false,
  starredNoteIds = [],
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <p className="empty-state">
        No notes yet.{" "}
        {atLimit ? (
          <>You&apos;ve reached the {MAX_USER_NOTES}-note limit.</>
        ) : (
          <>
            <Link href="/account/notes/new" className="text-link" prefetch={false}>
              Create one
            </Link>{" "}
            to track trail plans and gear lists.
          </>
        )}
      </p>
    );
  }

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <NoteStarButton
            noteId={note.id}
            initialStarred={starredNoteIds.includes(note.id)}
          />
          <Link href={`/account/notes/${note.id}`} className="note-item__title">
            {note.title}
          </Link>
          <div className="note-item__actions">
            <form action={deleteNoteAction.bind(null, note.id)}>
              <button type="submit" className="btn-ghost-sm">
                Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
