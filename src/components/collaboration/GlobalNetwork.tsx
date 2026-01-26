import { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, MapPin, GraduationCap, Building, Users, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfiles, UnifiedProfile } from "@/hooks/useProfiles";
import { Link } from "react-router-dom";

const REGIONS = [
  { value: "all", label: "All Regions" },
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Australia", label: "Australia" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Africa", label: "Africa" },
  { value: "Latin America", label: "Latin America" },
];

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  researcher: Building,
  agency: Users,
};

const TYPE_COLORS: Record<string, string> = {
  student: "bg-sky-100 text-sky-700",
  researcher: "bg-violet-100 text-violet-700",
  agency: "bg-amber/20 text-amber",
};

export const GlobalNetwork = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { profiles, loading: isLoading } = useProfiles();

  // Filter profiles
  const filteredProfiles = profiles?.filter((profile) => {
    const matchesSearch =
      !searchQuery ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.institution?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests?.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion =
      regionFilter === "all" ||
      profile.location?.toLowerCase().includes(regionFilter.toLowerCase());

    const matchesType = typeFilter === "all" || profile.type === typeFilter;

    return matchesSearch && matchesRegion && matchesType;
  });

  // Group by location for stats
  const locationGroups = profiles.reduce((acc, profile) => {
    const loc = profile.location || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locationGroups)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage mb-4">
          <Globe2 className="w-5 h-5" />
          <span className="font-medium">Global Network</span>
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">
          Connect Worldwide
        </h2>
        <p className="text-muted-foreground">
          {profiles?.length || 0} partners across the globe working to improve child welfare
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {topLocations.map(([location, count]) => (
          <Card key={location}>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-sage">{count as number}</div>
              <div className="text-sm text-muted-foreground truncate">{location}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, institution, or interest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <MapPin className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="researcher">Researchers</SelectItem>
            <SelectItem value="agency">Agencies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : filteredProfiles?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No partners found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProfiles?.map((profile, index) => {
            const TypeIcon = TYPE_ICONS[profile.type] || Users;
            const typeColor = TYPE_COLORS[profile.type] || "bg-muted text-muted-foreground";

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className="h-full hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={profile.avatar || undefined} />
                        <AvatarFallback className="bg-sage/10 text-sage">
                          {profile.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{profile.name}</h3>
                        <Badge className={`text-xs ${typeColor}`}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {profile.type}
                        </Badge>
                      </div>
                    </div>

                    {profile.institution && (
                      <p className="text-sm text-muted-foreground mb-2 truncate">
                        {profile.institution}
                      </p>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}

                    {profile.interests && profile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {profile.interests.slice(0, 2).map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {profile.interests.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/profile/${profile.id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
