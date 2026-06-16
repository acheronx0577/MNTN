import PocketBase, { ClientResponseError } from "pocketbase";

const COLLECTION_NAME = "site_stats";

const SITE_STATS_COLLECTION = {
  name: COLLECTION_NAME,
  type: "base" as const,
  listRule: "",
  viewRule: "",
  createRule: null,
  updateRule: null,
  deleteRule: null,
  fields: [
    { name: "key", type: "text", required: true, unique: true },
    { name: "views", type: "number", required: false, min: 0 },
  ],
};

function isNotFound(error: unknown) {
  return error instanceof ClientResponseError && error.status === 404;
}

let ensurePromise: Promise<void> | null = null;

async function ensureSiteStatsCollectionOnce(pb: PocketBase): Promise<void> {
  try {
    const existing = await pb.collections.getOne(COLLECTION_NAME);
    if (existing.listRule !== "" || existing.viewRule !== "") {
      await pb.collections.update(COLLECTION_NAME, {
        listRule: "",
        viewRule: "",
      });
    }
    return;
  } catch (error) {
    if (!isNotFound(error)) {
      throw error;
    }
  }

  try {
    await pb.collections.create(SITE_STATS_COLLECTION);
  } catch {
    await pb.collections.getOne(COLLECTION_NAME);
  }
}

/** Creates `site_stats` on PocketBase Cloud when admin credentials are configured. */
export async function ensureSiteStatsCollection(pb: PocketBase): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = ensureSiteStatsCollectionOnce(pb).catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  await ensurePromise;
}
