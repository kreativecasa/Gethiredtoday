import Link from "next/link";
import {
  Sparkles,
  Check,
  Star,
  ArrowRight,
  Download,
  FileText,
  Layout,
  Target,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { TemplatePreview } from "@/components/template-preview";
import type { TemplateLayout } from "@/components/template-preview";
import EmailCapture from "@/components/email-capture";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

const stats = [
  { value: "94%", label: "ATS Pass Rate" },
  { value: "3 min", label: "Average Build Time" },
  { value: "4.8 / 5", label: "User Rating" },
  { value: "$0", label: "To Get Started" },
];

const industries = [
  { title: "Software Engineer", badge: "Technology", count: "12 examples" },
  { title: "Marketing Manager", badge: "Marketing", count: "8 examples" },
  { title: "Registered Nurse", badge: "Healthcare", count: "10 examples" },
  { title: "Data Analyst", badge: "Analytics", count: "7 examples" },
  { title: "Teacher", badge: "Education", count: "6 examples" },
  { title: "Project Manager", badge: "Operations", count: "9 examples" },
  { title: "Graphic Designer", badge: "Creative", count: "5 examples" },
  { title: "Sales Executive", badge: "Sales", count: "8 examples" },
];

const templates: { name: string; category: string; isPro: boolean; accent: string; layout: TemplateLayout }[] = [
  { name: "Classic Professional", category: "General",   isPro: false, accent: "#4AB7A6", layout: "classic"   },
  { name: "Modern Sidebar",       category: "Tech",      isPro: false, accent: "#334155", layout: "sidebar"   },
  { name: "Executive Bold",       category: "Executive", isPro: true,  accent: "#1d4ed8", layout: "executive" },
  { name: "Creative Side-Column", category: "Creative",  isPro: true,  accent: "#7c3aed", layout: "creative"  },
  { name: "Academic Clean",       category: "Academic",  isPro: false, accent: "#be123c", layout: "minimal"   },
  { name: "Contemporary Teal",    category: "Modern",    isPro: false, accent: "#d97706", layout: "centered"  },
];

const testimonials = [
  {
    initials: "MT",
    avatarColor: "#4AB7A6",
    name: "Marcus T.",
    role: "Software Engineer",
    hiredAt: "Stripe",
    quote:
      "I had been applying for 2 months with zero responses. After rebuilding my resume with GetHireToday's AI, I got 5 interview calls in my first week. The ATS checker showed me I was missing keywords that every recruiter looks for.",
  },
  {
    initials: "LK",
    avatarColor: "#0891b2",
    name: "Linda K.",
    role: "Nurse Coordinator",
    hiredAt: "Mass General Hospital",
    quote:
      "The AI bullet points are genuinely impressive. It understood my background as a nurse and wrote achievements I wouldn't have thought to include myself. I updated my resume in 20 minutes and had a job offer within 3 weeks.",
  },
  {
    initials: "PS",
    avatarColor: "#7c3aed",
    name: "Priya S.",
    role: "Product Manager",
    hiredAt: "Shopify",
    quote:
      "As a recent graduate, I had no idea how to write a resume. GetHireToday walked me through every section and the AI filled in what I was missing. For $2 a month, it's the best money I've ever spent on my career.",
  },
];

const freeFeatures = [
  { label: "1 resume", included: true },
  { label: "3 templates", included: true },
  { label: "TXT download", included: true },
  { label: "Basic ATS check", included: true },
  { label: "AI bullet writer", included: false },
];

const proFeatures = [
  { label: "Unlimited resumes", included: true },
  { label: "All 60+ templates", included: true },
  { label: "PDF + Word download", included: true },
  { label: "Full AI suggestions", included: true },
  { label: "AI bullet writer", included: true },
  { label: "ATS checker & score", included: true },
  { label: "Cover letter builder", included: true },
  { label: "Priority support", included: true },
  { label: "New templates monthly", included: true },
];

const blogPosts = [
  {
    category: "Resume Tips",
    readTime: "5 min read",
    title: "How to Write an ATS-Friendly Resume in 2025",
    excerpt:
      "Most resumes are rejected before a human ever reads them. Here's exactly how to format, keyword-optimize, and structure your resume so it passes every ATS filter.",
  },
  {
    category: "Career Advice",
    readTime: "7 min read",
    title: "10 Resume Mistakes That Are Costing You Interviews",
    excerpt:
      "From weak objective statements to missing metrics, these common errors are silently killing your chances. Fix them in under 30 minutes with our step-by-step guide.",
  },
  {
    category: "Resume Tips",
    readTime: "4 min read",
    title: "The Perfect Resume Summary: Examples That Work",
    excerpt:
      "A strong summary gives recruiters a reason to keep reading. We analyzed 10,000 successful resumes to find the exact formula that gets results — with real examples.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK VISUALS
───────────────────────────────────────────────────────────────────────────── */

function HeroResumeCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto select-none" aria-hidden="true">
      {/* Main resume card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          transform: "rotate(1deg)",
          boxShadow:
            "0 32px 64px rgba(15,23,42,0.14), 0 8px 24px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.8)",
        }}
      >
        {/* Teal top accent bar */}
        <div className="h-3 rounded-t-2xl" style={{ backgroundColor: "#4AB7A6" }} />

        {/* Name area */}
        <div className="px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="text-xl font-bold text-slate-900 leading-tight">Alexandra Chen</div>
          <div className="text-sm font-medium mt-0.5" style={{ color: "#4AB7A6" }}>
            Senior Product Manager
          </div>
          <div className="flex gap-3 mt-3">
            <div className="h-2 w-24 rounded-full bg-slate-200" />
            <div className="h-2 w-20 rounded-full bg-slate-200" />
            <div className="h-2 w-16 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Work Experience */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#4AB7A6" }}>
              Work Experience
            </div>
            <div className="h-2.5 w-40 rounded-full bg-slate-800 mb-1" />
            <div className="h-2 w-28 rounded-full bg-slate-300 mb-2.5" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-slate-200" />
              <div className="h-1.5 w-11/12 rounded-full bg-slate-200" />
              <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#4AB7A6" }}>
              Education
            </div>
            <div className="h-2.5 w-36 rounded-full bg-slate-800 mb-1" />
            <div className="h-2 w-24 rounded-full bg-slate-300" />
          </div>

          {/* Skills */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#4AB7A6" }}>
              Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Python", "Figma", "Analytics", "Leadership", "Agile"].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: "#f0fdf9",
                    color: "#4AB7A6",
                    border: "1px solid #ccfbef",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — ATS Score (top right) */}
      <div
        className="absolute -top-3 -right-4 flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl"
        style={{
          backgroundColor: "#ffffff",
          border: "1.5px solid #4AB7A6",
          boxShadow: "0 8px 24px rgba(74,183,166,0.2)",
          minWidth: "90px",
        }}
      >
        <div className="text-xs font-semibold text-slate-500">ATS Score</div>
        <div className="text-2xl font-bold leading-none" style={{ color: "#4AB7A6" }}>
          97
          <span className="text-xs font-normal text-slate-400">/100</span>
        </div>
        {/* Mini bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full" style={{ backgroundColor: "#4AB7A6", width: "97%" }} />
        </div>
      </div>

      {/* Floating badge — Keyword Match (bottom left) */}
      <div
        className="absolute -bottom-3 -left-4 flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #dcfce7",
          boxShadow: "0 4px 16px rgba(34,197,94,0.12)",
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#dcfce7" }}
        >
          <Check className="w-3.5 h-3.5 text-green-600" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">Keyword Match</div>
          <div className="text-xs font-semibold text-green-600">94%</div>
        </div>
      </div>

      {/* Floating badge — AI Enhanced (bottom right) */}
      <div
        className="absolute -bottom-3 -right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: "#f0fdf9",
          border: "1px solid #ccfbef",
          color: "#4AB7A6",
          boxShadow: "0 2px 8px rgba(74,183,166,0.15)",
        }}
      >
        <Sparkles className="w-3 h-3" />
        AI-Enhanced
      </div>
    </div>
  );
}

function FeatureVisualAIWriter() {
  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{ backgroundColor: "#ffffff", border: "1.5px solid #4AB7A6" }}
    >
      <div
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "#4AB7A6" }}
      >
        AI Bullet Generator
      </div>

      {/* Input */}
      <div
        className="rounded-xl p-3 mb-3 text-sm text-slate-600"
        style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
      >
        <div className="text-xs font-medium text-slate-400 mb-1">Your experience</div>
        Managed a team at Shopify and helped with product launches...
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center my-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#4AB7A6" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Output bullets */}
      <div className="space-y-2.5">
        {[
          "Led 12-person cross-functional team, shipping 3 major product features to 1.4M+ users",
          "Drove 28% increase in activation rate through data-informed onboarding redesign",
          "Reduced time-to-launch by 40% by implementing agile sprint cadence across 4 teams",
        ].map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: "#4AB7A6" }}
            />
            <p className="text-xs text-slate-700 leading-relaxed">{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureVisualATSScore() {
  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col items-center justify-center gap-5"
      style={{ backgroundColor: "#f0fdf9", border: "1px solid #ccfbef" }}
    >
      <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#4AB7A6" }}>
        ATS Analysis
      </div>

      {/* Score ring */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#4AB7A6"
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 50 * 0.94} ${2 * Math.PI * 50 * 0.06}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: "#4AB7A6" }}>
            94
          </span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="w-full space-y-2.5">
        {[
          { label: "Keywords", val: 97 },
          { label: "Formatting", val: 100 },
          { label: "Readability", val: 91 },
          { label: "Contact Info", val: 100 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-24">{item.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-slate-200">
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: "#4AB7A6", width: `${item.val}%` }}
              />
            </div>
            <span className="text-xs font-semibold w-6 text-right" style={{ color: "#4AB7A6" }}>
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureVisualTemplates() {
  const colors = ["#4AB7A6", "#334155", "#1d4ed8", "#7c3aed"];
  return (
    <div className="grid grid-cols-2 gap-3">
      {colors.map((color, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(15,23,42,0.06)" }}
        >
          {/* Header stripe */}
          <div className="h-10" style={{ backgroundColor: color }} />
          {/* Body */}
          <div className="bg-white p-3 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-slate-800" />
            <div className="h-1.5 w-1/2 rounded-full bg-slate-300" />
            <div className="h-1 w-full rounded-full bg-slate-200 mt-2" />
            <div className="h-1 w-5/6 rounded-full bg-slate-200" />
            <div className="h-1 w-4/5 rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. You can build, edit, and preview your resume for free with no credit card required. The free plan includes 1 resume and basic templates. Pro unlocks unlimited resumes, all templates, PDF/Word download, and full AI writing.",
  },
  {
    q: "Is GetHireToday ATS compatible?",
    a: "Absolutely. Every template is built with ATS requirements in mind — clean formatting, proper section headings, and machine-readable structure. Our built-in ATS Checker also scans your content for keyword gaps before you apply.",
  },
  {
    q: "How is this different from using ChatGPT?",
    a: "ChatGPT gives you raw text — you still have to format it, organize sections, check ATS compliance, and design the layout yourself. GetHireToday does all of that automatically: AI writing + professional formatting + ATS checking + PDF export, in one place.",
  },
  {
    q: "Does it work for any industry?",
    a: "Yes. We have resume examples and AI writing tailored to 50+ industries including tech, healthcare, education, finance, sales, design, and more. The AI adjusts its suggestions based on your job title and field.",
  },
  {
    q: "Can I import my existing resume?",
    a: "You can manually enter your existing experience into the builder sections. Our AI will then help you rewrite and optimize each bullet point for maximum impact.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, absolutely. Cancel your Pro subscription any time — no questions asked, no cancellation fees. You keep access until the end of your billing period.",
  },
];

function HomeFAQ() {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: "#f8fafc" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#64748b" }}>
            Still have questions?{" "}
            <a href="/contact" className="font-semibold hover:underline" style={{ color: "#4AB7A6" }}>
              Contact us
            </a>
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl px-6 py-5"
              style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
            >
              <p className="font-semibold text-base mb-2" style={{ color: "#0f172a" }}>{faq.q}</p>
              <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Navbar />

      <main className="flex-1">

        {/* ════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28" style={{ backgroundColor: "#ffffff" }}>
          {/* Very subtle teal glow top */}
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, #4AB7A6, transparent)" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">

              {/* Left copy */}
              <div>
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
                  style={{
                    border: "1px solid #4AB7A6",
                    color: "#4AB7A6",
                    backgroundColor: "#f0fdf9",
                  }}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  AI-Powered · ATS-Optimized · Free to Start
                </div>

                <h1
                  className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-5"
                  style={{ color: "#0f172a" }}
                >
                  Your Resume Is{" "}
                  <span style={{ color: "#0f172a" }}>Costing You</span>{" "}
                  Interviews.{" "}
                  <span style={{ color: "#4AB7A6" }}>Let AI Fix That in 3 Minutes.</span>
                </h1>

                <p className="text-xl leading-relaxed mb-8 max-w-lg" style={{ color: "#64748b" }}>
                  GetHireToday&apos;s AI writes tailored bullet points, builds your full resume from scratch,
                  and checks every line for ATS compatibility — so your application actually reaches a human.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    href="/builder/resume"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#4AB7A6" }}
                  >
                    Build My Resume Free →
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/resume-templates"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-full border transition-colors hover:bg-slate-50"
                    style={{
                      color: "#0f172a",
                      borderColor: "#cbd5e1",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    View Templates
                  </Link>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                  {["No credit card needed", "ATS-optimized", "PDF download"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                      {item}
                    </span>
                  ))}
                </div>

                {/* Avatar strip */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      { initials: "M", bg: "#4AB7A6" },
                      { initials: "P", bg: "#7c3aed" },
                      { initials: "L", bg: "#0891b2" },
                      { initials: "A", bg: "#d97706" },
                    ].map(({ initials, bg }) => (
                      <div
                        key={initials}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white"
                        style={{ backgroundColor: bg }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium" style={{ color: "#64748b" }}>
                    Professionals landing jobs with AI
                  </p>
                </div>
              </div>

              {/* Right — Resume card mockup */}
              <div className="flex justify-center lg:justify-end">
                <HeroResumeCard />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 2 — TRUST BAR
        ════════════════════════════════════════════════════════════════ */}
        <section
          className="py-10"
          style={{
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "#94a3b8" }}>
              Trusted by professionals worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`text-center ${i < stats.length - 1 ? "md:border-r md:border-slate-200" : ""}`}
                >
                  <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: "#4AB7A6" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: "#64748b" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS
        ════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-20 lg:py-28" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-14">
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4AB7A6" }}>
                HOW IT WORKS
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Create a Job-Ready Resume in 3 Simple Steps
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
                No design skills needed. No confusing forms. Just a smarter way to land interviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Step 1 */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-5"
                style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-6xl font-bold leading-none select-none" style={{ color: "#4AB7A6", opacity: 0.15 }}>
                    1
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f0fdf9" }}
                  >
                    <Layout className="w-6 h-6" style={{ color: "#4AB7A6" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
                    Choose Your Template
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    Browse 60+ professionally designed templates crafted for every industry. Pick
                    one that matches your style and career level.
                  </p>
                </div>
                {/* Mini template row */}
                <div className="flex gap-2 mt-auto pt-2">
                  {["#4AB7A6", "#334155", "#7c3aed"].map((color) => (
                    <div
                      key={color}
                      className="flex-1 rounded-lg overflow-hidden"
                      style={{ border: "1px solid #e2e8f0" }}
                    >
                      <div className="h-4" style={{ backgroundColor: color }} />
                      <div className="bg-white p-1.5 space-y-1">
                        <div className="h-1 rounded-full bg-slate-300" />
                        <div className="h-1 rounded-full bg-slate-200 w-4/5" />
                        <div className="h-1 rounded-full bg-slate-200 w-3/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2 */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-5"
                style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-6xl font-bold leading-none select-none" style={{ color: "#4AB7A6", opacity: 0.15 }}>
                    2
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f0fdf9" }}
                  >
                    <Sparkles className="w-6 h-6" style={{ color: "#4AB7A6" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
                    Let AI Write Your Content
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    Enter your job title and experience. Our AI generates powerful bullet points,
                    professional summaries, and keyword-optimized content tailored to your role.
                  </p>
                </div>
                {/* AI writing mini mock */}
                <div
                  className="rounded-xl p-3 mt-auto"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div className="text-xs text-slate-400 mb-2">AI writing...</div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200 mb-1.5" />
                  <div className="h-1.5 w-5/6 rounded-full bg-slate-200 mb-1.5" />
                  <div className="flex items-center gap-1">
                    <div
                      className="w-1.5 h-4 rounded-sm"
                      style={{ backgroundColor: "#4AB7A6", animation: "pulse 1s infinite" }}
                    />
                    <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-5"
                style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-6xl font-bold leading-none select-none" style={{ color: "#4AB7A6", opacity: 0.15 }}>
                    3
                  </span>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f0fdf9" }}
                  >
                    <Download className="w-6 h-6" style={{ color: "#4AB7A6" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
                    Download &amp; Get Hired
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    Export your resume as a pixel-perfect PDF, optimized to pass ATS filters used
                    by 99% of Fortune 500 companies.
                  </p>
                </div>
                {/* Download mock */}
                <div className="flex items-center gap-3 mt-auto p-3 rounded-xl" style={{ backgroundColor: "#f0fdf9", border: "1px solid #ccfbef" }}>
                  <div
                    className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#ffffff", border: "1px solid #ccfbef" }}
                  >
                    <FileText className="w-5 h-5" style={{ color: "#4AB7A6" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: "#0f172a" }}>resume_final.pdf</div>
                    <div className="text-xs" style={{ color: "#4AB7A6" }}>ATS Score: 97/100</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        <div className="h-1 w-8 rounded-full bg-green-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 4 — FEATURE DEEP DIVES
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: "#f8fafc" }} className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Everything You Need to Beat the Competition
              </h2>
            </div>

            <div className="space-y-28">

              {/* Feature A — text left, visual right */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4AB7A6" }}>
                    AI CONTENT GENERATION
                  </div>
                  <h3 className="text-3xl font-bold mb-4" style={{ color: "#0f172a" }}>
                    Stop Guessing. Let AI Write Your Resume.
                  </h3>
                  <p className="leading-relaxed mb-6" style={{ color: "#64748b" }}>
                    Our AI analyzes your job title and experience level, then generates tailored
                    bullet points that showcase your impact. No more staring at a blank page. Every
                    bullet starts with a strong action verb and includes quantified achievements
                    wherever possible. The result is a resume that reads like it was written by a
                    professional career coach.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "Role-specific bullet points",
                      "Quantified achievement statements",
                      "Action-verb powered",
                      "Industry-tailored language",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: "#0f172a" }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/builder/resume"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                    style={{ color: "#4AB7A6" }}
                  >
                    Try AI Writer
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <FeatureVisualAIWriter />
                </div>
              </div>

              {/* Feature B — visual left, text right */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <FeatureVisualATSScore />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4AB7A6" }}>
                    ATS OPTIMIZATION
                  </div>
                  <h3 className="text-3xl font-bold mb-4" style={{ color: "#0f172a" }}>
                    Get Past Automated Screeners Every Time
                  </h3>
                  <p className="leading-relaxed mb-6" style={{ color: "#64748b" }}>
                    Over 90% of large companies use Applicant Tracking Systems to filter resumes
                    before a human ever reads them. Our ATS Checker scans your resume against 30+
                    criteria — keywords, formatting, section structure, contact info completeness
                    — and gives you an exact score with actionable fixes. Most users improve their
                    score by 30+ points in under 5 minutes.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "30+ ATS criteria checked",
                      "Keyword gap analysis",
                      "Formatting compliance",
                      "Instant fixes suggested",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: "#0f172a" }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/ats-checker"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                    style={{ color: "#4AB7A6" }}
                  >
                    Check My Resume
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Feature C — text left, visual right */}
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4AB7A6" }}>
                    PROFESSIONAL TEMPLATES
                  </div>
                  <h3 className="text-3xl font-bold mb-4" style={{ color: "#0f172a" }}>
                    60+ Templates Designed to Get Interviews
                  </h3>
                  <p className="leading-relaxed mb-6" style={{ color: "#64748b" }}>
                    Every template was designed with input from professional recruiters and tested
                    against major ATS systems. Choose from modern, classic, creative, executive, and
                    academic styles. All templates are fully customizable — change colors, fonts, and
                    section order with one click.
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      "ATS-tested formats",
                      "Recruiter-approved designs",
                      "One-click customization",
                      "New templates added monthly",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: "#0f172a" }}>
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/resume-templates"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                    style={{ color: "#4AB7A6" }}
                  >
                    Browse Templates
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <FeatureVisualTemplates />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 5 — RESUME EXAMPLES
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4AB7A6" }}>
                RESUME EXAMPLES BY INDUSTRY
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                See What a Great Resume Looks Like in Your Field
              </h2>
              <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
                Browse 500+ real resume examples across every industry and experience level.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {industries.map((item) => (
                <Link
                  key={item.title}
                  href="/resume-examples"
                  className="group bg-white rounded-xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
                  style={{
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-snug" style={{ color: "#0f172a" }}>
                      {item.title}
                    </h3>
                    <ArrowRight
                      className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "#4AB7A6" }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "#f0fdf9", color: "#4AB7A6" }}
                    >
                      {item.badge}
                    </span>
                    <span className="text-xs" style={{ color: "#94a3b8" }}>{item.count}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/resume-examples"
                className="inline-flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all"
                style={{ color: "#4AB7A6" }}
              >
                Browse All 500+ Examples
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 6 — TEMPLATES SHOWCASE
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Professional Templates for Every Career
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.name}
                  className="group relative rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
                >
                  {/* Rich resume preview */}
                  <div className="relative overflow-hidden bg-slate-100" style={{ height: "240px" }}>
                    <div className="absolute inset-0 flex items-stretch justify-stretch p-2">
                      <div
                        className="flex-1 rounded-lg overflow-hidden"
                        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08)" }}
                      >
                        <TemplatePreview layout={tpl.layout} accent={tpl.accent} />
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "rgba(15,23,42,0.45)" }}
                    >
                      <Link
                        href="/builder/resume"
                        className="px-6 py-2.5 rounded-full text-sm font-semibold bg-white hover:bg-slate-50 transition-colors shadow-lg"
                        style={{ color: "#4AB7A6" }}
                      >
                        Use Template →
                      </Link>
                    </div>

                    {/* PRO badge */}
                    {tpl.isPro && (
                      <div className="absolute top-3 left-3 text-[10px] font-bold bg-amber-400 text-amber-900 rounded-full px-2 py-0.5 shadow-sm">
                        PRO
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="px-4 py-3 flex items-center justify-between bg-white" style={{ borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#0f172a" }}>{tpl.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{tpl.category}</div>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={
                        tpl.isPro
                          ? { backgroundColor: "#fef3c7", color: "#d97706" }
                          : { backgroundColor: "#f0fdf9", color: "#4AB7A6" }
                      }
                    >
                      {tpl.isPro ? "PRO" : "FREE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/resume-templates"
                className="inline-flex items-center gap-1.5 font-semibold text-sm hover:gap-2.5 transition-all"
                style={{ color: "#4AB7A6" }}
              >
                Browse All 60+ Templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 7 — TESTIMONIALS
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Real People. Real Jobs. Real Results.
              </h2>
              <p className="text-lg" style={{ color: "#64748b" }}>
                Here&apos;s what job seekers are saying after using GetHireToday.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-8 flex flex-col gap-4"
                  style={{
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-base italic leading-relaxed" style={{ color: "#475569" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: t.avatarColor }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: "#0f172a" }}>{t.name}</div>
                      <div className="text-xs" style={{ color: "#94a3b8" }}>{t.role}</div>
                    </div>
                  </div>

                  {/* Hired badge */}
                  <div
                    className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#f0fdf9", color: "#4AB7A6" }}
                  >
                    <Check className="w-3 h-3" />
                    Hired at {t.hiredAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 8 — PRICING TEASER
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#f0fdf9" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Surprisingly Affordable. Impossibly Good.
              </h2>
              <p className="text-lg" style={{ color: "#64748b" }}>
                While competitors charge $29+/month, we give you everything for $2.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Free card */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-6"
                style={{ border: "1.5px solid #e2e8f0" }}
              >
                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
                  >
                    Free
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold" style={{ color: "#0f172a" }}>$0</span>
                    <span className="text-sm mb-1.5" style={{ color: "#94a3b8" }}>/month</span>
                  </div>
                  <p className="text-sm mt-2" style={{ color: "#64748b" }}>Perfect for getting started</p>
                </div>

                <ul className="flex-1 space-y-3">
                  {freeFeatures.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                      ) : (
                        <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                          <span className="w-3 h-0.5 bg-slate-300 rounded-full" />
                        </span>
                      )}
                      <span style={{ color: f.included ? "#0f172a" : "#94a3b8" }}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/builder/resume"
                  className="block text-center py-3 px-6 rounded-full text-sm font-semibold border-2 transition-colors hover:bg-slate-50"
                  style={{ borderColor: "#4AB7A6", color: "#4AB7A6" }}
                >
                  Start Free
                </Link>
              </div>

              {/* Pro card */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden"
                style={{
                  border: "2px solid #4AB7A6",
                  boxShadow: "0 12px 40px rgba(74,183,166,0.18)",
                }}
              >
                {/* Most Popular badge */}
                <div
                  className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold text-white rounded-bl-2xl"
                  style={{ backgroundColor: "#4AB7A6" }}
                >
                  Most Popular
                </div>

                <div>
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: "#f0fdf9", color: "#4AB7A6" }}
                  >
                    Pro
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold" style={{ color: "#4AB7A6" }}>$2</span>
                    <span className="text-sm mb-1.5" style={{ color: "#94a3b8" }}>/month</span>
                  </div>
                  <p className="text-sm mt-2 italic" style={{ color: "#64748b" }}>
                    ☕ Less than your daily coffee
                  </p>
                </div>

                <ul className="flex-1 space-y-3">
                  {proFeatures.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#4AB7A6" }} />
                      <span style={{ color: "#0f172a" }}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/pricing"
                  className="block text-center py-3 px-6 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#4AB7A6" }}
                >
                  Get Pro →
                </Link>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                style={{ color: "#4AB7A6" }}
              >
                See Full Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 9 — BLOG PREVIEW
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#0f172a" }}>
                Career Advice &amp; Resume Tips
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article
                  key={post.title}
                  className="bg-white rounded-xl flex flex-col gap-4 overflow-hidden transition-all hover:-translate-y-0.5"
                  style={{
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                  }}
                >
                  {/* Colored top accent */}
                  <div className="h-1.5" style={{ backgroundColor: "#4AB7A6" }} />

                  <div className="px-6 pb-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "#f0fdf9", color: "#4AB7A6" }}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs" style={{ color: "#94a3b8" }}>{post.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold leading-snug" style={{ color: "#0f172a" }}>
                      {post.title}
                    </h3>

                    <p className="text-sm leading-relaxed flex-1" style={{ color: "#64748b" }}>
                      {post.excerpt}
                    </p>

                    <Link
                      href="/resources"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto hover:gap-2.5 transition-all"
                      style={{ color: "#4AB7A6" }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 10 — PROBLEM SECTION
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#0f172a" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4AB7A6" }}>
              THE PROBLEM
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              75% of Resumes Never Reach a Human Recruiter.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Applicant Tracking Systems automatically reject resumes that use the wrong keywords,
              formatting, or structure — before any human reads them. If you&apos;re not getting
              callbacks, your resume is failing ATS, not the recruiter.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {[
                { stat: "75%", label: "Resumes rejected by ATS before a human sees them" },
                { stat: "6 sec", label: "Average time a recruiter spends on a resume" },
                { stat: "3 min", label: "Time to build an ATS-ready resume with GetHireToday" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl p-6" style={{ backgroundColor: "#1e293b" }}>
                  <div className="text-4xl font-bold mb-2" style={{ color: "#4AB7A6" }}>{item.stat}</div>
                  <p className="text-sm text-slate-400 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/builder/resume"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#4AB7A6" }}
            >
              Fix My Resume Now — It&apos;s Free →
            </Link>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 11 — FAQ
        ════════════════════════════════════════════════════════════════ */}
        <HomeFAQ />

        {/* ════════════════════════════════════════════════════════════════
            SECTION 12 — FINAL CTA
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28" style={{ backgroundColor: "#4AB7A6" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Your Next Job Is One Resume Away.
            </h2>
            <p className="text-lg text-white mb-10" style={{ opacity: 0.9 }}>
              No credit card. No design skills. Start building instantly and download a polished,
              ATS-ready resume in minutes.
            </p>
            <Link
              href="/builder/resume"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-bold transition-colors hover:bg-slate-100"
              style={{ backgroundColor: "#ffffff", color: "#4AB7A6" }}
            >
              Build My Resume — Free →
            </Link>
            <p className="text-sm mt-6 text-white" style={{ opacity: 0.7 }}>
              No credit card · Cancel anytime · 14-day money-back guarantee
            </p>
          </div>
        </section>

      </main>

      <EmailCapture />
      <Footer />
    </div>
  );
}
