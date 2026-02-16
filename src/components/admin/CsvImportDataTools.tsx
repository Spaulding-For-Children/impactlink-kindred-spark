import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CategoryType = "datasets" | "tools" | "ethics";

const TEMPLATES: Record<CategoryType, { headers: string[]; required: string[]; sample: string[] }> = {
  datasets: {
    headers: ["title", "description", "source_organization", "source_type", "data_format", "access_url", "documentation_url", "topics", "regions", "featured"],
    required: ["title", "description", "source_organization"],
    sample: ["National Child Abuse Statistics", "Annual statistics on child abuse and neglect", "ACF", "federal", "csv", "https://example.com/data", "https://example.com/docs", "child abuse;neglect", "U.S.;National", "false"],
  },
  tools: {
    headers: ["name", "full_name", "description", "tool_type", "category", "access_url", "documentation_url", "license_type", "featured"],
    required: ["name", "full_name", "description"],
    sample: ["SDQ", "Strengths and Difficulties Questionnaire", "Brief screening tool for children", "assessment", "Behavioral", "https://example.com", "https://example.com/docs", "open", "false"],
  },
  ethics: {
    headers: ["title", "description", "resource_type", "jurisdiction", "external_url", "tags", "featured"],
    required: ["title", "description"],
    sample: ["IRB Best Practices", "Guide for ethical review of child welfare research", "guide", "U.S.", "https://example.com", "ethics;irb;review", "false"],
  },
};

const TABLE_MAP: Record<CategoryType, string> = {
  datasets: "datasets",
  tools: "analysis_tools",
  ethics: "ethics_resources",
};

const QUERY_KEY_MAP: Record<CategoryType, string> = {
  datasets: "datasets",
  tools: "analysis_tools",
  ethics: "ethics_resources",
};

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  return lines.map(line => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
      else { current += char; }
    }
    result.push(current.trim());
    return result;
  });
}

function generateSampleCSV(category: CategoryType) {
  const t = TEMPLATES[category];
  const csv = [t.headers.join(","), t.sample.map(v => v.includes(",") || v.includes(";") ? `"${v}"` : v).join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${category}_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function buildRecord(category: CategoryType, headers: string[], row: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    const val = row[i] || "";
    if (!val) return;
    if (["topics", "regions", "tags"].includes(h)) {
      obj[h] = val.split(";").map(s => s.trim()).filter(Boolean);
    } else if (h === "featured") {
      obj[h] = val.toLowerCase() === "true";
    } else {
      obj[h] = val;
    }
  });
  return obj;
}

interface Props {
  category: CategoryType;
  label: string;
}

export const CsvImportDataTools = ({ category, label }: Props) => {
  const [open, setOpen] = useState(false);
  const [validRows, setValidRows] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const tmpl = TEMPLATES[category];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      if (rows.length < 2) { toast.error("CSV must have a header row and at least one data row"); return; }
      const headers = rows[0].map(h => h.toLowerCase().trim());
      const missing = tmpl.required.filter(r => !headers.includes(r));
      if (missing.length) { toast.error(`Missing required columns: ${missing.join(", ")}`); return; }
      const valid: Record<string, unknown>[] = [];
      const errs: string[] = [];
      rows.slice(1).forEach((row, i) => {
        const missingFields = tmpl.required.filter(r => !row[headers.indexOf(r)]?.trim());
        if (missingFields.length) { errs.push(`Row ${i + 2}: missing ${missingFields.join(", ")}`); return; }
        valid.push(buildRecord(category, headers, row));
      });
      setValidRows(valid);
      setErrors(errs);
      setOpen(true);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    setImporting(true);
    const { error } = await supabase.from(TABLE_MAP[category] as any).insert(validRows as any);
    setImporting(false);
    if (error) { toast.error("Import failed: " + error.message); return; }
    toast.success(`${validRows.length} ${label.toLowerCase()} imported`);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY_MAP[category]] });
    setOpen(false);
    setValidRows([]);
    setErrors([]);
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => generateSampleCSV(category)}>
          <Download className="h-4 w-4 mr-1" /> Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Import CSV
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import {label} Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">{validRows.length} valid rows</span>
              {errors.length > 0 && (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive ml-2" />
                  <span className="text-sm text-destructive">{errors.length} errors</span>
                </>
              )}
            </div>
            {errors.length > 0 && (
              <div className="bg-destructive/10 p-3 rounded text-sm space-y-1 max-h-32 overflow-y-auto">
                {errors.map((err, i) => <p key={i} className="text-destructive">{err}</p>)}
              </div>
            )}
            {validRows.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {validRows.slice(0, 10).map((row, i) => (
                  <div key={i} className="p-2 border rounded text-sm">
                    <span className="font-medium">{(row.title || row.name) as string}</span>
                    {row.source_type && <Badge variant="outline" className="ml-2 text-xs">{row.source_type as string}</Badge>}
                    {row.tool_type && <Badge variant="outline" className="ml-2 text-xs">{row.tool_type as string}</Badge>}
                    {row.resource_type && <Badge variant="outline" className="ml-2 text-xs">{row.resource_type as string}</Badge>}
                  </div>
                ))}
                {validRows.length > 10 && <p className="text-sm text-muted-foreground">...and {validRows.length - 10} more</p>}
              </div>
            )}
            <Button onClick={handleImport} disabled={validRows.length === 0 || importing} className="w-full">
              {importing ? "Importing..." : `Import ${validRows.length} ${label}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
