import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/directory/ProfileCard";
import { DirectoryFilters } from "@/components/directory/DirectoryFilters";
import { Button } from "@/components/ui/button";

const agenciesData = [
  {
    id: 1,
    name: "Children's Welfare Alliance",
    title: "National Nonprofit Organization",
    organization: "Established 1985",
    location: "Washington D.C., USA",
    email: "research@cwa.org",
    tags: ["Foster Care", "Adoption Services", "Data Sharing", "National Scope"],
    description: "Leading national organization providing foster care and adoption services. Actively seeking research partnerships to improve outcomes for children in care.",
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
  },
];

const availableTags = [
  "Foster Care",
  "Prevention",
  "Family Preservation",
  "Kinship Care",
  "Youth Aging Out",
  "Indigenous Families",
  "Child Protection",
  "International",
  "Data Sharing",
  "Evidence-Based Programs",
  "Innovation",
  "Policy Advocacy",
];

const locations = [
  { label: "United States", value: "usa" },
  { label: "Canada", value: "canada" },
  { label: "United Kingdom", value: "uk" },
  { label: "International", value: "international" },
];

export default function Agencies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredAgencies = useMemo(() => {
    let result = [...agenciesData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.organization.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((a) =>
        selectedTags.some((tag) => a.tags.includes(tag))
      );
    }

    if (locationFilter !== "all") {
      result = result.filter((a) => {
        const loc = a.location.toLowerCase();
        switch (locationFilter) {
          case "usa":
            return loc.includes("usa");
          case "canada":
            return loc.includes("canada");
          case "uk":
            return loc.includes("uk");
          case "international":
            return loc.includes("switzerland") || loc.includes("geneva");
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
        <section className="py-16 bg-gradient-to-b from-sage/5 to-background">
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
              <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-sage" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Agency Directory
                </h1>
                <p className="text-muted-foreground">
                  {filteredAgencies.length} organizations open to collaboration
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-3xl"
            >
              Connect with child welfare and nonprofit organizations from around the world. 
              Each profile includes mission statements, service areas, and collaboration interests.
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
              type="agency"
            />

            {filteredAgencies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map((agency, index) => (
                  <ProfileCard
                    key={agency.id}
                    name={agency.name}
                    title={agency.title}
                    organization={agency.organization}
                    location={agency.location}
                    email={agency.email}
                    tags={agency.tags}
                    description={agency.description}
                    type="agency"
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
                  No agencies found matching your criteria.
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
