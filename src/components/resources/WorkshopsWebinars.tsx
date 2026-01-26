import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Clock, User, Play, Calendar, Star, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResources, useResourceCategories, useToggleBookmark, useBookmarks } from "@/hooks/useResources";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CATEGORY_ICONS: Record<string, string> = {
  "Research Design & Ethics": "🔬",
  "Data Analysis Techniques": "📊",
  "Grant Writing Strategies": "💰",
};

export const WorkshopsWebinars = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: resources, isLoading } = useResources({
    type: "workshop",
    category: selectedCategory || undefined,
  });
  const { data: categories, isLoading: loadingCategories } = useResourceCategories("workshop");
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
      toast({
        title: bookmarkedIds.has(resourceId) ? "Removed from saved" : "Saved!",
        description: bookmarkedIds.has(resourceId) ? "Resource removed from your saved list." : "Resource added to your saved list.",
      });
    } catch {
      toast({ title: "Error", description: "Failed to update bookmark.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-display font-bold mb-2">Workshops & Webinars</h2>
          <p className="text-muted-foreground">
            Live and recorded sessions on research design, data analysis, grant writing, and more.
          </p>
        </div>
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
                    <span className="text-2xl">{CATEGORY_ICONS[category.name] || "📚"}</span>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.count} resources</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resources Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : resources?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No workshops found in this category.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources?.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {resource.featured && (
                        <Badge className="mb-2 bg-amber/20 text-amber border-amber/30">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(resource.id);
                      }}
                    >
                      {bookmarkedIds.has(resource.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-amber" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {resource.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {resource.author && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{resource.author}</span>
                      </div>
                    )}
                    {resource.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                    )}
                    {resource.publication_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(resource.publication_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={resource.format === "live" ? "default" : "secondary"}
                      className={resource.format === "live" ? "bg-sage" : ""}
                    >
                      {resource.format === "live" ? "Live Session" : "Recorded"}
                    </Badge>
                  </div>

                  <Button className="w-full mt-4 group-hover:bg-amber group-hover:text-white transition-colors">
                    <Play className="w-4 h-4 mr-2" />
                    {resource.format === "live" ? "Register Now" : "Watch Now"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
