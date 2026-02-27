import { useState, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Server, Shield, Settings, Database, Code, RefreshCw, Users, Lock, Wrench, Globe, Layers, FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Tip = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 my-2 text-sm flex gap-2">
    <span className="text-primary font-bold shrink-0">💡</span>
    <span>{children}</span>
  </div>
);

const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 my-2 text-sm flex gap-2">
    <span className="font-bold shrink-0">⚠️</span>
    <span>{children}</span>
  </div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5 text-primary" />
    <span className="font-semibold">{title}</span>
  </div>
);

const sectionSearchData: Record<string, { title: string; keywords: string }> = {
  architecture: { title: "Site Architecture Overview", keywords: "spa single page application react router cdn rls row level security request flow pages routes auth directory collaboration resources events data tools admin authentication invite only jwt" },
  "admin-controls": { title: "Admin Controls Overview", keywords: "tabs dashboard site settings registrations submissions profiles directory resources events forums research questions data tools user guide moderator" },
  "content-mgmt": { title: "Content Management Controls", keywords: "hero section badge title tagline description cta button resources add edit delete events workshop webinar conference networking training featured datasets analysis tools ethics csv import submissions moderation approve reject" },
  "layout-theme": { title: "Layout & Theme Controls", keywords: "section order reorder hide show visibility toggle hero directory collaboration data tools resources events contact theme colors hsl primary secondary accent fonts google fonts display body" },
  "user-mgmt": { title: "User & Registration Management", keywords: "registration workflow approve reject account email resend password reset profile search filter edit delete export csv directory" },
  "tech-stack": { title: "Technology Stack", keywords: "react typescript vite tailwind css shadcn ui react router tanstack react query framer motion i18next recharts lucide postgresql database authentication edge functions deno storage resend design system hsl tokens" },
  database: { title: "Database Schema & Tables", keywords: "profiles user roles registration requests resources research submissions events event registrations forum topics forum posts forum replies research questions collaborations datasets analysis tools ethics resources resource bookmarks site settings has_role get_partner_matches storage buckets" },
  "edge-functions": { title: "Backend Functions", keywords: "edge functions process registration send event notification send collaboration notification send registration notification resend api key service role key jwt secrets deno server side" },
  updates: { title: "Software Updates & Maintenance", keywords: "dependency management npm bun react vite typescript eslint radix shadcn supabase tanstack update frequency security patches database migrations edge function deploy monitoring checklist" },
  "roles-permissions": { title: "Roles & Permissions", keywords: "admin moderator user role has_role security definer rls policy permission matrix create edit delete profile submit research post forum register events collaboration approve registrations site settings manage roles" },
  security: { title: "Security Architecture", keywords: "row level security rls jwt tokens authentication invite only password reset anon key service role key tls encryption storage bucket api keys secrets environment variables" },
  troubleshooting: { title: "Troubleshooting & Common Issues", keywords: "email not sending resend api key admin dashboard not loading user roles data not appearing rls policy csv import header mismatch site settings cache refresh registration stuck edge function error missing profiles query limit 1000" },
};

const allSections = Object.keys(sectionSearchData);

export function AdminOperationalGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return allSections;
    const q = searchQuery.toLowerCase();
    return allSections.filter((id) => {
      const { title, keywords } = sectionSearchData[id];
      return title.toLowerCase().includes(q) || keywords.includes(q);
    });
  }, [searchQuery]);
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Site Operational Guide</h2>
              <p className="text-muted-foreground text-sm">Technical reference for platform administrators</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            This guide covers how the website works, what you can control, the technology behind the platform, maintenance procedures, and the complete roles & permissions model.
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics (e.g. RLS, registration, theme, edge functions...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing {filteredSections.length} of {allSections.length} sections
            </p>
          )}
        </CardContent>
      </Card>

      {filteredSections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No sections match "<strong>{searchQuery}</strong>"</p>
            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear search</Button>
          </CardContent>
        </Card>
      ) : (
      <Accordion type="multiple" defaultValue={allSections} className="space-y-3">

        {/* 1. Site Architecture Overview */}
        {filteredSections.includes("architecture") && (
        <AccordionItem value="architecture" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Layers} title="1. Site Architecture Overview" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <p>The platform is a <strong>single-page application (SPA)</strong> built with a modern React front-end connected to a cloud-hosted backend. Here is how data flows:</p>

            <h4 className="font-semibold mt-4 text-foreground">Request Flow</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>User opens the site → browser loads the compiled React app from the CDN.</li>
              <li>React Router handles navigation client-side (no full-page reloads).</li>
              <li>Components fetch data from the backend database via the SDK client.</li>
              <li>Row-Level Security (RLS) policies on every table ensure users only see authorized data.</li>
              <li>Backend functions (edge functions) handle server-side operations like email sending and registration processing.</li>
            </ol>

            <h4 className="font-semibold mt-4 text-foreground">Key Pages</h4>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Route</th><th className="text-left p-2">Purpose</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/</td><td className="p-2">Landing page with dynamic sections</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/auth</td><td className="p-2">Login & registration request</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/directory</td><td className="p-2">Browse all profiles</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/collaboration</td><td className="p-2">Forums, partner matching, research questions</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/resources</td><td className="p-2">Workshops, toolkits, reading lists</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/events</td><td className="p-2">Event calendar & registrations</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/data-tools</td><td className="p-2">Datasets, analysis tools, ethics resources</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">/admin</td><td className="p-2">Admin dashboard (admin role only)</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Authentication Flow</h4>
            <p>Registration is <strong>invite-only</strong>. Users submit a registration request → an admin reviews and approves/rejects → upon approval, the system creates an account and emails a password-reset link. There is no public sign-up.</p>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("admin-controls") && (
        <AccordionItem value="admin-controls" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Settings} title="2. Admin Controls Overview" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <p>As an admin, you have access to <strong>10 tabs</strong> in the admin dashboard. Each tab controls a different part of the platform:</p>

            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Tab</th><th className="text-left p-2">What You Control</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-semibold">Site Settings</td><td className="p-2">Landing page content, theme colors/fonts, section order & visibility</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Registrations</td><td className="p-2">Approve/reject new account requests, add admin notes</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Submissions</td><td className="p-2">Moderate research submissions (approve/reject/delete)</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Directory</td><td className="p-2">View, search, edit, delete any profile; export CSV</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Resources</td><td className="p-2">Full CRUD on workshops, toolkits, reading lists</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Events</td><td className="p-2">Create, edit, delete events of any type</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Forums</td><td className="p-2">Create/edit/delete forum topics</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Research Q's</td><td className="p-2">View and delete research questions posted by users</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Data & Tools</td><td className="p-2">Manage datasets, analysis tools, ethics resources; CSV import</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">User Guide</td><td className="p-2">Platform user guide (read-only reference)</td></tr>
              </tbody>
            </table>

            <Tip>You can access the admin dashboard by navigating to <code>/admin</code>. Only users with the <strong>admin</strong> role can see this page — others are redirected automatically.</Tip>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("content-mgmt") && (
        <AccordionItem value="content-mgmt" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={FileText} title="3. Content Management Controls" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Hero Section (Site Settings → Content)</h4>
            <p>Control the badge text, title, tagline, description, and both CTA button labels. Changes save per-section via the "Save" button and appear immediately on the landing page.</p>

            <h4 className="font-semibold mt-4 text-foreground">Section Titles & Descriptions</h4>
            <p>Each landing page section (Directory, Collaboration, Data & Tools, Resources, Events, Contact) has an editable title and description field in the Content sub-tab.</p>

            <h4 className="font-semibold mt-4 text-foreground">Resources Management</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Add:</strong> Click "Add Resource" → fill title, description, type (workshop/toolkit/reading), format (live/recorded/pdf/article/report/book), category, author, URLs, and tags.</li>
              <li><strong>Edit:</strong> Click the edit icon on any resource card to modify fields.</li>
              <li><strong>Delete:</strong> Click the delete icon → confirm in the dialog.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Events Management</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Supported types: <Badge variant="outline">workshop</Badge> <Badge variant="outline">webinar</Badge> <Badge variant="outline">conference</Badge> <Badge variant="outline">networking</Badge> <Badge variant="outline">training</Badge></li>
              <li>Set start/end dates, virtual/in-person, max attendees, registration deadline, host info, and tags.</li>
              <li>Toggle <strong>featured</strong> to highlight events on the public page.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Data & Tools (Datasets, Analysis Tools, Ethics Resources)</h4>
            <p>Each sub-category has its own tab with add/edit/delete capabilities. Use the <strong>CSV Import</strong> button for bulk uploads — ensure your CSV headers match the expected column names exactly.</p>

            <h4 className="font-semibold mt-4 text-foreground">Research Submissions Moderation</h4>
            <p>New submissions arrive as <Badge variant="outline">pending</Badge>. Review the attached file, then approve or reject. Approved submissions become publicly visible; rejected ones are only visible to their author.</p>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("layout-theme") && (
        <AccordionItem value="layout-theme" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Globe} title="4. Layout & Theme Controls" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Section Order (Site Settings → Layout)</h4>
            <p>The landing page renders sections in the order shown in the Layout tab. Use the <strong>↑ / ↓</strong> arrows to reorder. Toggle the eye switch to hide/show any section. Click "Save Layout" to persist.</p>

            <h4 className="font-semibold mt-4 text-foreground">Available Sections</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Hero</strong> — Main banner with CTA buttons</li>
              <li><strong>Directory</strong> — Profile cards grid</li>
              <li><strong>Collaboration</strong> — Forums & partner matching teaser</li>
              <li><strong>Data & Tools</strong> — Datasets and analysis tools showcase</li>
              <li><strong>Resources</strong> — Workshops, toolkits, reading lists</li>
              <li><strong>Events</strong> — Upcoming events calendar</li>
              <li><strong>Contact</strong> — Contact form and FAQ</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Theme Colors (Site Settings → Theme)</h4>
            <p>Colors use <strong>HSL format</strong> (e.g., <code>230 60% 25%</code>). The three configurable colors are:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Primary Color</strong> — Main brand color used for buttons, links, and accents.</li>
              <li><strong>Secondary / Accent Color</strong> — Used for secondary interactive elements.</li>
              <li><strong>Tertiary / Sage Color</strong> — Subtle background and border tones.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Fonts</h4>
            <p>Set the <strong>Display Font</strong> (headings) and <strong>Body Font</strong> (paragraph text). These must be Google Fonts names. The fonts are loaded dynamically.</p>

            <Warning>After changing theme colors or fonts, they take effect only if the front-end code is wired to read from the <code>site_settings</code> table and apply them as CSS variables. Currently, the theme settings are stored but may require code updates to apply dynamically at runtime.</Warning>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("user-mgmt") && (
        <AccordionItem value="user-mgmt" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Users} title="5. User & Registration Management" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Registration Workflow</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>A visitor fills out the registration request form (name, email, phone, organization, organization type).</li>
              <li>The request appears in <strong>Registrations</strong> tab with status <Badge variant="outline">pending</Badge>.</li>
              <li>Admin reviews and clicks <strong>Approve</strong> or <strong>Reject</strong>.</li>
              <li>On approval: the system creates an auth account, generates a password-reset link, and sends an email via Resend.</li>
              <li>On rejection: the system sends a rejection email (optionally with admin notes).</li>
            </ol>

            <h4 className="font-semibold mt-4 text-foreground">Profile Management (Directory Tab)</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Search:</strong> Filter by name or email.</li>
              <li><strong>Filter:</strong> By profile type (student / researcher / agency).</li>
              <li><strong>Edit:</strong> Click the edit icon to modify any profile field. Different fields appear based on profile type.</li>
              <li><strong>Delete:</strong> Removes the profile record (does not delete the auth account).</li>
              <li><strong>Export CSV:</strong> Downloads all filtered profiles as a CSV file.</li>
            </ul>

            <Tip>When deleting a profile, the user's auth account still exists. They can log in but won't have a profile. To fully remove a user, you would also need to delete them from the authentication system.</Tip>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("tech-stack") && (
        <AccordionItem value="tech-stack" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Code} title="6. Technology Stack" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Front-End</h4>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Technology</th><th className="text-left p-2">Purpose</th><th className="text-left p-2">Version</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-semibold">React 18</td><td className="p-2">UI component library</td><td className="p-2">^18.3</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">TypeScript</td><td className="p-2">Type-safe JavaScript</td><td className="p-2">^5.x</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Vite</td><td className="p-2">Build tool & dev server</td><td className="p-2">^5.x</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Tailwind CSS</td><td className="p-2">Utility-first CSS framework</td><td className="p-2">^3.x</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">shadcn/ui</td><td className="p-2">Pre-built accessible UI components</td><td className="p-2">Latest</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">React Router</td><td className="p-2">Client-side routing</td><td className="p-2">^6.30</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">TanStack React Query</td><td className="p-2">Server-state caching & data fetching</td><td className="p-2">^5.83</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Framer Motion</td><td className="p-2">Animations & transitions</td><td className="p-2">^12.x</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">i18next</td><td className="p-2">Internationalization (EN, AR, FR, ES, PT)</td><td className="p-2">^25.x</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Recharts</td><td className="p-2">Data visualization charts</td><td className="p-2">^2.15</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Lucide React</td><td className="p-2">Icon library</td><td className="p-2">^0.462</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Back-End (Lovable Cloud)</h4>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Service</th><th className="text-left p-2">Purpose</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-semibold">PostgreSQL Database</td><td className="p-2">Primary data store with Row-Level Security</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Authentication</td><td className="p-2">Email/password auth with JWT tokens</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Edge Functions (Deno)</td><td className="p-2">Server-side logic (email sending, registration processing)</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Storage</td><td className="p-2">File uploads (research-uploads bucket)</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Resend</td><td className="p-2">Transactional email delivery service</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Design System</h4>
            <p>The platform uses <strong>semantic CSS tokens</strong> defined in <code>index.css</code> and <code>tailwind.config.ts</code>. All colors are HSL-based and support light/dark modes. Components from shadcn/ui are customized with project-specific variants.</p>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("database") && (
        <AccordionItem value="database" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Database} title="7. Database Schema & Tables" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <p>The platform uses <strong>17 database tables</strong>. Here is a summary of each:</p>

            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Table</th><th className="text-left p-2">Purpose</th><th className="text-left p-2">RLS</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-mono text-xs">profiles</td><td className="p-2">User profiles (student/researcher/agency)</td><td className="p-2">✅ Public read, owner write</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">user_roles</td><td className="p-2">Role assignments (admin/moderator/user)</td><td className="p-2">✅ Admin manage, self read</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">registration_requests</td><td className="p-2">Account registration queue</td><td className="p-2">✅ Public insert, admin read/update</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">resources</td><td className="p-2">Workshops, toolkits, readings</td><td className="p-2">✅ Public read, auth write</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">research_submissions</td><td className="p-2">User-submitted research</td><td className="p-2">✅ Author + admin access</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">events</td><td className="p-2">Platform events</td><td className="p-2">✅ Public read, admin delete</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">event_registrations</td><td className="p-2">User event sign-ups</td><td className="p-2">✅ Owner only</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">forum_topics</td><td className="p-2">Discussion forum categories</td><td className="p-2">✅ Public read, admin manage</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">forum_posts</td><td className="p-2">Forum discussion threads</td><td className="p-2">✅ Public read, author/admin edit</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">forum_replies</td><td className="p-2">Replies to forum posts</td><td className="p-2">✅ Public read, author edit</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">research_questions</td><td className="p-2">Research question board</td><td className="p-2">✅ Public read, author/admin manage</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">collaborations</td><td className="p-2">Collaboration requests between users</td><td className="p-2">✅ Participant only</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">datasets</td><td className="p-2">Data sources catalog</td><td className="p-2">✅ Public read, admin write</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">analysis_tools</td><td className="p-2">Analysis & assessment tools</td><td className="p-2">✅ Public read, admin write</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">ethics_resources</td><td className="p-2">Ethics & compliance guides</td><td className="p-2">✅ Public read, admin write</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">resource_bookmarks</td><td className="p-2">User-saved resources</td><td className="p-2">✅ Owner only</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">site_settings</td><td className="p-2">Dynamic site configuration (JSON)</td><td className="p-2">✅ Public read, admin write</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Key Database Functions</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>has_role(user_id, role)</code> — Security-definer function used in all RLS policies to check admin/moderator status without recursion.</li>
              <li><code>get_partner_matches(profile_id)</code> — Returns ranked collaboration matches based on shared interests and location.</li>
              <li><code>update_updated_at_column()</code> — Trigger function to auto-update <code>updated_at</code> timestamps.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Storage Buckets</h4>
            <p><code>research-uploads</code> — Public bucket for research submission file attachments (PDFs, documents).</p>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("edge-functions") && (
        <AccordionItem value="edge-functions" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Server} title="8. Backend Functions" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <p>The platform uses <strong>4 backend (edge) functions</strong> that run server-side:</p>

            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Function</th><th className="text-left p-2">Purpose</th><th className="text-left p-2">JWT Required</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-mono text-xs">process-registration</td><td className="p-2">Creates auth accounts on approval, sends approval/rejection emails via Resend</td><td className="p-2">No (validates admin role internally)</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">send-event-notification</td><td className="p-2">Sends email notifications for event-related actions</td><td className="p-2">No</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">send-collaboration-notification</td><td className="p-2">Emails users when they receive collaboration requests</td><td className="p-2">No</td></tr>
                <tr className="border-b"><td className="p-2 font-mono text-xs">send-registration-notification</td><td className="p-2">Notifies admins of new registration requests</td><td className="p-2">No</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Required Secrets</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>RESEND_API_KEY</code> — API key for the Resend email service. Required for all email-sending functions.</li>
              <li><code>SUPABASE_SERVICE_ROLE_KEY</code> — Service role key for admin-level database operations in edge functions.</li>
            </ul>

            <Warning>Edge functions use the service role key which bypasses RLS. Never expose this key in client-side code. It is only available server-side in edge functions.</Warning>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("updates") && (
        <AccordionItem value="updates" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={RefreshCw} title="9. Software Updates & Maintenance" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Dependency Management</h4>
            <p>The platform uses <strong>npm/bun</strong> for package management. Key dependencies and their update cadence:</p>

            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Category</th><th className="text-left p-2">Packages</th><th className="text-left p-2">Update Frequency</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2 font-semibold">Core Framework</td><td className="p-2">React, React DOM, React Router</td><td className="p-2">Every 3–6 months</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Build Tools</td><td className="p-2">Vite, TypeScript, ESLint</td><td className="p-2">Every 3 months</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">UI Components</td><td className="p-2">Radix UI, shadcn/ui primitives</td><td className="p-2">As needed</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Backend SDK</td><td className="p-2">@supabase/supabase-js</td><td className="p-2">Monthly (security patches)</td></tr>
                <tr className="border-b"><td className="p-2 font-semibold">Data & State</td><td className="p-2">TanStack React Query</td><td className="p-2">Quarterly</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">How to Update</h4>
            <p>All updates are managed through the <strong>Lovable platform</strong>. You can request dependency updates, security patches, and feature additions directly through the Lovable editor. The platform handles:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dependency version upgrades</li>
              <li>Security vulnerability scanning and patching</li>
              <li>Database migrations (schema changes)</li>
              <li>Edge function redeployment</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Platform Updates</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lovable Cloud</strong> automatically manages infrastructure (database, auth, storage, edge functions).</li>
              <li><strong>Database migrations</strong> are versioned and applied through the Lovable editor.</li>
              <li><strong>Edge functions</strong> auto-deploy when code is updated.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Monitoring Checklist</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for pending registration requests daily.</li>
              <li>Review pending research submissions weekly.</li>
              <li>Monitor forum content for spam or policy violations.</li>
              <li>Verify email delivery (Resend dashboard) if users report missing emails.</li>
              <li>Review database usage and storage periodically through Lovable Cloud.</li>
            </ul>

            <Tip>You can request a security scan at any time through the Lovable editor to check for vulnerable dependencies.</Tip>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("roles-permissions") && (
        <AccordionItem value="roles-permissions" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Shield} title="10. Roles & Permissions" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Role Definitions</h4>
            <p>Roles are stored in a dedicated <code>user_roles</code> table, separate from profiles, to prevent privilege escalation. The system supports three roles:</p>

            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Role</th><th className="text-left p-2">Description</th><th className="text-left p-2">Assignment</th></tr></thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-destructive/10 text-destructive border-destructive/20">admin</Badge></td>
                  <td className="p-2">Full platform control. Can manage all content, users, settings, and roles.</td>
                  <td className="p-2">Manual database assignment only</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-primary/10 text-primary border-primary/20">moderator</Badge></td>
                  <td className="p-2">Can review and moderate submissions. Limited admin capabilities.</td>
                  <td className="p-2">Assigned by admin</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2"><Badge className="bg-muted text-muted-foreground">user</Badge></td>
                  <td className="p-2">Standard registered user. Can create profiles, submit research, join forums, register for events.</td>
                  <td className="p-2">Default on account creation</td>
                </tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">Permission Matrix</h4>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Action</th><th className="text-left p-2">User</th><th className="text-left p-2">Moderator</th><th className="text-left p-2">Admin</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2">View public content</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Create/edit own profile</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Submit research</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Post in forums</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Register for events</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Request collaboration</td><td className="p-2">✅</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Moderate submissions</td><td className="p-2">❌</td><td className="p-2">✅</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Access admin dashboard</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Manage all profiles</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">CRUD resources/events</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Approve registrations</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Edit site settings</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Manage roles</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
                <tr className="border-b"><td className="p-2">Delete any content</td><td className="p-2">❌</td><td className="p-2">❌</td><td className="p-2">✅</td></tr>
              </tbody>
            </table>

            <h4 className="font-semibold mt-4 text-foreground">How Role Checks Work</h4>
            <p>The system uses a <code>has_role(user_id, role)</code> database function marked as <code>SECURITY DEFINER</code>. This function:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Runs with elevated privileges to query the <code>user_roles</code> table.</li>
              <li>Avoids recursive RLS policy checks.</li>
              <li>Is used in every RLS policy that requires admin/moderator access.</li>
              <li>Is also called client-side via RPC to determine UI visibility (e.g., showing the admin dashboard link).</li>
            </ul>

            <Warning>Never grant roles through client-side code or store role information in localStorage. Roles must only be managed through the <code>user_roles</code> database table with proper RLS policies.</Warning>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("security") && (
        <AccordionItem value="security" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Lock} title="11. Security Architecture" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <h4 className="font-semibold text-foreground">Row-Level Security (RLS)</h4>
            <p>Every table has RLS enabled. Policies enforce that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Public data (profiles, resources, events, forums) is readable by everyone.</li>
              <li>Write operations require authentication and ownership verification.</li>
              <li>Admin-only tables (datasets, analysis tools, ethics resources, site settings) restrict writes to admin role.</li>
              <li>Sensitive tables (user_roles, registration_requests) have strict access controls.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Authentication Security</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>JWT tokens with expiration are used for all authenticated requests.</li>
              <li>No public sign-up — invite-only via admin-approved registration requests.</li>
              <li>Password reset flows use secure, time-limited links.</li>
              <li>The client SDK uses the <strong>anon key</strong> (publishable); the <strong>service role key</strong> is only used in edge functions.</li>
            </ul>

            <h4 className="font-semibold mt-4 text-foreground">Data Protection</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>All database connections use TLS encryption.</li>
              <li>File uploads go to a dedicated storage bucket with configurable access policies.</li>
              <li>API keys and secrets are stored as encrypted environment variables, never in source code.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        )}

        {filteredSections.includes("troubleshooting") && (
        <AccordionItem value="troubleshooting" className="border rounded-xl px-4">
          <AccordionTrigger>
            <SectionHeader icon={Wrench} title="12. Troubleshooting & Common Issues" />
          </AccordionTrigger>
          <AccordionContent className="prose prose-sm max-w-none text-foreground">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b"><th className="text-left p-2">Problem</th><th className="text-left p-2">Likely Cause</th><th className="text-left p-2">Solution</th></tr></thead>
              <tbody>
                <tr className="border-b"><td className="p-2">Approval emails not sending</td><td className="p-2">Resend API key missing or invalid</td><td className="p-2">Verify <code>RESEND_API_KEY</code> secret is set and valid</td></tr>
                <tr className="border-b"><td className="p-2">Admin dashboard not loading</td><td className="p-2">User doesn't have admin role</td><td className="p-2">Check <code>user_roles</code> table for the user's entry</td></tr>
                <tr className="border-b"><td className="p-2">Data not appearing after save</td><td className="p-2">RLS policy blocking the operation</td><td className="p-2">Verify user auth status and role permissions</td></tr>
                <tr className="border-b"><td className="p-2">CSV import fails</td><td className="p-2">Header mismatch or invalid data</td><td className="p-2">Check CSV headers match expected column names exactly</td></tr>
                <tr className="border-b"><td className="p-2">Site settings not reflecting</td><td className="p-2">Cache not invalidated</td><td className="p-2">Hard-refresh the browser (Ctrl+Shift+R)</td></tr>
                <tr className="border-b"><td className="p-2">Registration stuck as pending</td><td className="p-2">Edge function error</td><td className="p-2">Check edge function logs for errors in <code>process-registration</code></td></tr>
                <tr className="border-b"><td className="p-2">Missing profiles in directory</td><td className="p-2">Query limit (1000 rows max)</td><td className="p-2">Use search/filters to narrow results; paginate large datasets</td></tr>
                <tr className="border-b"><td className="p-2">User can log in but has no profile</td><td className="p-2">Profile was deleted but auth account remains</td><td className="p-2">User needs to create a new profile at <code>/create-profile</code></td></tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
        )}

      </Accordion>
      )}
    </div>
  );
}
