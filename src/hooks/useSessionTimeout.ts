import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSecuritySettings } from "@/hooks/useSecuritySettings";
import { toast } from "sonner";

export function useSessionTimeout() {
  const { user, signOut } = useAuth();
  const { securitySettings } = useSecuritySettings();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (!securitySettings.session_timeout_enabled || !user) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    const timeoutMs = securitySettings.session_timeout_minutes * 60 * 1000;
    const warningMs = Math.max(timeoutMs - 60000, timeoutMs * 0.9); // warn 1min before or 90%

    warningRef.current = setTimeout(() => {
      toast.warning("Session expiring soon", {
        description: "You will be logged out due to inactivity.",
        duration: 10000,
      });
    }, warningMs);

    timerRef.current = setTimeout(() => {
      toast.info("Session expired", {
        description: "You have been logged out due to inactivity.",
      });
      signOut();
    }, timeoutMs);
  }, [securitySettings.session_timeout_enabled, securitySettings.session_timeout_minutes, user, signOut]);

  useEffect(() => {
    if (!securitySettings.session_timeout_enabled || !user) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    // Throttle to avoid excessive resets
    let lastReset = Date.now();
    const handleActivity = () => {
      if (Date.now() - lastReset > 30000) { // only reset every 30s
        lastReset = Date.now();
        resetTimer();
      }
    };

    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [resetTimer, securitySettings.session_timeout_enabled, user]);
}
