import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Clock, Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminRegistrations() {
  const queryClient = useQueryClient();
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["adminRegistrationRequests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const processRequest = useMutation({
    mutationFn: async ({ requestId, action, adminNotes }: { requestId: string; action: "approved" | "rejected"; adminNotes?: string }) => {
      setProcessingId(requestId);
      const { data, error } = await supabase.functions.invoke("process-registration", {
        body: { request_id: requestId, action, admin_notes: adminNotes },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["adminRegistrationRequests"] });
      toast.success(`Registration ${variables.action === "approved" ? "approved" : "rejected"} successfully`);
      setProcessingId(null);
    },
    onError: (error) => {
      toast.error("Failed to process registration: " + error.message);
      setProcessingId(null);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Registration Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending registration requests.</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{request.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted {format(new Date(request.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{request.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{request.organization}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-medium">Type:</span> {request.organization_type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Admin notes (optional, included in rejection email)..."
                      value={notesMap[request.id] || ""}
                      onChange={(e) => setNotesMap((prev) => ({ ...prev, [request.id]: e.target.value }))}
                      className="text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => processRequest.mutate({ requestId: request.id, action: "approved", adminNotes: notesMap[request.id] })}
                        disabled={processingId === request.id}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => processRequest.mutate({ requestId: request.id, action: "rejected", adminNotes: notesMap[request.id] })}
                        disabled={processingId === request.id}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Requests ({processedRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{request.name}</span>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.email} · {request.organization} · Processed {request.reviewed_at ? format(new Date(request.reviewed_at), "MMM d, yyyy") : ""}
                    </p>
                    {request.admin_notes && (
                      <p className="text-xs text-muted-foreground mt-1 italic">Notes: {request.admin_notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
