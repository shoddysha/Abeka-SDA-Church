# Abeka SDA Church Website — Rebuilt & Modernized

This is a full rebuild of the original Abeka SDA Church website: same church,
same content, same identity — new, modern, responsive design.

## How to use it
Open `index.html` in any browser, or upload the whole folder to any static
web host (Netlify, GitHub Pages, cPanel, etc). No build step, no dependencies
to install — it's plain HTML/CSS/JS.

```
index.html          Home
about.html           About Us (story, mission, beliefs, leadership, timeline)
bible.html           Bible Explorer (verse search, popular verses, stories)
ay.html              Youth Ministry hub (all clubs overview)
adventurers.html     Adehyɛ Adventurer Club (ages 4–9)
pathfinders.html     Royal Pathfinder Club (ages 10–15)
senior.html          Royal Ambassador / Senior Youth (ages 16+)
event.html           Sermons & church events
gallery.html         Photo gallery with filtering + lightbox
assets/css/style.css One consolidated, modern stylesheet
assets/js/main.js    One consolidated, modern script (nav, modals, countdown,
                      daily verse, testimonials, gallery, sermon filters)
assets/img/          All church photos and ministry logos
```

## What was improved
- **Design**: complete visual rebuild using a premium navy-and-gold palette,
  Playfair Display + Inter typography, and a recurring "sanctuary window"
  motif for hero sections — replacing the old mixed styling across 7
  separate, overlapping CSS files (5,300+ lines) with one clean design system.
- **Responsiveness**: rebuilt from scratch mobile-first — tested logic down
  to 320px, with a proper slide-in mobile nav, responsive image grids,
  masonry gallery, and stacking cards. No horizontal scroll, no overlap.
- **Performance**: project size cut from ~846MB to ~12MB. All 9 unused
  Photoshop `.psd` source files (778MB) and the `.git` history were removed
  from the deliverable; photos were resized (max 1600px) and re-compressed;
  a few oversized PNG photos were converted to JPEG. Images use
  `loading="lazy"`.
- **Code quality**: one shared header, nav, footer, and modal set reused
  across every page (built from a small Python template system) instead of
  copy-pasted markup with drift between pages. One JS file replaces several
  overlapping inline `<script>` blocks and duplicated event handlers.
- **Accessibility**: semantic landmarks (`header`, `nav`, `main`, `footer`),
  a skip-to-content link, labelled form controls, alt text on every image,
  keyboard-operable modals and lightbox (Esc to close, arrow keys to
  navigate), visible focus states, and color contrast checked against the
  WCAG AA threshold for text on the navy/gold palette.
- **SEO**: unique title + meta description + Open Graph tags per page,
  proper heading hierarchy, descriptive alt text throughout.
- **UX polish**: sticky nav, scroll-reveal animations (disabled for
  `prefers-reduced-motion`), a live "next service" countdown, a daily
  rotating Bible verse with share/save, a photo lightbox with keyboard
  navigation, and gallery/sermon filtering.

## What was preserved
- Church name, logo, and Abeka-Lapaz, Accra address/contact details
- Full mission statement, core beliefs, and history timeline
- All ministry structure and copy: Adventurers, Pathfinders, Royal
  Ambassadors/Senior Youth — including the actual songs, laws, pledges,
  vision/mission/values text for each club
- Sermon archive entries, speakers, and dates
- Member testimonials (names, membership years, quotes)
- Social links (Facebook, Instagram, YouTube, TikTok, WhatsApp), Google Maps
  embed, and the prayer-request / giving Google Form integrations
- All real church photography (worship, camps, youth events, gallery)

Two small honesty notes on existing placeholder content: the original site's
pastor bio and a few history-timeline entries contained literal "Lorem
ipsum" filler text and an unfilled "Pastor ......" name field. Rather than
invent a name or biography that isn't actually the church's, I replaced the
Lorem ipsum with plain, accurate role descriptions and left a visible note
on the About page inviting the church to add final leadership names and
photos — nothing here is presented as more specific than what was actually
in the original project.

## Bug fixes (this update)
- **Mobile menu wasn't expanding — fixed.** The header used
  `backdrop-filter: blur()` for its frosted-glass look. In modern browsers,
  `backdrop-filter` (like `transform` or `filter`) creates a new CSS
  "containing block" for any `position: fixed` descendant. Because the
  mobile slide-in menu is `position: fixed`, it was being trapped inside the
  header's own ~84px-tall box instead of the full screen — so it never
  visibly opened. Fix: the blur effect is now desktop-only (it was never
  needed as a functional cue on mobile), and the menu now correctly slides
  in over the full screen on phones and tablets.
- **Menu no longer gets stuck open.** Added a scroll lock while the mobile
  menu is open (the page behind it no longer scrolls), auto-close when a
  real link is tapped, auto-close if the screen is rotated/resized past the
  mobile breakpoint, and Escape-key support.
- **Photo gallery no longer risks horizontal scrolling on small phones.**
  The gallery grid was forcing 2 columns down to any width; it now drops to
  a single column under ~460px so photos aren't squeezed.
- **Sermon/event countdown no longer freezes.** On the events page (which
  has no "service in progress" banner), the countdown used to silently stop
  updating once Saturday's service started, leaving stale numbers on
  screen. It now shows a clean 00:00:00 instead of freezing.
- **Everything sized down for real phones.** Added dedicated breakpoints for
  tablets (700px), standard phones (420px), and small phones (340px/320px):
  smaller header, tighter section spacing, smaller hero text and padding,
  full-width stacked buttons, a smaller floating chat button, single-column
  forms, and a smaller sermon/gallery/verse layout — so nothing feels
  oversized or cramped on a phone screen.

## Recommendations for next steps
1. **Leadership photos & bios** — swap in real pastor/elder names and
   headshots on `about.html` (currently uses a placeholder note).
2. **Live sermon embeds** — the "watch on Facebook" links could become
   embedded video (YouTube/Facebook video ID) once you're ready to stream
   directly on-site.
3. **Real payment processor** — the Give modal currently points to a
   placeholder PayPal business email; swap in the church's actual PayPal
   or add a dedicated card processor.
4. **CMS-free updates** — because this is static HTML, adding a new sermon
   or gallery photo means editing the relevant Python generator in a future
   session (or the HTML directly) and re-deploying. If the church wants
   staff to update content without touching code, a lightweight CMS (e.g.
   a headless CMS or even a simple spreadsheet-driven build) would be a
   good next investment.
5. **Analytics** — consider adding a privacy-friendly analytics snippet
   (e.g. Plausible or GA4) to learn which pages and ministries get the
   most traffic.
