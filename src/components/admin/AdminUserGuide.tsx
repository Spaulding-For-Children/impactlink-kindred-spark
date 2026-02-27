import { BookOpen, Users, FileText, Calendar, MessageSquare, Database, Shield, Globe, UserPlus, Search, Star, Upload, Download, CheckCircle, AlertTriangle, Info, Lightbulb, Settings, Mail, Phone, Building2, HelpCircle, Bookmark, BarChart3, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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

export function AdminUserGuide() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Platform User Guide
          </CardTitle>
          <CardDescription>
            A comprehensive reference for administrators covering every feature, workflow, and best practice on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-foreground/80">
            <p>
              This guide covers all platform components, from user registration through content management. 
              Each section includes step-by-step instructions, best practices, and tips for efficient administration.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-xs text-muted-foreground">Admin Modules</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground">Languages Supported</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground">Profile Types</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { icon: UserPlus, label: "1. Registration & User Onboarding" },
              { icon: Users, label: "2. User Profiles & Directory" },
              { icon: FileText, label: "3. Research Submissions" },
              { icon: BookOpen, label: "4. Resources & Learning" },
              { icon: Calendar, label: "5. Events Management" },
              { icon: MessageSquare, label: "6. Forums & Collaboration" },
              { icon: HelpCircle, label: "7. Research Questions" },
              { icon: Database, label: "8. Data & Tools Repository" },
              { icon: Globe, label: "9. Internationalization (i18n)" },
              { icon: Shield, label: "10. Security & Access Control" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground/80">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Accordion type="multiple" className="space-y-3">

        {/* 1. Registration & User Onboarding */}
        <AccordionItem value="registration" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={UserPlus} title="1. Registration & User Onboarding" description="Managing new user sign-ups and the approval workflow" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Overview</h4>
            <p className="text-sm text-foreground/80 mb-4">
              The platform uses a <strong>manual approval workflow</strong>. Prospective users submit a registration request with their details. 
              Administrators review and approve or reject each request. Upon approval, the system creates an account and sends a password-reset email 
              so the user can set up their credentials.
            </p>

            <h4 className="font-semibold text-foreground mb-2">How the Registration Flow Works</h4>
            <StepList steps={[
              "A visitor navigates to the Auth page and fills out the registration form (name, email, phone, organization, organization type).",
              "The request appears in the Admin Dashboard → Registrations tab with a 'Pending' status badge.",
              "You review the request details: name, email, phone number, organization, and type.",
              "Optionally add admin notes (these are included in rejection emails for context).",
              "Click 'Approve' to create the user account and trigger a welcome/password-reset email, or 'Reject' to decline.",
              "The approved user receives an email with a link to set their password.",
              "After logging in, the user is prompted to create their profile (Student, Researcher, or Agency).",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Admin Actions</h4>
            <div className="space-y-2 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approve</Badge>
                <span>Creates the user account and sends the invite email.</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Reject</Badge>
                <span>Declines the request. Admin notes are sent to the applicant via email.</span>
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
              <li>Processed requests remain visible in the "Processed Requests" section for reference.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 2. User Profiles & Directory */}
        <AccordionItem value="profiles" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Users} title="2. User Profiles & Directory" description="Managing the member directory and profile types" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Profile Types</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Student</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Fields: University, Major, Year, Interests, Bio, Location</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">Researcher</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Fields: Institution, Department, Title, Publications, Focus Areas, Bio</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Agency</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Fields: Agency Type, Employees, Founded, Focus Areas, Website, Bio</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Directory Management</h4>
            <StepList steps={[
              "Navigate to the Admin Dashboard → Directory tab to see all profiles.",
              "Use the search bar to filter profiles by name or email.",
              "Use the type filter dropdown to view only Students, Researchers, or Agencies.",
              "Click the delete button (trash icon) on a profile to remove it — a confirmation dialog will appear.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Public Directory Pages</h4>
            <p className="text-sm text-foreground/80 mb-2">
              The platform has dedicated directory pages for each profile type:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>/students</strong> — Lists all student profiles with search and filter capabilities.</li>
              <li><strong>/researchers</strong> — Lists all researcher profiles.</li>
              <li><strong>/agencies</strong> — Lists all agency profiles.</li>
              <li><strong>/directory</strong> — Combined directory with all profile types.</li>
              <li>Each profile has a detail page at <strong>/profile/:id</strong>.</li>
            </ul>

            <Tip>
              Encourage users to fill out all optional fields (bio, interests, website). 
              Complete profiles rank higher in the Smart Matching algorithm and appear more professional in the directory.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Profile Settings (User Side)</h4>
            <p className="text-sm text-foreground/80">
              Users can update their own profiles at <strong>/profile-settings</strong>. They can edit all fields 
              except their profile type. Users can also access their profile from the header navigation when logged in.
            </p>

            <Warning>
              Deleting a profile is permanent. The user's account remains active but they will need to create a new profile. 
              Consider contacting the user before deletion unless it's clearly spam or a violation.
            </Warning>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Research Submissions */}
        <AccordionItem value="submissions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={FileText} title="3. Research Submissions" description="Reviewing and moderating user-submitted research content" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Submission Types</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">Student Project</Badge>
              <Badge variant="outline">Faculty Research</Badge>
              <Badge variant="outline">Agency Report</Badge>
              <Badge variant="outline">Global Showcase</Badge>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Moderation Workflow</h4>
            <StepList steps={[
              "Users submit research via the Resources → Research Submissions tab (includes file upload).",
              "Submissions appear in Admin Dashboard → Submissions tab with 'Pending' status.",
              "Review the title, description, submission type, tags, and attached file.",
              "Click 'View File' to download and review the submitted document.",
              "Click 'Approve' to make the submission publicly visible, or 'Reject' to decline it.",
              "Approved submissions appear in the public Resources → Research Submissions section.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Status Flow</h4>
            <div className="flex items-center gap-2 text-sm text-foreground/80 mb-4">
              <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>
              <span>→</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Approved</Badge>
              <span>or</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>
            </div>

            <Tip>
              Review file attachments before approving. Ensure the document is complete, 
              properly formatted, and doesn't contain sensitive or inappropriate content. 
              Check that the submission type matches the actual content.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Aim to review submissions within 48 hours to keep contributors engaged.</li>
              <li>Encourage users to add descriptive tags — these improve discoverability.</li>
              <li>Users can also delete their own submissions from the "My Submissions" tab.</li>
              <li>Admins and moderators can view all submissions regardless of status.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 4. Resources & Learning */}
        <AccordionItem value="resources" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={BookOpen} title="4. Resources & Learning" description="Managing workshops, toolkits, reading lists, and educational content" />
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

            <h4 className="font-semibold text-foreground mb-2">Adding a Resource Manually</h4>
            <StepList steps={[
              "Go to Admin Dashboard → Resources tab and click 'Add Resource'.",
              "Fill in the title, description, category, and select the resource type and format.",
              "Optionally add: author, external URL, file URL, thumbnail URL, duration, tags, publication date.",
              "Toggle 'Featured' to highlight the resource on the platform.",
              "Click 'Save' to publish the resource immediately.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Bulk Import via CSV</h4>
            <StepList steps={[
              "Click the 'Import CSV' button in the Resources tab.",
              "Download the CSV template to see the expected column format.",
              "Prepare your CSV file with the required columns: title, description, resource_type, format, category.",
              "Optional columns: author, external_url, file_url, thumbnail_url, duration, tags, publication_date, featured.",
              "Upload the CSV file — a preview table will show the parsed data.",
              "Review the preview for any validation errors (highlighted in red).",
              "Click 'Import' to add all valid rows as resources.",
            ]} />

            <Tip>
              When using CSV import, ensure <strong>resource_type</strong> is one of: workshop, toolkit, reading. 
              And <strong>format</strong> is one of: live, recorded, pdf, article, report, book. 
              Invalid values will cause import errors.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">User-Facing Features</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Workshops & Webinars</strong> — Live and recorded sessions with duration info.</li>
              <li><strong>Toolkits & Guides</strong> — Downloadable PDFs, articles, and reports.</li>
              <li><strong>Reading Lists</strong> — Curated books and publications.</li>
              <li><strong>Saved Resources</strong> — Logged-in users can bookmark resources for later access.</li>
              <li>Resources display view counts and download counts for popularity tracking.</li>
            </ul>

            <Note>
              The bookmarking feature is user-specific. Each user sees only their own saved resources. 
              Bookmarks are tied to the user's authentication ID.
            </Note>
          </AccordionContent>
        </AccordionItem>

        {/* 5. Events Management */}
        <AccordionItem value="events" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Calendar} title="5. Events Management" description="Creating, managing, and tracking platform events" />
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

            <h4 className="font-semibold text-foreground mb-2">Creating an Event</h4>
            <StepList steps={[
              "Navigate to Admin Dashboard → Events tab and click 'Add Event'.",
              "Fill in the event title, description, event type, start date, and end date.",
              "Choose whether the event is virtual or in-person.",
              "For virtual events: provide a virtual meeting link.",
              "For in-person events: provide the location address.",
              "Set optional fields: host name, host organization, max attendees, registration deadline, thumbnail URL, tags.",
              "Toggle 'Featured' to promote the event on the homepage.",
              "Click 'Save' to publish.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">User-Facing Event Features</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Events List</strong> — Browse upcoming events with filtering by type.</li>
              <li><strong>Event Calendar</strong> — Monthly calendar view showing events by date.</li>
              <li><strong>Registration</strong> — Logged-in users can register for events with one click.</li>
              <li><strong>My Registrations</strong> — Users see their upcoming and past event registrations.</li>
              <li><strong>Cancellation</strong> — Users can cancel their registration before the event.</li>
            </ul>

            <Tip>
              Set registration deadlines for events with limited capacity. This creates urgency and helps with planning. 
              Always include a descriptive thumbnail URL for better visual presentation in the event listings.
            </Tip>

            <Warning>
              When editing an event's date/time, be aware that users who already registered won't receive automatic 
              update notifications. Consider manually notifying registered attendees of significant changes.
            </Warning>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Best Practices</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Create events at least 2 weeks in advance to allow sufficient registration time.</li>
              <li>Use descriptive tags to help users find relevant events through search.</li>
              <li>Feature key events to give them visibility on the homepage section.</li>
              <li>Review past events to track attendance patterns and improve future planning.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* 6. Forums & Collaboration */}
        <AccordionItem value="forums" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={MessageSquare} title="6. Forums & Collaboration" description="Managing discussion forums, partner matching, and collaboration tools" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Forum Topics Management</h4>
            <StepList steps={[
              "Go to Admin Dashboard → Forums tab to see all forum topics.",
              "Click 'Add Topic' to create a new discussion category.",
              "Provide: topic name, description, icon name (e.g., 'BookOpen', 'Globe'), and color theme.",
              "Users can then create posts within these topics and reply to each other.",
              "Admins can edit or delete any forum topic from this tab.",
            ]} />

            <h4 className="font-semibold text-foreground mb-2">Collaboration Portal (User-Facing)</h4>
            <p className="text-sm text-foreground/80 mb-2">The Collaboration page (/collaboration) has five tabs:</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-2">
              <li>
                <strong>Research Questions</strong> — Users post research questions with topics, regions, and target populations. 
                Others can browse and respond. Statuses: Open → In Progress → Completed → Closed.
              </li>
              <li>
                <strong>Smart Matching</strong> — AI-powered partner recommendations based on shared interests and geographic proximity. 
                Users see a match score (%) and can send connection requests directly.
              </li>
              <li>
                <strong>Forums</strong> — Thematic discussion boards organized by topics you create here. 
                Users create posts and reply in threads.
              </li>
              <li>
                <strong>Global Network</strong> — Visual network showing all registered partners across the platform.
              </li>
              <li>
                <strong>My Collaborations</strong> — Users manage their sent/received collaboration requests 
                (accept, decline, or cancel pending requests).
              </li>
            </ul>

            <Tip>
              Create forum topics that align with your community's research interests. 
              Good starter topics: "Methodology Discussion", "Data Sharing", "Grant Opportunities", "Regional Studies", "Ethics & IRB".
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Smart Matching Algorithm</h4>
            <p className="text-sm text-foreground/80">
              The matching system uses a database function (<code>get_partner_matches</code>) that calculates compatibility based on:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 mt-2">
              <li><strong>Interest overlap</strong> — Number of shared interests/focus areas between profiles.</li>
              <li><strong>Geographic proximity</strong> — Users in the same location get a higher match score.</li>
              <li>Results are sorted by match score, with the best matches shown first.</li>
            </ul>

            <Note>
              The matching system requires users to have complete profiles with interests/focus areas filled in. 
              Encourage new users to add at least 3-5 interests for meaningful matches.
            </Note>
          </AccordionContent>
        </AccordionItem>

        {/* 7. Research Questions */}
        <AccordionItem value="research-questions" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={HelpCircle} title="7. Research Questions" description="Overseeing community-posted research questions" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Overview</h4>
            <p className="text-sm text-foreground/80 mb-4">
              Research questions are community-contributed topics that members want to explore or find collaborators for. 
              They include metadata like topics, regions, and target populations to facilitate matching with interested researchers.
            </p>

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

            <h4 className="font-semibold text-foreground mb-2">Admin Actions</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>View all research questions with their status, author, creation date, and metadata.</li>
              <li>Delete inappropriate or duplicate questions (with confirmation dialog).</li>
              <li>Authors can manage their own questions (update status, edit, delete).</li>
            </ul>

            <Tip>
              Periodically review old "Open" questions. If they've been inactive for 3+ months, 
              consider reaching out to the author to update the status or close them to keep the board fresh.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 8. Data & Tools */}
        <AccordionItem value="data-tools" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Database} title="8. Data & Tools Repository" description="Managing datasets, analysis tools, and ethics resources" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Three Sub-Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">📊 Datasets</h5>
                <p className="text-xs text-muted-foreground">
                  External data sources with metadata: organization, source type, format, coverage dates, regions, topics, access URL, documentation URL.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">🔧 Analysis Tools</h5>
                <p className="text-xs text-muted-foreground">
                  Software and assessment tools: name, full name, type, category, license, access URL, documentation URL, tags.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-semibold text-sm mb-1">⚖️ Ethics Resources</h5>
                <p className="text-xs text-muted-foreground">
                  Ethical guidelines and frameworks: resource type, jurisdiction, external URL, tags.
                </p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Adding Items</h4>
            <p className="text-sm text-foreground/80 mb-2">Each sub-category supports two methods:</p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Manual entry</strong> — Click "Add" to open a form dialog and fill in the fields.</li>
              <li><strong>CSV bulk import</strong> — Upload a CSV file with the correct column headers for mass creation.</li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">CSV Import for Data & Tools</h4>
            <StepList steps={[
              "Switch to the desired sub-tab (Datasets, Tools, or Ethics).",
              "Click the 'Import CSV' button.",
              "Download the template to see required columns.",
              "Prepare your CSV with matching column headers.",
              "Upload and preview the data — errors are highlighted.",
              "Confirm to import all valid rows.",
            ]} />

            <Tip>
              For datasets, always include the <strong>source_organization</strong> and <strong>access_url</strong> fields. 
              Users rely on these to find and access the actual data. Include coverage dates (start/end) when available 
              to help researchers filter by time period.
            </Tip>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Source Types for Datasets</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">Federal</Badge>
              <Badge variant="outline">State</Badge>
              <Badge variant="outline">Academic</Badge>
              <Badge variant="outline">International</Badge>
              <Badge variant="outline">Private</Badge>
            </div>

            <h4 className="font-semibold text-foreground mb-2">User-Facing Data & Tools Page</h4>
            <p className="text-sm text-foreground/80">
              The public Data & Tools page (<strong>/data-tools</strong>) displays all three categories in a tabbed layout. 
              Users can search, filter by type/category, and toggle to see only featured items. Each item shows 
              links to access the data/tool and its documentation.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* 9. Internationalization */}
        <AccordionItem value="i18n" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Globe} title="9. Internationalization (i18n)" description="Multi-language support and RTL layout" />
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

            <h4 className="font-semibold text-foreground mb-2">How It Works</h4>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Users select their language from the globe icon (🌐) in the header navigation.</li>
              <li>The selection is persisted in the browser's localStorage — it remembers their choice.</li>
              <li>On first visit, the system auto-detects the browser's language preference.</li>
              <li>Arabic triggers Right-to-Left (RTL) layout automatically.</li>
              <li>Translation files are located in <code>src/i18n/locales/</code>.</li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">What Is Translated</h4>
            <p className="text-sm text-foreground/80 mb-2">
              Currently, the <strong>landing page</strong> (homepage) is fully translated, including:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li>Navigation menu items and header</li>
              <li>Hero section (title, subtitle, CTAs)</li>
              <li>All homepage sections (Directory, Collaboration, Data & Tools, Resources, Events, Contact)</li>
              <li>Footer (links, copyright, social)</li>
            </ul>

            <Note>
              Inner pages (Directory, Collaboration, Resources, Events, Data Tools, Auth, Admin) currently 
              display in English regardless of the language selection. These can be translated by adding 
              the corresponding keys to each locale file.
            </Note>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Adding/Editing Translations</h4>
            <StepList steps={[
              "Open the locale file for the target language: src/i18n/locales/[lang].json",
              "Translation keys follow a nested structure: section.subsection.key",
              "Add or modify the value for each key in the target language.",
              "All locale files must have the same key structure — missing keys fall back to English.",
              "Test by switching to that language via the language selector.",
            ]} />

            <Tip>
              When adding translations for new pages, maintain the same nested structure used in 
              <code>en.json</code>. Missing keys gracefully fall back to English, so you can translate 
              incrementally without breaking the site.
            </Tip>
          </AccordionContent>
        </AccordionItem>

        {/* 10. Security & Access Control */}
        <AccordionItem value="security" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <SectionHeader icon={Shield} title="10. Security & Access Control" description="Roles, permissions, and data protection" />
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <h4 className="font-semibold text-foreground mb-2">Role System</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Badge className="bg-red-50 text-red-700 border-red-200">Admin</Badge>
                <p className="text-sm text-foreground/80">Full access to all admin features, CRUD on all content, user management, role assignment.</p>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">Moderator</Badge>
                <p className="text-sm text-foreground/80">Can view and update research submissions. Limited admin access.</p>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">User</Badge>
                <p className="text-sm text-foreground/80">Standard access: create profile, submit research, register for events, collaborate, bookmark resources.</p>
              </div>
            </div>

            <h4 className="font-semibold text-foreground mb-2">Row-Level Security (RLS)</h4>
            <p className="text-sm text-foreground/80 mb-2">
              Every database table has RLS policies that control data access at the row level:
            </p>
            <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
              <li><strong>Public tables</strong> (profiles, events, resources, datasets, tools, ethics resources, forums) — Anyone can read; only admins or owners can modify.</li>
              <li><strong>User-specific tables</strong> (bookmarks, event registrations, collaborations) — Users can only access their own data.</li>
              <li><strong>Admin-only tables</strong> (registration_requests, user_roles) — Only admins can view and manage.</li>
              <li><strong>Submission moderation</strong> — Authors see their own submissions; admins/moderators see all.</li>
            </ul>

            <h4 className="font-semibold text-foreground mt-4 mb-2">Admin Access</h4>
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
              <li>Keep the platform updated to benefit from the latest security patches.</li>
              <li>Never share admin credentials — each admin should have their own account.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Quick Reference: Key URLs
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
              { path: "/collaboration", label: "Collaboration Portal" },
              { path: "/resources", label: "Resources & Learning" },
              { path: "/events", label: "Events Calendar & List" },
              { path: "/data-tools", label: "Data & Tools Repository" },
              { path: "/create-profile", label: "Create Profile (post-login)" },
              { path: "/profile-settings", label: "Edit Profile Settings" },
              { path: "/admin", label: "Admin Dashboard (admin only)" },
              { path: "/update-password", label: "Update Password" },
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
              "Check Registrations tab for new pending registration requests.",
              "Review Submissions tab for new research content awaiting moderation.",
              "Scan Forums for any flagged or inappropriate posts.",
              "Verify upcoming Events have correct details and links.",
              "Review Research Questions board for stale or duplicate entries.",
              "Spot-check Data & Tools entries for broken access URLs.",
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
