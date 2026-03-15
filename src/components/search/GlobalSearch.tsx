import { useState, useEffect, useRef } from "react";
import { Search, X, User, BookOpen, Calendar, Database, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: "profile" | "resource" | "event" | "dataset";
  href: string;
}

const typeConfig = {
  profile: { icon: User, label: "Profile", color: "text-primary" },
  resource: { icon: BookOpen, label: "Resource", color: "text-blue-500" },
  event: { icon: Calendar, label: "Event", color: "text-amber-500" },
  dataset: { icon: Database, label: "Dataset", color: "text-violet-500" },
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const q = `%${query}%`;

      const [profilesRes, resourcesRes, eventsRes, datasetsRes] = await Promise.all([
        supabase.from("profiles").select("id, name, profile_type, institution, university, location").ilike("name", q).limit(5),
        supabase.from("resources").select("id, title, category, resource_type").ilike("title", q).limit(5),
        supabase.from("events").select("id, title, event_type, location").ilike("title", q).limit(5),
        supabase.from("datasets").select("id, title, source_organization").ilike("title", q).limit(5),
      ]);

      const mapped: SearchResult[] = [
        ...(profilesRes.data || []).map((p: any) => ({
          id: p.id,
          title: p.name,
          subtitle: p.institution || p.university || p.location || p.profile_type,
          type: "profile" as const,
          href: `/profile/${p.id}`,
        })),
        ...(resourcesRes.data || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          subtitle: `${r.resource_type} · ${r.category}`,
          type: "resource" as const,
          href: `/resources`,
        })),
        ...(eventsRes.data || []).map((e: any) => ({
          id: e.id,
          title: e.title,
          subtitle: `${e.event_type}${e.location ? ` · ${e.location}` : ""}`,
          type: "event" as const,
          href: `/events`,
        })),
        ...(datasetsRes.data || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          subtitle: d.source_organization,
          type: "dataset" as const,
          href: `/data-tools`,
        })),
      ];

      setResults(mapped);
      setOpen(mapped.length > 0 || query.trim().length > 0);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.href);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search..."
          className="pl-8 pr-8 h-9 w-44 lg:w-56 bg-muted/50 border-border/50 text-sm"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-2 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-card border border-border shadow-elevated z-50"
          >
            {loading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => {
                  const config = typeConfig[result.type];
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    >
                      <config.icon className={`h-4 w-4 shrink-0 ${config.color}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 shrink-0">
                        {config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No results for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
