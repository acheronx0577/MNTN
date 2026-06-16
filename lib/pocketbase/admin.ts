import PocketBase from "pocketbase";
import { createServerPB } from "./server";

export async function getAdminPB(): Promise<PocketBase | null> {
  const email = process.env.POCKETBASE_ADMIN_EMAIL?.trim();
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const pb = createServerPB();

  try {
    await pb.collection("_superusers").authWithPassword(email, password);
    return pb;
  } catch {
    return null;
  }
}
