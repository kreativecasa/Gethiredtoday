"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import { startCheckout } from "@/lib/subscription";

/* ─── Feature lists ──────────────────────────────────────────────────── */

const freeFeatures: Array<{ label: string; included: boolean }> = [
  { label: "1 resume",          included: true  },
  { label: "3 templates",       included: true  },
  { label: "Basic ATS check",   included: true  },
  { label: "TXT download only", included: true  },
  { label: "PDF download",      included: false },
  { label: "AI content suggestions", included: false },
  { label: "Cover letter builder",   included: false },
  { label: "Unlimited resumes",      included: false },
];

const proFeatures: Array<{ label: string }> = [
  { label: "Unlimited resumes"      },
  { label: "All 60+ templates"      },
  { label: "PDF + Word download"    },
  { label: "AI bullet point writer" },
  { label: "AI professional summary"},
  { label: "ATS Score & Checker"    },
  { label: "AI cover letter builder"},
  { label: "Keyword targeting"      },
  { label: "Real-time preview"      },
  { label: "Priority support"       },
  { label: "New templates monthly"  },
  { label: "14-day money-back"      },
];

/* ─── Component ──────────────────────────────────────────────────────── */

export default function PricingToggle() {
  const [annual, setAnnual] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleGetPro = async () => {
    setCheckoutLoading(true);
    await startCheckout(annual ? 'yearly' : 'monthly');
    setCheckoutLoading(false);
  };

  return (
    <div>
      {/* Billing toggle — pill switcher */}
      <div className="flex items-center justify-center mb-12">
        <div className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !annual
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              annual
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Annual
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "#4AB7A6" }}
            >
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">

        {/* ── FREE card ──────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 p-8 flex flex-col bg-white">
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full mb-4">
              Free Forever
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-slate-900">$0</span>
              <span className="text-slate-400 text-sm">/month</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Great for getting started</p>
          </div>

          <div className="border-t border-slate-100 my-2" />

          {/* Features */}
          <ul className="space-y-3 flex-1 mt-4 mb-8">
            {freeFeatures.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                {f.included ? (
                  <Check className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "#4AB7A6" }} />
                ) : (
                  <X className="w-[18px] h-[18px] flex-shrink-0 text-slate-300" />
                )}
                <span className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"}`}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/signup"
            className="block text-center py-3 px-6 h-12 leading-[24px] rounded-full text-sm font-semibold border-2 transition-colors hover:bg-slate-50"
            style={{ borderColor: "#4AB7A6", color: "#4AB7A6" }}
          >
            Start for Free
          </Link>
          <p className="text-xs text-center text-slate-400 mt-3">No credit card required</p>
        </div>

        {/* ── PRO card ───────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-8 flex flex-col relative overflow-hidden bg-white md:scale-[1.03] shadow-xl"
          style={{ border: "2px solid #4AB7A6" }}
        >
          {/* Best Value ribbon */}
          <div
            className="absolute top-0 right-0 px-5 py-1.5 text-xs font-bold text-white"
            style={{ backgroundColor: "#4AB7A6", borderBottomLeftRadius: "12px" }}
          >
            BEST VALUE
          </div>

          {/* Header */}
          <div className="mb-6">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 text-white"
              style={{ backgroundColor: "#4AB7A6" }}
            >
              Pro
            </span>

            {/* Price — changes with toggle */}
            {annual ? (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold" style={{ color: "#4AB7A6" }}>$1.67</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Billed $19.99/year</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold" style={{ color: "#4AB7A6" }}>$2</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
            )}

            <p className="text-sm text-slate-500 mt-2">Everything you need to get hired</p>
            <p className="text-sm text-slate-400 mt-0.5 italic">☕ Less than a coffee per month</p>
          </div>

          <div className="border-t border-slate-100 my-2" />

          {/* Features */}
          <ul className="space-y-3 flex-1 mt-4 mb-8">
            {proFeatures.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <Check className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "#4AB7A6" }} />
                <span className="text-sm text-slate-700">{f.label}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleGetPro}
            disabled={checkoutLoading}
            className="block w-full text-center py-3 px-6 h-12 leading-[24px] rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#4AB7A6" }}
          >
            {checkoutLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Redirecting…
              </span>
            ) : (
              "Get Pro Access →"
            )}
          </button>
          <p className="text-xs text-center text-slate-400 mt-3">14-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}
