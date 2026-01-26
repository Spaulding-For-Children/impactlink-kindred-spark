import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Microscope, Building2 } from 'lucide-react';
import StudentProfileForm from '@/components/forms/StudentProfileForm';
import ResearcherProfileForm from '@/components/forms/ResearcherProfileForm';
import AgencyProfileForm from '@/components/forms/AgencyProfileForm';

type ProfileType = 'student' | 'researcher' | 'agency' | null;

const CreateProfile = () => {
  const [profileType, setProfileType] = useState<ProfileType>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user already has a profile
    const checkProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, profile_type')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setHasProfile(true);
        toast({
          title: "Profile exists",
          description: "You already have a profile. Redirecting to directory...",
        });
        navigate('/directory');
      }
      setLoading(false);
    };

    checkProfile();
  }, [user, navigate, toast]);

  const profileOptions = [
    {
      type: 'student' as const,
      title: 'Student',
      description: 'Agricultural science student looking for research opportunities',
      icon: GraduationCap,
      color: 'bg-primary/10 hover:bg-primary/20 border-primary/30',
    },
    {
      type: 'researcher' as const,
      title: 'Researcher',
      description: 'Academic or industry researcher in agricultural sciences',
      icon: Microscope,
      color: 'bg-secondary/10 hover:bg-secondary/20 border-secondary/30',
    },
    {
      type: 'agency' as const,
      title: 'Agency',
      description: 'Government or non-profit agricultural development agency',
      icon: Building2,
      color: 'bg-accent/10 hover:bg-accent/20 border-accent/30',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {!profileType ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Create Your Profile
                </h1>
                <p className="text-muted-foreground">
                  Choose your profile type to get started
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {profileOptions.map((option) => (
                  <Card
                    key={option.type}
                    className={`cursor-pointer transition-all duration-300 border-2 ${option.color}`}
                    onClick={() => setProfileType(option.type)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 rounded-full bg-background">
                        <option.icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">
                        {option.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                onClick={() => setProfileType(null)}
                className="mb-6"
              >
                ← Back to profile types
              </Button>

              {profileType === 'student' && <StudentProfileForm />}
              {profileType === 'researcher' && <ResearcherProfileForm />}
              {profileType === 'agency' && <AgencyProfileForm />}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProfile;
