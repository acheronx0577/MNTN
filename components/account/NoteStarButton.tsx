"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleNoteStarAction } from "@/app/actions/notes";

type NoteStarButtonProps = {
  noteId: string;
  initialStarred?: boolean;
  label?: string;
};

export default function NoteStarButton({
  noteId,
  initialStarred = false,
  label,
}: NoteStarButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [starred, setStarred] = useState(initialStarred);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStarred(initialStarred);
  }, [initialStarred]);

  const handleClick = () => {
    setError(null);

    startTransition(async () => {
      const previous = starred;
      const result = await toggleNoteStarAction(noteId);

      if (result.ok && typeof result.starred === "boolean") {
        setStarred(result.starred);
        router.refresh();
        return;
      }

      setStarred(previous);
      setError(
        !result.ok && result.error
          ? result.error
          : "Could not save to favorites."
      );
    });
  };

  return (
    <div className="note-star-wrap">
      <button
        type="button"
        className={`note-star-btn ${starred ? "is-starred" : ""}`}
        onClick={handleClick}
        disabled={pending}
        aria-label={
          starred ? "Remove note from favorites" : "Add note to favorites"
        }
        title={starred ? "Remove from favorites" : "Add to favorites"}
      >
        <i
          className={`bx ${starred ? "bxs-star" : "bx-star"}`}
          aria-hidden="true"
        />
        {label ? <span>{pending ? "Saving…" : label}</span> : null}
      </button>
      {error ? <span className="note-star-btn__error">{error}</span> : null}
    </div>
  );
}
