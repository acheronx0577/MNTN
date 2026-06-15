function normalizePocketBaseUrl(raw: string) {
  let url = raw.trim().replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

export function getPocketBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";
  return normalizePocketBaseUrl(raw);
}

export function getPocketBaseReachabilityError() {
  const url = getPocketBaseUrl();
  const raw = (process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "").trim();
  const hadApiSuffix = /\/api\/?$/i.test(raw);
  const isBrowser = typeof window !== "undefined";
  const onLocalApp =
    isBrowser &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const pbIsLocal =
    url.includes("127.0.0.1") || url.includes("localhost");

  if (isBrowser && !onLocalApp && pbIsLocal) {
    return (
      "PocketBase URL is still set to localhost. In Vercel → Settings → " +
      "Environment Variables, set NEXT_PUBLIC_POCKETBASE_URL to your " +
      "PocketBase Cloud host (HTTPS, no /api suffix), then redeploy."
    );
  }

  if (hadApiSuffix) {
    return (
      "NEXT_PUBLIC_POCKETBASE_URL must be the PocketBase host only, without " +
      `/api (use ${url}, not ${raw}). Update Vercel and redeploy.`
    );
  }

  if (onLocalApp) {
    return (
      `Cannot reach PocketBase at ${url}. Run npm run dev:all and confirm ` +
      `${url}/api/health works.`
    );
  }

  return (
    `Cannot reach PocketBase at ${url}. Confirm your PocketBase Cloud ` +
    "instance is running, the URL is correct in Vercel (no /api suffix), " +
    "and you redeployed after changing env vars."
  );
}
