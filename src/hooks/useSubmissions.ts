import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProfile } from "@/hooks/useCollaboration";

export interface ResearchSubmission {
  id: string;
  author_id: string;
  title: string;
  description: string;
  submission_type: "student_project" | "faculty_research" | "agency_report" | "global_showcase";
  file_url: string;
  file_name: string;
  file_size: number | null;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
  };
}

// Fetch approved submissions
export function useResearchSubmissions(filters?: { type?: string }) {
  return useQuery({
    queryKey: ["research-submissions", filters],
    queryFn: async () => {
      let query = supabase
        .from("research_submissions")
        .select(`
          *,
          author:profiles!author_id(id, name, profile_type, avatar_url)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (filters?.type && filters.type !== "all") {
        const validTypes = ["student_project", "faculty_research", "agency_report", "global_showcase"];
        if (validTypes.includes(filters.type)) {
          query = query.eq("submission_type", filters.type as "student_project" | "faculty_research" | "agency_report" | "global_showcase");
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResearchSubmission[];
    },
  });
}

// Fetch user's own submissions
export function useMySubmissions() {
  const { data: profile } = useCurrentProfile();

  return useQuery({
    queryKey: ["my-submissions", profile?.id],
    queryFn: async () => {
      if (!profile) return [];

      const { data, error } = await supabase
        .from("research_submissions")
        .select("*")
        .eq("author_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ResearchSubmission[];
    },
    enabled: !!profile,
  });
}

// Upload file and create submission
export function useCreateSubmission() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      submissionType,
      tags,
      authorId,
    }: {
      file: File;
      title: string;
      description: string;
      submissionType: "student_project" | "faculty_research" | "agency_report" | "global_showcase";
      tags: string[];
      authorId: string;
    }) => {
      if (!user) throw new Error("Must be logged in");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("research-uploads")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("research-uploads")
        .getPublicUrl(fileName);

      // Create submission record
      const { data, error } = await supabase
        .from("research_submissions")
        .insert({
          author_id: authorId,
          title,
          description,
          submission_type: submissionType,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          tags,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}

// Delete submission
export function useDeleteSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from("research_submissions")
        .delete()
        .eq("id", submissionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}
