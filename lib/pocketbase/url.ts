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
