-- ============================================================
-- Track when a user's Pro access should end.
--
-- When a user cancels, we set subscription_status='cancelled' but we
-- still owe them Pro access until the end of the billing cycle they
-- already paid for. We need a column to store that end-date so the
-- UI (and feature gates) know when to actually revoke access.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- Handy read-only helper: "does this user currently have Pro access?"
-- True when status is active/trialing/pro, OR when cancelled but still
-- inside the paid period.
CREATE OR REPLACE FUNCTION public.is_pro(p public.profiles)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT
    p.subscription_status IN ('active', 'trialing', 'pro')
    OR (
      p.subscription_status = 'cancelled'
      AND p.subscription_ends_at IS NOT NULL
      AND p.subscription_ends_at > NOW()
    );
$$;
