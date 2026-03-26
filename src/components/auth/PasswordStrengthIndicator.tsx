import { SecuritySettings } from "@/hooks/useSecuritySettings";
import { Check, X } from "lucide-react";

interface Props {
  password: string;
  settings: SecuritySettings;
}

export function PasswordStrengthIndicator({ password, settings }: Props) {
  if (!settings.password_strength_enabled || !password) return null;

  const rules = [
    {
      label: `At least ${settings.password_min_length} characters`,
      met: password.length >= settings.password_min_length,
    },
    ...(settings.password_require_uppercase
      ? [{ label: "One uppercase letter", met: /[A-Z]/.test(password) }]
      : []),
    ...(settings.password_require_numbers
      ? [{ label: "One number", met: /[0-9]/.test(password) }]
      : []),
    ...(settings.password_require_special
      ? [{ label: "One special character", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }]
      : []),
  ];

  const metCount = rules.filter((r) => r.met).length;
  const strength = metCount / rules.length;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0.25, 0.5, 0.75, 1].map((threshold, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              strength >= threshold
                ? strength >= 0.75
                  ? "bg-green-500"
                  : strength >= 0.5
                  ? "bg-yellow-500"
                  : "bg-red-500"
                : "bg-muted"
            }`}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            {rule.met ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={rule.met ? "text-green-600" : "text-muted-foreground"}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
