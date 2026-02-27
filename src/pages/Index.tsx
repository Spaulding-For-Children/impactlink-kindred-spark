import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Directory } from "@/components/sections/Directory";
import { Collaboration } from "@/components/sections/Collaboration";
import { DataTools } from "@/components/sections/DataTools";
import { Resources } from "@/components/sections/Resources";
import { Events } from "@/components/sections/Events";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useDirection } from "@/hooks/useDirection";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useMemo } from "react";

const sectionComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  directory: Directory,
  collaboration: Collaboration,
  datatools: DataTools,
  resources: Resources,
  events: Events,
  contact: Contact,
};

const Index = () => {
  useDirection();
  const { getSections, getSetting, isLoading } = useSiteSettings();

  const sectionsConfig = getSections();
  const heroContent = getSetting("hero", undefined, {});

  const visibleSections = useMemo(() => {
    const order = sectionsConfig.order || Object.keys(sectionComponents);
    const hidden = new Set(sectionsConfig.hidden || []);
    return order.filter((id: string) => !hidden.has(id));
  }, [sectionsConfig]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{heroContent?.title || "ImpactLink"} - {heroContent?.tagline || "Where Academic Inquiry Meets Real-World Child Welfare Impact"}</title>
        <meta 
          name="description" 
          content={heroContent?.description || "ImpactLink connects students, researchers, and agencies to advance child welfare practices through meaningful partnerships, shared data, and evidence-based solutions globally."} 
        />
        <meta name="keywords" content="child welfare, research collaboration, social work, MSW, PhD research, child protection, evidence-based practice" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {visibleSections.map((sectionId: string) => {
            const Component = sectionComponents[sectionId];
            return Component ? <Component key={sectionId} /> : null;
          })}
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Index;
