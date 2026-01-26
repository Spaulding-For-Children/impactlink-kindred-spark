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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';

const agencySchema = z.object({
  name: z.string().min(2, "Agency name must be at least 2 characters").max(200),
  email: z.string().email("Invalid email address"),
  agencyType: z.string().min(1, "Agency type is required"),
  location: z.string().min(2, "Location is required").max(100),
  bio: z.string().min(10, "Description must be at least 10 characters").max(500),
  focusAreas: z.string().min(1, "At least one focus area is required"),
  employees: z.string().min(1, "Employee count is required"),
  founded: z.string().regex(/^\d{4}$/, "Must be a valid year (e.g., 2020)").optional().or(z.literal('')),
  website: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

type AgencyFormData = z.infer<typeof agencySchema>;

const AgencyProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      agencyType: '',
      location: '',
      bio: '',
      focusAreas: '',
      employees: '',
      founded: '',
      website: '',
    },
  });

  const onSubmit = async (data: AgencyFormData) => {
    if (!user) return;
    
    setLoading(true);
    const focusAreasArray = data.focusAreas.split(',').map(i => i.trim()).filter(i => i.length > 0);

    const { error } = await supabase.from('profiles').insert({
      user_id: user.id,
      profile_type: 'agency',
      name: data.name,
      email: data.email,
      agency_type: data.agencyType,
      location: data.location,
      bio: data.bio,
      focus_areas: focusAreasArray,
      interests: focusAreasArray, // Also store as interests for filtering
      employees: data.employees,
      founded: data.founded || null,
      website: data.website || null,
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
        description: "Your agency profile has been created successfully.",
      });
      navigate('/directory');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent/10">
            <Building2 className="w-6 h-6 text-accent" />
          </div>
          <div>
            <CardTitle>Agency Profile</CardTitle>
            <CardDescription>Create your agency profile to connect with students and researchers</CardDescription>
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
                    <FormLabel>Agency Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Agricultural Development Agency" {...field} />
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
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@agency.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
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
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headquarters Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Size *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
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
                )}
              />
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Founded</FormLabel>
                    <FormControl>
                      <Input placeholder="2020" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://www.agency.org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About the Agency *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your agency's mission, programs, and impact..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Brief description of your agency's work and mission</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="focusAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Areas *</FormLabel>
                  <FormControl>
                    <Input placeholder="Food Security, Rural Development, Climate Resilience" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of your agency's focus areas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Profile..." : "Create Agency Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgencyProfileForm;
