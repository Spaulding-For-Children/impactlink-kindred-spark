-- Login attempts tracking table for rate limiting
CREATE TABLE public.login_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    attempted_at timestamptz NOT NULL DEFAULT now(),
    success boolean NOT NULL DEFAULT false,
    ip_hint text
);

CREATE INDEX idx_login_attempts_email_time ON public.login_attempts (email, attempted_at DESC);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert login attempts"
ON public.login_attempts FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read recent attempts by email"
ON public.login_attempts FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can delete login attempts"
ON public.login_attempts FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default security settings
INSERT INTO public.site_settings (key, value) VALUES (
  'security',
  '{"totp_enabled": false, "session_timeout_enabled": false, "session_timeout_minutes": 30, "password_strength_enabled": false, "password_min_length": 8, "password_require_uppercase": true, "password_require_numbers": true, "password_require_special": true, "rate_limiting_enabled": false, "rate_limit_max_attempts": 5, "rate_limit_lockout_minutes": 15}'::jsonb
) ON CONFLICT (key) DO NOTHING;