import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Dataset {
  id: string;
  title: string;
  description: string;
  source_organization: string;
  source_type: string;
  data_format: string | null;
  access_url: string | null;
  documentation_url: string | null;
  coverage_start: string | null;
  coverage_end: string | null;
  regions: string[];
  topics: string[];
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalysisTool {
  id: string;
  name: string;
  full_name: string;
  description: string;
  tool_type: string;
  category: string;
  access_url: string | null;
  documentation_url: string | null;
  license_type: string | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EthicsResource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  jurisdiction: string | null;
  external_url: string | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export function useDatasets(filters?: { source_type?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ["datasets", filters],
    queryFn: async () => {
      let query = supabase
        .from("datasets")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.source_type) query = query.eq("source_type", filters.source_type);
      if (filters?.featured !== undefined) query = query.eq("featured", filters.featured);

      const { data, error } = await query;
      if (error) throw error;
      return data as Dataset[];
    },
  });
}

export function useAnalysisTools(filters?: { tool_type?: string; category?: string }) {
  return useQuery({
    queryKey: ["analysis_tools", filters],
    queryFn: async () => {
      let query = supabase
        .from("analysis_tools")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.tool_type) query = query.eq("tool_type", filters.tool_type);
      if (filters?.category) query = query.eq("category", filters.category);

      const { data, error } = await query;
      if (error) throw error;
      return data as AnalysisTool[];
    },
  });
}

export function useEthicsResources(filters?: { resource_type?: string; jurisdiction?: string }) {
  return useQuery({
    queryKey: ["ethics_resources", filters],
    queryFn: async () => {
      let query = supabase
        .from("ethics_resources")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.resource_type) query = query.eq("resource_type", filters.resource_type);
      if (filters?.jurisdiction) query = query.eq("jurisdiction", filters.jurisdiction);

      const { data, error } = await query;
      if (error) throw error;
      return data as EthicsResource[];
    },
  });
}

// Admin mutations
export function useUpsertDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dataset: Partial<Dataset> & { title: string; description: string; source_organization: string }) => {
      if (dataset.id) {
        const { error } = await supabase.from("datasets").update(dataset).eq("id", dataset.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("datasets").insert(dataset);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["datasets"] }); toast.success("Dataset saved"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useDeleteDataset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("datasets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["datasets"] }); toast.success("Dataset deleted"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useUpsertAnalysisTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tool: Partial<AnalysisTool> & { name: string; full_name: string; description: string }) => {
      if (tool.id) {
        const { error } = await supabase.from("analysis_tools").update(tool).eq("id", tool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("analysis_tools").insert(tool);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["analysis_tools"] }); toast.success("Tool saved"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useDeleteAnalysisTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("analysis_tools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["analysis_tools"] }); toast.success("Tool deleted"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useUpsertEthicsResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (resource: Partial<EthicsResource> & { title: string; description: string }) => {
      if (resource.id) {
        const { error } = await supabase.from("ethics_resources").update(resource).eq("id", resource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ethics_resources").insert(resource);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ethics_resources"] }); toast.success("Ethics resource saved"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}

export function useDeleteEthicsResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ethics_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ethics_resources"] }); toast.success("Ethics resource deleted"); },
    onError: (e) => toast.error("Failed: " + e.message),
  });
}
