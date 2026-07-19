import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Sparkles, Download, FileText, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { marked } from "marked";

const PRINT_CSS = `body{font-family:Georgia,'Times New Roman',serif;max-width:780px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}
h1{border-bottom:2px solid #333;padding-bottom:.3rem}
h2{margin-top:2rem;color:#111;border-bottom:1px solid #ddd;padding-bottom:.2rem}
h3{margin-top:1.5rem;color:#333}
hr{margin:2.5rem 0;border:0;border-top:1px solid #ccc}
ul,ol{margin:.5rem 0 1rem 1.5rem}
li{margin:.25rem 0}
blockquote{border-left:4px solid #ccc;margin:1rem 0;padding:.25rem 1rem;color:#555;background:#f9f9f9}
code{background:#f4f4f4;padding:1px 4px;border-radius:3px;font-family:Consolas,monospace}
pre{background:#f4f4f4;padding:.75rem;border-radius:4px;overflow:auto}
table{border-collapse:collapse;margin:1rem 0;width:100%}
th,td{border:1px solid #ccc;padding:.4rem .6rem;text-align:left}
th{background:#f0f0f0}
p{margin:.5rem 0}`;

function renderSectionsHtml(items: RfpSection[]) {
  return items
    .map((s) => {
      const body = s.content_markdown?.trim()
        ? marked.parse(s.content_markdown, { async: false }) as string
        : "<p><em>(empty)</em></p>";
      return `<section><h2>${s.title}</h2>${body}</section>`;
    })
    .join('<hr/>');
}

interface RfpSection {
  id: string;
  slug: string;
  group_name: string;
  title: string;
  content_markdown: string;
  sort_order: number;
  is_custom: boolean;
}

export function AdminRfpPackage() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [extraContext, setExtraContext] = useState("");
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newGroup, setNewGroup] = useState("Additional");

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["rfp_sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfp_sections" as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as unknown as RfpSection[];
    },
  });

  const grouped = useMemo(() => {
    const g: Record<string, RfpSection[]> = {};
    sections.forEach((s) => {
      (g[s.group_name] ||= []).push(s);
    });
    return g;
  }, [sections]);

  const selected = sections.find((s) => s.id === selectedId) || null;

  const saveMut = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("rfp_sections" as any)
        .update({ content_markdown: content, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rfp_sections"] });
      toast.success("Section saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addMut = useMutation({
    mutationFn: async () => {
      if (!newTitle.trim()) throw new Error("Title required");
      const maxOrder = Math.max(0, ...sections.map((s) => s.sort_order));
      const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60) + "-" + Date.now();
      const { error } = await supabase.from("rfp_sections" as any).insert({
        slug, title: newTitle, group_name: newGroup, sort_order: maxOrder + 1, is_custom: true, content_markdown: "",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rfp_sections"] });
      setNewTitle("");
      toast.success("Section added");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rfp_sections" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rfp_sections"] });
      setSelectedId(null); setDraft("");
      toast.success("Section deleted");
    },
  });

  async function generateOne(sectionId: string) {
    setGeneratingId(sectionId);
    try {
      const { data, error } = await supabase.functions.invoke("generate-rfp-section", {
        body: { section_id: sectionId, extra_context: extraContext || undefined },
      });
      if (error) throw error;
      if ((data as any)?.content) {
        setDraft((data as any).content);
      }
      qc.invalidateQueries({ queryKey: ["rfp_sections"] });
      toast.success("Draft generated");
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally {
      setGeneratingId(null);
    }
  }

  async function generateAll() {
    setBulkGenerating(true);
    const empty = sections.filter((s) => !s.content_markdown?.trim());
    let done = 0;
    for (const s of empty) {
      try {
        await supabase.functions.invoke("generate-rfp-section", { body: { section_id: s.id } });
        done++;
        toast.message(`Generated ${done}/${empty.length}: ${s.title}`);
      } catch (e: any) {
        toast.error(`Failed: ${s.title}`);
      }
    }
    qc.invalidateQueries({ queryKey: ["rfp_sections"] });
    setBulkGenerating(false);
    toast.success(`Bulk generation complete (${done}/${empty.length})`);
  }

  function selectSection(s: RfpSection) {
    setSelectedId(s.id);
    setDraft(s.content_markdown || "");
  }

  function exportMarkdown(scope: "all" | "single") {
    const items = scope === "single" && selected ? [selected] : sections;
    const md = items.map((s) => s.content_markdown || `### ${s.title}\n\n_(empty)_`).join("\n\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = scope === "single" && selected ? `${selected.slug}.md` : "rfp-package.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportWord(scope: "all" | "single") {
    const items = scope === "single" && selected ? [selected] : sections;
    const body = items
      .map((s) => `<h2>${s.title}</h2>${(s.content_markdown || "").replace(/\n/g, "<br/>")}`)
      .join("<hr/>");
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>RFP Package</title></head><body>${body}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = scope === "single" && selected ? `${selected.slug}.doc` : "rfp-package.doc";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf(scope: "all" | "single") {
    const items = scope === "single" && selected ? [selected] : sections;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>RFP Package</title>
      <style>body{font-family:Georgia,serif;max-width:780px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222}
      h1{border-bottom:2px solid #333}h2{margin-top:2rem;color:#111}hr{margin:2rem 0;border:0;border-top:1px solid #ccc}</style>
      </head><body><h1>RFP / NOFO Grant Package</h1>${items.map((s) => `<h2>${s.title}</h2><div>${(s.content_markdown || "").replace(/\n/g, "<br/>")}</div>`).join("<hr/>")}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>RFP / NOFO Grant Package</span>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => exportMarkdown("all")}><Download className="h-4 w-4 mr-1" />MD</Button>
              <Button size="sm" variant="outline" onClick={() => exportWord("all")}><FileText className="h-4 w-4 mr-1" />Word</Button>
              <Button size="sm" variant="outline" onClick={() => exportPdf("all")}><FileText className="h-4 w-4 mr-1" />PDF</Button>
              <Button size="sm" onClick={generateAll} disabled={bulkGenerating}>
                {bulkGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                Generate All Empty
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Full narrative sections for grant/RFP submissions. AI drafts pull from platform taxonomy, features, and analytics. Edit any section and export the combined package or individual sections as Markdown, Word, or PDF.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Sections ({sections.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="New section title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Button size="sm" onClick={() => addMut.mutate()} disabled={addMut.isPending}><Plus className="h-4 w-4" /></Button>
            </div>
            <Input placeholder="Group" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
            <ScrollArea className="h-[560px] pr-2">
              {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-3">
                  <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">{group}</div>
                  {items.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectSection(s)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded hover:bg-muted flex items-center justify-between gap-2 ${selectedId === s.id ? "bg-muted font-medium" : ""}`}
                    >
                      <span className="truncate">{s.title}</span>
                      {s.content_markdown?.trim() ? <Badge variant="secondary" className="text-xs shrink-0">✓</Badge> : <Badge variant="outline" className="text-xs shrink-0">empty</Badge>}
                    </button>
                  ))}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{selected ? selected.title : "Select a section"}</span>
              {selected && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportMarkdown("single")}>MD</Button>
                  <Button size="sm" variant="outline" onClick={() => exportWord("single")}>Word</Button>
                  <Button size="sm" variant="outline" onClick={() => exportPdf("single")}>PDF</Button>
                  {selected.is_custom && (
                    <Button size="sm" variant="destructive" onClick={() => deleteMut.mutate(selected.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected ? (
              <>
                <Textarea
                  placeholder="Optional extra guidance for AI (audience, funder, emphasis)…"
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value)}
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => generateOne(selected.id)}
                    disabled={generatingId === selected.id}
                  >
                    {generatingId === selected.id ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                    {selected.content_markdown ? "Regenerate" : "Generate Draft"}
                  </Button>
                  <Button variant="secondary" onClick={() => saveMut.mutate({ id: selected.id, content: draft })} disabled={saveMut.isPending}>
                    <Save className="h-4 w-4 mr-1" />Save
                  </Button>
                </div>
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={26}
                  className="font-mono text-sm"
                  placeholder="Section content (Markdown)…"
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Choose a section from the left to view, edit, or generate its narrative.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
