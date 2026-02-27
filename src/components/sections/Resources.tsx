import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Video, BookOpen, FileText, GraduationCap, FlaskConical, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Resources = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const { getSetting } = useSiteSettings();
  const sectionContent = getSetting("resources_section", undefined, {});

  const resources = [
    { icon: Video, title: t("resources.workshops"), description: t("resources.workshopsDesc"), items: [t("resources.workshopsI1"), t("resources.workshopsI2"), t("resources.workshopsI3")] },
    { icon: BookOpen, title: t("resources.toolkits"), description: t("resources.toolkitsDesc"), items: [t("resources.toolkitsI1"), t("resources.toolkitsI2"), t("resources.toolkitsI3")] },
    { icon: FileText, title: t("resources.readingLists"), description: t("resources.readingListsDesc"), items: [t("resources.readingListsI1"), t("resources.readingListsI2"), t("resources.readingListsI3")] },
  ];

  const showcases = [
    { icon: GraduationCap, title: t("resources.studentProjects"), desc: t("resources.studentProjectsDesc") },
    { icon: FlaskConical, title: t("resources.facultyResearch"), desc: t("resources.facultyResearchDesc") },
    { icon: Building, title: t("resources.agencyReports"), desc: t("resources.agencyReportsDesc") },
    { icon: Globe, title: t("resources.globalShowcase"), desc: t("resources.globalShowcaseDesc") },
  ];

  return (
    <section id="resources" className="py-24" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">{t("resources.badge")}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">{sectionContent.title || t("resources.title")}</h2>
          <p className="text-lg text-muted-foreground">{sectionContent.description || t("resources.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => (
            <motion.div key={resource.title} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="group p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center mb-6 group-hover:bg-navy/20 transition-colors"><resource.icon className="h-7 w-7 text-navy" /></div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">{resource.title}</h3>
              <p className="text-muted-foreground mb-6">{resource.description}</p>
              <ul className="space-y-2">
                {resource.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber" />{item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="rounded-3xl bg-sage-light border border-sage/20 p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">{t("resources.showcaseTitle")}</h3>
            <p className="text-muted-foreground">{t("resources.showcaseDesc")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showcases.map((showcase, index) => (
              <motion.a key={showcase.title} href="#" initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }} whileHover={{ y: -5 }} className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 text-center">
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center mx-auto mb-4"><showcase.icon className="h-6 w-6 text-sage" /></div>
                <h4 className="font-semibold text-foreground mb-1">{showcase.title}</h4>
                <p className="text-xs text-muted-foreground">{showcase.desc}</p>
              </motion.a>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="default" size="lg" asChild><Link to="/resources">{t("resources.browseAll")}</Link></Button>
            <Button variant="outline" size="lg">{t("resources.submitResearch")}</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
