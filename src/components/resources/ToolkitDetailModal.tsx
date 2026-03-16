import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, User, X } from "lucide-react";
import { Resource } from "@/hooks/useResources";

interface ToolkitDetailModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
}

// Simple markdown-to-HTML renderer for toolkit content
function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-foreground border-b border-border pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-amber/50 pl-4 py-1 my-3 text-muted-foreground italic">$1</blockquote>')
    // Unordered lists
    .replace(/^- \*\*(.+?)\*\*(.*)$/gm, '<li class="ml-4 my-1"><strong>$1</strong>$2</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 my-1 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 my-1 list-decimal">$1</li>')
    // Checkboxes
    .replace(/^- \[ \] (.+)$/gm, '<li class="ml-4 my-1 flex items-center gap-2"><span class="w-4 h-4 border border-border rounded inline-block shrink-0"></span>$1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="ml-4 my-1 flex items-center gap-2"><span class="w-4 h-4 bg-primary rounded inline-block shrink-0"></span>$1</li>')
    // Tables (simple)
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      if (cells.every(c => c.trim().match(/^-+$/))) {
        return '<tr class="border-b border-border"></tr>';
      }
      const isHeader = false;
      const tag = isHeader ? 'th' : 'td';
      return `<tr class="border-b border-border">${cells.map(c => `<${tag} class="px-3 py-2 text-sm">${c.trim()}</${tag}>`).join('')}</tr>`;
    })
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-muted rounded-lg p-4 my-4 overflow-x-auto text-xs"><code>$2</code></pre>')
    // Inline code
    .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs">$1</code>')
    // Paragraphs - wrap lines that aren't already HTML
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="my-2 text-sm leading-relaxed text-foreground/90">$1</p>');

  // Wrap consecutive <tr> in <table>
  html = html.replace(/((?:<tr[^>]*>.*?<\/tr>\s*)+)/gs, '<table class="w-full border border-border rounded-lg my-4">$1</table>');

  return html;
}

export function ToolkitDetailModal({ resource, open, onOpenChange, isBookmarked, onBookmark }: ToolkitDetailModalProps) {
  if (!resource) return null;

  const content = (resource as any).content as string | null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {resource.featured && (
              <Badge className="bg-amber/20 text-amber border-amber/30">Featured</Badge>
            )}
            <Badge variant="outline">{resource.category}</Badge>
            {resource.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <DialogTitle className="text-2xl">{resource.title}</DialogTitle>
          {resource.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="w-4 h-4" />
              <span>{resource.author}</span>
            </div>
          )}
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBookmark(resource.id)}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 mr-2 text-amber" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>

        {content ? (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>{resource.description}</p>
            <p className="mt-4 text-sm">Full guide content coming soon.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
