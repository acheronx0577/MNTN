"use client";

import { useActionState } from "react";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { submitContactAction } from "@/app/actions/contact";
import type { ContactResult } from "@/lib/types";

type ContactFormProps = {
  defaultName?: string;
  defaultEmail?: string;
};

const initial: ContactResult = { ok: false };

export default function ContactForm({
  defaultName = "",
  defaultEmail = "",
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initial
  );

  if (state.ok) {
    return (
      <div className="contact-form-wrap">
        <div className="form-alert form-alert--success">
          {state.partial
            ? "Message received! We'll follow up soon."
            : "Thanks for reaching out — we'll get back to you shortly."}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-wrap">
      {!state.ok && state.error && (
        <div className="form-alert form-alert--error">{state.error}</div>
      )}
      <form action={formAction} className="account-panel">
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <FormField
          id="name"
          label="Name"
          name="name"
          defaultValue={defaultName}
          required
        />
        <FormField
          id="email"
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          required
        />
        <FormField
          id="subject"
          label="Subject"
          name="subject"
          required
        />
        <FormField
          id="message"
          label="Message"
          name="message"
          as="textarea"
          rows={6}
          required
        />
        <SubmitButton pending={pending}>Send message</SubmitButton>
      </form>
    </div>
  );
}
