import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, User, Star, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResources, useResourceCategories, useToggleBookmark, useBookmarks } from "@/hooks/useResources";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_ICONS: Record<string, string> = {
  "Academic-Agency Partnerships": "🤝",
  "Community-Based Research": "🏘️",
  "Evidence-Based Practices": "✅",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Academic-Agency Partnerships": "bg-violet-100 text-violet-700",
  "Community-Based Research": "bg-emerald-100 text-emerald-700",
  "Evidence-Based Practices": "bg-sky-100 text-sky-700",
};

export const ToolkitsGuides = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: resources, isLoading } = useResources({
    type: "toolkit",
    category: selectedCategory || undefined,
  });
  const { data: categories, isLoading: loadingCategories } = useResourceCategories("toolkit");
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
        <h2 className="text-2xl font-display font-bold mb-2">Toolkits & Guides</h2>
        <p className="text-muted-foreground">
          Downloadable guides for building partnerships and implementing evidence-based practices.
        </p>
      </div>

      {/* Category Filters */}
      {loadingCategories ? (
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories?.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.name
                    ? "ring-2 ring-amber border-amber"
                    : "hover:-translate-y-1"
                }`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === category.name ? null : category.name)
                }
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{CATEGORY_ICONS[category.name] || "📄"}</span>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} guides</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resources List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : resources?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No toolkits found in this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resources?.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all group">
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${
                        CATEGORY_COLORS[resource.category] || "bg-muted"
                      }`}
                    >
                      <FileText className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {resource.featured && (
                              <Badge className="bg-amber/20 text-amber border-amber/30">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline">{resource.category}</Badge>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {resource.description}
                          </p>
                          {resource.author && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span>{resource.author}</span>
                            </div>
                          )}
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
                          <Button className="gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                          </Button>
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
          ))}
        </div>
      )}
    </div>
  );
};
