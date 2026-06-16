import Link from "next/link";
import { deleteNoteAction } from "@/app/actions/notes";
import type { Note } from "@/lib/types";

type NotesListProps = {
  notes: Note[];
};

export default function NotesList({ notes }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <p className="empty-state">
        No notes yet.{" "}
        <Link href="/account/notes/new" className="text-link" prefetch={false}>
          Create one
        </Link>{" "}
        to track trail plans and gear lists.
      </p>
    );
  }

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <Link href={`/account/notes/${note.id}`}>{note.title}</Link>
          <form action={deleteNoteAction.bind(null, note.id)}>
            <button type="submit" className="btn-ghost-sm">
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
