export interface StudentProfile {
  id: number;
  name: string;
  title: string;
  organization: string;
  location: string;
  email: string;
  tags: string[];
  description: string;
  bio?: string;
  education?: { degree: string; institution: string; year: string }[];
  researchInterests?: string[];
  skills?: string[];
  publications?: { title: string; journal: string; year: string }[];
  availability?: string;
  linkedin?: string;
  website?: string;
}

export interface ResearcherProfile {
  id: number;
  name: string;
  title: string;
  organization: string;
  location: string;
  email: string;
  tags: string[];
  description: string;
  bio?: string;
  education?: { degree: string; institution: string; year: string }[];
  researchAreas?: string[];
  currentProjects?: { title: string; description: string; status: string }[];
  publications?: { title: string; journal: string; year: string }[];
  awards?: string[];
  collaborationInterests?: string[];
  linkedin?: string;
  website?: string;
}

export interface AgencyProfile {
  id: number;
  name: string;
  title: string;
  organization: string;
  location: string;
  email: string;
  tags: string[];
  description: string;
  mission?: string;
  founded?: string;
  staffSize?: string;
  serviceAreas?: string[];
  programs?: { name: string; description: string }[];
  dataAvailability?: string[];
  collaborationTypes?: string[];
  website?: string;
  phone?: string;
}

export const studentsData: StudentProfile[] = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "PhD Candidate",
    organization: "Columbia University",
    location: "New York, USA",
    email: "sarah.chen@columbia.edu",
    tags: ["Foster Care", "Mental Health", "Quantitative Methods"],
    description: "Researching the long-term outcomes of foster care youth transitioning to adulthood, with a focus on mental health interventions and support systems.",
    bio: "Sarah Chen is a dedicated PhD candidate at Columbia University's School of Social Work. Her research focuses on understanding and improving outcomes for youth in foster care, particularly during the critical transition to adulthood. With a background in clinical social work, Sarah brings both practical experience and academic rigor to her research.",
    education: [
      { degree: "PhD in Social Work (In Progress)", institution: "Columbia University", year: "2021-Present" },
      { degree: "MSW", institution: "University of Pennsylvania", year: "2019" },
      { degree: "BA in Psychology", institution: "NYU", year: "2016" }
    ],
    researchInterests: ["Foster care outcomes", "Mental health interventions", "Transition-age youth", "Trauma-informed care", "Quantitative research methods"],
    skills: ["SPSS", "R", "Stata", "Qualitative coding", "Survey design", "Grant writing"],
    publications: [
      { title: "Mental Health Outcomes Among Foster Care Alumni", journal: "Child Welfare Journal", year: "2023" },
      { title: "Transition Planning Best Practices", journal: "Social Work Research", year: "2022" }
    ],
    availability: "Open to collaboration starting Fall 2024",
    linkedin: "linkedin.com/in/sarahchen",
    website: "sarahchenresearch.com"
  },
  {
    id: 2,
    name: "Marcus Williams",
    title: "MSW Student",
    organization: "University of Michigan",
    location: "Michigan, USA",
    email: "marcus.w@umich.edu",
    tags: ["Family Reunification", "Trauma-Informed Care", "Policy Analysis"],
    description: "Focused on developing trauma-informed approaches to family reunification services in child welfare systems.",
    bio: "Marcus Williams is pursuing his MSW at the University of Michigan with a concentration in children and families. His passion for child welfare stems from his experience as a CASA volunteer and his commitment to keeping families together safely.",
    education: [
      { degree: "MSW (In Progress)", institution: "University of Michigan", year: "2023-Present" },
      { degree: "BA in Social Work", institution: "Howard University", year: "2022" }
    ],
    researchInterests: ["Family reunification", "Trauma-informed practice", "Policy advocacy", "Racial equity in child welfare"],
    skills: ["Case management", "Policy analysis", "Community organizing", "Qualitative research"],
    availability: "Available for summer research internships",
    linkedin: "linkedin.com/in/marcuswilliams"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "PhD Student",
    organization: "UC Berkeley",
    location: "California, USA",
    email: "emily.r@berkeley.edu",
    tags: ["Child Maltreatment", "Prevention", "Community-Based Programs"],
    description: "Investigating the effectiveness of community-based child maltreatment prevention programs in diverse populations.",
    bio: "Emily Rodriguez is a PhD student at UC Berkeley's School of Social Welfare. Her research examines how community-based prevention programs can reduce child maltreatment, with particular attention to cultural adaptation and community engagement.",
    education: [
      { degree: "PhD in Social Welfare (In Progress)", institution: "UC Berkeley", year: "2022-Present" },
      { degree: "MSW", institution: "UCLA", year: "2020" },
      { degree: "BA in Sociology", institution: "Stanford University", year: "2018" }
    ],
    researchInterests: ["Prevention science", "Community-based participatory research", "Cultural adaptation", "Program evaluation"],
    skills: ["Mixed methods research", "Program evaluation", "Spanish fluency", "Community engagement"],
    publications: [
      { title: "Cultural Adaptation in Child Welfare Prevention", journal: "Children and Youth Services Review", year: "2023" }
    ],
    availability: "Seeking research assistantship opportunities"
  },
  {
    id: 4,
    name: "James Okonkwo",
    title: "MSW Student",
    organization: "University of Toronto",
    location: "Ontario, Canada",
    email: "james.o@utoronto.ca",
    tags: ["Indigenous Families", "Cultural Competency", "Kinship Care"],
    description: "Exploring culturally responsive practices in child welfare services for Indigenous families and communities.",
    bio: "James Okonkwo is an MSW student at the University of Toronto, focusing on Indigenous child welfare. He is committed to decolonizing child welfare practices and supporting Indigenous families through culturally grounded approaches.",
    education: [
      { degree: "MSW (In Progress)", institution: "University of Toronto", year: "2023-Present" },
      { degree: "BSW", institution: "Ryerson University", year: "2022" }
    ],
    researchInterests: ["Indigenous child welfare", "Decolonizing practice", "Kinship care", "Community healing"],
    skills: ["Community-based research", "Indigenous research methodologies", "Policy advocacy"],
    availability: "Open to collaborative research projects"
  },
  {
    id: 5,
    name: "Aisha Patel",
    title: "PhD Candidate",
    organization: "London School of Economics",
    location: "London, UK",
    email: "a.patel@lse.ac.uk",
    tags: ["International Child Welfare", "Policy Comparison", "Immigration"],
    description: "Comparative analysis of child welfare policies across European countries with a focus on immigrant families.",
    bio: "Aisha Patel is a PhD candidate at LSE researching child welfare policy responses to immigration across Europe. Her work examines how different welfare states support immigrant and refugee families.",
    education: [
      { degree: "PhD in Social Policy (In Progress)", institution: "London School of Economics", year: "2021-Present" },
      { degree: "MSc in Social Policy", institution: "University of Oxford", year: "2019" },
      { degree: "BA in Political Science", institution: "University of Cambridge", year: "2017" }
    ],
    researchInterests: ["Comparative social policy", "Immigration and child welfare", "European welfare states", "Policy transfer"],
    skills: ["Comparative policy analysis", "Multi-language research (English, French, German)", "Quantitative methods"],
    publications: [
      { title: "Child Welfare Services for Immigrant Families in Europe", journal: "European Journal of Social Work", year: "2023" }
    ],
    availability: "Available for international research collaborations"
  },
  {
    id: 6,
    name: "David Kim",
    title: "MSW Student",
    organization: "University of Washington",
    location: "Washington, USA",
    email: "david.kim@uw.edu",
    tags: ["Youth Aging Out", "Housing", "Employment"],
    description: "Studying housing and employment outcomes for youth aging out of the foster care system.",
    bio: "David Kim brings lived experience as a former foster youth to his MSW studies at UW. He is passionate about improving outcomes for youth transitioning out of care, particularly in housing stability and employment.",
    education: [
      { degree: "MSW (In Progress)", institution: "University of Washington", year: "2023-Present" },
      { degree: "BA in Human Services", institution: "Seattle University", year: "2021" }
    ],
    researchInterests: ["Youth transitions", "Housing first approaches", "Workforce development", "Peer support"],
    skills: ["Lived experience advocacy", "Program development", "Youth engagement"],
    availability: "Seeking mentorship and research opportunities"
  },
  {
    id: 7,
    name: "Sofia Martinez",
    title: "PhD Student",
    organization: "University of Texas at Austin",
    location: "Texas, USA",
    email: "sofia.m@utexas.edu",
    tags: ["Latino Families", "Disproportionality", "Preventive Services"],
    description: "Examining disproportionality in child welfare involvement among Latino families and developing culturally responsive preventive services.",
    bio: "Sofia Martinez is a PhD student at UT Austin researching racial and ethnic disproportionality in child welfare. Her work focuses on developing prevention strategies that are culturally responsive to Latino families.",
    education: [
      { degree: "PhD in Social Work (In Progress)", institution: "University of Texas at Austin", year: "2022-Present" },
      { degree: "MSW", institution: "Arizona State University", year: "2020" }
    ],
    researchInterests: ["Disproportionality", "Latino families", "Prevention", "Cultural responsiveness"],
    skills: ["Bilingual research (Spanish/English)", "Community-based research", "Survey methodology"],
    availability: "Open to research collaborations"
  },
  {
    id: 8,
    name: "Thomas Anderson",
    title: "MSW Student",
    organization: "Boston University",
    location: "Massachusetts, USA",
    email: "t.anderson@bu.edu",
    tags: ["Substance Abuse", "Parental Recovery", "Family Courts"],
    description: "Researching the intersection of parental substance abuse recovery and child welfare outcomes in family court settings.",
    bio: "Thomas Anderson is an MSW student at Boston University studying the intersection of substance use disorder and child welfare. He is interested in how family courts can better support parental recovery.",
    education: [
      { degree: "MSW (In Progress)", institution: "Boston University", year: "2023-Present" },
      { degree: "BA in Psychology", institution: "Boston College", year: "2021" }
    ],
    researchInterests: ["Substance use and families", "Family court reform", "Recovery supports", "Treatment courts"],
    skills: ["Legal research", "Qualitative interviews", "Data analysis"],
    availability: "Available for summer research positions"
  }
];

export const researchersData: ResearcherProfile[] = [
  {
    id: 1,
    name: "Dr. Rebecca Foster",
    title: "Professor of Social Work",
    organization: "Harvard University",
    location: "Massachusetts, USA",
    email: "r.foster@harvard.edu",
    tags: ["Child Welfare Systems", "Policy Research", "Longitudinal Studies"],
    description: "Leading researcher in child welfare system reform with over 20 years of experience. Currently directing a multi-state study on foster care outcomes.",
    bio: "Dr. Rebecca Foster is a Professor of Social Work at Harvard University and one of the leading voices in child welfare research. Her career spans over two decades of groundbreaking research on child welfare systems, foster care outcomes, and policy reform. She has advised numerous state and federal agencies on child welfare policy.",
    education: [
      { degree: "PhD in Social Work", institution: "University of Chicago", year: "1998" },
      { degree: "MSW", institution: "Columbia University", year: "1994" },
      { degree: "BA in Sociology", institution: "Yale University", year: "1991" }
    ],
    researchAreas: ["Child welfare systems", "Foster care outcomes", "Policy evaluation", "Longitudinal research"],
    currentProjects: [
      { title: "National Foster Care Outcomes Study", description: "Multi-state longitudinal study tracking outcomes for 10,000 foster youth", status: "Active" },
      { title: "Family First Prevention Act Evaluation", description: "Evaluating implementation of FFPSA across 12 states", status: "Active" }
    ],
    publications: [
      { title: "Twenty Years of Foster Care Reform", journal: "Child Welfare Quarterly", year: "2023" },
      { title: "Longitudinal Outcomes in Child Welfare", journal: "American Journal of Social Work", year: "2022" }
    ],
    awards: ["National Child Welfare Leadership Award (2022)", "Distinguished Research Prize, SSWR (2020)"],
    collaborationInterests: ["PhD mentorship", "Multi-site studies", "Policy analysis"],
    website: "rebeccafoster.harvard.edu"
  },
  {
    id: 2,
    name: "Dr. Michael Chang",
    title: "Associate Professor",
    organization: "Stanford University",
    location: "California, USA",
    email: "m.chang@stanford.edu",
    tags: ["Data Science", "Predictive Analytics", "Child Safety"],
    description: "Pioneering the use of machine learning and predictive analytics to improve child safety screening and risk assessment tools.",
    bio: "Dr. Michael Chang is an Associate Professor at Stanford University who bridges computer science and social work. His interdisciplinary research focuses on developing ethical AI tools for child welfare decision-making.",
    education: [
      { degree: "PhD in Computer Science", institution: "MIT", year: "2010" },
      { degree: "MSW", institution: "University of Michigan", year: "2015" }
    ],
    researchAreas: ["Machine learning in social work", "Risk assessment", "Algorithmic fairness", "Child safety technology"],
    currentProjects: [
      { title: "Fair Risk Assessment Models", description: "Developing bias-aware predictive models for child welfare", status: "Active" },
      { title: "AI Ethics in Child Welfare", description: "Creating ethical frameworks for AI deployment", status: "Active" }
    ],
    publications: [
      { title: "Machine Learning in Child Welfare: Promise and Peril", journal: "Nature Human Behaviour", year: "2023" }
    ],
    collaborationInterests: ["Data partnerships", "Algorithm development", "Ethics consultation"],
    website: "stanford.edu/~mchang"
  },
  {
    id: 3,
    name: "Dr. Patricia Oduya",
    title: "Research Director",
    organization: "University of Oxford",
    location: "Oxford, UK",
    email: "p.oduya@ox.ac.uk",
    tags: ["International Child Welfare", "Human Rights", "Policy Advocacy"],
    description: "Expert in international child welfare policy with focus on human rights frameworks and cross-border child protection.",
    bio: "Dr. Patricia Oduya is Research Director at Oxford's Department of Social Policy and Intervention. Her work spans global child welfare policy, human rights, and international child protection mechanisms.",
    education: [
      { degree: "DPhil in Social Policy", institution: "University of Oxford", year: "2005" },
      { degree: "LLM in Human Rights", institution: "University of Cape Town", year: "2000" }
    ],
    researchAreas: ["International child rights", "Global child welfare policy", "Cross-border protection", "Human rights law"],
    currentProjects: [
      { title: "Global Child Protection Index", description: "Developing metrics for comparing child protection systems globally", status: "Active" }
    ],
    collaborationInterests: ["International research partnerships", "Policy advocacy", "Capacity building"],
    website: "ox.ac.uk/poduya"
  },
  {
    id: 4,
    name: "Dr. Jennifer Black",
    title: "Professor",
    organization: "University of Chicago",
    location: "Illinois, USA",
    email: "j.black@uchicago.edu",
    tags: ["Trauma Research", "Neuroscience", "Early Childhood"],
    description: "Researching the neurobiological effects of early childhood trauma and developing evidence-based intervention strategies.",
    bio: "Dr. Jennifer Black is a Professor at the University of Chicago whose groundbreaking research connects neuroscience with child welfare practice. Her work on early childhood trauma has influenced intervention development nationwide.",
    education: [
      { degree: "PhD in Developmental Psychology", institution: "UCLA", year: "2002" },
      { degree: "MD", institution: "Johns Hopkins", year: "2006" }
    ],
    researchAreas: ["Developmental trauma", "Neurobiology of adversity", "Early intervention", "Brain development"],
    publications: [
      { title: "The Neurobiology of Early Adversity", journal: "Nature Neuroscience", year: "2022" }
    ],
    collaborationInterests: ["Intervention development", "Clinical trials", "Brain imaging studies"]
  },
  {
    id: 5,
    name: "Dr. Hans Mueller",
    title: "Senior Researcher",
    organization: "Max Planck Institute",
    location: "Berlin, Germany",
    email: "h.mueller@mpg.de",
    tags: ["Comparative Policy", "European Child Welfare", "Family Services"],
    description: "Conducting comparative research on child welfare policies across European nations with emphasis on family preservation approaches.",
    bio: "Dr. Hans Mueller is a Senior Researcher at the Max Planck Institute for Social Law and Social Policy. His comparative research examines how different European countries approach child welfare and family support.",
    education: [
      { degree: "Dr. rer. pol.", institution: "Humboldt University Berlin", year: "2008" },
      { degree: "MA in European Studies", institution: "College of Europe", year: "2003" }
    ],
    researchAreas: ["Comparative welfare policy", "European family policy", "Prevention and early intervention"],
    collaborationInterests: ["Cross-national studies", "Policy comparison", "European research networks"]
  },
  {
    id: 6,
    name: "Dr. Lisa Thompson",
    title: "Associate Professor",
    organization: "University of Melbourne",
    location: "Victoria, Australia",
    email: "l.thompson@unimelb.edu.au",
    tags: ["Indigenous Child Welfare", "Cultural Safety", "Community Research"],
    description: "Specializing in culturally safe research methodologies and improving outcomes for Indigenous children in the child welfare system.",
    bio: "Dr. Lisa Thompson is an Associate Professor at the University of Melbourne with expertise in Indigenous child welfare. She works closely with Aboriginal communities to develop culturally grounded research and practice.",
    education: [
      { degree: "PhD in Social Work", institution: "University of Melbourne", year: "2012" }
    ],
    researchAreas: ["Indigenous child welfare", "Cultural safety", "Community-based research", "Decolonizing methodologies"],
    collaborationInterests: ["Community partnerships", "Indigenous-led research", "Cultural consultation"]
  },
  {
    id: 7,
    name: "Dr. Robert Martinez",
    title: "Professor",
    organization: "UCLA",
    location: "California, USA",
    email: "r.martinez@ucla.edu",
    tags: ["Implementation Science", "Evidence-Based Practice", "Training"],
    description: "Leading expert in implementation science, focusing on translating research into effective child welfare practice and training programs.",
    bio: "Dr. Robert Martinez is a Professor at UCLA's Luskin School of Public Affairs. His work bridges the gap between research and practice through implementation science approaches.",
    education: [
      { degree: "PhD in Social Welfare", institution: "UC Berkeley", year: "2005" }
    ],
    researchAreas: ["Implementation science", "Workforce development", "Evidence-based practice", "Training and dissemination"],
    collaborationInterests: ["Implementation partnerships", "Training development", "Practice research networks"]
  },
  {
    id: 8,
    name: "Dr. Catherine Wong",
    title: "Research Fellow",
    organization: "National University of Singapore",
    location: "Singapore",
    email: "c.wong@nus.edu.sg",
    tags: ["Asian Child Welfare", "Family Dynamics", "Urban Poverty"],
    description: "Investigating the intersection of urban poverty and child welfare in rapidly developing Asian cities.",
    bio: "Dr. Catherine Wong is a Research Fellow at NUS focusing on child welfare in the Asian context. Her research examines how rapid urbanization affects family welfare and child protection.",
    education: [
      { degree: "PhD in Social Work", institution: "National University of Singapore", year: "2018" }
    ],
    researchAreas: ["Asian child welfare", "Urban poverty", "Family support systems", "Child protection in Asia"],
    collaborationInterests: ["Regional research networks", "Comparative Asian studies", "Policy development"]
  }
];

export const agenciesData: AgencyProfile[] = [
  {
    id: 1,
    name: "Children's Welfare Alliance",
    title: "National Nonprofit Organization",
    organization: "Established 1985",
    location: "Washington D.C., USA",
    email: "research@cwa.org",
    tags: ["Foster Care", "Adoption Services", "Data Sharing", "National Scope"],
    description: "Leading national organization providing foster care and adoption services. Actively seeking research partnerships to improve outcomes for children in care.",
    mission: "To ensure every child has a safe, permanent, and loving family through excellence in foster care and adoption services.",
    founded: "1985",
    staffSize: "500+ employees nationwide",
    serviceAreas: ["Foster care placement", "Adoption services", "Post-adoption support", "Training and technical assistance"],
    programs: [
      { name: "Forever Families Program", description: "Matching children with adoptive families and providing post-adoption support" },
      { name: "Foster Parent Academy", description: "Comprehensive training for foster parents" },
      { name: "Transition Success", description: "Supporting youth aging out of care" }
    ],
    dataAvailability: ["Anonymized placement data", "Outcome metrics", "Program evaluation data"],
    collaborationTypes: ["Research partnerships", "Program evaluation", "Data sharing agreements"],
    website: "www.cwa.org",
    phone: "(202) 555-0123"
  },
  {
    id: 2,
    name: "Family First Initiative",
    title: "State Agency",
    organization: "California DCFS",
    location: "California, USA",
    email: "partnerships@ffi.ca.gov",
    tags: ["Prevention", "Family Preservation", "Evidence-Based Programs"],
    description: "State-level initiative focused on keeping families together through evidence-based prevention programs. Open to collaboration on program evaluation.",
    mission: "To prevent child abuse and neglect by strengthening families through evidence-based prevention and early intervention services.",
    founded: "2018",
    staffSize: "150 dedicated staff",
    serviceAreas: ["Family preservation", "Prevention services", "Parent education", "Home visiting"],
    programs: [
      { name: "Family Support Centers", description: "Community-based family resource centers throughout California" },
      { name: "Parent Partners Program", description: "Peer support for families involved with child welfare" }
    ],
    dataAvailability: ["Program participation data", "Outcome measures", "Cost-effectiveness data"],
    collaborationTypes: ["Program evaluation", "Implementation research", "Policy analysis"],
    website: "www.ffi.ca.gov"
  },
  {
    id: 3,
    name: "Global Child Protection Network",
    title: "International NGO",
    organization: "Founded 2001",
    location: "Geneva, Switzerland",
    email: "research@gcpn.int",
    tags: ["International", "Human Rights", "Policy Advocacy", "Cross-Border"],
    description: "International NGO working across 45 countries to protect children's rights and improve welfare systems globally.",
    mission: "To advance children's rights and strengthen child protection systems worldwide through research, advocacy, and capacity building.",
    founded: "2001",
    staffSize: "200+ staff across 45 countries",
    serviceAreas: ["Policy advocacy", "Capacity building", "Research and evaluation", "Emergency response"],
    programs: [
      { name: "Child Protection Systems Strengthening", description: "Technical assistance to governments" },
      { name: "Global Research Initiative", description: "Comparative research on child protection" }
    ],
    dataAvailability: ["Cross-national datasets", "Policy databases", "Program documentation"],
    collaborationTypes: ["International research", "Policy development", "Training partnerships"],
    website: "www.gcpn.int"
  },
  {
    id: 4,
    name: "Kinship Care Foundation",
    title: "Nonprofit Organization",
    organization: "Regional Network",
    location: "Texas, USA",
    email: "info@kinshipcare.org",
    tags: ["Kinship Care", "Grandparent Caregivers", "Support Services"],
    description: "Supporting kinship caregivers across the Southwest with resources, training, and advocacy. Interested in research on kinship care outcomes.",
    mission: "To support kinship families by providing resources, advocacy, and community to grandparents and relatives raising children.",
    founded: "2005",
    staffSize: "45 staff members",
    serviceAreas: ["Kinship caregiver support", "Legal assistance", "Support groups", "Financial assistance"],
    programs: [
      { name: "Kinship Navigator", description: "Helping families access services and benefits" },
      { name: "Grandparents Raising Grandchildren", description: "Support groups and resources" }
    ],
    dataAvailability: ["Caregiver survey data", "Program outcomes", "Service utilization data"],
    collaborationTypes: ["Research partnerships", "Needs assessments", "Program development"]
  },
  {
    id: 5,
    name: "Youth Transitions Project",
    title: "Community Organization",
    organization: "Multi-City Initiative",
    location: "New York, USA",
    email: "connect@ytp.org",
    tags: ["Youth Aging Out", "Housing", "Employment", "Education"],
    description: "Helping youth aging out of foster care transition to independence with housing, employment, and educational support services.",
    mission: "To ensure every young person leaving foster care has the support they need to thrive as independent adults.",
    founded: "2010",
    staffSize: "75 staff across 5 cities",
    serviceAreas: ["Housing assistance", "Employment training", "Educational support", "Life skills coaching"],
    programs: [
      { name: "Housing First for Youth", description: "Rapid housing placement with wraparound support" },
      { name: "Career Pathways", description: "Employment training and job placement" }
    ],
    dataAvailability: ["Youth outcome data", "Housing stability metrics", "Employment outcomes"],
    collaborationTypes: ["Outcome research", "Program evaluation", "Youth participatory research"]
  },
  {
    id: 6,
    name: "Indigenous Child & Family Services",
    title: "Tribal Organization",
    organization: "First Nations Partnership",
    location: "British Columbia, Canada",
    email: "partnerships@icfs.ca",
    tags: ["Indigenous Families", "Cultural Programs", "Sovereignty", "ICWA"],
    description: "Providing culturally grounded child welfare services to Indigenous communities. Seeking research partners committed to community-based approaches.",
    mission: "To reclaim Indigenous approaches to child and family wellbeing through culturally grounded, community-led services.",
    founded: "1998",
    staffSize: "120 staff serving 15 First Nations",
    serviceAreas: ["Family support", "Cultural reconnection", "Prevention", "Kinship care"],
    programs: [
      { name: "Cultural Camps", description: "Reconnecting children with cultural teachings and traditions" },
      { name: "Family Healing Circles", description: "Traditional approaches to family healing" }
    ],
    dataAvailability: ["Community-controlled data", "Program outcomes (with community consent)"],
    collaborationTypes: ["Community-based participatory research", "Indigenous research methodologies", "Capacity building"]
  },
  {
    id: 7,
    name: "Safe Futures UK",
    title: "Charity Organization",
    organization: "National Charity",
    location: "London, UK",
    email: "research@safefutures.org.uk",
    tags: ["Child Protection", "Training", "Professional Development"],
    description: "UK charity focused on child protection training and professional development for social workers and child welfare practitioners.",
    mission: "To improve child protection practice through world-class training, research, and professional development.",
    founded: "1995",
    staffSize: "85 staff",
    serviceAreas: ["Professional training", "Consultancy", "Research", "Resource development"],
    programs: [
      { name: "Advanced Practitioner Program", description: "Leadership development for experienced workers" },
      { name: "Research into Practice", description: "Translating research for frontline workers" }
    ],
    dataAvailability: ["Training evaluation data", "Practice survey data"],
    collaborationTypes: ["Training research", "Practice innovation", "Curriculum development"]
  },
  {
    id: 8,
    name: "Child Welfare Innovation Lab",
    title: "Research Institute",
    organization: "University-Affiliated",
    location: "Illinois, USA",
    email: "lab@cwinnovation.org",
    tags: ["Innovation", "Technology", "Research Translation", "Pilot Programs"],
    description: "University-affiliated research institute testing innovative approaches to child welfare practice and technology solutions.",
    mission: "To accelerate innovation in child welfare through rigorous testing, technology development, and research-practice partnerships.",
    founded: "2015",
    staffSize: "35 researchers and staff",
    serviceAreas: ["Innovation testing", "Technology development", "Research translation", "Pilot programs"],
    programs: [
      { name: "Innovation Incubator", description: "Testing promising practices in real-world settings" },
      { name: "Tech for Good", description: "Developing technology solutions for child welfare" }
    ],
    dataAvailability: ["Pilot program data", "Technology evaluation data", "Implementation metrics"],
    collaborationTypes: ["Co-development", "Pilot partnerships", "Technology testing"]
  }
];
