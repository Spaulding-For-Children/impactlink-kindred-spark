import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Mail, 
  Building2, 
  GraduationCap, 
  Microscope,
  Calendar,
  Users,
  Globe,
  FileText,
  Loader2,
  Pencil
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ContactFormModal } from '@/components/modals/ContactFormModal';
import { useState } from 'react';
import { useProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { profile, loading, error } = useProfile(id || '');
  const { user } = useAuth();
  const [contactModalOpen, setContactModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/directory">Back to Directory</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.id === profile.user_id;

  const typeConfig = {
    student: {
      icon: GraduationCap,
      color: 'bg-amber/10',
      textColor: 'text-amber',
      label: 'Student',
    },
    researcher: {
      icon: Microscope,
      color: 'bg-navy/10',
      textColor: 'text-navy',
      label: 'Researcher',
    },
    agency: {
      icon: Building2,
      color: 'bg-sage/10',
      textColor: 'text-sage',
      label: 'Agency',
    },
  };

  const config = typeConfig[profile.profile_type];
  const Icon = config.icon;
  const interests = profile.interests || profile.focus_areas || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" asChild>
                <Link to="/directory">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Directory
                </Link>
              </Button>
              {isOwner && (
                <Button variant="outline" asChild>
                  <Link to="/profile-settings">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Profile Image/Icon */}
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl ${config.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-12 h-12 md:w-16 md:h-16 ${config.textColor}`} />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${config.color} ${config.textColor} border-none`}>
                    {config.label}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                  {profile.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  {profile.profile_type === 'student' && `${profile.year || ''} ${profile.major || 'Student'}`}
                  {profile.profile_type === 'researcher' && (profile.title || 'Researcher')}
                  {profile.profile_type === 'agency' && (profile.agency_type || 'Agency')}
                  {' at '}
                  {profile.university || profile.institution || profile.name}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                  )}
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              {!isOwner && (
                <div className="w-full md:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto"
                    onClick={() => setContactModalOpen(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact {profile.name.split(' ')[0]}
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {profile.bio || 'No bio provided.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Interests/Focus Areas */}
                {interests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {profile.profile_type === 'agency' ? 'Focus Areas' : 'Research Interests'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.profile_type === 'student' && (
                      <>
                        {profile.university && (
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">University</p>
                              <p className="font-medium">{profile.university}</p>
                            </div>
                          </div>
                        )}
                        {profile.major && (
                          <div className="flex items-start gap-3">
                            <GraduationCap className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Major</p>
                              <p className="font-medium">{profile.major}</p>
                            </div>
                          </div>
                        )}
                        {profile.year && (
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Year</p>
                              <p className="font-medium">{profile.year}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {profile.profile_type === 'researcher' && (
                      <>
                        {profile.institution && (
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Institution</p>
                              <p className="font-medium">{profile.institution}</p>
                            </div>
                          </div>
                        )}
                        {profile.department && (
                          <div className="flex items-start gap-3">
                            <Microscope className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Department</p>
                              <p className="font-medium">{profile.department}</p>
                            </div>
                          </div>
                        )}
                        {profile.publications !== null && profile.publications > 0 && (
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Publications</p>
                              <p className="font-medium">{profile.publications}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {profile.profile_type === 'agency' && (
                      <>
                        {profile.agency_type && (
                          <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Organization Type</p>
                              <p className="font-medium">{profile.agency_type}</p>
                            </div>
                          </div>
                        )}
                        {profile.employees && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Team Size</p>
                              <p className="font-medium">{profile.employees}</p>
                            </div>
                          </div>
                        )}
                        {profile.founded && (
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Founded</p>
                              <p className="font-medium">{profile.founded}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Modal */}
      <ContactFormModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        recipientName={profile.name}
        recipientType={profile.profile_type}
      />
    </div>
  );
}
