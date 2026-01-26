import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink, User, Calendar, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResources, useResourceCategories, useToggleBookmark, useBookmarks } from "@/hooks/useResources";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const FORMAT_LABELS: Record<string, { label: string; color: string }> = {
  book: { label: "Book", color: "bg-indigo-100 text-indigo-700" },
  article: { label: "Journal Article", color: "bg-emerald-100 text-emerald-700" },
  report: { label: "Report", color: "bg-sky-100 text-sky-700" },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Foundational Texts": "Essential books that form the foundation of child welfare knowledge",
  "Recent Journal Articles": "Latest peer-reviewed research from top journals",
  "International Reports": "Global perspectives from leading organizations",
};

export const ReadingLists = () => {
  const [selectedCategory, setSelectedCategory] = useState("Foundational Texts");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: resources, isLoading } = useResources({
    type: "reading",
    category: selectedCategory,
  });
  const { data: categories } = useResourceCategories("reading");
  const { data: bookmarks } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.resource_id) || []);

  const handleBookmark = async (resourceId: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to save resources." });
      return;
    }
    try {
      await toggleBookmark.mutateAsync({
        resourceId,
        isBookmarked: bookmarkedIds.has(resourceId),
      });
    } catch {
      toast({ title: "Error", description: "Failed to update bookmark.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Reading Lists</h2>
        <p className="text-muted-foreground">
          Curated essential readings from foundational texts to recent journal articles.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="h-auto p-1 bg-muted/50">
          {categories?.map((cat) => (
            <TabsTrigger
              key={cat.name}
              value={cat.name}
              className="data-[state=active]:bg-background"
            >
              {cat.name}
              <Badge variant="secondary" className="ml-2">
                {cat.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories?.map((cat) => (
          <TabsContent key={cat.name} value={cat.name} className="mt-6">
            <div className="mb-6 p-4 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">
                {CATEGORY_DESCRIPTIONS[cat.name] || "Curated resources for your learning journey."}
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40" />
                ))}
              </div>
            ) : resources?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No readings in this category yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {resources?.map((resource, index) => {
                  const formatInfo = FORMAT_LABELS[resource.format] || {
                    label: resource.format,
                    color: "bg-muted",
                  };

                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="py-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Book icon */}
                            <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-sage/20 to-amber/20 flex items-center justify-center shrink-0">
                              <BookOpen className="w-10 h-10 text-sage" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={formatInfo.color}>{formatInfo.label}</Badge>
                                    {resource.featured && (
                                      <Badge className="bg-amber/20 text-amber border-amber/30">
                                        <Star className="w-3 h-3 mr-1" />
                                        Essential
                                      </Badge>
                                    )}
                                  </div>
                                  <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                                    {resource.description}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    {resource.author && (
                                      <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{resource.author}</span>
                                      </div>
                                    )}
                                    {resource.publication_date && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                          {format(new Date(resource.publication_date), "yyyy")}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleBookmark(resource.id)}
                                  >
                                    {bookmarkedIds.has(resource.id) ? (
                                      <BookmarkCheck className="w-5 h-5 text-amber" />
                                    ) : (
                                      <Bookmark className="w-5 h-5" />
                                    )}
                                  </Button>
                                  {resource.external_url && (
                                    <Button variant="outline" asChild>
                                      <a
                                        href={resource.external_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Tags */}
                              {resource.tags && resource.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {resource.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
