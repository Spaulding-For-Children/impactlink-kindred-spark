import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Edit, BookOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAdmin } from "@/hooks/useAdmin";

interface ResourceForm {
  id?: string;
  title: string;
  description: string;
  category: string;
  resource_type: "workshop" | "toolkit" | "reading";
  format: "live" | "recorded" | "pdf" | "article" | "report" | "book";
  external_url?: string;
  author?: string;
}

const emptyForm: ResourceForm = {
  title: "",
  description: "",
  category: "",
  resource_type: "reading",
  format: "article",
  external_url: "",
  author: "",
};

export function AdminResources() {
  const { allResources, isLoadingResources, upsertResource, deleteResource } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ResourceForm>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertResource.mutate(form, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setForm(emptyForm);
      },
    });
  };

  const handleEdit = (resource: any) => {
    setForm({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      resource_type: resource.resource_type,
      format: resource.format,
      external_url: resource.external_url || "",
      author: resource.author || "",
    });
    setIsDialogOpen(true);
  };

  if (isLoadingResources) {
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
          <BookOpen className="h-5 w-5" />
          Resources & Learning
          <Badge variant="secondary" className="ml-2">{allResources.length} items</Badge>
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.resource_type}
                    onValueChange={(v) => setForm({ ...form, resource_type: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="toolkit">Toolkit</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={form.format}
                    onValueChange={(v) => setForm({ ...form, format: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="recorded">Recorded</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g., Research Methods, Policy Analysis"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author (optional)</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">External URL (optional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={form.external_url}
                  onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertResource.isPending}>
                  {form.id ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allResources.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No resources yet</p>
        ) : (
          <div className="space-y-3">
            {allResources.map((resource: any) => (
              <div
                key={resource.id}
                className="border rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    <Badge variant="outline">{resource.resource_type}</Badge>
                    <Badge variant="secondary">{resource.format}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{resource.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {resource.category} {resource.author && `• by ${resource.author}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resource)}>
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
                        <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteResource.mutate(resource.id)}
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
