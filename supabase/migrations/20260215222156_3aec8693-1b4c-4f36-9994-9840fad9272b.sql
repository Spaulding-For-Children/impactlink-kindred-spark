
-- Create datasets table
CREATE TABLE public.datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_organization TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'federal',
  data_format TEXT DEFAULT 'csv',
  access_url TEXT,
  documentation_url TEXT,
  coverage_start DATE,
  coverage_end DATE,
  regions TEXT[] DEFAULT '{}'::text[],
  topics TEXT[] DEFAULT '{}'::text[],
  tags TEXT[] DEFAULT '{}'::text[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Datasets are viewable by everyone" ON public.datasets FOR SELECT USING (true);
CREATE POLICY "Admins can insert datasets" ON public.datasets FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update datasets" ON public.datasets FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete datasets" ON public.datasets FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create analysis_tools table
CREATE TABLE public.analysis_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT NOT NULL,
  tool_type TEXT NOT NULL DEFAULT 'assessment',
  category TEXT NOT NULL DEFAULT 'General',
  access_url TEXT,
  documentation_url TEXT,
  license_type TEXT DEFAULT 'open',
  tags TEXT[] DEFAULT '{}'::text[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone" ON public.analysis_tools FOR SELECT USING (true);
CREATE POLICY "Admins can insert tools" ON public.analysis_tools FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update tools" ON public.analysis_tools FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete tools" ON public.analysis_tools FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create ethics_resources table
CREATE TABLE public.ethics_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'guide',
  jurisdiction TEXT DEFAULT 'U.S.',
  external_url TEXT,
  tags TEXT[] DEFAULT '{}'::text[],
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ethics_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ethics resources are viewable by everyone" ON public.ethics_resources FOR SELECT USING (true);
CREATE POLICY "Admins can insert ethics resources" ON public.ethics_resources FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update ethics resources" ON public.ethics_resources FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete ethics resources" ON public.ethics_resources FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON public.datasets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analysis_tools_updated_at BEFORE UPDATE ON public.analysis_tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ethics_resources_updated_at BEFORE UPDATE ON public.ethics_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
