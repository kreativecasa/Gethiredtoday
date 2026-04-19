/**
 * Cancel the current user's Gumroad subscription from inside the app — so
 * the user never has to leave gethiretoday.com to manage their subscription.
 *
 * Flow:
 *   1. Identify the current user from the auth cookie.
 *   2. Resolve their Gumroad subscriber id (stored in profiles.subscription_id,
 *      or looked up via Gumroad's email lookup as a fallback).
 *   3. Call Gumroad's PUT /v2/subscribers/:id/cancel.
 *   4. Mark subscription_status = 'cancelled' in profiles. (Pro access
 *      remains until the current billing period ends — we keep the UI
 *      showing "access until {nextBillingDate}" based on profile dates.)
 *
 * Requires env var: GUMROAD_ACCESS_TOKEN (create in Gumroad dashboard →
 * Settings → Advanced → Applications → Create Access Token).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

let _adminClient: SupabaseClient | null = null;
function getAdminClient(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  return _adminClient;
}

async function gumroadCancel(subscriberId: string, accessToken: string): Promise<{ ok: boolean; message?: string }> {
  try {
    // Gumroad API v2 — cancel endpoint is on /subscribers/:id
    const res = await fetch(`https://api.gumroad.com/v2/subscribers/${encodeURIComponent(subscriberId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (json.success) return { ok: true };
    return { ok: false, message: json.message || `Gumroad responded with HTTP ${res.status}.` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : 'Network error calling Gumroad.' };
  }
}

// Fallback — look up Gumroad subscriber by email when we don't have the id cached
async function gumroadFindSubscriberByEmail(email: string, accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.gumroad.com/v2/subscribers?email=${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { subscribers?: Array<{ id: string; cancelled_at?: string | null }> };
    const active = (json.subscribers ?? []).find((s) => !s.cancelled_at);
    return active?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST() {
  const ssr = await createServerSupabaseClient();
  const { data: { user } } = await ssr.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;
  if (!accessToken) {
    // Graceful degrade: mark the cancellation intent in our DB and tell the
    // user we'll finalize the Gumroad side. Avoids a hard failure when the
    // token hasn't been configured yet.
    await getAdminClient()
      .from('profiles')
      .update({ subscription_status: 'cancelling' })
      .eq('id', user.id);
    return NextResponse.json({
      ok: true,
      mode: 'pending-admin',
      message:
        'Cancellation request received. Your Pro access remains active until the end of your current billing period, and we\'ll finalize with our payment provider shortly.',
    });
  }

  // Look up the profile so we know the stored subscription id (if any) and email
  const { data: profile, error: profileErr } = await getAdminClient()
    .from('profiles')
    .select('subscription_id, email, subscription_status')
    .eq('id', user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json({ error: 'Could not load your subscription record.' }, { status: 500 });
  }

  let subscriberId = profile.subscription_id as string | null;

  if (!subscriberId && profile.email) {
    subscriberId = await gumroadFindSubscriberByEmail(profile.email, accessToken);
  }

  if (!subscriberId) {
    return NextResponse.json(
      { error: 'We could not find an active subscription for your account. If you believe this is a mistake, please contact support.' },
      { status: 404 }
    );
  }

  const result = await gumroadCancel(subscriberId, accessToken);
  if (!result.ok) {
    return NextResponse.json({ error: result.message || 'Cancellation failed.' }, { status: 502 });
  }

  await getAdminClient()
    .from('profiles')
    .update({ subscription_status: 'cancelled' })
    .eq('id', user.id);

  return NextResponse.json({
    ok: true,
    mode: 'gumroad-cancelled',
    message:
      'Subscription cancelled. Your Pro access remains active until the end of your current billing period. You can resubscribe any time.',
  });
}
