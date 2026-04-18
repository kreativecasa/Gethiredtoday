# Deploy wave 2 — LiveCareer parity features

All code changes are saved. Run this on your Mac to ship:

```bash
find .git -name "*.lock" -delete && \
git add -A && \
git commit -m "Builder parity: section tip pages, Pro Tip boxes, Remote toggle, Related titles, missing-description pills" && \
git push origin main
```

## What shipped this wave

**Section tip pages (wizard mode only):**
- Before every section (Contact → Summary → Experience → Education → Skills → Certifications → Languages → Projects → Volunteer → Custom) the user sees a LiveCareer-style intro:
  - Big "Now, let's…" headline + section name
  - 3-4 bullet tips of what to know
  - Mini template preview
  - "Let's go" button
- Shown once per section automatically in wizard mode, plus a "Tips" button in the header to re-open it anytime

**Pro Tip boxes per section:**
- Green contextual advice card with lightbulb icon
- Section-specific copy (contact/summary/experience/education/skills/certs/langs/projects/volunteer/custom) — matches LiveCareer's Pro Tip library
- Shown below the form content on every section

**Experience section polish:**
- **Remote work checkbox** below Location field (sets location to "Remote" and disables the input)
- **Related Job Titles** quick-pick below Job Title (AI-generated, click to swap title)
- **"Missing description" warning pill** on job cards that have title + company but no description/bullets

**Contact section polish:**
- **Photo upload** now available for all templates (was Modern-only)
- Pro Tip below the fields

## Files changed

```
components/wizard-helpers.tsx                   [NEW]
app/builder/resume/[id]/page.tsx                Pro tips, section tips, remote, related titles, missing pills, photo upload everywhere
```

## Still to build (next wave)

- Rich text formatting toolbar (Bold/Italic/Bullet) in Description + Achievements textareas
- "Enhance with AI" floating action for highlighted text
- Skills Rating tab (1-5 stars per skill)
- Welcome back modal for saved drafts
- Upload existing resume parser (PDF/DOCX → fields)
- Additional coursework expandable on Education
- Optional info pills (LinkedIn/Website/GitHub) in Contact section

Just say "continue" or paste specific asks and I'll pick these up.
