
ALTER TABLE public.forum_topic_suggestions
  ADD CONSTRAINT forum_topic_suggestions_suggested_by_fkey
  FOREIGN KEY (suggested_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
