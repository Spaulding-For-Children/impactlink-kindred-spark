import { useRef } from "react";
import { BookOpen, Users, FileText, Calendar, MessageSquare, Database, Shield, Globe, UserPlus, Search, Star, Upload, Download, CheckCircle, AlertTriangle, Info, Lightbulb, Settings, Mail, Phone, Building2, HelpCircle, Bookmark, BarChart3, Lock, Printer, Layout, Palette, Type, Eye, EyeOff, GripVertical, Pencil, Trash2, Plus, ArrowUp, ArrowDown, MousePointerClick, Navigation, MonitorSmartphone, Filter, ToggleLeft, ExternalLink, FileDown, FileUp, RefreshCw, Clock, ChevronRight, MapPin, Link2, Tag, Layers, Hash, Zap, UserCheck, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10 my-3">
      <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="text-sm text-foreground/80">{children}</div>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/10 my-3">
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div className="text-sm text-foreground/80">{children}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-accent/50 border border-border my-3">
      <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="text-sm text-foreground/80">{children}</div>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-2 my-3 text-sm text-foreground/80">
      {steps.map((step, i) => (
        <li key={i} className="leading-relaxed">{step}</li>
      ))}
    </ol>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function KeyboardShortcut({ keys }: { keys: string }) {
  return (
    <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted border border-border rounded">{keys}</kbd>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="p-3 border rounded-lg space-y-1">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h5 className="font-semibold text-sm">{title}</h5>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function AdminUserGuide() {
  const guideRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    document.body.classList.add("printing-guide");
    window.print();
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("printing-guide");
    }, { once: true });
  };

  const allSections = [
    "getting-started", "navigation", "site-settings", "registration", "profiles",
    "submissions", "resources", "events", "forums", "research-questions",
    "data-tools", "csv-operations", "i18n", "security", "troubleshooting"
  ];

  return (
    <div className="space-y-6 max-w-4xl" ref={guideRef} id="user-guide-content">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Comprehensive Platform User Guide
              </CardTitle>
              <CardDescription className="mt-1.5">
                The definitive reference for platform administrators. Covers every section, component, workflow, and best practice — from initial setup through daily operations.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handlePrint} className="shrink-0 print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground/80">
            <p>
              This guide is designed for <strong>platform administrators</strong> and covers all aspects of managing the platform.
              Whether you're onboarding new users, moderating content, configuring the site, or managing events — you'll find
              detailed instructions, interface walkthroughs, and pro tips throughout each section.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">10</p>
              <p className="text-xs text-muted-foreground">Admin Modules</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground">Languages</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Profile Types</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">15</p>
              <p className="text-xs text-muted-foreground">Guide Sections</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Table of Contents</CardTitle>
          <CardDescription>Click a section to jump directly to it.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { icon: Zap, label: "1. Getting Started", id: "getting-started" },
              { icon: Navigation, label: "2. Platform Navigation & Layout", id: "navigation" },
              { icon: Settings, label: "3. Site Settings (Content, Theme, Layout)", id: "site-settings" },
              { icon: UserPlus, label: "4. Registration & User Onboarding", id: "registration" },
              { icon: Users, label: "5. User Profiles & Directory", id: "profiles" },
              { icon: FileText, label: "6. Research Submissions", id: "submissions" },
              { icon: BookOpen, label: "7. Resources & Learning", id: "resources" },
              { icon: Calendar, label: "8. Events Management", id: "events" },
              { icon: MessageSquare, label: "9. Forums & Collaboration", id: "forums" },
              { icon: HelpCircle, label: "10. Research Questions", id: "research-questions" },
              { icon: Database, label: "11. Data & Tools Repository", id: "data-tools" },
              { icon: FileDown, label: "12. CSV Import & Export Operations", id: "csv-operations" },
              { icon: Globe, label: "13. Internationalization (i18n)", id: "i18n" },
              { icon: Shield, label: "14. Security & Access Control", id: "security" },
              { icon: RefreshCw, label: "15. Troubleshooting & FAQ", id: "troubleshooting" },
            ].map(({ icon: Icon, label, id }) => (
              <button
                key={label}
                onClick={() => document.getElementById(`ug-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors text-left w-full cursor-pointer"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/80 hover:text-primary transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Accordion type="multiple" defaultValue={allSections} className="space-y-3 print-expand-all">

        {/* 1. Getting Started */}
        <AccordionItem value="getting-started" id="ug-getting-started" className="border rounded-lg px-4 scroll-mt-24">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Zap} title="1. Getting Started" description="First-time setup and orientation for new administrators" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Welcome to the Admin Dashboard</h4>
            <p className="text-sm text-foreground/80 mb-4">
              The Admin Dashboard is your central hub for managing every aspect of the platform. Only users with the
              <Badge variant="outline" className="mx-1 bg-red-50 text-red-700 border-red-200">Admin</Badge>
              role can access this page. If you're reading this, you've been granted administrator privileges.
            </p>

            <h4 className="font-semibold text-foreground mb-2">How to Access the Admin Dashboard</h4>
            <StepList steps={[
              "Sign in to the platform using your admin credentials at /auth.",
              "Once logged in, navigate to /admin or click the 'Admin' link in the header navigation (visible only to admins).",
              "You'll see the Admin Dashboard with 10 tabs across the top — each manages a different area of the platform.",
              "If you're redirected to the homepage, your account may not have the admin role assigned yet.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Admin Dashboard Tabs Overview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <FeatureCard icon={Settings} title="Site" description="Configure homepage content, theme colors, fonts, and section layout/visibility." />
              <FeatureCard icon={UserPlus} title="Registrations" description="Review and approve/reject new user registration requests." />
              <FeatureCard icon={FileText} title="Submissions" description="Moderate user-submitted research papers and reports." />
              <FeatureCard icon={Users} title="Directory" description="Browse, search, edit, and export all user profiles." />
              <FeatureCard icon={BookOpen} title="Resources" description="Create, edit, and manage educational resources (workshops, toolkits, reading lists)." />
              <FeatureCard icon={Calendar} title="Events" description="Create and manage platform events (workshops, webinars, conferences)." />
              <FeatureCard icon={MessageSquare} title="Forums" description="Manage forum topics and moderate discussion posts." />
              <FeatureCard icon={HelpCircle} title="Research Q's" description="Oversee community-posted research questions." />
              <FeatureCard icon={Database} title="Data & Tools" description="Manage datasets, analysis tools, and ethics resources." />
              <FeatureCard icon={BookOpen} title="User Guide" description="This comprehensive guide (you're reading it now)." />
            </div>

            <h4 className="font-semibold text-foreground mb-2">First-Time Checklist</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Configure <strong>Site Settings → Content</strong> to customize the homepage hero text, section titles, and descriptions.</li>
              <li>Set up <strong>Site Settings → Theme</strong> with your organization's brand colors and fonts.</li>
              <li>Adjust <strong>Site Settings → Layout</strong> to choose which homepage sections are visible and their display order.</li>
              <li>Create initial <strong>Forum Topics</strong> so users have discussion spaces when they join.</li>
              <li>Add seed <strong>Resources</strong> and <strong>Events</strong> to populate the platform before inviting users.</li>
              <li>Populate the <strong>Data & Tools</strong> section with relevant datasets and assessment tools.</li>
            </ul>

            <Tip>
              Bookmark the <code>/admin</code> URL for quick access. The admin panel is entirely browser-based —
              no additional software or credentials are required beyond your admin account.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 2. Platform Navigation & Layout */}
        <AccordionItem value="navigation" id="ug-navigation" className="border rounded-lg px-4 scroll-mt-24">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Navigation} title="2. Platform Navigation & Layout" description="Understanding the header, footer, page structure, and responsive behavior" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Header Navigation</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The header is fixed at the top of every page and contains the primary navigation. It includes:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Logo / Brand</strong> — Clicking this navigates back to the homepage.</li>
              <li><strong>Navigation Links</strong> — Home, Directory, Collaboration, Resources, Events, Data & Tools.</li>
              <li><strong>Language Selector</strong> — A globe icon (🌐) that opens a dropdown for changing the display language.</li>
              <li><strong>Auth Button</strong> — Shows "Sign In" for guests, or the user's name with a dropdown menu for logged-in users.</li>
              <li><strong>Admin Link</strong> — Only visible to users with the admin role; links directly to /admin.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">User Dropdown Menu (Logged In)</h4>
            <p className="text-sm text-foreground/80 mb-3">When a user is signed in, clicking their name reveals:</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Profile Settings</strong> — Edit their profile information at /profile-settings.</li>
              <li><strong>Create Profile</strong> — If they haven't created a profile yet, this option appears.</li>
              <li><strong>Admin Dashboard</strong> — Only for admin-role users.</li>
              <li><strong>Sign Out</strong> — Logs the user out and redirects to the homepage.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Footer</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The footer appears at the bottom of every page and includes:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li>Platform tagline and description.</li>
              <li>Quick links to main sections (Directory, Collaboration, Resources, Events, Data & Tools).</li>
              <li>Support links (Contact, FAQ, Privacy Policy, Terms of Service).</li>
              <li>Copyright notice with the current year.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Landing Page (Homepage) Structure</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The homepage is composed of <strong>dynamically ordered sections</strong> that you control from the
              Admin → Site Settings → Layout tab. The default order is:
            </p>
            <ol className="list-decimal list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Hero</strong> — The main banner with headline, tagline, CTA buttons, and quick-action cards.</li>
              <li><strong>Directory</strong> — Preview of profile categories (Students, Researchers, Agencies) with counts.</li>
              <li><strong>Collaboration</strong> — Feature highlights (messaging, matching, forums, global network).</li>
              <li><strong>Data & Tools</strong> — Overview of datasets, analysis tools, and ethics resources.</li>
              <li><strong>Resources</strong> — Featured workshops, toolkits, reading lists, and research showcases.</li>
              <li><strong>Events</strong> — Upcoming events preview and calendar highlights.</li>
              <li><strong>Contact</strong> — Contact form and FAQ section.</li>
            </ol>

            <h4 className="font-semibold text-foreground mb-2">Responsive Design</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The platform is fully responsive. Key breakpoints:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Mobile (≤768px)</strong> — Navigation collapses into a hamburger menu. Grids stack vertically. Admin tabs show icons only.</li>
              <li><strong>Tablet (769–1024px)</strong> — Two-column grids. Admin tabs show icons with abbreviated labels.</li>
              <li><strong>Desktop (≥1025px)</strong> — Full multi-column layouts. Admin tabs show icons with full labels.</li>
            </ul>

            <Tip>
              On mobile devices, the Admin Dashboard tabs display only icons (no text labels). Hover or long-press
              on an icon to see its tooltip label.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">RTL (Right-to-Left) Support</h4>
            <p className="text-sm text-foreground/80">
              When Arabic is selected as the display language, the entire layout flips to right-to-left automatically.
              This includes navigation, content flow, form fields, and all UI components.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Site Settings */}
        <AccordionItem value="site-settings" id="ug-site-settings" className="border rounded-lg px-4 scroll-mt-24">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Settings} title="3. Site Settings (Content, Theme, Layout)" description="Customizing homepage content, visual theme, and section arrangement" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <p className="text-sm text-foreground/80 mb-4">
              The Site Settings tab is the <strong>first tab</strong> in the Admin Dashboard and is divided into three
              sub-tabs: <strong>Content</strong>, <strong>Theme</strong>, and <strong>Layout</strong>. Changes made here
              affect the <strong>public-facing landing page</strong> immediately after saving.
            </p>

            <Separator className="my-4" />

            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Type className="h-4 w-4" /> Content Tab
            </h4>
            <p className="text-sm text-foreground/80 mb-3">
              Edit the text that appears on each homepage section. Each section has its own card with editable fields.
            </p>

            <div className="space-y-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Hero Section</h5>
                <p className="text-xs text-muted-foreground mb-2">The main banner at the top of the homepage.</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li><strong>Badge Text</strong> — Small label above the title (e.g., "Bridging Research & Practice").</li>
                  <li><strong>Title</strong> — The main headline displayed prominently.</li>
                  <li><strong>Tagline</strong> — Secondary headline beneath the title.</li>
                  <li><strong>Description</strong> — Paragraph text below the tagline.</li>
                  <li><strong>Primary Button Text</strong> — Text for the main CTA button (default: "Join the Network").</li>
                  <li><strong>Secondary Button Text</strong> — Text for the secondary CTA button (default: "Explore Resources").</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Section Cards (Directory, Collaboration, Data & Tools, Resources, Events, Contact)</h5>
                <p className="text-xs text-muted-foreground">Each section has two editable fields:</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li><strong>Title</strong> — The section heading displayed on the homepage.</li>
                  <li><strong>Description</strong> — The descriptive text below the heading.</li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">How to Edit Content</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Site tab → Content sub-tab.",
              "Find the section you want to edit (e.g., 'Hero Section').",
              "Modify the text in any field — changes are local until you save.",
              "Click the 'Save [Section Name]' button at the bottom of that card.",
              "A success toast ('Settings saved') confirms the update.",
              "Navigate to the homepage to see your changes live.",
            ]} />

            <Note>
              Content changes are saved per-section. You must click 'Save' on each section card individually.
              Unsaved changes will be lost if you navigate away from the tab.
            </Note>

            <Separator className="my-4" />

            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Theme Tab
            </h4>
            <p className="text-sm text-foreground/80 mb-3">
              Customize the visual appearance of the platform including colors and typography.
            </p>

            <div className="space-y-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Theme Colors</h5>
                <p className="text-xs text-muted-foreground mb-2">
                  Colors are specified in <strong>HSL format</strong> (Hue Saturation% Lightness%). Example: <code>230 60% 25%</code>
                </p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li><strong>Primary Color</strong> — Used for buttons, links, active states, and key UI elements.</li>
                  <li><strong>Secondary / Accent Color</strong> — Used for secondary buttons, hover states, and complementary elements.</li>
                  <li><strong>Tertiary / Sage Color</strong> — Used for subtle backgrounds, borders, and tertiary accents.</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">
                  A color preview swatch appears next to each input so you can see the color as you type.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Typography</h5>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li><strong>Display Font</strong> — Used for headings and titles (e.g., "Playfair Display").</li>
                  <li><strong>Body Font</strong> — Used for paragraph text and UI elements (e.g., "DM Sans").</li>
                </ul>
              </div>
            </div>

            <Tip>
              Common HSL color values to try:
              <br/>• Navy blue: <code>230 60% 25%</code>
              <br/>• Forest green: <code>150 40% 30%</code>
              <br/>• Deep teal: <code>180 50% 25%</code>
              <br/>• Warm orange: <code>25 90% 50%</code>
              <br/>• Rich purple: <code>270 60% 35%</code>
            </Tip>

            <Separator className="my-4" />

            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Layout className="h-4 w-4" /> Layout Tab
            </h4>
            <p className="text-sm text-foreground/80 mb-3">
              Control which homepage sections are visible and their display order.
            </p>

            <h4 className="font-semibold text-foreground mb-2">Section Order & Visibility Controls</h4>
            <p className="text-sm text-foreground/80 mb-3">
              Each section appears as a row with the following controls:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Grip icon</strong> (⋮⋮) — Visual indicator of the draggable row.</li>
              <li><strong>Section name</strong> — The human-readable label (Hero, Directory, Collaboration, etc.).</li>
              <li><strong>↑ / ↓ arrows</strong> — Move the section up or down in the display order.</li>
              <li><strong>Eye toggle</strong> — Switch that shows/hides the section. Hidden sections appear dimmed with an "eye off" icon.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">How to Reorder Sections</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Site tab → Layout sub-tab.",
              "Find the section you want to move.",
              "Click the ↑ button to move it up one position, or ↓ to move it down.",
              "Repeat until you achieve your desired order.",
              "Click 'Save Layout' to apply the changes.",
              "Visit the homepage to verify the new order.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">How to Hide/Show a Section</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Site tab → Layout sub-tab.",
              "Find the section you want to toggle.",
              "Click the toggle switch next to the eye icon — turning it OFF hides the section.",
              "The row will appear dimmed when hidden.",
              "Click 'Save Layout' to apply.",
              "The hidden section will no longer render on the homepage.",
            ]} />

            <Warning>
              Hiding the Hero section will remove the main banner and CTA buttons from your homepage.
              This is intentional if you want a different entry point, but be aware it removes the primary
              call-to-action for new visitors.
            </Warning>

            <Tip>
              Use the Layout tab to create focused landing pages. For example, during a conference you could
              hide all sections except Hero and Events to drive registration traffic.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Registration & User Onboarding */}
        <AccordionItem value="registration" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={UserPlus} title="4. Registration & User Onboarding" description="Managing new user sign-ups, the approval workflow, and the complete onboarding process" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Overview</h4>
            <p className="text-sm text-foreground/80 mb-4">
              The platform uses a <strong>manual approval workflow</strong>. Prospective users submit a registration request
              with their details. Administrators review and approve or reject each request. Upon approval, the system creates
              an account and sends a password-reset email so the user can set up their credentials.
            </p>

            <h4 className="font-semibold text-foreground mb-2">The Complete Registration Flow</h4>
            <StepList steps={[
              "A visitor navigates to the Auth page (/auth) and fills out the registration form.",
              "The form collects: Full Name, Email, Phone Number, Organization, and Organization Type.",
              "The request is saved to the database with 'Pending' status.",
              "The request appears in Admin Dashboard → Registrations tab under 'Pending Registration Requests'.",
              "You review the request details: name, email, phone number, organization, and type.",
              "Optionally type admin notes in the text area below the request (these are included in rejection emails).",
              "Click 'Approve' to create the user account and trigger a welcome/password-reset email.",
              "Or click 'Reject' to decline — the applicant receives an email with your admin notes.",
              "The approved user receives an email with a link to set their password.",
              "After logging in for the first time, they're redirected to /create-profile.",
              "The user chooses their profile type (Student, Researcher, or Agency) and fills in their details.",
              "Their profile is now live in the directory.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Understanding the Registrations Tab</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The Registrations tab is split into two sections:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Pending Registration Requests</h5>
                <p className="text-xs text-muted-foreground">
                  Shows a count badge and lists all unprocessed requests. Each request shows the applicant's
                  name, email, phone, organization, organization type, and submission date. Below each request
                  is a text area for admin notes and Approve/Reject buttons.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Processed Requests</h5>
                <p className="text-xs text-muted-foreground">
                  Historical log of all approved and rejected requests. Shows the applicant name, status badge
                  (green for approved, red for rejected), email, organization, processing date, and any admin notes.
                  Useful for audit trails and reference.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Admin Action Buttons</h4>
            <div className="space-y-2 text-sm text-foreground/80 mb-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approve</Badge>
                <span>Creates the user account, sends invite email, moves request to "Processed" section.</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Reject</Badge>
                <span>Declines the request. Admin notes are sent to the applicant via email for context.</span>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Status Badges Explained</h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80 mb-4">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
                <span>— Awaiting admin review</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
                <span>— Account created</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
                <span>— Request declined</span>
              </div>
            </div>

            <Tip>
              Always provide clear, constructive notes when rejecting a registration — the applicant receives them.
              Examples: "Please re-apply with your institutional email" or "Your organization is not currently eligible."
            </Tip>

            <Warning>
              Approved registrations cannot be undone from this panel. If you approve someone by mistake,
              you'll need to delete their profile from the Directory tab and remove them from the backend authentication system.
            </Warning>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Review registrations daily to keep response times under 24 hours.</li>
              <li>Cross-reference the applicant's organization and email domain for legitimacy.</li>
              <li>Use admin notes to document your reasoning for audit purposes.</li>
              <li>Watch for duplicate registrations from the same email address.</li>
              <li>Processed requests remain visible for reference — use them to track approval patterns.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 5. User Profiles & Directory */}
        <AccordionItem value="profiles" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Users} title="5. User Profiles & Directory" description="Managing the member directory, profile types, search, editing, and CSV export" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Profile Types</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Student</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><strong>Fields:</strong></p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li>Name, Email, Bio, Location</li>
                  <li>University, Major, Year</li>
                  <li>Interests (comma-separated)</li>
                  <li>Website, Avatar URL</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">Researcher</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><strong>Fields:</strong></p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li>Name, Email, Bio, Location</li>
                  <li>Institution, Department, Title</li>
                  <li>Publications count, Focus Areas</li>
                  <li>Website, Avatar URL</li>
                </ul>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Agency</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><strong>Fields:</strong></p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  <li>Name, Email, Bio, Location</li>
                  <li>Agency Type, Employees, Founded</li>
                  <li>Focus Areas</li>
                  <li>Website, Avatar URL</li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Admin Directory Tab Features</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The Directory tab in the admin panel provides powerful tools for managing all user profiles:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2 mb-4">
              <li>
                <strong>Search Bar</strong> — Type to instantly filter profiles by name or email. The search is case-insensitive
                and matches partial strings.
              </li>
              <li>
                <strong>Type Filter Dropdown</strong> — Filter by profile type: All, Student, Researcher, or Agency.
                The filter works in combination with the search bar.
              </li>
              <li>
                <strong>Edit Button</strong> (pencil icon) — Opens a dialog with all editable fields for that profile.
                Fields are dynamically shown based on the profile type.
              </li>
              <li>
                <strong>Delete Button</strong> (trash icon) — Removes the profile permanently after a confirmation dialog.
              </li>
              <li>
                <strong>Export CSV Button</strong> (download icon) — Downloads all currently filtered profiles as a CSV file.
                The export respects your active search and type filters.
              </li>
              <li>
                <strong>Pagination</strong> — Profiles are paginated (10 per page) with Previous/Next controls and a page indicator.
              </li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">How to Edit a Profile</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Directory tab.",
              "Find the profile using the search bar or type filter.",
              "Click the pencil (edit) icon on the profile row.",
              "A dialog opens with all editable fields for that profile type.",
              "Modify any fields — name, email, location, bio, interests, and type-specific fields.",
              "For interests/focus areas, enter values as comma-separated text.",
              "Click 'Save Changes' to update the profile.",
              "Click 'Cancel' to discard changes.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">How to Export Profiles as CSV</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Directory tab.",
              "Optionally apply search/filter to export only a subset of profiles.",
              "Click the 'Export CSV' button in the top-right of the card.",
              "A CSV file downloads with all visible profile data.",
              "The CSV includes: Name, Email, Type, Location, Bio, Interests, and type-specific fields.",
              "Dates are formatted as YYYY-MM-DD for spreadsheet compatibility.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Public Directory Pages</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {[
                { path: "/directory", desc: "Combined directory with all profile types, search bar, and type filter tabs." },
                { path: "/students", desc: "Filtered view showing only student profiles with search." },
                { path: "/researchers", desc: "Filtered view showing only researcher profiles." },
                { path: "/agencies", desc: "Filtered view showing only agency profiles." },
                { path: "/profile/:id", desc: "Individual profile detail page showing all information." },
              ].map(({ path, desc }) => (
                <div key={path} className="flex items-start gap-2 p-2 text-sm">
                  <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono shrink-0">{path}</code>
                  <span className="text-muted-foreground text-xs">{desc}</span>
                </div>
              ))}
            </div>

            <Tip>
              Encourage users to fill out all optional fields (bio, interests, website).
              Complete profiles rank higher in the Smart Matching algorithm and appear more professional in the directory.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Profile Settings (User Side)</h4>
            <p className="text-sm text-foreground/80">
              Users can update their own profiles at <strong>/profile-settings</strong>. They can edit all fields
              except their profile type. The form validates required fields and shows success/error feedback.
              Users access their settings from the header navigation dropdown when logged in.
            </p>

            <Warning>
              Deleting a profile is permanent. The user's authentication account remains active but they'll need to create
              a new profile. Always consider contacting the user before deletion unless it's clearly spam or a violation.
            </Warning>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Research Submissions */}
        <AccordionItem value="submissions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={FileText} title="6. Research Submissions" description="Reviewing, moderating, and managing user-submitted research content" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Submission Types</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="p-2 border rounded-lg text-center">
                <Badge variant="outline" className="mb-1">Student Project</Badge>
                <p className="text-xs text-muted-foreground">Undergraduate/graduate work</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <Badge variant="outline" className="mb-1">Faculty Research</Badge>
                <p className="text-xs text-muted-foreground">Academic papers & studies</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <Badge variant="outline" className="mb-1">Agency Report</Badge>
                <p className="text-xs text-muted-foreground">Organizational reports</p>
              </div>
              <div className="p-2 border rounded-lg text-center">
                <Badge variant="outline" className="mb-1">Global Showcase</Badge>
                <p className="text-xs text-muted-foreground">International research</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">How Users Submit Research</h4>
            <StepList steps={[
              "Users navigate to /resources and click the 'Research Submissions' tab.",
              "They click 'Submit Research' to open the submission dialog.",
              "They select a submission type from the four categories.",
              "They fill in: Title, Description, and Tags (comma-separated).",
              "They upload a file (PDF, DOC, etc.) — maximum file size is enforced.",
              "Click 'Submit' — the submission enters 'Pending' status.",
              "Users can track their submissions in the 'My Submissions' tab.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Admin Moderation Workflow</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Submissions tab.",
              "The header shows the count of pending submissions.",
              "Each submission card displays: title, status badge, author name, submission date, description, type, and tags.",
              "Click 'View File' link to download and review the attached document.",
              "Click 'Approve' (green button) to make the submission publicly visible.",
              "Click 'Reject' (red button) to decline the submission.",
              "Click 'Delete' (trash icon) to permanently remove the submission and its file.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Status Flow</h4>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mb-4">
              <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>
              <span>→</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Approved</Badge>
              <span>or</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>
            </div>

            <Note>
              <strong>Visibility rules:</strong> Only approved submissions appear in the public research library.
              Authors can always see their own submissions regardless of status. Admins and moderators can see all submissions.
            </Note>

            <Tip>
              Review file attachments before approving. Ensure the document is complete,
              properly formatted, and doesn't contain sensitive or inappropriate content.
              Check that the submission type matches the actual content.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Aim to review submissions within 48 hours to keep contributors engaged.</li>
              <li>Encourage users to add descriptive tags — these improve discoverability.</li>
              <li>Users can delete their own submissions from the "My Submissions" tab.</li>
              <li>Consider creating a submissions guideline document to share with users.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 7. Resources & Learning */}
        <AccordionItem value="resources" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={BookOpen} title="7. Resources & Learning" description="Managing workshops, toolkits, reading lists, bookmarks, and educational content" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Resource Types & Formats</h4>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Types</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">Workshop</Badge>
                  <Badge variant="outline">Toolkit</Badge>
                  <Badge variant="outline">Reading</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Formats</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">Live</Badge>
                  <Badge variant="outline">Recorded</Badge>
                  <Badge variant="outline">PDF</Badge>
                  <Badge variant="outline">Article</Badge>
                  <Badge variant="outline">Report</Badge>
                  <Badge variant="outline">Book</Badge>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Resource Fields Explained</h4>
            <div className="p-3 border rounded-lg mb-4 text-xs text-muted-foreground space-y-1">
              <p>• <strong>Title</strong> (required) — Name of the resource.</p>
              <p>• <strong>Description</strong> (required) — Brief summary.</p>
              <p>• <strong>Category</strong> (required) — Organizational category within its type.</p>
              <p>• <strong>Resource Type</strong> (required) — Workshop, Toolkit, or Reading.</p>
              <p>• <strong>Format</strong> (required) — Live, Recorded, PDF, Article, Report, or Book.</p>
              <p>• <strong>Author</strong> — Creator or instructor name.</p>
              <p>• <strong>External URL</strong> — Link to the resource online.</p>
              <p>• <strong>File URL</strong> — Direct download link.</p>
              <p>• <strong>Thumbnail URL</strong> — Image preview URL.</p>
              <p>• <strong>Duration</strong> — Length of the resource (e.g., "45 min", "2 hours").</p>
              <p>• <strong>Tags</strong> — Comma-separated keywords for searchability.</p>
              <p>• <strong>Publication Date</strong> — When the resource was published.</p>
              <p>• <strong>Featured</strong> — Toggle to highlight on the homepage section.</p>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Adding a Resource Manually</h4>
            <StepList steps={[
              "Go to Admin Dashboard → Resources tab and click 'Add Resource'.",
              "Fill in the required fields: title, description, category, resource type, and format.",
              "Add optional fields as needed: author, URLs, duration, tags, publication date.",
              "Toggle 'Featured' to highlight the resource on the platform.",
              "Click 'Save' to publish the resource immediately.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Bulk Import via CSV</h4>
            <StepList steps={[
              "Click the 'Import CSV' button in the Resources tab.",
              "Download the CSV template to see the expected column format.",
              "Prepare your CSV with required columns: title, description, resource_type, format, category.",
              "Upload the CSV file — a preview dialog shows parsed data and any validation errors.",
              "Review the preview, then click 'Import' to add all valid rows.",
            ]} />

            <Tip>
              When using CSV import, ensure <strong>resource_type</strong> is one of: workshop, toolkit, reading.
              And <strong>format</strong> is one of: live, recorded, pdf, article, report, book.
              Invalid values will cause import errors.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">User-Facing Resources Page (/resources)</h4>
            <p className="text-sm text-foreground/80 mb-2">The Resources page has five tabs for users:</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Workshops & Webinars</strong> — Live and recorded sessions with duration info and registration links.</li>
              <li><strong>Toolkits & Guides</strong> — Downloadable PDFs, articles, and reports organized by category.</li>
              <li><strong>Reading Lists</strong> — Curated books and publications with author and publication date.</li>
              <li><strong>Research Submissions</strong> — Community-submitted research (see Section 6).</li>
              <li><strong>Saved</strong> (logged-in only) — Bookmarked resources the user has saved for later access.</li>
            </ul>

            <Note>
              The bookmarking feature is user-specific. Each user sees only their own saved resources.
              Resources display view counts and download counts for popularity tracking.
            </Note>
          </AccordionContent>
        </AccordionItem>

        {/* 8. Events Management */}
        <AccordionItem value="events" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Calendar} title="8. Events Management" description="Creating, editing, managing, and tracking platform events and registrations" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Event Types</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">Workshop</Badge>
              <Badge variant="outline">Webinar</Badge>
              <Badge variant="outline">Conference</Badge>
              <Badge variant="outline">Networking</Badge>
              <Badge variant="outline">Training</Badge>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Event Form Fields</h4>
            <div className="p-3 border rounded-lg mb-4 text-xs text-muted-foreground space-y-1">
              <p>• <strong>Title</strong> (required) — Name of the event.</p>
              <p>• <strong>Description</strong> (required) — Detailed event description.</p>
              <p>• <strong>Event Type</strong> (required) — Workshop, Webinar, Conference, Networking, or Training.</p>
              <p>• <strong>Start Date & Time</strong> (required) — When the event begins (datetime picker).</p>
              <p>• <strong>End Date & Time</strong> (required) — When the event ends.</p>
              <p>• <strong>Virtual Toggle</strong> — Switch between virtual and in-person event.</p>
              <p>• <strong>Virtual Link</strong> — Meeting URL (shown when virtual toggle is ON).</p>
              <p>• <strong>Location</strong> — Physical address (shown when virtual toggle is OFF).</p>
              <p>• <strong>Host Name</strong> — Name of the person/team hosting.</p>
              <p>• <strong>Host Organization</strong> — Organization behind the event.</p>
              <p>• <strong>Max Attendees</strong> — Optional capacity limit.</p>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Creating an Event</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Events tab.",
              "Click the 'Add Event' button in the top-right corner.",
              "A dialog opens with the event creation form.",
              "Fill in all required fields (title, description, type, start/end dates).",
              "Toggle 'Virtual Event' switch — this changes whether you see the Virtual Link or Location field.",
              "Add optional fields: host name, host organization, max attendees.",
              "Click 'Create' to publish the event.",
              "The event appears immediately in the events list and on the public Events page.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Editing an Existing Event</h4>
            <StepList steps={[
              "Find the event in the Events tab list.",
              "Click the edit button (pencil icon) on the event row.",
              "The same dialog opens pre-populated with the event's current data.",
              "Modify any fields as needed.",
              "Click 'Update' to save changes.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Deleting an Event</h4>
            <StepList steps={[
              "Find the event in the Events tab list.",
              "Click the delete button (trash icon) — a confirmation dialog appears.",
              "The dialog warns: 'This will also remove all registrations.'",
              "Click 'Delete' to confirm or 'Cancel' to abort.",
            ]} />

            <Warning>
              Deleting an event permanently removes all user registrations for that event.
              Users will not receive automatic notification of the cancellation.
              Consider notifying registered attendees before deleting.
            </Warning>

            <h4 className="font-semibold text-foreground mt-4 mb-2">User-Facing Event Features (/events)</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
              <li><strong>Events List</strong> — Browse upcoming events with filtering by event type. Each card shows title, date, type badge, virtual/in-person indicator, and host organization.</li>
              <li><strong>Event Calendar</strong> — Monthly calendar view with events plotted on their dates. Click a date to see events scheduled for that day.</li>
              <li><strong>Registration</strong> — Logged-in users can register for events with a single click. The system checks if they're already registered.</li>
              <li><strong>My Registrations</strong> — Users see their upcoming and past event registrations with the ability to cancel.</li>
            </ul>

            <Tip>
              Create events at least 2 weeks in advance to allow sufficient registration time.
              Always include a descriptive event type and host organization — these help users find relevant events.
              Set max attendees for events with limited capacity to create urgency.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 9. Forums & Collaboration */}
        <AccordionItem value="forums" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={MessageSquare} title="9. Forums & Collaboration" description="Managing forum topics, discussion posts, partner matching, and the collaboration portal" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Forum Topics Management (Admin)</h4>
            <p className="text-sm text-foreground/80 mb-3">
              Forum topics are the top-level categories that organize discussion posts. Admins create and manage these from the Forums tab.
            </p>

            <h4 className="font-semibold text-foreground mb-2">Forum Topic Fields</h4>
            <div className="p-3 border rounded-lg mb-4 text-xs text-muted-foreground space-y-1">
              <p>• <strong>Name</strong> (required) — The topic title (e.g., "Methodology Discussion").</p>
              <p>• <strong>Description</strong> — Brief explanation of what this topic covers.</p>
              <p>• <strong>Icon</strong> — Lucide icon name (e.g., "BookOpen", "Globe", "Shield", "Users").</p>
              <p>• <strong>Color</strong> — Color theme for the topic badge (e.g., "sage", "blue", "amber").</p>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Creating a Forum Topic</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Forums tab.",
              "Click 'Add Topic' to open the creation form.",
              "Enter the topic name and description.",
              "Choose an icon name and color theme.",
              "Click 'Create' — the topic appears immediately.",
              "Users can now create posts within this topic.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">The Collaboration Portal (/collaboration)</h4>
            <p className="text-sm text-foreground/80 mb-2">The Collaboration page has five tabs accessible to all logged-in users:</p>

            <div className="space-y-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" /> Research Questions
                </h5>
                <p className="text-xs text-muted-foreground">
                  Users post research questions with topics, regions, and target populations.
                  Others browse and find questions aligned with their expertise. Status lifecycle:
                  Open → In Progress → Completed → Closed.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Smart Matching
                </h5>
                <p className="text-xs text-muted-foreground">
                  Algorithm-powered partner recommendations based on shared interests and geographic proximity.
                  Each match shows a percentage score and a list of shared interests.
                  Users can send collaboration requests directly from the match card.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Forums
                </h5>
                <p className="text-xs text-muted-foreground">
                  Thematic discussion boards organized by the topics you create. Users create posts with titles and content,
                  then reply in threads. Navigation: Topics → Posts → Replies with breadcrumb-style back buttons.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Global Network
                </h5>
                <p className="text-xs text-muted-foreground">
                  Visual overview of all registered members across the platform.
                  Shows the breadth and diversity of the community.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <Users className="h-4 w-4" /> My Collaborations
                </h5>
                <p className="text-xs text-muted-foreground">
                  Users manage their sent and received collaboration requests.
                  Actions: accept, decline, or cancel pending requests.
                  Statuses: Pending → Accepted/Declined.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">How the Smart Matching Algorithm Works</h4>
            <p className="text-sm text-foreground/80 mb-2">
              The matching system uses a database function (<code>get_partner_matches</code>) that calculates:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Interest overlap</strong> — Number of shared interests/focus areas between profiles.</li>
              <li><strong>Geographic proximity</strong> — Users in the same location get a higher match score.</li>
              <li>Results are sorted by match score (highest first), showing the most compatible partners at the top.</li>
            </ul>

            <Tip>
              Create forum topics that align with your community's research interests.
              Good starter topics: "Methodology Discussion", "Data Sharing", "Grant Opportunities", "Regional Studies", "Ethics & IRB".
              The matching system requires users to have complete profiles with interests — encourage new users to add at least 3-5.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 10. Research Questions */}
        <AccordionItem value="research-questions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={HelpCircle} title="10. Research Questions" description="Overseeing community-posted research questions and their lifecycle" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Overview</h4>
            <p className="text-sm text-foreground/80 mb-4">
              Research questions are community-contributed topics that members want to explore or find collaborators for.
              They include rich metadata to facilitate matching with interested researchers.
            </p>

            <h4 className="font-semibold text-foreground mb-2">Research Question Fields</h4>
            <div className="p-3 border rounded-lg mb-4 text-xs text-muted-foreground space-y-1">
              <p>• <strong>Title</strong> — The main question or research topic.</p>
              <p>• <strong>Description</strong> — Detailed explanation of the research question.</p>
              <p>• <strong>Status</strong> — Open, In Progress, Completed, or Closed.</p>
              <p>• <strong>Topics</strong> — Related research areas (array of tags).</p>
              <p>• <strong>Regions</strong> — Geographic areas relevant to the question.</p>
              <p>• <strong>Populations</strong> — Target populations for the research.</p>
              <p>• <strong>Author</strong> — The user who posted the question (linked to their profile).</p>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Status Lifecycle</h4>
            <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/80 mb-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">Open</Badge>
              <span>→</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700">In Progress</Badge>
              <span>→</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Completed</Badge>
              <span>or</span>
              <Badge variant="outline" className="bg-muted text-muted-foreground">Closed</Badge>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Admin Actions in Research Q's Tab</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>View all research questions with their status, author name, creation date, description, topics, and populations.</li>
              <li>Each question card shows color-coded status badges for quick scanning.</li>
              <li>Delete inappropriate or duplicate questions using the trash icon (confirmation dialog required).</li>
              <li>Authors can manage their own questions — update status, edit content, or delete.</li>
            </ul>

            <Tip>
              Periodically review old "Open" questions. If they've been inactive for 3+ months,
              consider reaching out to the author to update the status or close them to keep the board fresh.
            </Tip>

            <Note>
              Research questions are also accessible from the Collaboration portal (/collaboration → Research Questions tab),
              where users can browse and discover questions aligned with their expertise.
            </Note>
          </AccordionContent>
        </AccordionItem>

        {/* 11. Data & Tools */}
        <AccordionItem value="data-tools" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Database} title="11. Data & Tools Repository" description="Managing datasets, analysis tools, and ethics resources with manual and bulk import options" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Three Sub-Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">📊 Datasets</h5>
                <p className="text-xs text-muted-foreground mb-2">External data sources with detailed metadata.</p>
                <p className="text-xs text-muted-foreground"><strong>Fields:</strong> Title, Description, Source Organization, Source Type, Data Format, Access URL, Documentation URL, Topics, Regions, Coverage Dates, Featured.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">🔧 Analysis Tools</h5>
                <p className="text-xs text-muted-foreground mb-2">Software and assessment instruments.</p>
                <p className="text-xs text-muted-foreground"><strong>Fields:</strong> Short Name, Full Name, Description, Tool Type, Category, License Type, Access URL, Documentation URL, Featured.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">⚖️ Ethics Resources</h5>
                <p className="text-xs text-muted-foreground mb-2">Ethical guidelines and frameworks.</p>
                <p className="text-xs text-muted-foreground"><strong>Fields:</strong> Title, Description, Resource Type, Jurisdiction, External URL, Tags, Featured.</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">The Admin Data & Tools Tab</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The Data & Tools tab in the admin panel has <strong>three sub-tabs</strong> (Datasets, Tools, Ethics) with count badges.
              Each sub-tab provides:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Add button</strong> — Opens a form dialog for manual entry.</li>
              <li><strong>Template button</strong> — Downloads a CSV template with correct headers and a sample row.</li>
              <li><strong>Import CSV button</strong> — Opens file picker for bulk import.</li>
              <li><strong>Item cards</strong> — Each item shows title, key metadata, and edit/delete buttons.</li>
              <li><strong>Edit button</strong> (pencil icon) — Re-opens the form dialog pre-populated with the item's data.</li>
              <li><strong>Delete button</strong> (trash icon) — Removes the item permanently.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Adding Items Manually</h4>
            <StepList steps={[
              "Switch to the desired sub-tab (Datasets, Tools, or Ethics).",
              "Click the 'Add Dataset/Tool/Ethics Resource' button.",
              "A dialog opens with all fields for that category.",
              "Fill in required fields (marked with validation — the Save button is disabled until they're complete).",
              "For array fields (Topics, Regions, Tags): enter comma-separated values.",
              "Toggle 'Featured' to highlight the item on the public page.",
              "Click 'Create' to save.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Editing Items</h4>
            <StepList steps={[
              "Find the item in the list.",
              "Click the pencil (edit) icon.",
              "The same form dialog opens with the item's current data pre-filled.",
              "Modify any fields.",
              "Click 'Update' to save changes.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Source Types for Datasets</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">Federal</Badge>
              <Badge variant="outline">State</Badge>
              <Badge variant="outline">Academic</Badge>
              <Badge variant="outline">International</Badge>
              <Badge variant="outline">Private</Badge>
              <Badge variant="outline">NGO</Badge>
            </div>

            <Tip>
              For datasets, always include the <strong>source_organization</strong> and <strong>access_url</strong> fields.
              Users rely on these to find and access the actual data. Include coverage dates when available
              to help researchers filter by time period.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">User-Facing Data & Tools Page (/data-tools)</h4>
            <p className="text-sm text-foreground/80">
              The public Data & Tools page displays all three categories in a tabbed layout.
              Users can search, filter by type/category, and toggle to see only featured items.
              Each item shows links to access the data/tool and its documentation.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* 12. CSV Import & Export Operations */}
        <AccordionItem value="csv-operations" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={FileDown} title="12. CSV Import & Export Operations" description="Bulk data management: importing data via CSV and exporting profiles and content" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">CSV Import (Data & Tools, Resources)</h4>
            <p className="text-sm text-foreground/80 mb-3">
              CSV import is available in two admin areas: <strong>Data & Tools</strong> (Datasets, Tools, Ethics) and <strong>Resources</strong>.
              The workflow is the same for all:
            </p>

            <h4 className="font-semibold text-foreground mb-2">Complete Import Workflow</h4>
            <StepList steps={[
              "Click the 'Template' button to download a CSV template with correct headers and a sample data row.",
              "Open the template in a spreadsheet application (Excel, Google Sheets, etc.).",
              "Add your data rows below the header row. Keep the header row unchanged.",
              "For array fields (topics, regions, tags): use semicolons to separate values within a cell (e.g., 'child abuse;neglect').",
              "For boolean fields (featured): use 'true' or 'false'.",
              "Save the file as CSV (comma-separated values).",
              "Click the 'Import CSV' button and select your file.",
              "A preview dialog appears showing: count of valid rows (✓), count of errors (✗), and error details.",
              "Review the preview — each valid row shows its title/name and key metadata.",
              "If there are errors, they describe which row number and which required field is missing.",
              "Click 'Import [N] [Items]' to add all valid rows to the database.",
              "A success toast confirms the import. The list refreshes automatically.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">CSV Format Rules</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li>The <strong>first row must be headers</strong> matching the template exactly (case-insensitive).</li>
              <li>Values containing commas must be <strong>wrapped in double quotes</strong>.</li>
              <li>Array values use <strong>semicolons</strong> as separators (e.g., "child abuse;neglect").</li>
              <li>Missing required fields cause the row to be <strong>skipped with an error message</strong>.</li>
              <li>Valid rows are imported even if some rows have errors.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Required Columns by Category</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Datasets</h5>
                <p className="text-xs text-muted-foreground">Required: title, description, source_organization</p>
                <p className="text-xs text-muted-foreground mt-1">Optional: source_type, data_format, access_url, documentation_url, topics, regions, featured</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Tools</h5>
                <p className="text-xs text-muted-foreground">Required: name, full_name, description</p>
                <p className="text-xs text-muted-foreground mt-1">Optional: tool_type, category, access_url, documentation_url, license_type, featured</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Ethics</h5>
                <p className="text-xs text-muted-foreground">Required: title, description</p>
                <p className="text-xs text-muted-foreground mt-1">Optional: resource_type, jurisdiction, external_url, tags, featured</p>
              </div>
            </div>

            <Separator className="my-4" />

            <h4 className="font-semibold text-foreground mb-2">CSV Export (Directory Profiles)</h4>
            <p className="text-sm text-foreground/80 mb-3">
              The Directory tab provides a bulk export feature that downloads all filtered profiles as a CSV file.
            </p>

            <h4 className="font-semibold text-foreground mb-2">Export Workflow</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Directory tab.",
              "Optionally use the search bar and/or type filter to narrow the profiles you want to export.",
              "Click the 'Export CSV' button in the card header.",
              "A file named 'profiles_export.csv' (or similar) downloads to your browser.",
              "Open it in your preferred spreadsheet application.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Export Includes</h4>
            <p className="text-sm text-foreground/80 mb-2">The exported CSV contains columns for all profile fields:</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Name, Email, Profile Type, Location, Bio, Interests/Focus Areas</li>
              <li>University, Major, Year (Students)</li>
              <li>Institution, Department, Title, Publications (Researchers)</li>
              <li>Agency Type, Employees, Founded (Agencies)</li>
              <li>Website, Created Date</li>
            </ul>

            <Tip>
              Use the search and type filters <strong>before</strong> exporting to get a targeted export.
              For example, filter by "Researcher" type to export only researcher profiles for an outreach campaign.
            </Tip>

            <Warning>
              CSV exports contain email addresses and personal information. Handle exported files according to your
              organization's data privacy policies. Do not share exports publicly.
            </Warning>
          </AccordionContent>
        </AccordionItem>

        {/* 13. Internationalization */}
        <AccordionItem value="i18n" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Globe} title="13. Internationalization (i18n)" description="Multi-language support, RTL layout, and translation management" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Supported Languages</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">🇺🇸 English (en)</Badge>
              <Badge variant="outline">🇪🇸 Spanish (es)</Badge>
              <Badge variant="outline">🇫🇷 French (fr)</Badge>
              <Badge variant="outline">🇧🇷 Portuguese (pt)</Badge>
              <Badge variant="outline">🇸🇦 Arabic (ar)</Badge>
            </div>

            <h4 className="font-semibold text-foreground mb-2">How Users Switch Languages</h4>
            <StepList steps={[
              "Click the globe icon (🌐) in the header navigation bar.",
              "A dropdown appears showing all five supported languages.",
              "Select the desired language — the page content updates immediately.",
              "The selection is saved in the browser's localStorage and remembered on future visits.",
              "On first visit, the system auto-detects the browser's language preference.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">What Is Currently Translated</h4>
            <p className="text-sm text-foreground/80 mb-2">
              The <strong>landing page</strong> (homepage) is fully translated, including:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li>Navigation menu items and header text.</li>
              <li>Hero section (title, subtitle, CTAs, badge text).</li>
              <li>All homepage sections (Directory, Collaboration, Data & Tools, Resources, Events, Contact).</li>
              <li>Footer (links, tagline, copyright, social links).</li>
            </ul>

            <Note>
              Inner pages (Directory, Collaboration, Resources, Events, Data Tools, Auth, Admin) currently
              display in English regardless of the language selection. Content from the database (like profile data,
              event titles, etc.) is stored in the language it was entered in.
            </Note>

            <h4 className="font-semibold text-foreground mt-4 mb-2">RTL (Arabic) Layout</h4>
            <p className="text-sm text-foreground/80 mb-2">
              When Arabic is selected, the platform automatically:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li>Flips the entire layout from left-to-right to right-to-left.</li>
              <li>Mirrors navigation, form fields, buttons, and content flow.</li>
              <li>Adjusts text alignment for Arabic readability.</li>
              <li>Reverses icon positions and directional elements.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">How Translations Work (Technical)</h4>
            <p className="text-sm text-foreground/80 mb-2">
              Translation files are located at <code>src/i18n/locales/[lang].json</code>. The platform uses
              the <strong>react-i18next</strong> library.
            </p>
            <StepList steps={[
              "Open the locale file for the target language: src/i18n/locales/[lang].json",
              "Translation keys follow a nested structure: section.subsection.key",
              "Add or modify the value for each key in the target language.",
              "All locale files must have the same key structure — missing keys fall back to English.",
              "Test by switching to that language via the language selector.",
            ]} />

            <Tip>
              When adding translations for new pages, maintain the same nested structure used in
              <code> en.json</code>. Missing keys gracefully fall back to English, so you can translate
              incrementally without breaking the site. The Admin Site Settings → Content tab content
              (from the database) is separate from the i18n translations and is not translated automatically.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 14. Security & Access Control */}
        <AccordionItem value="security" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Shield} title="14. Security & Access Control" description="Roles, permissions, data protection, and authentication" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Role System</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge className="bg-red-50 text-red-700 border-red-200 shrink-0">Admin</Badge>
                <div>
                  <p className="text-sm text-foreground/80">Full access to all admin features, CRUD on all content, user management, role assignment.</p>
                  <p className="text-xs text-muted-foreground mt-1">Can: approve registrations, moderate submissions, manage all content, delete any profile, edit site settings.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 shrink-0">Moderator</Badge>
                <div>
                  <p className="text-sm text-foreground/80">Can view and update research submissions. Limited admin access.</p>
                  <p className="text-xs text-muted-foreground mt-1">Can: view all submissions, approve/reject submissions. Cannot: manage users, change settings, delete content.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 shrink-0">User</Badge>
                <div>
                  <p className="text-sm text-foreground/80">Standard access: create profile, submit research, register for events, collaborate, bookmark resources.</p>
                  <p className="text-xs text-muted-foreground mt-1">Can: manage own profile, submit research, register for events, send collaboration requests, bookmark resources, post in forums.</p>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Row-Level Security (RLS)</h4>
            <p className="text-sm text-foreground/80 mb-2">
              Every database table has RLS policies that control data access at the row level:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mb-4">
              <li><strong>Public-read tables</strong> (profiles, events, resources, datasets, tools, ethics resources, forums, research questions) — Anyone can read; only admins or owners can modify.</li>
              <li><strong>User-specific tables</strong> (bookmarks, event registrations, collaborations) — Users can only access their own data.</li>
              <li><strong>Admin-only tables</strong> (registration_requests, user_roles, site_settings) — Only admins can view and manage.</li>
              <li><strong>Submission moderation</strong> — Authors see their own; admins/moderators see all; public sees only approved.</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-2">Authentication Flow</h4>
            <StepList steps={[
              "Users navigate to /auth to sign in or register.",
              "New users submit a registration request (see Section 4).",
              "Admins approve the request, which creates the user account.",
              "The user receives a password-reset email to set their password.",
              "After logging in, they're directed to create their profile.",
              "Sessions are managed via secure tokens with automatic refresh.",
              "Users can update their password at /update-password.",
            ]} />

            <h4 className="font-semibold text-foreground mt-4 mb-2">Admin Access Management</h4>
            <StepList steps={[
              "Admin access is determined by the user_roles table — users with role = 'admin' get full access.",
              "The /admin route checks for admin role on load and redirects non-admins to the homepage.",
              "Admin functions in the UI are only visible to admin-role users.",
              "To grant admin access: add a row to user_roles with the user's auth ID and role = 'admin'.",
            ]} />

            <Warning>
              Be extremely careful when granting admin roles. Admins can delete any profile, submission, resource,
              or event on the platform. Only assign admin access to fully trusted team members.
            </Warning>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Security Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Regularly audit the user_roles table to ensure only authorized users have elevated permissions.</li>
              <li>Review processed registration requests to detect any suspicious patterns.</li>
              <li>Monitor forum posts and research questions for spam or inappropriate content.</li>
              <li>Never share admin credentials — each admin should have their own account.</li>
              <li>Handle CSV exports containing personal data according to privacy policies.</li>
              <li>Periodically review and remove inactive or suspicious accounts.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 15. Troubleshooting & FAQ */}
        <AccordionItem value="troubleshooting" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={RefreshCw} title="15. Troubleshooting & FAQ" description="Common issues, solutions, and frequently asked questions" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Common Issues & Solutions</h4>

            <div className="space-y-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"I approved a registration but the user can't log in"</h5>
                <p className="text-xs text-muted-foreground">
                  The user needs to check their email for the password-reset link. It may be in their spam/junk folder.
                  The link expires after a set period — if expired, the user can use the "Forgot Password" flow on the login page.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"CSV import shows all rows as errors"</h5>
                <p className="text-xs text-muted-foreground">
                  Check that your CSV header row matches the template exactly. Headers are case-insensitive but must use
                  the correct column names. Download a fresh template and compare. Ensure you're using commas (not semicolons)
                  as the column delimiter.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"Site settings changes aren't showing on the homepage"</h5>
                <p className="text-xs text-muted-foreground">
                  Make sure you clicked the 'Save' button for that specific section. Each content card must be saved individually.
                  Try doing a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) on the homepage. Settings are cached for 5 minutes.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"I can't access the admin dashboard"</h5>
                <p className="text-xs text-muted-foreground">
                  Verify you're signed in with an account that has the 'admin' role in the user_roles table.
                  The /admin route checks your role on load — non-admins are automatically redirected to the homepage.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"Events show wrong times for users in different time zones"</h5>
                <p className="text-xs text-muted-foreground">
                  Event dates are stored in UTC. The browser displays them in the user's local timezone.
                  When creating events, be aware of timezone differences and clearly indicate the timezone
                  in the event description.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"Smart Matching shows no results for a user"</h5>
                <p className="text-xs text-muted-foreground">
                  The matching algorithm requires profiles with interests/focus areas filled in.
                  If the user's profile has no interests, the system can't find matches.
                  Advise the user to add at least 3-5 interests in their Profile Settings.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">"Language switching doesn't affect inner pages"</h5>
                <p className="text-xs text-muted-foreground">
                  This is expected behavior. Currently, only the homepage (landing page) is fully translated.
                  Inner pages (Directory, Resources, Events, etc.) display in English. Database content
                  (profile names, event titles) is stored in the language it was entered in.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Frequently Asked Questions</h4>

            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Q: Can I undo a profile deletion?</h5>
                <p className="text-xs text-muted-foreground">No. Profile deletions are permanent. The user can create a new profile after logging in again, but their previous data, collaborations, and submissions will be lost.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Q: How many admins can the platform have?</h5>
                <p className="text-xs text-muted-foreground">There's no limit. Any user can be given admin access by adding a row to the user_roles table. However, keep the admin list small for security.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Q: Do site settings override the i18n translations?</h5>
                <p className="text-xs text-muted-foreground">Yes. If you set custom text in Site Settings → Content, that text takes priority over the i18n translation files. The i18n translations serve as fallbacks when no custom text is configured.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Q: Can I import resources and data tools at the same time?</h5>
                <p className="text-xs text-muted-foreground">No. Each CSV import is per-category. You need to switch to the correct sub-tab (Datasets, Tools, Ethics, or Resources) and import separately for each.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">Q: What happens when a user deletes their account?</h5>
                <p className="text-xs text-muted-foreground">Users can delete their own profile. Their authentication account remains active, but they won't have a public profile. Their forum posts, research questions, and submissions remain attributed to them.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Reference: All Platform URLs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { path: "/", label: "Homepage (Landing Page)" },
              { path: "/auth", label: "Login / Register" },
              { path: "/directory", label: "All Profiles Directory" },
              { path: "/students", label: "Students Directory" },
              { path: "/researchers", label: "Researchers Directory" },
              { path: "/agencies", label: "Agencies Directory" },
              { path: "/profile/:id", label: "Individual Profile Detail" },
              { path: "/collaboration", label: "Collaboration Portal" },
              { path: "/resources", label: "Resources & Learning" },
              { path: "/events", label: "Events Calendar & List" },
              { path: "/data-tools", label: "Data & Tools Repository" },
              { path: "/create-profile", label: "Create Profile (post-login)" },
              { path: "/profile-settings", label: "Edit Profile Settings" },
              { path: "/update-password", label: "Update Password" },
              { path: "/admin", label: "Admin Dashboard (admin only)" },
            ].map(({ path, label }) => (
              <div key={path} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{path}</code>
                <span className="text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Daily Admin Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground/80">
            {[
              "Check Registrations tab for new pending registration requests — aim for < 24hr response time.",
              "Review Submissions tab for new research content awaiting moderation.",
              "Scan Forums for any flagged, spam, or inappropriate posts.",
              "Verify upcoming Events have correct details, dates, and working virtual links.",
              "Review Research Questions board for stale or duplicate entries.",
              "Spot-check Data & Tools entries for broken access URLs or outdated information.",
              "Glance at the Directory for any recently created profiles that look suspicious.",
              "Check Site Settings if any homepage content changes are pending.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded border border-muted-foreground/30 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Weekly Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Weekly Admin Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground/80">
            {[
              "Export directory profiles CSV and review growth trends.",
              "Close stale Research Questions that have been 'Open' for 3+ months.",
              "Review and update featured items across Resources, Events, and Data & Tools.",
              "Audit user_roles table to ensure only authorized users have admin/moderator access.",
              "Test the registration flow end-to-end to ensure emails are being delivered.",
              "Check all five language translations on the homepage for completeness.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded border border-muted-foreground/30 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
