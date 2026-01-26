import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Microscope } from 'lucide-react';

const researcherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  title: z.string().min(2, "Title is required").max(100),
  institution: z.string().min(2, "Institution is required").max(200),
  department: z.string().min(2, "Department is required").max(100),
  location: z.string().min(2, "Location is required").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500),
  interests: z.string().min(1, "At least one interest is required"),
  publications: z.string().regex(/^\d+$/, "Must be a number").optional().or(z.literal('')),
});

type ResearcherFormData = z.infer<typeof researcherSchema>;

const ResearcherProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ResearcherFormData>({
    resolver: zodResolver(researcherSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      title: '',
      institution: '',
      department: '',
      location: '',
      bio: '',
      interests: '',
      publications: '',
    },
  });

  const onSubmit = async (data: ResearcherFormData) => {
    if (!user) return;
    
    setLoading(true);
    const interestsArray = data.interests.split(',').map(i => i.trim()).filter(i => i.length > 0);

    const { error } = await supabase.from('profiles').insert({
      user_id: user.id,
      profile_type: 'researcher',
      name: data.name,
      email: data.email,
      title: data.title,
      institution: data.institution,
      department: data.department,
      location: data.location,
      bio: data.bio,
      interests: interestsArray,
      publications: data.publications ? parseInt(data.publications) : 0,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile created!",
        description: "Your researcher profile has been created successfully.",
      });
      navigate('/directory');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-secondary/10">
            <Microscope className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <CardTitle>Researcher Profile</CardTitle>
            <CardDescription>Create your researcher profile to connect with students and agencies</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane.smith@research.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Research Scientist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution *</FormLabel>
                    <FormControl>
                      <Input placeholder="Agricultural Research Institute" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <Input placeholder="Plant Sciences" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Publications</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your research focus, expertise, and current projects..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Brief description of your research background and expertise</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Interests *</FormLabel>
                  <FormControl>
                    <Input placeholder="Climate Adaptation, Crop Genetics, Precision Agriculture" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of your research interests</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Profile..." : "Create Researcher Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResearcherProfileForm;
