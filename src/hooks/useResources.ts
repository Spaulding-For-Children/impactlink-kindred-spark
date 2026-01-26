import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: "workshop" | "toolkit" | "reading";
  format: "live" | "recorded" | "pdf" | "article" | "report" | "book";
  category: string;
  thumbnail_url: string | null;
  file_url: string | null;
  external_url: string | null;
  duration: string | null;
  author: string | null;
  publication_date: string | null;
  tags: string[];
  featured: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceBookmark {
  id: string;
  user_id: string;
  resource_id: string;
  created_at: string;
}

// Fetch all resources with optional filters
export function useResources(filters?: {
  type?: "workshop" | "toolkit" | "reading";
  category?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ["resources", filters],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.type) {
        query = query.eq("resource_type", filters.type);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Resource[];
    },
  });
}

// Fetch a single resource
export function useResource(id: string) {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Resource | null;
    },
    enabled: !!id,
  });
}

// Get categories for a resource type
export function useResourceCategories(type: "workshop" | "toolkit" | "reading") {
  return useQuery({
    queryKey: ["resource-categories", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("category")
        .eq("resource_type", type);

      if (error) throw error;

      // Get unique categories with counts
      const categoryMap = new Map<string, number>();
      data.forEach((item) => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      });

      return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count,
      }));
    },
  });
}

// User bookmarks
export function useBookmarks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("resource_bookmarks")
        .select(`
          *,
          resource:resources(*)
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ resourceId, isBookmarked }: { resourceId: string; isBookmarked: boolean }) => {
      if (!user) throw new Error("Must be logged in");

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from("resource_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("resource_id", resourceId);
        if (error) throw error;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("resource_bookmarks")
          .insert({ user_id: user.id, resource_id: resourceId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

// Increment view count (optional - for future use)
export function useIncrementViewCount() {
  return useMutation({
    mutationFn: async (resourceId: string) => {
      // This would require a database function - silently skip for now
      console.log("View count increment for:", resourceId);
    },
  });
}
