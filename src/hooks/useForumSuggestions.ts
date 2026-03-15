import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ForumTopicSuggestion {
  id: string;
  name: string;
  description: string | null;
  suggested_by: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  profiles?: { name: string; email: string } | null;
}

export function useForumSuggestions(status?: string) {
  return useQuery({
    queryKey: ["forum-topic-suggestions", status],
    queryFn: async () => {
      let query = supabase
        .from("forum_topic_suggestions")
        .select("*, profiles:suggested_by(name, email)")
        .order("created_at", { ascending: false });
      if (status) query = query.eq("status", status);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as ForumTopicSuggestion[];
    },
  });
}

export function useCreateForumSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, description, suggested_by }: { name: string; description?: string; suggested_by: string }) => {
      const { error } = await supabase.from("forum_topic_suggestions").insert({ name, description, suggested_by });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-topic-suggestions"] });
      toast.success("Topic suggestion submitted for review!");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useUpdateForumSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes?: string }) => {
      const { error } = await supabase
        .from("forum_topic_suggestions")
        .update({ status, admin_notes, reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-topic-suggestions"] });
      toast.success("Suggestion updated");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}
