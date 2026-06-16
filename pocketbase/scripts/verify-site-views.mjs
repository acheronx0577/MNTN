#!/usr/bin/env node
/**
 * Verify website view counter setup.
 * Usage: node pocketbase/scripts/verify-site-views.mjs
 * Loads .env.local via Node --env-file if available, or set vars in shell.
 */

import PocketBase from "pocketbase";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

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

console.log("PocketBase URL:", pbUrl);
console.log("Admin email:", adminEmail ?? "(not set)");
console.log("Admin password:", adminPassword ? "(set)" : "(not set)");
console.log("");

const pb = new PocketBase(pbUrl);
pb.autoCancellation(false);

let failed = false;

function fail(msg) {
  console.error("FAIL:", msg);
  failed = true;
}

function ok(msg) {
  console.log("OK:", msg);
}

// Health
try {
  const health = await fetch(`${pbUrl}/api/health`);
  if (health.ok) ok("PocketBase health");
  else fail(`PocketBase health HTTP ${health.status}`);
} catch (e) {
  fail(`Cannot reach PocketBase: ${e.message}`);
}

// Public read site_stats
try {
  const record = await pb
    .collection("site_stats")
    .getFirstListItem('key = "global"');
  ok(`Public read site_stats — views: ${record.views ?? 0}`);
} catch (e) {
  fail(
    `Public read site_stats failed: ${e.message}\n` +
      "  → Create collection site_stats, record key=global, List+View rules empty."
  );
}

// Admin auth + bump
if (!adminEmail || !adminPassword) {
  fail(
    "POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD not set.\n" +
      "  → Add to .env.local (local) or Vercel env (production)."
  );
} else {
  try {
    await pb.collection("_superusers").authWithPassword(adminEmail, adminPassword);
    ok("Admin login");
  } catch {
    fail("Admin login failed — wrong email/password or not a superuser.");
  }

  if (pb.authStore.isValid) {
    try {
      const record = await pb
        .collection("site_stats")
        .getFirstListItem('key = "global"');
      const next = (Number(record.views) || 0) + 1;
      const updated = await pb.collection("site_stats").update(record.id, {
        views: next,
      });
      ok(`Admin update views → ${updated.views}`);
    } catch (e) {
      fail(`Admin update failed: ${e.message}`);
    }
  }
}

console.log("");
if (failed) {
  console.log("See pocketbase/SITE_VIEWS_SETUP.md for full setup steps.");
  process.exit(1);
}

console.log("All checks passed. Restart npm run dev and hard-refresh the home page.");
