import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  GraduationCap, Microscope, Building2, BookOpen, Download, Pencil, RotateCcw,
  Lightbulb, AlertCircle, RefreshCw, Users, FileDown, Plus, Trash2, ArrowUp, ArrowDown, Copy
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// ─── Types ───

interface GuideStep {
  id: string;
  title: string;
  what: string;
  why: string;
  howToComplete: string;
  crossRoleNote: string;
  tip: string;
  howToUpdate: string;
  important?: string;
}

interface RoleGuide {
  role: string;
  intro: string;
  steps: GuideStep[];
}

// ─── Default Data ───

const defaultGuides: RoleGuide[] = [
  {
    role: 'student',
    intro: 'Welcome to ImpactLink! As a student, this platform connects you with researchers, agencies, and datasets that can supercharge your academic career in child welfare. This guide walks you through every step — from creating your account to publishing research and forming lasting professional collaborations.',
    steps: [
      {
        id: 's1', title: 'Create Your Account',
        what: 'Register for an ImpactLink account using your email address.',
        why: 'An account is required to create a profile, access collaboration tools, register for events, bookmark resources, and submit research. Without an account you can only browse public content.',
        howToComplete: '1. Click "Get Started" on the homepage or "Sign In" in the top navigation.\n2. On the Auth page, switch to the "Sign Up" tab.\n3. Enter your email address and choose a strong password (min 6 characters).\n4. Click "Sign Up". A verification email will be sent to your inbox.\n5. Open the email and click the verification link to activate your account.\n6. Return to ImpactLink and sign in with your new credentials.',
        crossRoleNote: 'Researchers and agencies follow the same sign-up flow. Once everyone is on the platform, the matching and collaboration tools can connect you across roles.',
        tip: 'Use your university email — it builds credibility with researchers and agencies reviewing your profile.',
        howToUpdate: 'To change your password, go to Profile → Profile Settings and use the password update form, or use the "Forgot Password" link on the sign-in page.',
      },
      {
        id: 's2', title: 'Build Your Student Profile',
        what: 'Create a detailed student profile with your academic background, research interests, and skills.',
        why: 'Your profile is the foundation of your ImpactLink experience. It powers the Partner Matching algorithm, appears in the Directory, and helps researchers and agencies find you for collaboration opportunities.',
        howToComplete: '1. After your first sign-in you\'ll be redirected to Create Profile.\n2. Select "Student" as your profile type.\n3. Fill in all required fields: Full Name, Email, University, Major/Program, Year, Location, Bio, and Interests (comma-separated keywords).\n4. Click "Create Profile" to save.',
        crossRoleNote: 'Researchers list their expertise and current projects; agencies list focus areas and service regions. The matching algorithm finds overlaps between your interests and theirs, so use terminology common in the field.',
        tip: 'Add both broad topics ("child welfare") and specific ones ("kinship care outcomes") to maximize matches.',
        howToUpdate: 'Navigate to Profile → Profile Settings to edit any field at any time. Changes are reflected immediately in the Directory and Partner Matching.',
        important: 'The Interests field is critical — it determines who appears in your Partner Matches. Use specific, relevant keywords. More interests = broader match results.',
      },
      {
        id: 's3', title: 'Explore the Directory',
        what: 'Browse the global directory of students, researchers, and agencies.',
        why: 'The Directory is your primary tool for discovering potential mentors (researchers), placement sites (agencies), and peer collaborators (students). It supports search, filtering by type/location/interests, and sorting.',
        howToComplete: '1. Navigate to Directory from the top menu.\n2. Use the search bar to find specific people or organizations.\n3. Filter by Profile Type (Student, Researcher, Agency) using the tabs.\n4. Refine with Location and Interest/Tag filters in the sidebar.\n5. Click any profile card to view full details.\n6. Use the "Contact" button on profiles to send a message.',
        crossRoleNote: 'When a researcher views your profile from the Directory, they see your interests, university, and bio. A well-crafted profile increases contact requests.',
        tip: 'Try switching between Grid and List view for different browsing experiences. List view shows more profiles at once.',
        howToUpdate: '',
      },
      {
        id: 's4', title: 'Use Partner Matching',
        what: 'View AI-powered collaboration recommendations based on your profile.',
        why: 'Partner Matching analyzes shared interests, location, and expertise across all roles to suggest the most relevant collaboration partners. It saves you time compared to manually browsing hundreds of profiles.',
        howToComplete: '1. Navigate to Collaboration → Partner Matching.\n2. Review your match cards — each shows a match score, shared interests, and profile type.\n3. Click "View Profile" to learn more about a match.\n4. Click "Connect" to send a collaboration request with an optional message.',
        crossRoleNote: 'Researchers and agencies also see you in their matches. When you send a connection request, the other party receives a notification and can accept or decline. Accepted connections appear in My Collaborations.',
        tip: 'Higher match scores indicate more shared interests. Prioritize high-score matches but don\'t ignore lower ones — sometimes unexpected collaborations yield the best results.',
        howToUpdate: 'To improve your matches, update your interests and location in Profile Settings. The algorithm recalculates matches in real time.',
      },
      {
        id: 's5', title: 'Engage in Collaboration Forums',
        what: 'Participate in topic-based discussion forums with the community.',
        why: 'Forums are where the community discusses emerging research, shares best practices, asks questions, and identifies new collaboration opportunities. Active participation builds your reputation and visibility.',
        howToComplete: '1. Go to Collaboration → Forums.\n2. Browse existing topics (e.g., "Child Protection Policy", "Research Methods").\n3. Click a topic to view posts and discussions.\n4. Click "New Post" to start a thread — add a title and detailed content.\n5. Reply to existing posts to contribute to the conversation.',
        crossRoleNote: 'Researchers and agencies read and respond to forum posts. A thoughtful post from a student can attract mentorship offers or project invitations from established researchers.',
        tip: 'When posting questions, be specific about your methodology, population, or data needs. Vague posts get fewer responses.',
        howToUpdate: 'You can edit or delete your own posts and replies at any time using the edit/delete buttons on your content.',
      },
      {
        id: 's6', title: 'Browse & Post Research Questions',
        what: 'View existing research questions or post your own to find collaborators.',
        why: 'Research Questions are a structured way to signal what you\'re working on or interested in. They\'re tagged by topic, region, and population, making them easy to discover.',
        howToComplete: '1. Go to Collaboration → Research Questions.\n2. Click "Post a Question".\n3. Enter a clear title and detailed description.\n4. Select relevant topics, regions, and populations tags.\n5. Submit — your question becomes visible to all users.',
        crossRoleNote: 'Researchers and agencies browse these questions to find students whose interests align with their projects. A well-tagged question can lead directly to a research assistant position or data access.',
        tip: 'Frame your question around a specific gap in the literature or a practical problem. Include what data or methods you\'re considering.',
        howToUpdate: 'You can edit the title, description, and tags of your own questions. The status (open, in progress, completed) can also be updated to reflect your progress.',
      },
      {
        id: 's7', title: 'Access Resources & Learning Materials',
        what: 'Browse workshops, toolkits, reading lists, and professional development materials.',
        why: 'These resources are curated to help you build research skills, understand ethical frameworks, improve grant writing, and stay current with child welfare literature.',
        howToComplete: '1. Navigate to Resources from the top menu.\n2. Switch between tabs: Workshops & Webinars, Toolkits & Guides, Reading Lists.\n3. Click any resource to view details, access external links, or download files.\n4. Use the Bookmark feature (available when signed in) to save resources for later.\n5. View your saved items in the "Saved" tab.',
        crossRoleNote: 'Many resources are contributed by researchers and agencies. Toolkits on academic-agency partnerships are especially valuable for students seeking placements.',
        tip: 'Bookmark resources related to IRB processes and research design early — you\'ll need them when planning your thesis or capstone project.',
        howToUpdate: '',
      },
      {
        id: 's8', title: 'Submit Your Research',
        what: 'Upload your capstone projects, theses, dissertations, or reports to the platform.',
        why: 'Submissions are reviewed by administrators and, once approved, become visible to the entire community. This is your chance to showcase your work, build your portfolio, and contribute to the field.',
        howToComplete: '1. Go to Resources → Submit Research.\n2. Select submission type: "Student Project".\n3. Enter a title and description.\n4. Upload your file (PDF, report, etc.).\n5. Add relevant tags for discoverability.\n6. Submit — your work enters a review queue. You\'ll be notified once it\'s approved.',
        crossRoleNote: 'Researchers and agencies can view approved student submissions. Strong work can lead to co-authorship invitations, research positions, or agency partnerships.',
        tip: '',
        howToUpdate: 'You can update or delete pending submissions from the Resources page. Once approved, contact an administrator to make changes.',
        important: 'Submissions start with "Pending" status. An administrator reviews each submission before it becomes publicly visible. Ensure your work is complete and properly formatted before submitting.',
      },
      {
        id: 's9', title: 'Explore Data & Tools',
        what: 'Access curated datasets, assessment tools, and ethics/IRB guidance.',
        why: 'Quality data and validated instruments are essential for rigorous research. The Data & Tools section centralizes resources you\'d otherwise spend hours searching for.',
        howToComplete: '1. Navigate to Data & Tools from the top menu.\n2. Browse Datasets — filter by source type, region, and topic.\n3. Browse Assessment Tools — filter by category and tool type.\n4. Review IRB & Ethics Resources — find guidance for your institution\'s requirements.\n5. Click dataset/tool links to access documentation and download pages.',
        crossRoleNote: 'Agencies often contribute datasets. Researchers contribute validated assessment tools. Understanding which tools and datasets are available helps you propose feasible research projects.',
        tip: 'Before starting your research proposal, check the ethics resources section for your institution\'s specific IRB process. This saves weeks of back-and-forth during the approval stage.',
        howToUpdate: '',
      },
      {
        id: 's10', title: 'Register for Events',
        what: 'Discover and register for conferences, workshops, webinars, and networking events.',
        why: 'Events are where you build professional relationships, learn new skills, and stay current with the field. Many events offer student-specific tracks or discounts.',
        howToComplete: '1. Navigate to Events from the top menu.\n2. Browse upcoming events on the calendar or list view.\n3. Click an event for full details (time, location, virtual link, host).\n4. Click "Register" to sign up.\n5. View your registrations in the "My Registrations" tab.',
        crossRoleNote: 'Events are created by administrators, often at the request of researchers and agencies. Attending events hosted by agencies you\'re interested in is an excellent way to make a personal connection.',
        tip: 'Register early — some events have limited capacity. Virtual events are a great option if you can\'t travel.',
        howToUpdate: '',
      },
      {
        id: 's11', title: 'Manage Collaborations',
        what: 'Track incoming and outgoing collaboration requests and manage your connections.',
        why: 'The My Collaborations tab is your relationship management hub. It keeps all your professional connections organized in one place.',
        howToComplete: '1. Go to Collaboration → My Collaborations.\n2. Review Incoming Requests — accept or decline connection requests from others.\n3. Track Outgoing Requests — see the status of requests you\'ve sent.\n4. View your Connections — all accepted collaborations.',
        crossRoleNote: 'When a researcher or agency accepts your connection request, they appear in your Connections tab. This mutual connection signals to both parties that collaboration interest is confirmed.',
        tip: 'When sending connection requests, include a personalized message explaining your interest. Generic requests are more likely to be declined.',
        howToUpdate: '',
      },
    ],
  },
  {
    role: 'researcher',
    intro: 'As a researcher on ImpactLink, you are at the heart of the platform\'s mission — advancing child welfare through evidence-based research. This guide covers every tool available to you, from building your profile to finding student collaborators, accessing datasets, and publishing your work.',
    steps: [
      {
        id: 'r1', title: 'Create Your Account',
        what: 'Register with your institutional or professional email.',
        why: 'Your account unlocks the full platform — profile creation, collaboration tools, research submission, event registration, and data access.',
        howToComplete: '1. Click "Get Started" or "Sign In".\n2. Switch to "Sign Up" and enter your institutional email and password.\n3. Verify your email via the link sent to your inbox.\n4. Sign in to begin profile creation.',
        crossRoleNote: '',
        tip: 'Using your university email (e.g., .edu) establishes immediate credibility with students and agencies.',
        howToUpdate: '',
      },
      {
        id: 'r2', title: 'Build Your Researcher Profile',
        what: 'Create a professional profile showcasing your expertise, publications, and current projects.',
        why: 'Your profile is your public identity on ImpactLink. It drives partner matching, appears in search results, and is what students and agencies review before reaching out to collaborate.',
        howToComplete: '1. Select "Researcher" as your profile type.\n2. Complete all fields: Full Name, Email, Title (e.g., "Assistant Professor"), Institution, Department, Location, Bio (summarize research focus, methodology, current projects), and Interests (comma-separated keywords).',
        crossRoleNote: 'Students see your title, institution, and interests in their match results. Agencies look at your bio and expertise when evaluating potential research partners. A complete, specific profile attracts higher-quality collaboration requests.',
        tip: '',
        howToUpdate: 'Go to Profile → Profile Settings to edit any field. Keep your bio current with recent publications and ongoing projects.',
        important: 'Your interests directly control Partner Matching results. Use precise terminology that students and agencies would search for.',
      },
      {
        id: 'r3', title: 'Find Student Collaborators',
        what: 'Use the Directory and Partner Matching to find students for research assistance, co-authorship, or mentorship.',
        why: 'Students bring fresh perspectives, enthusiasm, and availability. Finding the right student match can accelerate your research timeline and provide valuable mentoring opportunities.',
        howToComplete: '1. Directory: Filter by "Student" type, then refine by location, interests, or university.\n2. Partner Matching: Review algorithmic recommendations sorted by match score.\n3. View student profiles to assess their interests, academic background, and bio.\n4. Send a connection request or use "Contact" to reach out.',
        crossRoleNote: 'Students also use Partner Matching and may send you connection requests. Check My Collaborations → Incoming Requests regularly.',
        tip: 'When reviewing student profiles, look for alignment in methodology (qualitative vs. quantitative) as well as topic area. Skills listed in their bio (e.g., SPSS, NVivo) can be especially valuable.',
        howToUpdate: '',
      },
      {
        id: 'r4', title: 'Connect with Agencies',
        what: 'Find agencies that have data, field access, or implementation partners for your research.',
        why: 'Academic-agency partnerships are the gold standard for applied child welfare research. Agencies provide real-world data, participant access, and practice context that make research actionable.',
        howToComplete: '1. In the Directory, filter by "Agency" type.\n2. Review agency profiles — focus on their focus areas, agency type, and location.\n3. Check if their focus areas align with your research topics.\n4. Send a connection request explaining your research and what you need from the partnership.',
        crossRoleNote: 'Agencies list their collaboration interests and data availability. When you send a connection request, explain clearly what data or access you need and what the agency will gain from the partnership.',
        tip: 'Agencies value researchers who understand their operational constraints. Mention flexibility in timeline and methodology in your outreach message.',
        howToUpdate: '',
      },
      {
        id: 'r5', title: 'Post Research Questions & Lead Discussions',
        what: 'Post research questions to recruit collaborators, and lead forum discussions on your areas of expertise.',
        why: 'As a researcher, you set the agenda. Posting clear research questions attracts students and agencies who can contribute data, labor, or field access. Forum leadership establishes your authority in the community.',
        howToComplete: '1. Post research questions with detailed descriptions of methodology, timeline, and what you need from collaborators.\n2. Tag questions with specific topics, regions, and populations for discoverability.\n3. In forums, share insights from your published work or ongoing studies.\n4. Respond to student questions in your area — mentorship builds reputation.',
        crossRoleNote: 'Students browse research questions looking for opportunities. Agencies monitor discussions for researchers interested in their service populations. Your posts are visible to the entire community.',
        tip: '',
        howToUpdate: 'Update research question status (open → in progress → completed) as your project evolves. This keeps the community informed and prevents outdated listings.',
      },
      {
        id: 'r6', title: 'Submit & Showcase Your Research',
        what: 'Upload publications, ongoing study reports, and research findings.',
        why: 'The Research Submissions showcase raises your visibility, helps students discover your work, and positions you as an active contributor to the field.',
        howToComplete: '1. Go to Resources → Submit Research.\n2. Select "Faculty Research" as the submission type.\n3. Provide a compelling title, description, and relevant tags.\n4. Upload your file and submit for review.',
        crossRoleNote: 'Students and agencies browse approved submissions. Your published work may inspire student thesis topics or agency program evaluations.',
        tip: '',
        howToUpdate: 'You can edit pending submissions. For approved submissions, contact an administrator to request updates.',
      },
      {
        id: 'r7', title: 'Leverage Data & Tools',
        what: 'Access datasets from federal agencies, international organizations, and nonprofits; use validated assessment tools; and reference IRB/ethics guidance.',
        why: 'Centralized access to curated data and tools saves significant research setup time. The ethics guidance section helps navigate complex IRB requirements across jurisdictions.',
        howToComplete: '1. Datasets: Filter by source, region, topic; access documentation and download links.\n2. Assessment Tools: Browse validated instruments by category and type.\n3. Ethics Resources: IRB guides, HIPAA/GDPR frameworks, international ethics standards.',
        crossRoleNote: 'Agencies contribute many of the datasets listed here. Understanding what data is available from specific agencies can shape your research design and strengthen partnership proposals.',
        tip: 'Cross-reference available datasets with agency profiles in the Directory — you may find that an agency you\'re interested in has already contributed data to the platform.',
        howToUpdate: '',
      },
      {
        id: 'r8', title: 'Attend & Propose Events',
        what: 'Register for events and suggest new workshops or webinars.',
        why: 'Events are critical networking opportunities. Presenting at webinars establishes expertise; attending workshops expands methodology skills.',
        howToComplete: '1. Browse the Events page for upcoming opportunities.\n2. Register for relevant events.\n3. To propose a workshop or webinar, contact the platform administrators through the Contact form.',
        crossRoleNote: 'Events often include mixed audiences of students, researchers, and agencies. These settings are ideal for forming multi-stakeholder collaborations.',
        tip: 'Consider proposing a methodology workshop — students consistently rate these as the most valuable events on the platform.',
        howToUpdate: '',
      },
    ],
  },
  {
    role: 'agency',
    intro: 'As an agency on ImpactLink, you play a vital role in bridging the gap between academic research and real-world practice. This guide helps you set up your organization\'s profile, connect with researchers and students, share data, and participate in the community — all toward improving child welfare outcomes.',
    steps: [
      {
        id: 'a1', title: 'Create Your Account',
        what: 'Register an account using your organization\'s official email.',
        why: 'An account lets you create your agency profile, receive collaboration requests, register for events, and access platform tools. One account per agency representative is recommended.',
        howToComplete: '1. Click "Get Started" on the homepage.\n2. Enter your official organizational email and set a strong password.\n3. Verify your email address by clicking the link sent to your inbox.\n4. Sign in and proceed to profile creation.',
        crossRoleNote: 'Students and researchers will see your email domain as a trust signal. An official email increases response rates to your collaboration requests.',
        tip: '',
        howToUpdate: '',
        important: 'Use your organization\'s email domain (e.g., @youragency.org) rather than a personal email. This establishes legitimacy and trust with researchers and students.',
      },
      {
        id: 'a2', title: 'Build Your Agency Profile',
        what: 'Create a comprehensive agency profile with your mission, service areas, team size, and collaboration interests.',
        why: 'Your profile is your organization\'s public presence on ImpactLink. Researchers evaluate it before proposing partnerships, and students review it when considering field placements or project sites.',
        howToComplete: '1. Select "Agency" as your profile type.\n2. Fill in all fields: Organization Name, Email, Agency Type (Government, Non-profit, International, Academic Partner), Location, Organization Size, Founded, Website, Bio/Mission Statement, and Focus Areas (comma-separated).',
        crossRoleNote: 'Researchers search for agencies by focus area and location. Students look at agency type and mission. Make your bio specific about what kinds of research partnerships you\'re open to.',
        tip: 'Include what data or access you can offer researchers (e.g., "access to anonymized case records", "participant recruitment support"). This dramatically increases inbound interest.',
        howToUpdate: 'Navigate to Profile → Profile Settings to update any field. Update your focus areas seasonally to reflect current organizational priorities.',
      },
      {
        id: 'a3', title: 'Find Research Partners',
        what: 'Use the Directory and Partner Matching to find researchers whose expertise aligns with your organization\'s needs.',
        why: 'Academic partnerships bring rigorous evaluation, grant funding potential, and evidence-based program improvements. The right researcher can help you measure impact, validate programs, or secure funding.',
        howToComplete: '1. In the Directory, filter by "Researcher" type.\n2. Look for researchers with interests matching your focus areas.\n3. Check Partner Matching for algorithmic recommendations.\n4. Review researcher profiles — look at their publications, institution, and methodology.\n5. Send connection requests with a clear explanation of the partnership opportunity.',
        crossRoleNote: 'Researchers are looking for agencies that can provide data access, participant pools, or implementation sites. Be explicit about what you can offer and what you need in return.',
        tip: 'When contacting researchers, mention any existing data you have, IRB approvals in place, or organizational capacity for research collaboration. These details make your request actionable.',
        howToUpdate: '',
      },
      {
        id: 'a4', title: 'Recruit Student Interns & Assistants',
        what: 'Browse student profiles and post opportunities to attract talented students for internships, field placements, or research assistance.',
        why: 'Students bring energy, current academic knowledge, and capacity to support your programs. Many MSW and PhD programs require field placements — your agency can benefit from structured student engagement.',
        howToComplete: '1. Filter the Directory by "Student" type.\n2. Review student backgrounds, interests, and availability.\n3. Use Research Questions to post structured opportunities.\n4. Use Forums to announce internship openings.\n5. Send connection requests to promising candidates.',
        crossRoleNote: 'Students are actively looking for field placements and research opportunities. A clearly described opportunity with defined expectations receives significantly more interest than a vague posting.',
        tip: 'Post in the Forums with details about the role, duration, supervision structure, and whether the position is paid or for academic credit. Students value transparency.',
        howToUpdate: '',
      },
      {
        id: 'a5', title: 'Share Data & Reports',
        what: 'Submit agency reports, impact assessments, and program evaluations to the research showcase.',
        why: 'Sharing your work demonstrates transparency, attracts research partnerships, and contributes to the evidence base for child welfare practice.',
        howToComplete: '1. Go to Resources → Submit Research.\n2. Select "Agency Report" as the submission type.\n3. Provide a clear title, description, and tags.\n4. Upload your report file.\n5. Submit for administrator review.',
        crossRoleNote: 'Researchers use agency reports to identify gaps, validate findings, or propose follow-up studies. Students reference them for thesis literature reviews. High-quality reports attract collaboration offers.',
        tip: 'Include clear methodology descriptions in your reports — even informal evaluations. Researchers are more likely to engage with agencies that demonstrate data rigor.',
        howToUpdate: 'Edit pending submissions directly. For approved submissions, contact an administrator to request corrections or removal.',
      },
      {
        id: 'a6', title: 'Participate in Forums & Research Questions',
        what: 'Engage in community discussions and respond to research questions from students and researchers.',
        why: 'Forum participation increases your organization\'s visibility and positions you as an active, engaged partner. Responding to research questions can directly lead to partnerships that benefit your agency.',
        howToComplete: '1. Monitor forums for topics related to your focus areas.\n2. Share practice insights that researchers may not find in academic literature.\n3. Respond to research questions where your agency has relevant data or experience.\n4. Post your own questions about program evaluation, evidence-based practices, or policy.',
        crossRoleNote: 'When you respond to a researcher\'s question with practical context, it often catalyzes a collaboration. Students value hearing directly from practitioners about real-world challenges.',
        tip: '',
        howToUpdate: '',
      },
      {
        id: 'a7', title: 'Leverage Resources & Professional Development',
        what: 'Access workshops, toolkits, and reading lists tailored for evidence-based practice.',
        why: 'Professional development resources help your staff stay current with best practices, strengthen grant applications, and improve service delivery using research evidence.',
        howToComplete: '1. Toolkits & Guides: Academic-agency partnership guides, community-based research frameworks.\n2. Workshops: Grant writing, data analysis, program evaluation sessions.\n3. Reading Lists: Foundational texts and recent research relevant to your focus areas.',
        crossRoleNote: 'Many resources are created by researchers. Using toolkits from the platform in your practice and providing feedback creates a feedback loop that improves both research and practice.',
        tip: 'Bookmark grant writing resources — academic-agency partnerships are often funded through joint proposals, and understanding the researcher\'s grant process helps you be a better partner.',
        howToUpdate: '',
      },
      {
        id: 'a8', title: 'Attend & Host Events',
        what: 'Register for events and propose hosting events on the platform.',
        why: 'Events connect you with the academic community. Hosting a webinar about your programs or challenges can attract researchers and students who want to help.',
        howToComplete: '1. Browse the Events page for networking opportunities.\n2. Register for relevant workshops and conferences.\n3. To propose hosting an event, contact administrators via the Contact form.',
        crossRoleNote: 'Agency-hosted events are particularly popular with students seeking field experience and researchers looking for practice partners. Even a simple webinar about your programs can generate significant interest.',
        tip: 'Consider hosting a "Research Needs" webinar where you present challenges your agency faces — researchers and students will come with solutions and partnership proposals.',
        howToUpdate: '',
      },
      {
        id: 'a9', title: 'Manage Collaborations & Connections',
        what: 'Track and manage all incoming and outgoing collaboration requests.',
        why: 'Timely responses to collaboration requests build your reputation as a responsive partner. The My Collaborations hub keeps all your professional relationships organized.',
        howToComplete: '1. Go to Collaboration → My Collaborations.\n2. Review Incoming Requests from students and researchers.\n3. Accept requests that align with your current needs; decline with a note if they don\'t fit.\n4. Track Connections — these are your active academic partners.',
        crossRoleNote: 'When you accept a connection, both parties gain mutual visibility. Researchers and students see accepted connections as a signal that your agency is actively engaged in partnerships.',
        tip: 'Set a weekly reminder to check incoming requests. Researchers and students are often on academic timelines and may need prompt responses to include your agency in grant proposals or course requirements.',
        howToUpdate: '',
      },
      {
        id: 'a10', title: 'Use Data & Ethics Resources',
        what: 'Access ethics guidance for research partnerships and understand data sharing frameworks.',
        why: 'Understanding IRB requirements, HIPAA compliance, and data sharing best practices protects your agency, your clients, and your research partners. These resources help you participate in research responsibly.',
        howToComplete: '1. HIPAA & GDPR guides — Understand what data can be shared and how.\n2. IRB process guides — Know what to expect when a university researcher needs IRB approval to work with your agency.\n3. International ethics standards — Essential for agencies working across borders.',
        crossRoleNote: 'Researchers must obtain IRB approval before accessing your data. Understanding the IRB process helps you prepare the documentation researchers need and speeds up the partnership timeline.',
        tip: 'Create a standardized data sharing agreement template for your agency. This accelerates new research partnerships by weeks.',
        howToUpdate: '',
      },
    ],
  },
];

// ─── PDF Generation ───

function generateGuidePDF(guide: RoleGuide) {
  const roleLabel = guide.role.charAt(0).toUpperCase() + guide.role.slice(1);
  
  const lines: string[] = [];
  lines.push(`IMPACTLINK — ${roleLabel.toUpperCase()} USER GUIDE`);
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(guide.intro);
  lines.push('');

  guide.steps.forEach((step, i) => {
    lines.push(`${'─'.repeat(50)}`);
    lines.push(`STEP ${i + 1}: ${step.title.toUpperCase()}`);
    lines.push(`${'─'.repeat(50)}`);
    lines.push('');
    lines.push(`WHAT: ${step.what}`);
    lines.push('');
    lines.push(`WHY: ${step.why}`);
    lines.push('');
    if (step.important) {
      lines.push(`⚠ IMPORTANT: ${step.important}`);
      lines.push('');
    }
    lines.push('HOW TO COMPLETE:');
    step.howToComplete.split('\n').forEach(l => lines.push(`  ${l}`));
    lines.push('');
    if (step.crossRoleNote) {
      lines.push(`🔗 CROSS-ROLE CONNECTION: ${step.crossRoleNote}`);
      lines.push('');
    }
    if (step.tip) {
      lines.push(`💡 TIP: ${step.tip}`);
      lines.push('');
    }
    if (step.howToUpdate) {
      lines.push(`🔄 HOW TO UPDATE: ${step.howToUpdate}`);
      lines.push('');
    }
    lines.push('');
  });

  lines.push('='.repeat(50));
  lines.push(`Generated by ImpactLink — ${new Date().toLocaleDateString()}`);

  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ImpactLink_${roleLabel}_Guide.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function printGuidePDF(guide: RoleGuide) {
  const roleLabel = guide.role.charAt(0).toUpperCase() + guide.role.slice(1);

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>ImpactLink ${roleLabel} Guide</title>
<style>
  body { font-family: Georgia, serif; max-width: 750px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
  h1 { font-size: 24px; border-bottom: 3px solid #2563eb; padding-bottom: 10px; color: #1e3a5f; }
  h2 { font-size: 18px; margin-top: 30px; color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
  .intro { font-style: italic; color: #4b5563; margin-bottom: 30px; }
  .field { margin-bottom: 12px; }
  .field-label { font-weight: bold; color: #374151; }
  .important { background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .cross-role { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .tip { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .update { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 10px 14px; margin: 10px 0; font-size: 14px; }
  .step-num { display: inline-block; background: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: bold; margin-right: 8px; font-size: 14px; }
  .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
  ol { padding-left: 20px; }
  ol li { margin-bottom: 4px; }
  @media print { body { margin: 20px; } }
</style>
</head><body>
<h1>ImpactLink — ${roleLabel} User Guide</h1>
<p class="intro">${guide.intro}</p>
${guide.steps.map((step, i) => `
<h2><span class="step-num">${i + 1}</span>${step.title}</h2>
<div class="field"><span class="field-label">What:</span> ${step.what}</div>
<div class="field"><span class="field-label">Why:</span> ${step.why}</div>
${step.important ? `<div class="important"><strong>⚠ Important:</strong> ${step.important}</div>` : ''}
<div class="field"><span class="field-label">How to Complete:</span></div>
<ol>${step.howToComplete.split('\n').map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>
${step.crossRoleNote ? `<div class="cross-role"><strong>🔗 Cross-Role Connection:</strong> ${step.crossRoleNote}</div>` : ''}
${step.tip ? `<div class="tip"><strong>💡 Tip:</strong> ${step.tip}</div>` : ''}
${step.howToUpdate ? `<div class="update"><strong>🔄 How to Update:</strong> ${step.howToUpdate}</div>` : ''}
`).join('')}
<div class="footer">Generated by ImpactLink — ${new Date().toLocaleDateString()}</div>
</body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
}

// ─── Render Helpers ───

const TipBox = ({ text }: { text: string }) => text ? (
  <div className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 my-3">
    <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground">{text}</div>
  </div>
) : null;

const ImportantBox = ({ text }: { text?: string }) => text ? (
  <div className="flex gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 my-3">
    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground">{text}</div>
  </div>
) : null;

const CrossRoleBox = ({ text }: { text: string }) => text ? (
  <div className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary/50 my-3">
    <Users className="w-4 h-4 text-secondary-foreground shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground"><strong>Cross-Role:</strong> {text}</div>
  </div>
) : null;

const UpdateBox = ({ text }: { text: string }) => text ? (
  <div className="flex gap-3 p-3 rounded-lg bg-accent/30 border border-accent/50 my-3">
    <RefreshCw className="w-4 h-4 text-accent-foreground shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground"><strong>How to Update:</strong> {text}</div>
  </div>
) : null;

const StepNum = ({ n }: { n: number }) => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">{n}</span>
);

// ─── Main Component ───

const SETTINGS_KEY = 'role_guides';

export function AdminRoleGuides() {
  const [guides, setGuides] = useState<RoleGuide[]>(defaultGuides);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialog, setEditDialog] = useState<{ roleIndex: number; stepIndex: number } | null>(null);
  const [editIntroDialog, setEditIntroDialog] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<GuideStep | null>(null);
  const [editIntro, setEditIntro] = useState('');

  // Load from DB
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', SETTINGS_KEY)
        .maybeSingle();
      if (data?.value) {
        try {
          const parsed = data.value as unknown as RoleGuide[];
          if (Array.isArray(parsed) && parsed.length > 0) setGuides(parsed);
        } catch {}
      }
      setLoading(false);
    })();
  }, []);

  const saveGuides = useCallback(async (updated: RoleGuide[]) => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: SETTINGS_KEY, value: updated as any, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setSaving(false);
    if (error) {
      toast.error('Failed to save guides');
    } else {
      toast.success('Guide saved successfully');
      setGuides(updated);
    }
  }, []);

  const handleEditStep = (roleIndex: number, stepIndex: number) => {
    setEditForm({ ...guides[roleIndex].steps[stepIndex] });
    setEditDialog({ roleIndex, stepIndex });
  };

  const handleSaveStep = async () => {
    if (!editDialog || !editForm) return;
    const updated = [...guides];
    updated[editDialog.roleIndex] = {
      ...updated[editDialog.roleIndex],
      steps: updated[editDialog.roleIndex].steps.map((s, i) =>
        i === editDialog.stepIndex ? editForm : s
      ),
    };
    await saveGuides(updated);
    setEditDialog(null);
    setEditForm(null);
  };

  const handleSaveIntro = async () => {
    if (editIntroDialog === null) return;
    const updated = [...guides];
    updated[editIntroDialog] = { ...updated[editIntroDialog], intro: editIntro };
    await saveGuides(updated);
    setEditIntroDialog(null);
  };

  const handleResetAll = async () => {
    if (!confirm('Reset all role guides to defaults? This cannot be undone.')) return;
    await saveGuides(defaultGuides);
  };

  const handleAddStep = async (roleIndex: number) => {
    const newStep: GuideStep = {
      id: `${guides[roleIndex].role[0]}${Date.now()}`,
      title: 'New Step',
      what: '',
      why: '',
      howToComplete: '',
      crossRoleNote: '',
      tip: '',
      howToUpdate: '',
    };
    const updated = [...guides];
    updated[roleIndex] = {
      ...updated[roleIndex],
      steps: [...updated[roleIndex].steps, newStep],
    };
    await saveGuides(updated);
    // Open edit dialog for the new step
    setEditForm({ ...newStep });
    setEditDialog({ roleIndex, stepIndex: updated[roleIndex].steps.length - 1 });
  };

  const handleDuplicateStep = async (roleIndex: number, stepIndex: number) => {
    const original = guides[roleIndex].steps[stepIndex];
    const duplicated: GuideStep = {
      ...original,
      id: `${guides[roleIndex].role[0]}${Date.now()}`,
      title: `${original.title} (Copy)`,
    };
    const updated = [...guides];
    const newSteps = [...updated[roleIndex].steps];
    newSteps.splice(stepIndex + 1, 0, duplicated);
    updated[roleIndex] = { ...updated[roleIndex], steps: newSteps };
    await saveGuides(updated);
  };

  const handleRemoveStep = async (roleIndex: number, stepIndex: number) => {
    const updated = [...guides];
    updated[roleIndex] = {
      ...updated[roleIndex],
      steps: updated[roleIndex].steps.filter((_, i) => i !== stepIndex),
    };
    await saveGuides(updated);
  };

  const handleMoveStep = async (roleIndex: number, stepIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    if (newIndex < 0 || newIndex >= guides[roleIndex].steps.length) return;
    const updated = [...guides];
    const newSteps = [...updated[roleIndex].steps];
    [newSteps[stepIndex], newSteps[newIndex]] = [newSteps[newIndex], newSteps[stepIndex]];
    updated[roleIndex] = { ...updated[roleIndex], steps: newSteps };
    await saveGuides(updated);
  };

  const roleIcons = [GraduationCap, Microscope, Building2];
  const roleLabels = ['Student', 'Researcher', 'Agency'];

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Role-Based User Guides
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetAll}>
                <RotateCcw className="w-4 h-4 mr-1" /> Reset All
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Edit the step-by-step user guides for each role. Changes are saved to the database and can be exported as PDFs.
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="student">
        <TabsList className="grid grid-cols-3">
          {roleLabels.map((label, i) => {
            const Icon = roleIcons[i];
            return (
              <TabsTrigger key={label} value={guides[i].role} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {guides.map((guide, ri) => {
          const Icon = roleIcons[ri];
          return (
            <TabsContent key={guide.role} value={guide.role} className="space-y-4">
              {/* PDF Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => printGuidePDF(guide)}>
                  <FileDown className="w-4 h-4 mr-1" /> Print / Save PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateGuidePDF(guide)}>
                  <Download className="w-4 h-4 mr-1" /> Download Text
                </Button>
              </div>

              {/* Intro Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="w-5 h-5 text-primary" />
                      {roleLabels[ri]} Guide — Introduction
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setEditIntro(guide.intro); setEditIntroDialog(ri); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{guide.intro}</p>
                </CardContent>
              </Card>

              {/* Steps */}
              <Accordion type="multiple" className="space-y-2">
                {guide.steps.map((step, si) => (
                  <AccordionItem key={step.id} value={step.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <StepNum n={si + 1} />
                        <span className="font-semibold text-sm">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-2 pl-9">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleEditStep(ri, si)}>
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit Step
                        </Button>
                      </div>
                      <p><strong>What:</strong> {step.what}</p>
                      <p><strong>Why:</strong> {step.why}</p>
                      <ImportantBox text={step.important} />
                      <div>
                        <strong>How to Complete:</strong>
                        <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                          {step.howToComplete.split('\n').map((l, li) => (
                            <li key={li}>{l.replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ol>
                      </div>
                      <CrossRoleBox text={step.crossRoleNote} />
                      <TipBox text={step.tip} />
                      <UpdateBox text={step.howToUpdate} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Edit Step Dialog */}
      <Dialog open={!!editDialog} onOpenChange={(open) => { if (!open) { setEditDialog(null); setEditForm(null); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Step: {editForm?.title}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div>
                <Label>What (description of the task)</Label>
                <Textarea value={editForm.what} onChange={(e) => setEditForm({ ...editForm, what: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Why (reason this step is required)</Label>
                <Textarea value={editForm.why} onChange={(e) => setEditForm({ ...editForm, why: e.target.value })} rows={3} />
              </div>
              <div>
                <Label>How to Complete (one step per line, numbered)</Label>
                <Textarea value={editForm.howToComplete} onChange={(e) => setEditForm({ ...editForm, howToComplete: e.target.value })} rows={6} />
              </div>
              <div>
                <Label>Cross-Role Connection Note</Label>
                <Textarea value={editForm.crossRoleNote} onChange={(e) => setEditForm({ ...editForm, crossRoleNote: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Tip / Advice</Label>
                <Textarea value={editForm.tip} onChange={(e) => setEditForm({ ...editForm, tip: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>How to Update / Fix</Label>
                <Textarea value={editForm.howToUpdate} onChange={(e) => setEditForm({ ...editForm, howToUpdate: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Important Warning (optional)</Label>
                <Textarea value={editForm.important || ''} onChange={(e) => setEditForm({ ...editForm, important: e.target.value || undefined })} rows={2} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditDialog(null); setEditForm(null); }}>Cancel</Button>
            <Button onClick={handleSaveStep} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Intro Dialog */}
      <Dialog open={editIntroDialog !== null} onOpenChange={(open) => { if (!open) setEditIntroDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Introduction</DialogTitle>
          </DialogHeader>
          <Textarea value={editIntro} onChange={(e) => setEditIntro(e.target.value)} rows={5} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditIntroDialog(null)}>Cancel</Button>
            <Button onClick={handleSaveIntro} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
