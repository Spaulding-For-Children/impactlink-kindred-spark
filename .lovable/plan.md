
## Overview

Two additions:

1. **RFP / Grant Package** — a new "RFP Package" tab in the Admin panel with ~30 narrative sections. Content is AI-drafted from your actual site data (features, roles, taxonomy, analytics), edited by admins in a markdown editor per section, and exportable as both a combined document and per-section files, in Word (.docx) and PDF.
2. **Automated dependency vulnerability alerts** — a daily scan of your dependencies that creates an in-app notification (bell) and emails all admins when new advisories are found.

---

## 1. RFP / Grant Package

### Sections included (all narrative paragraph style)

Grouped for the UI sidebar; each is one editable section:

**Strategic**
1. Executive Summary
2. Statement of Need
3. Full Project & Site Description and Rationale
4. Critical Impact & Outcomes
5. Benefit to Children, Families & Organizations
6. Sustainability Plan

**Theory & Framework**
7. Logic Model (Inputs → Activities → Outputs → Outcomes)
8. Theory of Change (System Map loops, target scenarios)
9. SMART Goals & Objectives
10. Supportive Data & Research Base (methods & processes)
11. Rationale for Each Site Element

**Functional Description**
12. Full Description of All Elements & Steps
13. Core Steps, Components & Descriptions
14. Tools & Techniques That Complement Each Stage
15. Critical Processes This Platform Supports
16. Adaptations & Adaptation Processes
17. Step-by-Step Site Use Guide (best practices)

**Implementation**
18. Essential Implementation Elements (what to do in each)
19. Critical Roles per Step/Stage
20. Staff Competencies by Role & Training Plans
21. Tips & Advice per Step
22. Barriers to Address & Mitigations
23. Critical Partners & Engagement Steps
24. Community Engagement Plan (public review workflow)
25. Deliverables & Milestones per Phase

**Technical**
26. API, Software & Data-Connection Elements
27. Core Data, Reports & Dashboards Needed
28. Data Collection & Management Plan
29. IT Security, HIPAA & FERPA (safeguards + breach response)

**Evaluation & Capacity**
30. Evaluation Plan (formative CQI + summative impact)
31. Organizational Capacity (org chart, prior performance, infrastructure)
32. Key Personnel Bios (role, credentials, effort allocation)
33. Dissemination Plan (publications, conferences, briefings)

**Suggested additional sections** (included by default; admin can delete):
34. Budget Narrative & Cost Justification
35. Budget Table (line items, matching/in-kind, indirect)
36. Project Timeline / Gantt (phase → month)
37. Risk Assessment & Contingency Plan
38. Cultural Responsiveness & Equity Statement
39. Human Subjects / IRB & Informed Consent
40. Data Sharing & Open Science Statement
41. Letters of Support & MOU Placeholders
42. References / Bibliography
43. Appendices (screenshots, sample reports, checklists)

### Admin experience

- New **"RFP Package"** tab in `Admin.tsx` (icon: FileText).
- Left sidebar with the section groups above; sticky, searchable.
- Right pane: each section shows a markdown editor with live preview toggle, "AI-regenerate this section" button, last-updated timestamp, and word count.
- Top-bar actions:
  - **AI-generate all** (first-run bootstrap; also available per-section)
  - **Download Word (all)** / **Download PDF (all)** — combined doc with cover page + TOC
  - **Download Word/PDF (this section)**
  - **Import / Restore defaults**
- Add/remove/reorder sections; add custom sections.

### Data model

New table `rfp_sections`:
- `id uuid pk`, `slug text unique`, `group_name text`, `title text`, `content_markdown text`, `sort_order int`, `is_custom bool default false`, `updated_at timestamptz`, `updated_by uuid`.

Admin-only RLS (via `has_role(auth.uid(),'admin')`); GRANTs for `authenticated` + `service_role`.

Seeded on migration with the ~43 section rows (title + slug + group + empty content).

### AI drafting

New edge function `generate-rfp-section` (verify_jwt=false, admin check inside):
- Input: `{ section_slug, regenerate_all?: boolean }`
- Pulls live site context: counts from `profiles/events/resources/collaborations`, `research_topics`, `research_populations`, `forum_topics`, `site_settings` (mission, org name), role list, and the platform feature summary.
- Calls Lovable AI (`google/gemini-2.5-pro`) with a section-specific prompt template that instructs narrative paragraph style, RFP tone, ~600–1200 words, with headings and citations to platform features.
- Writes result to `rfp_sections.content_markdown`.

"AI-generate all" calls the function per section in sequence with progress toasts.

### Export (Word + PDF)

New edge function `export-rfp` (verify_jwt=false, admin check):
- Input: `{ format: 'docx' | 'pdf', scope: 'all' | 'section', slug?: string }`
- Fetches section(s), converts markdown → HTML.
- **PDF**: renders HTML with cover page + auto TOC to PDF (using `pdf-lib` + a lightweight HTML→PDF via `@react-pdf/renderer` compiled server-side, or simpler: return a print-ready HTML the browser saves as PDF via `window.print()`). Given complexity in Deno, plan uses **client-side PDF**: server returns styled HTML; client opens a print view → Save as PDF (mirrors existing role-guide export pattern).
- **DOCX**: server generates using `docx` npm package via `npm:` import in Deno — produces true .docx with headings, paragraphs, page breaks, cover, TOC field.
- Returns file as base64 or a signed download.

Per-section export uses the same function with `scope:'section'`.

### Files added
- `supabase/migrations/xxx_rfp_sections.sql`
- `src/components/admin/AdminRfpPackage.tsx` (main tab UI)
- `src/components/admin/RfpSectionEditor.tsx` (markdown editor + preview)
- `src/components/admin/RfpSectionSidebar.tsx`
- `src/hooks/useRfpSections.ts`
- `supabase/functions/generate-rfp-section/index.ts`
- `supabase/functions/export-rfp/index.ts`
- `supabase/config.toml` — register both functions with `verify_jwt = false`
- `src/pages/Admin.tsx` — add "RFP Package" tab

Reuses existing markdown renderer pattern from `ToolkitDetailModal.tsx`.

---

## 2. Automated dependency vulnerability alerts

### Approach

Daily scheduled scan comparing `package.json` + `bun.lock` against the OSV.dev public vulnerability database (free, no key, covers npm). New advisories that weren't in the last scan trigger:
- One in-app `notifications` row per admin (uses existing notification bell + realtime).
- One email per admin via existing Resend integration + `send-vulnerability-alert` function, respecting each admin's `notification_preferences`.

### Data model

New table `dependency_advisories`:
- `id uuid pk`, `advisory_id text unique` (e.g. GHSA-xxxx), `package_name text`, `installed_version text`, `severity text` (critical/high/moderate/low), `summary text`, `fixed_version text`, `advisory_url text`, `first_seen_at timestamptz default now()`, `notified bool default false`.

New table `vulnerability_scan_runs`:
- `id`, `ran_at`, `advisories_found int`, `new_advisories int`, `status text`, `error text`.

Both admin-only RLS; service_role full access.

Admin `notification_preferences` gains: `security_alerts: boolean default true`.

### Edge function

`scan-dependencies` (verify_jwt=false, service-role internal):
1. Reads `package.json` from repo — since edge functions can't read repo files, we ship a small helper: on each deploy the current dependency snapshot is written to a `dependency_snapshot` table by a migration/insert step. Alternatively (chosen): the function reads the snapshot from a dedicated `dependency_snapshot` table that we populate from a build-time script committed alongside `package.json`.
   - **Simpler chosen path**: store the dependency list in a `dependency_snapshot` table, updated by a small one-time seed + an admin "Refresh dependency snapshot" button that pastes/uploads the current `package.json` contents (avoids build-pipeline coupling in Lovable).
2. For each dependency, POSTs to `https://api.osv.dev/v1/query` with `{package:{name,ecosystem:'npm'}, version}`.
3. Diffs results against `dependency_advisories`; inserts new ones.
4. For each new advisory, for each admin user, creates a `notifications` row and invokes `send-vulnerability-alert`.
5. Logs run to `vulnerability_scan_runs`.

### Scheduling

Use existing `pg_cron` + `pg_net` pattern (see `schedule-jobs-supabase-edge-functions` guidance). Insert a cron job that runs `scan-dependencies` daily at 07:00 UTC. Registered via `supabase--insert` (not migration) since it contains project-specific URL/key.

### Email

`send-vulnerability-alert` edge function via Resend:
- Subject: `[Security] {n} new dependency advisory({s}) detected`
- HTML body with a table: package, installed, severity, summary, fixed version, link. Uses `RESEND_API_KEY`. Sends from `onboarding@resend.dev` (existing pattern) to all admins whose `notification_preferences.security_alerts !== false`.

### Admin UI

New card in **Admin → Analytics** tab: "Security Advisories":
- Count of open advisories by severity.
- "View all" opens a dialog listing all `dependency_advisories` with mark-as-resolved.
- "Run scan now" button (calls edge function on demand).
- Last scan timestamp + status.

### Files added
- `supabase/migrations/xxx_vulnerability_alerts.sql` (tables + grants + RLS + adds `security_alerts` to `notification_preferences`)
- `supabase/functions/scan-dependencies/index.ts`
- `supabase/functions/send-vulnerability-alert/index.ts`
- `src/components/admin/SecurityAdvisoriesCard.tsx` (added to `AdminAnalytics.tsx`)
- `src/components/admin/SecurityAdvisoriesDialog.tsx`
- Cron job inserted via `supabase--insert`
- `supabase/config.toml` — register both functions
- `src/pages/ProfileSettings.tsx` — add "Security alerts" toggle to notification preferences (admins only)

---

## Rollout order

1. Migrations (RFP tables + vulnerability tables + `security_alerts` preference).
2. RFP edge functions + admin UI + tab.
3. Vulnerability edge functions + Analytics card + dialog + preference toggle.
4. Insert daily cron job.
5. Verify: AI-generate one RFP section, download a DOCX and PDF, run a manual dependency scan, confirm notification bell and email delivery.
