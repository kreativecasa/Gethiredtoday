"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Search, TrendingUp } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

type Category =
  | "All"
  | "Resume Writing"
  | "Cover Letters"
  | "Job Search"
  | "Interview Prep"
  | "Career Advice";

const categories: Category[] = [
  "All",
  "Resume Writing",
  "Cover Letters",
  "Job Search",
  "Interview Prep",
  "Career Advice",
];

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: Exclude<Category, "All">;
  readTime: number;
  date: string;
  featured?: boolean;
  author: string;
  authorInitial: string;
  accentColor: string;
  accentBg: string;
}

const categoryColors: Record<Exclude<Category, "All">, string> = {
  "Resume Writing": "bg-teal-100 text-teal-700",
  "Cover Letters": "bg-violet-100 text-violet-700",
  "Job Search": "bg-blue-100 text-blue-700",
  "Interview Prep": "bg-amber-100 text-amber-700",
  "Career Advice": "bg-green-100 text-green-700",
};

// Map resource articles to their matching blog posts.
// Unmapped articles fall back to /blog (the blog index) instead of a 404.
const RESOURCE_TO_BLOG: Record<number, string> = {
  1: "ats-friendly-resume-tips",
  2: "how-to-write-ats-friendly-resume-2025",
  3: "resume-mistakes-costing-you-interviews",
  4: "resume-summary-examples-that-get-interviews",
  5: "how-to-write-a-cover-letter",
  9: "skills-to-put-on-a-resume",
};

function articleHref(id: number): string {
  const slug = RESOURCE_TO_BLOG[id];
  return slug ? `/blog/${slug}` : "/blog";
}

const articles: Article[] = [
  {
    id: 1,
    title: "The Complete Guide to ATS-Optimized Resumes in 2025",
    excerpt:
      "Applicant Tracking Systems scan your resume before a human ever sees it. Learn the exact strategies that help you pass ATS filters and land more interviews.",
    category: "Resume Writing",
    readTime: 8,
    date: "Apr 10, 2025",
    featured: true,
    author: "Sarah Kim",
    authorInitial: "S",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 2,
    title: "How to Write an ATS-Friendly Resume in 2025",
    excerpt:
      "Step-by-step guide to formatting your resume so it passes automated screening and reaches real recruiters.",
    category: "Resume Writing",
    readTime: 5,
    date: "Apr 8, 2025",
    author: "James Carter",
    authorInitial: "J",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 3,
    title: "10 Resume Mistakes That Are Costing You Interviews",
    excerpt:
      "From generic summaries to poor formatting, these common mistakes silently kill your chances. Here's how to fix every one.",
    category: "Resume Writing",
    readTime: 7,
    date: "Apr 5, 2025",
    author: "Priya Nair",
    authorInitial: "P",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 4,
    title: "The Perfect Resume Summary: 25 Examples That Work",
    excerpt:
      "Your resume summary is the first thing recruiters read. Use these proven examples to craft one that makes them keep reading.",
    category: "Resume Writing",
    readTime: 8,
    date: "Apr 3, 2025",
    author: "Marcus Lee",
    authorInitial: "M",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 5,
    title: "How to Write a Cover Letter for 2025",
    excerpt:
      "A strong cover letter can be the difference between getting an interview and being ignored. Discover the proven formula hiring managers want to see.",
    category: "Cover Letters",
    readTime: 6,
    date: "Apr 1, 2025",
    author: "Amy Zhang",
    authorInitial: "A",
    accentColor: "#7c3aed",
    accentBg: "#faf5ff",
  },
  {
    id: 6,
    title: "Tailoring Your Resume for Each Job Application",
    excerpt:
      "One-size-fits-all resumes don't work. This guide shows you how to customize your resume for each role in under 15 minutes.",
    category: "Job Search",
    readTime: 5,
    date: "Mar 28, 2025",
    author: "David Park",
    authorInitial: "D",
    accentColor: "#2563eb",
    accentBg: "#eff6ff",
  },
  {
    id: 7,
    title: "Top 50 Resume Action Verbs That Get Results",
    excerpt:
      "Weak verbs kill strong bullet points. Replace vague language with these powerful action verbs that make recruiters take notice.",
    category: "Resume Writing",
    readTime: 4,
    date: "Mar 25, 2025",
    author: "Sarah Kim",
    authorInitial: "S",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 8,
    title: "How to Ace a Behavioral Interview",
    excerpt:
      "Behavioral questions trip up even strong candidates. Master the STAR method with these real examples and practice frameworks.",
    category: "Interview Prep",
    readTime: 10,
    date: "Mar 22, 2025",
    author: "Marcus Lee",
    authorInitial: "M",
    accentColor: "#d97706",
    accentBg: "#fffbeb",
  },
  {
    id: 9,
    title: "Resume Skills Section: What to Include in 2025",
    excerpt:
      "Your skills section can make or break your ATS ranking. Here's exactly which skills to include based on your industry and role.",
    category: "Resume Writing",
    readTime: 5,
    date: "Mar 19, 2025",
    author: "Amy Zhang",
    authorInitial: "A",
    accentColor: "#4AB7A6",
    accentBg: "#f0fdfa",
  },
  {
    id: 10,
    title: "How to Explain Employment Gaps on a Resume",
    excerpt:
      "Employment gaps are more common than ever. Here's how to address them honestly and confidently without derailing your application.",
    category: "Career Advice",
    readTime: 6,
    date: "Mar 15, 2025",
    author: "Priya Nair",
    authorInitial: "P",
    accentColor: "#059669",
    accentBg: "#f0fdf4",
  },
  {
    id: 11,
    title: "The STAR Method for Interview Answers",
    excerpt:
      "Structure your interview answers like a pro using Situation, Task, Action, Result. Includes 12 sample answers you can adapt.",
    category: "Interview Prep",
    readTime: 7,
    date: "Mar 12, 2025",
    author: "James Carter",
    authorInitial: "J",
    accentColor: "#d97706",
    accentBg: "#fffbeb",
  },
  {
    id: 12,
    title: "How to Negotiate Your Salary Like a Pro",
    excerpt:
      "Most people leave money on the table by not negotiating. Here's a step-by-step guide backed by real data and scripts.",
    category: "Career Advice",
    readTime: 8,
    date: "Mar 8, 2025",
    author: "David Park",
    authorInitial: "D",
    accentColor: "#059669",
    accentBg: "#f0fdf4",
  },
  {
    id: 13,
    title: "Changing Careers: How to Write a Career Change Resume",
    excerpt:
      "Pivoting industries is challenging, but the right resume can bridge the gap. Learn how to position your transferable skills compellingly.",
    category: "Career Advice",
    readTime: 9,
    date: "Mar 5, 2025",
    author: "Amy Zhang",
    authorInitial: "A",
    accentColor: "#059669",
    accentBg: "#f0fdf4",
  },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");

  const featuredArticle = articles.find((a) => a.featured);

  const filtered = articles.filter((a) => {
    if (a.featured) return false;
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-slate-50 py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Resume Tips &amp; Career Advice
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Expert guidance from professional resume writers and career coaches. Practical tips you
              can apply today.
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 focus:border-[#4AB7A6] focus:outline-none focus:ring-2 focus:ring-[#4AB7A6]/20 text-sm bg-white"
              />
            </div>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={activeCategory === cat ? { backgroundColor: '#4AB7A6' } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured article */}
            {featuredArticle &&
              (activeCategory === "All" || activeCategory === featuredArticle.category) &&
              !search && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={15} style={{ color: '#4AB7A6' }} />
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#4AB7A6' }}
                    >
                      Featured Article
                    </span>
                  </div>
                  <Link href={articleHref(featuredArticle.id)} className="group block">
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-5">
                      {/* Visual side */}
                      <div
                        className="lg:col-span-2 h-56 lg:h-auto flex items-center justify-center"
                        style={{ backgroundColor: featuredArticle.accentBg }}
                      >
                        <div className="text-center p-8">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: featuredArticle.accentColor }}
                          >
                            <BookOpen size={28} className="text-white" />
                          </div>
                          <p
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: featuredArticle.accentColor }}
                          >
                            Featured Guide
                          </p>
                        </div>
                      </div>

                      {/* Text side */}
                      <div className="lg:col-span-3 p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              categoryColors[featuredArticle.category]
                            }`}
                          >
                            {featuredArticle.category}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock size={12} />
                            {featuredArticle.readTime} min read
                          </div>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#4AB7A6] transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: '#4AB7A6' }}
                            >
                              {featuredArticle.authorInitial}
                            </div>
                            <span className="text-sm text-slate-500">{featuredArticle.author}</span>
                            <span className="text-slate-200">·</span>
                            <span className="text-sm text-slate-400">{featuredArticle.date}</span>
                          </div>
                          <span
                            className="inline-flex items-center gap-1 text-sm font-semibold"
                            style={{ color: '#4AB7A6' }}
                          >
                            Read Article <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

            {/* Results count */}
            <p className="text-sm text-slate-400 mb-6">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Articles grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((article) => (
                  <Link
                    key={article.id}
                    href={articleHref(article.id)}
                    className="group bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all flex flex-col overflow-hidden"
                  >
                    {/* Color accent strip */}
                    <div className="h-1" style={{ backgroundColor: article.accentColor }} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Category + read time */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            categoryColors[article.category]
                          }`}
                        >
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Clock size={11} />
                          {article.readTime} min
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-[#4AB7A6] transition-colors leading-snug flex-1">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: '#4AB7A6' }}
                        >
                          {article.authorInitial}
                        </div>
                        <span className="text-xs text-slate-500">{article.author}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-xs text-slate-400 flex-1">{article.date}</span>
                        <ArrowRight
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#4AB7A6' }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 text-lg mb-4">No articles found</p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#4AB7A6' }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 sm:p-10">
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Get Weekly Career Tips</h2>
                <p className="text-slate-500 mb-7 text-sm">
                  Resume tips, job search strategies, and career advice in your inbox every week. No spam, ever.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3 rounded-full border border-slate-200 focus:border-[#4AB7A6] focus:outline-none focus:ring-2 focus:ring-[#4AB7A6]/20 text-sm bg-white"
                  />
                  <button
                    className="px-6 py-3 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90 shrink-0"
                    style={{ backgroundColor: '#4AB7A6' }}
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Join 12,000+ subscribers. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
