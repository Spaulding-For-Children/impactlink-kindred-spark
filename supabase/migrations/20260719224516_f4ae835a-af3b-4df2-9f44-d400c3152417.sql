
-- RFP sections
CREATE TABLE public.rfp_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  group_name text NOT NULL,
  title text NOT NULL,
  content_markdown text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_custom boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rfp_sections TO authenticated;
GRANT ALL ON public.rfp_sections TO service_role;
ALTER TABLE public.rfp_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage rfp_sections" ON public.rfp_sections FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_rfp_sections_updated BEFORE UPDATE ON public.rfp_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sections
INSERT INTO public.rfp_sections (slug, group_name, title, sort_order) VALUES
('executive-summary','Strategic','Executive Summary',1),
('statement-of-need','Strategic','Statement of Need',2),
('project-description','Strategic','Full Project & Site Description and Rationale',3),
('critical-impact','Strategic','Critical Impact & Outcomes',4),
('benefit-children-families','Strategic','Benefit to Children, Families & Organizations',5),
('sustainability-plan','Strategic','Sustainability Plan',6),
('logic-model','Theory & Framework','Logic Model (Inputs, Activities, Outputs, Outcomes)',7),
('theory-of-change','Theory & Framework','Theory of Change',8),
('smart-goals','Theory & Framework','SMART Goals & Objectives',9),
('supportive-data-research','Theory & Framework','Supportive Data & Research Base',10),
('rationale-elements','Theory & Framework','Rationale for Each Site Element',11),
('elements-and-steps','Functional Description','Full Description of All Elements & Steps',12),
('core-components','Functional Description','Core Steps, Components & Descriptions',13),
('tools-techniques','Functional Description','Tools & Techniques That Complement Each Stage',14),
('critical-processes','Functional Description','Critical Processes This Platform Supports',15),
('adaptations','Functional Description','Adaptations & Adaptation Processes',16),
('site-use-guide','Functional Description','Step-by-Step Site Use Guide',17),
('implementation-elements','Implementation','Essential Implementation Elements',18),
('critical-roles','Implementation','Critical Roles per Step & Stage',19),
('staff-competencies','Implementation','Staff Competencies by Role & Training Plans',20),
('tips-advice','Implementation','Tips & Advice per Step',21),
('barriers-mitigations','Implementation','Barriers to Address & Mitigations',22),
('critical-partners','Implementation','Critical Partners & Engagement Steps',23),
('community-engagement','Implementation','Community Engagement Plan',24),
('deliverables-milestones','Implementation','Deliverables & Milestones per Phase',25),
('api-software','Technical','API, Software & Data-Connection Elements',26),
('core-data-reports','Technical','Core Data, Reports & Dashboards Needed',27),
('data-collection-mgmt','Technical','Data Collection & Management Plan',28),
('it-security-hipaa-ferpa','Technical','IT Security, HIPAA & FERPA',29),
('evaluation-plan','Evaluation & Capacity','Evaluation Plan (Formative + Summative)',30),
('org-capacity','Evaluation & Capacity','Organizational Capacity',31),
('key-personnel','Evaluation & Capacity','Key Personnel Bios',32),
('dissemination','Evaluation & Capacity','Dissemination Plan',33),
('budget-narrative','Additional','Budget Narrative & Cost Justification',34),
('budget-table','Additional','Budget Table',35),
('project-timeline','Additional','Project Timeline / Gantt',36),
('risk-assessment','Additional','Risk Assessment & Contingency Plan',37),
('equity-statement','Additional','Cultural Responsiveness & Equity Statement',38),
('irb-consent','Additional','Human Subjects / IRB & Informed Consent',39),
('data-sharing','Additional','Data Sharing & Open Science Statement',40),
('letters-support','Additional','Letters of Support & MOU Placeholders',41),
('references','Additional','References / Bibliography',42),
('appendices','Additional','Appendices',43);

-- Dependency snapshot
CREATE TABLE public.dependency_snapshot (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name text NOT NULL,
  installed_version text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (package_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dependency_snapshot TO authenticated;
GRANT ALL ON public.dependency_snapshot TO service_role;
ALTER TABLE public.dependency_snapshot ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dependency_snapshot" ON public.dependency_snapshot FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Advisories
CREATE TABLE public.dependency_advisories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisory_id text UNIQUE NOT NULL,
  package_name text NOT NULL,
  installed_version text,
  severity text,
  summary text,
  fixed_version text,
  advisory_url text,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  resolved boolean NOT NULL DEFAULT false,
  notified boolean NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dependency_advisories TO authenticated;
GRANT ALL ON public.dependency_advisories TO service_role;
ALTER TABLE public.dependency_advisories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dependency_advisories" ON public.dependency_advisories FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Scan runs
CREATE TABLE public.vulnerability_scan_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  advisories_found int NOT NULL DEFAULT 0,
  new_advisories int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ok',
  error text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vulnerability_scan_runs TO authenticated;
GRANT ALL ON public.vulnerability_scan_runs TO service_role;
ALTER TABLE public.vulnerability_scan_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage vulnerability_scan_runs" ON public.vulnerability_scan_runs FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
