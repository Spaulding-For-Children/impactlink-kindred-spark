-- Create enum for research question status
CREATE TYPE public.research_question_status AS ENUM ('open', 'in_progress', 'completed', 'closed');

-- Create enum for collaboration status
CREATE TYPE public.collaboration_status AS ENUM ('pending', 'accepted', 'declined');

-- Create research_questions table
CREATE TABLE public.research_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    topics TEXT[] DEFAULT '{}',
    regions TEXT[] DEFAULT '{}',
    populations TEXT[] DEFAULT '{}',
    status research_question_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_topics table (categories for discussions)
CREATE TABLE public.forum_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT 'sage',
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE public.forum_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_replies table
CREATE TABLE public.forum_replies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborations table (connection requests between users)
CREATE TABLE public.collaborations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status collaboration_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(requester_id, recipient_id)
);

-- Create partner_matches view for smart matchmaking (based on shared interests and location)
CREATE OR REPLACE FUNCTION public.get_partner_matches(user_profile_id UUID)
RETURNS TABLE (
    profile_id UUID,
    name TEXT,
    profile_type TEXT,
    location TEXT,
    interests TEXT[],
    match_score INTEGER,
    shared_interests TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_interests TEXT[];
    user_location TEXT;
BEGIN
    -- Get the user's interests and location
    SELECT p.interests, p.location INTO user_interests, user_location
    FROM profiles p WHERE p.id = user_profile_id;
    
    RETURN QUERY
    SELECT 
        p.id as profile_id,
        p.name,
        p.profile_type::TEXT,
        p.location,
        p.interests,
        -- Calculate match score based on shared interests and location
        (
            COALESCE(array_length(ARRAY(SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(user_interests)), 1), 0) * 10 +
            CASE WHEN p.location = user_location THEN 20 ELSE 0 END
        ) as match_score,
        ARRAY(SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(user_interests)) as shared_interests
    FROM profiles p
    WHERE p.id != user_profile_id
    ORDER BY match_score DESC;
END;
$$;

-- Enable RLS on all new tables
ALTER TABLE public.research_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for research_questions
CREATE POLICY "Research questions are viewable by everyone"
ON public.research_questions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create research questions"
ON public.research_questions FOR INSERT
WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their research questions"
ON public.research_questions FOR UPDATE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their research questions"
ON public.research_questions FOR DELETE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for forum_topics (public read, admin-only write - for now allow authenticated)
CREATE POLICY "Forum topics are viewable by everyone"
ON public.forum_topics FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum topics"
ON public.forum_topics FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for forum_posts
CREATE POLICY "Forum posts are viewable by everyone"
ON public.forum_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum posts"
ON public.forum_posts FOR INSERT
WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their forum posts"
ON public.forum_posts FOR UPDATE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their forum posts"
ON public.forum_posts FOR DELETE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for forum_replies
CREATE POLICY "Forum replies are viewable by everyone"
ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create forum replies"
ON public.forum_replies FOR INSERT
WITH CHECK (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can update their forum replies"
ON public.forum_replies FOR UPDATE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Authors can delete their forum replies"
ON public.forum_replies FOR DELETE
USING (author_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for collaborations
CREATE POLICY "Users can view their own collaborations"
ON public.collaborations FOR SELECT
USING (
    requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    recipient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Authenticated users can create collaboration requests"
ON public.collaborations FOR INSERT
WITH CHECK (requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Participants can update collaborations"
ON public.collaborations FOR UPDATE
USING (
    requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    recipient_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Requester can delete collaboration requests"
ON public.collaborations FOR DELETE
USING (requester_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Create triggers for updated_at
CREATE TRIGGER update_research_questions_updated_at
BEFORE UPDATE ON public.research_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
BEFORE UPDATE ON public.forum_replies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborations_updated_at
BEFORE UPDATE ON public.collaborations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default forum topics
INSERT INTO public.forum_topics (name, description, icon, color) VALUES
('Trauma & Resilience', 'Discussions on trauma-informed care and building resilience in children', 'heart', 'rose'),
('Family Reunification', 'Best practices and challenges in reunifying families', 'home', 'amber'),
('Youth Justice', 'Juvenile justice reform and youth advocacy', 'scale', 'indigo'),
('International Child Protection', 'Global perspectives on child welfare systems', 'globe', 'sage'),
('Foster Care Systems', 'Improving foster care outcomes and support', 'users', 'sky'),
('Kinship Care', 'Supporting kinship caregivers and placements', 'heart-handshake', 'violet');