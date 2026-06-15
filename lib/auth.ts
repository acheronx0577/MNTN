import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerPB, type UserRecord } from "@/lib/pocketbase/server";

export const getCurrentUser = cache(async (): Promise<UserRecord | null> => {
  try {
    const pb = await getServerPB();
    if (!pb.authStore.isValid) return null;
    return pb.authStore.record as UserRecord;
  } catch {
    return null;
  }
});

export async function requireAuth(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
