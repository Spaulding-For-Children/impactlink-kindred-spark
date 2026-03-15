
-- Prospect searches table to track search history
CREATE TABLE public.prospect_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initiated_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  topics_used text[] NOT NULL DEFAULT '{}',
  populations_used text[] NOT NULL DEFAULT '{}',
  prospect_count integer NOT NULL DEFAULT 0,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

ALTER TABLE public.prospect_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage prospect searches" ON public.prospect_searches
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Prospects table to store individual results
CREATE TABLE public.prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id uuid REFERENCES public.prospect_searches(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  organization text,
  prospect_type text NOT NULL DEFAULT 'researcher',
  email text,
  phone text,
  website text,
  location text,
  department_title text,
  social_profiles jsonb DEFAULT '{}',
  relevant_topics text[] DEFAULT '{}',
  relevance_score integer DEFAULT 0,
  suggested_outreach text,
  source_url text,
  outreach_status text NOT NULL DEFAULT 'not_contacted',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage prospects" ON public.prospects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
