DROP POLICY IF EXISTS "Authenticated users can upload research" ON storage.objects;
CREATE POLICY "Authenticated users can upload research" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'research-uploads' AND (storage.foldername(name))[1] = (auth.uid())::text);

DROP POLICY IF EXISTS "Forum posts are viewable by everyone" ON public.forum_posts;
CREATE POLICY "Forum posts are viewable by signed-in users" ON public.forum_posts
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Forum replies are viewable by everyone" ON public.forum_replies;
CREATE POLICY "Forum replies are viewable by signed-in users" ON public.forum_replies
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);