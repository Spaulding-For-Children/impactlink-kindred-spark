import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Database, FileText, Scale, Shield, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const dataSources = [
  { name: "AFCARS", org: "U.S. Federal Data" },
  { name: "NCANDS", org: "U.S. Federal Data" },
  { name: "UNICEF", org: "International" },
  { name: "WHO", org: "International" },
  { name: "Save the Children", org: "NGO" },
];

const tools = [
  { name: "SDQ", full: "Strengths and Difficulties Questionnaire" },
  { name: "CANS", full: "Child and Adolescent Needs and Strengths" },
  { name: "TSCC", full: "Trauma Symptom Checklist for Children" },
];

const ethicsItems = [
  { icon: Scale, title: "U.S. State IRB Processes", desc: "State-specific requirements" },
  { icon: BookOpen, title: "University IRB Guides", desc: "Templates and timelines" },
  { icon: Shield, title: "International Ethics", desc: "Country-specific guidelines" },
  { icon: FileText, title: "HIPAA & GDPR", desc: "Data privacy frameworks" },
];

export const DataTools = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="data-tools" className="py-24 bg-navy/5" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-sm font-medium mb-4">
            Data & Tools Repository
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Access the Data You Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Curated datasets, validated assessment tools, and comprehensive ethics guidance 
            to support your research journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-border p-8 shadow-soft"
          >
            <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center mb-6">
              <Database className="h-7 w-7 text-navy" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              Available Data Sources
            </h3>
            <p className="text-muted-foreground mb-6">
              Access curated datasets from federal agencies, international organizations, and nonprofits.
            </p>
            <div className="space-y-3 mb-6">
              {dataSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <span className="font-medium text-foreground">{source.name}</span>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded-full">
                    {source.org}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              Browse All Data
            </Button>
          </motion.div>

          {/* Assessment Tools */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-3xl border border-border p-8 shadow-soft"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mb-6">
              <FileText className="h-7 w-7 text-amber" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              Assessment Tools
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore validated tools used in child welfare assessments and research studies.
            </p>
            <div className="space-y-4 mb-6">
              {tools.map((tool) => (
                <div key={tool.name} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-amber">{tool.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.full}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              View All Tools
            </Button>
          </motion.div>

          {/* IRB & Ethics */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-3xl border border-border p-8 shadow-soft"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage/10 flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-sage" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              IRB & Ethics Guidance
            </h3>
            <p className="text-muted-foreground mb-6">
              Navigate ethical requirements with comprehensive guides for domestic and international research.
            </p>
            <div className="space-y-3 mb-6">
              {ethicsItems.map((item) => (
                <div key={item.title} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <item.icon className="h-5 w-5 text-sage flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              Ethics Resources
            </Button>
          </motion.div>
        </div>

        {/* Trends Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-navy to-navy-light text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-1">Trends & Insights</h3>
                <p className="text-primary-foreground/80">
                  Stay updated on policy changes, funding priorities, and practice innovations
                </p>
              </div>
            </div>
            <Button variant="heroOutline" size="lg">
              Explore Trends
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
