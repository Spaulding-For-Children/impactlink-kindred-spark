import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, BookOpen, Award, Briefcase, Globe, Linkedin, Microscope, FlaskConical } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactFormModal } from "@/components/modals/ContactFormModal";
import { researchersData } from "@/data/profiles";

export default function ResearcherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const researcher = researchersData.find((r) => r.id === Number(id));

  if (!researcher) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Researcher Not Found</h1>
          <Button onClick={() => navigate("/researchers")}>
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
        <section className="py-12 bg-gradient-to-b from-navy/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/researchers">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Researchers
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-navy/10 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl font-bold text-navy">
                  {researcher.name.charAt(0)}
                </span>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
                  {researcher.name}
                </h1>
                <p className="text-xl text-navy font-medium mb-2">{researcher.title}</p>
                <p className="text-lg text-muted-foreground mb-4">{researcher.organization}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {researcher.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {researcher.email}
                  </span>
                  {researcher.website && (
                    <a href={`https://${researcher.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-navy transition-colors">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {researcher.linkedin && (
                    <a href={`https://${researcher.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-navy transition-colors">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {researcher.tags.map((tag) => (
                    <Badge key={tag} className="bg-navy/10 text-navy hover:bg-navy/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <div className="flex-shrink-0">
                <Button 
                  className="bg-navy hover:bg-navy/90 text-white"
                  onClick={() => setContactModalOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Researcher
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Modal */}
        <ContactFormModal
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          recipientName={researcher.name}
          recipientType="researcher"
        />

        {/* Content Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Bio */}
                {researcher.bio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Microscope className="h-5 w-5 text-navy" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{researcher.bio}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Current Projects */}
                {researcher.currentProjects && researcher.currentProjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-navy" />
                          Current Research Projects
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {researcher.currentProjects.map((project, idx) => (
                            <li key={idx} className="border-l-2 border-navy/30 pl-4">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground">{project.title}</p>
                                <Badge variant="outline" className="text-xs">{project.status}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Publications */}
                {researcher.publications && researcher.publications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-navy" />
                          Selected Publications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {researcher.publications.map((pub, idx) => (
                            <li key={idx} className="border-l-2 border-navy/30 pl-4">
                              <p className="font-medium text-foreground">{pub.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {pub.journal} • {pub.year}
                              </p>
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
                {/* Education */}
                {researcher.education && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-navy" />
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {researcher.education.map((edu, idx) => (
                            <li key={idx}>
                              <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                              <p className="text-xs text-muted-foreground">{edu.year}</p>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Research Areas */}
                {researcher.researchAreas && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-navy" />
                          Research Areas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {researcher.researchAreas.map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Awards */}
                {researcher.awards && researcher.awards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="border-navy/20 bg-navy/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-navy" />
                          Awards & Recognition
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {researcher.awards.map((award, idx) => (
                            <li key={idx} className="text-sm text-foreground">
                              {award}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Collaboration Interests */}
                {researcher.collaborationInterests && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Seeking Collaborators For</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {researcher.collaborationInterests.map((interest, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                              {interest}
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
