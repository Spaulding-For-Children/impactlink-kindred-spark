import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const VALID_EVENT_TYPES = ["workshop", "webinar", "conference", "networking", "training"];

const HEADERS = [
  "title", "description", "event_type", "start_date", "end_date",
  "location", "is_virtual", "virtual_link", "host_name", "host_organization",
  "max_attendees", "featured", "tags",
];

const REQUIRED = ["title", "description", "event_type", "start_date", "end_date"];

const SAMPLE = [
  "Child Welfare Research Workshop",
  "Annual workshop on evidence-based child welfare practices",
  "workshop",
  "2026-06-15T09:00:00Z",
  "2026-06-15T17:00:00Z",
  "Washington, DC",
  "false",
  "",
  "Dr. Jane Smith",
  "National Child Welfare Association",
  "100",
  "true",
  "research;child welfare;evidence-based",
];

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

function generateTemplate() {
  const csv = [
    HEADERS.join(","),
    SAMPLE.map(v => v.includes(",") || v.includes(";") ? `"${v}"` : v).join(","),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "events_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function buildRecord(headers: string[], row: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    const val = row[i] || "";
    if (!val) return;
    if (h === "tags") {
      obj[h] = val.split(";").map(s => s.trim()).filter(Boolean);
    } else if (h === "is_virtual" || h === "featured") {
      obj[h] = val.toLowerCase() === "true";
    } else if (h === "max_attendees") {
      const n = parseInt(val);
      if (!isNaN(n)) obj[h] = n;
    } else {
      obj[h] = val;
    }
  });
  return obj;
}

export const CsvImportEvents = () => {
  const [open, setOpen] = useState(false);
  const [validRows, setValidRows] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target?.result as string);
      if (rows.length < 2) { toast.error("CSV must have a header row and at least one data row"); return; }
      const headers = rows[0].map(h => h.toLowerCase().trim());
      const missing = REQUIRED.filter(r => !headers.includes(r));
      if (missing.length) { toast.error(`Missing required columns: ${missing.join(", ")}`); return; }
      const valid: Record<string, unknown>[] = [];
      const errs: string[] = [];
      rows.slice(1).forEach((row, i) => {
        const missingFields = REQUIRED.filter(r => !row[headers.indexOf(r)]?.trim());
        if (missingFields.length) { errs.push(`Row ${i + 2}: missing ${missingFields.join(", ")}`); return; }
        const eventType = row[headers.indexOf("event_type")]?.trim().toLowerCase();
        if (!VALID_EVENT_TYPES.includes(eventType)) {
          errs.push(`Row ${i + 2}: invalid event_type "${eventType}" (must be ${VALID_EVENT_TYPES.join(", ")})`);
          return;
        }
        valid.push(buildRecord(headers, row));
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
    const { error } = await supabase.from("events").insert(validRows as any);
    setImporting(false);
    if (error) { toast.error("Import failed: " + error.message); return; }
    toast.success(`${validRows.length} event(s) imported`);
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    setOpen(false);
    setValidRows([]);
    setErrors([]);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Events Preview</DialogTitle>
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
                  <div key={i} className="p-2 border rounded text-sm flex items-center gap-2">
                    <span className="font-medium">{row.title as string}</span>
                    <Badge variant="outline" className="text-xs">{row.event_type as string}</Badge>
                    {row.start_date && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(row.start_date as string).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
                {validRows.length > 10 && <p className="text-sm text-muted-foreground">...and {validRows.length - 10} more</p>}
              </div>
            )}
            <Button onClick={handleImport} disabled={validRows.length === 0 || importing} className="w-full">
              {importing ? "Importing..." : `Import ${validRows.length} Event${validRows.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
