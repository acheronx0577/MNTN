import NoteForm from "@/components/account/NoteForm";
import { getHikes } from "@/lib/hikes";

export const metadata = {
  title: "New note | MNTN",
};

export default async function NewNotePage() {
  const hikes = await getHikes();

  return (
    <>
      <h1 className="account-welcome">New note</h1>
      <NoteForm hikes={hikes.map((h) => ({ id: h.id, title: h.title }))} />
    </>
  );
}
