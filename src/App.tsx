import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PremiumLoader } from "@/components/PremiumLoader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect } from "react";

// Eager load Home for best LCP
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

// Lazy load everything else to reduce initial bundle size
const Dashboard = lazy(() => import("./pages/Profile"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const ProblemDetail = lazy(() => import('@/pages/ProblemDetail'));
const Blind75 = lazy(() => import("./pages/Blind75"));
const CorePatterns = lazy(() => import("./pages/CorePatterns"));
const Problems = lazy(() => import("./pages/Problems"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Feedback = lazy(() => import("./pages/Feedback"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const TimeComplexity = lazy(() => import("./pages/TimeComplexity"));
const ContentRights = lazy(() => import("./pages/ContentRights"));
const Games = lazy(() => import("./pages/Games"));
const SortHero = lazy(() => import("./pages/SortHero"));
const GraphExplorer = lazy(() => import("./pages/GraphExplorer"));
const StackMaster = lazy(() => import("./pages/StackMaster"));
const DPPuzzle = lazy(() => import("./pages/DPPuzzle"));
const SlidingWindow = lazy(() => import("./pages/SlidingWindow"));
const TwoPointer = lazy(() => import("./pages/TwoPointer"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AdminAlgorithms = lazy(() => import("./pages/AdminAlgorithms"));
const AdminAlgorithmDetail = lazy(() => import("./pages/AdminAlgorithmDetail"));
const FeedbackAdmin = lazy(() => import("./pages/FeedbackAdmin"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminFeatureFlags = lazy(() => import("./pages/AdminFeatureFlags"));
const AdminSimulator = lazy(() => import("./pages/AdminSimulator"));
const CompilerDocs = lazy(() => import("./pages/CompilerDocs"));
const Pricing = lazy(() => import("./pages/Pricing"));
const AdminMail = lazy(() => import("./pages/AdminMail"));
const AdminTaggingUpdate = lazy(() => import("./pages/AdminTaggingUpdate"));

import AdminViewToggle from "./components/AdminViewToggle";

import { DodoPayments } from 'dodopayments-checkout';

import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { FeatureProtectedRoute } from "./components/FeatureProtectedRoute";
import { AppProvider, useApp } from "./contexts/AppContext";
import { MotivationCenter } from "./components/MotivationCenter";
import { FloatingFeedback } from "./components/FloatingFeedback";
// import ComplexityCard from "./components/complexity/ComplexityCard"; // Unused in routes currently, checking usage

import { useAppDispatch } from "./store/hooks";
import { fetchAllAlgorithms } from "./store/slices/algorithmsSlice";

const queryClient = new QueryClient();

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  // Hide navbar on algorithm detail pages and blind75 detail pages
  const hideNavbar = location.pathname.startsWith('/problem/') && location.pathname !== '/problem' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/dashboard';

  if (hideNavbar) return null;
  return <Navbar />;
};

import { appStatus } from "@/utils/appStatus";

import { FeatureFlagProvider, useFeatureFlag, useFeatureFlags } from "@/contexts/FeatureFlagContext"; // Added useFeatureFlags
import MaintenancePage from "./pages/MaintenancePage"; // Added MaintenancePage

const AppContent = () => {
  const { flags, isLoading: isLoadingFlags } = useFeatureFlags();
  const { refreshProfile, user } = useApp();
  const isMaintenanceMode = flags['maintenance_mode'] ?? false;
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Background pre-fetch algorithms (non-blocking)
  // We wait for flags to load first as requested
  useEffect(() => {
    if (isLoadingFlags) return;
    dispatch(fetchAllAlgorithms());
  }, [dispatch, isLoadingFlags]);

  // Initialize Dodo Payments
  useEffect(() => {
    DodoPayments.Initialize({
      mode: 'test',
      onEvent: (event: any) => {
        console.log('Dodo Event:', event);
        const eventType = event.eventType || event.event_type;
        if (eventType === 'checkout.closed' || eventType === 'payment.succeeded') {
          refreshProfile();
        }
      }
    });
  }, [user?.id, refreshProfile]);

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
          <Suspense fallback={<PremiumLoader text="Loading..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/problem/:id" element={<ProblemDetail />} />

              <Route path="/dsa/blind-75" element={
                <FeatureProtectedRoute flag="blind_75">
                  <Blind75 />
                </FeatureProtectedRoute>
              } />
              <Route path="/dsa/blind75" element={
                <FeatureProtectedRoute flag="blind_75">
                  <Blind75 />
                </FeatureProtectedRoute>
              } />
              <Route path="/problem/:slug" element={
                <FeatureProtectedRoute flag="blind_75">
                  <ProtectedRoute><ProblemDetail /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />
              <Route path="/dsa/core" element={
                <FeatureProtectedRoute flag="core_algo">
                  <CorePatterns />
                </FeatureProtectedRoute>
              } />
              <Route path="/dsa/problems" element={<Problems />} />
              <Route path="/dsa/all-problems" element={<Problems />} />
              <Route path="/dsa/query" element={<Problems />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/dsa/get-started" element={<GetStarted />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about" element={<About />} />

              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/content-rights" element={<ContentRights />} />
              <Route path="/complexity" element={<TimeComplexity />} />
              <Route path="/docs" element={<CompilerDocs />} />
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

              <Route path="/admin/problems" element={
                <ProtectedAdminRoute>
                  <AdminAlgorithms />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/problem/new" element={
                <ProtectedAdminRoute>
                  <AdminAlgorithmDetail />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/problem/:id" element={
                <ProtectedAdminRoute>
                  <AdminAlgorithmDetail />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedAdminRoute>
                  <FeedbackAdmin />
                </ProtectedAdminRoute>
              } />

              <Route path="/admin/simulator" element={
                <ProtectedAdminRoute>
                  <AdminSimulator />
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

              <Route path="/admin/mail" element={
                <ProtectedAdminRoute>
                  <AdminMail />
                </ProtectedAdminRoute>
              } />

              <Route path="/admin/tagging-update" element={
                <ProtectedAdminRoute>
                  <AdminTaggingUpdate />
                </ProtectedAdminRoute>
              } />

              <Route path="/dashboard" element={
                <FeatureProtectedRoute flag="profiles">
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                </FeatureProtectedRoute>
              } />

              {/* Public profile route - no auth required */}
              <Route path="/profile/:username" element={<PublicProfile />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {!location.pathname.startsWith('/admin') && (
              <>
                {!location.pathname.startsWith('/problem/') && location.pathname !== '/feedback' && (
                  <FloatingFeedback />
                )}
              </>
            )}
            <AdminViewToggle />
          </Suspense>
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
            <ErrorBoundary>
              <BrowserRouter
                basename="/"
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <SidebarProvider defaultOpen={false}>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <div className="flex-1 min-w-0">
                        <AppContent />
                      </div>
                    </div>
                  </ThemeProvider>
                </SidebarProvider>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </FeatureFlagProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
