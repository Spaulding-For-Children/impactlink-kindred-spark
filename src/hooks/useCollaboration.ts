import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Types for collaboration portal
export interface ResearchQuestion {
  id: string;
  author_id: string;
  title: string;
  description: string;
  topics: string[];
  regions: string[];
  populations: string[];
  status: "open" | "in_progress" | "completed" | "closed";
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
    institution?: string | null;
    university?: string | null;
  };
}

export interface ForumTopic {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  post_count: number;
  created_at: string;
}

export interface ForumPost {
  id: string;
  topic_id: string;
  author_id: string;
  title: string;
  content: string;
  reply_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
  };
  topic?: ForumTopic;
}

export interface ForumReply {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
  };
}

export interface Collaboration {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted" | "declined";
  message: string | null;
  created_at: string;
  updated_at: string;
  requester?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
  };
  recipient?: {
    id: string;
    name: string;
    profile_type: string;
    avatar_url: string | null;
  };
}

export interface PartnerMatch {
  profile_id: string;
  name: string;
  profile_type: string;
  location: string | null;
  interests: string[] | null;
  match_score: number;
  shared_interests: string[];
}

// Hook for research questions
export function useResearchQuestions(filters?: {
  topic?: string;
  region?: string;
  population?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["research-questions", filters],
    queryFn: async () => {
      let query = supabase
        .from("research_questions")
        .select(`
          *,
          author:profiles!author_id(id, name, profile_type, avatar_url, institution, university)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status && (filters.status === "open" || filters.status === "in_progress" || filters.status === "completed" || filters.status === "closed")) {
        query = query.eq("status", filters.status);
      }
      if (filters?.topic) {
        query = query.contains("topics", [filters.topic]);
      }
      if (filters?.region) {
        query = query.contains("regions", [filters.region]);
      }
      if (filters?.population) {
        query = query.contains("populations", [filters.population]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResearchQuestion[];
    },
  });
}

export function useCreateResearchQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      author_id: string;
      title: string;
      description: string;
      topics: string[];
      regions: string[];
      populations: string[];
    }) => {
      const { data: result, error } = await supabase
        .from("research_questions")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research-questions"] });
    },
  });
}

// Hook for forum topics
export function useForumTopics() {
  return useQuery({
    queryKey: ["forum-topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_topics")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as ForumTopic[];
    },
  });
}

// Hook for forum posts
export function useForumPosts(topicId?: string) {
  return useQuery({
    queryKey: ["forum-posts", topicId],
    queryFn: async () => {
      let query = supabase
        .from("forum_posts")
        .select(`
          *,
          author:profiles!author_id(id, name, profile_type, avatar_url),
          topic:forum_topics!topic_id(*)
        `)
        .order("created_at", { ascending: false });

      if (topicId) {
        query = query.eq("topic_id", topicId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ForumPost[];
    },
  });
}

export function useForumPost(postId: string) {
  return useQuery({
    queryKey: ["forum-post", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select(`
          *,
          author:profiles!author_id(id, name, profile_type, avatar_url),
          topic:forum_topics!topic_id(*)
        `)
        .eq("id", postId)
        .maybeSingle();
      if (error) throw error;
      return data as ForumPost | null;
    },
    enabled: !!postId,
  });
}

export function useCreateForumPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      topic_id: string;
      author_id: string;
      title: string;
      content: string;
    }) => {
      const { data: result, error } = await supabase
        .from("forum_posts")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
}

// Hook for forum replies
export function useForumReplies(postId: string) {
  return useQuery({
    queryKey: ["forum-replies", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_replies")
        .select(`
          *,
          author:profiles!author_id(id, name, profile_type, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as ForumReply[];
    },
    enabled: !!postId,
  });
}

export function useCreateForumReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      post_id: string;
      author_id: string;
      content: string;
    }) => {
      const { data: result, error } = await supabase
        .from("forum_replies")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum-replies", variables.post_id] });
    },
  });
}

// Hook for collaborations
export function useCollaborations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["collaborations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // First get the profile id
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!profile) return [];

      const { data, error } = await supabase
        .from("collaborations")
        .select(`
          *,
          requester:profiles!requester_id(id, name, profile_type, avatar_url),
          recipient:profiles!recipient_id(id, name, profile_type, avatar_url)
        `)
        .or(`requester_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Collaboration[];
    },
    enabled: !!user,
  });
}

export function useCreateCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      requester_id: string;
      recipient_id: string;
      message?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("collaborations")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborations"] });
    },
  });
}

export function useUpdateCollaboration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "declined" }) => {
      const { data: result, error } = await supabase
        .from("collaborations")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborations"] });
    },
  });
}

// Hook for smart matchmaking
export function usePartnerMatches(profileId?: string) {
  return useQuery({
    queryKey: ["partner-matches", profileId],
    queryFn: async () => {
      if (!profileId) return [];

      const { data, error } = await supabase.rpc("get_partner_matches", {
        user_profile_id: profileId,
      });

      if (error) throw error;
      return (data || []) as PartnerMatch[];
    },
    enabled: !!profileId,
  });
}

// Hook to get current user's profile
export function useCurrentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["current-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
