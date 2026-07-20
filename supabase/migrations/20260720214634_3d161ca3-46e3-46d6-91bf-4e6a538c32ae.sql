
-- 1. Tighten profiles SELECT: only owner or admin can read full row (including email)
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Owner or admin can view full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Public directory view (excludes email). Views default to security_definer semantics,
--    so they bypass RLS on profiles and expose only the non-sensitive columns below.
DROP VIEW IF EXISTS public.profiles_directory;
CREATE VIEW public.profiles_directory
WITH (security_invoker = false) AS
SELECT
  id, user_id, profile_type, name, avatar_url, location, bio,
  university, major, year, institution, department, title, publications,
  agency_type, focus_areas, employees, founded, website, interests,
  tutorial_completed, notification_preferences, created_at, updated_at
FROM public.profiles;

GRANT SELECT ON public.profiles_directory TO authenticated, anon;

-- 3. Restrict resources INSERT/UPDATE to admins only
DROP POLICY IF EXISTS "Only authenticated users can manage resources" ON public.resources;
DROP POLICY IF EXISTS "Only authenticated users can update resources" ON public.resources;

CREATE POLICY "Admins can insert resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resources"
ON public.resources
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
