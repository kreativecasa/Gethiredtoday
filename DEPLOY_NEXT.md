# Deploy — Pro upgrade modal on PDF/Word download

```bash
cd ~/Desktop/Gethiretoday && \
find .git -name "*.lock" -delete && \
git add \
  DEPLOY_NEXT.md \
  components/pro-upgrade-modal.tsx \
  "app/builder/resume/[id]/page.tsx" && \
git commit -m "Builder: Pro upgrade modal replaces tiny inline pill on download" && \
git push origin main
```

> Still avoid `git add -A` — working tree has untracked `reportly/`, `marketing/`,
> and `MARKETING_PLAN.md` that shouldn't land in this commit.

## What this ships

### New `components/pro-upgrade-modal.tsx`
A proper full-screen paywall dialog that opens when a free user hits a Pro-gated action. Replaces the old 4-second auto-dismissing amber pill that was easy to miss and converted poorly.

**Design:**
- **Teal gradient header** with a "Pro feature" crown badge, the specific template name (e.g. "Creative is a Pro template"), and a one-line subheading that varies by trigger (PDF vs Word vs generic).
- **Price** — big "$2/month · cancel anytime" with the "competitors charge $24–30" line directly underneath.
- **Feature list** — 4 benefits with icons, title, and one-line description:
  - All 14 premium templates
  - PDF + Word download
  - Full 30-point ATS checker
  - Unlimited resumes + cover letters
- **Trust strip** — "No hidden fees · Cancel in one click · 30-day guarantee"
- **Primary CTA** — "Upgrade to Pro — $2/mo" (teal gradient pill, matches site-wide button style, uses Crown icon)
- **Secondary** — "Use the free Classic template instead" — gives the user an escape path so they're never trapped. Switches template + closes modal in one click.

**Accessibility:**
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` / `aria-describedby`
- ESC to close, backdrop-click to close, focus auto-moves to the primary CTA when opened
- Body scroll locked while modal is open
- All interactive elements have focus-visible rings

**Copy is SEO-aligned:** same brand voice and positioning as the homepage and blog posts — "$2/mo vs $24–30 at competitors", "14 premium templates", "30-point ATS check". So the user gets consistent messaging regardless of where they hit a paywall.

### Builder wiring
- New state `proModal: null | { trigger: 'pdf' | 'word'; templateLabel?: string }` replaces the old `proPrompt` boolean with auto-timeout.
- `handleDownload` — when Pro template + free user, sets `proModal` with template label.
- `handleDownloadWord` — when free user (regardless of template), sets `proModal` with trigger='word'.
- `handleTemplateChange` — closes the modal if open (supports the "switch to free" escape action).
- The inline amber pill at the top of the header is removed — all paywall UX is now in the modal.

## Files changed

```
components/pro-upgrade-modal.tsx  [NEW] Reusable Pro paywall dialog
app/builder/resume/[id]/page.tsx  Wire modal; remove inline pill + auto-timeout
```

## Nothing else changed
Per the request, this commit only adjusts the paywall UX. All other builder behavior, download logic, AI suggestions, template rendering, etc. is untouched.
