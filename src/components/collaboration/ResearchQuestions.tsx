import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, MapPin, Users, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useResearchQuestions, useCreateResearchQuestion, useCurrentProfile } from "@/hooks/useCollaboration";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const TOPICS = [
  "Trauma & Resilience",
  "Family Reunification",
  "Youth Justice",
  "Foster Care",
  "Kinship Care",
  "Child Protection",
  "Mental Health",
  "Education Outcomes",
];

const REGIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Africa",
  "Middle East",
  "Global",
];

const POPULATIONS = [
  "Children 0-5",
  "Children 6-12",
  "Adolescents 13-17",
  "Young Adults 18-24",
  "Families",
  "Foster Parents",
  "Kinship Caregivers",
];

export const ResearchQuestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile } = useCurrentProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{
    topic?: string;
    region?: string;
    population?: string;
    status?: string;
  }>({});

  const { data: questions, isLoading } = useResearchQuestions(filters);
  const createQuestion = useCreateResearchQuestion();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topics: [] as string[],
    regions: [] as string[],
    populations: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast({
        title: "Profile required",
        description: "Please create a profile first to post research questions.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createQuestion.mutateAsync({
        author_id: profile.id,
        ...formData,
      });
      toast({
        title: "Question posted!",
        description: "Your research question has been published.",
      });
      setDialogOpen(false);
      setFormData({ title: "", description: "", topics: [], regions: [], populations: [] });
    } catch {
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.topic || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, topic: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="w-[160px]">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.region || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, region: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="w-[160px]">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.population || "all"}
            onValueChange={(v) => setFilters((f) => ({ ...f, population: v === "all" ? undefined : v }))}
          >
            <SelectTrigger className="w-[160px]">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Population" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Populations</SelectItem>
              {POPULATIONS.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {user && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a Research Question</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                    placeholder="What research question are you exploring?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Provide context, methodology considerations, and what kind of collaborators you're looking for..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Topics (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => (
                      <Badge
                        key={topic}
                        variant={formData.topics.includes(topic) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() =>
                          toggleArrayItem(formData.topics, topic, (arr) =>
                            setFormData((f) => ({ ...f, topics: arr }))
                          )
                        }
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Regions</Label>
                  <div className="flex flex-wrap gap-2">
                    {REGIONS.map((region) => (
                      <Badge
                        key={region}
                        variant={formData.regions.includes(region) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() =>
                          toggleArrayItem(formData.regions, region, (arr) =>
                            setFormData((f) => ({ ...f, regions: arr }))
                          )
                        }
                      >
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Target Populations</Label>
                  <div className="flex flex-wrap gap-2">
                    {POPULATIONS.map((pop) => (
                      <Badge
                        key={pop}
                        variant={formData.populations.includes(pop) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() =>
                          toggleArrayItem(formData.populations, pop, (arr) =>
                            setFormData((f) => ({ ...f, populations: arr }))
                          )
                        }
                      >
                        {pop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createQuestion.isPending}>
                  {createQuestion.isPending ? "Posting..." : "Post Question"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : questions?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No research questions found. Be the first to post one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {questions?.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{question.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={question.author?.avatar_url || undefined} />
                          <AvatarFallback>{question.author?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <span>{question.author?.name}</span>
                        <span>•</span>
                        <span className="capitalize">{question.author?.profile_type}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <Badge variant={question.status === "open" ? "default" : "secondary"}>
                      {question.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{question.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {question.topics?.map((t) => (
                      <Badge key={t} variant="outline" className="bg-sage/10 text-sage border-sage/20">
                        {t}
                      </Badge>
                    ))}
                    {question.regions?.map((r) => (
                      <Badge key={r} variant="outline" className="bg-amber/10 text-amber border-amber/20">
                        <MapPin className="w-3 h-3 mr-1" />
                        {r}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
