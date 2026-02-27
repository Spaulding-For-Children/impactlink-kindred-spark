import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Sparkles, Users2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Collaboration = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();
  const { getSetting } = useSiteSettings();
  const sectionContent = getSetting("collaboration_section", undefined, {});

  const features = [
    { icon: MessageSquare, title: t("collaboration.postBrowse"), description: t("collaboration.postBrowseDesc") },
    { icon: Sparkles, title: t("collaboration.smartMatch"), description: t("collaboration.smartMatchDesc") },
    { icon: Users2, title: t("collaboration.forums"), description: t("collaboration.forumsDesc") },
    { icon: Globe2, title: t("collaboration.globalNetwork"), description: t("collaboration.globalNetworkDesc") },
  ];

  const forums = [
    "Trauma & Resilience",
    "Family Reunification",
    "Youth Justice",
    "International Child Protection",
    "Foster Care Systems",
    "Kinship Care",
  ];

  return (
    <section id="collaboration" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sage-light/50 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-sage/10 text-sage text-sm font-medium mb-4">{t("collaboration.badge")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              {sectionContent.title || t("collaboration.title")}
              <span className="block text-sage">{t("collaboration.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">{sectionContent.description || t("collaboration.description")}</p>
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div key={feature.title} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="default" size="lg" asChild>
              <a href="/collaboration">{t("collaboration.startCollaborating")}</a>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="bg-card rounded-3xl border border-border shadow-elevated p-8">
              <h3 className="text-xl font-display font-bold text-foreground mb-6">{t("collaboration.activeForums")}</h3>
              <div className="space-y-3">
                {forums.map((forum, index) => (
                  <motion.a key={forum} href="#" initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }} whileHover={{ x: 5 }} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-sage" />
                      <span className="font-medium text-foreground">{forum}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                      {Math.floor(Math.random() * 50 + 10)} {t("collaboration.active")}
                    </span>
                  </motion.a>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">{t("collaboration.joinResearchers")}</p>
                <Button variant="ghost" className="w-full">{t("collaboration.viewAllForums")}</Button>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-sage/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
