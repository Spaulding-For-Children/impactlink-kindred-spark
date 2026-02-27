import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Microscope, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Directory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  const profiles = [
    {
      icon: GraduationCap,
      title: t("directory.studentsTitle"),
      description: t("directory.studentsDesc"),
      features: [t("directory.studentsF1"), t("directory.studentsF2"), t("directory.studentsF3"), t("directory.studentsF4")],
      count: "500+",
      color: "amber",
      link: "/students",
    },
    {
      icon: Microscope,
      title: t("directory.researchersTitle"),
      description: t("directory.researchersDesc"),
      features: [t("directory.researchersF1"), t("directory.researchersF2"), t("directory.researchersF3"), t("directory.researchersF4")],
      count: "200+",
      color: "navy",
      link: "/researchers",
    },
    {
      icon: Building2,
      title: t("directory.agenciesTitle"),
      description: t("directory.agenciesDesc"),
      features: [t("directory.agenciesF1"), t("directory.agenciesF2"), t("directory.agenciesF3"), t("directory.agenciesF4")],
      count: "150+",
      color: "sage",
      link: "/agencies",
    },
  ];

  return (
    <section id="directory" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">{t("directory.badge")}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">{t("directory.title")}</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("directory.description")}</p>
          <Link to="/directory">
            <Button variant="hero" size="lg">{t("directory.browseComplete")}<ArrowRight className="h-4 w-4 ml-2" /></Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <motion.div key={profile.title} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15 }} className="group relative">
              <div className="h-full p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${profile.color === 'amber' ? 'bg-amber/10' : profile.color === 'navy' ? 'bg-navy/10' : 'bg-sage/10'}`}>
                    <profile.icon className={`h-7 w-7 ${profile.color === 'amber' ? 'text-amber' : profile.color === 'navy' ? 'text-navy' : 'text-sage'}`} />
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-display font-bold ${profile.color === 'amber' ? 'text-amber' : profile.color === 'navy' ? 'text-navy' : 'text-sage'}`}>{profile.count}</span>
                    <p className="text-xs text-muted-foreground">{t("directory.activeProfiles")}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{profile.title}</h3>
                <p className="text-muted-foreground mb-6">{profile.description}</p>
                <ul className="space-y-3 mb-8">
                  {profile.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${profile.color === 'amber' ? 'bg-amber' : profile.color === 'navy' ? 'bg-navy' : 'bg-sage'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={profile.link}>
                  <Button variant="ghost" className={`group/btn w-full justify-between ${profile.color === 'amber' ? 'hover:text-amber' : profile.color === 'navy' ? 'hover:text-navy' : 'hover:text-sage'}`}>
                    {t("directory.browse")} {profile.title}
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
