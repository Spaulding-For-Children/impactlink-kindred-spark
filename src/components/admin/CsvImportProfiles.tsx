import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, AlertCircle, CheckCircle2, GraduationCap, Microscope, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ProfileType = "student" | "researcher" | "agency";

const TEMPLATES: Record<ProfileType, { headers: string[]; required: string[]; sample: string[] }> = {
  student: {
    headers: ["name", "email", "user_id", "university", "major", "year", "location", "bio", "interests", "website"],
    required: ["name", "email", "user_id"],
    sample: [
      "Jane Doe", "jane@university.edu", "00000000-0000-0000-0000-000000000001",
      "Harvard University", "Social Work", "Graduate",
      "Boston, MA", "Researching child welfare outcomes",
      "child welfare;foster care;policy", "https://janedoe.com",
    ],
  },
  researcher: {
    headers: ["name", "email", "user_id", "title", "institution", "department", "publications", "location", "bio", "interests", "website"],
    required: ["name", "email", "user_id"],
    sample: [
      "Dr. John Smith", "jsmith@mit.edu", "00000000-0000-0000-0000-000000000002",
      "Associate Professor", "MIT", "Social Sciences", "42",
      "Cambridge, MA", "Expert in child development research",
      "child development;policy analysis;longitudinal studies", "https://jsmith.edu",
    ],
  },
  agency: {
    headers: ["name", "email", "user_id", "agency_type", "employees", "founded", "location", "bio", "focus_areas", "website"],
    required: ["name", "email", "user_id"],
    sample: [
      "Child Welfare Alliance", "info@cwa.org", "00000000-0000-0000-0000-000000000003",
      "nonprofit", "51-200", "1995",
      "Washington, DC", "National organization advancing child welfare",
      "policy advocacy;training;research", "https://cwa.org",
    ],
  },
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

function generateTemplate(profileType: ProfileType) {
  const t = TEMPLATES[profileType];
  const csv = [
    t.headers.join(","),
    t.sample.map(v => v.includes(",") || v.includes(";") ? `"${v}"` : v).join(","),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${profileType}_profiles_template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function buildRecord(profileType: ProfileType, headers: string[], row: string[]): Record<string, unknown> {
  const obj: Record<string, unknown> = { profile_type: profileType };
  headers.forEach((h, i) => {
    const val = row[i] || "";
    if (!val) return;
    if (["interests", "focus_areas"].includes(h)) {
      obj[h] = val.split(";").map(s => s.trim()).filter(Boolean);
    } else if (h === "publications") {
      obj[h] = parseInt(val) || 0;
    } else {
      obj[h] = val;
    }
  });
  return obj;
}

const TYPE_LABELS: Record<ProfileType, string> = {
  student: "Students",
  researcher: "Researchers",
  agency: "Agencies",
};

const TYPE_ICONS: Record<ProfileType, React.ReactNode> = {
  student: <GraduationCap className="h-4 w-4" />,
  researcher: <Microscope className="h-4 w-4" />,
  agency: <Building2 className="h-4 w-4" />,
};

export const CsvImportProfiles = () => {
  const [selectedType, setSelectedType] = useState<ProfileType>("student");
  const [open, setOpen] = useState(false);
  const [validRows, setValidRows] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importType, setImportType] = useState<ProfileType>("student");
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tmpl = TEMPLATES[selectedType];
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
        valid.push(buildRecord(selectedType, headers, row));
      });
      setValidRows(valid);
      setErrors(errs);
      setImportType(selectedType);
      setOpen(true);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleImport = async () => {
    setImporting(true);
    const { error } = await supabase.from("profiles").insert(validRows as any);
    setImporting(false);
    if (error) { toast.error("Import failed: " + error.message); return; }
    toast.success(`${validRows.length} ${TYPE_LABELS[importType].toLowerCase()} imported`);
    queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    setOpen(false);
    setValidRows([]);
    setErrors([]);
  };

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
      <div className="flex items-center gap-2">
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ProfileType)}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="researcher">Researchers</SelectItem>
            <SelectItem value="agency">Agencies</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => generateTemplate(selectedType)}>
          <Download className="h-4 w-4 mr-1" /> Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4 mr-1" /> Import CSV
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {TYPE_ICONS[importType]}
              Import {TYPE_LABELS[importType]} Preview
            </DialogTitle>
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
                    <span className="font-medium">{row.name as string}</span>
                    <span className="text-muted-foreground text-xs">{row.email as string}</span>
                    {row.university && <Badge variant="outline" className="text-xs">{row.university as string}</Badge>}
                    {row.institution && <Badge variant="outline" className="text-xs">{row.institution as string}</Badge>}
                    {row.agency_type && <Badge variant="outline" className="text-xs">{row.agency_type as string}</Badge>}
                  </div>
                ))}
                {validRows.length > 10 && <p className="text-sm text-muted-foreground">...and {validRows.length - 10} more</p>}
              </div>
            )}
            <div className="bg-muted/50 p-3 rounded text-xs text-muted-foreground">
              <strong>Note:</strong> Each row requires a valid <code>user_id</code> (UUID) that corresponds to an authenticated user. 
              Profiles without a matching user account will fail to import.
            </div>
            <Button onClick={handleImport} disabled={validRows.length === 0 || importing} className="w-full">
              {importing ? "Importing..." : `Import ${validRows.length} ${TYPE_LABELS[importType]}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
