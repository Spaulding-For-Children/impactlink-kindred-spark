import { useState, useRef } from "react";
import { Plus, Trash2, Tag, Users, Upload, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  useResearchTopics,
  useResearchPopulations,
  useCreateResearchTopic,
  useDeleteResearchTopic,
  useCreateResearchPopulation,
  useDeleteResearchPopulation,
} from "@/hooks/useResearchTaxonomy";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function CsvImportTopics() {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const generateTemplate = () => {
    const csv = ["name", "Trauma & Resilience"].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "research_topics_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { toast.error("CSV must have header + data rows"); return; }
      // skip header
      const names = lines.slice(1).map(l => l.replace(/"/g, "").trim()).filter(Boolean);
      if (!names.length) { toast.error("No valid topic names found"); return; }
      const rows = names.map(name => ({ name }));
      const { error } = await supabase.from("research_topics").insert(rows as any);
      if (error) { toast.error("Import failed: " + error.message); return; }
      toast.success(`${rows.length} topics imported`);
      queryClient.invalidateQueries({ queryKey: ["research-topics"] });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={generateTemplate}>
          <Download className="h-4 w-4 mr-1" /> Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Import CSV
        </Button>
      </div>
    </>
  );
}

export function AdminResearchTaxonomy() {
  const { data: topics = [], isLoading: loadingTopics } = useResearchTopics();
  const { data: populations = [], isLoading: loadingPops } = useResearchPopulations();
  const createTopic = useCreateResearchTopic();
  const deleteTopic = useDeleteResearchTopic();
  const createPop = useCreateResearchPopulation();
  const deletePop = useDeleteResearchPopulation();

  const [newTopic, setNewTopic] = useState("");
  const [newPop, setNewPop] = useState("");

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    createTopic.mutate(newTopic.trim(), { onSuccess: () => setNewTopic("") });
  };

  const handleAddPop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPop.trim()) return;
    createPop.mutate(newPop.trim(), { onSuccess: () => setNewPop("") });
  };

  if (loadingTopics || loadingPops) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Research Topics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Research Topics
            <Badge variant="secondary" className="ml-2">{topics.length}</Badge>
          </CardTitle>
          <CsvImportTopics />
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddTopic} className="flex gap-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="New topic name..."
              className="flex-1"
            />
            <Button type="submit" disabled={createTopic.isPending || !newTopic.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <div key={t.id} className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm">
                <span>{t.name}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove "{t.name}" from the research topics list?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTopic.mutate(t.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Populations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Target Populations
            <Badge variant="secondary" className="ml-2">{populations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddPop} className="flex gap-2">
            <Input
              value={newPop}
              onChange={(e) => setNewPop(e.target.value)}
              placeholder="New population name..."
              className="flex-1"
            />
            <Button type="submit" disabled={createPop.isPending || !newPop.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {populations.map((p) => (
              <div key={p.id} className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm">
                <span>{p.name}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Population</AlertDialogTitle>
                      <AlertDialogDescription>
                        Remove "{p.name}" from the target populations list?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePop.mutate(p.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
