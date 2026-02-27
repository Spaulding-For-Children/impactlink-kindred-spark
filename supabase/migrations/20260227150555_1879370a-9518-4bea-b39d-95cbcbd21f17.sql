
-- Create site_settings table for admin-customizable content, theme, and layout
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (needed for rendering pages)
CREATE POLICY "Site settings are viewable by everyone"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete site settings"
ON public.site_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
('theme', '{
  "primaryColor": "230 60% 25%",
  "secondaryColor": "38 92% 50%",
  "accentColor": "150 30% 45%",
  "fontDisplay": "Playfair Display",
  "fontBody": "DM Sans"
}'::jsonb),
('hero', '{
  "badge": "Bridging Research & Practice",
  "title": "ImpactLink",
  "tagline": "Where Academic Inquiry Meets Real-World Child Welfare Impact",
  "description": "Connecting students, researchers, and child welfare agencies to advance evidence-based practices through meaningful partnerships, shared data, and collaborative innovation.",
  "ctaPrimary": "Get Started",
  "ctaSecondary": "Explore Directory"
}'::jsonb),
('sections', '{
  "order": ["hero", "directory", "collaboration", "datatools", "resources", "events", "contact"],
  "hidden": []
}'::jsonb),
('directory_section', '{
  "title": "Professional Directory",
  "description": "Connect with students, researchers, and agencies advancing child welfare"
}'::jsonb),
('collaboration_section', '{
  "title": "Collaboration Hub",
  "description": "Find partners, join forums, and advance research together"
}'::jsonb),
('resources_section', '{
  "title": "Resources & Learning",
  "description": "Access workshops, toolkits, reading lists, and research showcases"
}'::jsonb),
('events_section', '{
  "title": "Events & Opportunities",
  "description": "Discover upcoming events, workshops, and funding opportunities"
}'::jsonb),
('contact_section', '{
  "title": "Get in Touch",
  "description": "Have questions? We would love to hear from you"
}'::jsonb),
('datatools_section', '{
  "title": "Data & Tools",
  "description": "Access datasets, analysis tools, and ethical guidelines"
}'::jsonb);
