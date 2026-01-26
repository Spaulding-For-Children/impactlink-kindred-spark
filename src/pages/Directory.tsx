import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  GraduationCap, 
  Microscope, 
  Building2,
  MapPin,
  Mail,
  ExternalLink,
  Filter,
  LayoutGrid,
  List,
  Users
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ContactFormModal } from "@/components/modals/ContactFormModal";
import { studentsData, researchersData, agenciesData } from "@/data/profiles";

type ProfileType = "all" | "student" | "researcher" | "agency";
type ViewMode = "grid" | "list";

interface UnifiedProfile {
  id: number;
  name: string;
  title: string;
  organization: string;
  location: string;
  email: string;
  tags: string[];
  description: string;
  type: "student" | "researcher" | "agency";
}

const allProfiles: UnifiedProfile[] = [
  ...studentsData.map((s) => ({ ...s, type: "student" as const })),
  ...researchersData.map((r) => ({ ...r, type: "researcher" as const })),
  ...agenciesData.map((a) => ({ ...a, type: "agency" as const })),
];

// Extract unique values for filters
const allTags = [...new Set(allProfiles.flatMap((p) => p.tags))].sort();
const allLocations = [...new Set(allProfiles.map((p) => p.location))].sort();
const allOrganizations = [...new Set(allProfiles.map((p) => p.organization))].sort();

export default function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UnifiedProfile | null>(null);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedLocations([]);
    setProfileType("all");
    setSearchQuery("");
  };

  const filteredProfiles = useMemo(() => {
    let result = allProfiles;

    // Filter by type
    if (profileType !== "all") {
      result = result.filter((p) => p.type === profileType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.organization.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => p.tags.includes(tag))
      );
    }

    // Filter by locations
    if (selectedLocations.length > 0) {
      result = result.filter((p) => selectedLocations.includes(p.location));
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "organization":
          return a.organization.localeCompare(b.organization);
        case "location":
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, profileType, selectedTags, selectedLocations, sortBy]);

  const activeFiltersCount = selectedTags.length + selectedLocations.length + (profileType !== "all" ? 1 : 0);

  const typeColors = {
    student: {
      bg: "bg-amber/10",
      text: "text-amber",
      badge: "bg-amber/10 text-amber hover:bg-amber/20",
      border: "border-amber/30",
    },
    researcher: {
      bg: "bg-navy/10",
      text: "text-navy",
      badge: "bg-navy/10 text-navy hover:bg-navy/20",
      border: "border-navy/30",
    },
    agency: {
      bg: "bg-sage/10",
      text: "text-sage",
      badge: "bg-sage/10 text-sage hover:bg-sage/20",
      border: "border-sage/30",
    },
  };

  const typeIcons = {
    student: GraduationCap,
    researcher: Microscope,
    agency: Building2,
  };

  const handleContactClick = (profile: UnifiedProfile) => {
    setSelectedProfile(profile);
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-navy/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">
                Complete Directory
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
                Find Your Collaborators
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse our comprehensive directory of students, researchers, and agencies 
                working to improve child welfare outcomes worldwide.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div>
                  <p className="text-3xl font-display font-bold text-amber">{studentsData.length}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-navy">{researchersData.length}</p>
                  <p className="text-sm text-muted-foreground">Researchers</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-sage">{agenciesData.length}</p>
                  <p className="text-sm text-muted-foreground">Agencies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-2xl border border-border shadow-soft p-4 sm:p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, organization, interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Type Tabs */}
                <Tabs value={profileType} onValueChange={(v) => setProfileType(v as ProfileType)}>
                  <TabsList className="h-10">
                    <TabsTrigger value="all" className="gap-1.5">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">All</span>
                    </TabsTrigger>
                    <TabsTrigger value="student" className="gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      <span className="hidden sm:inline">Students</span>
                    </TabsTrigger>
                    <TabsTrigger value="researcher" className="gap-1.5">
                      <Microscope className="h-4 w-4" />
                      <span className="hidden sm:inline">Researchers</span>
                    </TabsTrigger>
                    <TabsTrigger value="agency" className="gap-1.5">
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Agencies</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Sort & View */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Narrow down your search results
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        {/* Tags Filter */}
                        <div>
                          <h4 className="font-medium mb-3">Research Interests</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {allTags.slice(0, 20).map((tag) => (
                              <div key={tag} className="flex items-center gap-2">
                                <Checkbox
                                  id={`mobile-tag-${tag}`}
                                  checked={selectedTags.includes(tag)}
                                  onCheckedChange={() => handleTagToggle(tag)}
                                />
                                <Label htmlFor={`mobile-tag-${tag}`} className="text-sm">
                                  {tag}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Locations Filter */}
                        <div>
                          <h4 className="font-medium mb-3">Locations</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {allLocations.map((location) => (
                              <div key={location} className="flex items-center gap-2">
                                <Checkbox
                                  id={`mobile-loc-${location}`}
                                  checked={selectedLocations.includes(location)}
                                  onCheckedChange={() => handleLocationToggle(location)}
                                />
                                <Label htmlFor={`mobile-loc-${location}`} className="text-sm">
                                  {location}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={clearFilters}
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedTags.length > 0 || selectedLocations.length > 0) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    {selectedLocations.map((location) => (
                      <Badge
                        key={location}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleLocationToggle(location)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Main Content */}
            <div className="flex gap-8">
              {/* Desktop Sidebar Filters */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden lg:block w-72 flex-shrink-0"
              >
                <div className="bg-card rounded-2xl border border-border shadow-soft p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-xs h-7"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Research Interests */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                      Research Interests
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {allTags.map((tag) => (
                        <div key={tag} className="flex items-center gap-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <Label
                            htmlFor={`tag-${tag}`}
                            className="text-sm cursor-pointer flex-1 truncate"
                          >
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Locations */}
                  <div>
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                      Location
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {allLocations.map((location) => (
                        <div key={location} className="flex items-center gap-2">
                          <Checkbox
                            id={`loc-${location}`}
                            checked={selectedLocations.includes(location)}
                            onCheckedChange={() => handleLocationToggle(location)}
                          />
                          <Label
                            htmlFor={`loc-${location}`}
                            className="text-sm cursor-pointer flex-1 truncate"
                          >
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>

              {/* Results */}
              <div className="flex-1">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredProfiles.length}</span> results
                  </p>
                </div>

                {/* Results Grid/List */}
                {filteredProfiles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters}>Clear all filters</Button>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProfiles.map((profile, index) => {
                      const Icon = typeIcons[profile.type];
                      const colors = typeColors[profile.type];
                      const profileUrl = `/${profile.type}s/${profile.id}`;

                      return (
                        <motion.div
                          key={`${profile.type}-${profile.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                        >
                          <Card className="h-full hover:shadow-elevated transition-all duration-300 group">
                            <CardContent className="p-6">
                              {/* Header */}
                              <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`h-6 w-6 ${colors.text}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-display font-bold text-foreground truncate">
                                      {profile.name}
                                    </h3>
                                    <Badge variant="outline" className={`text-xs ${colors.border} ${colors.text}`}>
                                      {profile.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">{profile.title}</p>
                                  <p className={`text-sm ${colors.text} truncate`}>{profile.organization}</p>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {profile.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {profile.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {profile.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    +{profile.tags.length - 3}
                                  </Badge>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate max-w-[120px]">{profile.location}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleContactClick(profile)}
                                  >
                                    <Mail className="h-3.5 w-3.5" />
                                  </Button>
                                  <Link to={profileUrl}>
                                    <Button variant="ghost" size="sm" className={`h-8 ${colors.text}`}>
                                      View
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProfiles.map((profile, index) => {
                      const Icon = typeIcons[profile.type];
                      const colors = typeColors[profile.type];
                      const profileUrl = `/${profile.type}s/${profile.id}`;

                      return (
                        <motion.div
                          key={`${profile.type}-${profile.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.2) }}
                        >
                          <Card className="hover:shadow-elevated transition-all duration-300">
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`h-6 w-6 ${colors.text}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h3 className="font-display font-bold text-foreground">
                                      {profile.name}
                                    </h3>
                                    <Badge variant="outline" className={`w-fit text-xs ${colors.border} ${colors.text}`}>
                                      {profile.type}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    {profile.title} • {profile.organization}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                                    <MapPin className="h-3 w-3" />
                                    {profile.location}
                                  </p>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {profile.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {profile.tags.slice(0, 5).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {profile.tags.length > 5 && (
                                      <Badge variant="outline" className="text-xs text-muted-foreground">
                                        +{profile.tags.length - 5}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleContactClick(profile)}
                                  >
                                    <Mail className="h-4 w-4 mr-1.5" />
                                    Contact
                                  </Button>
                                  <Link to={profileUrl}>
                                    <Button size="sm" className={`${colors.bg} ${colors.text} w-full`}>
                                      View Profile
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Modal */}
      {selectedProfile && (
        <ContactFormModal
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          recipientName={selectedProfile.name}
          recipientType={selectedProfile.type}
        />
      )}

      <Footer />
    </div>
  );
}
