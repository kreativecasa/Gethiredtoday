# Deploy — unified logo + favicon

```bash
find .git -name "*.lock" -delete && \
git add \
  DEPLOY_NEXT.md \
  components/logo.tsx \
  components/navbar.tsx \
  components/footer.tsx \
  "app/(auth)/layout.tsx" \
  app/dashboard/sidebar.tsx \
  app/icon.png \
  app/icon.svg \
  app/apple-icon.png \
  app/favicon.ico \
  public/icon-512.png \
  scripts/generate-icons.mjs && \
git commit -m "Unified brand: rounded teal G mark + Inter wordmark everywhere" && \
git push origin main
```

> Still don't use `git add -A` — working tree has untracked `reportly/`,
> `marketing/`, and `MARKETING_PLAN.md` that shouldn't land in this commit.

## What this ships

### New reusable `components/logo.tsx`
- **Single source of truth** for the logo. Renders:
  - **Mark:** rounded teal square (gradient `#5fd4c1` → `#0f766e`) with a clean, geometrically-drawn white "G" that has a horizontal crossbar. SVG — crisp at any size.
  - **Wordmark:** "GetHire" in slate-900 bold + "Today" in teal bold. Inter font (already loaded site-wide via `app/layout.tsx`).
- Three variants: `default` (mark + wordmark), `icon` (just mark, e.g. collapsed sidebar), `wordmark` (just text).
- Two tones: `dark` (for light backgrounds, default) and `light` (for dark backgrounds, used in footer).
- Three sizes: `sm`, `md`, `lg`.

### Logo replaced in 4 places
1. **`components/navbar.tsx`** — was: `<Sparkles /> GetHireToday`. Now: `<Logo />`.
2. **`components/footer.tsx`** — was: all-teal "Get Hire Today" (inconsistent). Now: `<Logo tone="light" size="lg" />`.
3. **`app/dashboard/sidebar.tsx`** — was: plain teal "GetHireToday" text. Now: `<Logo />`.
4. **`app/(auth)/layout.tsx`** — was: hand-built mark + wordmark. Now: `<Logo />`.

### Favicon + app-icon assets
- **`app/icon.svg`** — modern browsers (Chrome, Firefox, Safari 17+) prefer this; always crisp.
- **`app/icon.png`** (512×512) — PNG fallback; Next.js auto-resizes for favicon requests.
- **`app/apple-icon.png`** (180×180) — iOS home-screen bookmark icon.
- **`app/favicon.ico`** — overwritten with PNG-in-ICO fallback for legacy browsers.
- **`public/icon-512.png`** — refreshed to match (used in OG metadata and PWA manifests).

All icon art is generated from a single SVG in `scripts/generate-icons.mjs` so the favicon and the in-page `<Logo>` mark are pixel-identical in geometry. Rerun that script with `node scripts/generate-icons.mjs` if you ever want to tweak the mark.

### Removed dependency
- `lucide-react` `Sparkles` icon is no longer referenced by the navbar or auth layout (still used elsewhere in the app).

## Files changed

```
components/logo.tsx              [NEW] Reusable Logo component
components/navbar.tsx            <Logo /> replaces hand-built header mark
components/footer.tsx            <Logo tone="light" /> replaces text-only
app/(auth)/layout.tsx            <Logo /> replaces Sparkles square + text
app/dashboard/sidebar.tsx        <Logo /> replaces plain-teal text
app/icon.svg                     [NEW] SVG favicon
app/icon.png                     [NEW] 512×512 PNG favicon
app/apple-icon.png               [NEW] 180×180 iOS icon
app/favicon.ico                  Overwritten with new G mark
public/icon-512.png              Refreshed to match
scripts/generate-icons.mjs       [NEW] Icon generation script
```
