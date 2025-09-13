"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createServerPB,
  setAuthCookie,
  clearAuthCookieStore,
} from "@/lib/pocketbase/server";

export type AuthState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !validateEmail(email)) {
    return { ok: false, fieldErrors: { email: "Enter a valid email" } };
  }
  if (!password || password.length < 8) {
    return {
      ok: false,
      fieldErrors: { password: "Password must be at least 8 characters" },
    };
  }

  try {
    const pb = createServerPB();
    await pb.collection("users").authWithPassword(email, password);
    await setAuthCookie(pb);
  } catch {
    return { ok: false, error: "Invalid email or password." };
  }

  redirect("/account");
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Name is required";
  if (!email || !validateEmail(email))
    fieldErrors.email = "Enter a valid email";
  if (!password || password.length < 8)
    fieldErrors.password = "Password must be at least 8 characters";
  if (password !== passwordConfirm)
    fieldErrors.passwordConfirm = "Passwords do not match";

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  try {
    const pb = createServerPB();
    await pb.collection("users").create({
      email,
      password,
      passwordConfirm,
      name,
    });
    await pb.collection("users").authWithPassword(email, password);
    await setAuthCookie(pb);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create account.";
    return { ok: false, error: message };
  }

  redirect("/account");
}

export async function logoutAction() {
  await clearAuthCookieStore();
  redirect("/");
}
