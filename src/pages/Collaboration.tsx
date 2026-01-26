import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResearchQuestions } from "@/components/collaboration/ResearchQuestions";
import { Forums } from "@/components/collaboration/Forums";
import { PartnerMatching } from "@/components/collaboration/PartnerMatching";
import { GlobalNetwork } from "@/components/collaboration/GlobalNetwork";
import { MyCollaborations } from "@/components/collaboration/MyCollaborations";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Search, Sparkles, Globe2, Users2 } from "lucide-react";

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState("research");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-sage/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-sage/10 text-sage text-sm font-medium mb-4">
                Research Collaboration Portal
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Find Your Perfect
                <span className="block text-sage">Research Partner</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with like-minded researchers, students, and agencies who share your passion
                for improving child welfare outcomes through meaningful partnerships.
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
                  value="research"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Research Questions
                </TabsTrigger>
                <TabsTrigger
                  value="matching"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Smart Matching
                </TabsTrigger>
                <TabsTrigger
                  value="forums"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forums
                </TabsTrigger>
                <TabsTrigger
                  value="network"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <Globe2 className="w-4 h-4 mr-2" />
                  Global Network
                </TabsTrigger>
                {user && (
                  <TabsTrigger
                    value="my-collaborations"
                    className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                  >
                    <Users2 className="w-4 h-4 mr-2" />
                    My Collaborations
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="research" className="mt-0">
                <ResearchQuestions />
              </TabsContent>

              <TabsContent value="matching" className="mt-0">
                <PartnerMatching />
              </TabsContent>

              <TabsContent value="forums" className="mt-0">
                <Forums />
              </TabsContent>

              <TabsContent value="network" className="mt-0">
                <GlobalNetwork />
              </TabsContent>

              {user && (
                <TabsContent value="my-collaborations" className="mt-0">
                  <MyCollaborations />
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

export default Collaboration;
