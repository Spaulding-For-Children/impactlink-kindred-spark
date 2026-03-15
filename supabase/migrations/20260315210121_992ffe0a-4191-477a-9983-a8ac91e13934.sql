
-- Table for admin-managed research topics
CREATE TABLE public.research_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.research_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research topics viewable by everyone" ON public.research_topics
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert research topics" ON public.research_topics
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research topics" ON public.research_topics
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research topics" ON public.research_topics
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Table for admin-managed research populations
CREATE TABLE public.research_populations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.research_populations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Research populations viewable by everyone" ON public.research_populations
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert research populations" ON public.research_populations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update research populations" ON public.research_populations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete research populations" ON public.research_populations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Table for user-suggested forum topics
CREATE TABLE public.forum_topic_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  suggested_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone
);

ALTER TABLE public.forum_topic_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suggestions" ON public.forum_topic_suggestions
  FOR SELECT TO authenticated USING (suggested_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all suggestions" ON public.forum_topic_suggestions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can suggest topics" ON public.forum_topic_suggestions
  FOR INSERT TO authenticated WITH CHECK (suggested_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update suggestions" ON public.forum_topic_suggestions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete suggestions" ON public.forum_topic_suggestions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed initial research topics from the current hardcoded list
INSERT INTO public.research_topics (name) VALUES
  ('Trauma & Resilience'),
  ('Family Reunification'),
  ('Youth Justice'),
  ('Foster Care'),
  ('Kinship Care'),
  ('Child Protection'),
  ('Mental Health'),
  ('Education Outcomes');

-- Seed initial research populations
INSERT INTO public.research_populations (name) VALUES
  ('Children 0-5'),
  ('Children 6-12'),
  ('Adolescents 13-17'),
  ('Young Adults 18-24'),
  ('Families'),
  ('Foster Parents'),
  ('Kinship Caregivers');
