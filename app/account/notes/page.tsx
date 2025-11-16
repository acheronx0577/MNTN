import Link from "next/link";
import NotesList from "@/components/account/NotesList";
import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import type { Note } from "@/lib/types";

export const metadata = {
  title: "Notes | MNTN",
};

export default async function NotesPage() {
  const user = await requireAuth();
  const pb = await getServerPB();

  let notes: Note[] = [];
  try {
    const records = await pb.collection("notes").getFullList({
      filter: `user = "${user.id}"`,
      sort: "-created",
    });
    notes = records.map((r) => ({
      id: r.id,
      title: r.title as string,
      body: r.body as string,
      hike: r.hike as string | undefined,
      created: r.created,
      updated: r.updated,
    }));
  } catch {
    notes = [];
  }

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
        <Link href="/account/notes/new" className="btn-primary" style={{ width: "auto" }}>
          New note
        </Link>
      </div>
      <NotesList notes={notes} />
    </>
  );
}
