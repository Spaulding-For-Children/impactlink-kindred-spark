import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Calendar, BookOpen, Award, Briefcase, Globe, Linkedin, GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentsData } from "@/data/profiles";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = studentsData.find((s) => s.id === Number(id));

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Student Not Found</h1>
          <Button onClick={() => navigate("/students")}>
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
        <section className="py-12 bg-gradient-to-b from-amber/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/students">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Students
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl font-bold text-amber">
                  {student.name.charAt(0)}
                </span>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
                  {student.name}
                </h1>
                <p className="text-xl text-amber font-medium mb-2">{student.title}</p>
                <p className="text-lg text-muted-foreground mb-4">{student.organization}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {student.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </span>
                  {student.website && (
                    <a href={`https://${student.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-amber transition-colors">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {student.linkedin && (
                    <a href={`https://${student.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-amber transition-colors">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {student.tags.map((tag) => (
                    <Badge key={tag} className="bg-amber/10 text-amber hover:bg-amber/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <div className="flex-shrink-0">
                <Button className="bg-amber hover:bg-amber/90 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Student
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
                {/* Bio */}
                {student.bio && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-amber" />
                          About
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{student.bio}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Research Interests */}
                {student.researchInterests && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-amber" />
                          Research Interests
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {student.researchInterests.map((interest) => (
                            <Badge key={interest} variant="outline">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Publications */}
                {student.publications && student.publications.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-amber" />
                          Publications
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {student.publications.map((pub, idx) => (
                            <li key={idx} className="border-l-2 border-amber/30 pl-4">
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
                {student.education && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-amber" />
                          Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          {student.education.map((edu, idx) => (
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

                {/* Skills */}
                {student.skills && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-amber" />
                          Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Availability */}
                {student.availability && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Card className="border-amber/20 bg-amber/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-amber" />
                          Availability
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground">{student.availability}</p>
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
