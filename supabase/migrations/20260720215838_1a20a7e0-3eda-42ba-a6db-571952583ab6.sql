
-- Restrict event and forum topic creation to admins only
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Admins can create events"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authenticated users can create forum topics" ON public.forum_topics;
CREATE POLICY "Admins can create forum topics"
ON public.forum_topics FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Enforce AAL2 for TOTP-enrolled users on sensitive tables (defeats 2FA bypass)
CREATE OR REPLACE FUNCTION public.user_meets_aal()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  has_totp boolean;
  current_aal text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM auth.mfa_factors
    WHERE user_id = auth.uid()
      AND factor_type = 'totp'
      AND status = 'verified'
  ) INTO has_totp;

  IF NOT has_totp THEN
    RETURN true;
  END IF;

  current_aal := COALESCE(
    (auth.jwt() ->> 'aal'),
    ''
  );
  RETURN current_aal = 'aal2';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.user_meets_aal() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.user_meets_aal() TO authenticated;

-- Apply AAL check to profile self-updates (protects PII when 2FA is enrolled)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles' AND cmd='UPDATE'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can update own profile with AAL"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND public.user_meets_aal())
WITH CHECK (auth.uid() = user_id AND public.user_meets_aal());

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
