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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/create-profile');
    }
  }, [user, navigate]);

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

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message === "Invalid login credentials"
          ? "Invalid email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    }
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

      // Notify admin via edge function
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display">Welcome to ImpactLink</CardTitle>
            <CardDescription>
              Sign in or request access to join the agricultural research community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Request Access</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
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
                    <Label htmlFor="signin-password">Password</Label>
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
