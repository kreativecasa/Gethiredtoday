# GetHiredToday — Marketing Plan

_Last updated: 2026-04-18. This file is the single source of truth for the marketing workstream. If a future handoff session loses context, read this first._

## Positioning

**One-liner:** Free AI resume builder with ATS scoring, 14 modern templates, Word + PDF export. Pro unlocks everything for a flat **$9.99/month** — no trial traps, cancel anytime.

The $9.99/mo price is the sharpest wedge. Every hook leads with it.

## Audience (ranked by conversion likelihood)

1. **Active job seekers already paying (or about to) for a paid resume builder's trial.** Wallet is already out; switching cost is low. Prime target.
2. **New grads and career changers drafting their first "real" resume.** High intent, lower willingness to pay.
3. **Bootcamp grads / engineers who want ATS scoring before applying.** Niche but high-signal; ATS checker is the hook.

## Channels (ranked by today's ROI)

1. **Reddit organic** — r/resumes, r/jobs, r/careerguidance, r/recruitinghell, r/EngineeringResumes, r/cscareerquestions. Pure helpful answers first; mention the tool only when it directly answers the question. **No top-level self-promo posts for the first two weeks** — new accounts get shadowbanned instantly. Start with 5–10 genuinely useful comments to build karma.
2. **IndieHackers + ProductHunt launches** — one post each. Lead with the $9.99/mo angle.
3. **SEO / blog** — existing posts committed (`241e449`, `009194a`). Audit what's indexed; queue new high-intent posts ("cheap AI resume builder 2026", "Free ATS checker 2026"). Compound-growth, slow but cheap.
4. **LinkedIn / X** — lower priority until there's existing audience.

## Today's schedule (2026-04-18)

1. **Save this plan.** (done once this file is committed)
2. **Audit the live site.** Walk homepage, pricing, blog index, builder, cover-letter builder through Chrome. Note weak copy, broken links, mismatched messaging. Fix anything that'd kill conversion before traffic arrives.
3. **Reddit recon.** Find 3–5 recent threads in target subs where the tool is a legit answer. Draft comments. User approves each before posting.
4. **Draft IndieHackers + ProductHunt launch posts** as markdown. Hold until account age / karma is checked.
5. **Queue 2–3 SEO blog posts** targeting neutral high-intent terms like "cheap AI resume builder", "free resume builder no subscription", "ATS resume checker free 2026". Commit for deploy.
6. **Verify analytics + set up UTM scheme.** Confirm Vercel Analytics is firing on hiredtodayapp.com. UTM convention: `?utm_source={channel}&utm_medium={post|comment}&utm_campaign=apr18-launch`.

## Copy & claims — user decisions

- **"60+ templates" and "500+ examples" claims across the site are intentional** — kept for SEO keyword matching (terms like "60+ resume templates" rank for commercial search). Actual product: 14 templates, 20 examples. Do NOT "fix" these to match reality. If future sessions flag them as a discrepancy, the answer is: user approved this tradeoff on 2026-04-18.
- Pricing-tier copy (Free: "3 basic templates, TXT download only") also stays as-is; the paywall logic is what actually gates features.

## Constraints (hard rules)

- **Never create new accounts.** User logs in themselves; I act inside existing sessions.
- **Never do undisclosed promotion.** Reddit's site rules + every relevant subreddit's rules ban shill posts. First-person disclosure ("I built this") is required whenever the tool is mentioned.
- **Never post without explicit user approval per post/comment.** Drafts only until user confirms.
- **Respect Reddit's 90/10 rule** — 9 non-self-promo interactions for every 1 that mentions the tool.
- **New Reddit accounts (<30 days, low karma)** get silent shadowbans. Warm up first with genuinely useful comments before any link goes out.
- **No references to competitors at all** — no names, no category comparisons, no implicit pricing comparisons. Position GetHiredToday purely on its own merits (price, features, honesty).

## What's already shipped (context for the plan)

- **Product:** Full builder at hiredtodayapp.com with 14 templates, wizard mode, AI suggestions (bullets/skills/summaries), ATS checker, Word + PDF export, Stripe paywall, public share links.
- **Blog:** Posts committed in `241e449` (cover letter + skills) and `009194a` (ATS tips + resume format 2026). Not yet audited for quality/SEO fit.
- **Drip emails:** Welcome + follow-up queue (commit `241e449`). Triggered on signup.
- **Dashboard:** Pro badge, paywall, download buttons working (verified live).
- **Latest deploy:** `28249ba` — builder bug sweep (photo sync, AI suggestions unblocked, responsive Skills). Vercel env `ANTHROPIC_API_KEY` just corrected from typo — AI suggestions now returning 200.

## Open items needed from user

- Reddit username → so account age and karma can be checked before any posting.
- Subreddits to specifically include or avoid beyond the default list.
- Messaging red lines (e.g., "don't mention AI in the headline", "lead with Word export not PDF", etc.).
- ProductHunt + IndieHackers account status — already set up? username?
- Whether UTM campaign name should be `apr18-launch` or something else.

## Tracking

Will maintain a simple log inline below as tasks complete. Update this file when major channels launch or plan changes.

### Log

- 2026-04-18 — File created from session work after handoff context was lost. Plan reconstructed from product state + standard early-stage SaaS marketing practice. User confirmed scope; details pending.
- 2026-04-18/19 — Initial SEO post set shipped; `free-ats-resume-checker-2026` kept, two competitor-comparison posts subsequently removed during brand-scrub pass.
- 2026-04-19 — Competitor-comparison cover-letter post drafted then removed as part of brand-scrub. Will be replaced with a neutral "how to write a cover letter with AI" angle in a future pass.
- 2026-04-19 — **ProductHunt launch confirmed scheduled** for ~Apr 21/22 (2 days 16h out as of this note). First-comment copy ready. Open items on PH pre-launch dashboard: Shoutouts, Video/Loom, Product categories. First comment ✓.
- 2026-04-19 — IndieHackers + Reddit playbooks still drafted-only. Blocker is account warm-up policy (Reddit) + manual posting (IH). Claude can assist live posting once user approves per-post.
