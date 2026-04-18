# Deploy — hero polish + ATS fix + avatar upload fix

```bash
find .git -name "*.lock" -delete && \
git add \
  DEPLOY_NEXT.md \
  app/page.tsx \
  app/api/ats/check/route.ts \
  app/dashboard/account/page.tsx \
  components/ats-checker-view.tsx \
  supabase/migrations/20260418_avatars_bucket.sql && \
git commit -m "Hero polish, ATS error-surfacing, avatar upload bucket + persistence" && \
git push origin main
```

> **Do NOT use `git add -A`** — your working tree currently has an untracked
> `reportly/` folder (your other project) and a `marketing/` folder of untracked
> draft files. The explicit `git add` list above only stages the five files
> for this ship. The `MARKETING_PLAN.md` and `marketing/` drafts can be
> committed separately whenever you're ready.

**One extra step for the avatar fix to actually work:** you need to run the new Supabase migration. Two options:

**Option 1 — Supabase CLI (if you have it set up):**
```bash
supabase db push
```

**Option 2 — Manual in Supabase Dashboard:**
1. Open https://supabase.com/dashboard/project/_/sql/new
2. Paste the contents of `supabase/migrations/20260418_avatars_bucket.sql`
3. Click "Run"

Until this migration is applied, the avatar upload will surface a clear error message ("Upload failed… avatars storage bucket may not be set up yet") instead of silently failing like before.

## What this ships

### 1. Hero banner — visual polish (no copy changes)
- Added a subtle radial-gradient glow (teal in upper-right, cyan in lower-left) + a masked grid pattern behind the hero for depth. Section no longer looks like a flat white AI landing page.
- Upgraded the "AI-Powered · ATS-Optimized · Free to Start" pill — now has a gradient background and soft shadow, darker teal text for better readability.
- Primary CTA gets a linear gradient + shadow + `-translate-y-0.5` hover lift (feels clickable instead of static).
- Avatar circles replaced — now 9×9 with per-avatar gradients (teal, violet, cyan, amber), heavier ring, subtle shadow. They feel like people instead of placeholder chips.
- **HeroResumeCard** — this was the biggest AI-generic tell. Replaced the abstract skeleton bars with real-looking content: "Senior Product Manager / Stripe / 2022 – Present", "B.S. Computer Science / Stanford University / 2019", a proper contact line with email + city, bullet points with dashes and accent dots. The mockup now reads like an actual resume instead of Figma wireframe greyboxes.

Every word of copy in the hero is unchanged — SEO-critical text kept intact.

### 2. ATS "Analyze my resume" — actual error messages instead of the generic fallback
- **Client** (`components/ats-checker-view.tsx`) — previously swallowed all errors into `"Failed to analyze resume. Please try again."`. Now:
  - Validates length client-side (50-char min) so users get a specific "your text is only X characters" message instead of silent rejection
  - Parses the server's JSON response on 4xx/5xx and shows the actual `error` field
  - Distinguishes network errors ("Network error: …") from server errors (HTTP X: specific message)
  - Rejects unexpected response shapes cleanly
- **Server** (`app/api/ats/check/route.ts`) — tightened request parsing, always returns a typed `{ error }` body, clearer messages for malformed bodies.

Users now see *why* the checker failed (too short, malformed, temporary issue) instead of a dead-end try-again loop.

### 3. Profile photo upload — works end-to-end
**Root cause:** the `avatars` storage bucket was never created in Supabase. The client code tried to upload to a non-existent bucket, the error bubbled up to `console.error` but never reached the UI, and the user saw a "spinner → nothing happens" experience.

- **New migration** `supabase/migrations/20260418_avatars_bucket.sql` — creates the `avatars` public bucket and scoped RLS policies (users can only read any avatar but only insert/update/delete their own, enforced by comparing `auth.uid()` against the first folder segment of the object path). Idempotent — safe to re-run.
- **Client fix** (`app/dashboard/account/page.tsx` → `handleAvatarChange`) — now:
  - Validates MIME type (JPG / PNG / WebP only)
  - Rejects files >5MB with a clear message
  - Normalises file extension from MIME type (not the original filename)
  - Surfaces Supabase errors to the user via `profileError` state
  - **Persists `avatar_url` to the `profiles` table** after successful upload (was missing — photo was vanishing on refresh)
  - Also mirrors the URL into auth metadata as a fallback
  - Adds a cache-buster to the URL so the `<img>` refreshes immediately when overwriting
  - Resets the file input so re-picking the same file triggers onChange again
  - Shows success state for 3 seconds

## Files changed

```
app/page.tsx                                    Hero visual polish + HeroResumeCard realistic content
components/ats-checker-view.tsx                 Client surfaces real server errors + pre-send validation
app/api/ats/check/route.ts                      Tighter request parsing, typed error responses
app/dashboard/account/page.tsx                  Avatar upload error handling + profiles-table persistence
supabase/migrations/20260418_avatars_bucket.sql [NEW] Creates avatars bucket + RLS policies
```

## Project is now frozen per user request — no further changes after these three.
