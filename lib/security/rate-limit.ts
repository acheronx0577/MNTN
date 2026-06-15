import { headers } from "next/headers";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

async function getClientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return headerStore.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(
  scope: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  const ip = await getClientIp();
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function rateLimitMessage(retryAfterSec?: number) {
  if (!retryAfterSec || retryAfterSec <= 0) {
    return "Too many attempts. Try again later.";
  }
  return `Too many attempts. Try again in ${retryAfterSec} seconds.`;
}
