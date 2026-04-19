# Deploy — in-page cancel subscription (no more Gumroad redirect)

## 1. Ship the code

```bash
cd ~/Desktop/Gethiretoday && \
find .git -name "*.lock" -delete && \
git add \
  DEPLOY_NEXT.md \
  app/api/subscription/cancel/route.ts \
  app/api/lemonsqueezy/webhook/route.ts \
  app/dashboard/billing/page.tsx && \
git commit -m "Billing: cancel subscription in-page (no Gumroad redirect) + capture subscription_id on webhook" && \
git push origin main
```

## 2. Set the Gumroad API token in Vercel (one-time, required)

The in-page cancel works by calling Gumroad's API directly instead of redirecting the user to app.gumroad.com. You need to give the server a Gumroad access token.

1. **Create a Gumroad access token:**
   - Open https://gumroad.com/settings/advanced
   - Scroll to **Applications** → click **Create application**
   - Fill in any name (e.g. "GetHireToday Server") and redirect URL `https://gethiretoday.com` (unused, but required)
   - Click **Create**
   - On the resulting page, click **Generate access token**
   - Copy the token that starts with something like `ght_...` or a similar Gumroad format

2. **Add it to Vercel:**
   - Open https://vercel.com/kreativecasaentertainment-3739s-projects/gethiretoday/settings/environment-variables
   - Click **Add Environment Variable**
   - Name: `GUMROAD_ACCESS_TOKEN`
   - Value: the token from step 1
   - Environments: **Production** + **Preview**
   - Mark **Sensitive**, click Save
   - **Redeploy** so the new env var is in effect

**Until this env var is set**, the cancel flow still works end-to-end from the user's perspective — clicking Cancel marks the subscription as `cancelling` in our DB and shows the user confirmation. But the *actual* Gumroad-side cancellation won't happen automatically and you'll need to cancel those subscriptions manually in the Gumroad dashboard.

## What this fix ships

### 🔴 Cancel button stays on gethiretoday.com
**Bug:** Clicking "Yes, cancel" in the confirm dialog redirected the user to `app.gumroad.com/library`, pulling them out of the product and leaving them to figure out cancellation on Gumroad's interface.

**Fix:**

- **New server route `app/api/subscription/cancel/route.ts`:**
  - Identifies the current user from the auth cookie.
  - Resolves the Gumroad subscriber id from `profiles.subscription_id` (stored by the webhook) — with an email-based fallback via Gumroad's `GET /v2/subscribers?email=…` if not cached.
  - Calls Gumroad `DELETE /v2/subscribers/:id` to cancel.
  - Updates `profiles.subscription_status = 'cancelled'`.
  - Returns a friendly message for the UI to show.
  - Graceful degrade: if `GUMROAD_ACCESS_TOKEN` is missing, marks the profile as `cancelling` and returns a "request received, we'll finalize" message instead of a hard failure.

- **Webhook hardening** (`app/api/lemonsqueezy/webhook/route.ts`):
  - On `sale` events, captures the Gumroad `subscription_id` / `subscriber_id` into `profiles.subscription_id`. This future-proofs cancellations for new subscribers.

- **Billing page UI** (`app/dashboard/billing/page.tsx`):
  - `handleCancelSubscription` now calls `/api/subscription/cancel` instead of redirecting.
  - On success, the component **updates in place** — no page reload, no redirect:
    - Badge flips from green **"Active"** to red **"Cancelled"**.
    - Subheading changes to *"Pro access continues until {nextBillingDate}. You won't be charged again."*
    - "Manage" and "Cancel subscription" buttons disappear.
    - Success banner: *"Subscription cancelled. Your Pro access remains active until the end of your current billing period."*
    - A **"Resubscribe to Pro — $2/mo"** button appears so the user can re-upgrade with one click.
  - Initial page load already recognises `subscription_status: 'cancelled'` and `cancelling` and renders the correct state (so users who return to the page later still see the cancelled card, not "Active").
  - Error states: network failures and Gumroad API errors surface an inline error with a retry path instead of silently failing.

## Files changed

```
app/api/subscription/cancel/route.ts     [NEW] Gumroad-API cancel + graceful degrade
app/api/lemonsqueezy/webhook/route.ts     Capture subscription_id on sale events
app/dashboard/billing/page.tsx            Inline cancel + cancelled-state UI + resubscribe CTA
```

## Nothing else changed
Scoped to the cancel flow per request. Download modal, data-loss safety net, pro-status sync, email-confirmation UX all ship as they were.
