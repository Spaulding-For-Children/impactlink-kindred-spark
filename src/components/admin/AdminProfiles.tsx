import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Trash2, Users, Search, GraduationCap, Microscope, Building2, Pencil, ChevronLeft, ChevronRight, Download, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import { CsvImportProfiles } from "./CsvImportProfiles";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const PROFILES_PER_PAGE = 10;

export function AdminProfiles() {
  const { allProfiles, isLoadingProfiles, deleteProfile, updateProfile } = useAdmin();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const filteredProfiles = allProfiles.filter((profile: any) => {
    const matchesSearch = profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || profile.profile_type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Reset to page 1 when filters change
  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / PROFILES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProfiles = useMemo(() => {
    const start = (safePage - 1) * PROFILES_PER_PAGE;
    return filteredProfiles.slice(start, start + PROFILES_PER_PAGE);
  }, [filteredProfiles, safePage]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginatedProfiles.map((p: any) => p.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id: string) => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      pageIds.forEach((id: string) => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  }, [paginatedProfiles, selectedIds]);

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from("profiles").delete().in("id", ids);
    setBulkDeleting(false);
    if (error) {
      toast.error("Bulk delete failed: " + error.message);
      return;
    }
    toast.success(`${ids.length} profile(s) deleted`);
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
    queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student": return <GraduationCap className="h-4 w-4" />;
      case "researcher": return <Microscope className="h-4 w-4" />;
      case "agency": return <Building2 className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const openEditDialog = (profile: any) => {
    setEditingProfile(profile);
    setEditForm({
      name: profile.name || "",
      email: profile.email || "",
      location: profile.location || "",
      bio: profile.bio || "",
      interests: profile.interests?.join(", ") || "",
      university: profile.university || "",
      major: profile.major || "",
      year: profile.year || "",
      title: profile.title || "",
      institution: profile.institution || "",
      department: profile.department || "",
      publications: profile.publications?.toString() || "0",
      agency_type: profile.agency_type || "",
      focus_areas: profile.focus_areas?.join(", ") || "",
      employees: profile.employees || "",
      founded: profile.founded || "",
      website: profile.website || "",
    });
  };

  const handleSave = () => {
    if (!editingProfile) return;
    const type = editingProfile.profile_type;
    const updates: any = {
      id: editingProfile.id,
      name: editForm.name,
      email: editForm.email,
      location: editForm.location,
      bio: editForm.bio,
      interests: editForm.interests.split(",").map((i: string) => i.trim()).filter(Boolean),
    };

    if (type === "student") {
      updates.university = editForm.university;
      updates.major = editForm.major;
      updates.year = editForm.year;
    } else if (type === "researcher") {
      updates.title = editForm.title;
      updates.institution = editForm.institution;
      updates.department = editForm.department;
      updates.publications = parseInt(editForm.publications) || 0;
    } else if (type === "agency") {
      updates.agency_type = editForm.agency_type;
      updates.focus_areas = editForm.focus_areas.split(",").map((i: string) => i.trim()).filter(Boolean);
      updates.employees = editForm.employees;
      updates.founded = editForm.founded;
      updates.website = editForm.website;
    }

    updateProfile.mutate(updates, {
      onSuccess: () => setEditingProfile(null),
    });
  };

  const exportCsv = () => {
    const headers = ["Name", "Email", "Type", "Location", "Bio", "Interests", "University", "Major", "Year", "Title", "Institution", "Department", "Publications", "Agency Type", "Focus Areas", "Employees", "Founded", "Website", "Created At"];
    const escape = (val: any) => {
      const s = String(val ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredProfiles.map((p: any) => [
      p.name, p.email, p.profile_type, p.location, p.bio,
      (p.interests || []).join("; "), p.university, p.major, p.year,
      p.title, p.institution, p.department, p.publications,
      p.agency_type, (p.focus_areas || []).join("; "), p.employees, p.founded, p.website,
      p.created_at ? format(new Date(p.created_at), "yyyy-MM-dd") : "",
    ].map(escape).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profiles-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingProfiles) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Users className="h-5 w-5" />
            Directory Profiles
            <Badge variant="secondary" className="ml-2">{allProfiles.length} total</Badge>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <CsvImportProfiles />
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={exportCsv}>
                <Download className="h-4 w-4" />Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="researcher">Researchers</SelectItem>
                <SelectItem value="agency">Agencies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProfiles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No profiles found</p>
          ) : (
            <>
              {/* Bulk actions bar */}
              <div className="flex items-center gap-3 py-2 px-1">
                <Checkbox
                  checked={paginatedProfiles.length > 0 && paginatedProfiles.every((p: any) => selectedIds.has(p.id))}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all on page"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
                </span>
                {selectedIds.size > 0 && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-auto flex items-center gap-1"
                      onClick={() => setBulkDeleteOpen(true)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete {selectedIds.size}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                      Clear
                    </Button>
                  </>
                )}
              </div>

              <div className="space-y-3">
                {paginatedProfiles.map((profile: any) => (
                  <div key={profile.id} className={`border rounded-lg p-4 flex items-center justify-between gap-4 ${selectedIds.has(profile.id) ? 'bg-muted/50 border-primary/30' : ''}`}>
                    <Checkbox
                      checked={selectedIds.has(profile.id)}
                      onCheckedChange={() => toggleSelect(profile.id)}
                      aria-label={`Select ${profile.name}`}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{profile.name}</h3>
                        <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                          {getTypeIcon(profile.profile_type)}
                          {profile.profile_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {format(new Date(profile.created_at), "MMM d, yyyy")}
                        {profile.location && ` • ${profile.location}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(profile)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {profile.name}'s profile? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProfile.mutate(profile.id)}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(safePage - 1) * PROFILES_PER_PAGE + 1}–{Math.min(safePage * PROFILES_PER_PAGE, filteredProfiles.length)} of {filteredProfiles.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "ellipsis" ? (
                          <span key={`e${i}`} className="px-1 text-muted-foreground">…</span>
                        ) : (
                          <Button key={p} variant={p === safePage ? "default" : "outline"} size="sm" className="min-w-[36px]" onClick={() => setCurrentPage(p)}>
                            {p}
                          </Button>
                        )
                      )}
                    <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(open) => !open && setEditingProfile(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingProfile && getTypeIcon(editingProfile.profile_type)}
              Edit {editingProfile?.profile_type} Profile
            </DialogTitle>
            <DialogDescription>Update profile information for {editingProfile?.name}</DialogDescription>
          </DialogHeader>

          {editingProfile && (
            <div className="space-y-4">
              {/* Common fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Interests (comma-separated)</Label>
                <Input value={editForm.interests} onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })} />
              </div>

              {/* Student-specific fields */}
              {editingProfile.profile_type === "student" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>University</Label>
                    <Input value={editForm.university} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Input value={editForm.major} onChange={(e) => setEditForm({ ...editForm, major: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={editForm.year} onValueChange={(v) => setEditForm({ ...editForm, year: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freshman">Freshman</SelectItem>
                        <SelectItem value="Sophomore">Sophomore</SelectItem>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="PhD">PhD Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Researcher-specific fields */}
              {editingProfile.profile_type === "researcher" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={editForm.institution} onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Publications</Label>
                    <Input type="number" value={editForm.publications} onChange={(e) => setEditForm({ ...editForm, publications: e.target.value })} />
                  </div>
                </div>
              )}

              {/* Agency-specific fields */}
              {editingProfile.profile_type === "agency" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Agency Type</Label>
                    <Select value={editForm.agency_type} onValueChange={(v) => setEditForm({ ...editForm, agency_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="nonprofit">Non-Profit</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Employees</Label>
                    <Select value={editForm.employees} onValueChange={(v) => setEditForm({ ...editForm, employees: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Focus Areas (comma-separated)</Label>
                    <Input value={editForm.focus_areas} onChange={(e) => setEditForm({ ...editForm, focus_areas: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Founded</Label>
                    <Input value={editForm.founded} onChange={(e) => setEditForm({ ...editForm, founded: e.target.value })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Website</Label>
                    <Input value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProfile(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
