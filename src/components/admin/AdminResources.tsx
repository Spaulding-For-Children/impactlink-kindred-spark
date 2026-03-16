import { useState, useRef } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Edit, BookOpen, X, Upload, Download, FileSpreadsheet } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const VALID_RESOURCE_TYPES = ["workshop", "toolkit", "reading"] as const;
const VALID_FORMATS = ["live", "recorded", "pdf", "article", "report", "book"] as const;

interface ResourceForm {
  id?: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  resource_type: "workshop" | "toolkit" | "reading";
  format: "live" | "recorded" | "pdf" | "article" | "report" | "book";
  external_url?: string;
  author?: string;
}

const emptyForm: ResourceForm = {
  title: "",
  description: "",
  content: "",
  category: "",
  resource_type: "reading",
  format: "article",
  external_url: "",
  author: "",
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && text[i + 1] === "\n")) {
        row.push(current.trim());
        if (row.some((c) => c.length > 0)) rows.push(row);
        row = [];
        current = "";
        if (char === "\r") i++;
      } else {
        current += char;
      }
    }
  }
  row.push(current.trim());
  if (row.some((c) => c.length > 0)) rows.push(row);
  return rows;
}

function generateSampleCSV(): string {
  const header = "title,description,category,resource_type,format,external_url,author,tags";
  const examples = [
    '"Child Welfare Assessment Methods","Overview of modern assessment techniques","Research Methods","reading","article","https://example.com/article","Dr. Jane Smith","assessment;methods;child welfare"',
    '"Trauma-Informed Care Workshop","Interactive workshop on TIC principles","Practice Skills","workshop","live","https://example.com/workshop","Prof. John Doe","trauma;workshop;care"',
    '"Policy Analysis Toolkit","Tools for analyzing child welfare policies","Policy","toolkit","pdf","https://example.com/toolkit","","policy;analysis"',
  ];
  return [header, ...examples].join("\n");
}

export function AdminResources() {
  const { allResources, isLoadingResources, upsertResource, deleteResource } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<ResourceForm>(emptyForm);
  const [isImporting, setIsImporting] = useState(false);
  const [csvPreview, setCsvPreview] = useState<Array<Record<string, string>>>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

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
      content: resource.content || "",
      category: resource.category,
      resource_type: resource.resource_type,
      format: resource.format,
      external_url: resource.external_url || "",
      author: resource.author || "",
    });
    setIsDialogOpen(true);
  };

  const handleDownloadTemplate = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resources_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);

      if (rows.length < 2) {
        setCsvErrors(["CSV must have a header row and at least one data row."]);
        setCsvPreview([]);
        setIsImportDialogOpen(true);
        return;
      }

      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const requiredHeaders = ["title", "description", "category", "resource_type", "format"];
      const missing = requiredHeaders.filter((h) => !headers.includes(h));

      if (missing.length > 0) {
        setCsvErrors([`Missing required columns: ${missing.join(", ")}`]);
        setCsvPreview([]);
        setIsImportDialogOpen(true);
        return;
      }

      const errors: string[] = [];
      const parsed: Array<Record<string, string>> = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const record: Record<string, string> = {};
        headers.forEach((header, idx) => {
          record[header] = row[idx] || "";
        });

        if (!record.title) {
          errors.push(`Row ${i + 1}: Missing title`);
          continue;
        }
        if (!record.description) {
          errors.push(`Row ${i + 1}: Missing description`);
          continue;
        }
        if (!record.category) {
          errors.push(`Row ${i + 1}: Missing category`);
          continue;
        }
        if (!VALID_RESOURCE_TYPES.includes(record.resource_type as any)) {
          errors.push(`Row ${i + 1}: Invalid resource_type "${record.resource_type}". Must be: ${VALID_RESOURCE_TYPES.join(", ")}`);
          continue;
        }
        if (!VALID_FORMATS.includes(record.format as any)) {
          errors.push(`Row ${i + 1}: Invalid format "${record.format}". Must be: ${VALID_FORMATS.join(", ")}`);
          continue;
        }

        parsed.push(record);
      }

      setCsvErrors(errors);
      setCsvPreview(parsed);
      setIsImportDialogOpen(true);
    };
    reader.readAsText(file);

    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportConfirm = async () => {
    if (csvPreview.length === 0) return;
    setIsImporting(true);

    try {
      const records = csvPreview.map((row) => ({
        title: row.title,
        description: row.description,
        category: row.category,
        resource_type: row.resource_type as "workshop" | "toolkit" | "reading",
        format: row.format as "live" | "recorded" | "pdf" | "article" | "report" | "book",
        external_url: row.external_url || null,
        author: row.author || null,
        tags: row.tags ? row.tags.split(";").map((t: string) => t.trim()).filter(Boolean) : [],
      }));

      const { error } = await supabase.from("resources").insert(records);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      toast.success(`Successfully imported ${records.length} resources`);
      setIsImportDialogOpen(false);
      setCsvPreview([]);
      setCsvErrors([]);
    } catch (error: any) {
      toast.error("Import failed: " + error.message);
    } finally {
      setIsImporting(false);
    }
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
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Resources & Learning
          <Badge variant="secondary" className="ml-2">{allResources.length} items</Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* CSV Import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button variant="outline" onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            CSV Template
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>

          {/* Add Resource Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setForm(emptyForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
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
                {form.resource_type === "toolkit" && (
                  <div className="space-y-2">
                    <Label htmlFor="content">Guide Content (Markdown)</Label>
                    <p className="text-xs text-muted-foreground">Full toolkit content. Supports markdown formatting (headings, lists, tables, bold, etc.)</p>
                    <Textarea
                      id="content"
                      value={form.content || ""}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="min-h-[300px] font-mono text-xs"
                      placeholder="# Guide Title&#10;&#10;## Chapter 1: Getting Started&#10;&#10;Write your comprehensive guide content here..."
                    />
                  </div>
                )}
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
        </div>
      </CardHeader>

      {/* CSV Import Preview Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              CSV Import Preview
            </DialogTitle>
          </DialogHeader>

          {csvErrors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm font-medium text-destructive mb-1">Errors ({csvErrors.length})</p>
              <ul className="text-xs text-destructive space-y-1 max-h-32 overflow-y-auto">
                {csvErrors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {csvPreview.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground">
                {csvPreview.length} valid row{csvPreview.length !== 1 ? "s" : ""} ready to import:
              </p>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-2 font-medium">Title</th>
                        <th className="text-left p-2 font-medium">Type</th>
                        <th className="text-left p-2 font-medium">Format</th>
                        <th className="text-left p-2 font-medium">Category</th>
                        <th className="text-left p-2 font-medium">Author</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.slice(0, 20).map((row, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2 max-w-[200px] truncate">{row.title}</td>
                          <td className="p-2">
                            <Badge variant="outline">{row.resource_type}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant="secondary">{row.format}</Badge>
                          </td>
                          <td className="p-2">{row.category}</td>
                          <td className="p-2 text-muted-foreground">{row.author || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvPreview.length > 20 && (
                  <p className="text-xs text-muted-foreground p-2 border-t">
                    ...and {csvPreview.length - 20} more rows
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportConfirm} disabled={isImporting}>
                  {isImporting ? "Importing..." : `Import ${csvPreview.length} Resources`}
                </Button>
              </div>
            </>
          )}

          {csvPreview.length === 0 && csvErrors.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

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