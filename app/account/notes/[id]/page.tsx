import { notFound } from "next/navigation";
import NoteForm from "@/components/account/NoteForm";
import NoteStarButton from "@/components/account/NoteStarButton";
import { deleteNoteAction, updateNoteAction } from "@/app/actions/notes";
import { getLinkableHikes } from "@/lib/hikes";
import { isNoteStarred } from "@/lib/note-favorites-server";
import { recordOwnedByUser } from "@/lib/pocketbase/relation-id";
import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Edit note ${id} | MNTN` };
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;
  const user = await requireAuth();
  const pb = await getServerPB();

  let note;
  try {
    note = await pb.collection("notes").getOne(id);
    if (!recordOwnedByUser(note.user, user.id)) notFound();
  } catch {
    notFound();
  }

  const hikes = await getLinkableHikes();
  const noteStarred = await isNoteStarred(id);
  const boundUpdate = updateNoteAction.bind(null, id);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "8px",
        }}
      >
        <h1 className="account-welcome" style={{ marginBottom: 0 }}>
          Edit note
        </h1>
        <NoteStarButton
          noteId={id}
          initialStarred={noteStarred}
          label={noteStarred ? "Starred" : "Add to favorites"}
        />
      </div>
      <NoteForm
        hikes={hikes.map((h) => ({ id: h.id, title: h.title }))}
        defaultTitle={note.title as string}
        defaultBody={note.body as string}
        defaultHike={(note.hike as string) ?? ""}
        action={boundUpdate}
        submitLabel="Save changes"
      />
      <form action={deleteNoteAction.bind(null, id)} style={{ marginTop: "16px" }}>
        <button type="submit" className="btn-ghost-sm">
          Delete note
        </button>
      </form>
    </>
  );
}
