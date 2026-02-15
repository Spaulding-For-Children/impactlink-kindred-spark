
-- Create registration_requests table for approval workflow
CREATE TABLE public.registration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  organization_type TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Only admins can view registration requests
CREATE POLICY "Admins can view registration requests"
ON public.registration_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update registration requests
CREATE POLICY "Admins can update registration requests"
ON public.registration_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert (public signup - no auth yet)
CREATE POLICY "Anyone can submit registration requests"
ON public.registration_requests
FOR INSERT
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_registration_requests_updated_at
BEFORE UPDATE ON public.registration_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
