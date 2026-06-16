#!/usr/bin/env node
/**
 * Import site_stats into PocketBase (Cloud or local) and seed the global record.
 * Usage: npm run import:site-stats
 */

import PocketBase from "pocketbase";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const importPath = resolve(root, "pocketbase/site_stats.import.json");
const GLOBAL_KEY = "global";

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const pbUrl = (process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL?.trim();
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error(
    "Set POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD in .env.local (or shell)."
  );
  process.exit(1);
}

const pb = new PocketBase(pbUrl);
pb.autoCancellation(false);

console.log("PocketBase URL:", pbUrl);
console.log("Import file:", importPath);
console.log("");

await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
console.log("OK: Admin login");

let collectionExists = false;
try {
  await pb.collections.getOne("site_stats");
  collectionExists = true;
  console.log("OK: site_stats collection already exists");
} catch {
  collectionExists = false;
}

if (!collectionExists) {
  const importData = JSON.parse(readFileSync(importPath, "utf8"));
  await pb.collections.import(importData, false);
  console.log("OK: Imported site_stats collection");
} else {
  await pb.collections.update("site_stats", {
    listRule: "",
    viewRule: "",
  });
  console.log("OK: Ensured public List/View rules on site_stats");
}

try {
  await pb.collection("site_stats").getFirstListItem(`key = "${GLOBAL_KEY}"`);
  console.log(`OK: "${GLOBAL_KEY}" record already exists`);
} catch {
  await pb.collection("site_stats").create({
    key: GLOBAL_KEY,
    views: 0,
  });
  console.log(`OK: Created "${GLOBAL_KEY}" record (views: 0)`);
}

const record = await pb.collection("site_stats").getFirstListItem(
  `key = "${GLOBAL_KEY}"`
);
console.log("");
console.log(`Done. Website views counter ready — current count: ${record.views ?? 0}`);
