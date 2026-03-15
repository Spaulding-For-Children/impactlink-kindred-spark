import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TutorialProvider } from "@/contexts/TutorialContext";
import { TutorialOverlay } from "@/components/tutorial/TutorialOverlay";
import Index from "./pages/Index";
import Directory from "./pages/Directory";
import Students from "./pages/Students";
import Researchers from "./pages/Researchers";
import Agencies from "./pages/Agencies";
import StudentProfile from "./pages/StudentProfile";
import ResearcherProfile from "./pages/ResearcherProfile";
import AgencyProfile from "./pages/AgencyProfile";
import Auth from "./pages/Auth";
import CreateProfile from "./pages/CreateProfile";
import ProfileSettings from "./pages/ProfileSettings";
import ProfileDetail from "./pages/ProfileDetail";
import Collaboration from "./pages/Collaboration";
import Resources from "./pages/Resources";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import DataTools from "./pages/DataTools";

import UpdatePassword from "./pages/UpdatePassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TutorialProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/profile/:id" element={<ProfileDetail />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/data-tools" element={<DataTools />} />
              
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="/researchers" element={<Researchers />} />
              <Route path="/researchers/:id" element={<ResearcherProfile />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="/agencies/:id" element={<AgencyProfile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <TutorialOverlay />
          </TutorialProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
