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

const Index = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>ImpactLink - Where Academic Inquiry Meets Real-World Child Welfare Impact</title>
        <meta 
          name="description" 
          content="ImpactLink connects students, researchers, and agencies to advance child welfare practices through meaningful partnerships, shared data, and evidence-based solutions globally." 
        />
        <meta name="keywords" content="child welfare, research collaboration, social work, MSW, PhD research, child protection, evidence-based practice" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Directory />
          <Collaboration />
          <DataTools />
          <Resources />
          <Events />
          <Contact />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
};

export default Index;
