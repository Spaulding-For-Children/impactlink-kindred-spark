import { format } from "date-fns";
import { Check, X, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForumSuggestions, useUpdateForumSuggestion } from "@/hooks/useForumSuggestions";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminForumSuggestions() {
  const { data: suggestions = [], isLoading } = useForumSuggestions();
  const updateSuggestion = useUpdateForumSuggestion();
  const { upsertForumTopic } = useAdmin();

  const handleApprove = async (suggestion: any) => {
    // Create the forum topic
    upsertForumTopic.mutate(
      { name: suggestion.name, description: suggestion.description || "" },
      {
        onSuccess: () => {
          updateSuggestion.mutate({ id: suggestion.id, status: "approved" });
        },
      }
    );
  };

  const handleReject = (id: string) => {
    updateSuggestion.mutate({ id, status: "rejected" });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const pending = suggestions.filter((s) => s.status === "pending");
  const reviewed = suggestions.filter((s) => s.status !== "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Forum Topic Suggestions
          {pending.length > 0 && (
            <Badge variant="destructive" className="ml-2">{pending.length} pending</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No suggestions yet</p>
        ) : (
          <>
            {pending.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pending Review</h3>
                {pending.map((s) => (
                  <div key={s.id} className="border rounded-lg p-4 flex items-start justify-between gap-4 bg-amber-50/50 border-amber-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <h4 className="font-semibold">{s.name}</h4>
                      </div>
                      {s.description && <p className="text-sm text-muted-foreground mb-1">{s.description}</p>}
                      <p className="text-xs text-muted-foreground">
                        by {s.profiles?.name || "Unknown"} • {format(new Date(s.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(s)} disabled={updateSuggestion.isPending}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(s.id)} disabled={updateSuggestion.isPending}>
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reviewed.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Reviewed</h3>
                {reviewed.map((s) => (
                  <div key={s.id} className="border rounded-lg p-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        by {s.profiles?.name || "Unknown"}
                      </span>
                    </div>
                    <Badge variant={s.status === "approved" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
