import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useSecuritySettings, validatePasswordStrength, checkRateLimiting, recordLoginAttempt } from '@/hooks/useSecuritySettings';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { TotpChallenge } from '@/components/auth/TotpChallenge';

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signUpSchema = z.object({
  name: z.string().trim().min(1, { message: "Full name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  organization: z.string().trim().min(1, { message: "Organization is required" }).max(200),
  organization_type: z.string().min(1, { message: "Organization type is required" }),
  phone_number: z.string().trim().min(7, { message: "Valid phone number is required" }).max(20),
});

const ORGANIZATION_TYPES = [
  "University / Academic Institution",
  "Government Agency",
  "Non-Profit Organization",
  "Research Institute",
  "Private Sector / Consulting",
  "International Organization",
  "Community-Based Organization",
  "Other",
];

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSubmitted, setSignUpSubmitted] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMfaChallenge, setShowMfaChallenge] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { securitySettings } = useSecuritySettings();

  useEffect(() => {
    if (user && !showMfaChallenge) {
      navigate('/create-profile');
    }
  }, [user, navigate, showMfaChallenge]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailVal = z.string().email().safeParse(email);
    if (!emailVal.success) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResetSent(true);
      toast({ title: "Check your email", description: "A password reset link has been sent to your email." });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signInSchema.parse({ email, password });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }

    // Rate limiting check
    if (securitySettings.rate_limiting_enabled) {
      const { locked, minutesRemaining } = await checkRateLimiting(email, securitySettings);
      if (locked) {
        toast({
          title: "Account temporarily locked",
          description: `Too many failed login attempts. Please try again in ${minutesRemaining} minutes.`,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      // Record failed attempt
      await recordLoginAttempt(email, false);
      toast({
        title: "Sign in failed",
        description: error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      // Record successful attempt
      await recordLoginAttempt(email, true);

      // Check if user has MFA factors and TOTP is enabled
      if (securitySettings.totp_enabled) {
        try {
          const { data: factors } = await supabase.auth.mfa.listFactors();
          if (factors?.totp && factors.totp.length > 0) {
            setShowMfaChallenge(true);
            return;
          }
        } catch {}
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    }
  };

  const handleMfaSuccess = () => {
    setShowMfaChallenge(false);
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    navigate('/');
  };

  const handleMfaCancel = async () => {
    setShowMfaChallenge(false);
    await supabase.auth.signOut();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signUpSchema.parse({ name, email, organization, organization_type: organizationType, phone_number: phoneNumber });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('registration_requests')
        .insert({
          name,
          email,
          organization,
          organization_type: organizationType,
          phone_number: phoneNumber,
        });

      if (error) throw error;

      supabase.functions.invoke('send-registration-notification', {
        body: { name, email, organization, organization_type: organizationType, phone_number: phoneNumber },
      }).catch((err) => console.error('Failed to send registration notification:', err));

      setSignUpSubmitted(true);
      toast({
        title: "Registration submitted!",
        description: "Your request has been sent to the site administrator for approval. You will receive an email once your account is approved.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show MFA challenge screen
  if (showMfaChallenge) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <TotpChallenge onSuccess={handleMfaSuccess} onCancel={handleMfaCancel} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Welcome to ImpactLink</CardTitle>
            <CardDescription>
              Sign in or request access to join the child welfare community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Request Access</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                {forgotPassword ? (
                  resetSent ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <span className="text-2xl">📧</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Check Your Email</h3>
                      <p className="text-sm text-muted-foreground">
                        We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
                      </p>
                      <Button variant="outline" onClick={() => { setForgotPassword(false); setResetSent(false); }}>
                        Back to Sign In
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                      <p className="text-sm text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotPassword(false)}>
                        Back to Sign In
                      </Button>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => { setForgotPassword(true); setErrors({}); }}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                )}
              </TabsContent>

              <TabsContent value="signup">
                {signUpSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Request Submitted</h3>
                    <p className="text-sm text-muted-foreground">
                      Your registration request has been sent to the site administrator. You'll receive an email once your account has been approved.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-org">Organization</Label>
                      <Input
                        id="signup-org"
                        type="text"
                        placeholder="Your organization name"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                      />
                      {errors.organization && <p className="text-sm text-destructive">{errors.organization}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-org-type">Organization Type</Label>
                      <Select value={organizationType} onValueChange={setOrganizationType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORGANIZATION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.organization_type && <p className="text-sm text-destructive">{errors.organization_type}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Registration Request"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Your request will be reviewed by a site administrator. You'll be notified by email once approved.
                    </p>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
