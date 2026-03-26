import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SecuritySettings } from "@/hooks/useSecuritySettings";
import { Save, Shield, Clock, KeyRound, Lock } from "lucide-react";

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

export function AdminSecuritySettings() {
  const { settings, isLoading, updateSetting } = useSiteSettings();
  const [local, setLocal] = useState<SecuritySettings>(DEFAULTS);

  useEffect(() => {
    if (settings?.security) {
      setLocal({ ...DEFAULTS, ...settings.security });
    }
  }, [settings]);

  const update = (field: keyof SecuritySettings, value: any) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const save = () => {
    updateSetting.mutate({ key: "security", value: local as any });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* TOTP 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Two-Factor Authentication (TOTP)
          </CardTitle>
          <CardDescription>
            When enabled, users will be prompted to set up TOTP-based 2FA using an authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="totp-toggle">Enable TOTP 2FA</Label>
            <Switch
              id="totp-toggle"
              checked={local.totp_enabled}
              onCheckedChange={(v) => update("totp_enabled", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Timeout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Session Timeout
          </CardTitle>
          <CardDescription>
            Auto-logout users after a period of inactivity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="timeout-toggle">Enable Session Timeout</Label>
            <Switch
              id="timeout-toggle"
              checked={local.session_timeout_enabled}
              onCheckedChange={(v) => update("session_timeout_enabled", v)}
            />
          </div>
          {local.session_timeout_enabled && (
            <div>
              <Label htmlFor="timeout-minutes">Timeout Duration (minutes)</Label>
              <Input
                id="timeout-minutes"
                type="number"
                min={5}
                max={480}
                value={local.session_timeout_minutes}
                onChange={(e) => update("session_timeout_minutes", parseInt(e.target.value) || 30)}
                className="w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Strength */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5 text-primary" />
            Password Strength Enforcement
          </CardTitle>
          <CardDescription>
            Require passwords to meet complexity rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="strength-toggle">Enable Password Strength Rules</Label>
            <Switch
              id="strength-toggle"
              checked={local.password_strength_enabled}
              onCheckedChange={(v) => update("password_strength_enabled", v)}
            />
          </div>
          {local.password_strength_enabled && (
            <>
              <div>
                <Label htmlFor="min-length">Minimum Password Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  min={6}
                  max={32}
                  value={local.password_min_length}
                  onChange={(e) => update("password_min_length", parseInt(e.target.value) || 8)}
                  className="w-32"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="req-upper">Require Uppercase Letter</Label>
                <Switch
                  id="req-upper"
                  checked={local.password_require_uppercase}
                  onCheckedChange={(v) => update("password_require_uppercase", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="req-num">Require Number</Label>
                <Switch
                  id="req-num"
                  checked={local.password_require_numbers}
                  onCheckedChange={(v) => update("password_require_numbers", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="req-special">Require Special Character</Label>
                <Switch
                  id="req-special"
                  checked={local.password_require_special}
                  onCheckedChange={(v) => update("password_require_special", v)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-primary" />
            Login Attempt Rate Limiting
          </CardTitle>
          <CardDescription>
            Lock accounts temporarily after too many failed login attempts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="rate-toggle">Enable Rate Limiting</Label>
            <Switch
              id="rate-toggle"
              checked={local.rate_limiting_enabled}
              onCheckedChange={(v) => update("rate_limiting_enabled", v)}
            />
          </div>
          {local.rate_limiting_enabled && (
            <>
              <div>
                <Label htmlFor="max-attempts">Max Failed Attempts</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min={3}
                  max={20}
                  value={local.rate_limit_max_attempts}
                  onChange={(e) => update("rate_limit_max_attempts", parseInt(e.target.value) || 5)}
                  className="w-32"
                />
              </div>
              <div>
                <Label htmlFor="lockout-minutes">Lockout Duration (minutes)</Label>
                <Input
                  id="lockout-minutes"
                  type="number"
                  min={1}
                  max={120}
                  value={local.rate_limit_lockout_minutes}
                  onChange={(e) => update("rate_limit_lockout_minutes", parseInt(e.target.value) || 15)}
                  className="w-32"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={save} disabled={updateSetting.isPending} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Save Security Settings
      </Button>
    </div>
  );
}
