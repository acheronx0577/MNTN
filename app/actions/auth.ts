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
