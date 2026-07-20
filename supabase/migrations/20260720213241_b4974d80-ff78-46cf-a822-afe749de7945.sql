
-- 1. profiles: restrict public read
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

-- 2. login_attempts: remove public read, add admin-only + secure RPC for rate-limit checks
DROP POLICY IF EXISTS "Anyone can read recent attempts by email" ON public.login_attempts;
CREATE POLICY "Admins can view login attempts"
ON public.login_attempts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Replace WITH CHECK (true) on INSERT policies with meaningful predicates
DROP POLICY IF EXISTS "Anyone can insert login attempts" ON public.login_attempts;
CREATE POLICY "Anyone can insert login attempts"
ON public.login_attempts FOR INSERT TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(email) BETWEEN 3 AND 320);

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(email) BETWEEN 3 AND 320);

DROP POLICY IF EXISTS "Anyone can submit registration requests" ON public.registration_requests;
CREATE POLICY "Anyone can submit registration requests"
ON public.registration_requests FOR INSERT TO anon, authenticated
WITH CHECK (email IS NOT NULL AND length(email) BETWEEN 3 AND 320);

-- 3. Rate-limit RPC that hides the login_attempts table
CREATE OR REPLACE FUNCTION public.count_recent_failed_logins(_email text, _cutoff timestamptz)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.login_attempts
  WHERE email = lower(_email)
    AND success = false
    AND attempted_at >= _cutoff
$$;
REVOKE ALL ON FUNCTION public.count_recent_failed_logins(text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_recent_failed_logins(text, timestamptz) TO anon, authenticated;

-- 4. Storage: research-uploads – block public listing/read; owners + admins only
DROP POLICY IF EXISTS "Anyone can view research uploads" ON storage.objects;
CREATE POLICY "Owners and admins can view research uploads"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'research-uploads'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- avatars bucket: block anonymous listing/enumeration while preserving direct URL access
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- 5. Add file_path column so submissions can generate signed URLs
ALTER TABLE public.research_submissions
  ADD COLUMN IF NOT EXISTS file_path text;

-- 6. Lock down SECURITY DEFINER functions from being exposed via PostgREST
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_partner_matches(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
