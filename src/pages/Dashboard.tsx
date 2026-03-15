import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentProfile, useCollaborations } from '@/hooks/useCollaboration';
import { useMyRegistrations } from '@/hooks/useEvents';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, Calendar, Bookmark, Handshake, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { data: collaborations = [], isLoading: collabLoading } = useCollaborations();
  const { data: registrations = [], isLoading: regsLoading } = useMyRegistrations();

  const { data: bookmarks = [] } = useQuery({
    queryKey: ['my-bookmarks-count', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('resource_bookmarks')
        .select('id, resource:resources(id, title, resource_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: bookmarkCount = 0 } = useQuery({
    queryKey: ['bookmark-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('resource_bookmarks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (error) return 0;
      return count || 0;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const isLoading = profileLoading || collabLoading || regsLoading;

  if (isLoading) {
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

  const pendingCollabs = collaborations.filter(c => c.status === 'pending');
  const pendingReceived = pendingCollabs.filter(c => c.recipient_id === profile?.id);
  const acceptedCollabs = collaborations.filter(c => c.status === 'accepted');
  const upcomingEvents = (registrations || [])
    .filter((r: any) => r.event && new Date(r.event.start_date) > new Date())
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {profile?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Welcome back, {profile?.name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-muted-foreground">
                <Badge variant="outline" className="capitalize mr-2">{profile?.profile_type}</Badge>
                {profile?.institution || profile?.university || profile?.location || ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Handshake className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{acceptedCollabs.length}</p>
                <p className="text-xs text-muted-foreground">Active Collaborations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-6 w-6 text-amber mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{pendingReceived.length}</p>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-6 w-6 text-sage mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{upcomingEvents.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Bookmark className="h-6 w-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{bookmarkCount}</p>
                <p className="text-xs text-muted-foreground">Saved Resources</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Collaboration Requests */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Collaboration Requests</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/collaboration">View all <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pendingReceived.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No pending requests</p>
                ) : (
                  <div className="space-y-3">
                    {pendingReceived.slice(0, 5).map((collab) => (
                      <div key={collab.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collab.requester?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {collab.requester?.name?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{collab.requester?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{collab.requester?.profile_type}</p>
                        </div>
                        <Badge variant="outline" className="text-amber border-amber/30">Pending</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/events">View all <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No upcoming events</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((reg: any) => (
                      <div key={reg.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage/10 flex flex-col items-center justify-center">
                          <span className="text-xs font-bold text-sage">{format(new Date(reg.event.start_date), 'MMM')}</span>
                          <span className="text-sm font-bold text-sage leading-none">{format(new Date(reg.event.start_date), 'd')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{reg.event.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{reg.event.event_type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Resources */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Saved Resources</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/resources">View all <ArrowRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {bookmarks.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No saved resources yet</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {bookmarks.map((bm: any) => (
                      <div key={bm.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Bookmark className="h-4 w-4 text-secondary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{bm.resource?.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{bm.resource?.resource_type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
