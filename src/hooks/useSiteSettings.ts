import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteSettings {
  [key: string]: Record<string, any>;
}

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings = {}, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings" as any)
        .select("key, value");
      
      if (error) throw error;
      
      const result: SiteSettings = {};
      (data as any[])?.forEach((row: any) => {
        result[row.key] = row.value;
      });
      return result;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Record<string, any> }) => {
      const { error } = await supabase
        .from("site_settings" as any)
        .update({ value, updated_at: new Date().toISOString() } as any)
        .eq("key", key);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Settings saved");
    },
    onError: (error: any) => {
      toast.error("Failed to save settings: " + error.message);
    },
  });

  const getSetting = (key: string, field?: string, fallback?: any) => {
    const section = settings[key];
    if (!section) return fallback;
    if (field) return section[field] ?? fallback;
    return section;
  };

  const getSections = () => {
    const sectionsConfig = settings["sections"] || { order: ["hero", "directory", "collaboration", "datatools", "resources", "events", "contact"], hidden: [] };
    return sectionsConfig;
  };

  return {
    settings,
    isLoading,
    updateSetting,
    getSetting,
    getSections,
  };
}
