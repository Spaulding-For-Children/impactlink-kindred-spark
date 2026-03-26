import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SecuritySettings {
  totp_enabled: boolean;
  session_timeout_enabled: boolean;
  session_timeout_minutes: number;
  password_strength_enabled: boolean;
  password_min_length: number;
  password_require_uppercase: boolean;
  password_require_numbers: boolean;
  password_require_special: boolean;
  rate_limiting_enabled: boolean;
  rate_limit_max_attempts: number;
  rate_limit_lockout_minutes: number;
}

const DEFAULTS: SecuritySettings = {
  totp_enabled: false,
  session_timeout_enabled: false,
  session_timeout_minutes: 30,
  password_strength_enabled: false,
  password_min_length: 8,
  password_require_uppercase: true,
  password_require_numbers: true,
  password_require_special: true,
  rate_limiting_enabled: false,
  rate_limit_max_attempts: 5,
  rate_limit_lockout_minutes: 15,
};

export function useSecuritySettings() {
  const { data: securitySettings = DEFAULTS, isLoading } = useQuery({
    queryKey: ["securitySettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "security")
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return DEFAULTS;
      return { ...DEFAULTS, ...(data.value as Record<string, any>) } as SecuritySettings;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { securitySettings, isLoading };
}

export function validatePasswordStrength(
  password: string,
  settings: SecuritySettings
): string | null {
  if (!settings.password_strength_enabled) return null;
  
  if (password.length < settings.password_min_length) {
    return `Password must be at least ${settings.password_min_length} characters`;
  }
  if (settings.password_require_uppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (settings.password_require_numbers && !/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (settings.password_require_special && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
}

export async function checkRateLimiting(
  email: string,
  settings: SecuritySettings
): Promise<{ locked: boolean; minutesRemaining: number }> {
  if (!settings.rate_limiting_enabled) return { locked: false, minutesRemaining: 0 };

  const cutoff = new Date(Date.now() - settings.rate_limit_lockout_minutes * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from("login_attempts")
    .select("id")
    .eq("email", email.toLowerCase())
    .eq("success", false)
    .gte("attempted_at", cutoff);

  if (error) {
    console.error("Rate limit check error:", error);
    return { locked: false, minutesRemaining: 0 };
  }

  const failedCount = data?.length || 0;
  if (failedCount >= settings.rate_limit_max_attempts) {
    return { locked: true, minutesRemaining: settings.rate_limit_lockout_minutes };
  }
  return { locked: false, minutesRemaining: 0 };
}

export async function recordLoginAttempt(email: string, success: boolean) {
  await supabase
    .from("login_attempts")
    .insert({ email: email.toLowerCase(), success });
}
