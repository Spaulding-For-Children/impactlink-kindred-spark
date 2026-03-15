import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { HelpCircle, MessageCircle, Mail, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
});

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { t } = useTranslation();
  const { getSetting } = useSiteSettings();
  const { toast } = useToast();
  const sectionContent = getSetting("contact_section", undefined, {});

  const [contactForm, setContactForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(contactForm);
    if (!result.success) {
      toast({ title: "Validation Error", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setContactLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-message", {
        body: result.data,
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
      setContactForm({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message || "Please try again later.", variant: "destructive" });
    } finally {
      setContactLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = newsletterSchema.safeParse({ email: newsletterEmail });
    if (!result.success) {
      toast({ title: "Invalid email", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setNewsletterLoading(true);
    try {
      const { error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: { email: result.data.email },
      });
      if (error) throw error;
      toast({ title: "Subscribed!", description: "You've been added to our newsletter." });
      setNewsletterEmail("");
    } catch (err: any) {
      toast({ title: "Subscription failed", description: err.message || "Please try again later.", variant: "destructive" });
    } finally {
      setNewsletterLoading(false);
    }
  };

  const faqs = [
    { question: t("contact.faq1q"), answer: t("contact.faq1a") },
    { question: t("contact.faq2q"), answer: t("contact.faq2a") },
    { question: t("contact.faq3q"), answer: t("contact.faq3a") },
    { question: t("contact.faq4q"), answer: t("contact.faq4a") },
  ];

  return (
    <section id="contact" className="py-24" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-navy/10 text-navy text-sm font-medium mb-4">{t("contact.badge")}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-6">{sectionContent.title || t("contact.title")}</h2>
          <p className="text-lg text-muted-foreground">{sectionContent.description || t("contact.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <div className="bg-card rounded-3xl border border-border shadow-soft p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">{t("contact.sendMessage")}</h3>
              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("contact.firstName")}</label>
                    <Input placeholder="John" value={contactForm.firstName} onChange={(e) => setContactForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t("contact.lastName")}</label>
                    <Input placeholder="Doe" value={contactForm.lastName} onChange={(e) => setContactForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("contact.email")}</label>
                  <Input type="email" placeholder="john@university.edu" value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("contact.subject")}</label>
                  <Input placeholder={t("contact.subjectPlaceholder")} value={contactForm.subject} onChange={(e) => setContactForm(f => ({ ...f, subject: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("contact.message")}</label>
                  <Textarea placeholder={t("contact.messagePlaceholder")} rows={5} value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} />
                </div>
                <Button variant="hero" size="lg" className="w-full" type="submit" disabled={contactLoading}>
                  {contactLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : t("contact.send")}
                </Button>
              </form>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <a href="/#contact" className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center"><HelpCircle className="h-5 w-5 text-sage" /></div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t("contact.helpCenter")}</p>
                  <p className="text-xs text-muted-foreground">{t("contact.browseFaqs")}</p>
                </div>
              </a>
              <a href="mailto:support@impactlink.org" className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center"><MessageCircle className="h-5 w-5 text-amber" /></div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t("contact.liveChat")}</p>
                  <p className="text-xs text-muted-foreground">{t("contact.chatSupport")}</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <h3 className="text-2xl font-display font-bold text-foreground mb-6">{t("contact.faqTitle")}</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={faq.question} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} className="rounded-2xl border border-border overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors text-left">
                    <span className="font-medium text-foreground">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === index ? 'auto' : 0 }} className="overflow-hidden">
                    <div className="p-5 pt-0 text-muted-foreground">{faq.answer}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-navy text-primary-foreground">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6" />
                <h4 className="font-display font-bold text-lg">{t("contact.stayUpdated")}</h4>
              </div>
              <p className="text-primary-foreground/80 text-sm mb-4">{t("contact.newsletter")}</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  placeholder="your@email.com"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <Button variant="hero" type="submit" disabled={newsletterLoading}>
                  {newsletterLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("contact.subscribe")}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
