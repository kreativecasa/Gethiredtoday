'use client';

import { ResumeData } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props { data: ResumeData; colorScheme?: string; fontSize?: 'small' | 'medium' | 'large'; }

const CS: Record<string, { accent: string; dark: string }> = {
  blue:   { accent: '#1d4ed8', dark: '#1e3a8a' },
  teal:   { accent: '#0d9488', dark: '#134e4a' },
  purple: { accent: '#7c3aed', dark: '#4c1d95' },
  rose:   { accent: '#e11d48', dark: '#9f1239' },
  slate:  { accent: '#475569', dark: '#1e293b' },
};
const FS: Record<string, Record<string, string>> = {
  small:  { base: '12px', sm: '11px', xs: '10px', lg: '14px', xl: '17px', '2xl': '24px', name: '32px' },
  medium: { base: '13.5px', sm: '12.5px', xs: '11px', lg: '16px', xl: '19px', '2xl': '27px', name: '37px' },
  large:  { base: '15px', sm: '14px', xs: '12.5px', lg: '17.5px', xl: '21px', '2xl': '31px', name: '43px' },
};

export default function SimpleTemplate({ data, colorScheme = 'blue', fontSize = 'medium' }: Props) {
  const c = CS[colorScheme] ?? CS.blue;
  const fs = FS[fontSize] ?? FS.medium;
  const d = { contact: (data.contact ?? {}) as ResumeData['contact'], work_experience: data.work_experience ?? [], education: data.education ?? [], skills: data.skills ?? [], certifications: data.certifications ?? [], languages: data.languages ?? [], volunteer_work: data.volunteer_work ?? [], projects: data.projects ?? [], custom_sections: data.custom_sections ?? [], summary: data.summary ?? '' };

  const contactParts = [d.contact.email, d.contact.phone, d.contact.location, d.contact.linkedin, d.contact.website, d.contact.github].filter(Boolean);

  const Sec = ({ title }: { title: string }) => (
    <div style={{ margin: '14px 0 7px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: fs.xs, fontWeight: 800, color: c.dark, textTransform: 'uppercase' as const, letterSpacing: '0.12em', whiteSpace: 'nowrap' as const }}>{title}</span>
      <div style={{ flex: 1, height: '1.5px', background: c.accent }} />
    </div>
  );

  return (
    <div id="resume-preview" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: fs.base, lineHeight: 1.55, color: '#1f2937', background: '#fff', padding: '15mm 18mm 16mm', boxSizing: 'border-box' as const }}>

      {/* Header */}
      <div style={{ marginBottom: '12px' }}>
        <h1 style={{ fontSize: fs.name, fontWeight: 900, color: c.dark, margin: '0 0 2px', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {d.contact.full_name || 'Your Name'}
        </h1>
        {d.work_experience[0]?.job_title && (
          <div style={{ fontSize: fs.xl, color: c.accent, fontWeight: 600, marginBottom: '6px', letterSpacing: '0.01em' }}>{d.work_experience[0].job_title}</div>
        )}
        {contactParts.length > 0 && (
          <div style={{ fontSize: fs.xs, color: '#6b7280', lineHeight: 1.7 }}>
            {contactParts.join('  ·  ')}
          </div>
        )}
      </div>

      {/* Bottom border of header */}
      <div style={{ height: '2px', background: `linear-gradient(to right, ${c.accent}, ${c.accent}30)`, marginBottom: '2px' }} />

      {d.summary && (
        <>
          <Sec title="Summary" />
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.75, fontSize: fs.base }}>{d.summary}</p>
        </>
      )}

      {d.work_experience.length > 0 && (
        <>
          <Sec title="Experience" />
          {d.work_experience.map((job, i) => (
            <div key={job.id} style={{ marginBottom: i < d.work_experience.length - 1 ? '11px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: fs.lg, color: '#111827' }}>{job.job_title || 'Job Title'}</div>
                <div style={{ fontSize: fs.xs, color: '#9ca3af', whiteSpace: 'nowrap' as const, marginLeft: '8px' }}>
                  {formatDate(job.start_date)} – {job.is_current ? 'Present' : formatDate(job.end_date || '')}
                </div>
              </div>
              <div style={{ fontSize: fs.sm, color: c.accent, fontWeight: 600, marginBottom: '3px' }}>
                {job.company}{job.location ? ` · ${job.location}` : ''}
              </div>
              {job.description && <p style={{ margin: '2px 0', color: '#4b5563', lineHeight: 1.6, fontSize: fs.sm }}>{job.description}</p>}
              {job.achievements?.filter(Boolean).map((a, j) => (
                <div key={j} style={{ display: 'flex', gap: '8px', marginTop: '2px', alignItems: 'flex-start' }}>
                  <span style={{ color: c.accent, fontWeight: 700, flexShrink: 0, lineHeight: 1.55 }}>•</span>
                  <span style={{ fontSize: fs.sm, color: '#374151', lineHeight: 1.55 }}>{a}</span>
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
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: i < d.education.length - 1 ? '8px' : 0 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: fs.base, color: '#111827' }}>{edu.degree}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}</div>
                <div style={{ fontSize: fs.sm, color: c.accent }}>{edu.institution}{edu.location ? ` · ${edu.location}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
              </div>
              <div style={{ fontSize: fs.xs, color: '#9ca3af', whiteSpace: 'nowrap' as const }}>
                {formatDate(edu.start_date)} – {edu.is_current ? 'Present' : formatDate(edu.end_date || '')}
              </div>
            </div>
          ))}
        </>
      )}

      {d.skills.length > 0 && (
        <>
          <Sec title="Skills" />
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
            {d.skills.map((s) => (
              <span key={s.id} style={{ fontSize: fs.xs, padding: '3px 10px', background: '#f1f5f9', color: c.dark, fontWeight: 600, borderRadius: '3px', border: `1px solid #e2e8f0` }}>{s.name}</span>
            ))}
          </div>
        </>
      )}

      {d.certifications.length > 0 && (
        <>
          <Sec title="Certifications" />
          {d.certifications.map((cert, i) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: i < d.certifications.length - 1 ? '4px' : 0 }}>
              <span style={{ fontWeight: 600, fontSize: fs.sm, color: '#111827' }}>{cert.name}</span>
              {cert.issuer && <span style={{ fontSize: fs.xs, color: '#9ca3af' }}>{cert.issuer}</span>}
            </div>
          ))}
        </>
      )}

      {d.languages.length > 0 && (
        <>
          <Sec title="Languages" />
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '14px' }}>
            {d.languages.map((l) => (
              <span key={l.id} style={{ fontSize: fs.sm }}>
                <strong style={{ color: '#111827' }}>{l.name}</strong>
                {l.proficiency ? <span style={{ color: '#9ca3af' }}> — {l.proficiency}</span> : ''}
              </span>
            ))}
          </div>
        </>
      )}

      {d.projects.length > 0 && (
        <>
          <Sec title="Projects" />
          {d.projects.map((p, i) => (
            <div key={p.id} style={{ marginBottom: i < d.projects.length - 1 ? '7px' : 0 }}>
              <div style={{ fontWeight: 700, fontSize: fs.base, color: '#111827' }}>{p.name}</div>
              {p.description && <div style={{ fontSize: fs.sm, color: '#4b5563', marginTop: '2px' }}>{p.description}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
