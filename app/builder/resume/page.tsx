'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/navbar';
import { TemplatePreview, type TemplateLayout } from '@/components/template-preview';

/* ─── Template data ──────────────────────────────────────────────────── */
type Category = 'All' | 'Professional' | 'Modern' | 'Creative' | 'Simple' | 'Executive' | 'Academic';
const CATEGORIES: Category[] = ['All', 'Professional', 'Modern', 'Creative', 'Simple', 'Executive', 'Academic'];

interface Template {
  id: string;
  builderId: string;
  name: string;
  category: Exclude<Category, 'All'>;
  isPro: boolean;
  accent: string;
  layout: TemplateLayout;
  description: string;
}

const TEMPLATES: Template[] = [
  { id: 'classic-professional', builderId: 'classic',   name: 'Classic Professional', category: 'Professional', isPro: false, accent: '#4AB7A6', layout: 'classic',   description: 'Clean ATS-friendly single-column' },
  { id: 'modern-sidebar',       builderId: 'modern',    name: 'Modern Sidebar',       category: 'Modern',       isPro: false, accent: '#1e293b', layout: 'sidebar',   description: 'Two-column with dark sidebar' },
  { id: 'executive-bold',       builderId: 'executive', name: 'Executive Bold',       category: 'Executive',    isPro: true,  accent: '#0f172a', layout: 'executive', description: 'Authoritative dark header' },
  { id: 'creative-spectrum',    builderId: 'creative',  name: 'Creative Spectrum',    category: 'Creative',     isPro: true,  accent: '#7c3aed', layout: 'creative',  description: 'Side-column with photo circle' },
  { id: 'academic-harvard',     builderId: 'minimal',   name: 'Academic Harvard',     category: 'Academic',     isPro: false, accent: '#1d4ed8', layout: 'minimal',   description: 'Traditional centered header' },
  { id: 'contemporary-teal',    builderId: 'classic',   name: 'Contemporary Teal',    category: 'Professional', isPro: false, accent: '#0d9488', layout: 'classic',   description: 'Fresh teal accent lines' },
  { id: 'corporate-elite',      builderId: 'executive', name: 'Corporate Elite',      category: 'Executive',    isPro: true,  accent: '#1f2937', layout: 'executive', description: 'Prestige dark header' },
  { id: 'tech-engineer',        builderId: 'modern',    name: 'Tech Engineer',        category: 'Modern',       isPro: false, accent: '#4338ca', layout: 'sidebar',   description: 'Indigo sidebar for tech roles' },
  { id: 'healthcare-pro',       builderId: 'classic',   name: 'Healthcare Pro',       category: 'Professional', isPro: false, accent: '#059669', layout: 'classic',   description: 'Clean emerald accents' },
  { id: 'sales-champion',       builderId: 'executive', name: 'Sales Champion',       category: 'Professional', isPro: false, accent: '#ea580c', layout: 'executive', description: 'Bold orange impact header' },
  { id: 'graduate-fresh',       builderId: 'simple',    name: 'Graduate Fresh',       category: 'Simple',       isPro: false, accent: '#0891b2', layout: 'centered',  description: 'Simple centered design' },
  { id: 'creative-bold',        builderId: 'creative',  name: 'Creative Bold',        category: 'Creative',     isPro: true,  accent: '#e11d48', layout: 'creative',  description: 'Vibrant rose side-column' },
];

/* ─── Template card ──────────────────────────────────────────────────── */
function TemplateCard({ template, onSelect }: { template: Template; onSelect: (builderId: string) => void }) {
  return (
    <div
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#4AB7A6] hover:shadow-2xl"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      onClick={() => onSelect(template.builderId)}
    >
      {/* ── Rich preview area ── */}
      <div className="relative overflow-hidden bg-slate-100" style={{ height: '264px' }}>
        {/* Paper inset with shadow */}
        <div className="absolute inset-0 flex items-stretch justify-stretch p-2">
          <div
            className="flex-1 rounded-lg overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <TemplatePreview layout={template.layout} accent={template.accent} />
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-200 flex items-center justify-center">
          <span
            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 bg-white font-semibold rounded-full px-6 py-2.5 text-sm shadow-lg"
            style={{ color: '#4AB7A6' }}
          >
            Use This Template →
          </span>
        </div>

        {/* PRO badge */}
        {template.isPro && (
          <div className="absolute top-3 left-3 text-[10px] font-bold bg-amber-400 text-amber-900 rounded-full px-2 py-0.5 shadow-sm">
            PRO
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate leading-tight">{template.name}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{template.description}</p>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${
            template.isPro ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {template.isPro ? 'PRO' : 'Free'}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function ResumeTemplatePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const filtered =
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelect = async (id: string) => {
    // Create a resume with the selected template + starter data, then open the
    // full builder in wizard mode.
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getTemplateStarterData } = require('@/lib/example-to-resume') as typeof import('@/lib/example-to-resume');
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'My Resume',
          template_id: id,
          data: getTemplateStarterData(),
        }),
      });
      if (res.status === 401) {
        router.push(`/login?redirect=/builder/resume`);
        return;
      }
      if (res.ok) {
        const { resume } = await res.json();
        router.push(`/builder/resume/${resume.id}?wizard=1&template=${id}`);
        return;
      }
    } catch {}
    // Fallback: legacy flow
    router.push(`/builder/resume/new?template=${id}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* ── Hero strip ── */}
      <section className="bg-slate-50 py-14 px-4 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 mb-5 shadow-sm">
            <Check className="w-3.5 h-3.5" style={{ color: '#4AB7A6' }} />
            All templates are ATS-optimized and recruiter-approved
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Choose Your Resume Template
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            Pick a design that fits your style and career level. You can switch templates at any point during editing — no work is lost.
          </p>

          {/* Filter tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#4AB7A6] hover:text-[#4AB7A6]'
                }`}
                style={activeCategory === cat ? { backgroundColor: '#4AB7A6' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Template grid ── */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search className="w-10 h-10 text-slate-300" />
            <p className="text-slate-500 text-sm">No templates in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} onSelect={handleSelect} />
            ))}
          </div>
        )}

        {/* Suggestion + browse all */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-sm text-slate-400">
            Can&apos;t decide?{' '}
            <button
              onClick={() => handleSelect('classic')}
              className="font-semibold hover:underline"
              style={{ color: '#4AB7A6' }}
            >
              Start with Classic Professional
            </button>
          </p>
          <span className="hidden sm:block text-slate-200">|</span>
          <a
            href="/resume-templates"
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: '#4AB7A6' }}
          >
            Browse all 60+ templates <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}
