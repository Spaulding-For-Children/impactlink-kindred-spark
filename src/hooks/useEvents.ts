import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: "workshop" | "webinar" | "conference" | "networking" | "training";
  start_date: string;
  end_date: string;
  location: string | null;
  is_virtual: boolean;
  virtual_link: string | null;
  max_attendees: number | null;
  registration_deadline: string | null;
  host_name: string | null;
  host_organization: string | null;
  thumbnail_url: string | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  registration_count?: number;
  is_registered?: boolean;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  reminder_sent: boolean;
  attended: boolean;
}

// Fetch all events with optional filters
export function useEvents(filters?: {
  type?: string;
  featured?: boolean;
  upcoming?: boolean;
}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["events", filters, user?.id],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: true });

      if (filters?.type && filters.type !== "all") {
        const validTypes = ["workshop", "webinar", "conference", "networking", "training"];
        if (validTypes.includes(filters.type)) {
          query = query.eq("event_type", filters.type as "workshop" | "webinar" | "conference" | "networking" | "training");
        }
      }
      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }
      if (filters?.upcoming) {
        query = query.gte("start_date", new Date().toISOString());
      }

      const { data: events, error } = await query;
      if (error) throw error;

      // Get user's registrations if logged in
      let userRegistrations: string[] = [];
      if (user) {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id);
        userRegistrations = regs?.map((r) => r.event_id) || [];
      }

      // Add registration status to each event
      return (events as Event[]).map((event) => ({
        ...event,
        is_registered: userRegistrations.includes(event.id),
      }));
    },
  });
}

// Fetch a single event
export function useEvent(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["event", id, user?.id],
    queryFn: async () => {
      const { data: event, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!event) return null;

      // Check if user is registered
      let isRegistered = false;
      if (user) {
        const { data: reg } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("event_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        isRegistered = !!reg;
      }

      return { ...event, is_registered: isRegistered } as Event;
    },
    enabled: !!id,
  });
}

// Get user's registrations
export function useMyRegistrations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-registrations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          *,
          event:events(*)
        `)
        .eq("user_id", user.id)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

// Register for an event
export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { data, error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
    },
  });
}

// Cancel registration
export function useCancelRegistration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["my-registrations"] });
    },
  });
}

// Get events grouped by month for calendar view
export function useEventsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ["events-by-month", year, month],
    queryFn: async () => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("start_date", startDate.toISOString())
        .lte("start_date", endDate.toISOString())
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });
}
