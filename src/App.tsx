import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import AlgorithmDetail from "./pages/AlgorithmDetail";
import AlgorithmDetailNew from "./pages/AlgorithmDetailNew";
import Blind75 from "./pages/Blind75";
import Blind75Detail from "./pages/Blind75Detail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import TermsOfService from "./pages/TermsOfService";
import TimeComplexity from "./pages/TimeComplexity";
import ContentRights from "./pages/ContentRights";
import Games from "./pages/Games";
import SortHero from "./pages/SortHero";
import GraphExplorer from "./pages/GraphExplorer";
import StackMaster from "./pages/StackMaster";
import DPPuzzle from "./pages/DPPuzzle";
import SlidingWindow from "./pages/SlidingWindow";
import TwoPointer from "./pages/TwoPointer";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import BlogPost from "./pages/BlogPost";
import SeedDatabase from "./pages/SeedDatabase";
import AdminAlgorithms from "./pages/AdminAlgorithms";
import AdminAlgorithmDetail from "./pages/AdminAlgorithmDetail";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AppProvider } from "./contexts/AppContext";
import FeedbackAdmin from "./pages/FeedbackAdmin";
import Blog from "./pages/Blog";
import ComplexityCard from "./components/complexity/ComplexityCard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeatureFlags from "./pages/AdminFeatureFlags";

const queryClient = new QueryClient();

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  // Hide navbar on algorithm detail pages and blind75 detail pages
  const hideNavbar = location.pathname.startsWith('/algorithm/') || 
                     (location.pathname.startsWith('/blind75/') && location.pathname !== '/blind75');
  
  if (hideNavbar) return null;
  return <Navbar />;
};

import { appStatus } from "@/utils/appStatus";

import { FeatureFlagProvider } from "@/contexts/FeatureFlagContext";

const App = () => {
    // Set initialized flag after first mount (so subsequent internal navigations know app is loaded)
  React.useEffect(() => {
    // Small timeout to allow the initial route (like Home) to render with "isInitialized: false" first
    const timer = setTimeout(() => {
      appStatus.isInitialized = true;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <FeatureFlagProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter basename="/">
          <ConditionalNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithm/:id" element={<AlgorithmDetailNew />} />

            <Route path="/blind75" element={<ProtectedRoute><Blind75 /></ProtectedRoute>} />
            <Route path="/blind75/:slug" element={<ProtectedRoute><AlgorithmDetailNew /></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/content-rights" element={<ContentRights />} />
          <Route path="/complexity" element={<TimeComplexity />} />
          <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
          <Route path="/games/sort-hero" element={<ProtectedRoute><SortHero /></ProtectedRoute>} />
          <Route path="/games/graph-explorer" element={<ProtectedRoute><GraphExplorer /></ProtectedRoute>} />
          <Route path="/games/stack-master" element={<ProtectedRoute><StackMaster /></ProtectedRoute>} />
          <Route path="/games/dp-puzzle" element={<ProtectedRoute><DPPuzzle /></ProtectedRoute>} />
          <Route path="/games/sliding-window" element={<ProtectedRoute><SlidingWindow /></ProtectedRoute>} />
          <Route path="/games/two-pointer" element={<ProtectedRoute><TwoPointer /></ProtectedRoute>} />
          <Route path="/games/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/admin/seed" element={
            <ProtectedAdminRoute>
              <SeedDatabase />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/algorithms" element={
            <ProtectedAdminRoute>
              <AdminAlgorithms />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/algorithms/new" element={
            <ProtectedAdminRoute>
              <AdminAlgorithmDetail />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/algorithm/:id" element={
            <ProtectedAdminRoute>
              <AdminAlgorithmDetail />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/feedback" element={
            <ProtectedAdminRoute>
              <FeedbackAdmin />
            </ProtectedAdminRoute>
          } />
          

          <Route path="/admin/features" element={
            <ProtectedAdminRoute>
              <AdminFeatureFlags />
            </ProtectedAdminRoute>
          } />

          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />

            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FeatureFlagProvider>
  </AppProvider>
</QueryClientProvider>
);
};

export default App;
