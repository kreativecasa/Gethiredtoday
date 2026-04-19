/**
 * Landing endpoint the user hits right after Gumroad confirms their payment.
 *
 * Responsibilities:
 *   1. Verify the authenticated user actually has an active Gumroad
 *      subscriber (doesn't blindly trust the redirect — someone could paste
 *      the URL).
 *   2. If verified, flip profiles.subscription_status = 'active'
 *      synchronously so the user doesn't have to wait on the webhook.
 *   3. Redirect the user back to the in-app page they were on before
 *      upgrading (the `to` query param), with `?upgraded=1` so the
 *      destination page can show a "Welcome to Pro" toast.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { monthFromNow } from '@/lib/subscription';

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

// Only allow returning the user to safe in-app paths.
function safeReturnPath(raw: string | null): string {
  if (!raw) return '/dashboard';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/dashboard';
  return raw;
}

// Query Gumroad for the most recent active subscriber tied to this email.
async function findActiveGumroadSubscriber(
  email: string,
  accessToken: string
): Promise<{ subscriberId: string } | null> {
  try {
    const res = await fetch(
      `https://api.gumroad.com/v2/subscribers?email=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as {
      subscribers?: Array<{ id: string; cancelled_at?: string | null; status?: string }>;
    };
    const active = (json.subscribers ?? []).find((s) => !s.cancelled_at);
    return active ? { subscriberId: active.id } : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const to = safeReturnPath(req.nextUrl.searchParams.get('to'));
  const destination = new URL(to, req.nextUrl.origin);

  const ssr = await createServerSupabaseClient();
  const { data: { user } } = await ssr.auth.getUser();

  // If the user isn't logged in for some reason, just send them to the
  // destination. The destination will run its own auth check.
  if (!user || !user.email) {
    destination.searchParams.set('upgraded', 'pending');
    return NextResponse.redirect(destination);
  }

  const accessToken = process.env.GUMROAD_ACCESS_TOKEN;

  if (accessToken) {
    // Verify with Gumroad that this email actually has an active subscription.
    const subscriber = await findActiveGumroadSubscriber(user.email, accessToken);
    if (subscriber) {
      await getAdminClient()
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_id: subscriber.subscriberId,
          // Book the next billing cycle — if the user later cancels, this
          // value is the date their Pro access is honoured until.
          subscription_ends_at: monthFromNow(),
        })
        .eq('id', user.id);
      destination.searchParams.set('upgraded', '1');
      return NextResponse.redirect(destination);
    }
  }

  // Webhook will reconcile shortly. Mark pending so the destination page can
  // show a "processing your upgrade" state rather than a confusing "still
  // Free" view.
  destination.searchParams.set('upgraded', 'pending');
  return NextResponse.redirect(destination);
}
