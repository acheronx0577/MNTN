# Website view counter — PocketBase setup

The left **Site metrics** panel reads view counts from a PocketBase collection called `site_stats`.  
Each new browser session adds **+1** to the `global` record.

You need **admin credentials on Vercel**. The app **auto-creates** `site_stats` (collection + `global` record + public read rules) on the first page visit that increments views.

Manual PocketBase setup is only needed if you cannot set admin env vars on the server.

### Option A — One-command import (recommended for Cloud)

1. In `.env.local`, point at your Cloud instance and admin credentials:

```bash
NEXT_PUBLIC_POCKETBASE_URL=https://YOUR-INSTANCE.ba7w.pocketbasecloud.com
POCKETBASE_ADMIN_EMAIL=your-cloud-admin@email.com
POCKETBASE_ADMIN_PASSWORD=your-cloud-admin-password
```

2. Run:

```bash
npm run import:site-stats
```

This imports `pocketbase/site_stats.import.json`, sets public read rules, and creates the `global` record.

### Option B — Paste JSON in PocketBase admin

1. Cloud admin → **Settings** → **Import collections**
2. Paste the contents of `pocketbase/site_stats.import.json`
3. Open `site_stats` → **New record** → `key` = `global`, `views` = `0`

---

## PocketBase Cloud (production)

### Step 1 — Open admin

Go to your PocketBase Cloud admin, e.g.:

`https://YOUR-INSTANCE.ba7w.pocketbasecloud.com/_/`

Log in with your **PocketBase Cloud admin** email and password (not your MNTN app user).

### Step 2 — Vercel environment variables

In [Vercel](https://vercel.com) → your project → **Settings** → **Environment Variables**, add:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_POCKETBASE_URL` | `https://YOUR-INSTANCE.ba7w.pocketbasecloud.com` | No `/api` at the end |
| `POCKETBASE_ADMIN_EMAIL` | Your PocketBase **admin** email | Same login as Step 1 |
| `POCKETBASE_ADMIN_PASSWORD` | Your PocketBase **admin** password | Server-only secret |

Apply to **Production** (and Preview if you test preview URLs).

### Step 3 — Redeploy

**Deployments** → **Redeploy** the latest deployment (or push a commit).

Env vars only apply after a new deploy.

On first load, the app creates `site_stats` automatically (no manual collection step).

### Step 4 — Test

1. Open your live site in a **private/incognito** window
2. Expand the **left metrics panel** (chevron on the left edge)
3. **Website views** should show `1` or higher after the page loads

To test the API directly (replace URL):

```bash
curl -s https://YOUR-SITE.vercel.app/api/site-views
curl -s -X POST https://YOUR-SITE.vercel.app/api/site-views
curl -s https://YOUR-SITE.vercel.app/api/system-stats
```

Expected:

- `GET /api/site-views` → `{"ok":true,"count":0}` (or current count)
- `POST /api/site-views` → `{"ok":true,"count":1}` (increments)
- `GET /api/system-stats` → `"viewCount":1` (or higher)

If `POST` returns `503` with `missing_config`, admin env vars are missing on Vercel.

If `GET` fails with 404, admin env vars may be missing or wrong — the collection is created on first successful admin request.

---

## Local Docker (development)

### 1. Restart PocketBase (runs migrations)

```bash
npm run pb:restart
```

This creates `site_stats` and the `global` record automatically.

### 2. Set `.env.local`

```bash
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@mntn.local
POCKETBASE_ADMIN_PASSWORD=your_local_admin_password
```

Create the admin user if needed:

```bash
npm run pb:superuser -- admin@mntn.local yourpassword
```

### 3. Verify locally

```bash
node pocketbase/scripts/verify-site-views.mjs
npm run dev
```

Open http://localhost:3000, expand the left panel, hard-refresh once.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Shows **—** (dash) | Admin env missing on Vercel, or `site_stats` missing |
| Stuck at **0** | `POST /api/site-views` failing — check admin password on Vercel |
| Works locally, not on Vercel | Cloud collection not created; env vars not redeployed |
| `Collection not found` | Set admin env on Vercel and redeploy; open site once in incognito |
| Count never increases | Use incognito for each test (one count per browser session) |

In PocketBase admin → **Logs**, check for failed API requests when you load the site.
