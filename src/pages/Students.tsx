import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/directory/ProfileCard";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { Button } from "@/components/ui/button";

const studentsData = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "PhD Candidate",
    organization: "Columbia University",
    location: "New York, USA",
    email: "sarah.chen@columbia.edu",
    tags: ["Foster Care", "Mental Health", "Quantitative Methods"],
    description: "Researching the long-term outcomes of foster care youth transitioning to adulthood, with a focus on mental health interventions and support systems.",
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
  },
];

const availableTags = [
  "Foster Care",
  "Mental Health",
  "Family Reunification",
  "Trauma-Informed Care",
  "Child Maltreatment",
  "Prevention",
  "Indigenous Families",
  "Kinship Care",
  "Youth Aging Out",
  "Policy Analysis",
  "Substance Abuse",
  "Disproportionality",
];

const locations = [
  { label: "United States", value: "usa" },
  { label: "Canada", value: "canada" },
  { label: "United Kingdom", value: "uk" },
  { label: "Europe", value: "europe" },
];

export default function Students() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredStudents = useMemo(() => {
    let result = [...studentsData];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.organization.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      result = result.filter((s) =>
        selectedTags.some((tag) => s.tags.includes(tag))
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      result = result.filter((s) => {
        const loc = s.location.toLowerCase();
        switch (locationFilter) {
          case "usa":
            return loc.includes("usa");
          case "canada":
            return loc.includes("canada");
          case "uk":
            return loc.includes("uk");
          case "europe":
            return loc.includes("uk") || loc.includes("europe");
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "recent":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedTags, locationFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-amber/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-amber" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Student Directory
                </h1>
                <p className="text-muted-foreground">
                  {filteredStudents.length} students seeking research opportunities
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl"
            >
              Browse profiles of MSW and PhD students actively seeking research opportunities. 
              Learn about their academic backgrounds, interests, and availability for collaboration.
            </motion.p>
          </div>
        </section>

        {/* Directory Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <DirectoryFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={availableTags}
              locationFilter={locationFilter}
              onLocationChange={setLocationFilter}
              locations={locations}
              sortBy={sortBy}
              onSortChange={setSortBy}
              type="student"
            />

            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student, index) => (
                  <ProfileCard
                    key={student.id}
                    name={student.name}
                    title={student.title}
                    organization={student.organization}
                    location={student.location}
                    email={student.email}
                    tags={student.tags}
                    description={student.description}
                    type="student"
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-lg text-muted-foreground">
                  No students found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                    setLocationFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
