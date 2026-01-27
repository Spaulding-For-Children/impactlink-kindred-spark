import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useAdmin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if current user is admin
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      return !!data;
    },
    enabled: !!user,
  });

  // Fetch all pending submissions for moderation
  const { data: pendingSubmissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["adminSubmissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_submissions")
        .select("*, profiles:author_id(name, email)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all profiles for directory management
  const { data: allProfiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["adminProfiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all resources
  const { data: allResources = [], isLoading: isLoadingResources } = useQuery({
    queryKey: ["adminResources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all events
  const { data: allEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ["adminEvents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("start_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all forum topics
  const { data: allForumTopics = [], isLoading: isLoadingForumTopics } = useQuery({
    queryKey: ["adminForumTopics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Fetch all research questions
  const { data: allResearchQuestions = [], isLoading: isLoadingResearchQuestions } = useQuery({
    queryKey: ["adminResearchQuestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_questions")
        .select("*, profiles:author_id(name, email)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  // Update submission status
  const updateSubmissionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" }) => {
      const { error } = await supabase
        .from("research_submissions")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
      toast.success("Submission status updated");
    },
    onError: (error) => {
      toast.error("Failed to update submission: " + error.message);
    },
  });

  // Delete submission
  const deleteSubmission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("research_submissions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
      toast.success("Submission deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete submission: " + error.message);
    },
  });

  // Delete profile
  const deleteProfile = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfiles"] });
      toast.success("Profile deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete profile: " + error.message);
    },
  });

  // Create/Update resource
  const upsertResource = useMutation({
    mutationFn: async (resource: {
      id?: string;
      title: string;
      description: string;
      category: string;
      resource_type: "workshop" | "toolkit" | "reading";
      format: "live" | "recorded" | "pdf" | "article" | "report" | "book";
      external_url?: string;
      author?: string;
      tags?: string[];
    }) => {
      if (resource.id) {
        const { error } = await supabase
          .from("resources")
          .update(resource)
          .eq("id", resource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("resources")
          .insert(resource);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      toast.success("Resource saved");
    },
    onError: (error) => {
      toast.error("Failed to save resource: " + error.message);
    },
  });

  // Delete resource
  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      toast.success("Resource deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete resource: " + error.message);
    },
  });

  // Create/Update event
  const upsertEvent = useMutation({
    mutationFn: async (event: {
      id?: string;
      title: string;
      description: string;
      event_type: "workshop" | "webinar" | "conference" | "networking" | "training";
      start_date: string;
      end_date: string;
      location?: string;
      is_virtual?: boolean;
      virtual_link?: string;
      host_name?: string;
      host_organization?: string;
      max_attendees?: number;
      tags?: string[];
    }) => {
      if (event.id) {
        const { error } = await supabase
          .from("events")
          .update(event)
          .eq("id", event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("events")
          .insert(event);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      toast.success("Event saved");
    },
    onError: (error) => {
      toast.error("Failed to save event: " + error.message);
    },
  });

  // Delete event
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      toast.success("Event deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete event: " + error.message);
    },
  });

  // Create/Update forum topic
  const upsertForumTopic = useMutation({
    mutationFn: async (topic: {
      id?: string;
      name: string;
      description?: string;
      icon?: string;
      color?: string;
    }) => {
      if (topic.id) {
        const { error } = await supabase
          .from("forum_topics")
          .update(topic)
          .eq("id", topic.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("forum_topics")
          .insert(topic);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminForumTopics"] });
      toast.success("Forum topic saved");
    },
    onError: (error) => {
      toast.error("Failed to save forum topic: " + error.message);
    },
  });

  // Delete forum topic
  const deleteForumTopic = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("forum_topics")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminForumTopics"] });
      toast.success("Forum topic deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete forum topic: " + error.message);
    },
  });

  // Delete research question
  const deleteResearchQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("research_questions")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResearchQuestions"] });
      toast.success("Research question deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete research question: " + error.message);
    },
  });

  return {
    isAdmin,
    isCheckingAdmin,
    pendingSubmissions,
    isLoadingSubmissions,
    allProfiles,
    isLoadingProfiles,
    allResources,
    isLoadingResources,
    allEvents,
    isLoadingEvents,
    allForumTopics,
    isLoadingForumTopics,
    allResearchQuestions,
    isLoadingResearchQuestions,
    updateSubmissionStatus,
    deleteSubmission,
    deleteProfile,
    upsertResource,
    deleteResource,
    upsertEvent,
    deleteEvent,
    upsertForumTopic,
    deleteForumTopic,
    deleteResearchQuestion,
  };
}
