# GetHireToday — Design System

**Single source of truth for brand, colors, typography, and reusable components.**

Link this file into Claude or any design tool to give it complete context about the GetHireToday visual language. All tokens below are the actual values used in production as of 2026-04-18.

---

## 1. Brand

### Name & wordmark

- **Full name:** `GetHireToday` (one word, camel-cased, no spaces)
- **Wordmark split:** `GetHire` in slate-900 + `Today` in teal. Never use all-teal or all-black.
- **Voice:** confident, practical, direct. Avoid buzzwords ("revolutionary", "game-changer"). Use concrete numbers ($2/mo, 30-point ATS score, 14 templates).

### Logo

Single source of truth: **`components/logo.tsx`**

- **Mark:** rounded teal-gradient square with a geometric white "G" (horizontal crossbar, open right side).
  - Background gradient: `#5fd4c1` → `#0f766e` (top-left to bottom-right)
  - G stroke: white, 5px at 48-unit viewBox, round linecaps/joins
  - Corner radius: `rx=11` (~22% of 48) — gives a soft app-icon feel
- **Variants:**
  - `default` — mark + wordmark (navbar, footer, sidebar, auth layout)
  - `icon` — mark only (favicon, tight spaces)
  - `wordmark` — text only
- **Tones:** `dark` (on light backgrounds, default) | `light` (on dark backgrounds — wordmark turns white, "Today" stays teal)
- **Sizes:** `sm` (24px mark) | `md` (28px mark, default) | `lg` (36px mark)

### Favicon / app icon

Generated from identical SVG geometry. See `scripts/generate-icons.mjs`.

- `app/icon.svg` — modern browsers
- `app/icon.png` — 512×512 PNG fallback
- `app/apple-icon.png` — 180×180 iOS home screen
- `app/favicon.ico` — legacy fallback

---

## 2. Color palette

### Brand colors

| Token | Hex | Usage |
|---|---|---|
| Teal Primary | `#4AB7A6` | Primary accent, CTA buttons, links, brand moments |
| Teal Dark | `#0f766e` | Hover states, wordmark accent on light bg, gradient end |
| Teal Light | `#5fd4c1` | Gradient start, hover tints |
| Teal Soft | `#f0fdf9` | Background for pills, info cards, badge hovers |
| Teal Border | `#ccfbef` / `#a7ece0` | Soft borders on brand-tinted elements |

### Text / neutral

| Token | Hex | Usage |
|---|---|---|
| Slate 900 | `#0f172a` | Headlines, wordmark "GetHire", primary text |
| Slate 700 | `#334155` | Emphasized body copy |
| Slate 600 | `#475569` | Standard body copy |
| Slate 500 | `#64748b` | Muted copy, captions |
| Slate 400 | `#94a3b8` | Placeholder text, disabled |
| Slate 300 | `#cbd5e1` | Borders |
| Slate 200 | `#e2e8f0` | Subtle borders, skeleton backgrounds |
| Slate 100 | `#f1f5f9` | Section dividers |
| Slate 50 | `#f8fafc` | Page backgrounds in alt sections |
| White | `#ffffff` | Cards, primary page background |

### Semantic

| Token | Hex | Usage |
|---|---|---|
| Success | `#16a34a` | ATS score ≥80, positive toasts, keyword match |
| Warning | `#d97706` | ATS score 60-79, missing-description pills |
| Danger | `#dc2626` | ATS score <60, error states |
| Info | `#1d4ed8` | Links, neutral CTAs |

### Resume-template accent colors (builder only)

Per-template accent used in preview thumbnails and full-page renders. Defined in `app/builder/resume/[id]/page.tsx` `TEMPLATES` array.

| Template | Accent |
|---|---|
| Classic | `#4AB7A6` |
| Modern | `#1e293b` |
| Minimal | `#1d4ed8` |
| Executive | `#0f172a` |
| Creative | `#7c3aed` |
| Simple | `#0891b2` |
| Bold Header | `#4AB7A6` |
| Split Right | `#1d4ed8` |
| Timeline | `#7c3aed` |
| Mono | `#0d9488` |
| Photo Card | `#2563eb` |
| Compact ATS | `#475569` |
| Elegant Serif | `#9f1239` |
| Split Accent | `#7c3aed` |

---

## 3. Typography

### Font family

- **Primary:** [Inter](https://fonts.google.com/specimen/Inter), loaded via `next/font/google` in `app/layout.tsx`.
- Weights used: 400 (regular body), 500 (medium, captions), 600 (semibold, subheads), 700 (bold, headings), 800 (extra-bold, display and wordmark).
- Letter-spacing: `-0.02em` on large display headings for optical tightening; `0` everywhere else.

### Scale

| Role | Size | Weight | Example |
|---|---|---|---|
| Hero display | `5xl-6xl` (48-60px) | 700 | "Your Resume Is Costing You Interviews." |
| Section H2 | `4xl-5xl` (36-48px) | 700 | "Create a Job-Ready Resume in 3 Simple Steps" |
| Card H3 | `xl-2xl` (20-24px) | 700 | Card titles |
| Body large | `lg-xl` (18-20px) | 400 | Hero subhead |
| Body | `base` (16px) | 400 | Paragraph |
| Small | `sm` (14px) | 400-500 | Captions, metadata |
| Micro | `xs` (12px) | 500-600 | Badges, labels |

### Pattern rules

- **Headlines always** use Inter at weight 700 or 800.
- **Body copy** stays at weight 400 or 500 in slate-600/700.
- **Never italicize** except for dates on resume templates ("2022 – Present") or emphasis in long-form blog posts.

---

## 4. Spacing & layout

### Container

- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — standard page gutter.
- Hero sections use `max-w-7xl` with a 55/45 two-column grid on `lg` breakpoints.

### Section vertical rhythm

- Hero: `pt-16 pb-20 lg:pt-24 lg:pb-28`
- Content section: `py-20 lg:py-28`
- Footer: `py-16`

### Card spacing

- Card padding: `p-5` (20px) for small, `p-6` (24px) for medium, `p-8` (32px) for feature cards.
- Card border: `border border-slate-200` on light bg, `border border-[#d1f0ec]` on teal-tinted bg.
- Card radius: `rounded-xl` (12px) for small cards, `rounded-2xl` (16px) for feature cards.
- Card shadow: `shadow-sm` for resting, `shadow-lg` for elevated/floating elements.

### Breakpoints

Tailwind defaults — but:
- `sm` = 640px (minor layout shifts)
- `lg` = 1024px (sidebar + content split)
- `xl` = 1280px (full wide layouts)
- `2xl` = 1536px (builder goes 2-column for Summary/Experience/Skills panels)

---

## 5. Buttons

### Primary CTA

```tsx
<Link
  href="/builder/resume"
  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full transition-all hover:-translate-y-0.5"
  style={{
    background: "linear-gradient(135deg, #4AB7A6 0%, #3aa492 100%)",
    boxShadow: "0 8px 24px -6px rgba(74,183,166,0.5), 0 2px 4px rgba(74,183,166,0.2)",
  }}
>
  Build My Resume Free → <ChevronRight className="w-4 h-4" />
</Link>
```

- Always rounded-full pill
- Teal gradient with matching drop shadow
- Hover: `-translate-y-0.5` lift
- Icon on right if there's directional language ("→", "Next", "Build")

### Secondary

```tsx
<Link
  href="/resume-templates"
  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full border hover:border-slate-400 hover:-translate-y-0.5"
  style={{ color: "#0f172a", borderColor: "#cbd5e1", backgroundColor: "#ffffff" }}
>
  View Templates
</Link>
```

- Same pill shape for consistency
- White bg, slate-300 border, slate-900 text
- Hover: darken border

### Destructive / Warning

- Red accent from the semantic palette
- Same pill shape; only colors change

---

## 6. Form controls

- Inputs: `h-11 rounded-xl border border-slate-200 px-3.5 text-sm` with `focus:border-[#4AB7A6] focus:ring-2 focus:ring-[#4AB7A6]/20`
- Textareas: same styling, `resize-none` by default
- Radio/checkbox: use shadcn/ui defaults, accent to `#4AB7A6`
- Labels: `text-xs font-medium text-slate-500 mb-1`

---

## 7. Iconography

- **Icon library:** [Lucide React](https://lucide.dev/) (`lucide-react`) — used across the entire app.
- Default size: `w-4 h-4` (16px) inline, `w-5 h-5` (20px) for standalone actions.
- Stroke width: 2 (Lucide default) — never change.
- Color: inherit from text color unless brand-accented, then `#4AB7A6`.
- **Never mix icon libraries.** If Lucide doesn't have the icon, request an SVG addition instead of pulling from FontAwesome, Heroicons, etc.

---

## 8. Reusable patterns

### Badge / pill

```tsx
<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
  style={{ border: "1px solid #a7ece0", color: "#0f766e", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf9 100%)" }}>
  <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#4AB7A6" }} />
  AI-Powered · ATS-Optimized · Free to Start
</span>
```

### Info card (teal-tinted)

```tsx
<div className="bg-[#f0fdf9] border border-[#ccfbef] rounded-xl p-5">
  …content…
</div>
```

### Pro Tip box

Green background, lightbulb icon, used inside builder sections. Pattern defined in `components/wizard-helpers.tsx` `ProTipBox`.

### Warning pill

Amber background, used for "Missing description" on incomplete resume entries. See `WarningPill` in builder.

---

## 9. Motion

- Transitions: `transition-all duration-200` for hover; `duration-700` for the animated ATS score bar fills.
- Hover lifts: `hover:-translate-y-0.5` on buttons and template cards.
- No bouncing or spring easing — keep it snappy and professional.

---

## 10. File references

Quick links to canonical source of truth for each design element:

| Concept | File |
|---|---|
| Logo component | `components/logo.tsx` |
| Favicon generation | `scripts/generate-icons.mjs` |
| Navbar | `components/navbar.tsx` |
| Footer | `components/footer.tsx` |
| Hero section | `app/page.tsx` (lines ~470–600) |
| Hero resume card mockup | `app/page.tsx` (`HeroResumeCard` component) |
| Template color palette | `app/builder/resume/[id]/page.tsx` (`TEMPLATES` const) |
| Resume template renderers | `components/resume-templates/*.tsx` |
| Resume template preview thumbnails | `components/template-preview.tsx` |
| Global CSS variables | `app/globals.css` |
| Next.js font loading | `app/layout.tsx` |

---

## 11. Don'ts

- ❌ Don't use emoji in headlines or buttons. (Except 👋 in the welcoming footer of the launch-comment template, which is deliberate casual tone.)
- ❌ Don't introduce new accent colors outside the teal family without updating this doc.
- ❌ Don't mix border-radius styles on a single page (pick `xl` or `2xl` and stay consistent).
- ❌ Don't use Inter at weights 100-300 — reads too thin at body size.
- ❌ Don't animate page transitions or scroll-jack.

---

_This document is the design system of record. When Claude or any designer is making UI decisions for GetHireToday, this file is the ground truth. If you add a new pattern, update this doc in the same commit._
