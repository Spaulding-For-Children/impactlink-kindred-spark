import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WorkshopsWebinars } from "@/components/resources/WorkshopsWebinars";
import { ToolkitsGuides } from "@/components/resources/ToolkitsGuides";
import { ReadingLists } from "@/components/resources/ReadingLists";
import { Video, FileText, BookOpen, Bookmark } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SavedResources } from "@/components/resources/SavedResources";

const Resources = () => {
  const [activeTab, setActiveTab] = useState("workshops");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-amber/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-sm font-medium mb-4">
                Resources & Learning
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Grow Your
                <span className="block text-amber">Research Impact</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Access workshops, toolkits, and curated readings to enhance your child welfare
                research skills and build meaningful partnerships.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0 mb-8">
                <TabsTrigger
                  value="workshops"
                  className="data-[state=active]:bg-amber data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Workshops & Webinars
                </TabsTrigger>
                <TabsTrigger
                  value="toolkits"
                  className="data-[state=active]:bg-amber data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Toolkits & Guides
                </TabsTrigger>
                <TabsTrigger
                  value="readings"
                  className="data-[state=active]:bg-amber data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Reading Lists
                </TabsTrigger>
                {user && (
                  <TabsTrigger
                    value="saved"
                    className="data-[state=active]:bg-amber data-[state=active]:text-white rounded-full px-6 py-2.5"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="workshops" className="mt-0">
                <WorkshopsWebinars />
              </TabsContent>

              <TabsContent value="toolkits" className="mt-0">
                <ToolkitsGuides />
              </TabsContent>

              <TabsContent value="readings" className="mt-0">
                <ReadingLists />
              </TabsContent>

              {user && (
                <TabsContent value="saved" className="mt-0">
                  <SavedResources />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
