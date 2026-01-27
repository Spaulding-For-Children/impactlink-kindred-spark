import { useState } from "react";
import { Plus, Trash2, Edit, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAdmin } from "@/hooks/useAdmin";

interface ForumTopicForm {
  id?: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const emptyForm: ForumTopicForm = {
  name: "",
  description: "",
  icon: "MessageSquare",
  color: "sage",
};

export function AdminForumTopics() {
  const { allForumTopics, isLoadingForumTopics, upsertForumTopic, deleteForumTopic } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ForumTopicForm>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertForumTopic.mutate(form, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  const handleEdit = (topic: any) => {
    setForm({
      id: topic.id,
      name: topic.name,
      description: topic.description || "",
      icon: topic.icon || "MessageSquare",
      color: topic.color || "sage",
    });
    setIsDialogOpen(true);
  };

  if (isLoadingForumTopics) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Forum Topics
          <Badge variant="secondary" className="ml-2">{allForumTopics.length} topics</Badge>
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Forum Topic" : "Add New Forum Topic"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Topic Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g., BookOpen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="e.g., sage, navy, amber"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertForumTopic.isPending}>
                  {form.id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allForumTopics.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No forum topics yet</p>
        ) : (
          <div className="space-y-3">
            {allForumTopics.map((topic: any) => (
              <div
                key={topic.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{topic.name}</h3>
                    <Badge variant="outline">{topic.post_count || 0} posts</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{topic.description || "No description"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(topic)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Forum Topic</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{topic.name}"? This will also delete all posts in this topic.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteForumTopic.mutate(topic.id)}
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
