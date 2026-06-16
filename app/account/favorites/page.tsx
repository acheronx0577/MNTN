import Link from "next/link";
import { getServerPB } from "@/lib/pocketbase/server";
import { requireAuth } from "@/lib/auth";
import { removeFavoriteAction } from "@/app/actions/favorites";

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

  let favorites: FavoriteRecord[] = [];
  try {
    favorites = await pb.collection("favorites").getFullList({
      filter: `user = "${user.id}"`,
      expand: "hike",
    });
  } catch {
    favorites = [];
  }

  const hikes = favorites.filter((fav) => fav.expand?.hike);

  return (
    <>
      <h1 className="account-welcome">Favorites</h1>

      {hikes.length === 0 ? (
        <p className="empty-state">
          No saved hikes yet. Save hikes from the{" "}
          <Link href="/" className="text-link" prefetch={false}>
            landing page
          </Link>
          .
        </p>
      ) : (
        <section className="favorites-section">
          <h2 className="favorites-section__title">Saved hikes</h2>
          <div className="favorites-grid">
            {hikes.map((fav) => {
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
  );
}
