import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Microscope, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/directory/ProfileCard";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { Button } from "@/components/ui/button";

const researchersData = [
  {
    id: 1,
    name: "Dr. Rebecca Foster",
    title: "Professor of Social Work",
    organization: "Harvard University",
    location: "Massachusetts, USA",
    email: "r.foster@harvard.edu",
    tags: ["Child Welfare Systems", "Policy Research", "Longitudinal Studies"],
    description: "Leading researcher in child welfare system reform with over 20 years of experience. Currently directing a multi-state study on foster care outcomes.",
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
  },
];

const availableTags = [
  "Child Welfare Systems",
  "Policy Research",
  "Data Science",
  "Predictive Analytics",
  "Trauma Research",
  "Implementation Science",
  "Evidence-Based Practice",
  "International Child Welfare",
  "Indigenous Child Welfare",
  "Early Childhood",
  "Family Services",
  "Cultural Safety",
];

const locations = [
  { label: "United States", value: "usa" },
  { label: "United Kingdom", value: "uk" },
  { label: "Europe", value: "europe" },
  { label: "Asia Pacific", value: "apac" },
];

export default function Researchers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredResearchers = useMemo(() => {
    let result = [...researchersData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.organization.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((r) =>
        selectedTags.some((tag) => r.tags.includes(tag))
      );
    }

    if (locationFilter !== "all") {
      result = result.filter((r) => {
        const loc = r.location.toLowerCase();
        switch (locationFilter) {
          case "usa":
            return loc.includes("usa");
          case "uk":
            return loc.includes("uk");
          case "europe":
            return loc.includes("uk") || loc.includes("germany");
          case "apac":
            return loc.includes("australia") || loc.includes("singapore");
          default:
            return true;
        }
      });
    }

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
        <section className="py-16 bg-gradient-to-b from-navy/5 to-background">
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
              <div className="w-16 h-16 rounded-2xl bg-navy/10 flex items-center justify-center">
                <Microscope className="h-8 w-8 text-navy" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Researcher Directory
                </h1>
                <p className="text-muted-foreground">
                  {filteredResearchers.length} researchers advancing child welfare knowledge
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl"
            >
              Discover university-affiliated researchers working on child welfare topics. 
              View their publications, current studies, and areas of expertise.
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
              type="researcher"
            />

            {filteredResearchers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResearchers.map((researcher, index) => (
                  <ProfileCard
                    key={researcher.id}
                    name={researcher.name}
                    title={researcher.title}
                    organization={researcher.organization}
                    location={researcher.location}
                    email={researcher.email}
                    tags={researcher.tags}
                    description={researcher.description}
                    type="researcher"
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
                  No researchers found matching your criteria.
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
