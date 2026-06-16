import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import NotesList from "@/components/account/NotesList";
import { listUserNotes } from "@/lib/notes-server";
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
        <h1 className="account-welcome" style={{ marginBottom: 0 }}>
          Trail notes
        </h1>
        <Link
          href="/account/notes/new"
          className="btn-primary"
          style={{ width: "auto", flexShrink: 0 }}
          prefetch={false}
        >
          New note
        </Link>
      </div>
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
      <NotesList notes={notes} />
    </>
  );
}
