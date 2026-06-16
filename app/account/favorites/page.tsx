import Link from "next/link";
import { getServerPB } from "@/lib/pocketbase/server";
import { listStarredNotes } from "@/lib/note-favorites-server";
import { requireAuth } from "@/lib/auth";
import { removeFavoriteAction } from "@/app/actions/favorites";
import NoteStarButton from "@/components/account/NoteStarButton";

export const metadata = {
  title: "Favorites | MNTN",
};

type FavoriteRecord = {
  id: string;
  expand?: {
    hike?: {
      image?: string;
      title?: string;
      subtitle?: string;
    };
  };
};

export default async function FavoritesPage() {
  const user = await requireAuth();
  const pb = await getServerPB();
  const { notes: starredNotes, error: starredError } = await listStarredNotes();

  let favorites: FavoriteRecord[] = [];
  try {
    favorites = await pb.collection("favorites").getFullList({
      filter: `user = "${user.id}"`,
      expand: "hike",
    });
  } catch {
    favorites = [];
  }

  const hasHikes = favorites.some((fav) => fav.expand?.hike);
  const hasNotes = starredNotes.length > 0;
  const isEmpty = !hasHikes && !hasNotes;

  return (
    <>
      <h1 className="account-welcome">Favorites</h1>
      {starredError && (
        <div className="form-alert form-alert--error" style={{ marginBottom: "16px" }}>
          {starredError}
        </div>
      )}

      {isEmpty ? (
        <p className="empty-state">
          Nothing saved yet. Star notes from{" "}
          <Link href="/account/notes" className="text-link" prefetch={false}>
            Trail notes
          </Link>{" "}
          or save hikes from the landing page.
        </p>
      ) : (
        <>
          {hasNotes && (
            <section className="favorites-section">
              <h2 className="favorites-section__title">Starred notes</h2>
              <ul className="starred-notes-list">
                {starredNotes.map((note) => (
                  <li key={note.id} className="starred-note-card">
                    <NoteStarButton noteId={note.id} initialStarred />
                    <div className="starred-note-card__content">
                      <Link href={`/account/notes/${note.id}`}>
                        <h3 className="starred-note-card__title">{note.title}</h3>
                      </Link>
                      <p className="starred-note-card__body">
                        {note.body.length > 140
                          ? `${note.body.slice(0, 140).trim()}…`
                          : note.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasHikes && (
            <section className="favorites-section">
              <h2 className="favorites-section__title">Saved hikes</h2>
              <div className="favorites-grid">
                {favorites.map((fav) => {
                  const hike = fav.expand?.hike;
                  if (!hike) return null;
                  return (
                    <article key={fav.id} className="favorite-card">
                      <img src={hike.image} alt="" />
                      <div>
                        <p className="favorite-card__subtitle">{hike.subtitle}</p>
                        <h2 className="favorite-card__title">{hike.title}</h2>
                        <form action={removeFavoriteAction.bind(null, fav.id)}>
                          <button type="submit" className="btn-ghost-sm">
                            Remove
                          </button>
                        </form>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
