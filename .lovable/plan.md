## Problem

Clicking "Generate Draft" in the RFP Package tab returns "Failed to send a request to the Edge Function" before the function runs — edge function logs only show boot events, no request. This is a CORS preflight failure: the Supabase JS client sends extra headers (`x-supabase-client-platform`, `x-supabase-client-platform-version`, `x-supabase-client-runtime`, `x-supabase-client-runtime-version`) that my new edge functions don't list in `Access-Control-Allow-Headers`, so the browser blocks the actual POST.

The existing `generate-prospects` function (which works) already includes these headers.

## Fix

Update `Access-Control-Allow-Headers` in both new edge functions to match the working pattern:

- `supabase/functions/generate-rfp-section/index.ts`
- `supabase/functions/scan-dependencies/index.ts`

New header value:
```
authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version
```

No other logic changes. Redeploy both functions afterward.
