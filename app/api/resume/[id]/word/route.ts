import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { ResumeData, WorkExperience, Education, Skill } from '@/types';

/**
 * Word (.doc) download for a resume.
 *
 * Returns an HTML document with Word-compatible MIME type and .doc filename.
 * Microsoft Word opens HTML-based .doc files natively, preserving most
 * formatting. This avoids requiring a heavy docx library while still giving
 * users a real Word-editable file.
 */

function esc(s: string): string {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatDate(d?: string): string {
  return d ? esc(d) : '';
}

function renderHtml(title: string, data: ResumeData): string {
  const c = data.contact ?? ({} as ResumeData['contact']);
  const name = c.full_name || title || 'Resume';

  const contactLine = [c.email, c.phone, c.location, c.linkedin, c.website, c.github]
    .filter(Boolean)
    .map((v) => esc(v as string))
    .join(' · ');

  const workHtml = (data.work_experience ?? [])
    .map(
      (j: WorkExperience) => `
<h3 style="margin:14px 0 2px;font-size:14px;">${esc(j.job_title)}</h3>
<div style="font-size:11px;color:#666;">
  <span>${esc(j.company)}${j.location ? ` · ${esc(j.location)}` : ''}</span>
  <span style="float:right;">${formatDate(j.start_date)}${j.end_date ? ` – ${formatDate(j.end_date)}` : j.is_current ? ' – Present' : ''}</span>
</div>
<div style="clear:both;"></div>
${j.description ? `<p style="font-size:12px;margin:4px 0;">${esc(j.description)}</p>` : ''}
${
  j.achievements && j.achievements.length
    ? `<ul style="margin:6px 0 0 0;padding-left:20px;">${j.achievements.map((b) => `<li style="font-size:12px;margin-bottom:2px;">${esc(b)}</li>`).join('')}</ul>`
    : ''
}`
    )
    .join('');

  const eduHtml = (data.education ?? [])
    .map(
      (e: Education) => `
<div style="margin:6px 0;">
  <div style="font-weight:bold;font-size:13px;">${esc(e.degree)}${e.field_of_study ? ` in ${esc(e.field_of_study)}` : ''}</div>
  <div style="font-size:11px;color:#666;">
    ${esc(e.institution)}${e.location ? ` · ${esc(e.location)}` : ''}
    <span style="float:right;">${formatDate(e.start_date)}${e.end_date ? ` – ${formatDate(e.end_date)}` : ''}</span>
  </div>
  <div style="clear:both;"></div>
</div>`
    )
    .join('');

  const skillsHtml =
    data.skills && data.skills.length
      ? `<p style="font-size:12px;line-height:1.6;">${data.skills.map((s: Skill) => esc(s.name)).join(' · ')}</p>`
      : '';

  const certsHtml =
    data.certifications && data.certifications.length
      ? `<ul style="margin:4px 0 0 0;padding-left:20px;">${data.certifications
          .map((c) => `<li style="font-size:12px;margin-bottom:2px;"><strong>${esc(c.name)}</strong>${c.issuer ? ` — ${esc(c.issuer)}` : ''}${c.date_issued ? ` (${esc(c.date_issued)})` : ''}</li>`)
          .join('')}</ul>`
      : '';

  const projectsHtml =
    data.projects && data.projects.length
      ? data.projects
          .map(
            (p) => `
<div style="margin:6px 0;">
  <div style="font-weight:bold;font-size:13px;">${esc(p.name)}</div>
  ${p.description ? `<div style="font-size:12px;color:#666;">${esc(p.description)}</div>` : ''}
</div>`
          )
          .join('')
      : '';

  const langsHtml =
    data.languages && data.languages.length
      ? `<p style="font-size:12px;">${data.languages
          .map((l) => `${esc(l.name)}${l.proficiency ? ` (${esc(l.proficiency)})` : ''}`)
          .join(' · ')}</p>`
      : '';

  const section = (label: string, content: string) =>
    content
      ? `<h2 style="margin:18px 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#4AB7A6;border-bottom:1px solid #4AB7A6;padding-bottom:2px;">${label}</h2>${content}`
      : '';

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${esc(name)} — Resume</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; color: #222; margin: 40px; font-size: 12px; line-height: 1.5; }
    h1 { font-size: 22px; margin: 0 0 6px 0; color: #111; }
    h2 { page-break-after: avoid; }
    h3 { page-break-after: avoid; }
    ul { page-break-inside: avoid; }
  </style>
</head>
<body>
  <h1>${esc(name)}</h1>
  ${contactLine ? `<p style="font-size:11px;color:#666;margin:0 0 6px 0;">${contactLine}</p>` : ''}
  ${data.summary ? section('Summary', `<p style="font-size:12px;line-height:1.5;">${esc(data.summary)}</p>`) : ''}
  ${section('Work Experience', workHtml)}
  ${section('Education', eduHtml)}
  ${section('Skills', skillsHtml)}
  ${section('Projects', projectsHtml)}
  ${section('Certifications', certsHtml)}
  ${section('Languages', langsHtml)}
</body>
</html>`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pro gate — free users hit the upgrade paywall
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status')
    .eq('id', user.id)
    .single();

  const isPro =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing' ||
    profile?.subscription_status === 'pro';

  if (!isPro) {
    return NextResponse.json(
      { error: 'Word download is a Pro feature. Please upgrade.' },
      { status: 403 }
    );
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('title, data')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const html = renderHtml(resume.title, resume.data as ResumeData);
  const filenameSafe = (resume.title || 'resume').replace(/[^a-z0-9-_ ]/gi, '').slice(0, 60) || 'resume';

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'application/msword; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filenameSafe}.doc"`,
    },
  });
}
