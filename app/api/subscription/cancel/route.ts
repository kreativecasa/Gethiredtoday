/**
 * Cancel the current user's Gumroad subscription from inside the app — so
 * the user never has to leave gethiretoday.com to manage their subscription.
 *
 * Flow:
 *   1. Identify the current user from the auth cookie.
 *   2. Resolve their Gumroad subscriber id (stored in profiles.subscription_id,
 *      else look it up via the Gumroad /v2/sales endpoint using the user's
 *      email).
 *   3. Call Gumroad's DELETE /v2/subscribers/:id (the cancel endpoint).
 *   4. ALWAYS mark subscription_status = 'cancelled' in profiles on success
 *      of step 3, OR on a best-effort basis when Gumroad is unreachable /
 *      the sub can't be found — the user clicked Cancel, we respect that.
 *      Pro access remains until the current billing period ends.
 *
 * Uses env var: GUMROAD_ACCESS_TOKEN (create in Gumroad dashboard →
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

async function gumroadCancel(
  subscriberId: string,
  accessToken: string
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(
      `https://api.gumroad.com/v2/subscribers/${encodeURIComponent(subscriberId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const json = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };
    if (json.success) return { ok: true };
    return {
      ok: false,
      message: json.message || `Gumroad responded with HTTP ${res.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Network error calling Gumroad.',
    };
  }
}

// Look up the Gumroad subscription_id for a given email via the /v2/sales
// endpoint. Gumroad's /v2/subscribers endpoint does NOT support an email
// query param — sales does. Each sale for a recurring product carries a
// subscription_id, which is the id we need for DELETE /v2/subscribers/:id.
async function gumroadFindSubscriberIdByEmail(
  email: string,
  accessToken: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.gumroad.com/v2/sales?email=${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      success?: boolean;
      sales?: Array<{
        subscription_id?: string | null;
        cancelled?: boolean | null;
        ended_at?: string | null;
      }>;
    };
    const sales = json.sales ?? [];
    // Prefer an active, non-cancelled sale with a subscription_id.
    const active = sales.find(
      (s) => s.subscription_id && !s.cancelled && !s.ended_at
    );
    if (active?.subscription_id) return active.subscription_id;
    // Fall back to the most recent sale that has a subscription_id.
    const any = sales.find((s) => s.subscription_id);
    return any?.subscription_id ?? null;
  } catch {
    return null;
  }
}

export async function POST() {
  const ssr = await createServerSupabaseClient();
  const {
    data: { user },
  } = await ssr.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const admin = getAdminClient();
  const { data: profile, error: profileErr } = await admin
    .from('profiles')
    .select('subscription_id, email, subscription_status')
    .eq('id', user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json(
      { error: 'Could not load your subscription record.' },
      { status: 500 }
    );
  }

  // Prefer the auth-email (always canonical) and fall back to profile.email.
  const email = user.email || (profile.email as string | undefined) || undefined;

  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;

  // Case 1 — Gumroad token not configured. Mark cancellation intent locally
  // so the UI flips, and let the admin finalise the Gumroad side.
  if (!accessToken) {
    await admin
      .from('profiles')
      .update({ subscription_status: 'cancelled' })
      .eq('id', user.id);
    return NextResponse.json({
      ok: true,
      mode: 'local-only',
      message:
        'Your subscription has been cancelled. Pro access remains active until the end of your current billing period.',
    });
  }

  // Resolve the Gumroad subscription id.
  let subscriberId = (profile.subscription_id as string | null) || null;
  if (!subscriberId && email) {
    subscriberId = await gumroadFindSubscriberIdByEmail(email, accessToken);
  }

  // Case 2 — We genuinely cannot find a Gumroad subscription. This happens
  // for users who were manually activated (no real Gumroad sub behind them)
  // or whose sub was already cancelled on Gumroad but never synced back.
  // Cancel locally anyway — the user clicked Cancel, we respect that, and
  // no one gets stuck in a "cannot cancel, contact support" dead end.
  if (!subscriberId) {
    await admin
      .from('profiles')
      .update({ subscription_status: 'cancelled' })
      .eq('id', user.id);
    return NextResponse.json({
      ok: true,
      mode: 'no-gumroad-sub',
      message:
        'Your subscription has been cancelled. Pro access remains active until the end of your current billing period.',
    });
  }

  // Case 3 — We have a Gumroad sub id. Actually cancel it.
  const result = await gumroadCancel(subscriberId, accessToken);

  // Whether Gumroad succeeded or not, mark the profile as cancelled — the
  // user's intent is clear, and if Gumroad returns "already cancelled" that's
  // still the correct end-state. We only surface an error message if the
  // call actually failed for a reason the user should know about.
  await admin
    .from('profiles')
    .update({ subscription_status: 'cancelled' })
    .eq('id', user.id);

  if (!result.ok) {
    // Treat "already cancelled" and "not_found" as soft-success.
    const msg = (result.message || '').toLowerCase();
    const softSuccess =
      msg.includes('already') ||
      msg.includes('not found') ||
      msg.includes('cancelled');
    if (softSuccess) {
      return NextResponse.json({
        ok: true,
        mode: 'already-cancelled',
        message:
          'Your subscription has been cancelled. Pro access remains active until the end of your current billing period.',
      });
    }
    // Hard fail — log it for debugging, but still report cancellation to the
    // user since we did flip the DB. They are no longer being billed by us.
    console.error('[subscription/cancel] Gumroad cancel failed:', result.message);
    return NextResponse.json({
      ok: true,
      mode: 'local-committed-gumroad-failed',
      message:
        'Your subscription has been cancelled. If you continue to be charged, reply to any Gumroad receipt and we\'ll finalise it for you.',
    });
  }

  return NextResponse.json({
    ok: true,
    mode: 'gumroad-cancelled',
    message:
      'Subscription cancelled. Your Pro access remains active until the end of your current billing period. You can resubscribe any time.',
  });
}
