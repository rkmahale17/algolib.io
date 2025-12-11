import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import AlgorithmDetail from '@/pages/AlgorithmDetail';
import Blind75 from "./pages/Blind75";
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
import AdminAlgorithms from "./pages/AdminAlgorithms";
import AdminAlgorithmDetail from "./pages/AdminAlgorithmDetail";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { FeatureProtectedRoute } from "./components/FeatureProtectedRoute";
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

import { FeatureFlagProvider, useFeatureFlag } from "@/contexts/FeatureFlagContext"; // Added useFeatureFlag
import MaintenancePage from "./pages/MaintenancePage"; // Added MaintenancePage

const AppContent = () => {
  const isMaintenanceMode = useFeatureFlag('maintenance_mode');
  const location = useLocation();

  const isMaintenanceActive = isMaintenanceMode && !location.pathname.startsWith('/admin');

  return (
        <>
          {isMaintenanceActive ? (
            <>
              <Navbar />
              <MaintenancePage />
            </>
          ) : (
            <>
              <ConditionalNavbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/algorithm/:id" element={<AlgorithmDetail />} />

                <Route path="/blind75" element={
                  <FeatureProtectedRoute flag="blind_75">
                    <ProtectedRoute><Blind75 /></ProtectedRoute>
                  </FeatureProtectedRoute>
                } />
                <Route path="/blind75/:slug" element={
                  <FeatureProtectedRoute flag="blind_75">
                    <ProtectedRoute><AlgorithmDetail /></ProtectedRoute>
                  </FeatureProtectedRoute>
                } />
              <Route path="/auth" element={<Auth />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/content-rights" element={<ContentRights />} />
              <Route path="/complexity" element={<TimeComplexity />} />
              <Route path="/games" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><Games /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/sort-hero" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><SortHero /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/graph-explorer" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><GraphExplorer /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/stack-master" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><StackMaster /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/dp-puzzle" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><DPPuzzle /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/sliding-window" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><SlidingWindow /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/two-pointer" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><TwoPointer /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/games/leaderboard" element={
                <FeatureProtectedRoute flag="algo_games">
                  <ProtectedRoute><Leaderboard /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/blog" element={<Blog />} />

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

                <Route path="/profile" element={
                  <FeatureProtectedRoute flag="profiles">
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  </FeatureProtectedRoute>
                } />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          )}
        </>
  );
};

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
             <AppContent />
          </BrowserRouter>
      </TooltipProvider>
    </FeatureFlagProvider>
  </AppProvider>
</QueryClientProvider>
);
};

export default App;
