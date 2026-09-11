# CVMatch AI — Frontend Handoff

## Summary

React/Vite frontend corrected for production readiness:

- Homepage remains visually based on the production design (no redesign).
- Pricing unchanged.
- Crawlability improved via build-time prerender of `/`.
- Funnel analytics improved with safe, non-PII events.
- Sensitive browser console logs removed.

## Design locked confirmation

The production visual design is preserved: no layout, spacing, color, class, or
component changes. The only visible text changed was the approved homepage hero
copy (H1, subheadline, primary CTA, trust line). The compiled CSS bundle hash was
verified unchanged across the non-copy work, confirming no styling drift.

## Pricing locked confirmation

No pricing change of any kind. Plans, prices, credit logic, checkout endpoint,
paywall, and the Stripe/Paddle/Gumroad flow are untouched. Prices are sourced from
the backend (`/v1/credit-plans`) and are not baked into the frontend or the
prerendered HTML.

## Corrections applied

1. **Production API URL** — `src/components/Routes.jsx` now reads
   `import.meta.env.VITE_API_URL` with a production fallback
   (`https://api.cvmatchai.us/api`). No more hardcoded `localhost`.
2. **`.env.example`** — documents `VITE_API_URL` (no secrets).
3. **SEO/meta** — added `<link rel="canonical">`, aligned `<title>`, meta
   description, Open Graph and Twitter tags in `index.html`.
4. **sitemap/robots** — `public/sitemap.xml` lists only real public routes
   (`/` + 9 legal/support pages); `public/robots.txt` references the correct
   sitemap URL.
5. **Approved homepage copy** — applied to the real React Hero component
   (no cloaking; crawler content matches the rendered page).
6. **Prerendered crawlable homepage** — `prerender.mjs` renders the real App to
   static HTML for `/` at build time and injects it into `dist/index.html`.
7. **Hydration-safe React** — `src/main.jsx` hydrates when prerendered markup is
   present (else client-renders); `src/context/AuthContext.jsx` guards
   `window`/`location`/`localStorage` for the Node prerender pass.
8. **Payment.jsx cleanup** — removed fake card constants, "Developer Test Key",
   dead test-mode UI/state, debug `alert()`s, and `console.log(response)`. Real
   Stripe checkout (redirect to `response.data.url`) is unchanged.
9. **Funnel events (non-PII)** — added `purchase_completed`, `unlock_succeeded`,
   `unlock_failed`, `resume_upload_completed`, `scan_completed`, `report_viewed`,
   `paywall_viewed`, `checkout_started` via the existing `trackMeta` helper.
10. **Sensitive logs removed** — `console.log("ANALYSIS RESULT:", data)` and the
    guest-token console log removed from `src/App.jsx`.

## Environment variables

```
VITE_API_URL=https://api.cvmatchai.us/api
```

- Only `VITE_`-prefixed variables are exposed to the frontend (Vite rule).
- Do NOT place secrets (API keys, Stripe secret keys, DB credentials) here.
- For local development, copy `.env.example` to `.env.local` and set
  `VITE_API_URL=http://127.0.0.1:8000/api`.
- `VITE_API_URL` is read at build time; changing it requires a rebuild.

## Install / build / preview commands

```bash
npm install
npm run build      # runs: vite build && node prerender.mjs
npx vite preview --host 127.0.0.1 --port 4173
```

## Manual checks (recommended before deploy)

- Open http://127.0.0.1:4173
- Check the browser console for hydration warnings (expect none in a production build)
- Verify the H1 is visible: "Build an ATS-Ready U.S. Resume Tailored to the Exact Job You Want"
- Verify the primary CTA is visible: "Scan My Resume Free"
- Verify the trust line is visible
- Verify pricing is unchanged
- Verify there is no "Career Coach Starter" string
- Verify checkout starts correctly against the backend API

## Deployment notes

- `npm run build` produces `dist/`. The homepage (`dist/index.html`) is
  prerendered; other routes are client-rendered (SPA).
- Configure the host to serve `dist/` with SPA fallback (serve `index.html` for
  unknown client routes).
- Set `VITE_API_URL` in the deployment environment before building if the
  production API differs from the default fallback.
- Submit `sitemap.xml` in Google Search Console after deploy to purge any
  previously indexed 404 URLs.
- `og:image` / `twitter:image` use `/preview.png`; confirm it is at least
  1200x630px for clean social previews.

## Remaining risks (frontend)

- Prerender covers `/` only; legal/support pages remain client-rendered.
- Hero uses a framer-motion fade-in, so the hero starts at `opacity:0` in the
  initial HTML (text is in the DOM for crawlers, fades in on hydration).
- Auth token, guest token, full user profile (incl. email), and pasted job
  description persist in `localStorage` (XSS exposure surface) — existing
  architecture choice.
- A `BrowserRouter` import in `Payment.jsx` is unused (benign build warning).
- Real-browser hydration was validated via a jsdom simulation here; confirm once
  in a real browser console before deploy.

## Known backend dependencies (NOT in this package — frontend only)

The backend must:

- Enforce per-user / per-guest-token ownership on `analyses` and `resumes`
  endpoints (no IDOR; analysis IDs should be non-guessable).
- Support deletion / access by email request to honor the privacy policy.
- Avoid logging CV text, job descriptions, or OpenAI prompts in server logs.
- Verify Stripe (and Paddle) webhooks.
- Serve the expected API at `VITE_API_URL`.

## Expected API endpoints (contract the frontend calls)

`/auth/google`, `/v1/auth/me`, `/v1/auth/logout`, `/v1/auth/accept-terms`,
`/v1/credit-plans`, `/credit-plans/{id}`, `/v1/resumes/upload`,
`/v1/resumes/visitor-upload`, `/v1/analyses` (POST), `/v1/analyses/{id}` (GET),
`/v1/analyses/{id}/unlock`, `/v1/analyses/{id}/download/resume`,
`/v1/payments/paddle/checkout`, `/payments/stripe/session`, `/payments/gumroad`,
`/v1/mobile-waitlist`.
