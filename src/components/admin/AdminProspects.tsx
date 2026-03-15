import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, RefreshCw, Eye, ExternalLink, Mail, Phone, Globe } from "lucide-react";
import { toast } from "sonner";

export function AdminProspects() {
  const queryClient = useQueryClient();
  const [selectedSearch, setSelectedSearch] = useState<string | null>(null);
  const [viewProspect, setViewProspect] = useState<any>(null);

  // Fetch search history
  const { data: searches = [], isLoading: loadingSearches } = useQuery({
    queryKey: ["prospect-searches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospect_searches")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch prospects for selected search (or all)
  const { data: prospects = [], isLoading: loadingProspects } = useQuery({
    queryKey: ["prospects", selectedSearch],
    queryFn: async () => {
      let query = supabase
        .from("prospects")
        .select("*")
        .order("relevance_score", { ascending: false });
      if (selectedSearch) {
        query = query.eq("search_id", selectedSearch);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Generate new prospects
  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("generate-prospects");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prospect-searches"] });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      toast.success(`Found ${data.prospect_count} prospects!`);
    },
    onError: (error) => {
      toast.error("Failed to generate prospects: " + error.message);
    },
  });

  // Update outreach status
  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const updates: any = { outreach_status: status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updates.notes = notes;
      const { error } = await supabase.from("prospects").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      toast.success("Status updated");
    },
  });

  // CSV export
  const exportCSV = () => {
    if (prospects.length === 0) return toast.error("No prospects to export");
    const headers = ["Name", "Organization", "Type", "Email", "Phone", "Website", "Location", "Department/Title", "Relevant Topics", "Relevance Score", "Suggested Outreach", "Source URL", "Outreach Status", "Notes"];
    const rows = prospects.map((p: any) => [
      p.name, p.organization || "", p.prospect_type, p.email || "", p.phone || "",
      p.website || "", p.location || "", p.department_title || "",
      (p.relevant_topics || []).join("; "), p.relevance_score,
      (p.suggested_outreach || "").replace(/"/g, '""'),
      p.source_url || "", p.outreach_status, (p.notes || "").replace(/"/g, '""'),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map((v: any) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospects-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            AI Prospect Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
              {generateMutation.isPending ? "Searching..." : "Generate New Prospects"}
            </Button>
            <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter by search:</span>
              <Select value={selectedSearch || "all"} onValueChange={(v) => setSelectedSearch(v === "all" ? null : v)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All searches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All searches</SelectItem>
                  {searches.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {new Date(s.created_at).toLocaleDateString()} ({s.prospect_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {generateMutation.isPending && (
            <p className="text-sm text-muted-foreground mt-3">
              Searching the web for organizations and researchers matching your platform topics. This may take 30-60 seconds...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search History */}
      {searches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searches.slice(0, 5).map((s: any) => (
                <Badge
                  key={s.id}
                  variant={s.status === "completed" ? "default" : s.status === "error" ? "destructive" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSearch(s.id)}
                >
                  {new Date(s.created_at).toLocaleDateString()} · {s.prospect_count} results · {s.status}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prospects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Prospects ({prospects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingProspects ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : prospects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No prospects yet. Click "Generate New Prospects" to search for organizations and researchers.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospects.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.organization || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={p.prospect_type === "agency" ? "secondary" : "outline"}>
                          {p.prospect_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.relevance_score >= 70 ? "default" : "secondary"}>
                          {p.relevance_score}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {p.email && <Mail className="h-3.5 w-3.5 text-muted-foreground" />}
                          {p.phone && <Phone className="h-3.5 w-3.5 text-muted-foreground" />}
                          {p.website && <Globe className="h-3.5 w-3.5 text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={p.outreach_status}
                          onValueChange={(v) => updateStatus.mutate({ id: p.id, status: v })}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_contacted">Not Contacted</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="responded">Responded</SelectItem>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="not_interested">Not Interested</SelectItem>
                            <SelectItem value="onboarded">Onboarded</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setViewProspect(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prospect Detail Dialog */}
      <Dialog open={!!viewProspect} onOpenChange={() => setViewProspect(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewProspect?.name}</DialogTitle>
          </DialogHeader>
          {viewProspect && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Organization:</span>
                  <p className="font-medium">{viewProspect.organization || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{viewProspect.prospect_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{viewProspect.location || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dept / Title:</span>
                  <p className="font-medium">{viewProspect.department_title || "—"}</p>
                </div>
                {viewProspect.email && (
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{viewProspect.email}</p>
                  </div>
                )}
                {viewProspect.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{viewProspect.phone}</p>
                  </div>
                )}
              </div>
              {viewProspect.website && (
                <a
                  href={viewProspect.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {viewProspect.website}
                </a>
              )}
              {viewProspect.relevant_topics?.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Relevant Topics:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewProspect.relevant_topics.map((t: string) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {viewProspect.suggested_outreach && (
                <div>
                  <span className="text-sm text-muted-foreground">Suggested Outreach:</span>
                  <p className="text-sm mt-1 bg-muted/50 rounded p-3">{viewProspect.suggested_outreach}</p>
                </div>
              )}
              {viewProspect.source_url && (
                <a
                  href={viewProspect.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Source
                </a>
              )}
              <div>
                <span className="text-sm text-muted-foreground">Notes:</span>
                <Textarea
                  defaultValue={viewProspect.notes || ""}
                  placeholder="Add notes about this prospect..."
                  onBlur={(e) => {
                    if (e.target.value !== (viewProspect.notes || "")) {
                      updateStatus.mutate({ id: viewProspect.id, status: viewProspect.outreach_status, notes: e.target.value });
                    }
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
