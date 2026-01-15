import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Globe, Phone, Building2, Target, Users, Database, Handshake } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { agenciesData } from "@/data/profiles";

export default function AgencyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const agency = agenciesData.find((a) => a.id === Number(id));

  if (!agency) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Agency Not Found</h1>
          <Button onClick={() => navigate("/agencies")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-sage/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/agencies">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Agencies
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-16 w-16 text-sage" />
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
                  {agency.name}
                </h1>
                <p className="text-xl text-sage font-medium mb-2">{agency.title}</p>
                <p className="text-lg text-muted-foreground mb-4">{agency.organization}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {agency.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {agency.email}
                  </span>
                  {agency.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {agency.phone}
                    </span>
                  )}
                  {agency.website && (
                    <a href={`https://${agency.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sage transition-colors">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {agency.tags.map((tag) => (
                    <Badge key={tag} className="bg-sage/10 text-sage hover:bg-sage/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <div className="flex-shrink-0">
                <Button className="bg-sage hover:bg-sage/90 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Agency
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Mission */}
                {agency.mission && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-sage" />
                          Our Mission
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{agency.mission}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Programs */}
                {agency.programs && agency.programs.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-sage" />
                          Programs & Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {agency.programs.map((program, idx) => (
                            <li key={idx} className="border-l-2 border-sage/30 pl-4">
                              <p className="font-medium text-foreground">{program.name}</p>
                              <p className="text-sm text-muted-foreground">{program.description}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Data Availability */}
                {agency.dataAvailability && agency.dataAvailability.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-sage" />
                          Data Availability for Research
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {agency.dataAvailability.map((data, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                              {data}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Organization Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-sage" />
                        Organization Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {agency.founded && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Founded</p>
                          <p className="font-medium text-foreground">{agency.founded}</p>
                        </div>
                      )}
                      {agency.staffSize && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Staff Size</p>
                          <p className="font-medium text-foreground">{agency.staffSize}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Service Areas */}
                {agency.serviceAreas && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Service Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {agency.serviceAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Collaboration Types */}
                {agency.collaborationTypes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="border-sage/20 bg-sage/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Handshake className="h-5 w-5 text-sage" />
                          Collaboration Interests
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {agency.collaborationTypes.map((type, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                              {type}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
