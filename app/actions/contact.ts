"use server";

import { getServerPB } from "@/lib/pocketbase/server";
import { getCurrentUser } from "@/lib/auth";
import { getResend } from "@/lib/resend";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/security/escape-html";
import { checkRateLimit, rateLimitMessage, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/lib/security/rate-limit";
import type { ContactResult } from "@/lib/types";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function saveContactMessage(
  pb: Awaited<ReturnType<typeof getServerPB>>,
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    user?: string;
  }
) {
  const base = { ...data, status: "new" as const };

  try {
    return await pb.collection("contact_messages").create({
      ...base,
      email_sent: false,
    });
  } catch {
    // PocketBase treats required bool `false` as blank on some hosts.
    try {
      return await pb.collection("contact_messages").create(base);
    } catch (inner) {
      console.error("Contact save retry failed:", inner);
      return await pb.collection("contact_messages").create({
        ...base,
        email_sent: true,
      });
    }
  }
}

export async function submitContactAction(
  _prev: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  const limit = await checkRateLimit("contact", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return { ok: false, error: rateLimitMessage(limit.retryAfterSec) };
  }

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
    const record = await saveContactMessage(pb, {
      name,
      email,
      subject,
      message,
      ...(user ? { user: user.id } : {}),
    });
    recordId = record.id;
  } catch (err) {
    console.error("Contact save failed:", err);
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
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p>${escapeHtmlWithBreaks(message)}</p>
      `,
    });

    return { ok: true };
  } catch (err) {
    console.error("Resend failed, message saved:", recordId, err);
    return { ok: true, partial: true };
  }
}
