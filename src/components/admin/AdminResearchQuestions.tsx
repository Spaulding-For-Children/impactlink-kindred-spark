import { format } from "date-fns";
import { Trash2, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAdmin } from "@/hooks/useAdmin";

export function AdminResearchQuestions() {
  const { allResearchQuestions, isLoadingResearchQuestions, deleteResearchQuestion } = useAdmin();

  if (isLoadingResearchQuestions) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "closed":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Research Questions
          <Badge variant="secondary" className="ml-2">{allResearchQuestions.length} questions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allResearchQuestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No research questions yet</p>
        ) : (
          <div className="space-y-4">
            {allResearchQuestions.map((question: any) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{question.title}</h3>
                      <Badge variant="outline" className={getStatusColor(question.status)}>
                        {question.status?.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      by {question.profiles?.name || "Unknown"} • {format(new Date(question.created_at), "MMM d, yyyy")}
                    </p>
                    <p className="text-sm">{question.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.topics?.map((topic: string) => (
                        <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                      ))}
                      {question.populations?.map((pop: string) => (
                        <Badge key={pop} variant="secondary" className="text-xs">{pop}</Badge>
                      ))}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Research Question</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this research question? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteResearchQuestion.mutate(question.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
