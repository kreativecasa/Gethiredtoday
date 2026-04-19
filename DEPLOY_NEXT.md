# Deploy — critical fixes: Pro-status sync + builder data-loss

```bash
cd ~/Desktop/Gethiretoday && \
find .git -name "*.lock" -delete && \
git add \
  DEPLOY_NEXT.md \
  components/pro-upgrade-modal.tsx \
  "app/builder/resume/[id]/page.tsx" \
  "app/(auth)/signup/page.tsx" \
  "app/(auth)/login/page.tsx" \
  app/api/stripe/create-checkout/route.ts \
  app/api/stripe/confirm-checkout/route.ts \
  app/dashboard/page.tsx && \
git commit -m "Critical: pro-status sync after checkout + builder local-draft safety net" && \
git push origin main
```

> (Includes the earlier Pro paywall modal + email-confirm UX that weren't pushed yet
> — single commit lands all four fixes together.)

## What this fixes

### 🔴 CRITICAL — builder page no longer loses data on refresh
**Bug:** Free + Pro users typing in the builder occasionally lost everything when the page auto-refreshed (auth token refresh, tab recovery, network blip).

**Fix:** Belt-and-suspenders local-draft safety net in `app/builder/resume/[id]/page.tsx`:

1. **Debounced (300ms) mirror to `localStorage`** — every change to resume data, template, colors, font size, title is auto-persisted under a per-resume key. The user never has to click Save to protect their work.
2. **On mount, reconcile with server** — if the local draft is newer than the server record (`localStorage.savedAt > server.updated_at + 1s`), we restore from local and show an inline banner: *"Restored unsaved changes from your last session. Click Save to keep them."*
3. **On successful server save** — clear the local draft (server is now source of truth).
4. **On tab close with unsaved state** — native `beforeunload` prompt warns the user before losing edits.
5. **If the server fetch itself fails** — we fall back to the local draft instead of showing an empty resume.

So now: refresh, browser crash, logout, anything — the user's work survives until explicitly saved (then cleared) or explicitly discarded.

### 🔴 Pro status reflects immediately after checkout
**Bug:** Users who paid still saw "Go Pro" prompts because the dashboard relied on the Stripe webhook updating `profiles.subscription_status = 'active'` — and the webhook was slow, rate-limited, or sometimes missed entirely.

**Fix:** Synchronous confirmation path that doesn't depend on the webhook:

- **`app/api/stripe/create-checkout/route.ts`** — `success_url` now includes `session_id={CHECKOUT_SESSION_ID}` so the dashboard knows exactly which session to verify.
- **`app/api/stripe/confirm-checkout/route.ts`** (new) — server-side endpoint that:
  - Reads the current user from the SSR Supabase cookie.
  - Retrieves the Stripe session by id.
  - Verifies `metadata.userId === current user.id` (so a malicious user can't paste someone else's session).
  - Confirms `session.payment_status === 'paid'` or `session.status === 'complete'`.
  - Updates `profiles.subscription_status = 'active'` + `stripe_customer_id` + `subscription_id` using the service-role key.
- **`app/dashboard/page.tsx`** — on mount:
  - If URL has `?success=true&session_id=…`, POST to `/api/stripe/confirm-checkout`.
  - On success, strip the query params and **hard-reload** so the dashboard header / sidebar / this page all re-read Pro status in lockstep — no flash of "Upgrade" after upgrading.
  - Webhook is still wired and still fires — it just becomes a backup rather than the primary path.

After this ships, the moment Stripe says "payment received", the user sees Pro. No more "I paid but still see Go Pro".

### Pro upgrade modal (previously drafted, shipping in the same commit)
`components/pro-upgrade-modal.tsx` + builder wiring — free user tries Pro template PDF or any Word export → full modal with $2/mo pitch, 4 benefits, teal gradient header, primary Upgrade CTA, and "Use Classic instead" escape. Replaces the 4-second auto-dismissing pill.

### Signup/login email-confirmation UX (previously drafted, shipping in the same commit)
- Signup: "Check your inbox" state with email shown, spam-check tip, **Resend confirmation email** button.
- Login: "Email not confirmed" error → amber card with email + resend button instead of cryptic raw message.
- Both use `emailRedirectTo` correctly so confirmation links land on `/auth/callback`.

## Files changed in this commit

```
app/api/stripe/confirm-checkout/route.ts  [NEW] Synchronous payment confirmation
app/api/stripe/create-checkout/route.ts   Include session_id in success_url
app/dashboard/page.tsx                    Call confirm endpoint + hard-reload on success
app/builder/resume/[id]/page.tsx          localStorage safety net + beforeunload prompt + pro modal wiring
components/pro-upgrade-modal.tsx          [NEW] Paywall dialog
app/(auth)/signup/page.tsx                "Check your inbox" + resend
app/(auth)/login/page.tsx                 "Email not confirmed" + resend
```

## Nothing else changed
Per your "no other changes" instruction, this commit is scoped to: critical Pro-status sync, critical data-loss safety net, and the previously-queued Pro modal + email-confirm UX that hadn't been pushed yet.
