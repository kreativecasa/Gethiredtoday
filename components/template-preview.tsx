/**
 * High-fidelity resume thumbnail previews.
 * Renders as a miniaturised, proportional resume document for each layout type.
 *
 * Accepts an optional `content` prop to show real text (name, role, company,
 * skills, summary) instead of placeholder bars. When omitted, falls back to
 * abstract bars for the generic template thumbnail.
 */

import type { ResumeData } from "@/types";

export type TemplateLayout =
  | "classic"
  | "sidebar"
  | "executive"
  | "minimal"
  | "creative"
  | "centered";

export interface PreviewContent {
  name?: string;
  title?: string;       // e.g. "Senior Software Engineer"
  location?: string;
  email?: string;
  summary?: string;
  experiences?: Array<{
    role: string;
    company: string;
    dates?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    dates?: string;
  }>;
  skills?: string[];
}

/**
 * Extract simplified preview content from a full ResumeData object.
 *
 * Defensive against:
 * - null/undefined input
 * - empty objects
 * - legacy/mismatched field shapes (e.g. an older `bullets` array, strings where arrays expected)
 * - non-string values where strings expected
 *
 * Returns undefined on any internal error so the preview gracefully falls back
 * to the generic placeholder bars rather than crashing the page.
 */
export function previewFromResumeData(data?: Partial<ResumeData> | null): PreviewContent | undefined {
  try {
    if (!data || typeof data !== 'object') return undefined;

    const asString = (v: unknown): string | undefined =>
      typeof v === 'string' && v.trim() ? v : undefined;

    const asArray = <T,>(v: unknown): T[] =>
      Array.isArray(v) ? (v as T[]) : [];

    const contact = (data as { contact?: unknown }).contact;
    const contactObj = (contact && typeof contact === 'object') ? contact as Record<string, unknown> : {};

    const workRaw = asArray<Record<string, unknown>>((data as { work_experience?: unknown }).work_experience);
    const eduRaw = asArray<Record<string, unknown>>((data as { education?: unknown }).education);
    const skillsRaw = asArray<unknown>((data as { skills?: unknown }).skills);

    const firstExp = workRaw[0] ?? {};

    const experiences = workRaw.slice(0, 3).map((w) => ({
      role: asString(w.job_title) ?? asString((w as { position?: unknown }).position) ?? '',
      company: asString(w.company) ?? '',
      dates:
        w.is_current ? 'Present'
        : asString(w.end_date) ?? asString((w as { endDate?: unknown }).endDate) ?? '',
      bullets: asArray<unknown>(w.achievements ?? (w as { bullets?: unknown }).bullets)
        .filter((b) => typeof b === 'string')
        .slice(0, 3) as string[],
    })).filter((e) => e.role || e.company);

    const education = eduRaw.slice(0, 2).map((e) => ({
      degree: asString(e.degree) ?? '',
      school: asString(e.institution) ?? asString((e as { school?: unknown }).school) ?? '',
      dates: asString(e.end_date) ?? '',
    })).filter((e) => e.degree || e.school);

    const skills = skillsRaw.slice(0, 8).map((s) => {
      if (typeof s === 'string') return s;
      if (s && typeof s === 'object' && typeof (s as { name?: unknown }).name === 'string') {
        return (s as { name: string }).name;
      }
      return '';
    }).filter(Boolean);

    return {
      name: asString(contactObj.full_name),
      title: asString(firstExp.job_title) ?? asString((firstExp as { position?: unknown }).position),
      location: asString(contactObj.location),
      email: asString(contactObj.email),
      summary: asString((data as { summary?: unknown }).summary),
      experiences,
      education,
      skills,
    };
  } catch (err) {
    // Malformed data — fall back to placeholder bars rather than crash the UI.
    if (typeof console !== 'undefined') console.warn('previewFromResumeData: ignoring malformed resume data', err);
    return undefined;
  }
}

/* ─── Primitive helpers ──────────────────────────────────────────────────── */

/** A horizontal "text" bar. Falls back from text if provided & legible. */
const Bar = ({
  w,
  dark = false,
  accent,
  op = 1,
}: {
  w: string;
  dark?: boolean;
  accent?: string;
  op?: number;
}) => (
  <div
    className={`h-[2.5px] ${w} rounded-full`}
    style={{
      backgroundColor: accent ?? (dark ? "#334155" : "#cbd5e1"),
      opacity: op,
    }}
  />
);

const ThinBar = ({ w, op = 1 }: { w: string; op?: number }) => (
  <div
    className={`h-[1.5px] ${w} rounded-full bg-slate-200`}
    style={{ opacity: op }}
  />
);

const Divider = ({ accent, op = 0.25 }: { accent: string; op?: number }) => (
  <div className="w-full h-px" style={{ backgroundColor: accent, opacity: op }} />
);

const SectionHead = ({
  accent,
  style = "rule",
  label,
}: {
  accent: string;
  style?: "rule" | "bar" | "underline";
  label?: string;
}) => {
  if (label) {
    return (
      <div className="mb-[3px]">
        <div
          className="text-[5.5px] font-bold uppercase tracking-wider leading-none"
          style={{ color: accent, letterSpacing: "0.08em" }}
        >
          {label}
        </div>
        <div className="h-px w-full mt-[1px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
      </div>
    );
  }
  if (style === "bar") {
    return (
      <div
        className="h-[2px] w-[38%] rounded-full mb-[3px]"
        style={{ backgroundColor: accent }}
      />
    );
  }
  if (style === "underline") {
    return (
      <div className="mb-[3px]">
        <div className="h-[2px] w-[32%] rounded-full mb-[1px]" style={{ backgroundColor: accent }} />
        <div className="h-px w-full bg-slate-200" />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-[3px] mb-[3px]">
      <div className="h-px flex-1" style={{ backgroundColor: accent, opacity: 0.25 }} />
      <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accent }} />
      <div className="h-px flex-1" style={{ backgroundColor: accent, opacity: 0.25 }} />
    </div>
  );
};

const Bullet = ({ accent, w }: { accent: string; w: string }) => (
  <div className="flex items-center gap-[2.5px] mb-[1.5px]">
    <div
      className="w-[2.5px] h-[2.5px] rounded-full shrink-0"
      style={{ backgroundColor: accent, opacity: 0.6 }}
    />
    <ThinBar w={w} />
  </div>
);

const SkillPill = ({ accent, w, label }: { accent: string; w?: number; label?: string }) => {
  if (label) {
    return (
      <span
        className="text-[5.5px] font-medium px-[3px] py-[1px] rounded-full truncate leading-none"
        style={{
          backgroundColor: accent + "22",
          color: accent,
          maxWidth: 60,
        }}
      >
        {label}
      </span>
    );
  }
  return (
    <div
      className="h-[5px] rounded-full"
      style={{ width: `${w}px`, backgroundColor: accent, opacity: 0.18 }}
    />
  );
};

/** Render real text at micro size, or fall back to Bar. */
const NameText = ({ text, accent, size = 11 }: { text?: string; accent?: string; size?: number }) =>
  text ? (
    <div
      className="font-bold leading-none truncate"
      style={{ fontSize: size, color: accent ?? "#0f172a", letterSpacing: "-0.01em" }}
    >
      {text}
    </div>
  ) : (
    <div
      className="h-[6px] w-[52%] rounded-full"
      style={{ backgroundColor: accent ?? "#334155" }}
    />
  );

const TitleText = ({ text, size = 7, op = 0.7 }: { text?: string; size?: number; op?: number }) =>
  text ? (
    <div
      className="font-medium text-slate-700 leading-none truncate"
      style={{ fontSize: size, opacity: op }}
    >
      {text}
    </div>
  ) : (
    <Bar w="w-[33%]" dark op={op} />
  );

const BodyText = ({ text, size = 6, className = "" }: { text?: string; size?: number; className?: string }) =>
  text ? (
    <div
      className={`text-slate-600 leading-tight ${className}`}
      style={{ fontSize: size }}
    >
      {text}
    </div>
  ) : null;

/* ─── Job entry with optional real content ──────────────────────────────── */
const JobEntry = ({
  accent,
  title = "w-[42%]",
  date = "w-[22%]",
  company = "w-[30%]",
  bullets = 2,
  exp,
}: {
  accent: string;
  title?: string;
  date?: string;
  company?: string;
  bullets?: number;
  exp?: { role: string; company: string; dates?: string; bullets?: string[] };
}) => (
  <div className="mb-[4px]">
    <div className="flex items-center justify-between mb-[1.5px] gap-[4px]">
      {exp ? (
        <div className="font-semibold text-slate-800 leading-none truncate flex-1" style={{ fontSize: 7 }}>
          {exp.role}
        </div>
      ) : (
        <Bar w={title} dark />
      )}
      {exp?.dates ? (
        <div className="text-slate-500 leading-none shrink-0" style={{ fontSize: 5.5 }}>
          {exp.dates}
        </div>
      ) : (
        <Bar w={date} op={0.6} />
      )}
    </div>
    {exp ? (
      <div className="text-slate-600 leading-none truncate" style={{ fontSize: 6, opacity: 0.8 }}>
        {exp.company}
      </div>
    ) : (
      <Bar w={company} op={0.65} />
    )}
    <div className="mt-[2px]">
      <Bullet accent={accent} w="w-full" />
      <Bullet accent={accent} w="w-10/12" />
      {bullets >= 3 && <Bullet accent={accent} w="w-4/5" />}
    </div>
  </div>
);

/* ─── CLASSIC ─────────────────────────────────────────────────────────────── */
function ClassicLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ padding: "7px 8px 5px" }}>
      <div className="h-[5px] w-full rounded-sm mb-[5px]" style={{ backgroundColor: accent }} />

      {/* Header */}
      <div className="mb-[4px]">
        <NameText text={content?.name} accent={accent} size={11} />
        <div className="mt-[1px]">
          <TitleText text={content?.title} size={6.5} op={0.75} />
        </div>
        {content?.location || content?.email ? (
          <div
            className="mt-[3px] text-slate-500 leading-none truncate"
            style={{ fontSize: 5 }}
          >
            {[content.location, content.email].filter(Boolean).join(" · ")}
          </div>
        ) : (
          <div className="flex items-center gap-[5px] mt-[3px]">
            {[22, 28, 20].map((w, i) => (
              <div key={i} className="flex items-center gap-[2px]">
                <div className="w-[2.5px] h-[2.5px] rounded-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
                <ThinBar w={`w-[${w}px]`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider accent={accent} />

      {/* Summary */}
      <div className="mt-[3px] mb-[4px]">
        <SectionHead accent={accent} label={content?.summary ? "Summary" : undefined} />
        {content?.summary ? (
          <BodyText text={content.summary.slice(0, 100) + (content.summary.length > 100 ? '…' : '')} size={5} className="line-clamp-2" />
        ) : (
          <>
            <ThinBar w="w-full" />
            <div className="mt-[1.5px]"><ThinBar w="w-11/12" /></div>
            <div className="mt-[1.5px]"><ThinBar w="w-4/5" /></div>
          </>
        )}
      </div>

      {/* Experience */}
      <div className="mb-[3px]">
        <SectionHead accent={accent} label={content?.experiences?.length ? "Experience" : undefined} />
        {content?.experiences && content.experiences.length > 0 ? (
          content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} bullets={3} />
          ))
        ) : (
          <>
            <JobEntry accent={accent} title="w-[38%]" date="w-[20%]" company="w-[28%]" bullets={3} />
            <JobEntry accent={accent} title="w-[42%]" date="w-[18%]" company="w-[32%]" bullets={2} />
          </>
        )}
      </div>

      {/* Skills */}
      <div>
        <SectionHead accent={accent} label={content?.skills?.length ? "Skills" : undefined} />
        {content?.skills && content.skills.length > 0 ? (
          <div className="flex flex-wrap gap-[2.5px] mt-[1px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <SkillPill key={i} accent={accent} label={s} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-[2.5px] mt-[1px]">
            {[28, 36, 22, 32, 26, 30, 20].map((w, i) => (
              <SkillPill key={i} accent={accent} w={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SIDEBAR ─────────────────────────────────────────────────────────────── */
function SidebarLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full flex">
      {/* Left panel */}
      <div
        className="w-[32%] h-full flex flex-col shrink-0"
        style={{ backgroundColor: accent, padding: "8px 5px 6px" }}
      >
        <div className="w-[24px] h-[24px] rounded-full bg-white/25 mx-auto mb-[4px] flex items-center justify-center border-2 border-white/40">
          <div className="text-white font-bold" style={{ fontSize: 9 }}>
            {content?.name ? content.name.split(/\s+/).map(n => n[0]).slice(0, 2).join('') : ''}
          </div>
        </div>
        {/* Name on sidebar */}
        {content?.name ? (
          <div className="text-white text-center font-bold leading-none truncate mb-[1px]" style={{ fontSize: 7 }}>
            {content.name}
          </div>
        ) : (
          <div className="h-[3px] w-[85%] rounded-full bg-white/90 mx-auto mb-[2px]" />
        )}
        {content?.title ? (
          <div className="text-white/75 text-center leading-tight truncate mb-[6px] px-[2px]" style={{ fontSize: 5 }}>
            {content.title}
          </div>
        ) : (
          <div className="h-[2px] w-[65%] rounded-full bg-white/55 mx-auto mb-[6px]" />
        )}

        <div className="h-px w-full bg-white/20 mb-[4px]" />

        {/* Skills on sidebar */}
        <div className="mb-[5px]">
          <div className="text-white/75 font-bold uppercase tracking-wider mb-[3px] leading-none" style={{ fontSize: 5, letterSpacing: "0.08em" }}>
            Skills
          </div>
          {content?.skills && content.skills.length > 0 ? (
            content.skills.slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="text-white/90 leading-none truncate mb-[2.5px]"
                style={{ fontSize: 5.5 }}
              >
                · {s}
              </div>
            ))
          ) : (
            [80, 65, 90, 70, 75].map((pct, i) => (
              <div key={i} className="mb-[3px]">
                <div className="h-[1.5px] rounded-full bg-white/25 mb-[1px]" />
                <div className="h-[2px] rounded-full bg-white/70" style={{ width: `${pct}%` }} />
              </div>
            ))
          )}
        </div>

        <div className="h-px w-full bg-white/20 mb-[4px]" />

        {/* Contact */}
        <div>
          <div className="text-white/75 font-bold uppercase tracking-wider mb-[3px] leading-none" style={{ fontSize: 5, letterSpacing: "0.08em" }}>
            Contact
          </div>
          {content?.email && (
            <div className="text-white/85 leading-none truncate mb-[2px]" style={{ fontSize: 5 }}>{content.email}</div>
          )}
          {content?.location && (
            <div className="text-white/85 leading-none truncate" style={{ fontSize: 5 }}>{content.location}</div>
          )}
          {!content?.email && !content?.location && (
            [100, 80, 90].map((pct, i) => (
              <div key={i} className="flex items-center gap-[2px] mb-[2px]">
                <div className="w-[2.5px] h-[2.5px] rounded-full bg-white/55 shrink-0" />
                <div className="h-[1.5px] rounded-full bg-white/40" style={{ width: `${pct * 0.55}%` }} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white flex flex-col" style={{ padding: "8px 7px 6px" }}>
        {/* Big name */}
        <div className="mb-[4px]">
          {content?.name ? (
            <div className="font-bold leading-none" style={{ fontSize: 11, color: accent }}>
              {content.name.split(/\s+/)[0]}
            </div>
          ) : (
            <div className="h-[5px] w-[60%] rounded-full" style={{ backgroundColor: accent }} />
          )}
          {content?.title ? (
            <div className="font-medium text-slate-700 leading-none mt-[2px] truncate" style={{ fontSize: 6.5 }}>
              {content.title}
            </div>
          ) : (
            <div className="mt-[2px]"><Bar w="w-[40%]" dark op={0.55} /></div>
          )}
          <div className="h-px w-full mt-[3px]" style={{ backgroundColor: accent, opacity: 0.2 }} />
        </div>

        {/* Experience */}
        <div className="mb-[4px]">
          <SectionHead accent={accent} style="bar" label={content?.experiences?.length ? "Experience" : undefined} />
          {content?.experiences && content.experiences.length > 0 ? (
            content.experiences.slice(0, 2).map((e, i) => (
              <JobEntry key={i} accent={accent} exp={e} bullets={2} />
            ))
          ) : (
            <>
              <JobEntry accent={accent} title="w-[50%]" date="w-[22%]" company="w-[36%]" bullets={2} />
              <JobEntry accent={accent} title="w-[46%]" date="w-[20%]" company="w-[32%]" bullets={2} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── EXECUTIVE ───────────────────────────────────────────────────────────── */
function ExecutiveLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Bold header block */}
      <div
        className="w-full shrink-0"
        style={{ backgroundColor: accent, padding: "9px 10px 8px" }}
      >
        {content?.name ? (
          <div className="text-white font-bold leading-none mb-[2px]" style={{ fontSize: 12 }}>
            {content.name}
          </div>
        ) : (
          <div className="h-[7px] w-[55%] rounded-full bg-white mb-[3px]" />
        )}
        {content?.title ? (
          <div className="text-white/80 leading-none mb-[5px] truncate" style={{ fontSize: 7 }}>
            {content.title}
          </div>
        ) : (
          <div className="h-[3px] w-[38%] rounded-full bg-white/65 mb-[5px]" />
        )}
        <div className="flex items-center gap-[6px]">
          {content?.location ? (
            <div className="text-white/70 leading-none" style={{ fontSize: 5.5 }}>
              {[content.email, content.location].filter(Boolean).join(" · ")}
            </div>
          ) : (
            [22, 26, 20].map((w, i) => (
              <div key={i} className="flex items-center gap-[2.5px]">
                <div className="w-[3px] h-[3px] rounded-full bg-white/55" />
                <div className="h-[2px] rounded-full bg-white/40" style={{ width: `${w}px` }} />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "6px 10px" }}>
        <div className="mb-[4px]">
          <SectionHead accent={accent} style="underline" label={content?.summary ? "Summary" : undefined} />
          {content?.summary ? (
            <BodyText text={content.summary.slice(0, 90) + (content.summary.length > 90 ? '…' : '')} size={5} />
          ) : (
            <>
              <ThinBar w="w-full" />
              <div className="mt-[1.5px]"><ThinBar w="w-11/12" /></div>
              <div className="mt-[1.5px]"><ThinBar w="w-4/5" /></div>
            </>
          )}
        </div>

        <div className="mb-[4px]">
          <SectionHead accent={accent} style="underline" label={content?.experiences?.length ? "Experience" : undefined} />
          {content?.experiences && content.experiences.length > 0 ? (
            content.experiences.slice(0, 2).map((e, i) => (
              <JobEntry key={i} accent={accent} exp={e} bullets={2} />
            ))
          ) : (
            <>
              <JobEntry accent={accent} title="w-[40%]" date="w-[22%]" company="w-[30%]" bullets={3} />
              <JobEntry accent={accent} title="w-[44%]" date="w-[18%]" company="w-[32%]" bullets={2} />
            </>
          )}
        </div>

        <div className="flex gap-[6px]">
          <div className="flex-1">
            <SectionHead accent={accent} style="underline" label={content?.education?.length ? "Education" : undefined} />
            {content?.education?.[0] ? (
              <>
                <div className="font-semibold text-slate-800 leading-none truncate" style={{ fontSize: 6 }}>{content.education[0].degree}</div>
                <div className="text-slate-600 leading-none mt-[1px] truncate" style={{ fontSize: 5.5 }}>{content.education[0].school}</div>
              </>
            ) : (
              <>
                <Bar w="w-[48%]" dark />
                <div className="mt-[1.5px]"><Bar w="w-[36%]" op={0.6} /></div>
              </>
            )}
          </div>
          <div className="flex-1">
            <SectionHead accent={accent} style="underline" label={content?.skills?.length ? "Skills" : undefined} />
            {content?.skills && content.skills.length > 0 ? (
              <div className="flex flex-wrap gap-[2px] mt-[1px]">
                {content.skills.slice(0, 5).map((s, i) => (
                  <SkillPill key={i} accent={accent} label={s} />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-[2px] mt-[1px]">
                {[28, 22, 32, 26, 20, 30].map((w, i) => (
                  <SkillPill key={i} accent={accent} w={w} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MINIMAL ─────────────────────────────────────────────────────────────── */
function MinimalLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ padding: "8px 9px 5px" }}>
      {/* Centered header */}
      <div className="text-center mb-[4px]">
        {content?.name ? (
          <div className="font-bold text-slate-900 leading-none mb-[2px]" style={{ fontSize: 11, letterSpacing: "-0.01em" }}>
            {content.name}
          </div>
        ) : (
          <div className="h-[6px] w-[50%] rounded-full mx-auto mb-[2.5px] bg-slate-800" />
        )}
        {content?.title ? (
          <div className="font-medium leading-none mb-[3px] truncate" style={{ fontSize: 6.5, color: accent }}>
            {content.title}
          </div>
        ) : (
          <div className="h-[2.5px] w-[35%] rounded-full mx-auto mb-[3px]" style={{ backgroundColor: accent }} />
        )}
      </div>

      <div className="h-[2px] w-full rounded-full mb-[4px]" style={{ backgroundColor: accent }} />

      <div className="mb-[4px]">
        {content?.summary ? (
          <BodyText text={content.summary.slice(0, 120) + (content.summary.length > 120 ? '…' : '')} size={5.5} />
        ) : (
          <>
            <ThinBar w="w-full" />
            <div className="mt-[1.5px]"><ThinBar w="w-11/12" /></div>
            <div className="mt-[1.5px]"><ThinBar w="w-5/6" /></div>
          </>
        )}
      </div>

      <div className="h-px w-full bg-slate-200 mb-[3px]" />

      <div className="mb-[3px]">
        <div className="font-bold uppercase tracking-wider mb-[3px] leading-none" style={{ fontSize: 5.5, color: accent, letterSpacing: "0.1em" }}>
          Experience
        </div>
        {content?.experiences && content.experiences.length > 0 ? (
          content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} bullets={2} />
          ))
        ) : (
          <>
            <JobEntry accent={accent} title="w-[42%]" date="w-[20%]" company="w-[32%]" bullets={2} />
            <JobEntry accent={accent} title="w-[38%]" date="w-[18%]" company="w-[28%]" bullets={2} />
          </>
        )}
      </div>

      <div className="h-px w-full bg-slate-200 mb-[3px]" />

      <div className="flex gap-[6px]">
        <div className="flex-1">
          <div className="font-bold uppercase tracking-wider mb-[2px] leading-none" style={{ fontSize: 5.5, color: accent, letterSpacing: "0.1em" }}>
            Education
          </div>
          {content?.education?.[0] ? (
            <>
              <div className="font-semibold text-slate-800 leading-none truncate" style={{ fontSize: 6 }}>{content.education[0].degree}</div>
              <div className="text-slate-600 leading-none mt-[1px] truncate" style={{ fontSize: 5.5 }}>{content.education[0].school}</div>
            </>
          ) : (
            <>
              <Bar w="w-[48%]" dark />
              <div className="mt-[1px]"><Bar w="w-[36%]" op={0.6} /></div>
            </>
          )}
        </div>
        <div className="w-px bg-slate-200" />
        <div className="flex-1">
          <div className="font-bold uppercase tracking-wider mb-[2px] leading-none" style={{ fontSize: 5.5, color: accent, letterSpacing: "0.1em" }}>
            Skills
          </div>
          {content?.skills && content.skills.length > 0 ? (
            <div className="flex flex-wrap gap-[2px]">
              {content.skills.slice(0, 5).map((s, i) => (
                <SkillPill key={i} accent={accent} label={s} />
              ))}
            </div>
          ) : (
            [80, 65, 90, 70, 75].map((pct, i) => (
              <div key={i} className="h-[2px] rounded-full bg-slate-200 mb-[2px]">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accent, opacity: 0.5 }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CREATIVE ────────────────────────────────────────────────────────────── */
function CreativeLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full flex">
      <div
        className="w-[32%] h-full flex flex-col shrink-0"
        style={{ backgroundColor: accent, padding: "8px 5px 6px" }}
      >
        <div className="w-[28px] h-[28px] rounded-full bg-white/25 mx-auto mb-[4px] flex items-center justify-center border-[2.5px] border-white/50">
          {content?.name ? (
            <div className="text-white font-bold leading-none" style={{ fontSize: 10 }}>
              {content.name.split(/\s+/).map(n => n[0]).slice(0, 2).join('')}
            </div>
          ) : (
            <div className="w-[14px] h-[14px] rounded-full bg-white/60" />
          )}
        </div>
        {content?.name ? (
          <div className="text-white font-bold text-center leading-none mb-[1px]" style={{ fontSize: 7.5 }}>
            {content.name}
          </div>
        ) : (
          <div className="h-[3px] w-[88%] rounded-full bg-white mx-auto mb-[2px]" />
        )}
        {content?.title ? (
          <div className="text-white/75 text-center leading-tight mb-[5px] truncate" style={{ fontSize: 5.5 }}>
            {content.title}
          </div>
        ) : (
          <div className="h-[2px] w-[65%] rounded-full bg-white/60 mx-auto mb-[5px]" />
        )}

        <div className="h-px bg-white/25 mb-[4px]" />

        <div>
          <div className="text-white/80 font-bold uppercase tracking-wider mb-[3px] leading-none" style={{ fontSize: 5, letterSpacing: "0.08em" }}>
            Skills
          </div>
          {content?.skills && content.skills.length > 0 ? (
            content.skills.slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="text-white/90 leading-none truncate mb-[2.5px]"
                style={{ fontSize: 5.5 }}
              >
                {s}
              </div>
            ))
          ) : (
            [85, 70, 90, 60, 75].map((pct, i) => (
              <div key={i} className="mb-[2.5px]">
                <div className="h-[2.5px] w-full rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white/75" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 bg-white" style={{ padding: "8px 7px 6px" }}>
        <div className="mb-[4px]">
          <SectionHead accent={accent} style="bar" label={content?.experiences?.length ? "Experience" : undefined} />
          {content?.experiences && content.experiences.length > 0 ? (
            content.experiences.slice(0, 2).map((e, i) => (
              <div key={i} className="mb-[4px] pl-[3px] border-l-[2px]" style={{ borderColor: accent + "55" }}>
                <div className="flex items-center justify-between gap-[3px]">
                  <div className="font-semibold text-slate-800 leading-none truncate" style={{ fontSize: 6.5 }}>{e.role}</div>
                  {e.dates && <div className="text-slate-500 leading-none shrink-0" style={{ fontSize: 5 }}>{e.dates}</div>}
                </div>
                <div className="text-slate-600 leading-none truncate mt-[1px]" style={{ fontSize: 5.5 }}>{e.company}</div>
                <div className="mt-[2px]">
                  <Bullet accent={accent} w="w-full" />
                  <Bullet accent={accent} w="w-5/6" />
                </div>
              </div>
            ))
          ) : (
            [0, 1].map((j) => (
              <div key={j} className="mb-[4px] pl-[3px] border-l-[2px]" style={{ borderColor: accent + "55" }}>
                <div className="flex items-center justify-between mb-[1.5px]">
                  <Bar w="w-[45%]" dark />
                  <Bar w="w-[20%]" op={0.6} />
                </div>
                <Bar w="w-[32%]" op={0.6} />
                <div className="mt-[2px]">
                  <Bullet accent={accent} w="w-full" />
                  <Bullet accent={accent} w="w-5/6" />
                  {j === 0 && <Bullet accent={accent} w="w-4/5" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CENTERED ────────────────────────────────────────────────────────────── */
function CenteredLayout({ accent, content }: { accent: string; content?: PreviewContent }) {
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ padding: "7px 9px 5px" }}>
      <div className="h-[4px] w-full rounded-sm mb-[5px]" style={{ backgroundColor: accent }} />

      <div className="text-center mb-[4px]">
        {content?.name ? (
          <div className="font-bold text-slate-900 leading-none mb-[2px]" style={{ fontSize: 11, letterSpacing: "-0.01em" }}>
            {content.name}
          </div>
        ) : (
          <div className="h-[6px] w-[52%] rounded-full mx-auto mb-[2.5px] bg-slate-800" />
        )}
        {content?.title ? (
          <div className="font-medium leading-none mb-[3px] truncate" style={{ fontSize: 6.5, color: accent, opacity: 0.85 }}>
            {content.title}
          </div>
        ) : (
          <div className="h-[2.5px] w-[36%] rounded-full mx-auto mb-[3px]" style={{ backgroundColor: accent, opacity: 0.75 }} />
        )}
      </div>

      <div className="flex items-center gap-[4px] mb-[4px]">
        <div className="h-px flex-1 bg-slate-200" />
        <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: accent }} />
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mb-[4px]">
        {content?.summary ? (
          <BodyText text={content.summary.slice(0, 120) + (content.summary.length > 120 ? '…' : '')} size={5.5} />
        ) : (
          <>
            <ThinBar w="w-full" />
            <div className="mt-[1.5px]"><ThinBar w="w-11/12" /></div>
            <div className="mt-[1.5px]"><ThinBar w="w-5/6" /></div>
          </>
        )}
      </div>

      <div className="mb-[4px]">
        <div className="text-center mb-[2px]">
          <div className="font-bold uppercase tracking-wider leading-none inline-block" style={{ fontSize: 5.5, color: accent, letterSpacing: "0.1em" }}>
            Experience
          </div>
        </div>
        <div className="h-px w-full bg-slate-200 mb-[3px]" />
        {content?.experiences && content.experiences.length > 0 ? (
          content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} bullets={2} />
          ))
        ) : (
          <>
            <JobEntry accent={accent} title="w-[40%]" date="w-[20%]" company="w-[30%]" bullets={2} />
            <JobEntry accent={accent} title="w-[36%]" date="w-[18%]" company="w-[28%]" bullets={2} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Router ──────────────────────────────────────────────────────────────── */
export function TemplatePreview({
  layout,
  accent,
  content,
}: {
  layout: TemplateLayout;
  accent: string;
  content?: PreviewContent;
}) {
  // Render the selected layout; if anything throws (e.g. unexpected content
  // shape), fall back to the generic placeholder version rather than bubbling
  // the error up to the nearest error boundary.
  try {
    switch (layout) {
      case "classic":   return <ClassicLayout accent={accent} content={content} />;
      case "sidebar":   return <SidebarLayout accent={accent} content={content} />;
      case "executive": return <ExecutiveLayout accent={accent} content={content} />;
      case "minimal":   return <MinimalLayout accent={accent} content={content} />;
      case "creative":  return <CreativeLayout accent={accent} content={content} />;
      case "centered":  return <CenteredLayout accent={accent} content={content} />;
    }
  } catch {
    return <ClassicLayout accent={accent} />;
  }
}
