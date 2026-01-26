import { motion } from "framer-motion";
import { Users2, Check, X, Clock, UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollaborations, useUpdateCollaboration, useCurrentProfile } from "@/hooks/useCollaboration";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const STATUS_BADGES: Record<string, { variant: "default" | "secondary" | "destructive"; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { variant: "secondary", icon: Clock },
  accepted: { variant: "default", icon: UserCheck },
  declined: { variant: "destructive", icon: X },
};

export const MyCollaborations = () => {
  const { toast } = useToast();
  const { data: profile } = useCurrentProfile();
  const { data: collaborations, isLoading } = useCollaborations();
  const updateCollaboration = useUpdateCollaboration();

  const incomingRequests = collaborations?.filter(
    (c) => c.recipient_id === profile?.id && c.status === "pending"
  );
  const outgoingRequests = collaborations?.filter(
    (c) => c.requester_id === profile?.id && c.status === "pending"
  );
  const connections = collaborations?.filter((c) => c.status === "accepted");

  const handleUpdateStatus = async (id: string, status: "accepted" | "declined") => {
    try {
      await updateCollaboration.mutateAsync({ id, status });
      toast({
        title: status === "accepted" ? "Connection accepted!" : "Request declined",
        description: status === "accepted" ? "You're now connected." : "The request has been declined.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update request.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
          <Users2 className="w-6 h-6 text-sage" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">My Collaborations</h2>
          <p className="text-muted-foreground">
            Manage your connections and collaboration requests
          </p>
        </div>
      </div>

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">
            Connections ({connections?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="incoming">
            Incoming ({incomingRequests?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            Outgoing ({outgoingRequests?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="mt-6">
          {connections?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No connections yet. Start by browsing the Smart Matching tab!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {connections?.map((collab, index) => {
                const partner = collab.requester_id === profile?.id ? collab.recipient : collab.requester;

                return (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={partner?.avatar_url || undefined} />
                              <AvatarFallback>{partner?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{partner?.name}</h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {partner?.profile_type}
                              </p>
                            </div>
                          </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-sage/20 text-sage">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/profile/${partner?.id}`}>View Profile</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="incoming" className="mt-6">
          {incomingRequests?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserPlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {incomingRequests?.map((collab, index) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={collab.requester?.avatar_url || undefined} />
                            <AvatarFallback>{collab.requester?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{collab.requester?.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {collab.requester?.profile_type} •{" "}
                              {formatDistanceToNow(new Date(collab.created_at), { addSuffix: true })}
                            </p>
                            {collab.message && (
                              <p className="text-sm mt-1 italic">"{collab.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(collab.id, "accepted")}
                            disabled={updateCollaboration.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(collab.id, "declined")}
                            disabled={updateCollaboration.isPending}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-6">
          {outgoingRequests?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending outgoing requests.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {outgoingRequests?.map((collab, index) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={collab.recipient?.avatar_url || undefined} />
                            <AvatarFallback>{collab.recipient?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{collab.recipient?.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {collab.recipient?.profile_type} •{" "}
                              Sent {formatDistanceToNow(new Date(collab.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
