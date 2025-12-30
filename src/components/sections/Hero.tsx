import { motion } from "framer-motion";
import { ArrowRight, Search, Users, Database, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const actionCards = [
  {
    icon: Search,
    title: "Explore Research",
    description: "Browse active projects and studies",
    color: "from-navy to-navy-light",
  },
  {
    icon: Users,
    title: "Connect with Agencies",
    description: "Partner with global organizations",
    color: "from-sage to-sage/80",
  },
  {
    icon: Database,
    title: "Access Data & Tools",
    description: "Curated datasets and assessments",
    color: "from-amber to-amber-light",
  },
  {
    icon: Lightbulb,
    title: "Submit Your Idea",
    description: "Propose new research initiatives",
    color: "from-navy-light to-navy",
  },
];

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
        <img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-navy/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-light border border-sage/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="text-sm font-medium text-sage">Child Welfare Research Hub</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6"
          >
            Welcome to{" "}
            <span className="text-navy">Impact</span>
            <span className="text-amber">Link</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl font-display italic text-muted-foreground mb-6"
          >
            Where academic inquiry meets real-world child welfare impact
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Empowering students, researchers, and agencies to work together in advancing 
            child welfare practices and policies through meaningful partnerships, shared data, 
            and evidence-based solutions globally.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="lg" className="group">
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Explore Directory
            </Button>
          </motion.div>
        </div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {actionCards.map((card, index) => (
            <motion.a
              key={card.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
