## Demo

[MNTN - Landing Page](https://yt-pixelperfectlabs.github.io/MNTN-Landing-Page-UI/)

## Preview

![MNTN - Landing Page](./public/images/MNTN.png)

## Stack

- **Next.js 15** (App Router)
- **PocketBase** — auth, hikes, favorites, notes, contact messages
- **Resend** — contact form email notifications (after PocketBase save)
- **GSAP + Lenis** — landing page animations

## Features

- Landing page with scroll animations
- User auth (email/password + Google/GitHub OAuth)
- Profile, favorites, and trail notes
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

Edit `.env.local` with your PocketBase URL and Resend keys.

### 3. Start PocketBase

```bash
npm run dev:pb
```

On first run, create a superuser:

```bash
docker exec -it <container> /usr/local/bin/pocketbase superuser upsert you@example.com yourpassword
```

Admin UI: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

Configure OAuth providers in **Settings → Auth providers** (Google, GitHub).

### 4. Start Next.js

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

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
