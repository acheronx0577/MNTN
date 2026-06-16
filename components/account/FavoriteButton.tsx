"use client";

import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions/favorites";

type FavoriteButtonProps = {
  hikeId: string;
  initialSaved: boolean;
};

export default function FavoriteButton({
  hikeId,
  initialSaved,
}: FavoriteButtonProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(initialSaved);

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFavoriteAction(hikeId);
      if (result.ok && typeof result.saved === "boolean") {
        setSaved(result.saved);
      }
    });
  };

  const label = pending ? "Saving hike" : saved ? "Remove saved hike" : "Save hike";

  return (
    <button
      type="button"
      className={`favorite-btn ${saved ? "is-saved" : ""}`}
      onClick={handleClick}
      disabled={pending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      <i className={`bx ${saved ? "bxs-heart" : "bx-heart"}`} aria-hidden="true" />
      <span>{pending ? "Saving…" : saved ? "Saved" : "Save hike"}</span>
    </button>
  );
}
