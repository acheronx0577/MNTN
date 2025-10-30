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

  return (
    <button
      type="button"
      className={`favorite-btn ${saved ? "is-saved" : ""}`}
      onClick={handleClick}
      disabled={pending}
    >
      {pending ? "Saving…" : saved ? "Saved" : "Save hike"}
    </button>
  );
}
