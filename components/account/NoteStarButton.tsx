"use client";

import { useState, useTransition } from "react";
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
  const [pending, startTransition] = useTransition();
  const [starred, setStarred] = useState(initialStarred);

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleNoteStarAction(noteId);
      if (result.ok && typeof result.starred === "boolean") {
        setStarred(result.starred);
      }
    });
  };

  return (
    <button
      type="button"
      className={`note-star-btn ${starred ? "is-starred" : ""}`}
      onClick={handleClick}
      disabled={pending}
      aria-label={starred ? "Remove note from favorites" : "Add note to favorites"}
      title={starred ? "Remove from favorites" : "Add to favorites"}
    >
      <i className={`bx ${starred ? "bxs-star" : "bx-star"}`} aria-hidden="true" />
      {label ? <span>{pending ? "Saving…" : label}</span> : null}
    </button>
  );
}
