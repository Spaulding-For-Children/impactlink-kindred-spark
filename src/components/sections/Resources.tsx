import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Video, BookOpen, FileText, GraduationCap, FlaskConical, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: Video,
    title: "Workshops & Webinars",
    description: "Live and recorded sessions on research design, data analysis, grant writing, and more.",
    items: ["Research Design & Ethics", "Data Analysis Techniques", "Grant Writing Strategies"],
  },
  {
    icon: BookOpen,
    title: "Toolkits & Guides",
    description: "Downloadable guides for building partnerships and implementing evidence-based practices.",
    items: ["Academic-Agency Partnerships", "Community-Based Research", "Evidence-Based Practices"],
  },
  {
    icon: FileText,
    title: "Reading Lists",
    description: "Curated essential readings from foundational texts to recent journal articles.",
    items: ["Foundational Texts", "Recent Journal Articles", "International Reports"],
  },
];

const showcases = [
  { icon: GraduationCap, title: "Student Projects", desc: "Capstone projects, theses, dissertations" },
  { icon: FlaskConical, title: "Faculty Research", desc: "Publications and ongoing studies" },
  { icon: Building, title: "Agency Reports", desc: "Impact assessments and evaluations" },
  { icon: Globe, title: "Global Showcase", desc: "International research innovations" },
];

export const Resources = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="resources" className="py-24" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">
            Resources & Learning
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Grow Your Expertise
          </h2>
          <p className="text-lg text-muted-foreground">
            Access professional development resources designed to strengthen your research skills 
            and expand your knowledge in child welfare.
          </p>
        </motion.div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center mb-6 group-hover:bg-navy/20 transition-colors">
                <resource.icon className="h-7 w-7 text-navy" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-3">
                {resource.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {resource.description}
              </p>
              <ul className="space-y-2">
                {resource.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Research Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-3xl bg-sage-light border border-sage/20 p-8 md:p-12"
        >
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Submit & Showcase Research
            </h3>
            <p className="text-muted-foreground">
              Share your work with the community. Highlight your projects, publications, 
              and reports to inspire collaboration and celebrate innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {showcases.map((showcase, index) => (
              <motion.a
                key={showcase.title}
                href="#"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
                  <showcase.icon className="h-6 w-6 text-sage" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{showcase.title}</h4>
                <p className="text-xs text-muted-foreground">{showcase.desc}</p>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="default" size="lg">
              Submit Your Research
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
