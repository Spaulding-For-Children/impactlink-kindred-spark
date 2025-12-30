import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, MessageCircle, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const faqs = [
  {
    question: "How do I join ImpactLink?",
    answer: "Create an account by clicking 'Get Started' and completing your profile. Once approved by our administrators, you'll have full access to all features including the directory, collaboration tools, and data repository."
  },
  {
    question: "How do I access research data?",
    answer: "Navigate to the Data & Tools section to browse available datasets. Some data requires registration and IRB approval. Each dataset includes information about access requirements and data sharing policies."
  },
  {
    question: "What are the IRB requirements?",
    answer: "IRB requirements vary by institution and research type. Visit our IRB & Ethics Guidance section for comprehensive guides on U.S. state processes, university submissions, and international ethics standards."
  },
  {
    question: "Can international researchers participate?",
    answer: "Yes! ImpactLink is a global platform welcoming researchers from around the world. Our directory includes agencies and researchers from multiple countries, and we provide resources for international collaboration."
  },
];

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="contact" className="py-24" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">
            Contact & Support
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            We're Here to Help
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions or need assistance? Our team is ready to support your research journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-3xl border border-border shadow-soft p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Send us a Message
              </h3>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input type="email" placeholder="john@university.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input placeholder="Partnership inquiry, Technical support, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell us how we can help..."
                    rows={5}
                  />
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Quick Contact */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <a 
                href="#"
                className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Help Center</p>
                  <p className="text-xs text-muted-foreground">Browse FAQs</p>
                </div>
              </a>
              <a 
                href="#"
                className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-amber" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Live Chat</p>
                  <p className="text-xs text-muted-foreground">Chat with support</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="font-medium text-foreground">{faq.question}</span>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === index ? 'auto' : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="mt-8 p-6 rounded-2xl bg-navy text-primary-foreground">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6" />
                <h4 className="font-display font-bold text-lg">Stay Updated</h4>
              </div>
              <p className="text-primary-foreground/80 text-sm mb-4">
                Subscribe to our newsletter for the latest research opportunities, events, and resources.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="your@email.com" 
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
                <Button variant="hero">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
