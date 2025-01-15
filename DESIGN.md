---
name: MNTN
description: A cinematic outdoor hiking guide — dark alpine atmosphere with gold trail accents
colors:
  bg-deep: "#0b1d26"
  bg-glass: "#0b1d2640"
  accent-gold: "#fbd784"
  text-primary: "#ffffff"
  text-muted: "#5e6282"
  text-on-dark: "#ffffff"
  border-subtle: "#ffffff33"
  counter-fade: "#ffffff33"
  progress-track: "#ffffff33"
rounded:
  sm: "5px"
  md: "8px"
  lg: "20px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "80px"
typography:
  display:
    fontFamily: "Bentham, Georgia, serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "normal"
  label:
    fontFamily: "Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "6px"
  body:
    fontFamily: "Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "normal"
  title:
    fontFamily: "Bentham, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "normal"
components:
  button-primary:
    backgroundColor: "{colors.accent-gold}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "#e5c56f"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  input-field:
    backgroundColor: "#0b1d2680"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
  card-auth:
    backgroundColor: "#0b1d26cc"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "40px 32px"
---

## Overview

MNTN is a **cinematic alpine** outdoor brand. The interface feels like standing on a mountain ridge at dusk: deep navy-black backgrounds, expansive photography, and sparse gold wayfinding accents. Typography pairs editorial serif headlines (Bentham) with utilitarian sans body copy (Roboto). New screens — auth, contact, account — must feel like extensions of the landing page, not a separate admin UI.

**Creative north star:** *The Summit Guide* — confident, adventurous, uncluttered.

**Anti-references:** Bright SaaS dashboards, purple gradients, rounded bubbly cards, dense form-heavy layouts without breathing room.

## Colors

| Token | Hex | Role |
|---|---|---|
| `bg-deep` | `#0b1d26` | Page background, auth shells |
| `accent-gold` | `#fbd784` | CTAs, subtitles, links, focus accents |
| `text-primary` | `#ffffff` | Headlines, nav, form labels |
| `text-muted` | `#5e6282` | Secondary copy (legacy body default) |
| `border-subtle` | `rgba(255,255,255,0.2)` | Dividers, input borders |

Gold subtitles use an inline `::before` gold rule (40–72px wide). Hero and section gradients fade from transparent into `bg-deep`.

## Typography

- **Display (Bentham):** Hero titles, page headings, account welcome
- **Label (Roboto, uppercase, 6px tracking):** Section subtitles, form section headers
- **Body (Roboto):** Paragraphs, form helper text, footer links

Scale jumps are dramatic on desktop (hero up to 88px). Mobile stays readable at 40px hero / 14px body.

## Elevation

MNTN uses **atmospheric layering**, not Material shadows:

- **Glass header:** `backdrop-filter: blur(20px)` + `rgba(11,29,38,0.25)` on scroll
- **Auth/contact cards:** Semi-opaque `bg-deep` panels with `1px` gold-tinted border
- **Parallax imagery:** Hero sky/mountains/man stack with scroll-driven depth
- **Fixed side slider:** Progress bar on `rgba(255,255,255,0.2)` track

Focus rings: `2px solid #fbd784` with `outline-offset: 2px`.

## Components

### Subtitle rule
Gold label with leading horizontal line — reuse `.hero-subtitle` / `.content-subtitle` pattern.

### Primary button
Gold fill, dark text, bold Roboto. Used for form submit and main CTAs.

### Ghost / text link
White or gold text with arrow icon; gap increases on hover (content-action pattern).

### Form field
Dark translucent input on `#0b1d26`, white text, gold border on focus. Labels: uppercase, small, gold or white.

### Auth card
Max-width 440px, centered, subtle top gold gradient line, logo above title.

### Account shell
Tab nav: Profile | Favorites | Notes. Active tab gold underline. Content area uses `.container` padding.

### OAuth buttons
Outlined white border, full width, provider icon + label. Divider: "or continue with email".

## Do's and Don'ts

**Do**
- Use full-bleed dark backgrounds on auth/contact/account pages
- Keep generous vertical spacing (32px+ between form fields)
- Pre-fill contact form when user is logged in
- Respect `prefers-reduced-motion` — disable Lenis/GSAP entrance on reduced motion

**Don't**
- Introduce Tailwind or a second color system
- Use light/white page backgrounds on new routes
- Place forms in narrow columns without mobile full-width support
- Send email before PocketBase save on contact submissions
