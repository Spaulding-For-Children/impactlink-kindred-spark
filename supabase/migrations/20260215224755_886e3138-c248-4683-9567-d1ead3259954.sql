
-- Remove password_hash column - we won't store passwords
-- Instead, upon approval, admin creates the account and user gets a password reset email
ALTER TABLE public.registration_requests DROP COLUMN password_hash;
