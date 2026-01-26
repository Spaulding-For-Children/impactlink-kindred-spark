import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, GraduationCap, FlaskConical, Building, Globe, Check, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchSubmissions, useMySubmissions, useCreateSubmission, ResearchSubmission } from "@/hooks/useSubmissions";
import { useCurrentProfile } from "@/hooks/useCollaboration";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const SUBMISSION_TYPES = [
  { value: "student_project", label: "Student Project", icon: GraduationCap, description: "Capstone, thesis, or dissertation" },
  { value: "faculty_research", label: "Faculty Research", icon: FlaskConical, description: "Publications and studies" },
  { value: "agency_report", label: "Agency Report", icon: Building, description: "Impact assessments and evaluations" },
  { value: "global_showcase", label: "Global Showcase", icon: Globe, description: "International research" },
] as const;

const STATUS_BADGES: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { color: "bg-amber/20 text-amber", icon: Clock },
  approved: { color: "bg-sage/20 text-sage", icon: Check },
  rejected: { color: "bg-destructive/20 text-destructive", icon: AlertCircle },
};

export const ResearchSubmissions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile } = useCurrentProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("browse");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: submissions, isLoading } = useResearchSubmissions({ type: selectedType });
  const { data: mySubmissions, isLoading: loadingMySubmissions } = useMySubmissions();
  const createSubmission = useCreateSubmission();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    submissionType: "" as typeof SUBMISSION_TYPES[number]["value"] | "",
    tags: "",
    file: null as File | null,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
        return;
      }
      setFormData((f) => ({ ...f, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !formData.file || !formData.submissionType) {
      toast({ title: "Missing information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      await createSubmission.mutateAsync({
        file: formData.file,
        title: formData.title,
        description: formData.description,
        submissionType: formData.submissionType,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        authorId: profile.id,
      });
      toast({ title: "Submitted!", description: "Your research has been submitted for review." });
      setDialogOpen(false);
      setFormData({ title: "", description: "", submissionType: "", tags: "", file: null });
      setActiveTab("my-submissions");
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Research Showcase</h2>
            <p className="text-muted-foreground">
              Browse community research or submit your own work
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <TabsList>
                <TabsTrigger value="browse">Browse</TabsTrigger>
                <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
              </TabsList>
            )}
            {user && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Research
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Submit Your Research</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Submission Type Selection */}
                    <div className="space-y-3">
                      <Label>Submission Type *</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {SUBMISSION_TYPES.map((type) => (
                          <div
                            key={type.value}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.submissionType === type.value
                                ? "border-sage bg-sage/5"
                                : "border-border hover:border-sage/50"
                            }`}
                            onClick={() => setFormData((f) => ({ ...f, submissionType: type.value }))}
                          >
                            <type.icon className={`w-6 h-6 mb-2 ${formData.submissionType === type.value ? "text-sage" : "text-muted-foreground"}`} />
                            <h4 className="font-medium text-sm">{type.label}</h4>
                            <p className="text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Enter the title of your research"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Provide a brief summary of your research..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData((f) => ({ ...f, tags: e.target.value }))}
                        placeholder="e.g., foster care, trauma, policy"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label>Upload File * (PDF, DOC, DOCX - Max 20MB)</Label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                      />
                      {formData.file ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/30">
                          <FileText className="w-8 h-8 text-sage" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{formData.file.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(formData.file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setFormData((f) => ({ ...f, file: null }))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-sage/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">Click to select a file</p>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={createSubmission.isPending}>
                      {createSubmission.isPending ? "Uploading..." : "Submit for Review"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <TabsContent value="browse" className="mt-0">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
            >
              All
            </Button>
            {SUBMISSION_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
              >
                <type.icon className="w-4 h-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : submissions?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your research!</p>
                {user && (
                  <Button onClick={() => setDialogOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Research
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions?.map((submission, index) => {
                const typeInfo = SUBMISSION_TYPES.find((t) => t.value === submission.submission_type);
                const TypeIcon = typeInfo?.icon || FileText;

                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-md transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                            <TypeIcon className="w-6 h-6 text-sage" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Badge variant="secondary" className="mb-2">{typeInfo?.label}</Badge>
                            <h3 className="font-semibold mb-2 line-clamp-1">{submission.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {submission.description}
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={submission.author?.avatar_url || undefined} />
                                <AvatarFallback>{submission.author?.name?.[0]}</AvatarFallback>
                              </Avatar>
                              <span>{submission.author?.name}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}</span>
                            </div>
                            {submission.tags && submission.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {submission.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                          <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-submissions" className="mt-0">
          {!user ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Sign in to view your submissions</p>
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          ) : loadingMySubmissions ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : mySubmissions?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No submissions yet</h3>
                <p className="text-muted-foreground mb-4">Share your research with the community!</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Research
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mySubmissions?.map((submission) => {
                const typeInfo = SUBMISSION_TYPES.find((t) => t.value === submission.submission_type);
                const statusInfo = STATUS_BADGES[submission.status];
                const StatusIcon = statusInfo?.icon || Clock;

                return (
                  <Card key={submission.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-sage" />
                          <div>
                            <h3 className="font-semibold">{submission.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {typeInfo?.label} • {formatFileSize(submission.file_size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={statusInfo?.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
