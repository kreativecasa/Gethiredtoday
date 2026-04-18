# Deploy the LiveCareer-style builder (run when you wake up)

All code changes are saved. The sandbox can't remove `.git/*.lock`, so the
commit + push must run on your Mac.

## One-liner to ship everything

Open Terminal, cd to your repo, and run:

```bash
find .git -name "*.lock" -delete && \
git add -A && \
git commit -m "LiveCareer-style resume builder: intro wizard, AI suggestions, step sidebar

Intro wizard (/builder/wizard):
- 4-step flow: easy steps landing, experience level, filtered template picker, start fresh
- Top progress indicator, mobile friendly
- Finish creates resume with starter data and routes to /builder/resume/[id]?wizard=1

Expert Recommended AI suggestion panels:
- New /api/ai/suggestions endpoint (bullets, skills, summary, related-titles)
- Reusable SuggestionPanel component wired into Summary, Experience (per job), and Skills

Wizard-mode sidebar (?wizard=1):
- Numbered steps with green checkmarks when done
- Resume completeness progress bar
- Sticky bottom bar with Back / Next: [Section]

Navigation updates:
- Navbar Build Free Resume routes to /builder/wizard
- Dashboard and My Resumes New Resume routes to /builder/wizard
- /builder/resume template picker creates starter resume and opens wizard builder

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" && \
git push origin main
```

Vercel will auto-deploy after the push lands on `main`. ~2-3 min to live.

## What shipped this turn

- `/builder/wizard` — 4-step intro flow matching LiveCareer (easy steps → experience level → filtered template picker with Headshot/Columns filters → start fresh)
- `/api/ai/suggestions` — new endpoint returning pre-written bullets/skills/summaries/related-titles for any job title
- `<SuggestionPanel>` — reusable Expert Recommended UI with (+) add buttons, search, filter, related titles
- Panels wired into Summary, Work Experience (per job), and Skills sections of the existing builder
- Wizard mode (`?wizard=1`) on the builder: numbered step sidebar, completeness %, sticky Next/Back bottom bar
- All "New Resume" CTAs (navbar, dashboard, resumes list, header) now route through the wizard

## Files changed

```
app/api/ai/suggestions/route.ts         [NEW]
app/builder/wizard/page.tsx             [NEW]
components/suggestion-panel.tsx         [NEW]
app/builder/resume/[id]/page.tsx        Wizard sidebar + completeness + Next bar + SuggestionPanel integration
app/builder/resume/page.tsx             Template picker now creates resume + wizard mode
app/dashboard/header.tsx                New Resume → wizard
app/dashboard/page.tsx                  New Resume → wizard
app/dashboard/resumes/page.tsx          New Resume → wizard
components/navbar.tsx                   Build Free Resume → wizard
```

## After deploy — verification

1. Visit https://gethiretoday.com — click "Build Free Resume" in navbar
   → Should land on the "Just three easy steps" wizard landing
2. Click Next → pick experience level → pick a template → Start fresh
   → Should open the builder with wizard sidebar (numbered steps + completeness %)
3. Open Summary section — the right side should show "Expert-written examples" with real AI-generated summaries and (+) buttons
4. Open Work Experience, add a job with a title, then look at the right panel
   → Should see AI-generated bullet suggestions for that role
5. Open Skills → same pattern, (+) buttons add skills
6. Click "Next: [Next Section]" at the bottom → should navigate
7. Resume completeness bar should update as you fill in sections

## Still missing vs. LiveCareer (next pass if you want)

- Upload existing resume parser (PDF/DOCX → builder fields)
- Rich text formatting toolbar in textareas (Bold/Italic/Underline/Bulleted list)
- "Enhance with AI" button for highlighted text in descriptions
- Skills Rating tab (1-5 stars per skill)
- Section tip/intro pages between sections ("Now let's fill out your Work history")
- Missing-data nudge modals on Next click
- "Welcome back" saved-draft modal
- Related Job Titles quick-swap below job title field
- Remote work checkbox in job entry
- Photo upload UI in contact section
- Additional coursework expandable section on Education
- Pro Tip boxes per section
