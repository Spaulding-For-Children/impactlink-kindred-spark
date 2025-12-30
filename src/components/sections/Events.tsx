import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    title: "NASW Annual Conference",
    date: "March 15-18, 2025",
    location: "Washington, D.C.",
    type: "Conference",
    attendees: 5000,
  },
  {
    title: "ISPCAN International Congress",
    date: "April 20-23, 2025",
    location: "Virtual",
    type: "Conference",
    attendees: 3000,
  },
  {
    title: "Student-Researcher Mixer",
    date: "February 5, 2025",
    location: "Virtual",
    type: "Networking",
    attendees: 150,
  },
];

const fundingOpportunities = [
  { title: "NIH Child Welfare Research Grants", deadline: "Feb 28, 2025", amount: "Up to $500K" },
  { title: "NASW Foundation Scholarships", deadline: "Mar 15, 2025", amount: "Up to $10K" },
  { title: "NSF Social Science Program", deadline: "Apr 1, 2025", amount: "Up to $400K" },
  { title: "UNICEF Innovation Fund", deadline: "Rolling", amount: "Up to $100K" },
];

export const Events = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Events Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber/10 text-amber text-sm font-medium mb-4">
              Events Calendar
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground mb-8">
              Join conferences, networking events, and workshops to connect with the child welfare community.
            </p>

            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        event.type === 'Conference' ? 'bg-navy/10 text-navy' : 'bg-sage/10 text-sage'
                      }`}>
                        {event.type}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-amber" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees.toLocaleString()}+ expected
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="ghost" className="mt-6 group">
              View Full Calendar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Funding Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-sage/10 text-sage text-sm font-medium mb-4">
              Funding Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
              Grants & Fellowships
            </h2>
            <p className="text-muted-foreground mb-8">
              Discover funding opportunities for students, researchers, and agencies to support child welfare initiatives.
            </p>

            <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
              <div className="p-6 bg-sage/5 border-b border-border">
                <h3 className="font-semibold text-foreground">Active Opportunities</h3>
              </div>
              <div className="divide-y divide-border">
                {fundingOpportunities.map((funding, index) => (
                  <motion.a
                    key={funding.title}
                    href="#"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors group"
                  >
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-navy transition-colors">
                        {funding.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">Deadline: {funding.deadline}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sage">{funding.amount}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
              <div className="p-6 bg-muted/30">
                <Button variant="default" className="w-full">
                  Browse All Funding
                </Button>
              </div>
            </div>

            <div className="mt-6 p-6 rounded-2xl bg-amber/10 border border-amber/20">
              <h4 className="font-semibold text-foreground mb-2">📝 Grant Writing Resources</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Access proposal templates, budget guides, and sample successful applications.
              </p>
              <Button variant="ghost" size="sm" className="text-amber hover:text-amber/80">
                Access Resources
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
