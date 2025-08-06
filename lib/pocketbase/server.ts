import PocketBase, { type AuthRecord } from "pocketbase";
import { cookies } from "next/headers";

export const PB_COOKIE = "pb_auth";

export function createServerPB() {
  return new PocketBase(
    process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090"
  );
}

export async function getServerPB() {
  const pb = createServerPB();
  const cookieStore = await cookies();
  const cookie = cookieStore.get(PB_COOKIE);

  if (cookie?.value) {
    pb.authStore.loadFromCookie(`${PB_COOKIE}=${cookie.value}`);
  }

  return pb;
}

export function exportAuthCookie(pb: PocketBase) {
  return pb.authStore.exportToCookie({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function setAuthCookie(pb: PocketBase) {
  const cookieStore = await cookies();
  const header = exportAuthCookie(pb);
  const value = header.split(";")[0].split("=").slice(1).join("=");
  cookieStore.set(PB_COOKIE, decodeURIComponent(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAuthCookieStore() {
  const cookieStore = await cookies();
  cookieStore.set(PB_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function clearAuthCookie() {
  return `${PB_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export type UserRecord = AuthRecord & {
  name?: string;
  avatar?: string;
  bio?: string;
};
