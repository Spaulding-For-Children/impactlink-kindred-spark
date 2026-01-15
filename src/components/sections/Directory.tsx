import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Microscope, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const profiles = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Browse profiles of MSW and PhD students actively seeking research opportunities. Learn about their academic backgrounds, interests, and availability for collaboration.",
    features: [
      "Academic background & research interests",
      "Skills & software proficiency",
      "Availability & collaboration preferences",
      "Career goals & motivations"
    ],
    count: "500+",
    color: "amber",
  },
  {
    icon: Microscope,
    title: "Researchers",
    description: "Discover university-affiliated researchers working on child welfare topics. View their publications, current studies, and areas of expertise.",
    features: [
      "Publications & research portfolio",
      "Current studies & methodologies",
      "Collaboration opportunities",
      "Professional experience"
    ],
    count: "200+",
    color: "navy",
  },
  {
    icon: Building2,
    title: "Agencies",
    description: "Connect with child welfare and nonprofit organizations from around the world. Each profile includes mission statements, service areas, and collaboration interests.",
    features: [
      "Mission & service areas",
      "Data availability & sharing policies",
      "Research collaboration interests",
      "Geographic coverage"
    ],
    count: "150+",
    color: "sage",
  },
];

export const Directory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="directory" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">
            User Profiles & Directory
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Connect with the Right People
          </h2>
          <p className="text-lg text-muted-foreground">
            Our directory brings together students, researchers, and agencies from around the globe, 
            making it easy to find the perfect collaboration partners.
          </p>
        </motion.div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300">
                {/* Icon & Count */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    profile.color === 'amber' ? 'bg-amber/10' : 
                    profile.color === 'navy' ? 'bg-navy/10' : 
                    'bg-sage/10'
                  }`}>
                    <profile.icon className={`h-7 w-7 ${
                      profile.color === 'amber' ? 'text-amber' : 
                      profile.color === 'navy' ? 'text-navy' : 
                      'text-sage'
                    }`} />
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-display font-bold ${
                      profile.color === 'amber' ? 'text-amber' : 
                      profile.color === 'navy' ? 'text-navy' : 
                      'text-sage'
                    }`}>{profile.count}</span>
                    <p className="text-xs text-muted-foreground">Active Profiles</p>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  {profile.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {profile.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {profile.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        profile.color === 'amber' ? 'bg-amber' : 
                        profile.color === 'navy' ? 'bg-navy' : 
                        'bg-sage'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={`/${profile.title.toLowerCase()}`}>
                  <Button 
                    variant="ghost" 
                    className={`group/btn w-full justify-between ${
                      profile.color === 'amber' ? 'hover:text-amber' : 
                      profile.color === 'navy' ? 'hover:text-navy' : 
                      'hover:text-sage'
                    }`}
                  >
                    Browse {profile.title}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
