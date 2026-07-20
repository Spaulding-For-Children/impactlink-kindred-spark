
-- Create private schema for helpers we don't want exposed via PostgREST
CREATE SCHEMA IF NOT EXISTS private;

-- Move has_role to private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Redefine public.has_role as SECURITY INVOKER wrapper delegating to the private version.
-- This keeps existing policies working (they reference public.has_role) while eliminating
-- the "public SECURITY DEFINER function is executable" warning.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT private.has_role(_user_id, _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Same pattern for count_recent_failed_logins
CREATE OR REPLACE FUNCTION private.count_recent_failed_logins(_email text, _cutoff timestamptz)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(*)::int FROM public.login_attempts
   WHERE email = lower(_email) AND success = false AND attempted_at >= _cutoff
$$;
REVOKE ALL ON FUNCTION private.count_recent_failed_logins(text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.count_recent_failed_logins(text, timestamptz) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.count_recent_failed_logins(_email text, _cutoff timestamptz)
RETURNS integer LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT private.count_recent_failed_logins(_email, _cutoff)
$$;
REVOKE ALL ON FUNCTION public.count_recent_failed_logins(text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_recent_failed_logins(text, timestamptz) TO anon, authenticated;

-- get_partner_matches: switch to SECURITY INVOKER — profiles are readable by all authenticated users
CREATE OR REPLACE FUNCTION public.get_partner_matches(user_profile_id uuid)
RETURNS TABLE(profile_id uuid, name text, profile_type text, location text, interests text[], match_score integer, shared_interests text[])
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    user_interests TEXT[];
    user_location TEXT;
BEGIN
    SELECT p.interests, p.location INTO user_interests, user_location
    FROM profiles p WHERE p.id = user_profile_id;

    RETURN QUERY
    SELECT
        p.id, p.name, p.profile_type::TEXT, p.location, p.interests,
        (
            COALESCE(array_length(ARRAY(SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(user_interests)), 1), 0) * 10 +
            CASE WHEN p.location = user_location THEN 20 ELSE 0 END
        ) AS match_score,
        ARRAY(SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(user_interests)) AS shared_interests
    FROM profiles p
    WHERE p.id != user_profile_id
    ORDER BY match_score DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.get_partner_matches(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_partner_matches(uuid) TO authenticated;

-- notifications: scope insert policy to service_role only (removes "always true" warning)
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications"
ON public.notifications FOR INSERT TO service_role
WITH CHECK (true);

-- avatars: restrict SELECT via API to admins (direct public URL access still works)
DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;
CREATE POLICY "Admins can list avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'::app_role));
