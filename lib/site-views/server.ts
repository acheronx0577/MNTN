import { getAdminPB } from "@/lib/pocketbase/admin";

const GLOBAL_KEY = "global";

export type SiteViewsResult =
  | { ok: true; count: number }
  | { ok: false; reason: "missing_config" | "upstream"; error?: string };

async function getGlobalRecord(pb: NonNullable<Awaited<ReturnType<typeof getAdminPB>>>) {
  try {
    return await pb.collection("site_stats").getFirstListItem(`key = "${GLOBAL_KEY}"`);
  } catch {
    const created = await pb.collection("site_stats").create({
      key: GLOBAL_KEY,
      views: 0,
    });
    return created;
  }
}

export async function readSiteViewCount(): Promise<SiteViewsResult> {
  const pb = await getAdminPB();
  if (!pb) {
    return { ok: false, reason: "missing_config" };
  }

  try {
    const record = await getGlobalRecord(pb);
    const count = Number(record.views);
    return {
      ok: true,
      count: Number.isFinite(count) && count >= 0 ? count : 0,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: "upstream", error: message };
  }
}

export async function bumpSiteViewCount(): Promise<SiteViewsResult> {
  const pb = await getAdminPB();
  if (!pb) {
    return { ok: false, reason: "missing_config" };
  }

  try {
    const record = await getGlobalRecord(pb);
    const current = Number(record.views);
    const next = (Number.isFinite(current) && current >= 0 ? current : 0) + 1;

    const updated = await pb.collection("site_stats").update(record.id, {
      views: next,
    });

    return { ok: true, count: Number(updated.views) || next };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: "upstream", error: message };
  }
}
