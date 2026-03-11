import { motion } from "framer-motion";
import { Linkedin, Twitter, Youtube, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "#", label: "Email" },
];

export const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { name: t("nav.home"), href: "/" },
      { name: t("nav.directory"), href: "/directory" },
      { name: t("nav.collaboration"), href: "/collaboration" },
      { name: t("nav.dataTools"), href: "/data-tools" },
    ],
    resources: [
      { name: t("resources.workshops"), href: "/resources" },
      { name: t("resources.toolkits"), href: "/resources" },
      { name: t("resources.readingLists"), href: "/resources" },
      { name: t("dataTools.irbEthics"), href: "/data-tools" },
    ],
    community: [
      { name: t("events.calendarBadge"), href: "/events" },
      { name: t("events.fundingBadge"), href: "/events" },
      { name: t("resources.showcaseTitle"), href: "/resources" },
      { name: t("collaboration.forums"), href: "/collaboration" },
    ],
    support: [
      { name: "User Guide", href: "/user-guide" },
      { name: t("contact.helpCenter"), href: "/#contact" },
      { name: t("contact.sendMessage"), href: "/#contact" },
      { name: t("contact.faqTitle"), href: "/#contact" },
      { name: t("footer.privacy"), href: "/#contact" },
    ],
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("/#")) {
      const sectionId = href.slice(2);
      if (window.location.pathname === "/") {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <motion.a href="/" onClick={(e) => handleLinkClick(e, "/")} className="flex items-center gap-3 mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="w-10 h-10 rounded-xl bg-amber flex items-center justify-center">
                <span className="text-foreground font-display font-bold text-xl">I</span>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-primary-foreground">Impact</span>
                <span className="font-display text-xl font-bold text-amber">Link</span>
              </div>
            </motion.a>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-xs">{t("footer.tagline")}</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} aria-label={social.label} className="w-10 h-10 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                  <social.icon className="h-5 w-5 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">{t("footer.platform")}</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">{t("footer.community")}</h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">{t("footer.support")}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}><a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{link.name}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{t("footer.terms")}</a>
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
