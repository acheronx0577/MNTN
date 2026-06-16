"use client";

import { useActionState } from "react";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { updateProfileAction } from "@/app/actions/profile";
import type { ActionResult } from "@/lib/types";
import type { UserRecord } from "@/lib/pocketbase/server";

type ProfileFormProps = {
  user: UserRecord;
};

const initial: ActionResult = { ok: false };

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initial
  );

  return (
    <div className="account-panel">
      <h2 className="account-section-title">Your profile</h2>
      {state.ok && (
        <div className="form-alert form-alert--success">
          Profile updated successfully.
        </div>
      )}
      {!state.ok && state.error && (
        <div className="form-alert form-alert--error">{state.error}</div>
      )}
      <form action={formAction}>
        <FormField
          id="name"
          label="Name"
          name="name"
          defaultValue={user.name ?? ""}
          required
        />
        <FormField
          id="bio"
          label="Bio"
          name="bio"
          as="textarea"
          rows={4}
          defaultValue={user.bio ?? ""}
        />
        <FormField
          id="avatar"
          label="Avatar URL"
          name="avatar"
          type="url"
          defaultValue={user.avatar ?? ""}
        />
        <SubmitButton pending={pending}>Save profile</SubmitButton>
      </form>
    </div>
  );
}
