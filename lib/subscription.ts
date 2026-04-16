import { createClient } from '@/lib/supabase';

export type Plan = 'free' | 'pro';

export const PLAN_LIMITS = {
  free: {
    maxResumes: 1,
    maxCoverLetters: 1,
    maxAISuggestions: 3,
    premiumTemplates: false,
    atsCheckerFull: false,
    pdfDownload: false,
    wordDownload: false,
    watermark: true,
    jobTailoring: false,
    coverLetterBuilder: false,
  },
  pro: {
    maxResumes: Infinity,
    maxCoverLetters: Infinity,
    maxAISuggestions: Infinity,
    premiumTemplates: true,
    atsCheckerFull: true,
    pdfDownload: true,
    wordDownload: true,
    watermark: false,
    jobTailoring: true,
    coverLetterBuilder: true,
  },
} as const;

export type FeatureKey = keyof typeof PLAN_LIMITS['free'];

/**
 * Returns true if the given plan can access the given feature.
 */
export function canUseFeature(plan: Plan, feature: FeatureKey): boolean {
  const limit = PLAN_LIMITS[plan][feature];
  if (typeof limit === 'boolean') return limit;
  if (typeof limit === 'number') return limit > 0;
  return false;
}

/**
 * Client-side: fetches the current user's plan from Supabase.
 * Returns 'free' if unauthenticated or no active subscription.
 */
export async function getUserPlan(): Promise<Plan> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'free';

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    const status = profile?.subscription_status;
    if (status === 'active' || status === 'trialing' || status === 'pro') {
      return 'pro';
    }
    return 'free';
  } catch {
    return 'free';
  }
}

/**
 * Redirects to Stripe checkout for the given plan interval.
 * Requires the user to be authenticated.
 */
export async function startCheckout(interval: 'monthly' | 'yearly' = 'monthly'): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/signup?plan=pro';
      return;
    }

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        userId: user.id,
        plan: interval === 'yearly' ? 'yearly' : 'monthly',
      }),
    });

    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    }
  } catch (err) {
    console.error('Checkout error:', err);
  }
}
