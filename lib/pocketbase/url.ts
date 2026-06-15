export function getPocketBaseUrl() {
  return process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";
}

export function getPocketBaseReachabilityError() {
  const url = getPocketBaseUrl();
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
      "PocketBase Cloud Admin api url (HTTPS), then redeploy."
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
    "instance is running, the Admin api url is correct in Vercel, and " +
    "you redeployed after changing env vars."
  );
}
