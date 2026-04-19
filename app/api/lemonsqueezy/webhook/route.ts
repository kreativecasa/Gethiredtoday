import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }
  return _supabaseAdmin;
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? '';

  // Gumroad signs with X-Gumroad-Signature header (optional but recommended)
  const signature = req.headers.get('x-gumroad-signature') ?? '';
  if (secret && signature && !verifySignature(rawBody, signature, secret)) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Gumroad sends form-encoded data
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const resourceName = params.get('resource_name');
  const email = params.get('email');
  const refunded = params.get('refunded') === 'true';
  const disputed = params.get('disputed') === 'true';
  const productPermalink = params.get('product_permalink') ?? '';

  // Only process webhooks for the Get Hire Today product
  const PRODUCT_PERMALINK = process.env.GUMROAD_PRODUCT_PERMALINK ?? 'kxtcbs';
  if (productPermalink && productPermalink !== PRODUCT_PERMALINK) {
    console.log(`Ignoring webhook for unrelated product: ${productPermalink}`);
    return NextResponse.json({ received: true });
  }

  if (!email) {
    return NextResponse.json({ received: true });
  }

  // Gumroad sends subscription identifiers on sale/cancellation payloads.
  // Capture the subscriber id so we can cancel from inside the app later.
  const subscriberId =
    params.get('subscription_id') ||
    params.get('subscriber_id') ||
    params.get('id') ||
    null;

  try {
    if (resourceName === 'sale' && !refunded && !disputed) {
      // New purchase / subscription started
      await getSupabaseAdmin()
        .from('profiles')
        .update({
          subscription_status: 'active',
          ...(subscriberId && { subscription_id: subscriberId }),
        })
        .eq('email', email);
    } else if (resourceName === 'refund' || refunded) {
      await getSupabaseAdmin()
        .from('profiles')
        .update({ subscription_status: 'free' })
        .eq('email', email);
    } else if (resourceName === 'cancellation') {
      await getSupabaseAdmin()
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('email', email);
    } else if (resourceName === 'subscription_ended' || resourceName === 'subscription_cancelled') {
      await getSupabaseAdmin()
        .from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('email', email);
    }
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
