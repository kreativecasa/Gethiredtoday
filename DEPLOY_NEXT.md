# Deploy — tip page polish + visual template picker

```bash
find .git -name "*.lock" -delete && \
git add -A && \
git commit -m "Builder: remove awkward tip-page thumbnail, add visual template picker popover" && \
git push origin main
```

## What this ships

**Section tip pages — redesigned (centered + clean):**
- Removed the tiny template thumbnail on the right (was overflowing into bullets at this viewport)
- New layout: centered column with lightbulb icon, bold headline, numbered tip cards inside a rounded container, big "Let's go" CTA
- Much more focused and matches LiveCareer-grade polish

**Template picker — visual popover with thumbnails:**
- Builder header no longer uses the native `<select>`
- Click the template button (shows a mini preview of the current template) → popover opens
- Popover shows a 3-column grid of **actual template thumbnails** (using TemplatePreview) so you can pick by look
- Checkmark badge on the current template, PRO badge on pro templates, lock icon for pro users who aren't pro
- "Unlock all Pro templates — just $2/mo → Upgrade" CTA at the bottom for free users

## Files changed

```
components/wizard-helpers.tsx              Rewrote SectionTipPage (no thumbnail, numbered tips)
components/template-picker-popover.tsx     [NEW] visual picker with thumbnails
app/builder/resume/[id]/page.tsx           TEMPLATES enriched with layout/accent; header uses new popover
```
