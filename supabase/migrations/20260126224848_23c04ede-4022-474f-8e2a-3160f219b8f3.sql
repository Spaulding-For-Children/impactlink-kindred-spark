-- Create enum for resource types
CREATE TYPE public.resource_type AS ENUM ('workshop', 'toolkit', 'reading');

-- Create enum for resource format
CREATE TYPE public.resource_format AS ENUM ('live', 'recorded', 'pdf', 'article', 'report', 'book');

-- Create resources table
CREATE TABLE public.resources (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    resource_type resource_type NOT NULL,
    format resource_format NOT NULL,
    category TEXT NOT NULL,
    thumbnail_url TEXT,
    file_url TEXT,
    external_url TEXT,
    duration TEXT,
    author TEXT,
    publication_date DATE,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resource_bookmarks table for users to save resources
CREATE TABLE public.resource_bookmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources (public read)
CREATE POLICY "Resources are viewable by everyone"
ON public.resources FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage resources"
ON public.resources FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update resources"
ON public.resources FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.resource_bookmarks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
ON public.resource_bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.resource_bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample workshops & webinars
INSERT INTO public.resources (title, description, resource_type, format, category, duration, author, publication_date, tags, featured) VALUES
('Introduction to Research Design in Child Welfare', 'Learn the fundamentals of designing rigorous research studies in child welfare settings. This workshop covers ethical considerations, sampling strategies, and common pitfalls to avoid.', 'workshop', 'recorded', 'Research Design & Ethics', '2h 30m', 'Dr. Sarah Chen', '2025-11-15', ARRAY['research design', 'ethics', 'methodology'], true),
('Ethical Considerations in Child Welfare Research', 'Navigate the complex ethical landscape of research involving vulnerable populations. Includes case studies and IRB preparation guidance.', 'workshop', 'recorded', 'Research Design & Ethics', '1h 45m', 'Prof. Michael Torres', '2025-10-20', ARRAY['ethics', 'IRB', 'vulnerable populations'], false),
('Mixed Methods Approaches for Child Welfare Studies', 'Combine quantitative and qualitative methods effectively in your research design.', 'workshop', 'live', 'Research Design & Ethics', '3h', 'Dr. Emily Watson', '2026-02-15', ARRAY['mixed methods', 'qualitative', 'quantitative'], false),

('Statistical Analysis for Social Work Research', 'Master statistical techniques commonly used in child welfare research, from basic descriptive statistics to advanced regression modeling.', 'workshop', 'recorded', 'Data Analysis Techniques', '4h', 'Dr. James Liu', '2025-09-10', ARRAY['statistics', 'SPSS', 'regression'], true),
('Qualitative Data Analysis: NVivo Masterclass', 'Learn to use NVivo for coding and analyzing qualitative data from interviews and focus groups.', 'workshop', 'recorded', 'Data Analysis Techniques', '2h', 'Dr. Amanda Foster', '2025-08-25', ARRAY['qualitative', 'NVivo', 'coding'], false),
('Data Visualization for Impact Reporting', 'Create compelling visualizations that communicate your research findings to diverse audiences.', 'workshop', 'live', 'Data Analysis Techniques', '1h 30m', 'Maria Santos', '2026-03-01', ARRAY['visualization', 'reporting', 'communication'], false),

('Federal Grant Writing for Child Welfare Research', 'Comprehensive guide to writing successful federal grant applications, including NIH and ACF funding opportunities.', 'workshop', 'recorded', 'Grant Writing Strategies', '3h', 'Dr. Patricia Williams', '2025-12-01', ARRAY['grants', 'NIH', 'ACF', 'funding'], true),
('Building Strong Logic Models', 'Develop clear logic models that strengthen your grant applications and program evaluations.', 'workshop', 'recorded', 'Grant Writing Strategies', '1h 30m', 'Robert Kim', '2025-07-15', ARRAY['logic models', 'program evaluation', 'grants'], false),
('Foundation Funding for Community Organizations', 'Strategies for smaller organizations to secure foundation support for child welfare initiatives.', 'workshop', 'live', 'Grant Writing Strategies', '2h', 'Jennifer Adams', '2026-01-20', ARRAY['foundations', 'nonprofits', 'community'], false);

-- Insert sample toolkits & guides
INSERT INTO public.resources (title, description, resource_type, format, category, author, publication_date, tags, featured) VALUES
('Academic-Agency Partnership Development Guide', 'A comprehensive 50-page guide for establishing and maintaining productive partnerships between universities and child welfare agencies. Includes templates, MOUs, and communication frameworks.', 'toolkit', 'pdf', 'Academic-Agency Partnerships', 'ImpactLink Research Team', '2025-06-01', ARRAY['partnerships', 'collaboration', 'templates'], true),
('Data Sharing Agreement Template Kit', 'Legal templates and best practices for establishing data sharing agreements that protect privacy while enabling research.', 'toolkit', 'pdf', 'Academic-Agency Partnerships', 'Legal Affairs Committee', '2025-04-15', ARRAY['data sharing', 'legal', 'privacy'], false),
('Joint Publication Guidelines', 'Framework for collaborative authorship and publication between academic and agency partners.', 'toolkit', 'pdf', 'Academic-Agency Partnerships', 'Publications Working Group', '2025-03-01', ARRAY['publications', 'authorship', 'collaboration'], false),

('Community Engagement Toolkit', 'Step-by-step guide for meaningfully engaging communities in research design, implementation, and dissemination.', 'toolkit', 'pdf', 'Community-Based Research', 'Community Advisory Board', '2025-08-01', ARRAY['community engagement', 'CBPR', 'participation'], true),
('Participatory Action Research Manual', 'Practical manual for conducting participatory action research with families and youth in child welfare.', 'toolkit', 'pdf', 'Community-Based Research', 'Dr. Rosa Martinez', '2025-05-20', ARRAY['PAR', 'youth voice', 'families'], false),
('Cultural Competency in Research Assessment', 'Self-assessment tools and guidelines for ensuring cultural competency throughout the research process.', 'toolkit', 'pdf', 'Community-Based Research', 'Diversity & Inclusion Committee', '2025-02-10', ARRAY['cultural competency', 'DEI', 'assessment'], false),

('Evidence-Based Practice Implementation Guide', 'Comprehensive framework for selecting, adapting, and implementing evidence-based practices in child welfare settings.', 'toolkit', 'pdf', 'Evidence-Based Practices', 'Implementation Science Team', '2025-09-01', ARRAY['EBP', 'implementation', 'fidelity'], true),
('Trauma-Informed Care Assessment Tool', 'Validated assessment instrument for measuring organizational trauma-informed care implementation.', 'toolkit', 'pdf', 'Evidence-Based Practices', 'TIC Collaborative', '2025-07-01', ARRAY['trauma-informed', 'assessment', 'organizational'], false),
('Program Evaluation Starter Kit', 'Essential tools for agencies beginning to evaluate their programs, including logic model templates and measurement guides.', 'toolkit', 'pdf', 'Evidence-Based Practices', 'Evaluation Consortium', '2025-01-15', ARRAY['evaluation', 'outcomes', 'measurement'], false);

-- Insert sample reading list items
INSERT INTO public.resources (title, description, resource_type, format, category, author, publication_date, tags, featured, external_url) VALUES
('Child Welfare: A Comprehensive Handbook', 'The definitive textbook on child welfare policy, practice, and research. Essential reading for students and practitioners.', 'reading', 'book', 'Foundational Texts', 'Myers, J.E.B. (Ed.)', '2020-01-01', ARRAY['textbook', 'comprehensive', 'policy'], true, 'https://example.com/book1'),
('The Child Welfare Challenge', 'Examines the challenges facing child welfare systems and proposes evidence-based solutions.', 'reading', 'book', 'Foundational Texts', 'Pecora, P.J., et al.', '2018-06-01', ARRAY['systems', 'reform', 'solutions'], false, 'https://example.com/book2'),
('Race, Culture, and Child Maltreatment', 'Critical examination of how race and culture intersect with child welfare practice and policy.', 'reading', 'book', 'Foundational Texts', 'Korbin, J.E.', '2019-03-01', ARRAY['race', 'culture', 'equity'], false, 'https://example.com/book3'),

('Trauma-Responsive Family Engagement', 'Recent study on effective family engagement strategies in trauma-informed child welfare practice.', 'reading', 'article', 'Recent Journal Articles', 'Smith, A. & Johnson, B.', '2025-08-01', ARRAY['trauma', 'family engagement', 'practice'], true, 'https://doi.org/example1'),
('Predictive Analytics in Child Protection: Promise and Perils', 'Critical analysis of the use of AI and predictive analytics in child protection decision-making.', 'reading', 'article', 'Recent Journal Articles', 'Chen, L., et al.', '2025-06-15', ARRAY['AI', 'predictive analytics', 'ethics'], false, 'https://doi.org/example2'),
('Foster Care Outcomes: A Longitudinal Study', 'Ten-year follow-up study examining educational and employment outcomes for youth who aged out of foster care.', 'reading', 'article', 'Recent Journal Articles', 'Williams, K., et al.', '2025-04-01', ARRAY['foster care', 'outcomes', 'longitudinal'], false, 'https://doi.org/example3'),

('Global Report on Child Protection 2025', 'Comprehensive analysis of child protection systems and outcomes across 50 countries.', 'reading', 'report', 'International Reports', 'UNICEF', '2025-01-01', ARRAY['global', 'child protection', 'comparative'], true, 'https://unicef.org/reports'),
('Violence Against Children: Regional Perspectives', 'Multi-regional analysis of violence against children with evidence-based prevention strategies.', 'reading', 'report', 'International Reports', 'World Health Organization', '2024-11-01', ARRAY['violence prevention', 'WHO', 'regional'], false, 'https://who.int/reports'),
('Child Welfare Reform in Europe', 'Comparative study of child welfare reform efforts across European Union member states.', 'reading', 'report', 'International Reports', 'European Commission', '2024-09-01', ARRAY['Europe', 'reform', 'policy'], false, 'https://ec.europa.eu/reports');