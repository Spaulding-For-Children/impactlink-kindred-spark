import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Database, FileText, Shield } from "lucide-react";
import {
  useDatasets, useAnalysisTools, useEthicsResources,
  useUpsertDataset, useDeleteDataset,
  useUpsertAnalysisTool, useDeleteAnalysisTool,
  useUpsertEthicsResource, useDeleteEthicsResource,
  type Dataset, type AnalysisTool, type EthicsResource,
} from "@/hooks/useDataTools";

// --- Dataset Form ---
const DatasetForm = ({ dataset, onClose }: { dataset?: Dataset; onClose: () => void }) => {
  const [form, setForm] = useState({
    title: dataset?.title || "",
    description: dataset?.description || "",
    source_organization: dataset?.source_organization || "",
    source_type: dataset?.source_type || "federal",
    data_format: dataset?.data_format || "csv",
    access_url: dataset?.access_url || "",
    documentation_url: dataset?.documentation_url || "",
    topics: dataset?.topics?.join(", ") || "",
    regions: dataset?.regions?.join(", ") || "",
    featured: dataset?.featured || false,
  });
  const upsert = useUpsertDataset();

  const handleSubmit = () => {
    upsert.mutate({
      ...(dataset?.id ? { id: dataset.id } : {}),
      title: form.title,
      description: form.description,
      source_organization: form.source_organization,
      source_type: form.source_type,
      data_format: form.data_format || null,
      access_url: form.access_url || null,
      documentation_url: form.documentation_url || null,
      topics: form.topics ? form.topics.split(",").map(s => s.trim()).filter(Boolean) : [],
      regions: form.regions ? form.regions.split(",").map(s => s.trim()).filter(Boolean) : [],
      featured: form.featured,
    }, { onSuccess: onClose });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      <Input placeholder="Source Organization" value={form.source_organization} onChange={e => setForm(p => ({ ...p, source_organization: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Source Type (federal, international, ngo)" value={form.source_type} onChange={e => setForm(p => ({ ...p, source_type: e.target.value }))} />
        <Input placeholder="Data Format (csv, json, api)" value={form.data_format} onChange={e => setForm(p => ({ ...p, data_format: e.target.value }))} />
      </div>
      <Input placeholder="Access URL" value={form.access_url} onChange={e => setForm(p => ({ ...p, access_url: e.target.value }))} />
      <Input placeholder="Documentation URL" value={form.documentation_url} onChange={e => setForm(p => ({ ...p, documentation_url: e.target.value }))} />
      <Input placeholder="Topics (comma-separated)" value={form.topics} onChange={e => setForm(p => ({ ...p, topics: e.target.value }))} />
      <Input placeholder="Regions (comma-separated)" value={form.regions} onChange={e => setForm(p => ({ ...p, regions: e.target.value }))} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
        Featured
      </label>
      <Button onClick={handleSubmit} disabled={!form.title || !form.description || !form.source_organization || upsert.isPending} className="w-full">
        {dataset ? "Update" : "Create"} Dataset
      </Button>
    </div>
  );
};

// --- Tool Form ---
const ToolForm = ({ tool, onClose }: { tool?: AnalysisTool; onClose: () => void }) => {
  const [form, setForm] = useState({
    name: tool?.name || "",
    full_name: tool?.full_name || "",
    description: tool?.description || "",
    tool_type: tool?.tool_type || "assessment",
    category: tool?.category || "General",
    access_url: tool?.access_url || "",
    documentation_url: tool?.documentation_url || "",
    license_type: tool?.license_type || "open",
    featured: tool?.featured || false,
  });
  const upsert = useUpsertAnalysisTool();

  const handleSubmit = () => {
    upsert.mutate({
      ...(tool?.id ? { id: tool.id } : {}),
      name: form.name,
      full_name: form.full_name,
      description: form.description,
      tool_type: form.tool_type,
      category: form.category,
      access_url: form.access_url || null,
      documentation_url: form.documentation_url || null,
      license_type: form.license_type || null,
      featured: form.featured,
    }, { onSuccess: onClose });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Short Name (e.g. SDQ)" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <Input placeholder="Category" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
      </div>
      <Input placeholder="Full Name" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
      <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Tool Type" value={form.tool_type} onChange={e => setForm(p => ({ ...p, tool_type: e.target.value }))} />
        <Input placeholder="License Type" value={form.license_type} onChange={e => setForm(p => ({ ...p, license_type: e.target.value }))} />
      </div>
      <Input placeholder="Access URL" value={form.access_url} onChange={e => setForm(p => ({ ...p, access_url: e.target.value }))} />
      <Input placeholder="Documentation URL" value={form.documentation_url} onChange={e => setForm(p => ({ ...p, documentation_url: e.target.value }))} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
        Featured
      </label>
      <Button onClick={handleSubmit} disabled={!form.name || !form.full_name || !form.description || upsert.isPending} className="w-full">
        {tool ? "Update" : "Create"} Tool
      </Button>
    </div>
  );
};

// --- Ethics Form ---
const EthicsForm = ({ resource, onClose }: { resource?: EthicsResource; onClose: () => void }) => {
  const [form, setForm] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    resource_type: resource?.resource_type || "guide",
    jurisdiction: resource?.jurisdiction || "U.S.",
    external_url: resource?.external_url || "",
    tags: resource?.tags?.join(", ") || "",
    featured: resource?.featured || false,
  });
  const upsert = useUpsertEthicsResource();

  const handleSubmit = () => {
    upsert.mutate({
      ...(resource?.id ? { id: resource.id } : {}),
      title: form.title,
      description: form.description,
      resource_type: form.resource_type,
      jurisdiction: form.jurisdiction || null,
      external_url: form.external_url || null,
      tags: form.tags ? form.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
      featured: form.featured,
    }, { onSuccess: onClose });
  };

  return (
    <div className="space-y-4">
      <Input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Resource Type (guide, template, checklist)" value={form.resource_type} onChange={e => setForm(p => ({ ...p, resource_type: e.target.value }))} />
        <Input placeholder="Jurisdiction" value={form.jurisdiction} onChange={e => setForm(p => ({ ...p, jurisdiction: e.target.value }))} />
      </div>
      <Input placeholder="External URL" value={form.external_url} onChange={e => setForm(p => ({ ...p, external_url: e.target.value }))} />
      <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
        Featured
      </label>
      <Button onClick={handleSubmit} disabled={!form.title || !form.description || upsert.isPending} className="w-full">
        {resource ? "Update" : "Create"} Ethics Resource
      </Button>
    </div>
  );
};

// --- Main Admin Component ---
export const AdminDataTools = () => {
  const { data: datasets = [], isLoading: loadingDatasets } = useDatasets();
  const { data: tools = [], isLoading: loadingTools } = useAnalysisTools();
  const { data: ethics = [], isLoading: loadingEthics } = useEthicsResources();
  const deleteDataset = useDeleteDataset();
  const deleteTool = useDeleteAnalysisTool();
  const deleteEthics = useDeleteEthicsResource();

  const [editDataset, setEditDataset] = useState<Dataset | undefined>();
  const [editTool, setEditTool] = useState<AnalysisTool | undefined>();
  const [editEthics, setEditEthics] = useState<EthicsResource | undefined>();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="datasets">
        <TabsList className="mb-4">
          <TabsTrigger value="datasets"><Database className="h-4 w-4 mr-1" /> Datasets ({datasets.length})</TabsTrigger>
          <TabsTrigger value="tools"><FileText className="h-4 w-4 mr-1" /> Tools ({tools.length})</TabsTrigger>
          <TabsTrigger value="ethics"><Shield className="h-4 w-4 mr-1" /> Ethics ({ethics.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <Dialog open={openDialog === "dataset"} onOpenChange={o => { if (!o) { setOpenDialog(null); setEditDataset(undefined); } }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditDataset(undefined); setOpenDialog("dataset"); }}><Plus className="h-4 w-4 mr-2" /> Add Dataset</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editDataset ? "Edit" : "Add"} Dataset</DialogTitle></DialogHeader>
              <DatasetForm dataset={editDataset} onClose={() => { setOpenDialog(null); setEditDataset(undefined); }} />
            </DialogContent>
          </Dialog>

          {loadingDatasets ? <p>Loading...</p> : datasets.map(d => (
            <Card key={d.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div>
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{d.source_organization} · <Badge variant="outline" className="text-xs capitalize">{d.source_type}</Badge></p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditDataset(d); setOpenDialog("dataset"); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteDataset.mutate(d.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Dialog open={openDialog === "tool"} onOpenChange={o => { if (!o) { setOpenDialog(null); setEditTool(undefined); } }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditTool(undefined); setOpenDialog("tool"); }}><Plus className="h-4 w-4 mr-2" /> Add Tool</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editTool ? "Edit" : "Add"} Analysis Tool</DialogTitle></DialogHeader>
              <ToolForm tool={editTool} onClose={() => { setOpenDialog(null); setEditTool(undefined); }} />
            </DialogContent>
          </Dialog>

          {loadingTools ? <p>Loading...</p> : tools.map(t => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div>
                  <CardTitle className="text-base"><span className="text-amber">{t.name}</span> — {t.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t.category} · {t.tool_type}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditTool(t); setOpenDialog("tool"); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteTool.mutate(t.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ethics" className="space-y-4">
          <Dialog open={openDialog === "ethics"} onOpenChange={o => { if (!o) { setOpenDialog(null); setEditEthics(undefined); } }}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditEthics(undefined); setOpenDialog("ethics"); }}><Plus className="h-4 w-4 mr-2" /> Add Ethics Resource</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editEthics ? "Edit" : "Add"} Ethics Resource</DialogTitle></DialogHeader>
              <EthicsForm resource={editEthics} onClose={() => { setOpenDialog(null); setEditEthics(undefined); }} />
            </DialogContent>
          </Dialog>

          {loadingEthics ? <p>Loading...</p> : ethics.map(e => (
            <Card key={e.id}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div>
                  <CardTitle className="text-base">{e.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{e.resource_type} · {e.jurisdiction}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setEditEthics(e); setOpenDialog("ethics"); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteEthics.mutate(e.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
