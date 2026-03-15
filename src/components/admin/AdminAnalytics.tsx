import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Handshake, Calendar, FileText, BookOpen, Database, MessageSquare, TrendingUp } from "lucide-react";

interface PlatformStats {
  totalProfiles: number;
  students: number;
  researchers: number;
  agencies: number;
  activeCollaborations: number;
  pendingCollaborations: number;
  upcomingEvents: number;
  totalResources: number;
  totalDatasets: number;
  forumPosts: number;
  pendingSubmissions: number;
  newsletterSubscribers: number;
}

export function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [
        profilesRes,
        collabsRes,
        eventsRes,
        resourcesRes,
        datasetsRes,
        forumRes,
        submissionsRes,
        newsletterRes,
      ] = await Promise.all([
        supabase.from("profiles").select("profile_type", { count: "exact" }),
        supabase.from("collaborations").select("status", { count: "exact" }),
        supabase.from("events").select("id", { count: "exact" }).gte("start_date", new Date().toISOString()),
        supabase.from("resources").select("id", { count: "exact" }),
        supabase.from("datasets").select("id", { count: "exact" }),
        supabase.from("forum_posts").select("id", { count: "exact" }),
        supabase.from("research_submissions").select("status", { count: "exact" }).eq("status", "pending"),
        supabase.from("newsletter_subscribers").select("id", { count: "exact" }).is("unsubscribed_at", null),
      ]);

      const profiles = profilesRes.data || [];
      const collabs = collabsRes.data || [];

      return {
        totalProfiles: profilesRes.count || 0,
        students: profiles.filter((p: any) => p.profile_type === "student").length,
        researchers: profiles.filter((p: any) => p.profile_type === "researcher").length,
        agencies: profiles.filter((p: any) => p.profile_type === "agency").length,
        activeCollaborations: collabs.filter((c: any) => c.status === "accepted").length,
        pendingCollaborations: collabs.filter((c: any) => c.status === "pending").length,
        upcomingEvents: eventsRes.count || 0,
        totalResources: resourcesRes.count || 0,
        totalDatasets: datasetsRes.count || 0,
        forumPosts: forumRes.count || 0,
        pendingSubmissions: submissionsRes.count || 0,
        newsletterSubscribers: newsletterRes.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-24" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Profiles", value: stats?.totalProfiles || 0, icon: Users, color: "text-primary", detail: `${stats?.students || 0} students · ${stats?.researchers || 0} researchers · ${stats?.agencies || 0} agencies` },
    { label: "Active Collaborations", value: stats?.activeCollaborations || 0, icon: Handshake, color: "text-emerald-500", detail: `${stats?.pendingCollaborations || 0} pending` },
    { label: "Upcoming Events", value: stats?.upcomingEvents || 0, icon: Calendar, color: "text-amber-500", detail: "Scheduled events" },
    { label: "Resources", value: stats?.totalResources || 0, icon: BookOpen, color: "text-blue-500", detail: "Workshops, toolkits & readings" },
    { label: "Datasets & Tools", value: stats?.totalDatasets || 0, icon: Database, color: "text-violet-500", detail: "Available datasets" },
    { label: "Forum Posts", value: stats?.forumPosts || 0, icon: MessageSquare, color: "text-teal-500", detail: "Community discussions" },
    { label: "Pending Submissions", value: stats?.pendingSubmissions || 0, icon: FileText, color: "text-orange-500", detail: "Awaiting review" },
    { label: "Newsletter Subscribers", value: stats?.newsletterSubscribers || 0, icon: TrendingUp, color: "text-pink-500", detail: "Active subscribers" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Platform Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
