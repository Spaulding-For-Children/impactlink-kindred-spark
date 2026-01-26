import { motion } from "framer-motion";
import { Bookmark, Video, FileText, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks, useToggleBookmark, Resource } from "@/hooks/useResources";
import { useToast } from "@/hooks/use-toast";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  workshop: Video,
  toolkit: FileText,
  reading: BookOpen,
};

const TYPE_LABELS: Record<string, string> = {
  workshop: "Workshop",
  toolkit: "Toolkit",
  reading: "Reading",
};

export const SavedResources = () => {
  const { toast } = useToast();
  const { data: bookmarks, isLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const handleRemove = async (resourceId: string) => {
    try {
      await toggleBookmark.mutateAsync({ resourceId, isBookmarked: true });
      toast({ title: "Removed", description: "Resource removed from your saved list." });
    } catch {
      toast({ title: "Error", description: "Failed to remove bookmark.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved resources yet</h3>
          <p className="text-muted-foreground">
            Browse workshops, toolkits, and readings to save items for later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Saved Resources</h2>
        <p className="text-muted-foreground">
          Your personal collection of saved resources ({bookmarks.length} items)
        </p>
      </div>

      <div className="space-y-4">
        {bookmarks.map((bookmark, index) => {
          const resource = bookmark.resource as unknown as Resource;
          const TypeIcon = TYPE_ICONS[resource.resource_type] || BookOpen;

          return (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-all">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                      <TypeIcon className="w-6 h-6 text-amber" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{TYPE_LABELS[resource.resource_type]}</Badge>
                        <Badge variant="outline">{resource.category}</Badge>
                      </div>
                      <h3 className="font-semibold truncate">{resource.title}</h3>
                      {resource.author && (
                        <p className="text-sm text-muted-foreground">{resource.author}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(resource.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
