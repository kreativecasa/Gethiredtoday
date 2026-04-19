'use client';

import React from 'react';
import { ResumeData } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props { data: ResumeData; colorScheme?: string; fontSize?: 'small' | 'medium' | 'large'; }

const ACCENTS: Record<string, string> = { teal: '#0d9488', blue: '#2563eb', slate: '#475569', purple: '#7c3aed', rose: '#e11d48' };
const FS: Record<string, Record<string, string>> = {
  small:  { base: '12px', sm: '11px', xs: '10px', lg: '14px', xl: '17px', '2xl': '26px' },
  medium: { base: '13.5px', sm: '12.5px', xs: '11px', lg: '16px', xl: '20px', '2xl': '31px' },
  large:  { base: '15px', sm: '14px', xs: '12.5px', lg: '17.5px', xl: '22px', '2xl': '36px' },
};

export default function MinimalTemplate({ data, colorScheme = 'slate', fontSize = 'medium' }: Props) {
  const accent = ACCENTS[colorScheme] ?? ACCENTS.slate;
  const fs = FS[fontSize] ?? FS.medium;
  const d = { contact: (data.contact ?? {}) as ResumeData['contact'], work_experience: data.work_experience ?? [], education: data.education ?? [], skills: data.skills ?? [], certifications: data.certifications ?? [], languages: data.languages ?? [], volunteer_work: data.volunteer_work ?? [], projects: data.projects ?? [], custom_sections: data.custom_sections ?? [], summary: data.summary ?? '' };

  const contactParts = [d.contact.email, d.contact.phone, d.contact.location, d.contact.linkedin, d.contact.website, d.contact.github].filter(Boolean);

  const Sec = ({ title }: { title: string }) => (
    <div style={{ margin: '16px 0 8px', paddingBottom: '4px', borderBottom: `1px solid #e5e7eb` }}>
      <span style={{ fontSize: fs.xs, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.14em', fontFamily: "'Times New Roman', Georgia, serif" }}>{title}</span>
    </div>
  );

  return (
    <div id="resume-preview" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Times New Roman', Georgia, serif", fontSize: fs.base, lineHeight: 1.6, color: '#1f2937', background: '#fff', padding: '18mm 22mm', boxSizing: 'border-box' as const }}>

      {/* Name */}
      <div style={{ textAlign: 'center' as const, marginBottom: '10px' }}>
        <h1 style={{ fontSize: fs['2xl'], fontWeight: 700, color: '#111827', margin: '0 0 6px', letterSpacing: '0.03em', fontFamily: "'Times New Roman', Georgia, serif" }}>
          {d.contact.full_name || 'Your Name'}
        </h1>
        {d.work_experience[0]?.job_title && (
          <div style={{ fontSize: fs.lg, color: accent, fontWeight: 600, marginBottom: '8px', fontFamily: 'Arial, sans-serif', letterSpacing: '0.02em' }}>
            {d.work_experience[0].job_title}
          </div>
        )}
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs.xs, color: '#6b7280', fontFamily: 'Arial, sans-serif' }}>
            {contactParts.join('  ·  ')}
          </div>
        )}
      </div>

      {/* Double rule */}
      <div style={{ borderTop: `2px solid ${accent}`, marginBottom: '1px' }} />
      <div style={{ borderTop: `1px solid ${accent}30`, marginBottom: '2px' }} />

      {d.summary && (
        <>
          <Sec title="Summary" />
          <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.75, fontStyle: 'italic' as const }}>{d.summary}</p>
        </>
      )}

      {d.work_experience.length > 0 && (
        <>
          <Sec title="Experience" />
          {d.work_experience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < d.work_experience.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: fs.lg, color: '#111827' }}>{job.job_title || 'Job Title'}</div>
                <div style={{ fontSize: fs.xs, color: '#9ca3af', fontFamily: 'Arial, sans-serif' }}>
                  {formatDate(job.start_date)} – {job.is_current ? 'Present' : formatDate(job.end_date || '')}
                </div>
              </div>
              <div style={{ fontSize: fs.sm, color: accent, fontWeight: 600, fontFamily: 'Arial, sans-serif', marginBottom: '4px' }}>
                {job.company}{job.location ? `, ${job.location}` : ''}
              </div>
              {job.description && <p style={{ margin: '2px 0', color: '#4b5563', lineHeight: 1.6 }}>{job.description}</p>}
              {job.achievements?.filter(Boolean).map((a, j) => (
                <div key={j} style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                  <span style={{ flexShrink: 0, color: accent }}>–</span>
                  <span style={{ color: '#374151', lineHeight: 1.5 }}>{a}</span>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {d.education.length > 0 && (
        <>
          <Sec title="Education" />
          {d.education.map((edu, i) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < d.education.length - 1 ? '8px' : 0 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: fs.base, color: '#111827' }}>{edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</div>
                <div style={{ fontSize: fs.sm, color: accent, fontFamily: 'Arial, sans-serif' }}>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
              </div>
              <div style={{ fontSize: fs.xs, color: '#9ca3af', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' as const }}>
                {formatDate(edu.start_date)} – {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
              </div>
            </div>
          ))}
        </>
      )}

      {d.skills.length > 0 && (
        <>
          <Sec title="Skills" />
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {d.skills.map((s, i) => (
              <span key={s.id} style={{ fontSize: fs.sm, color: '#374151' }}>
                {s.name}{i < d.skills.length - 1 ? <span style={{ color: '#9ca3af' }}>  ·  </span> : ''}
              </span>
            ))}
          </div>
        </>
      )}

      {d.certifications.length > 0 && (
        <>
          <Sec title="Certifications" />
          {d.certifications.map((cert, i) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < d.certifications.length - 1 ? '4px' : 0 }}>
              <span style={{ fontWeight: 600, color: '#111827', fontFamily: 'Arial, sans-serif' }}>{cert.name}</span>
              {cert.issuer && <span style={{ fontSize: fs.xs, color: '#9ca3af', fontFamily: 'Arial, sans-serif' }}>{cert.issuer}</span>}
            </div>
          ))}
        </>
      )}

      {d.languages.length > 0 && (
        <>
          <Sec title="Languages" />
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '16px', fontFamily: 'Arial, sans-serif' }}>
            {d.languages.map((l) => (
              <span key={l.id} style={{ fontSize: fs.sm }}><strong style={{ color: '#111827' }}>{l.name}</strong>{l.proficiency ? <span style={{ color: '#9ca3af' }}> / {l.proficiency}</span> : ''}</span>
            ))}
          </div>
        </>
      )}

      {d.projects.length > 0 && (
        <>
          <Sec title="Projects" />
          {d.projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < d.projects.length - 1 ? '8px' : 0 }}>
              <div style={{ fontWeight: 700, fontSize: fs.base, color: '#111827', fontFamily: 'Arial, sans-serif' }}>{p.name}</div>
              {p.description && <div style={{ fontSize: fs.sm, color: '#374151', marginTop: '2px' }}>{p.description}</div>}
            </div>
          ))}
        </>
      )}

      {d.volunteer_work.length > 0 && (
        <>
          <Sec title="Volunteer Work" />
          {d.volunteer_work.map((vol, i) => (
            <div key={vol.id} style={{ marginBottom: i < d.volunteer_work.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: fs.lg, color: '#111827' }}>{vol.role || 'Role'}</div>
                <div style={{ fontSize: fs.xs, color: '#9ca3af', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' as const }}>
                  {vol.start_date} – {vol.is_current ? 'Present' : (vol.end_date || '')}
                </div>
              </div>
              <div style={{ fontSize: fs.sm, color: accent, fontWeight: 600, fontFamily: 'Arial, sans-serif', marginBottom: '3px' }}>{vol.organization}</div>
              {vol.description && <p style={{ margin: '2px 0 0', color: '#4b5563', lineHeight: 1.6 }}>{vol.description}</p>}
            </div>
          ))}
        </>
      )}

      {(d.custom_sections ?? []).map((section) => (
        section.items?.length > 0 && (
          <React.Fragment key={section.id}>
            <Sec title={section.title || 'Custom Section'} />
            {section.items.map((item, i) => (
              <div key={item.id} style={{ marginBottom: i < section.items.length - 1 ? '10px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 700, fontSize: fs.base, color: '#111827', fontFamily: 'Arial, sans-serif' }}>{item.title}</div>
                  {item.date && <div style={{ fontSize: fs.xs, color: '#9ca3af', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' as const }}>{item.date}</div>}
                </div>
                {item.subtitle && <div style={{ fontSize: fs.sm, color: accent, fontFamily: 'Arial, sans-serif' }}>{item.subtitle}</div>}
                {item.description && <p style={{ margin: '2px 0 0', color: '#4b5563', lineHeight: 1.6 }}>{item.description}</p>}
              </div>
            ))}
          </React.Fragment>
        )
      ))}
    </div>
  );
}
