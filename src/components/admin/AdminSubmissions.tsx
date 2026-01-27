import { format } from "date-fns";
import { Check, X, Trash2, ExternalLink, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminSubmissions() {
  const {
    pendingSubmissions,
    isLoadingSubmissions,
    updateSubmissionStatus,
    deleteSubmission,
  } = useAdmin();

  if (isLoadingSubmissions) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Research Submissions
          <Badge variant="secondary" className="ml-2">
            {pendingSubmissions.filter((s: any) => s.status === "pending").length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSubmissions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No submissions yet</p>
        ) : (
          <div className="space-y-4">
            {pendingSubmissions.map((submission: any) => (
              <div
                key={submission.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{submission.title}</h3>
                      {getStatusBadge(submission.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {submission.profiles?.name || "Unknown"} • {format(new Date(submission.created_at), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm">{submission.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary">{submission.submission_type.replace("_", " ")}</Badge>
                      {submission.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {submission.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t">
                  {submission.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => updateSubmissionStatus.mutate({ id: submission.id, status: "approved" })}
                      disabled={updateSubmissionStatus.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  {submission.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSubmissionStatus.mutate({ id: submission.id, status: "rejected" })}
                      disabled={updateSubmissionStatus.isPending}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteSubmission.mutate(submission.id)}
                    disabled={deleteSubmission.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
