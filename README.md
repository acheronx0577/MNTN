## Demo

[MNTN - Landing Page](https://yt-pixelperfectlabs.github.io/MNTN-Landing-Page-UI/)

## Preview

![MNTN - Landing Page](./public/images/MNTN.png)

## Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **CSS** — custom tokens and components ([DESIGN.md](./DESIGN.md))
- **GSAP** + **Lenis** — landing page scroll animations
- **Boxicons** — icons

### Backend & data
- **PocketBase** — auth, hikes, favorites, notes, contact messages
- **Docker** — local PocketBase (`npm run dev:pb`)
- **PocketBase Cloud** — production backend option

### Auth & email
- **PocketBase Auth** — email/password + **Google** / **GitHub** OAuth2
- **Resend** — contact form email notifications (after PocketBase save)

### Deploy
- **Vercel** — Next.js frontend ([demo](https://mntn-lemon.vercel.app/))

## Features

- Landing page with scroll animations and **left-side site metrics** (views, CPU/RAM, GitHub link)
- User auth (email/password + Google/GitHub OAuth)
- Profile and trail notes
- Contact form (PocketBase first, then Resend)
- Design system documented in [DESIGN.md](./DESIGN.md)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your PocketBase URL, Resend keys, and admin credentials for site view counts.

For **website view counts**, see **[pocketbase/SITE_VIEWS_SETUP.md](./pocketbase/SITE_VIEWS_SETUP.md)** (full step-by-step for PocketBase Cloud + Vercel).

Quick checklist:

1. PocketBase Cloud → collection `site_stats` with fields `key` + `views`, record `global` / `0`, **List + View rules empty** (public)
2. Vercel env: `POCKETBASE_ADMIN_EMAIL`, `POCKETBASE_ADMIN_PASSWORD`, `NEXT_PUBLIC_POCKETBASE_URL`
3. Redeploy Vercel after adding env vars
4. Verify: `npm run verify:site-views`

Restart local PocketBase after pulling so migrations apply (`npm run pb:restart`).

### 3. Start PocketBase

```bash
npm run dev:pb
```

On first run, create a superuser (must use `--dir=/pb_data` in Docker):

```bash
npm run pb:superuser -- you@example.com yourpassword
```

Or directly:

```bash
docker compose -f pocketbase/docker-compose.yml exec pocketbase /usr/local/bin/pocketbase --dir=/pb_data superuser upsert you@example.com yourpassword
```

Admin UI: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

Configure OAuth in **Collections → users → Options → OAuth2** (Google, GitHub).

### 4. Start everything (one command)

Make sure **Docker Desktop** is running, then:

```bash
npm run dev:all
```

Starts PocketBase in the background and Next.js at [http://localhost:3000](http://localhost:3000).

Stop PocketBase when done: `npm run dev:pb:stop`

### Or start separately

```bash
npm run dev:pb    # PocketBase only (foreground logs)
npm run dev       # Next.js only
```

### Production build

```bash
npm run build
npm start
```

## Deploy to Vercel

The **Next.js app** deploys to Vercel. **PocketBase does not** — host it separately ([PocketBase Cloud](https://pocketbase.io/docs/going-to-production/), Fly.io, VPS, etc.) and point the frontend at it.

### 1. Import repo

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `MNTN-Landing-Page-UI-main` from GitHub
3. Framework preset: **Next.js** (auto-detected)
4. Deploy (build command: `npm run build`, output: default)

### 2. Environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Example | Notes |
|----------|---------|--------|
| `NEXT_PUBLIC_POCKETBASE_URL` | `https://k1y1g4i89co8bd1.ba7w.pocketbasecloud.com` | PocketBase **host only** (HTTPS, no `/api` suffix) |
| `RESEND_API_KEY` | `re_...` | Server-only |
| `RESEND_FROM_EMAIL` | `MNTN <hello@yourdomain.com>` | Verified sender in Resend |
| `CONTACT_TO_EMAIL` | `you@example.com` | Inbox for contact form |

Redeploy after adding variables.

### 3. PocketBase (production)

- Run migrations from `pocketbase/pb_migrations/` (local Docker applies them on start; restart with `npm run pb:restart`)
- **Collections → users → Options → OAuth2**: enable Google/GitHub; set OAuth redirect to your PocketBase URL, e.g. `https://pb.yourdomain.com/api/oauth2-redirect`
- Allow your Vercel site origin if needed for browser OAuth (PocketBase CORS / trusted origins)

### 4. Custom domain (optional)

Vercel → **Domains** → add `yourdomain.com`. Update OAuth redirect URLs in Google/GitHub and PocketBase to match production URLs.

## Design

- [DESIGN.md](./DESIGN.md) — visual tokens and component rules
- [docs/design-system.mmd](./docs/design-system.mmd) — token/component diagram
- [docs/design-pages.mmd](./docs/design-pages.mmd) — page map and flows

## Contact form pipeline

1. Validate + save to PocketBase `contact_messages`
2. Send notification via Resend (only if step 1 succeeds)
3. Mark `email_sent: true` on success

## Tutorial

[Pixel Perfect Labs on YouTube](https://www.youtube.com/@PixelPerfectLabs)
