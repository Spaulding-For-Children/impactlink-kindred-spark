import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EventsList } from "@/components/events/EventsList";
import { EventCalendar } from "@/components/events/EventCalendar";
import { MyRegistrations } from "@/components/events/MyRegistrations";
import { CalendarDays, List, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Events = () => {
  const [activeTab, setActiveTab] = useState("list");
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
                Events & Workshops
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Learn, Connect,
                <span className="block text-sage">Grow Together</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join workshops, webinars, and conferences designed to enhance your skills
                and expand your professional network in child welfare research.
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
                  value="list"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <List className="w-4 h-4 mr-2" />
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendar View
                </TabsTrigger>
                {user && (
                  <TabsTrigger
                    value="my-events"
                    className="data-[state=active]:bg-sage data-[state=active]:text-white rounded-full px-6 py-2.5"
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    My Registrations
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="list" className="mt-0">
                <EventsList />
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <EventCalendar />
              </TabsContent>

              {user && (
                <TabsContent value="my-events" className="mt-0">
                  <MyRegistrations />
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

export default Events;
