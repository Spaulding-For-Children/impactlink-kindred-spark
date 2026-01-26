import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, Video, MapPin, ExternalLink, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyRegistrations, useCancelRegistration, Event } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import { format, isPast } from "date-fns";
import { Link } from "react-router-dom";

const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-violet-100 text-violet-700",
  webinar: "bg-sky-100 text-sky-700",
  conference: "bg-amber/20 text-amber",
  networking: "bg-rose-100 text-rose-700",
  training: "bg-emerald-100 text-emerald-700",
};

export const MyRegistrations = () => {
  const { toast } = useToast();
  const { data: registrations, isLoading } = useMyRegistrations();
  const cancelRegistration = useCancelRegistration();

  const handleCancel = async (eventId: string) => {
    try {
      await cancelRegistration.mutateAsync(eventId);
      toast({ title: "Cancelled", description: "Your registration has been cancelled." });
    } catch {
      toast({ title: "Error", description: "Failed to cancel registration.", variant: "destructive" });
    }
  };

  const upcomingEvents = registrations?.filter((r) => !isPast(new Date((r.event as unknown as Event).start_date))) || [];
  const pastEvents = registrations?.filter((r) => isPast(new Date((r.event as unknown as Event).start_date))) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!registrations || registrations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No registrations yet</h3>
          <p className="text-muted-foreground mb-4">
            Browse upcoming events and register for ones that interest you!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-bold">Upcoming Events ({upcomingEvents.length})</h3>
          <div className="space-y-4">
            {upcomingEvents.map((registration, index) => {
              const event = registration.event as unknown as Event;
              const typeColor = TYPE_COLORS[event.event_type] || "bg-muted";

              return (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all">
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-sage/10 flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs text-sage font-medium">
                              {format(new Date(event.start_date), "MMM")}
                            </span>
                            <span className="text-lg font-bold text-sage">
                              {format(new Date(event.start_date), "d")}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={typeColor}>{event.event_type}</Badge>
                              {event.is_virtual ? (
                                <Badge variant="outline" className="gap-1">
                                  <Video className="w-3 h-3" />
                                  Virtual
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="gap-1">
                                  <MapPin className="w-3 h-3" />
                                  In-Person
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {format(new Date(event.start_date), "h:mm a")}
                              </span>
                              {event.host_organization && (
                                <span>Hosted by {event.host_organization}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.is_virtual && event.virtual_link && (
                            <Button variant="default" size="sm" asChild>
                              <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Join Event
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => handleCancel(event.id)}
                            disabled={cancelRegistration.isPending}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-display font-bold text-muted-foreground">
            Past Events ({pastEvents.length})
          </h3>
          <div className="space-y-3 opacity-70">
            {pastEvents.map((registration) => {
              const event = registration.event as unknown as Event;

              return (
                <Card key={registration.id} className="bg-muted/30">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.start_date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
