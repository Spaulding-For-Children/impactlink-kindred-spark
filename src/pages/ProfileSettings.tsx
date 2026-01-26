import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Microscope, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const studentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  university: z.string().min(2).max(200),
  major: z.string().min(2).max(100),
  year: z.string().min(1),
  location: z.string().min(2).max(100),
  bio: z.string().min(10).max(500),
  interests: z.string().min(1),
});

const researcherSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  title: z.string().min(2).max(100),
  institution: z.string().min(2).max(200),
  department: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  bio: z.string().min(10).max(500),
  interests: z.string().min(1),
  publications: z.string().optional(),
});

const agencySchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  agencyType: z.string().min(1),
  location: z.string().min(2).max(100),
  bio: z.string().min(10).max(500),
  focusAreas: z.string().min(1),
  employees: z.string().min(1),
  founded: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

interface Profile {
  id: string;
  profile_type: 'student' | 'researcher' | 'agency';
  name: string;
  email: string;
  location: string | null;
  bio: string | null;
  university: string | null;
  major: string | null;
  year: string | null;
  institution: string | null;
  department: string | null;
  title: string | null;
  publications: number | null;
  agency_type: string | null;
  focus_areas: string[] | null;
  employees: string | null;
  founded: string | null;
  website: string | null;
  interests: string[] | null;
}

const ProfileSettings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
  });

  const researcherForm = useForm({
    resolver: zodResolver(researcherSchema),
  });

  const agencyForm = useForm({
    resolver: zodResolver(agencySchema),
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } else if (!data) {
        navigate('/create-profile');
      } else {
        setProfile(data as Profile);
        
        // Populate form based on profile type
        if (data.profile_type === 'student') {
          studentForm.reset({
            name: data.name,
            email: data.email,
            university: data.university || '',
            major: data.major || '',
            year: data.year || '',
            location: data.location || '',
            bio: data.bio || '',
            interests: data.interests?.join(', ') || '',
          });
        } else if (data.profile_type === 'researcher') {
          researcherForm.reset({
            name: data.name,
            email: data.email,
            title: data.title || '',
            institution: data.institution || '',
            department: data.department || '',
            location: data.location || '',
            bio: data.bio || '',
            interests: data.interests?.join(', ') || '',
            publications: data.publications?.toString() || '',
          });
        } else if (data.profile_type === 'agency') {
          agencyForm.reset({
            name: data.name,
            email: data.email,
            agencyType: data.agency_type || '',
            location: data.location || '',
            bio: data.bio || '',
            focusAreas: data.focus_areas?.join(', ') || '',
            employees: data.employees || '',
            founded: data.founded || '',
            website: data.website || '',
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const onStudentSubmit = async (data: z.infer<typeof studentSchema>) => {
    if (!user || !profile) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        email: data.email,
        university: data.university,
        major: data.major,
        year: data.year,
        location: data.location,
        bio: data.bio,
        interests: data.interests.split(',').map(i => i.trim()),
      })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }
  };

  const onResearcherSubmit = async (data: z.infer<typeof researcherSchema>) => {
    if (!user || !profile) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        email: data.email,
        title: data.title,
        institution: data.institution,
        department: data.department,
        location: data.location,
        bio: data.bio,
        interests: data.interests.split(',').map(i => i.trim()),
        publications: data.publications ? parseInt(data.publications) : 0,
      })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }
  };

  const onAgencySubmit = async (data: z.infer<typeof agencySchema>) => {
    if (!user || !profile) return;
    setSaving(true);
    
    const focusAreasArray = data.focusAreas.split(',').map(i => i.trim());
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        email: data.email,
        agency_type: data.agencyType,
        location: data.location,
        bio: data.bio,
        focus_areas: focusAreasArray,
        interests: focusAreasArray,
        employees: data.employees,
        founded: data.founded || null,
        website: data.website || null,
      })
      .eq('id', profile.id);

    setSaving(false);
    if (error) {
      toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const profileTypeConfig = {
    student: { icon: GraduationCap, color: 'bg-primary/10', textColor: 'text-primary' },
    researcher: { icon: Microscope, color: 'bg-secondary/10', textColor: 'text-secondary' },
    agency: { icon: Building2, color: 'bg-accent/10', textColor: 'text-accent' },
  };

  const config = profileTypeConfig[profile.profile_type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/directory">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${config.color}`}>
                  <Icon className={`w-6 h-6 ${config.textColor}`} />
                </div>
                <div>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your {profile.profile_type} profile information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profile.profile_type === 'student' && (
                <Form {...studentForm}>
                  <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={studentForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={studentForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={studentForm.control} name="university" render={({ field }) => (
                        <FormItem>
                          <FormLabel>University *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={studentForm.control} name="major" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Major *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={studentForm.control} name="year" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Freshman">Freshman</SelectItem>
                              <SelectItem value="Sophomore">Sophomore</SelectItem>
                              <SelectItem value="Junior">Junior</SelectItem>
                              <SelectItem value="Senior">Senior</SelectItem>
                              <SelectItem value="Graduate">Graduate</SelectItem>
                              <SelectItem value="PhD">PhD Student</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={studentForm.control} name="location" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={studentForm.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio *</FormLabel>
                        <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={studentForm.control} name="interests" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Interests *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormDescription>Comma-separated list</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}

              {profile.profile_type === 'researcher' && (
                <Form {...researcherForm}>
                  <form onSubmit={researcherForm.handleSubmit(onResearcherSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={researcherForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={researcherForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={researcherForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={researcherForm.control} name="institution" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={researcherForm.control} name="department" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={researcherForm.control} name="location" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={researcherForm.control} name="publications" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publications</FormLabel>
                          <FormControl><Input type="number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={researcherForm.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio *</FormLabel>
                        <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={researcherForm.control} name="interests" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Research Interests *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormDescription>Comma-separated list</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}

              {profile.profile_type === 'agency' && (
                <Form {...agencyForm}>
                  <form onSubmit={agencyForm.handleSubmit(onAgencySubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={agencyForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency Name *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={agencyForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={agencyForm.control} name="agencyType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agency Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Government">Government</SelectItem>
                              <SelectItem value="Non-profit">Non-profit</SelectItem>
                              <SelectItem value="NGO">NGO</SelectItem>
                              <SelectItem value="International Organization">International Organization</SelectItem>
                              <SelectItem value="Research Institute">Research Institute</SelectItem>
                              <SelectItem value="Private Foundation">Private Foundation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={agencyForm.control} name="location" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={agencyForm.control} name="employees" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Size *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={agencyForm.control} name="founded" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Founded</FormLabel>
                          <FormControl><Input maxLength={4} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={agencyForm.control} name="website" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl><Input type="url" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={agencyForm.control} name="bio" render={({ field }) => (
                      <FormItem>
                        <FormLabel>About *</FormLabel>
                        <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={agencyForm.control} name="focusAreas" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Focus Areas *</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormDescription>Comma-separated list</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSettings;
