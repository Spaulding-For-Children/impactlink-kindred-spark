import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Download, RefreshCw, Eye, ExternalLink, Mail, Phone, Globe, Send } from "lucide-react";
import { toast } from "sonner";

export function AdminProspects() {
  const queryClient = useQueryClient();
  const [selectedSearch, setSelectedSearch] = useState<string | null>(null);
  const [viewProspect, setViewProspect] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("Invitation to Join ImpactLink – A Research Collaboration Platform");
  const [emailBody, setEmailBody] = useState(
    `Dear {name},\n\nI'm reaching out from ImpactLink, a collaborative platform connecting child welfare researchers, agencies, and students.\n\n{suggested_outreach}\n\nWe believe {organization} would be a valuable addition to our growing network. Our platform offers:\n\n• A searchable directory of researchers and agencies\n• Collaboration matching tools\n• Shared research resources and datasets\n• Forums for discussion on key topics\n\nWe'd love to have you join us. You can learn more and create a profile at our website.\n\nBest regards,\nThe ImpactLink Team`
  );
  const [emailFromName, setEmailFromName] = useState("ImpactLink");

  // Fetch search history
  const { data: searches = [] } = useQuery({
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
      const dupMsg = data.duplicates_skipped > 0 ? ` (${data.duplicates_skipped} duplicates skipped)` : "";
      toast.success(`Found ${data.prospect_count} new prospects!${dupMsg}`);
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

  // Send bulk outreach emails
  const sendEmailMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("send-prospect-outreach", {
        body: {
          prospect_ids: Array.from(selectedIds),
          subject: emailSubject,
          body: emailBody,
          from_name: emailFromName,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      setEmailDialogOpen(false);
      setSelectedIds(new Set());
      let msg = `Sent ${data.sent} email(s)`;
      if (data.failed > 0) msg += `, ${data.failed} failed`;
      if (data.skipped_no_email > 0) msg += `, ${data.skipped_no_email} skipped (no email)`;
      toast.success(msg);
    },
    onError: (error) => {
      toast.error("Failed to send emails: " + error.message);
    },
  });

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === prospects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(prospects.map((p: any) => p.id)));
    }
  };

  const selectedWithEmail = prospects.filter(
    (p: any) => selectedIds.has(p.id) && p.email
  ).length;

  const selectedWithoutEmail = selectedIds.size - selectedWithEmail;

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
            {selectedIds.size > 0 && (
              <Button
                variant="default"
                onClick={() => setEmailDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Email Selected ({selectedIds.size})
              </Button>
            )}
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
            {selectedIds.size > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                · {selectedIds.size} selected ({selectedWithEmail} with email)
              </span>
            )}
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
                    <TableHead className="w-10">
                      <Checkbox
                        checked={prospects.length > 0 && selectedIds.size === prospects.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
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
                    <TableRow key={p.id} className={selectedIds.has(p.id) ? "bg-muted/50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(p.id)}
                          onCheckedChange={() => toggleSelect(p.id)}
                        />
                      </TableCell>
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

      {/* Bulk Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Outreach Emails
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4 text-sm">
              <Badge variant="default">{selectedIds.size} selected</Badge>
              <Badge variant="secondary">{selectedWithEmail} with email</Badge>
              {selectedWithoutEmail > 0 && (
                <Badge variant="destructive">{selectedWithoutEmail} without email (will be skipped)</Badge>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">From Name</label>
              <Input
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                placeholder="Sender name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject line"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Body</label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={12}
                placeholder="Write your outreach email..."
              />
              <p className="text-xs text-muted-foreground">
                Available placeholders: <code className="bg-muted px-1 rounded">{"{name}"}</code>,{" "}
                <code className="bg-muted px-1 rounded">{"{organization}"}</code>,{" "}
                <code className="bg-muted px-1 rounded">{"{suggested_outreach}"}</code>
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => sendEmailMutation.mutate()}
              disabled={sendEmailMutation.isPending || selectedWithEmail === 0}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {sendEmailMutation.isPending
                ? "Sending..."
                : `Send to ${selectedWithEmail} prospect${selectedWithEmail !== 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
