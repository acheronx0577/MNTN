"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { getCurrentUser } from "@/lib/auth";
import { getResend } from "@/lib/resend";
import type { ContactResult } from "@/lib/types";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitContactAction(
  _prev: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) {
    return { ok: false, error: "Submission rejected." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || name.length > 100)
    return { ok: false, error: "Enter a valid name." };
  if (!email || !validateEmail(email))
    return { ok: false, error: "Enter a valid email." };
  if (!subject || subject.length > 200)
    return { ok: false, error: "Enter a subject." };
  if (!message || message.length > 5000)
    return { ok: false, error: "Enter a message." };

  const user = await getCurrentUser();
  const pb = await getServerPB();

  let recordId: string;

  try {
    const record = await pb.collection("contact_messages").create({
      name,
      email,
      subject,
      message,
      status: "new",
      email_sent: false,
      ...(user ? { user: user.id } : {}),
    });
    recordId = record.id;
  } catch {
    return { ok: false, error: "Could not save your message. Try again later." };
  }

  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return { ok: true, partial: true };
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ?? "MNTN <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `[MNTN Contact] ${subject}`,
      html: `
        <h2>New contact message</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    try {
      await pb.collection("contact_messages").update(recordId, {
        email_sent: true,
      });
    } catch {
      // record saved and email sent — non-critical update failure
    }

    return { ok: true };
  } catch (err) {
    console.error("Resend failed, message saved:", recordId, err);
    return { ok: true, partial: true };
  }
}
