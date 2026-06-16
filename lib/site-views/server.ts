import { createServerPB } from "@/lib/pocketbase/server";
import { getAdminPB } from "@/lib/pocketbase/admin";
import { ensureSiteStatsCollection } from "@/lib/site-views/ensure";

const GLOBAL_KEY = "global";

export type SiteViewsResult =
  | { ok: true; count: number }
  | { ok: false; reason: "missing_config" | "upstream"; error?: string };

async function getGlobalRecordPublic() {
  const pb = createServerPB();
  return pb.collection("site_stats").getFirstListItem(`key = "${GLOBAL_KEY}"`);
}

async function getGlobalRecordAdmin(pb: NonNullable<Awaited<ReturnType<typeof getAdminPB>>>) {
  await ensureSiteStatsCollection(pb);

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

function parseViews(record: { views?: unknown } | Record<string, unknown>) {
  const count = Number((record as { views?: unknown }).views);
  return Number.isFinite(count) && count >= 0 ? count : 0;
}

export async function readSiteViewCount(): Promise<SiteViewsResult> {
  try {
    const record = await getGlobalRecordPublic();
    return { ok: true, count: parseViews(record) };
  } catch (error) {
    const pb = await getAdminPB();
    if (!pb) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, reason: "upstream", error: message };
    }

    try {
      const record = await getGlobalRecordAdmin(pb);
      return { ok: true, count: parseViews(record) };
    } catch (adminError) {
      const message =
        adminError instanceof Error ? adminError.message : String(adminError);
      return { ok: false, reason: "upstream", error: message };
    }
  }
}

export async function bumpSiteViewCount(): Promise<SiteViewsResult> {
  const pb = await getAdminPB();
  if (!pb) {
    return {
      ok: false,
      reason: "missing_config",
      error:
        "Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD in your environment to track website views.",
    };
  }

  try {
    const record = await getGlobalRecordAdmin(pb);
    const next = parseViews(record) + 1;

    const updated = await pb.collection("site_stats").update(record.id, {
      views: next,
    });

    return { ok: true, count: parseViews(updated) || next };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: "upstream", error: message };
  }
}
