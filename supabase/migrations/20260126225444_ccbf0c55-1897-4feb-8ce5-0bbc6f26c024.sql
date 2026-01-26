-- Create storage bucket for research uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('research-uploads', 'research-uploads', true);

-- Storage policies for research uploads
CREATE POLICY "Anyone can view research uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'research-uploads');

CREATE POLICY "Authenticated users can upload research"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'research-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'research-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'research-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for submission type
CREATE TYPE public.submission_type AS ENUM ('student_project', 'faculty_research', 'agency_report', 'global_showcase');

-- Create research_submissions table
CREATE TABLE public.research_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    submission_type submission_type NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    tags TEXT[] DEFAULT '{}',
    status submission_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enum for event type
CREATE TYPE public.event_type AS ENUM ('workshop', 'webinar', 'conference', 'networking', 'training');

-- Create events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type event_type NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_virtual BOOLEAN DEFAULT true,
    virtual_link TEXT,
    max_attendees INTEGER,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    host_name TEXT,
    host_organization TEXT,
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    reminder_sent BOOLEAN DEFAULT false,
    attended BOOLEAN DEFAULT false,
    UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.research_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research_submissions
CREATE POLICY "Approved submissions are viewable by everyone"
ON public.research_submissions FOR SELECT
USING (status = 'approved' OR author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authenticated users can submit research"
ON public.research_submissions FOR INSERT
WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their submissions"
ON public.research_submissions FOR UPDATE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their submissions"
ON public.research_submissions FOR DELETE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for events (public read)
CREATE POLICY "Events are viewable by everyone"
ON public.events FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events"
ON public.events FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
ON public.event_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations"
ON public.event_registrations FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers
CREATE TRIGGER update_research_submissions_updated_at
BEFORE UPDATE ON public.research_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample events
INSERT INTO public.events (title, description, event_type, start_date, end_date, location, is_virtual, virtual_link, max_attendees, registration_deadline, host_name, host_organization, tags, featured) VALUES
('Research Design Fundamentals Workshop', 'Join us for an interactive workshop covering the fundamentals of research design in child welfare. Learn how to develop robust methodologies, navigate ethical considerations, and design studies that produce actionable insights.', 'workshop', '2026-02-15 14:00:00+00', '2026-02-15 17:00:00+00', NULL, true, 'https://zoom.us/j/example1', 100, '2026-02-14 23:59:00+00', 'Dr. Sarah Chen', 'Stanford University', ARRAY['research design', 'methodology', 'ethics'], true),

('Data Analysis for Social Impact Webinar', 'Discover powerful data analysis techniques specifically tailored for social work research. This webinar covers statistical methods, qualitative analysis approaches, and visualization strategies.', 'webinar', '2026-02-20 18:00:00+00', '2026-02-20 19:30:00+00', NULL, true, 'https://zoom.us/j/example2', 200, '2026-02-19 23:59:00+00', 'Prof. James Liu', 'Columbia University', ARRAY['data analysis', 'statistics', 'visualization'], true),

('National Child Welfare Research Conference 2026', 'The premier annual gathering of child welfare researchers, practitioners, and policymakers. Three days of keynotes, paper presentations, and networking opportunities.', 'conference', '2026-03-10 09:00:00+00', '2026-03-12 17:00:00+00', 'Washington DC Convention Center', false, NULL, 500, '2026-03-01 23:59:00+00', 'ImpactLink Team', 'ImpactLink', ARRAY['conference', 'networking', 'research'], true),

('Grant Writing Masterclass', 'Learn strategies for writing successful grant applications from experienced reviewers. Includes hands-on exercises and peer feedback sessions.', 'training', '2026-02-25 13:00:00+00', '2026-02-25 16:00:00+00', NULL, true, 'https://zoom.us/j/example3', 50, '2026-02-24 23:59:00+00', 'Dr. Patricia Williams', 'NIH', ARRAY['grants', 'funding', 'writing'], false),

('Academic-Agency Partnership Networking Event', 'Connect with potential research partners in this structured networking event. Researchers will have the opportunity to meet with agency representatives and explore collaboration possibilities.', 'networking', '2026-03-05 16:00:00+00', '2026-03-05 18:00:00+00', NULL, true, 'https://zoom.us/j/example4', 75, '2026-03-04 23:59:00+00', 'Partnership Committee', 'ImpactLink', ARRAY['networking', 'partnerships', 'collaboration'], false),

('Trauma-Informed Research Practices Workshop', 'Essential training for researchers working with trauma-affected populations. Learn ethical approaches, safety protocols, and self-care strategies.', 'workshop', '2026-03-18 14:00:00+00', '2026-03-18 17:00:00+00', NULL, true, 'https://zoom.us/j/example5', 80, '2026-03-17 23:59:00+00', 'Dr. Amanda Foster', 'Trauma Research Institute', ARRAY['trauma', 'ethics', 'methodology'], false),

('Qualitative Methods in Child Welfare Research', 'Deep dive into qualitative research methods including interviews, focus groups, and ethnographic approaches specific to child welfare contexts.', 'webinar', '2026-03-22 17:00:00+00', '2026-03-22 18:30:00+00', NULL, true, 'https://zoom.us/j/example6', 150, '2026-03-21 23:59:00+00', 'Dr. Rosa Martinez', 'University of Michigan', ARRAY['qualitative', 'interviews', 'methodology'], false),

('Policy Translation Workshop', 'Bridge the gap between research and policy. Learn how to translate your findings into actionable policy recommendations.', 'workshop', '2026-04-02 14:00:00+00', '2026-04-02 16:00:00+00', NULL, true, 'https://zoom.us/j/example7', 60, '2026-04-01 23:59:00+00', 'Policy Advisory Board', 'ImpactLink', ARRAY['policy', 'advocacy', 'translation'], false);