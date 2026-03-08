import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface GuideSidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface GuideSidebarProps {
  sections: GuideSidebarSection[];
  idPrefix: string; // "og-" or "ug-"
}

export function GuideSidebar({ sections, idPrefix }: GuideSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  const handleClick = useCallback((id: string) => {
    document.getElementById(`${idPrefix}${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [idPrefix]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible entry
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to top
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const id = top.target.id.replace(idPrefix, "");
          setActiveId(id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(`${idPrefix}${id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, idPrefix]);

  return (
    <div
      className={cn(
        "sticky top-24 self-start transition-all duration-200 shrink-0 print:hidden",
        collapsed ? "w-10" : "w-56"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        {!collapsed && (
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sections
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="space-y-0.5">
        {sections.map(({ id, label, icon: Icon }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2 w-full text-left rounded-md transition-colors text-sm",
                collapsed ? "justify-center p-1.5" : "px-2.5 py-1.5",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && (
                <span className="truncate text-xs leading-tight">{label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
