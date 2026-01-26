import { motion } from "framer-motion";
import { Sparkles, MapPin, Link as LinkIcon, GraduationCap, Building, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { usePartnerMatches, useCurrentProfile, useCreateCollaboration } from "@/hooks/useCollaboration";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  researcher: Building,
  agency: Users,
};

export const PartnerMatching = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading: loadingProfile } = useCurrentProfile();
  const { data: matches, isLoading: loadingMatches } = usePartnerMatches(profile?.id);
  const createCollaboration = useCreateCollaboration();

  const handleConnect = async (recipientId: string) => {
    if (!profile) return;

    try {
      await createCollaboration.mutateAsync({
        requester_id: profile.id,
        recipient_id: recipientId,
        message: "I'd like to connect with you for potential collaboration!",
      });
      toast({
        title: "Connection request sent!",
        description: "They'll be notified of your interest.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to send connection request. You may have already sent one.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-sage mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Partner Matching</h3>
          <p className="text-muted-foreground mb-4">
            Sign in to get personalized partner recommendations based on your interests and location.
          </p>
          <Button asChild>
            <Link to="/auth">Sign In to Get Started</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loadingProfile || loadingMatches) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto text-sage mb-4" />
          <h3 className="text-xl font-semibold mb-2">Complete Your Profile First</h3>
          <p className="text-muted-foreground mb-4">
            Create your profile to get personalized partner recommendations.
          </p>
          <Button asChild>
            <Link to="/create-profile">Create Profile</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const maxScore = matches && matches.length > 0 ? Math.max(...matches.map((m) => m.match_score), 1) : 1;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">AI-Powered Matching</span>
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">Your Partner Recommendations</h2>
        <p className="text-muted-foreground">
          Based on your interests ({profile.interests?.length || 0}) and location ({profile.location || "Not set"})
        </p>
      </div>

      {matches?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No matches found yet. Add more interests to your profile to get better recommendations!
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/profile-settings">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches?.map((match, index) => {
            const TypeIcon = TYPE_ICONS[match.profile_type] || Users;
            const matchPercent = Math.round((match.match_score / maxScore) * 100);

            return (
              <motion.div
                key={match.profile_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-sage/10 text-sage">
                          {match.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{match.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TypeIcon className="w-3 h-3" />
                          <span className="capitalize">{match.profile_type}</span>
                        </div>
                      </div>
                    </div>

                    {match.location && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{match.location}</span>
                        {match.location === profile.location && (
                          <Badge variant="secondary" className="text-xs ml-1">Same location</Badge>
                        )}
                      </div>
                    )}

                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Match Score</span>
                        <span className="font-medium text-sage">{matchPercent}%</span>
                      </div>
                      <Progress value={matchPercent} className="h-2" />
                    </div>

                    {/* Shared Interests */}
                    {match.shared_interests && match.shared_interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-2">Shared Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {match.shared_interests.slice(0, 4).map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {match.shared_interests.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{match.shared_interests.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link to={`/profile/${match.profile_id}`}>View Profile</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleConnect(match.profile_id)}
                        disabled={createCollaboration.isPending}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
