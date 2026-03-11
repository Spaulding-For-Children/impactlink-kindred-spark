import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  GraduationCap, Microscope, Building2, BookOpen, Users, Search, FileText,
  Calendar, MessageSquare, Database, Settings, Lightbulb, ArrowRight,
  CheckCircle2, AlertCircle, RefreshCw, Globe, HandshakeIcon, Target,
  PenLine, Upload, Bookmark, Bell, Shield, Star, Compass, UserPlus
} from 'lucide-react';

const Tip = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 my-4">
    <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
);

const Important = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20 my-4">
    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
    <div className="text-sm text-muted-foreground">{children}</div>
  </div>
);

const StepNumber = ({ n }: { n: number }) => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
    {n}
  </span>
);

const CrossRoleNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-lg bg-secondary/30 border border-secondary/50 my-4">
    <Users className="w-5 h-5 text-secondary-foreground shrink-0 mt-0.5" />
    <div className="text-sm text-muted-foreground"><strong>Cross-Role Connection:</strong> {children}</div>
  </div>
);

const HowToUpdate = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 p-4 rounded-lg bg-accent/30 border border-accent/50 my-4">
    <RefreshCw className="w-5 h-5 text-accent-foreground shrink-0 mt-0.5" />
    <div className="text-sm text-muted-foreground"><strong>How to Update:</strong> {children}</div>
  </div>
);

// ─── STUDENT GUIDE ───

const StudentGuide = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-primary" />
          Student Guide — Getting Started & Beyond
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>
          Welcome to ImpactLink! As a student, this platform connects you with researchers, agencies, and datasets
          that can supercharge your academic career in child welfare. This guide walks you through every step —
          from creating your account to publishing research and forming lasting professional collaborations.
        </p>
      </CardContent>
    </Card>

    <Accordion type="multiple" className="space-y-3">
      {/* Step 1 */}
      <AccordionItem value="s1" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={1} />
            <span className="font-semibold">Create Your Account</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Register for an ImpactLink account using your email address.</p>
          <p><strong>Why:</strong> An account is required to create a profile, access collaboration tools, register for events, bookmark resources, and submit research. Without an account you can only browse public content.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click <strong>"Get Started"</strong> on the homepage or <strong>"Sign In"</strong> in the top navigation.</li>
            <li>On the Auth page, switch to the <strong>"Sign Up"</strong> tab.</li>
            <li>Enter your <strong>email address</strong> and choose a strong <strong>password</strong> (min 6 characters).</li>
            <li>Click <strong>"Sign Up"</strong>. A verification email will be sent to your inbox.</li>
            <li>Open the email and click the verification link to activate your account.</li>
            <li>Return to ImpactLink and sign in with your new credentials.</li>
          </ol>
          <CrossRoleNote>
            Researchers and agencies follow the same sign-up flow. Once everyone is on the platform, the matching and collaboration tools can connect you across roles.
          </CrossRoleNote>
          <Tip>Use your university email — it builds credibility with researchers and agencies reviewing your profile.</Tip>
          <HowToUpdate>
            To change your password, go to <strong>Profile → Profile Settings</strong> and use the password update form, or use the "Forgot Password" link on the sign-in page.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2 */}
      <AccordionItem value="s2" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={2} />
            <span className="font-semibold">Build Your Student Profile</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Create a detailed student profile with your academic background, research interests, and skills.</p>
          <p><strong>Why:</strong> Your profile is the foundation of your ImpactLink experience. It powers the <strong>Partner Matching</strong> algorithm, appears in the <strong>Directory</strong>, and helps researchers and agencies find you for collaboration opportunities.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>After your first sign-in you'll be redirected to <strong>Create Profile</strong>.</li>
            <li>Select <strong>"Student"</strong> as your profile type.</li>
            <li>Fill in all required fields:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Full Name</strong> — Your real name as you'd like it displayed.</li>
                <li><strong>Email</strong> — Pre-filled from your account; verify it's correct.</li>
                <li><strong>University</strong> — Your current institution.</li>
                <li><strong>Major / Program</strong> — e.g., "MSW", "PhD Social Work".</li>
                <li><strong>Year</strong> — Your academic year (1st, 2nd, 3rd, 4th, Graduate).</li>
                <li><strong>Location</strong> — City and country.</li>
                <li><strong>Bio</strong> — A brief paragraph about your academic focus and career goals.</li>
                <li><strong>Interests</strong> — Comma-separated keywords (e.g., "foster care, trauma-informed care, policy analysis"). <em>These directly power partner matching.</em></li>
              </ul>
            </li>
            <li>Click <strong>"Create Profile"</strong> to save.</li>
          </ol>
          <Important>
            The <strong>Interests</strong> field is critical — it determines who appears in your Partner Matches. Use specific, relevant keywords. More interests = broader match results.
          </Important>
          <CrossRoleNote>
            Researchers list their expertise and current projects; agencies list focus areas and service regions. The matching algorithm finds overlaps between your interests and theirs, so use terminology common in the field.
          </CrossRoleNote>
          <Tip>Add both broad topics ("child welfare") and specific ones ("kinship care outcomes") to maximize matches.</Tip>
          <HowToUpdate>
            Navigate to <strong>Profile → Profile Settings</strong> to edit any field at any time. Changes are reflected immediately in the Directory and Partner Matching.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 3 */}
      <AccordionItem value="s3" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={3} />
            <span className="font-semibold">Explore the Directory</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Browse the global directory of students, researchers, and agencies.</p>
          <p><strong>Why:</strong> The Directory is your primary tool for discovering potential mentors (researchers), placement sites (agencies), and peer collaborators (students). It supports search, filtering by type/location/interests, and sorting.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to <strong>Directory</strong> from the top menu.</li>
            <li>Use the <strong>search bar</strong> to find specific people or organizations.</li>
            <li>Filter by <strong>Profile Type</strong> (Student, Researcher, Agency) using the tabs.</li>
            <li>Refine with <strong>Location</strong> and <strong>Interest/Tag</strong> filters in the sidebar.</li>
            <li>Click any profile card to view full details.</li>
            <li>Use the <strong>"Contact"</strong> button on profiles to send a message.</li>
          </ol>
          <CrossRoleNote>
            When a researcher views your profile from the Directory, they see your interests, university, and bio. A well-crafted profile increases contact requests.
          </CrossRoleNote>
          <Tip>Try switching between Grid and List view for different browsing experiences. List view shows more profiles at once.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 4 */}
      <AccordionItem value="s4" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={4} />
            <span className="font-semibold">Use Partner Matching</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> View AI-powered collaboration recommendations based on your profile.</p>
          <p><strong>Why:</strong> Partner Matching analyzes shared interests, location, and expertise across all roles to suggest the most relevant collaboration partners. It saves you time compared to manually browsing hundreds of profiles.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to <strong>Collaboration → Partner Matching</strong>.</li>
            <li>Review your match cards — each shows a <strong>match score</strong>, shared interests, and profile type.</li>
            <li>Click <strong>"View Profile"</strong> to learn more about a match.</li>
            <li>Click <strong>"Connect"</strong> to send a collaboration request with an optional message.</li>
          </ol>
          <CrossRoleNote>
            Researchers and agencies also see you in their matches. When you send a connection request, the other party receives a notification and can accept or decline. Accepted connections appear in <strong>My Collaborations</strong>.
          </CrossRoleNote>
          <Tip>Higher match scores indicate more shared interests. Prioritize high-score matches but don't ignore lower ones — sometimes unexpected collaborations yield the best results.</Tip>
          <HowToUpdate>
            To improve your matches, update your <strong>interests</strong> and <strong>location</strong> in Profile Settings. The algorithm recalculates matches in real time.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 5 */}
      <AccordionItem value="s5" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={5} />
            <span className="font-semibold">Engage in Collaboration Forums</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Participate in topic-based discussion forums with the community.</p>
          <p><strong>Why:</strong> Forums are where the community discusses emerging research, shares best practices, asks questions, and identifies new collaboration opportunities. Active participation builds your reputation and visibility.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Collaboration → Forums</strong>.</li>
            <li>Browse existing <strong>topics</strong> (e.g., "Child Protection Policy", "Research Methods").</li>
            <li>Click a topic to view posts and discussions.</li>
            <li>Click <strong>"New Post"</strong> to start a thread — add a title and detailed content.</li>
            <li>Reply to existing posts to contribute to the conversation.</li>
          </ol>
          <CrossRoleNote>
            Researchers and agencies read and respond to forum posts. A thoughtful post from a student can attract mentorship offers or project invitations from established researchers.
          </CrossRoleNote>
          <Tip>When posting questions, be specific about your methodology, population, or data needs. Vague posts get fewer responses.</Tip>
          <HowToUpdate>
            You can edit or delete your own posts and replies at any time using the edit/delete buttons on your content.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 6 */}
      <AccordionItem value="s6" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={6} />
            <span className="font-semibold">Browse & Post Research Questions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> View existing research questions or post your own to find collaborators.</p>
          <p><strong>Why:</strong> Research Questions are a structured way to signal what you're working on or interested in. They're tagged by topic, region, and population, making them easy to discover.</p>
          <h4 className="font-semibold text-foreground">How to Post a Research Question</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Collaboration → Research Questions</strong>.</li>
            <li>Click <strong>"Post a Question"</strong>.</li>
            <li>Enter a clear <strong>title</strong> and detailed <strong>description</strong>.</li>
            <li>Select relevant <strong>topics</strong>, <strong>regions</strong>, and <strong>populations</strong> tags.</li>
            <li>Submit — your question becomes visible to all users.</li>
          </ol>
          <CrossRoleNote>
            Researchers and agencies browse these questions to find students whose interests align with their projects. A well-tagged question can lead directly to a research assistant position or data access.
          </CrossRoleNote>
          <Tip>Frame your question around a specific gap in the literature or a practical problem. Include what data or methods you're considering.</Tip>
          <HowToUpdate>
            You can edit the title, description, and tags of your own questions. The status (open, in progress, completed) can also be updated to reflect your progress.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 7 */}
      <AccordionItem value="s7" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={7} />
            <span className="font-semibold">Access Resources & Learning Materials</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Browse workshops, toolkits, reading lists, and professional development materials.</p>
          <p><strong>Why:</strong> These resources are curated to help you build research skills, understand ethical frameworks, improve grant writing, and stay current with child welfare literature.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to <strong>Resources</strong> from the top menu.</li>
            <li>Switch between tabs: <strong>Workshops & Webinars</strong>, <strong>Toolkits & Guides</strong>, <strong>Reading Lists</strong>.</li>
            <li>Click any resource to view details, access external links, or download files.</li>
            <li>Use the <strong>Bookmark</strong> feature (available when signed in) to save resources for later.</li>
            <li>View your saved items in the <strong>"Saved"</strong> tab.</li>
          </ol>
          <CrossRoleNote>
            Many resources are contributed by researchers and agencies. Toolkits on academic-agency partnerships are especially valuable for students seeking placements.
          </CrossRoleNote>
          <Tip>Bookmark resources related to IRB processes and research design early — you'll need them when planning your thesis or capstone project.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 8 */}
      <AccordionItem value="s8" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={8} />
            <span className="font-semibold">Submit Your Research</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Upload your capstone projects, theses, dissertations, or reports to the platform.</p>
          <p><strong>Why:</strong> Submissions are reviewed by administrators and, once approved, become visible to the entire community. This is your chance to showcase your work, build your portfolio, and contribute to the field.</p>
          <h4 className="font-semibold text-foreground">How to Submit</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Resources → Submit Research</strong>.</li>
            <li>Select submission type: <strong>"Student Project"</strong>.</li>
            <li>Enter a <strong>title</strong> and <strong>description</strong>.</li>
            <li>Upload your file (PDF, report, etc.).</li>
            <li>Add relevant <strong>tags</strong> for discoverability.</li>
            <li>Submit — your work enters a review queue. You'll be notified once it's approved.</li>
          </ol>
          <Important>
            Submissions start with <strong>"Pending"</strong> status. An administrator reviews each submission before it becomes publicly visible. Ensure your work is complete and properly formatted before submitting.
          </Important>
          <CrossRoleNote>
            Researchers and agencies can view approved student submissions. Strong work can lead to co-authorship invitations, research positions, or agency partnerships.
          </CrossRoleNote>
          <HowToUpdate>
            You can update or delete pending submissions from the Resources page. Once approved, contact an administrator to make changes.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 9 */}
      <AccordionItem value="s9" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={9} />
            <span className="font-semibold">Explore Data & Tools</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Access curated datasets, assessment tools, and ethics/IRB guidance.</p>
          <p><strong>Why:</strong> Quality data and validated instruments are essential for rigorous research. The Data & Tools section centralizes resources you'd otherwise spend hours searching for.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to <strong>Data & Tools</strong> from the top menu.</li>
            <li>Browse <strong>Datasets</strong> — filter by source type, region, and topic.</li>
            <li>Browse <strong>Assessment Tools</strong> — filter by category and tool type.</li>
            <li>Review <strong>IRB & Ethics Resources</strong> — find guidance for your institution's requirements.</li>
            <li>Click dataset/tool links to access documentation and download pages.</li>
          </ol>
          <CrossRoleNote>
            Agencies often contribute datasets. Researchers contribute validated assessment tools. Understanding which tools and datasets are available helps you propose feasible research projects.
          </CrossRoleNote>
          <Tip>Before starting your research proposal, check the ethics resources section for your institution's specific IRB process. This saves weeks of back-and-forth during the approval stage.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 10 */}
      <AccordionItem value="s10" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={10} />
            <span className="font-semibold">Register for Events</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Discover and register for conferences, workshops, webinars, and networking events.</p>
          <p><strong>Why:</strong> Events are where you build professional relationships, learn new skills, and stay current with the field. Many events offer student-specific tracks or discounts.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Navigate to <strong>Events</strong> from the top menu.</li>
            <li>Browse upcoming events on the <strong>calendar</strong> or <strong>list view</strong>.</li>
            <li>Click an event for full details (time, location, virtual link, host).</li>
            <li>Click <strong>"Register"</strong> to sign up.</li>
            <li>View your registrations in the <strong>"My Registrations"</strong> tab.</li>
          </ol>
          <CrossRoleNote>
            Events are created by administrators, often at the request of researchers and agencies. Attending events hosted by agencies you're interested in is an excellent way to make a personal connection.
          </CrossRoleNote>
          <Tip>Register early — some events have limited capacity. Virtual events are a great option if you can't travel.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 11 */}
      <AccordionItem value="s11" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={11} />
            <span className="font-semibold">Manage Collaborations</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Track incoming and outgoing collaboration requests and manage your connections.</p>
          <p><strong>Why:</strong> The My Collaborations tab is your relationship management hub. It keeps all your professional connections organized in one place.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Collaboration → My Collaborations</strong>.</li>
            <li>Review <strong>Incoming Requests</strong> — accept or decline connection requests from others.</li>
            <li>Track <strong>Outgoing Requests</strong> — see the status of requests you've sent.</li>
            <li>View your <strong>Connections</strong> — all accepted collaborations.</li>
          </ol>
          <CrossRoleNote>
            When a researcher or agency accepts your connection request, they appear in your Connections tab. This mutual connection signals to both parties that collaboration interest is confirmed.
          </CrossRoleNote>
          <Tip>When sending connection requests, include a personalized message explaining your interest. Generic requests are more likely to be declined.</Tip>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// ─── RESEARCHER GUIDE ───

const ResearcherGuide = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="w-6 h-6 text-primary" />
          Researcher Guide — Your Complete Platform Walkthrough
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>
          As a researcher on ImpactLink, you are at the heart of the platform's mission — advancing child welfare
          through evidence-based research. This guide covers every tool available to you, from building your profile
          to finding student collaborators, accessing datasets, and publishing your work.
        </p>
      </CardContent>
    </Card>

    <Accordion type="multiple" className="space-y-3">
      {/* Step 1 */}
      <AccordionItem value="r1" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={1} />
            <span className="font-semibold">Create Your Account</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Register with your institutional or professional email.</p>
          <p><strong>Why:</strong> Your account unlocks the full platform — profile creation, collaboration tools, research submission, event registration, and data access.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click <strong>"Get Started"</strong> or <strong>"Sign In"</strong>.</li>
            <li>Switch to <strong>"Sign Up"</strong> and enter your institutional email and password.</li>
            <li>Verify your email via the link sent to your inbox.</li>
            <li>Sign in to begin profile creation.</li>
          </ol>
          <Tip>Using your university email (e.g., .edu) establishes immediate credibility with students and agencies.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2 */}
      <AccordionItem value="r2" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={2} />
            <span className="font-semibold">Build Your Researcher Profile</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Create a professional profile showcasing your expertise, publications, and current projects.</p>
          <p><strong>Why:</strong> Your profile is your public identity on ImpactLink. It drives partner matching, appears in search results, and is what students and agencies review before reaching out to collaborate.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select <strong>"Researcher"</strong> as your profile type.</li>
            <li>Complete all fields:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Full Name</strong> & <strong>Email</strong> — Professional contact info.</li>
                <li><strong>Title</strong> — e.g., "Assistant Professor", "Research Fellow".</li>
                <li><strong>Institution</strong> — Your university or research center.</li>
                <li><strong>Department</strong> — e.g., "School of Social Work".</li>
                <li><strong>Location</strong> — City and country.</li>
                <li><strong>Bio</strong> — Summarize your research focus, methodology, and current projects.</li>
                <li><strong>Interests</strong> — Comma-separated keywords (e.g., "child maltreatment, longitudinal studies, prevention programs").</li>
              </ul>
            </li>
          </ol>
          <Important>
            Your <strong>interests</strong> directly control Partner Matching results. Use precise terminology that students and agencies would search for.
          </Important>
          <CrossRoleNote>
            Students see your title, institution, and interests in their match results. Agencies look at your bio and expertise when evaluating potential research partners. A complete, specific profile attracts higher-quality collaboration requests.
          </CrossRoleNote>
          <HowToUpdate>
            Go to <strong>Profile → Profile Settings</strong> to edit any field. Keep your bio current with recent publications and ongoing projects.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 3 */}
      <AccordionItem value="r3" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={3} />
            <span className="font-semibold">Find Student Collaborators</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Use the Directory and Partner Matching to find students for research assistance, co-authorship, or mentorship.</p>
          <p><strong>Why:</strong> Students bring fresh perspectives, enthusiasm, and availability. Finding the right student match can accelerate your research timeline and provide valuable mentoring opportunities.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Directory:</strong> Filter by "Student" type, then refine by location, interests, or university.</li>
            <li><strong>Partner Matching:</strong> Review algorithmic recommendations sorted by match score.</li>
            <li>View student profiles to assess their interests, academic background, and bio.</li>
            <li>Send a <strong>connection request</strong> or use <strong>"Contact"</strong> to reach out.</li>
          </ol>
          <CrossRoleNote>
            Students also use Partner Matching and may send you connection requests. Check <strong>My Collaborations → Incoming Requests</strong> regularly.
          </CrossRoleNote>
          <Tip>When reviewing student profiles, look for alignment in methodology (qualitative vs. quantitative) as well as topic area. Skills listed in their bio (e.g., SPSS, NVivo) can be especially valuable.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 4 */}
      <AccordionItem value="r4" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={4} />
            <span className="font-semibold">Connect with Agencies</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Find agencies that have data, field access, or implementation partners for your research.</p>
          <p><strong>Why:</strong> Academic-agency partnerships are the gold standard for applied child welfare research. Agencies provide real-world data, participant access, and practice context that make research actionable.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>In the <strong>Directory</strong>, filter by "Agency" type.</li>
            <li>Review agency profiles — focus on their <strong>focus areas</strong>, <strong>agency type</strong>, and <strong>location</strong>.</li>
            <li>Check if their <strong>focus areas</strong> align with your research topics.</li>
            <li>Send a connection request explaining your research and what you need from the partnership.</li>
          </ol>
          <CrossRoleNote>
            Agencies list their collaboration interests and data availability. When you send a connection request, explain clearly what data or access you need and what the agency will gain from the partnership (e.g., evaluation reports, training, publications).
          </CrossRoleNote>
          <Tip>Agencies value researchers who understand their operational constraints. Mention flexibility in timeline and methodology in your outreach message.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 5 */}
      <AccordionItem value="r5" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={5} />
            <span className="font-semibold">Post Research Questions & Lead Discussions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Post research questions to recruit collaborators, and lead forum discussions on your areas of expertise.</p>
          <p><strong>Why:</strong> As a researcher, you set the agenda. Posting clear research questions attracts students and agencies who can contribute data, labor, or field access. Forum leadership establishes your authority in the community.</p>
          <h4 className="font-semibold text-foreground">Best Practices</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Post research questions with detailed descriptions of methodology, timeline, and what you need from collaborators.</li>
            <li>Tag questions with specific topics, regions, and populations for discoverability.</li>
            <li>In forums, share insights from your published work or ongoing studies.</li>
            <li>Respond to student questions in your area — mentorship builds reputation.</li>
          </ul>
          <CrossRoleNote>
            Students browse research questions looking for opportunities. Agencies monitor discussions for researchers interested in their service populations. Your posts are visible to the entire community.
          </CrossRoleNote>
          <HowToUpdate>
            Update research question status (open → in progress → completed) as your project evolves. This keeps the community informed and prevents outdated listings.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 6 */}
      <AccordionItem value="r6" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={6} />
            <span className="font-semibold">Submit & Showcase Your Research</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Upload publications, ongoing study reports, and research findings.</p>
          <p><strong>Why:</strong> The Research Submissions showcase raises your visibility, helps students discover your work, and positions you as an active contributor to the field.</p>
          <h4 className="font-semibold text-foreground">How to Submit</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Resources → Submit Research</strong>.</li>
            <li>Select <strong>"Faculty Research"</strong> as the submission type.</li>
            <li>Provide a compelling title, description, and relevant tags.</li>
            <li>Upload your file and submit for review.</li>
          </ol>
          <CrossRoleNote>
            Students and agencies browse approved submissions. Your published work may inspire student thesis topics or agency program evaluations.
          </CrossRoleNote>
          <HowToUpdate>
            You can edit pending submissions. For approved submissions, contact an administrator to request updates.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 7 */}
      <AccordionItem value="r7" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={7} />
            <span className="font-semibold">Leverage Data & Tools</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Access datasets from federal agencies, international organizations, and nonprofits; use validated assessment tools; and reference IRB/ethics guidance.</p>
          <p><strong>Why:</strong> Centralized access to curated data and tools saves significant research setup time. The ethics guidance section helps navigate complex IRB requirements across jurisdictions.</p>
          <h4 className="font-semibold text-foreground">Key Sections</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datasets:</strong> Filter by source, region, topic; access documentation and download links.</li>
            <li><strong>Assessment Tools:</strong> Browse validated instruments by category and type.</li>
            <li><strong>Ethics Resources:</strong> IRB guides, HIPAA/GDPR frameworks, international ethics standards.</li>
          </ul>
          <CrossRoleNote>
            Agencies contribute many of the datasets listed here. Understanding what data is available from specific agencies can shape your research design and strengthen partnership proposals.
          </CrossRoleNote>
          <Tip>Cross-reference available datasets with agency profiles in the Directory — you may find that an agency you're interested in has already contributed data to the platform.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 8 */}
      <AccordionItem value="r8" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={8} />
            <span className="font-semibold">Attend & Propose Events</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Register for events and suggest new workshops or webinars.</p>
          <p><strong>Why:</strong> Events are critical networking opportunities. Presenting at webinars establishes expertise; attending workshops expands methodology skills.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Browse the <strong>Events</strong> page for upcoming opportunities.</li>
            <li>Register for relevant events.</li>
            <li>To propose a workshop or webinar, contact the platform administrators through the Contact form.</li>
          </ol>
          <CrossRoleNote>
            Events often include mixed audiences of students, researchers, and agencies. These settings are ideal for forming multi-stakeholder collaborations.
          </CrossRoleNote>
          <Tip>Consider proposing a methodology workshop — students consistently rate these as the most valuable events on the platform.</Tip>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// ─── AGENCY GUIDE ───

const AgencyGuide = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          Agency Guide — Maximizing Your ImpactLink Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>
          As an agency on ImpactLink, you play a vital role in bridging the gap between academic research and
          real-world practice. This guide helps you set up your organization's profile, connect with researchers
          and students, share data, and participate in the community — all toward improving child welfare outcomes.
        </p>
      </CardContent>
    </Card>

    <Accordion type="multiple" className="space-y-3">
      {/* Step 1 */}
      <AccordionItem value="a1" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={1} />
            <span className="font-semibold">Create Your Account</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Register an account using your organization's official email.</p>
          <p><strong>Why:</strong> An account lets you create your agency profile, receive collaboration requests, register for events, and access platform tools. One account per agency representative is recommended.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click <strong>"Get Started"</strong> on the homepage.</li>
            <li>Enter your <strong>official organizational email</strong> and set a strong password.</li>
            <li>Verify your email address by clicking the link sent to your inbox.</li>
            <li>Sign in and proceed to profile creation.</li>
          </ol>
          <Important>
            Use your organization's email domain (e.g., @youragency.org) rather than a personal email. This establishes legitimacy and trust with researchers and students.
          </Important>
          <CrossRoleNote>
            Students and researchers will see your email domain as a trust signal. An official email increases response rates to your collaboration requests.
          </CrossRoleNote>
        </AccordionContent>
      </AccordionItem>

      {/* Step 2 */}
      <AccordionItem value="a2" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={2} />
            <span className="font-semibold">Build Your Agency Profile</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Create a comprehensive agency profile with your mission, service areas, team size, and collaboration interests.</p>
          <p><strong>Why:</strong> Your profile is your organization's public presence on ImpactLink. Researchers evaluate it before proposing partnerships, and students review it when considering field placements or project sites.</p>
          <h4 className="font-semibold text-foreground">How to Complete</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select <strong>"Agency"</strong> as your profile type.</li>
            <li>Fill in all fields:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Organization Name</strong> — Official name of your agency.</li>
                <li><strong>Email</strong> — Primary contact email.</li>
                <li><strong>Agency Type</strong> — Government, Non-profit, International, or Academic Partner.</li>
                <li><strong>Location</strong> — City and country (or "Multiple Locations" if applicable).</li>
                <li><strong>Organization Size</strong> — Number of employees.</li>
                <li><strong>Founded</strong> — Year established.</li>
                <li><strong>Website</strong> — Your organization's URL.</li>
                <li><strong>Bio / Mission Statement</strong> — Describe your mission, populations served, and what you're looking for from the research community.</li>
                <li><strong>Focus Areas</strong> — Comma-separated (e.g., "foster care, family reunification, youth aging out"). <em>These power Partner Matching.</em></li>
              </ul>
            </li>
          </ol>
          <CrossRoleNote>
            Researchers search for agencies by focus area and location. Students look at agency type and mission. Make your bio specific about what kinds of research partnerships you're open to (e.g., "seeking program evaluation partners" or "open to student interns").
          </CrossRoleNote>
          <Tip>Include what data or access you can offer researchers (e.g., "access to anonymized case records", "participant recruitment support"). This dramatically increases inbound interest.</Tip>
          <HowToUpdate>
            Navigate to <strong>Profile → Profile Settings</strong> to update any field. Update your focus areas seasonally to reflect current organizational priorities.
          </HowToUpdate>
        </AccordionContent>
      </AccordionItem>

      {/* Step 3 */}
      <AccordionItem value="a3" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={3} />
            <span className="font-semibold">Find Research Partners</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Use the Directory and Partner Matching to find researchers whose expertise aligns with your organization's needs.</p>
          <p><strong>Why:</strong> Academic partnerships bring rigorous evaluation, grant funding potential, and evidence-based program improvements. The right researcher can help you measure impact, validate programs, or secure funding.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>In the <strong>Directory</strong>, filter by "Researcher" type.</li>
            <li>Look for researchers with interests matching your focus areas.</li>
            <li>Check <strong>Partner Matching</strong> for algorithmic recommendations.</li>
            <li>Review researcher profiles — look at their publications, institution, and methodology.</li>
            <li>Send connection requests with a clear explanation of the partnership opportunity.</li>
          </ol>
          <CrossRoleNote>
            Researchers are looking for agencies that can provide data access, participant pools, or implementation sites. Be explicit about what you can offer and what you need in return.
          </CrossRoleNote>
          <Tip>When contacting researchers, mention any existing data you have (even aggregated), IRB approvals in place, or organizational capacity for research collaboration. These details make your request actionable.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 4 */}
      <AccordionItem value="a4" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={4} />
            <span className="font-semibold">Recruit Student Interns & Assistants</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Browse student profiles and post opportunities to attract talented students for internships, field placements, or research assistance.</p>
          <p><strong>Why:</strong> Students bring energy, current academic knowledge, and capacity to support your programs. Many MSW and PhD programs require field placements — your agency can benefit from structured student engagement.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Filter the <strong>Directory</strong> by "Student" type.</li>
            <li>Review student backgrounds, interests, and availability.</li>
            <li>Use <strong>Research Questions</strong> to post structured opportunities.</li>
            <li>Use <strong>Forums</strong> to announce internship openings.</li>
            <li>Send connection requests to promising candidates.</li>
          </ol>
          <CrossRoleNote>
            Students are actively looking for field placements and research opportunities. A clearly described opportunity with defined expectations receives significantly more interest than a vague posting.
          </CrossRoleNote>
          <Tip>Post in the Forums with details about the role, duration, supervision structure, and whether the position is paid or for academic credit. Students value transparency.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 5 */}
      <AccordionItem value="a5" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={5} />
            <span className="font-semibold">Share Data & Reports</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Submit agency reports, impact assessments, and program evaluations to the research showcase.</p>
          <p><strong>Why:</strong> Sharing your work demonstrates transparency, attracts research partnerships, and contributes to the evidence base for child welfare practice.</p>
          <h4 className="font-semibold text-foreground">How to Submit</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Resources → Submit Research</strong>.</li>
            <li>Select <strong>"Agency Report"</strong> as the submission type.</li>
            <li>Provide a clear title, description, and tags.</li>
            <li>Upload your report file.</li>
            <li>Submit for administrator review.</li>
          </ol>
          <CrossRoleNote>
            Researchers use agency reports to identify gaps, validate findings, or propose follow-up studies. Students reference them for thesis literature reviews. High-quality reports attract collaboration offers.
          </CrossRoleNote>
          <HowToUpdate>
            Edit pending submissions directly. For approved submissions, contact an administrator to request corrections or removal.
          </HowToUpdate>
          <Tip>Include clear methodology descriptions in your reports — even informal evaluations. Researchers are more likely to engage with agencies that demonstrate data rigor.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 6 */}
      <AccordionItem value="a6" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={6} />
            <span className="font-semibold">Participate in Forums & Research Questions</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Engage in community discussions and respond to research questions from students and researchers.</p>
          <p><strong>Why:</strong> Forum participation increases your organization's visibility and positions you as an active, engaged partner. Responding to research questions can directly lead to partnerships that benefit your agency.</p>
          <h4 className="font-semibold text-foreground">Best Practices</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Monitor forums for topics related to your focus areas.</li>
            <li>Share practice insights that researchers may not find in academic literature.</li>
            <li>Respond to research questions where your agency has relevant data or experience.</li>
            <li>Post your own questions about program evaluation, evidence-based practices, or policy.</li>
          </ul>
          <CrossRoleNote>
            When you respond to a researcher's question with practical context, it often catalyzes a collaboration. Students value hearing directly from practitioners about real-world challenges.
          </CrossRoleNote>
        </AccordionContent>
      </AccordionItem>

      {/* Step 7 */}
      <AccordionItem value="a7" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={7} />
            <span className="font-semibold">Leverage Resources & Professional Development</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Access workshops, toolkits, and reading lists tailored for evidence-based practice.</p>
          <p><strong>Why:</strong> Professional development resources help your staff stay current with best practices, strengthen grant applications, and improve service delivery using research evidence.</p>
          <h4 className="font-semibold text-foreground">Recommended Sections</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Toolkits & Guides:</strong> Academic-agency partnership guides, community-based research frameworks.</li>
            <li><strong>Workshops:</strong> Grant writing, data analysis, program evaluation sessions.</li>
            <li><strong>Reading Lists:</strong> Foundational texts and recent research relevant to your focus areas.</li>
          </ul>
          <CrossRoleNote>
            Many resources are created by researchers. Using toolkits from the platform in your practice and providing feedback creates a feedback loop that improves both research and practice.
          </CrossRoleNote>
          <Tip>Bookmark grant writing resources — academic-agency partnerships are often funded through joint proposals, and understanding the researcher's grant process helps you be a better partner.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 8 */}
      <AccordionItem value="a8" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={8} />
            <span className="font-semibold">Attend & Host Events</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Register for events and propose hosting events on the platform.</p>
          <p><strong>Why:</strong> Events connect you with the academic community. Hosting a webinar about your programs or challenges can attract researchers and students who want to help.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Browse the <strong>Events</strong> page for networking opportunities.</li>
            <li>Register for relevant workshops and conferences.</li>
            <li>To propose hosting an event, contact administrators via the Contact form.</li>
          </ol>
          <CrossRoleNote>
            Agency-hosted events are particularly popular with students seeking field experience and researchers looking for practice partners. Even a simple webinar about your programs can generate significant interest.
          </CrossRoleNote>
          <Tip>Consider hosting a "Research Needs" webinar where you present challenges your agency faces — researchers and students will come with solutions and partnership proposals.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 9 */}
      <AccordionItem value="a9" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={9} />
            <span className="font-semibold">Manage Collaborations & Connections</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Track and manage all incoming and outgoing collaboration requests.</p>
          <p><strong>Why:</strong> Timely responses to collaboration requests build your reputation as a responsive partner. The My Collaborations hub keeps all your professional relationships organized.</p>
          <h4 className="font-semibold text-foreground">How to Use</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to <strong>Collaboration → My Collaborations</strong>.</li>
            <li>Review <strong>Incoming Requests</strong> from students and researchers.</li>
            <li>Accept requests that align with your current needs; decline with a note if they don't fit.</li>
            <li>Track <strong>Connections</strong> — these are your active academic partners.</li>
          </ol>
          <CrossRoleNote>
            When you accept a connection, both parties gain mutual visibility. Researchers and students see accepted connections as a signal that your agency is actively engaged in partnerships.
          </CrossRoleNote>
          <Tip>Set a weekly reminder to check incoming requests. Researchers and students are often on academic timelines and may need prompt responses to include your agency in grant proposals or course requirements.</Tip>
        </AccordionContent>
      </AccordionItem>

      {/* Step 10 */}
      <AccordionItem value="a10" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <StepNumber n={10} />
            <span className="font-semibold">Use Data & Ethics Resources</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground space-y-3 pl-10">
          <p><strong>What:</strong> Access ethics guidance for research partnerships and understand data sharing frameworks.</p>
          <p><strong>Why:</strong> Understanding IRB requirements, HIPAA compliance, and data sharing best practices protects your agency, your clients, and your research partners. These resources help you participate in research responsibly.</p>
          <h4 className="font-semibold text-foreground">Key Resources</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>HIPAA & GDPR guides</strong> — Understand what data can be shared and how.</li>
            <li><strong>IRB process guides</strong> — Know what to expect when a university researcher needs IRB approval to work with your agency.</li>
            <li><strong>International ethics standards</strong> — Essential for agencies working across borders.</li>
          </ul>
          <CrossRoleNote>
            Researchers must obtain IRB approval before accessing your data. Understanding the IRB process helps you prepare the documentation researchers need and speeds up the partnership timeline.
          </CrossRoleNote>
          <Tip>Create a standardized data sharing agreement template for your agency. This accelerates new research partnerships by weeks.</Tip>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// ─── MAIN PAGE ───

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState('student');

  const tabs = [
    { id: 'student', label: 'Students', icon: GraduationCap, color: 'text-primary' },
    { id: 'researcher', label: 'Researchers', icon: Microscope, color: 'text-primary' },
    { id: 'agency', label: 'Agencies', icon: Building2, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-4">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Platform User Guides
              </Badge>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Your Step-by-Step Guide to ImpactLink
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select your role below to access a comprehensive, personalized guide that walks you through
                every feature of the platform — from account creation to advanced collaboration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="student">
                <StudentGuide />
              </TabsContent>
              <TabsContent value="researcher">
                <ResearcherGuide />
              </TabsContent>
              <TabsContent value="agency">
                <AgencyGuide />
              </TabsContent>
            </Tabs>

            {/* Quick Links */}
            <Card className="mt-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Compass className="w-5 h-5 text-primary" />
                  Quick Navigation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Directory', href: '/directory', icon: Search },
                    { label: 'Collaboration', href: '/collaboration', icon: HandshakeIcon },
                    { label: 'Resources', href: '/resources', icon: FileText },
                    { label: 'Data & Tools', href: '/data-tools', icon: Database },
                    { label: 'Events', href: '/events', icon: Calendar },
                    { label: 'Profile Settings', href: '/profile-settings', icon: Settings },
                  ].map((link) => (
                    <Link key={link.href} to={link.href}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
