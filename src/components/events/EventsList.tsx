import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Video, Star, Check, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents, useRegisterForEvent, useCancelRegistration, Event } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, isPast, isFuture } from "date-fns";
import { Link } from "react-router-dom";

const EVENT_TYPES = [
  { value: "all", label: "All Events" },
  { value: "workshop", label: "Workshops" },
  { value: "webinar", label: "Webinars" },
  { value: "conference", label: "Conferences" },
  { value: "networking", label: "Networking" },
  { value: "training", label: "Training" },
];

const TYPE_COLORS: Record<string, string> = {
  workshop: "bg-violet-100 text-violet-700",
  webinar: "bg-sky-100 text-sky-700",
  conference: "bg-amber/20 text-amber",
  networking: "bg-rose-100 text-rose-700",
  training: "bg-emerald-100 text-emerald-700",
};

export const EventsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: events, isLoading } = useEvents({ type: typeFilter, upcoming: true });
  const registerForEvent = useRegisterForEvent();
  const cancelRegistration = useCancelRegistration();

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to register for events." });
      return;
    }
    try {
      await registerForEvent.mutateAsync(eventId);
      toast({ title: "Registered!", description: "You're now registered for this event." });
    } catch {
      toast({ title: "Error", description: "Failed to register. Please try again.", variant: "destructive" });
    }
  };

  const handleCancel = async (eventId: string) => {
    try {
      await cancelRegistration.mutateAsync(eventId);
      toast({ title: "Registration cancelled", description: "You've been unregistered from this event." });
    } catch {
      toast({ title: "Error", description: "Failed to cancel registration.", variant: "destructive" });
    }
  };

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false;
    return isPast(new Date(deadline));
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">
            {events?.length || 0} events scheduled
          </p>
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Featured Events */}
      {events?.filter((e) => e.featured).length ? (
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber" />
            Featured Events
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events?.filter((e) => e.featured).map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onRegister={handleRegister}
                onCancel={handleCancel}
                isDeadlinePassed={isDeadlinePassed(event.registration_deadline)}
                isPending={registerForEvent.isPending || cancelRegistration.isPending}
                user={user}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* All Events */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-72" />
          ))}
        </div>
      ) : events?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back soon for new events!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events?.filter((e) => !e.featured).map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              onRegister={handleRegister}
              onCancel={handleCancel}
              isDeadlinePassed={isDeadlinePassed(event.registration_deadline)}
              isPending={registerForEvent.isPending || cancelRegistration.isPending}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface EventCardProps {
  event: Event;
  index: number;
  onRegister: (id: string) => void;
  onCancel: (id: string) => void;
  isDeadlinePassed: boolean;
  isPending: boolean;
  user: any;
}

const EventCard = ({ event, index, onRegister, onCancel, isDeadlinePassed, isPending, user }: EventCardProps) => {
  const typeColor = TYPE_COLORS[event.event_type] || "bg-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all">
        <CardContent className="pt-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
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

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>{format(new Date(event.start_date), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
              </span>
            </div>
            {event.host_organization && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 shrink-0" />
                <span>{event.host_name} • {event.host_organization}</span>
              </div>
            )}
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="mt-auto">
            {event.is_registered ? (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" disabled>
                  <Check className="w-4 h-4 mr-2" />
                  Registered
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => onCancel(event.id)}
                  disabled={isPending}
                >
                  Cancel Registration
                </Button>
              </div>
            ) : isDeadlinePassed ? (
              <Button variant="secondary" className="w-full" disabled>
                Registration Closed
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => onRegister(event.id)}
                disabled={isPending}
              >
                Register Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
