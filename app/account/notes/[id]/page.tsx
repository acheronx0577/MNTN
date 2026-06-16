import { notFound } from "next/navigation";
import NoteForm from "@/components/account/NoteForm";
import { deleteNoteAction, updateNoteAction } from "@/app/actions/notes";
import { getLinkableHikes } from "@/lib/hikes";
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
    if (note.user !== user.id) notFound();
  } catch {
    notFound();
  }

  const hikes = await getLinkableHikes();
  const boundUpdate = updateNoteAction.bind(null, id);

  return (
    <>
      <h1 className="account-welcome">Edit note</h1>
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
