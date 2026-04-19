'use client';

import { useState, useEffect } from 'react';
import {
  Crown,
  Check,
  Loader2,
  CreditCard,
  AlertTriangle,
  Zap,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase';

const PRO_FEATURES = [
  'Unlimited resumes & cover letters',
  'AI-powered writing & suggestions',
  'ATS compatibility analysis',
  'Priority customer support',
  'All premium templates',
];

export default function BillingPage() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [memberSince, setMemberSince] = useState<string>('');
  const [activatedAt, setActivatedAt] = useState<Date | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  // After the cancel endpoint succeeds, flip the card to a "Cancelled"
  // state in-place (no external redirect, no page reload). User continues
  // to have Pro access until the end of their billing period.
  const [cancelled, setCancelled] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, created_at, updated_at')
        .eq('id', user.id)
        .single();
      const status = profile?.subscription_status;
      const active = status === 'active' || status === 'trialing' || status === 'pro';
      const isCancelled = status === 'cancelled' || status === 'cancelling';
      // Even when cancelled, the user still has Pro UX until the billing
      // period ends — we keep isPro truthy so they see the Pro features list.
      setIsPro(active || isCancelled);
      setCancelled(isCancelled);
      if (profile?.created_at) {
        setMemberSince(new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      }
      if ((active || isCancelled) && profile?.updated_at) {
        setActivatedAt(new Date(profile.updated_at));
      }
      setLoading(false);
    });
  }, []);

  const handleUpgrade = () => {
    setUpgradeLoading(true);
    // Carry the current path as `from` so the user bounces back here after
    // payment with Pro status already reflected.
    const from = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';
    window.location.href = `/api/lemonsqueezy/checkout-redirect?from=${encodeURIComponent(from)}`;
  };

  const handleManageSubscription = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch('/api/lemonsqueezy/portal', { method: 'POST' });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
    } catch {
      setUpgradeLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setCancelError(null);
    setCancelMessage(null);
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setCancelError(
          json?.error ||
          'We could not cancel your subscription. Please contact support and we\'ll take care of it.'
        );
        return;
      }
      // Flip the UI in place — no redirect. Keep isPro so the user still
      // sees their Pro benefits until the billing period ends.
      setCancelled(true);
      setShowCancelConfirm(false);
      setCancelMessage(
        json.message ||
        'Subscription cancelled. Your Pro access remains active until the end of your current billing period.'
      );
    } catch {
      setCancelError('Network error. Please try again in a moment.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Next billing = same day next month from activation date (or today if unknown)
  const nextBillingDate = (() => {
    const base = activatedAt ? new Date(activatedAt) : new Date();
    base.setMonth(base.getMonth() + 1);
    return base.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  })();

  // Billing history: one real entry based on when subscription was activated
  const billingEntry = activatedAt
    ? {
        date: activatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        description: `Get Hire Today Pro – ${activatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      }
    : null;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your subscription and payment details</p>
      </div>

      {/* Current Plan */}
      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            Current Plan
          </h2>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">Pro Plan</span>
                    {cancelled ? (
                      <Badge
                        className="text-xs rounded-full"
                        style={{ backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                      >
                        Cancelled
                      </Badge>
                    ) : (
                      <Badge
                        className="text-white text-xs rounded-full"
                        style={{ backgroundColor: '#4AB7A6' }}
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#4AB7A6' }}>
                    $2<span className="text-sm font-normal text-gray-400">/month</span>
                  </p>
                  {cancelled ? (
                    <p className="text-sm text-gray-500 mt-0.5">
                      Pro access continues until <span className="font-semibold text-gray-700">{nextBillingDate}</span>. You won&apos;t be charged again.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-0.5">Next billing date: {nextBillingDate}</p>
                  )}
                  {memberSince && <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>}
                </div>
                {!cancelled && (
                  <Button
                    variant="outline"
                    className="rounded-full font-medium border-gray-200"
                    onClick={handleManageSubscription}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Manage'}
                  </Button>
                )}
              </div>

              {/* Post-cancellation success banner */}
              {cancelled && cancelMessage && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800">{cancelMessage}</p>
                </div>
              )}

              <Separator />

              <ul className="space-y-1.5">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 shrink-0" style={{ color: '#4AB7A6' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Separator />

              {cancelled ? (
                <Button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="rounded-full text-white font-semibold"
                  style={{ backgroundColor: '#4AB7A6' }}
                >
                  {upgradeLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting…</>
                  ) : (
                    <><Crown className="w-4 h-4 mr-2" />Resubscribe to Pro — $2/mo</>
                  )}
                </Button>
              ) : !showCancelConfirm ? (
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                  onClick={() => {
                    setShowCancelConfirm(true);
                    setCancelError(null);
                  }}
                >
                  Cancel subscription
                </button>
              ) : (
                <div className="p-4 rounded-xl border border-red-100 bg-red-50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Cancel your subscription?</p>
                      <p className="text-xs text-red-500 mt-0.5">
                        You&apos;ll lose access to Pro features at the end of your billing period. You can re-subscribe any time.
                      </p>
                    </div>
                  </div>
                  {cancelError && (
                    <p className="text-xs font-medium text-red-600 bg-white border border-red-100 rounded-lg px-3 py-2">
                      {cancelError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-gray-200"
                      onClick={() => {
                        setShowCancelConfirm(false);
                        setCancelError(null);
                      }}
                      disabled={cancelLoading}
                    >
                      Keep subscription
                    </Button>
                    <Button
                      size="sm"
                      className="rounded-full bg-red-500 hover:bg-red-600 text-white font-medium"
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Cancelling…</>
                      ) : (
                        'Yes, cancel'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">Free Plan</span>
                    <Badge variant="outline" className="text-xs rounded-full text-gray-500 border-gray-200">
                      Current
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Limited to 3 resumes, basic templates only</p>
                </div>
              </div>

              <div
                className="rounded-xl p-5 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #4AB7A6 0%, #3aa090 100%)' }}
              >
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white/90" />
                    <span className="font-bold text-lg">Upgrade to Pro</span>
                    <span className="ml-auto text-2xl font-bold">$2<span className="text-sm font-normal opacity-80">/mo</span></span>
                  </div>
                  <ul className="space-y-1">
                    {PRO_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-white/90">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-2 bg-white font-semibold rounded-full hover:bg-gray-50 transition-colors"
                    style={{ color: '#4AB7A6' }}
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting…</>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Now – $2/month
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      {isPro && (
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              Payment Method
            </h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-gray-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Managed via Gumroad</p>
                  <p className="text-xs text-gray-400">Click Manage to update payment details</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-200 text-sm font-medium"
                onClick={handleManageSubscription}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Billing History
          </h2>
        </CardHeader>
        <CardContent>
          {!isPro || !billingEntry ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {isPro ? 'Billing history is managed via Gumroad.' : 'No billing history yet.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="flex items-center justify-between py-3.5 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{billingEntry.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{billingEntry.date}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">$2.00</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">Paid</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
