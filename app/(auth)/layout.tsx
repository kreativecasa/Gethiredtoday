import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles, Star } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
      <div className="flex flex-col w-full md:w-1/2 min-h-screen px-8 py-10 md:px-12 bg-white">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group"
            aria-label="GetHireToday home"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: '#4AB7A6' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </span>
            <span className="text-lg font-bold text-slate-900">GetHireToday</span>
          </Link>
        </div>

        {/* Main content — vertically centered in available space */}
        <div className="flex-1 flex flex-col justify-center py-12">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>

        {/* Footer links */}
        <div className="flex-shrink-0 flex items-center justify-center gap-4 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">Help</Link>
        </div>
      </div>

      {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
      <div
        className="hidden md:flex w-1/2 min-h-screen flex-col items-center justify-center p-12"
        style={{ backgroundColor: '#f0fdf9' }}
      >
        <div className="max-w-sm w-full space-y-8">
          {/* Testimonial */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#d1f0ec]">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            <blockquote className="text-slate-800 font-semibold text-lg leading-snug mb-6">
              &ldquo;The smartest career investment I&rsquo;ve ever made. Got hired in 3 weeks.&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: '#4AB7A6' }}
              >
                MT
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Marcus T.</div>
                <div className="text-xs text-slate-500">Software Engineer at Stripe</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            {[
              { label: 'Resumes Created', value: '127,400+' },
              { label: 'ATS Pass Rate', value: '94%' },
              { label: 'All-In Price', value: '$2/month' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-[#d1f0ec] shadow-sm"
              >
                <span className="text-sm text-slate-500">{stat.label}</span>
                <span className="text-sm font-bold text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Mock resume card */}
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100"
            style={{ transform: 'rotate(-1.5deg)' }}
          >
            {/* Teal header bar */}
            <div className="h-8 w-full" style={{ backgroundColor: '#4AB7A6' }} />
            {/* Body with simulated lines */}
            <div className="p-4 space-y-2">
              <div className="h-3 w-2/3 rounded-full bg-slate-200" />
              <div className="h-2 w-1/2 rounded-full bg-slate-100" />
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100" />
              <div className="h-2 w-5/6 rounded-full bg-slate-100" />
              <div className="h-2 w-4/6 rounded-full bg-slate-100" />
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100" />
              <div className="h-2 w-3/4 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
