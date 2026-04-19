/**
 * Premium resume thumbnail previews — category-standard visual language.
 *
 * Visual principles:
 *   • Paper-like feel: white background, subtle type hierarchy, minimal color.
 *   • Real content when available, elegant sample content when not.
 *   • 14 distinct layouts spanning classic to bold/modern.
 *   • Accent color used sparingly: name/role, section rules, skill chips only.
 *
 * Renders at ~220px tall; designed to stay legible when scaled up to card size.
 */

import type { ResumeData } from "@/types";

export type TemplateLayout =
  // Original six
  | "classic"
  | "sidebar"
  | "executive"
  | "minimal"
  | "creative"
  | "centered"
  // Eight new pro layouts
  | "bold-header"
  | "split-right"
  | "timeline"
  | "mono"
  | "photo-card"
  | "compact"
  | "serif"
  | "split-accent";

export interface PreviewContent {
  name?: string;
  title?: string;
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

/* ─── Tokens ────────────────────────────────────────────────────────────── */

const INK = "#0b1220";
const INK_MED = "#334155";
const INK_MUTED = "#475569";
const INK_LIGHT = "#94a3b8";
const RULE = "#e2e8f0";
const PAPER = "#ffffff";
const PAPER_SOFT = "#f8fafc";

/* ─── Sample fallback content ───────────────────────────────────────────── */
// Used on the Templates page where no real resume exists. Picked to showcase
// the layout with typography that reads like a real resume at thumbnail scale.

const SAMPLE: Required<Pick<PreviewContent, "name" | "title" | "location" | "email" | "summary" | "experiences" | "education" | "skills">> = {
  name: "Alex Morgan",
  title: "Senior Product Designer",
  location: "San Francisco, CA",
  email: "alex.morgan@email.com",
  summary:
    "Senior product designer with 8+ years shipping consumer and SaaS products. Led design for high-growth teams from Series A through IPO.",
  experiences: [
    {
      role: "Senior Product Designer",
      company: "Linear",
      dates: "2022–Present",
      bullets: [
        "Led redesign of core issue tracker used by 300K+ teams",
        "Shipped new onboarding that lifted activation 42%",
      ],
    },
    {
      role: "Product Designer",
      company: "Notion",
      dates: "2019–2022",
      bullets: [
        "Owned design for mobile app across 10 releases",
      ],
    },
  ],
  education: [{ degree: "B.A. Design", school: "Stanford University", dates: "2015" }],
  skills: ["Figma", "Prototyping", "Design Systems", "User Research", "A/B Testing", "Motion"],
};

function withSample(c?: PreviewContent): Required<PreviewContent> {
  return {
    name: c?.name || SAMPLE.name,
    title: c?.title || SAMPLE.title,
    location: c?.location || SAMPLE.location,
    email: c?.email || SAMPLE.email,
    summary: c?.summary || SAMPLE.summary,
    experiences: c?.experiences?.length ? c.experiences : SAMPLE.experiences,
    education: c?.education?.length ? c.education : SAMPLE.education,
    skills: c?.skills?.length ? c.skills : SAMPLE.skills,
  };
}

/**
 * Defensively extract simplified preview content from a full ResumeData object.
 * Returns undefined on malformed data so callers fall back to sample content.
 */
export function previewFromResumeData(data?: Partial<ResumeData> | null): PreviewContent | undefined {
  try {
    if (!data || typeof data !== "object") return undefined;
    const asString = (v: unknown): string | undefined =>
      typeof v === "string" && v.trim() ? v : undefined;
    const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

    const contact = (data as { contact?: unknown }).contact;
    const contactObj = contact && typeof contact === "object" ? (contact as Record<string, unknown>) : {};

    const workRaw = asArray<Record<string, unknown>>((data as { work_experience?: unknown }).work_experience);
    const eduRaw = asArray<Record<string, unknown>>((data as { education?: unknown }).education);
    const skillsRaw = asArray<unknown>((data as { skills?: unknown }).skills);

    const firstExp = workRaw[0] ?? {};

    const experiences = workRaw
      .slice(0, 3)
      .map((w) => ({
        role:
          asString(w.job_title) ??
          asString((w as { position?: unknown }).position) ??
          "",
        company: asString(w.company) ?? "",
        dates: w.is_current
          ? "Present"
          : asString(w.end_date) ?? asString((w as { endDate?: unknown }).endDate) ?? "",
        bullets: asArray<unknown>(w.achievements ?? (w as { bullets?: unknown }).bullets)
          .filter((b) => typeof b === "string")
          .slice(0, 3) as string[],
      }))
      .filter((e) => e.role || e.company);

    const education = eduRaw
      .slice(0, 2)
      .map((e) => ({
        degree: asString(e.degree) ?? "",
        school: asString(e.institution) ?? asString((e as { school?: unknown }).school) ?? "",
        dates: asString(e.end_date) ?? "",
      }))
      .filter((e) => e.degree || e.school);

    const skills = skillsRaw
      .slice(0, 10)
      .map((s) => {
        if (typeof s === "string") return s;
        if (s && typeof s === "object" && typeof (s as { name?: unknown }).name === "string") {
          return (s as { name: string }).name;
        }
        return "";
      })
      .filter(Boolean);

    const c: PreviewContent = {
      name: asString(contactObj.full_name),
      title:
        asString(firstExp.job_title) ??
        asString((firstExp as { position?: unknown }).position),
      location: asString(contactObj.location),
      email: asString(contactObj.email),
      summary: asString((data as { summary?: unknown }).summary),
      experiences,
      education,
      skills,
    };

    // If nothing meaningful was extracted, return undefined so the caller
    // uses the curated sample fallback instead.
    const hasAnything =
      c.name || c.title || c.summary || experiences.length > 0 || skills.length > 0;
    return hasAnything ? c : undefined;
  } catch {
    return undefined;
  }
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function shadeColor(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ─── Primitive components ──────────────────────────────────────────────── */

const Name = ({
  text,
  size = 13,
  color = INK,
  tracking = "-0.02em",
  weight = 700,
}: {
  text: string;
  size?: number;
  color?: string;
  tracking?: string;
  weight?: number;
}) => (
  <div
    className="leading-none truncate"
    style={{ fontSize: size, color, letterSpacing: tracking, fontWeight: weight }}
  >
    {text}
  </div>
);

const Title = ({
  text,
  size = 6.5,
  color = INK_MUTED,
  weight = 500,
  tracking = "0em",
}: {
  text: string;
  size?: number;
  color?: string;
  weight?: number;
  tracking?: string;
}) => (
  <div
    className="leading-none truncate"
    style={{ fontSize: size, color, fontWeight: weight, letterSpacing: tracking }}
  >
    {text}
  </div>
);

const Contact = ({
  items,
  color = INK_LIGHT,
  size = 4.8,
  separator = "  •  ",
}: {
  items: string[];
  color?: string;
  size?: number;
  separator?: string;
}) => {
  const clean = items.filter(Boolean);
  return (
    <div
      className="leading-none truncate"
      style={{ fontSize: size, color, fontWeight: 500 }}
    >
      {clean.join(separator)}
    </div>
  );
};

const SectionHeader = ({
  label,
  accent,
  rule = true,
  center = false,
  size = 5.2,
  tracking = "0.16em",
}: {
  label: string;
  accent: string;
  rule?: boolean;
  center?: boolean;
  size?: number;
  tracking?: string;
}) => (
  <div className={`mb-[3px] ${center ? "text-center" : ""}`}>
    <div
      className="font-bold uppercase leading-none inline-block"
      style={{ fontSize: size, letterSpacing: tracking, color: accent }}
    >
      {label}
    </div>
    {rule && (
      <div
        className="h-px w-full mt-[2px]"
        style={{ backgroundColor: accent, opacity: 0.25 }}
      />
    )}
  </div>
);

const Body = ({
  text,
  size = 5,
  color = INK_MED,
  weight = 400,
}: {
  text: string;
  size?: number;
  color?: string;
  weight?: number;
}) => (
  <div
    className="leading-[1.42] line-clamp-2"
    style={{ fontSize: size, color, fontWeight: weight }}
  >
    {text}
  </div>
);

const Bullet = ({
  text,
  accent,
  useDash = false,
}: {
  text: string;
  accent: string;
  useDash?: boolean;
}) => (
  <div className="flex items-start gap-[3px] mb-[1.5px]">
    {useDash ? (
      <span
        className="shrink-0 leading-[1.3]"
        style={{ fontSize: 5, color: accent, fontWeight: 700 }}
      >
        —
      </span>
    ) : (
      <span
        className="shrink-0 leading-[1.3]"
        style={{ fontSize: 5, color: accent, fontWeight: 700 }}
      >
        •
      </span>
    )}
    <div
      className="leading-[1.32] line-clamp-2 flex-1"
      style={{ fontSize: 4.8, color: INK_MED }}
    >
      {text}
    </div>
  </div>
);

const SkillChip = ({
  accent,
  label,
  variant = "soft",
}: {
  accent: string;
  label: string;
  variant?: "soft" | "outline" | "solid" | "plain";
}) => {
  const styles: Record<string, React.CSSProperties> = {
    soft: {
      color: accent,
      backgroundColor: accent + "15",
      border: `1px solid ${accent}22`,
    },
    outline: {
      color: INK_MED,
      backgroundColor: "transparent",
      border: `1px solid ${RULE}`,
    },
    solid: {
      color: "#fff",
      backgroundColor: accent,
      border: `1px solid ${accent}`,
    },
    plain: {
      color: INK_MED,
      backgroundColor: "transparent",
      border: "none",
      padding: "0",
    },
  };
  return (
    <span
      className="inline-flex items-center font-medium leading-none truncate max-w-[72px]"
      style={{
        fontSize: 4.8,
        padding: variant === "plain" ? 0 : "1.5px 4px",
        borderRadius: 999,
        ...styles[variant],
      }}
    >
      {label}
    </span>
  );
};

/** Small divider rule — used between sections in some layouts. */
const HR = ({ color = RULE, op = 1 }: { color?: string; op?: number }) => (
  <div className="h-px w-full" style={{ backgroundColor: color, opacity: op }} />
);

/** Compact job entry — consistent across most layouts. */
const JobEntry = ({
  accent,
  exp,
  dense = false,
  dashBullets = false,
}: {
  accent: string;
  exp: { role: string; company: string; dates?: string; bullets?: string[] };
  dense?: boolean;
  dashBullets?: boolean;
}) => (
  <div className={dense ? "mb-[5px]" : "mb-[7px]"}>
    <div className="flex items-baseline justify-between gap-[6px]">
      <div
        className="font-semibold leading-none truncate flex-1"
        style={{ fontSize: 6.5, color: INK, letterSpacing: "-0.005em" }}
      >
        {exp.role}
      </div>
      {exp.dates && (
        <div
          className="leading-none shrink-0"
          style={{ fontSize: 4.6, color: INK_LIGHT, fontStyle: "italic" }}
        >
          {exp.dates}
        </div>
      )}
    </div>
    <div
      className="leading-none truncate mt-[1.5px]"
      style={{ fontSize: 5.6, color: accent, fontWeight: 500 }}
    >
      {exp.company}
    </div>
    {exp.bullets && exp.bullets.length > 0 && (
      <div className="mt-[2.5px]">
        {exp.bullets.slice(0, dense ? 1 : 2).map((b, i) => (
          <Bullet key={i} text={b} accent={accent} useDash={dashBullets} />
        ))}
      </div>
    )}
  </div>
);

/* ═══ LAYOUTS ═══════════════════════════════════════════════════════════════ */

/* ─── 1. CLASSIC ────────────────────────────────────────────────────────── */
function ClassicLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: PAPER, padding: "11px 12px 8px" }}
    >
      {/* Header */}
      <div className="mb-[4px]">
        <Name text={content.name} size={13} />
        <div className="mt-[3px]">
          <Title text={content.title} size={7} color={accent} weight={600} />
        </div>
        <div className="mt-[4px]">
          <Contact items={[content.email, content.location]} />
        </div>
      </div>
      <div className="h-[2px] w-full mb-[7px]" style={{ backgroundColor: accent }} />

      {/* Summary */}
      <div className="mb-[7px]">
        <SectionHeader label="Summary" accent={accent} />
        <Body text={content.summary} />
      </div>

      {/* Experience */}
      <div className="mb-[6px] flex-1">
        <SectionHeader label="Experience" accent={accent} />
        {content.experiences.slice(0, 2).map((e, i) => (
          <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
        ))}
      </div>

      {/* Skills */}
      <div>
        <SectionHeader label="Skills" accent={accent} />
        <div className="flex flex-wrap gap-[3px]">
          {content.skills.slice(0, 7).map((s, i) => (
            <SkillChip key={i} accent={accent} label={s} variant="soft" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. SIDEBAR ────────────────────────────────────────────────────────── */
function SidebarLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex" style={{ backgroundColor: PAPER }}>
      {/* Left dark sidebar */}
      <div
        className="w-[35%] h-full flex flex-col shrink-0"
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, ${shadeColor(accent, -15)} 100%)`,
          padding: "12px 7px 8px",
        }}
      >
        <div
          className="w-[36px] h-[36px] rounded-full mx-auto mb-[6px] flex items-center justify-center text-white font-bold"
          style={{
            backgroundColor: "rgba(255,255,255,0.18)",
            fontSize: 11,
            border: "1.5px solid rgba(255,255,255,0.4)",
          }}
        >
          {initialsOf(content.name)}
        </div>
        <div
          className="text-white text-center font-bold leading-tight truncate px-[2px] mb-[2px]"
          style={{ fontSize: 8, letterSpacing: "-0.01em" }}
        >
          {content.name}
        </div>
        <div
          className="text-center leading-tight mb-[8px] px-[2px]"
          style={{ fontSize: 5.2, color: "rgba(255,255,255,0.78)" }}
        >
          {content.title}
        </div>

        <div className="h-px bg-white/20 mb-[6px]" />

        {/* Contact */}
        <div className="mb-[8px]">
          <div
            className="text-white font-bold uppercase mb-[4px] leading-none"
            style={{ fontSize: 4.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.85)" }}
          >
            Contact
          </div>
          <div className="flex flex-col gap-[3px]">
            <div className="leading-none truncate" style={{ fontSize: 4.8, color: "rgba(255,255,255,0.9)" }}>
              {content.email}
            </div>
            <div className="leading-none truncate" style={{ fontSize: 4.8, color: "rgba(255,255,255,0.9)" }}>
              {content.location}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/20 mb-[6px]" />

        {/* Skills */}
        <div>
          <div
            className="text-white font-bold uppercase mb-[4px] leading-none"
            style={{ fontSize: 4.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.85)" }}
          >
            Skills
          </div>
          <div className="flex flex-col gap-[3px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <div
                key={i}
                className="leading-none truncate"
                style={{ fontSize: 5, color: "rgba(255,255,255,0.92)" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right main */}
      <div className="flex-1 flex flex-col" style={{ padding: "11px 11px 8px" }}>
        {/* Summary */}
        <div className="mb-[6px]">
          <SectionHeader label="Profile" accent={accent} />
          <Body text={content.summary} />
        </div>

        <div className="mb-[5px] flex-1">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>

        <div>
          <SectionHeader label="Education" accent={accent} />
          <div className="font-semibold leading-none truncate" style={{ fontSize: 6, color: INK }}>
            {content.education[0]?.degree}
          </div>
          <div className="mt-[1.5px] leading-none truncate" style={{ fontSize: 5, color: INK_MUTED }}>
            {content.education[0]?.school}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 3. EXECUTIVE ──────────────────────────────────────────────────────── */
function ExecutiveLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER }}>
      <div
        className="w-full shrink-0 text-white"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${shadeColor(accent, -20)} 100%)`,
          padding: "12px 13px 10px",
        }}
      >
        <Name text={content.name} size={13} color="#fff" />
        <div className="mt-[3px]">
          <Title text={content.title} size={7} color="rgba(255,255,255,0.88)" />
        </div>
        <div className="mt-[5px]">
          <Contact items={[content.email, content.location]} color="rgba(255,255,255,0.78)" />
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "9px 13px 8px" }}>
        <div className="mb-[6px]">
          <SectionHeader label="Executive Summary" accent={accent} />
          <Body text={content.summary} />
        </div>

        <div className="mb-[6px] flex-1">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>

        <div className="flex gap-[10px]">
          <div className="flex-1 min-w-0">
            <SectionHeader label="Education" accent={accent} />
            <div className="font-semibold leading-none truncate" style={{ fontSize: 6, color: INK }}>
              {content.education[0]?.degree}
            </div>
            <div className="mt-[1.5px] leading-none truncate" style={{ fontSize: 5, color: accent }}>
              {content.education[0]?.school}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <SectionHeader label="Core Competencies" accent={accent} />
            <div className="flex flex-wrap gap-[3px]">
              {content.skills.slice(0, 5).map((s, i) => (
                <SkillChip key={i} accent={accent} label={s} variant="soft" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 4. MINIMAL ────────────────────────────────────────────────────────── */
function MinimalLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: PAPER, padding: "13px 14px 10px" }}
    >
      {/* Centered header */}
      <div className="text-center mb-[5px]">
        <Name text={content.name} size={14} tracking="-0.025em" />
        <div className="mt-[3px] flex justify-center">
          <Title text={content.title} size={6.5} color={INK_MUTED} tracking="0.02em" />
        </div>
        <div className="mt-[4px] flex justify-center">
          <Contact items={[content.email, content.location]} />
        </div>
      </div>

      <div
        className="h-[1px] w-[45%] mx-auto mb-[7px]"
        style={{ backgroundColor: accent }}
      />

      {/* Summary */}
      <div className="mb-[6px]">
        <Body text={content.summary} size={5} />
      </div>

      <HR color={RULE} />

      <div className="my-[6px] flex-1">
        <SectionHeader label="Experience" accent={accent} />
        {content.experiences.slice(0, 2).map((e, i) => (
          <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
        ))}
      </div>

      <HR color={RULE} />

      <div className="flex gap-[10px] mt-[5px]">
        <div className="flex-1 min-w-0">
          <SectionHeader label="Education" accent={accent} rule={false} />
          <div className="font-semibold leading-none truncate" style={{ fontSize: 6, color: INK }}>
            {content.education[0]?.degree}
          </div>
          <div className="mt-[1.5px] leading-none truncate" style={{ fontSize: 5, color: INK_MUTED }}>
            {content.education[0]?.school}
          </div>
        </div>
        <div className="w-px" style={{ backgroundColor: RULE }} />
        <div className="flex-1 min-w-0">
          <SectionHeader label="Skills" accent={accent} rule={false} />
          <div className="flex flex-wrap gap-[3px]">
            {content.skills.slice(0, 5).map((s, i) => (
              <SkillChip key={i} accent={accent} label={s} variant="outline" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 5. CREATIVE ───────────────────────────────────────────────────────── */
function CreativeLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex" style={{ backgroundColor: PAPER }}>
      {/* Left accent column */}
      <div
        className="w-[34%] h-full flex flex-col shrink-0"
        style={{
          background: `linear-gradient(180deg, ${accent} 0%, ${shadeColor(accent, -22)} 100%)`,
          padding: "13px 7px 9px",
        }}
      >
        <div
          className="w-[38px] h-[38px] rounded-full mx-auto mb-[7px] flex items-center justify-center text-white font-bold"
          style={{
            backgroundColor: "rgba(255,255,255,0.22)",
            fontSize: 12,
            border: "2px solid rgba(255,255,255,0.5)",
          }}
        >
          {initialsOf(content.name)}
        </div>
        <div
          className="text-white text-center font-bold leading-tight mb-[2px] px-[2px]"
          style={{ fontSize: 8.5, letterSpacing: "-0.01em" }}
        >
          {content.name}
        </div>
        <div
          className="text-center leading-tight mb-[9px] px-[2px]"
          style={{ fontSize: 5.2, color: "rgba(255,255,255,0.8)" }}
        >
          {content.title}
        </div>

        <div className="h-px bg-white/25 mb-[6px]" />

        <div className="mb-[7px]">
          <div
            className="font-bold uppercase leading-none mb-[3px]"
            style={{ fontSize: 4.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)" }}
          >
            About
          </div>
          <div className="leading-[1.4] line-clamp-3" style={{ fontSize: 4.6, color: "rgba(255,255,255,0.85)" }}>
            {content.summary}
          </div>
        </div>

        <div className="h-px bg-white/25 mb-[6px]" />

        <div>
          <div
            className="font-bold uppercase leading-none mb-[3px]"
            style={{ fontSize: 4.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)" }}
          >
            Expertise
          </div>
          {content.skills.slice(0, 5).map((s, i) => (
            <div
              key={i}
              className="leading-none truncate mb-[2.5px]"
              style={{ fontSize: 5, color: "rgba(255,255,255,0.94)" }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Right main */}
      <div className="flex-1" style={{ padding: "12px 11px 8px" }}>
        <div className="mb-[5px]">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <div key={i} className="mb-[6px] pl-[5px] border-l-[2px]" style={{ borderColor: accent }}>
              <div className="flex items-baseline justify-between gap-[4px]">
                <div
                  className="font-semibold leading-none truncate"
                  style={{ fontSize: 6.5, color: INK }}
                >
                  {e.role}
                </div>
                {e.dates && (
                  <div
                    className="leading-none shrink-0"
                    style={{ fontSize: 4.6, color: INK_LIGHT, fontStyle: "italic" }}
                  >
                    {e.dates}
                  </div>
                )}
              </div>
              <div className="leading-none truncate mt-[1.5px]" style={{ fontSize: 5.5, color: accent, fontWeight: 500 }}>
                {e.company}
              </div>
              {e.bullets && e.bullets.length > 0 && (
                <div className="mt-[2px]">
                  {e.bullets.slice(0, i === 0 ? 2 : 1).map((b, j) => (
                    <Bullet key={j} text={b} accent={accent} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <SectionHeader label="Education" accent={accent} />
          <div className="pl-[5px] border-l-[2px]" style={{ borderColor: accent }}>
            <div className="font-semibold leading-none truncate" style={{ fontSize: 6.2, color: INK }}>
              {content.education[0]?.degree}
            </div>
            <div className="mt-[1.5px] leading-none truncate" style={{ fontSize: 5, color: accent }}>
              {content.education[0]?.school}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 6. CENTERED ───────────────────────────────────────────────────────── */
function CenteredLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: PAPER, padding: "13px 14px 9px" }}
    >
      <div className="text-center mb-[5px]">
        <Name text={content.name} size={14} />
        <div className="mt-[3px] flex justify-center">
          <Title text={content.title} size={7} color={accent} weight={600} />
        </div>
        <div className="mt-[5px] flex justify-center">
          <Contact items={[content.email, content.location]} />
        </div>
      </div>

      <div className="flex items-center gap-[5px] mb-[7px]">
        <div className="h-px flex-1" style={{ backgroundColor: RULE }} />
        <div className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: accent }} />
        <div className="h-px flex-1" style={{ backgroundColor: RULE }} />
      </div>

      <div className="mb-[7px]">
        <Body text={content.summary} size={5} />
      </div>

      <div className="mb-[6px] flex-1">
        <SectionHeader label="Experience" accent={accent} center />
        {content.experiences.slice(0, 2).map((e, i) => (
          <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
        ))}
      </div>

      <div className="flex gap-[10px]">
        <div className="flex-1 min-w-0">
          <SectionHeader label="Education" accent={accent} center />
          <div className="text-center font-semibold leading-none truncate" style={{ fontSize: 6, color: INK }}>
            {content.education[0]?.degree}
          </div>
          <div className="text-center mt-[1px] leading-none truncate" style={{ fontSize: 5, color: INK_MUTED }}>
            {content.education[0]?.school}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <SectionHeader label="Skills" accent={accent} center />
          <div className="flex flex-wrap justify-center gap-[3px]">
            {content.skills.slice(0, 5).map((s, i) => (
              <SkillChip key={i} accent={accent} label={s} variant="soft" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 7. BOLD-HEADER (new) ──────────────────────────────────────────────── */
function BoldHeaderLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER }}>
      {/* Giant name band */}
      <div style={{ backgroundColor: INK, padding: "13px 14px 10px" }}>
        <Name text={content.name} size={15} color="#fff" tracking="-0.03em" />
        <div className="mt-[4px] flex items-center gap-[6px]">
          <div className="h-[3px] w-[14px] rounded-full" style={{ backgroundColor: accent }} />
          <Title text={content.title} size={6.8} color="rgba(255,255,255,0.85)" weight={500} />
        </div>
        <div className="mt-[5px]">
          <Contact items={[content.email, content.location]} color="rgba(255,255,255,0.6)" />
        </div>
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "9px 13px 8px" }}>
        <div className="mb-[6px]">
          <SectionHeader label="Profile" accent={accent} size={5.2} />
          <Body text={content.summary} />
        </div>

        <div className="mb-[5px] flex-1">
          <SectionHeader label="Experience" accent={accent} size={5.2} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>

        <div>
          <SectionHeader label="Skills" accent={accent} size={5.2} />
          <div className="flex flex-wrap gap-[3px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <SkillChip key={i} accent={accent} label={s} variant="solid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 8. SPLIT-RIGHT (new) ──────────────────────────────────────────────── */
function SplitRightLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex" style={{ backgroundColor: PAPER }}>
      {/* Left main */}
      <div className="flex-1 flex flex-col" style={{ padding: "11px 11px 8px" }}>
        <div className="mb-[5px]">
          <Name text={content.name} size={13} />
          <div className="mt-[3px]">
            <Title text={content.title} size={6.8} color={accent} weight={600} />
          </div>
        </div>
        <div
          className="h-[1.5px] w-[48px] mb-[7px]"
          style={{ backgroundColor: accent }}
        />

        <div className="mb-[6px]">
          <SectionHeader label="Summary" accent={accent} />
          <Body text={content.summary} />
        </div>

        <div className="flex-1">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>
      </div>

      {/* Right light sidebar */}
      <div
        className="w-[34%] h-full flex flex-col shrink-0"
        style={{ backgroundColor: PAPER_SOFT, padding: "12px 9px 9px", borderLeft: `1px solid ${RULE}` }}
      >
        <div className="mb-[8px]">
          <div
            className="font-bold uppercase leading-none mb-[3px]"
            style={{ fontSize: 4.8, letterSpacing: "0.18em", color: accent }}
          >
            Contact
          </div>
          <div className="leading-[1.4] truncate" style={{ fontSize: 4.8, color: INK_MED }}>
            {content.email}
          </div>
          <div className="leading-[1.4] truncate" style={{ fontSize: 4.8, color: INK_MED }}>
            {content.location}
          </div>
        </div>

        <div className="mb-[8px]">
          <div
            className="font-bold uppercase leading-none mb-[4px]"
            style={{ fontSize: 4.8, letterSpacing: "0.18em", color: accent }}
          >
            Skills
          </div>
          <div className="flex flex-col gap-[3px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <div key={i} className="leading-none truncate" style={{ fontSize: 5, color: INK_MED }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            className="font-bold uppercase leading-none mb-[3px]"
            style={{ fontSize: 4.8, letterSpacing: "0.18em", color: accent }}
          >
            Education
          </div>
          <div className="leading-[1.3] font-semibold truncate" style={{ fontSize: 5.5, color: INK }}>
            {content.education[0]?.degree}
          </div>
          <div className="leading-[1.3] truncate" style={{ fontSize: 4.8, color: INK_MUTED }}>
            {content.education[0]?.school}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 9. TIMELINE (new) ─────────────────────────────────────────────────── */
function TimelineLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER, padding: "12px 13px 9px" }}>
      <div className="flex items-end justify-between mb-[5px]">
        <div className="min-w-0">
          <Name text={content.name} size={13} />
          <div className="mt-[3px]">
            <Title text={content.title} size={6.8} color={accent} weight={600} />
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="leading-[1.3]" style={{ fontSize: 4.6, color: INK_MUTED }}>
            {content.email}
          </div>
          <div className="leading-[1.3]" style={{ fontSize: 4.6, color: INK_MUTED }}>
            {content.location}
          </div>
        </div>
      </div>
      <HR color={RULE} />

      <div className="my-[6px]">
        <Body text={content.summary} />
      </div>

      <div className="mb-[6px] flex-1">
        <SectionHeader label="Experience" accent={accent} />
        <div className="relative pl-[10px]">
          {/* Vertical line */}
          <div
            className="absolute top-0 bottom-0 left-[2.5px] w-[1.5px] rounded-full"
            style={{ backgroundColor: accent, opacity: 0.35 }}
          />
          {content.experiences.slice(0, 2).map((e, i) => (
            <div key={i} className="relative mb-[6px]">
              {/* Dot */}
              <div
                className="absolute -left-[10px] top-[2px] w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 0 1.5px ${PAPER}` }}
              />
              <div className="flex items-baseline justify-between gap-[6px]">
                <div
                  className="font-semibold leading-none truncate"
                  style={{ fontSize: 6.5, color: INK }}
                >
                  {e.role}
                </div>
                {e.dates && (
                  <div
                    className="leading-none shrink-0"
                    style={{ fontSize: 4.6, color: INK_LIGHT, fontStyle: "italic" }}
                  >
                    {e.dates}
                  </div>
                )}
              </div>
              <div className="leading-none truncate mt-[1.5px]" style={{ fontSize: 5.6, color: accent, fontWeight: 500 }}>
                {e.company}
              </div>
              {e.bullets && e.bullets.length > 0 && (
                <div className="mt-[2px]">
                  {e.bullets.slice(0, i === 0 ? 2 : 1).map((b, j) => (
                    <Bullet key={j} text={b} accent={accent} useDash />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader label="Skills" accent={accent} />
        <div className="flex flex-wrap gap-[3px]">
          {content.skills.slice(0, 7).map((s, i) => (
            <SkillChip key={i} accent={accent} label={s} variant="outline" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 10. MONO (new — tech/engineering) ──────────────────────────────────── */
function MonoLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  const mono: React.CSSProperties = {
    fontFamily:
      '"SF Mono","JetBrains Mono","Menlo","Consolas",ui-monospace,monospace',
  };
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER, padding: "11px 12px 8px" }}>
      <div className="mb-[5px]">
        <div className="flex items-baseline gap-[5px]">
          <span style={{ ...mono, fontSize: 5.2, color: accent, fontWeight: 600 }}>{"//"}</span>
          <Name text={content.name} size={12} />
        </div>
        <div className="mt-[3px] flex items-baseline gap-[4px]">
          <span style={{ ...mono, fontSize: 5, color: INK_LIGHT }}>role:</span>
          <Title text={content.title} size={6.5} color={accent} weight={500} />
        </div>
        <div className="mt-[4px] flex items-baseline gap-[4px]" style={mono}>
          <span style={{ fontSize: 4.6, color: INK_LIGHT }}>@</span>
          <Contact items={[content.email, content.location]} size={4.6} separator="  ·  " />
        </div>
      </div>

      <HR color={accent} op={0.3} />

      <div className="mt-[6px] mb-[6px]">
        <div style={{ ...mono, fontSize: 5, color: accent, fontWeight: 600, letterSpacing: "0.08em" }}>
          /* PROFILE */
        </div>
        <div className="mt-[2px]">
          <Body text={content.summary} />
        </div>
      </div>

      <div className="mb-[5px] flex-1">
        <div style={{ ...mono, fontSize: 5, color: accent, fontWeight: 600, letterSpacing: "0.08em" }}>
          /* EXPERIENCE */
        </div>
        <div className="mt-[3px]">
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} dashBullets />
          ))}
        </div>
      </div>

      <div>
        <div style={{ ...mono, fontSize: 5, color: accent, fontWeight: 600, letterSpacing: "0.08em" }}>
          /* SKILLS */
        </div>
        <div className="flex flex-wrap gap-[3px] mt-[2px]" style={mono}>
          {content.skills.slice(0, 6).map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center leading-none"
              style={{
                fontSize: 4.8,
                padding: "1.5px 4px",
                border: `1px solid ${accent}50`,
                color: INK_MED,
                borderRadius: 3,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 11. PHOTO-CARD (new) ──────────────────────────────────────────────── */
function PhotoCardLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER }}>
      {/* Top card with photo */}
      <div className="flex items-center gap-[10px]" style={{ padding: "13px 14px 10px" }}>
        <div
          className="shrink-0 w-[46px] h-[46px] rounded-xl flex items-center justify-center text-white font-bold"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${shadeColor(accent, -18)} 100%)`,
            fontSize: 14,
            boxShadow: `0 4px 10px ${accent}30`,
          }}
        >
          {initialsOf(content.name)}
        </div>
        <div className="min-w-0 flex-1">
          <Name text={content.name} size={12} />
          <div className="mt-[2px]">
            <Title text={content.title} size={6.2} color={accent} weight={600} />
          </div>
          <div className="mt-[3px]">
            <Contact items={[content.email, content.location]} />
          </div>
        </div>
      </div>

      <div
        className="h-[1px] w-full"
        style={{ backgroundColor: RULE }}
      />

      <div className="flex-1 flex flex-col" style={{ padding: "8px 14px 8px" }}>
        <div className="mb-[6px]">
          <SectionHeader label="About" accent={accent} />
          <Body text={content.summary} />
        </div>

        <div className="mb-[6px] flex-1">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>

        <div>
          <SectionHeader label="Skills" accent={accent} />
          <div className="flex flex-wrap gap-[3px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <SkillChip key={i} accent={accent} label={s} variant="soft" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 12. COMPACT (new — ultra-dense ATS) ───────────────────────────────── */
function CompactLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER, padding: "11px 13px 8px" }}>
      {/* Tight header */}
      <div className="mb-[3px]">
        <Name text={content.name} size={12.5} tracking="-0.01em" />
      </div>
      <Title text={content.title} size={6.2} color={INK_MED} weight={500} />
      <div className="mt-[3px] mb-[5px]">
        <Contact items={[content.email, content.location]} />
      </div>
      <HR color={INK_LIGHT} op={0.5} />

      <div className="mt-[5px] mb-[5px]">
        <div className="font-bold uppercase leading-none mb-[2px]" style={{ fontSize: 5.2, letterSpacing: "0.14em", color: INK }}>
          Summary
        </div>
        <Body text={content.summary} />
      </div>

      <div className="mb-[5px] flex-1">
        <div className="font-bold uppercase leading-none mb-[3px]" style={{ fontSize: 5.2, letterSpacing: "0.14em", color: INK }}>
          Experience
        </div>
        {content.experiences.slice(0, 2).map((e, i) => (
          <div key={i} className="mb-[5px]">
            <div className="flex items-baseline justify-between gap-[6px]">
              <div className="font-semibold leading-none truncate" style={{ fontSize: 6.2, color: INK }}>
                {e.role}, <span style={{ fontWeight: 500, color: INK_MED }}>{e.company}</span>
              </div>
              {e.dates && (
                <div className="leading-none shrink-0" style={{ fontSize: 4.6, color: INK_LIGHT }}>
                  {e.dates}
                </div>
              )}
            </div>
            {e.bullets && e.bullets.length > 0 && (
              <div className="mt-[2px]">
                {e.bullets.slice(0, i === 0 ? 2 : 1).map((b, j) => (
                  <Bullet key={j} text={b} accent={accent} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-[8px]">
        <div className="flex-1 min-w-0">
          <div className="font-bold uppercase leading-none mb-[2px]" style={{ fontSize: 5.2, letterSpacing: "0.14em", color: INK }}>
            Education
          </div>
          <div className="font-semibold leading-none truncate" style={{ fontSize: 5.8, color: INK }}>
            {content.education[0]?.degree}
          </div>
          <div className="mt-[1px] leading-none truncate" style={{ fontSize: 4.8, color: INK_MUTED }}>
            {content.education[0]?.school}
          </div>
        </div>
        <div className="flex-[1.4] min-w-0">
          <div className="font-bold uppercase leading-none mb-[2px]" style={{ fontSize: 5.2, letterSpacing: "0.14em", color: INK }}>
            Skills
          </div>
          <div className="leading-[1.35] line-clamp-2" style={{ fontSize: 4.8, color: INK_MED }}>
            {content.skills.slice(0, 8).join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 13. SERIF (new — elegant/academic) ────────────────────────────────── */
function SerifLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  const serif: React.CSSProperties = {
    fontFamily: '"Playfair Display","Cormorant Garamond","Georgia",serif',
  };
  return (
    <div className="w-full h-full flex flex-col" style={{ backgroundColor: PAPER, padding: "14px 15px 10px" }}>
      <div className="text-center mb-[4px]">
        <div
          className="leading-none truncate"
          style={{ ...serif, fontSize: 16, color: INK, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {content.name}
        </div>
        <div className="mt-[3px] flex justify-center">
          <Title text={content.title} size={6.8} color={INK_MUTED} weight={400} tracking="0.08em" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-[6px] mb-[7px]">
        <div className="h-px w-[20px]" style={{ backgroundColor: INK_LIGHT }} />
        <div style={{ fontSize: 4.6, color: accent, letterSpacing: "0.2em" }}>◆</div>
        <div className="h-px w-[20px]" style={{ backgroundColor: INK_LIGHT }} />
      </div>

      <div className="text-center mb-[7px]">
        <Contact items={[content.email, content.location]} size={4.8} />
      </div>

      <div className="mb-[6px]">
        <div
          className="mb-[2px] italic"
          style={{ ...serif, fontSize: 6.2, color: accent, fontWeight: 600, letterSpacing: "0.02em" }}
        >
          Summary
        </div>
        <Body text={content.summary} />
      </div>

      <div className="mb-[6px] flex-1">
        <div
          className="mb-[3px] italic"
          style={{ ...serif, fontSize: 6.2, color: accent, fontWeight: 600, letterSpacing: "0.02em" }}
        >
          Experience
        </div>
        {content.experiences.slice(0, 2).map((e, i) => (
          <div key={i} className="mb-[5px]">
            <div className="flex items-baseline justify-between gap-[6px]">
              <div style={{ ...serif, fontSize: 6.8, color: INK, fontWeight: 600 }} className="leading-none truncate flex-1">
                {e.role}
              </div>
              {e.dates && (
                <div className="leading-none shrink-0 italic" style={{ fontSize: 4.8, color: INK_LIGHT }}>
                  {e.dates}
                </div>
              )}
            </div>
            <div
              className="leading-none truncate mt-[1.5px] italic"
              style={{ fontSize: 5.4, color: INK_MED }}
            >
              {e.company}
            </div>
            {e.bullets && e.bullets.length > 0 && (
              <div className="mt-[2px]">
                {e.bullets.slice(0, i === 0 ? 2 : 1).map((b, j) => (
                  <Bullet key={j} text={b} accent={accent} useDash />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <div
          className="mb-[2px] italic"
          style={{ ...serif, fontSize: 6.2, color: accent, fontWeight: 600, letterSpacing: "0.02em" }}
        >
          Skills
        </div>
        <div className="leading-[1.4] text-center italic" style={{ fontSize: 5, color: INK_MED }}>
          {content.skills.slice(0, 7).join(" · ")}
        </div>
      </div>
    </div>
  );
}

/* ─── 14. SPLIT-ACCENT (new — top-third accent) ─────────────────────────── */
function SplitAccentLayout({ accent, content }: { accent: string; content: Required<PreviewContent> }) {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: PAPER }}>
      {/* Top accent band with initials card */}
      <div
        className="relative shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${shadeColor(accent, -25)} 100%)`,
          padding: "14px 14px 28px",
        }}
      >
        <div
          className="leading-none font-bold truncate"
          style={{ fontSize: 14, color: "#fff", letterSpacing: "-0.02em" }}
        >
          {content.name}
        </div>
        <div className="mt-[3px] leading-none truncate" style={{ fontSize: 6.8, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
          {content.title}
        </div>
      </div>

      {/* Floating initials card */}
      <div
        className="absolute rounded-xl flex items-center justify-center font-bold"
        style={{
          right: 14,
          top: 14,
          width: 38,
          height: 38,
          backgroundColor: "rgba(255,255,255,0.95)",
          color: accent,
          fontSize: 13,
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      >
        {initialsOf(content.name)}
      </div>

      <div className="flex-1 flex flex-col" style={{ padding: "6px 14px 9px", marginTop: -16 }}>
        {/* Card with contact */}
        <div
          className="rounded-lg mb-[7px] flex items-center justify-center gap-[8px]"
          style={{
            backgroundColor: PAPER,
            padding: "6px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: `1px solid ${RULE}`,
          }}
        >
          <Contact items={[content.email, content.location]} />
        </div>

        <div className="mb-[6px]">
          <SectionHeader label="Summary" accent={accent} />
          <Body text={content.summary} />
        </div>

        <div className="mb-[5px] flex-1">
          <SectionHeader label="Experience" accent={accent} />
          {content.experiences.slice(0, 2).map((e, i) => (
            <JobEntry key={i} accent={accent} exp={e} dense={i > 0} />
          ))}
        </div>

        <div>
          <SectionHeader label="Skills" accent={accent} />
          <div className="flex flex-wrap gap-[3px]">
            {content.skills.slice(0, 6).map((s, i) => (
              <SkillChip key={i} accent={accent} label={s} variant="soft" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Router ────────────────────────────────────────────────────────────── */

export function TemplatePreview({
  layout,
  accent,
  content,
}: {
  layout: TemplateLayout;
  accent: string;
  content?: PreviewContent;
}) {
  const c = withSample(content);
  try {
    switch (layout) {
      case "classic":      return <ClassicLayout accent={accent} content={c} />;
      case "sidebar":      return <SidebarLayout accent={accent} content={c} />;
      case "executive":    return <ExecutiveLayout accent={accent} content={c} />;
      case "minimal":      return <MinimalLayout accent={accent} content={c} />;
      case "creative":     return <CreativeLayout accent={accent} content={c} />;
      case "centered":     return <CenteredLayout accent={accent} content={c} />;
      case "bold-header":  return <BoldHeaderLayout accent={accent} content={c} />;
      case "split-right":  return <SplitRightLayout accent={accent} content={c} />;
      case "timeline":     return <TimelineLayout accent={accent} content={c} />;
      case "mono":         return <MonoLayout accent={accent} content={c} />;
      case "photo-card":   return <PhotoCardLayout accent={accent} content={c} />;
      case "compact":      return <CompactLayout accent={accent} content={c} />;
      case "serif":        return <SerifLayout accent={accent} content={c} />;
      case "split-accent": return <SplitAccentLayout accent={accent} content={c} />;
      default:             return <ClassicLayout accent={accent} content={c} />;
    }
  } catch {
    return <ClassicLayout accent={accent} content={c} />;
  }
}
