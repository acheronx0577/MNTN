"use client";

import { useActionState } from "react";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { createNoteAction } from "@/app/actions/notes";
import type { ActionResult } from "@/lib/types";

const initial: ActionResult = { ok: false };

type NoteFormProps = {
  hikes?: { id: string; title: string }[];
  defaultTitle?: string;
  defaultBody?: string;
  defaultHike?: string;
  action?: (
    prev: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
  submitLabel?: string;
};

export default function NoteForm({
  hikes = [],
  defaultTitle = "",
  defaultBody = "",
  defaultHike = "",
  action = createNoteAction,
  submitLabel = "Create note",
}: NoteFormProps) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="account-panel">
      {!state.ok && state.error && (
        <div className="form-alert form-alert--error">{state.error}</div>
      )}
      {state.ok && (
        <div className="form-alert form-alert--success">Note saved.</div>
      )}
      <FormField
        id="title"
        label="Title"
        name="title"
        defaultValue={defaultTitle}
        required
      />
      <FormField
        id="body"
        label="Note"
        name="body"
        as="textarea"
        rows={8}
        defaultValue={defaultBody}
        required
      />
      {hikes.length > 0 && (
        <div className="form-field">
          <label htmlFor="hike">Linked hike (optional)</label>
          <select
            id="hike"
            name="hike"
            defaultValue={defaultHike}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "rgba(11,29,38,0.6)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-primary)",
            }}
          >
            <option value="">None</option>
            {hikes.map((h) => (
              <option key={h.id} value={h.id}>
                {h.title}
              </option>
            ))}
          </select>
        </div>
      )}
      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
    </form>
  );
}
