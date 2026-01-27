import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, FileText, Calendar, BookOpen, MessageSquare, HelpCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { AdminSubmissions } from "@/components/admin/AdminSubmissions";
import { AdminProfiles } from "@/components/admin/AdminProfiles";
import { AdminResources } from "@/components/admin/AdminResources";
import { AdminEvents } from "@/components/admin/AdminEvents";
import { AdminForumTopics } from "@/components/admin/AdminForumTopics";
import { AdminResearchQuestions } from "@/components/admin/AdminResearchQuestions";

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isCheckingAdmin } = useAdmin();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isCheckingAdmin && isAdmin === false) {
      navigate("/");
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  if (authLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage all platform content and users
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Admin Tabs */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="submissions" className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 h-auto p-2 bg-muted/50">
                <TabsTrigger value="submissions" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Submissions</span>
                </TabsTrigger>
                <TabsTrigger value="profiles" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Directory</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="forums" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Forums</span>
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center gap-2 data-[state=active]:bg-background">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Research Q's</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="submissions">
                <AdminSubmissions />
              </TabsContent>

              <TabsContent value="profiles">
                <AdminProfiles />
              </TabsContent>

              <TabsContent value="resources">
                <AdminResources />
              </TabsContent>

              <TabsContent value="events">
                <AdminEvents />
              </TabsContent>

              <TabsContent value="forums">
                <AdminForumTopics />
              </TabsContent>

              <TabsContent value="questions">
                <AdminResearchQuestions />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
