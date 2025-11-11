import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AlgorithmDetail from "./pages/AlgorithmDetail";
import Blind75 from "./pages/Blind75";
import Blind75Detail from "./pages/Blind75Detail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import ContentRights from "./pages/ContentRights";
import SortHero from "./pages/SortHero";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithm/:id" element={<AlgorithmDetail />} />
          <Route path="/blind75" element={<ProtectedRoute><Blind75 /></ProtectedRoute>} />
          <Route path="/blind75/:slug" element={<ProtectedRoute><Blind75Detail /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/content-rights" element={<ContentRights />} />
          {/* BETA FEATURE - Not visible in production navigation */}
          <Route path="/sort-hero" element={<SortHero />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
