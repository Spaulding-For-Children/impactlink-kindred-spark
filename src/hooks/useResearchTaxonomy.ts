import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useResearchTopics() {
  return useQuery({
    queryKey: ["research-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_topics")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as { id: string; name: string; created_at: string }[];
    },
  });
}

export function useResearchPopulations() {
  return useQuery({
    queryKey: ["research-populations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_populations")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as { id: string; name: string; created_at: string }[];
    },
  });
}

export function useCreateResearchTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("research_topics").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-topics"] });
      toast.success("Topic added");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useDeleteResearchTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("research_topics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-topics"] });
      toast.success("Topic deleted");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useCreateResearchPopulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("research_populations").insert({ name });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-populations"] });
      toast.success("Population added");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useDeleteResearchPopulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("research_populations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-populations"] });
      toast.success("Population deleted");
    },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}
