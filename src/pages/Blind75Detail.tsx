import {
  ArrowLeft,
  Book,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  ExternalLink,
  Eye,
  Lightbulb,
  Youtube,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { algorithms } from "@/data/algorithms";
import { blind75Implementations } from "@/data/blind75Implementations";
import { blind75Problems } from "@/data/blind75";
import { getAlgorithmImplementation } from "@/data/algorithmImplementations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Blind75Detail: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const problem = blind75Problems.find((p) => p.slug === slug);
  const implementation = slug ? blind75Implementations[slug] : null;
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "python" | "java" | "cpp" | "typescript"
  >("python");

  // Check authentication and load progress
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user && slug) {
        await fetchProgress(session.user.id);
      } else {
        setIsLoadingProgress(false);
      }
      setIsCheckingAuth(true);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && slug) {
        fetchProgress(session.user.id);
      } else {
        setIsCompleted(false);
        setIsLoadingProgress(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, slug]);

  // Fetch user's progress for this problem
  const fetchProgress = async (userId: string) => {
    if (!slug) return;

    setIsLoadingProgress(true);
    const { data, error } = await supabase
      .from("user_progress")
      .select("completed")
      .eq("user_id", userId)
      .eq("algorithm_id", `blind75-${slug}`)
      .maybeSingle();

    if (!error && data) {
      setIsCompleted(data.completed);
    } else {
      setIsCompleted(false);
    }
    setIsLoadingProgress(false);
  };

  // Toggle completion status
  const toggleCompletion = async () => {
    if (!user || !slug) {
      toast.error("Please sign in to track your progress");
      navigate("/auth");
      return;
    }

    const newCompletedState = !isCompleted;

    // Optimistic update
    setIsCompleted(newCompletedState);

    // Check if record exists
    const { data: existing } = await supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("algorithm_id", `blind75-${slug}`)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from("user_progress")
        .update({
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        })
        .eq("user_id", user.id)
        .eq("algorithm_id", `blind75-${slug}`);

      if (error) {
        // Revert on error
        setIsCompleted(!newCompletedState);
        toast.error("Failed to update progress");
        console.error(error);
      } else {
        toast.success(
          newCompletedState ? "Marked as completed! 🎉" : "Marked as incomplete"
        );
      }
    } else {
      // Insert new record
      const { error } = await supabase.from("user_progress").insert({
        user_id: user.id,
        algorithm_id: `blind75-${slug}`,
        completed: newCompletedState,
        completed_at: newCompletedState ? new Date().toISOString() : null,
      });

      if (error) {
        // Revert on error
        setIsCompleted(!newCompletedState);
        toast.error("Failed to save progress");
        console.error(error);
      } else {
        toast.success("Marked as completed! 🎉");
      }
    }
  };

  // Scroll to top on mount/route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);

          // Only apply on mobile (below md breakpoint - 768px)
          if (window.innerWidth < 768) {
            // Only change state if scroll difference is significant (more than 10px)
            if (scrollDifference > 100) {
              if (currentScrollY > lastScrollY && currentScrollY > 80) {
                // Scrolling down
                setShowBreadcrumb(false);
              } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setShowBreadcrumb(true);
              }
              lastScrollY = currentScrollY;
            }
          } else {
            setShowBreadcrumb(true);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // If problem not found
  if (!problem) {
    return (
      <>
        <Helmet>
          <title>Problem Not Found - Blind 75 | AlgoLib.io</title>
        </Helmet>

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Problem not found</h2>
            <p className="text-sm text-muted-foreground">
              The problem <code>{slug}</code> could not be found.
            </p>
            <Link to="/blind75">
              <Button>Go to Blind 75</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    hard: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const renderVisualization = () => {
    if (!problem.algorithmId) return null;

    const algoId = problem.algorithmId;

    // Map algorithm IDs to visualization components
    if (algoId === "two-sum") {
      const TwoSumVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/TwoSumVisualization"
        ).then((m) => ({ default: m.TwoSumVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <TwoSumVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "two-pointers") {
      const TwoPointersVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/TwoPointersVisualization"
        ).then((m) => ({ default: m.TwoPointersVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <TwoPointersVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "sliding-window") {
      const SlidingWindowVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/SlidingWindowVisualization"
        ).then((m) => ({ default: m.SlidingWindowVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <SlidingWindowVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "product-of-array-except-self") {
      const ProductOfArrayExceptSelfVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ProductOfArrayExceptSelfVisualization"
        ).then((m) => ({ default: m.ProductOfArrayExceptSelfVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ProductOfArrayExceptSelfVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "prefix-sum") {
      const PrefixSumVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/PrefixSumVisualization"
        ).then((m) => ({ default: m.PrefixSumVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <PrefixSumVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "binary-search") {
      const BinarySearchVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/BinarySearchVisualization"
        ).then((m) => ({ default: m.BinarySearchVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <BinarySearchVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "maximum-subarray") {
      const MaximumSubarrayVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MaximumSubarrayVisualization"
        ).then((m) => ({ default: m.MaximumSubarrayVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MaximumSubarrayVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "kadanes-algorithm") {
      const KadanesVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/KadanesVisualization"
        ).then((m) => ({ default: m.KadanesVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <KadanesVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "3sum") {
      const ThreeSumVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ThreeSumVisualization"
        ).then((m) => ({ default: m.ThreeSumVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ThreeSumVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "find-minimum-in-rotated-sorted-array") {
      const FindMinimumInRotatedSortedArrayVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/FindMinimumInRotatedSortedArrayVisualization"
        ).then((m) => ({ default: m.FindMinimumInRotatedSortedArrayVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <FindMinimumInRotatedSortedArrayVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "search-in-rotated-sorted-array") {
      const SearchInRotatedSortedArrayVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/SearchInRotatedSortedArrayVisualization"
        ).then((m) => ({ default: m.SearchInRotatedSortedArrayVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <SearchInRotatedSortedArrayVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "container-with-most-water") {
      const ContainerWithMostWaterVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ContainerWithMostWaterVisualization"
        ).then((m) => ({ default: m.ContainerWithMostWaterVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ContainerWithMostWaterVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "best-time-to-buy-and-sell-stock") {
      const BestTimeToBuyAndSellStockVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/BestTimeToBuyAndSellStockVisualization"
        ).then((m) => ({ default: m.BestTimeToBuyAndSellStockVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <BestTimeToBuyAndSellStockVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "contains-duplicate") {
      const ContainsDuplicateVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ContainsDuplicateVisualization"
        ).then((m) => ({ default: m.ContainsDuplicateVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ContainsDuplicateVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "maximum-product-subarray") {
      const MaximumProductSubarrayVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MaximumProductSubarrayVisualization"
        ).then((m) => ({ default: m.MaximumProductSubarrayVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MaximumProductSubarrayVisualization />
        </React.Suspense>
      );
    }

    // Problems 11-20 visualizations
    if (algoId === "sum-of-two-integers") {
      const SumOfTwoIntegersVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/SumOfTwoIntegersVisualization").then((m) => ({ default: m.SumOfTwoIntegersVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><SumOfTwoIntegersVisualization /></React.Suspense>;
    }

    if (algoId === "number-of-1-bits") {
      const NumberOf1BitsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/NumberOf1BitsVisualization").then((m) => ({ default: m.NumberOf1BitsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><NumberOf1BitsVisualization /></React.Suspense>;
    }

    if (algoId === "counting-bits") {
      const CountingBitsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/CountingBitsVisualization").then((m) => ({ default: m.CountingBitsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><CountingBitsVisualization /></React.Suspense>;
    }

    if (algoId === "missing-number") {
      const MissingNumberVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/MissingNumberVisualization").then((m) => ({ default: m.MissingNumberVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><MissingNumberVisualization /></React.Suspense>;
    }

    if (algoId === "reverse-bits") {
      const ReverseBitsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/ReverseBitsVisualization").then((m) => ({ default: m.ReverseBitsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><ReverseBitsVisualization /></React.Suspense>;
    }

    if (algoId === "climbing-stairs") {
      const ClimbingStairsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/ClimbingStairsVisualization").then((m) => ({ default: m.ClimbingStairsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><ClimbingStairsVisualization /></React.Suspense>;
    }

    if (algoId === "coin-change") {
      const CoinChangeVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/CoinChangeVisualization").then((m) => ({ default: m.CoinChangeVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><CoinChangeVisualization /></React.Suspense>;
    }

    if (algoId === "longest-increasing-subsequence") {
      const LongestIncreasingSubsequenceVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/LongestIncreasingSubsequenceVisualization").then((m) => ({ default: m.LongestIncreasingSubsequenceVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><LongestIncreasingSubsequenceVisualization /></React.Suspense>;
    }

    if (algoId === "longest-common-subsequence") {
      const LongestCommonSubsequenceVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/LongestCommonSubsequenceVisualization").then((m) => ({ default: m.LongestCommonSubsequenceVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><LongestCommonSubsequenceVisualization /></React.Suspense>;
    }

    if (algoId === "word-break") {
      const WordBreakVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/WordBreakVisualization").then((m) => ({ default: m.WordBreakVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><WordBreakVisualization /></React.Suspense>;
    }

    // Problems 21-30
    if (algoId === "combination-sum") {
      const CombinationSumVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/CombinationSumVisualization").then((m) => ({ default: m.CombinationSumVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><CombinationSumVisualization /></React.Suspense>;
    }

    if (algoId === "house-robber") {
      const HouseRobberVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/HouseRobberVisualization").then((m) => ({ default: m.HouseRobberVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><HouseRobberVisualization /></React.Suspense>;
    }

    if (algoId === "house-robber-ii") {
      const HouseRobberIIVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/HouseRobberIIVisualization").then((m) => ({ default: m.HouseRobberIIVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><HouseRobberIIVisualization /></React.Suspense>;
    }

    if (algoId === "decode-ways") {
      const DecodeWaysVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/DecodeWaysVisualization").then((m) => ({ default: m.DecodeWaysVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><DecodeWaysVisualization /></React.Suspense>;
    }

    if (algoId === "unique-paths") {
      const UniquePathsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/UniquePathsVisualization").then((m) => ({ default: m.UniquePathsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><UniquePathsVisualization /></React.Suspense>;
    }

    if (algoId === "jump-game") {
      const JumpGameVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/JumpGameVisualization").then((m) => ({ default: m.JumpGameVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><JumpGameVisualization /></React.Suspense>;
    }

    if (algoId === "clone-graph") {
      const CloneGraphVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/CloneGraphVisualization").then((m) => ({ default: m.CloneGraphVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><CloneGraphVisualization /></React.Suspense>;
    }

    if (algoId === "course-schedule") {
      const CourseScheduleVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/CourseScheduleVisualization").then((m) => ({ default: m.CourseScheduleVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><CourseScheduleVisualization /></React.Suspense>;
    }

    if (algoId === "pacific-atlantic") {
      const PacificAtlanticVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/PacificAtlanticVisualization").then((m) => ({ default: m.PacificAtlanticVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><PacificAtlanticVisualization /></React.Suspense>;
    }

    if (algoId === "num-islands") {
      const NumberOfIslandsVisualization = React.lazy(() =>
        import("@/components/visualizations/algorithms/NumberOfIslandsVisualization").then((m) => ({ default: m.NumberOfIslandsVisualization }))
      );
      return <React.Suspense fallback={<div className="text-center py-12">Loading visualization...</div>}><NumberOfIslandsVisualization /></React.Suspense>;
    }

    if (algoId === "sum-of-two-integers") {
      const SumOfTwoIntegersVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/SumOfTwoIntegersVisualization"
        ).then((m) => ({ default: m.SumOfTwoIntegersVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <SumOfTwoIntegersVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "number-of-1-bits") {
      const NumberOf1BitsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/NumberOf1BitsVisualization"
        ).then((m) => ({ default: m.NumberOf1BitsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <NumberOf1BitsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "counting-bits") {
      const CountingBitsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/CountingBitsVisualization"
        ).then((m) => ({ default: m.CountingBitsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <CountingBitsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "missing-number") {
      const MissingNumberVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MissingNumberVisualization"
        ).then((m) => ({ default: m.MissingNumberVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MissingNumberVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "reverse-bits") {
      const ReverseBitsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ReverseBitsVisualization"
        ).then((m) => ({ default: m.ReverseBitsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ReverseBitsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "climbing-stairs") {
      const ClimbingStairsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ClimbingStairsVisualization"
        ).then((m) => ({ default: m.ClimbingStairsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ClimbingStairsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "coin-change") {
      const CoinChangeVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/CoinChangeVisualization"
        ).then((m) => ({ default: m.CoinChangeVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <CoinChangeVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "longest-increasing-subsequence") {
      const LongestIncreasingSubsequenceVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/LongestIncreasingSubsequenceVisualization"
        ).then((m) => ({ default: m.LongestIncreasingSubsequenceVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <LongestIncreasingSubsequenceVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "longest-common-subsequence") {
      const LongestCommonSubsequenceVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/LongestCommonSubsequenceVisualization"
        ).then((m) => ({ default: m.LongestCommonSubsequenceVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <LongestCommonSubsequenceVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "word-break") {
      const WordBreakVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/WordBreakVisualization"
        ).then((m) => ({ default: m.WordBreakVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <WordBreakVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "longest-consecutive-sequence") {
      const LongestConsecutiveSequenceVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/LongestConsecutiveSequenceVisualization"
        ).then((m) => ({ default: m.LongestConsecutiveSequenceVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <LongestConsecutiveSequenceVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "insert-interval") {
      const InsertIntervalVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/InsertIntervalVisualization"
        ).then((m) => ({ default: m.InsertIntervalVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <InsertIntervalVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "connected-components") {
      const ConnectedComponentsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ConnectedComponentsVisualization"
        ).then((m) => ({ default: m.ConnectedComponentsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ConnectedComponentsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "graph-valid-tree") {
      const GraphValidTreeVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/GraphValidTreeVisualization"
        ).then((m) => ({ default: m.GraphValidTreeVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <GraphValidTreeVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "alien-dictionary") {
      const AlienDictionaryVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/AlienDictionaryVisualization"
        ).then((m) => ({ default: m.AlienDictionaryVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <AlienDictionaryVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "merge-intervals") {
      const MergeIntervalsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MergeIntervalsVisualization"
        ).then((m) => ({ default: m.MergeIntervalsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MergeIntervalsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "non-overlapping-intervals") {
      const NonOverlappingIntervalsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/NonOverlappingIntervalsVisualization"
        ).then((m) => ({ default: m.NonOverlappingIntervalsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <NonOverlappingIntervalsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "meeting-rooms") {
      const MeetingRoomsVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MeetingRoomsVisualization"
        ).then((m) => ({ default: m.MeetingRoomsVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MeetingRoomsVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "meeting-rooms-ii") {
      const MeetingRoomsIIVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/MeetingRoomsIIVisualization"
        ).then((m) => ({ default: m.MeetingRoomsIIVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <MeetingRoomsIIVisualization />
        </React.Suspense>
      );
    }

    if (algoId === "reverse-linked-list") {
      const ReverseLinkedListVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/ReverseLinkedListVisualization"
        ).then((m) => ({ default: m.ReverseLinkedListVisualization }))
      );
      return (
        <React.Suspense
          fallback={
            <div className="text-center py-12">Loading visualization...</div>
          }
        >
          <ReverseLinkedListVisualization />
        </React.Suspense>
      );
    }

    // Add more visualization mappings as needed
    return null;
  };

  const languageMap = {
    python: "Python",
    java: "Java",
    cpp: "C++",
    typescript: "TypeScript",
  };

  return (
    <>
      <Helmet>
        <title>{problem.title} - Blind 75 | AlgoLib.io | LeetCode Solution</title>
        <meta 
          name="description" 
          content={`${problem.title} - Complete solution with visualizations in Python, Java, C++, TypeScript. Time: ${problem.timeComplexity}, Space: ${problem.spaceComplexity}. ${problem.description.substring(0, 160)}`}
        />
        <meta 
          name="keywords" 
          content={`${problem.title}, blind 75, leetcode, ${problem.category}, ${problem.difficulty}, ${problem.tags.join(', ')}, coding interview, algorithm, ${problem.companies.join(', ')}`}
        />
        <meta name="author" content="AlgoLib.io" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link
          rel="canonical"
          href={`https://algolib.io/blind75/${problem.slug}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="AlgoLib.io" />
        <meta property="og:title" content={`${problem.title} - Blind 75 LeetCode Solution`} />
        <meta property="og:description" content={`Learn ${problem.title} with interactive visualizations and multi-language code examples. Difficulty: ${problem.difficulty}. ${problem.category}.`} />
        <meta property="og:url" content={`https://algolib.io/blind75/${problem.slug}`} />
        <meta property="og:image" content="https://algolib.io/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:section" content={problem.category} />
        <meta property="article:tag" content="Blind 75" />
        {problem.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@algolib_io" />
        <meta name="twitter:creator" content="@algolib_io" />
        <meta name="twitter:title" content={`${problem.title} - Blind 75 Solution`} />
        <meta name="twitter:description" content={`${problem.difficulty} ${problem.category} problem. Time: ${problem.timeComplexity}, Space: ${problem.spaceComplexity}`} />
        <meta name="twitter:image" content="https://algolib.io/og-image.png" />

        {/* TechArticle Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": problem.title,
            "description": problem.description,
            "url": `https://algolib.io/blind75/${problem.slug}`,
            "image": {
              "@type": "ImageObject",
              "url": "https://algolib.io/og-image.png",
              "width": 1200,
              "height": 630
            },
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split('T')[0],
            "author": {
              "@type": "Organization",
              "name": "AlgoLib.io",
              "url": "https://algolib.io",
              "logo": {
                "@type": "ImageObject",
                "url": "https://algolib.io/android-chrome-512x512.png"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "AlgoLib.io",
              "url": "https://algolib.io",
              "logo": {
                "@type": "ImageObject",
                "url": "https://algolib.io/android-chrome-512x512.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://algolib.io/blind75/${problem.slug}`
            },
            "articleSection": problem.category,
            "articleBody": problem.description,
            "keywords": [problem.title, "Blind 75", problem.category, problem.difficulty, ...problem.tags].join(", "),
            "proficiencyLevel": problem.difficulty,
            "educationalLevel": problem.difficulty === 'easy' ? 'Beginner' : problem.difficulty === 'medium' ? 'Intermediate' : 'Advanced',
            "timeRequired": "PT10M",
            "about": {
              "@type": "Thing",
              "name": problem.category,
              "description": `${problem.category} algorithms and data structures`
            }
          })}
        </script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@id": "https://algolib.io",
                  "name": "Home"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@id": "https://algolib.io/blind75",
                  "name": "Blind 75"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@id": `https://algolib.io/blind75?category=${encodeURIComponent(problem.category)}`,
                  "name": problem.category
                }
              },
              {
                "@type": "ListItem",
                "position": 4,
                "item": {
                  "@id": `https://algolib.io/blind75/${problem.slug}`,
                  "name": problem.title
                }
              }
            ]
          })}
        </script>

        {/* HowTo Schema for Solution */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": `How to solve ${problem.title}`,
            "description": problem.description,
            "totalTime": "PT10M",
            "tool": ["Python", "Java", "C++", "TypeScript"],
            "step": [
              {
                "@type": "HowToStep",
                "name": "Understand the Problem",
                "text": problem.description
              },
              {
                "@type": "HowToStep",
                "name": "Analyze Time Complexity",
                "text": `Time Complexity: ${problem.timeComplexity}`
              },
              {
                "@type": "HowToStep",
                "name": "Analyze Space Complexity",
                "text": `Space Complexity: ${problem.spaceComplexity}`
              },
              {
                "@type": "HowToStep",
                "name": "Implement Solution",
                "text": "Choose your preferred programming language and implement the solution"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center flex-wrap gap-2">
              <Link to="/blind75">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div
                className={`transition-all duration-100 md:opacity-100 ${
                  showBreadcrumb
                    ? "opacity-100 max-h-12"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <Breadcrumbs
                  items={[
                    {
                      label: "Blind 75",
                      href: "/blind75",
                    },
                    {
                      label: problem.category,
                      href: `/blind75?category=${encodeURIComponent(
                        problem.category
                      )}`,
                    },
                    {
                      label: problem.title,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 overflow-x-hidden">
          {/* Single column layout for all screen sizes */}
          <div className="space-y-6 mx-auto">
            {/* Hero Section - Always visible */}
            <Card className="p-6 glass-card border-primary/20">
              <div className="space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        #{problem.id}
                      </Badge>
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {problem.title}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={difficultyColors[problem.difficulty]}
                      >
                        {problem.difficulty.charAt(0).toUpperCase() +
                          problem.difficulty.slice(1)}
                      </Badge>
                      <Badge variant="secondary">{problem.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() =>
                        window.open(problem.leetcodeSearch, "_blank")
                      }
                      className="font-semibold"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Solve on LeetCode
                    </Button>
                    <ShareButton
                      title={problem.title}
                      description={problem.description}
                    />
                  </div>
                </div>
              </div>
            </Card>


            {/* Problem Description - Always visible */}
            <Card className="p-4 sm:p-6 glass-card overflow-hidden">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Problem Description
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {problem.description}
                </p>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Time Complexity</p>
                    <Badge variant="outline" className="font-mono">
                      {problem.timeComplexity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Space Complexity</p>
                    <Badge variant="outline" className="font-mono">
                      {problem.spaceComplexity}
                    </Badge>
                  </div>
                </div>

                {/* Companies */}
                {problem.companies && problem.companies.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Asked By</p>
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((company) => (
                          <Badge key={company} variant="secondary">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Interactive Visualization - Always visible */}
            <Card className="p-4 sm:p-6 glass-card overflow-hidden">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Interactive Visualization
                </h2>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-2 sm:p-4 overflow-x-auto">
                  {problem.algorithmId ? (
                    <div className="min-w-[280px]">{renderVisualization()}</div>
                  ) : (
                    <div className="text-center space-y-4 py-12">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          Coming Soon
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Interactive visualization for this problem is being
                          developed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Code Implementation */}
            <Card className="p-4 sm:p-6 glass-card overflow-hidden mx-auto">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Implementation
                </h3>

                <Tabs
                  defaultValue={selectedLanguage}
                  onValueChange={(v) => setSelectedLanguage(v as any)}
                >
                  <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 gap-1">
                    <TabsTrigger value="python" className="text-xs sm:text-sm">
                      Python
                    </TabsTrigger>
                    <TabsTrigger
                      value="typescript"
                      className="text-xs sm:text-sm"
                    >
                      TypeScript
                    </TabsTrigger>
                    <TabsTrigger value="cpp" className="text-xs sm:text-sm">
                      C++
                    </TabsTrigger>
                    <TabsTrigger value="java" className="text-xs sm:text-sm">
                      Java
                    </TabsTrigger>
                  </TabsList>

                  {implementation ? (
                    <>
                      <TabsContent value="python" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.python} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">
                              {implementation.python}
                            </code>
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="typescript" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.typescript} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">
                              {implementation.typescript}
                            </code>
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="cpp" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.cpp} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.cpp}</code>
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="java" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.java} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.java}</code>
                          </pre>
                        </div>
                      </TabsContent>
                    </>
                  ) : (
                    <div className="text-center py-8 mt-4">
                      <p className="text-muted-foreground mb-4">
                        Full implementation coming soon!
                      </p>
                      <Button asChild variant="outline">
                        <a
                          href={problem.leetcodeSearch}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Solve on LeetCode
                        </a>
                      </Button>
                    </div>
                  )}
                </Tabs>
              </div>
            </Card>

            {/* Approach & Use Cases */}
            {(implementation?.explanation || problem.useCases) && (
              <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
                <Tabs
                  defaultValue={
                    implementation?.explanation ? "approach" : "usecases"
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 h-auto">
                    {implementation?.explanation && (
                      <TabsTrigger
                        value="approach"
                        className="text-xs sm:text-sm"
                      >
                        Approach
                      </TabsTrigger>
                    )}
                    {problem.useCases && problem.useCases.length > 0 && (
                      <TabsTrigger
                        value="usecases"
                        className="text-xs sm:text-sm"
                      >
                        Real-World Use Cases
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {implementation?.explanation && (
                    <TabsContent value="approach" className="mt-4">
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {implementation.explanation}
                      </p>
                    </TabsContent>
                  )}

                  {problem.useCases && problem.useCases.length > 0 && (
                    <TabsContent value="usecases" className="mt-4">
                      <ul className="space-y-3">
                        {problem.useCases.map((useCase, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">
                              {useCase}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  )}
                </Tabs>
              </Card>
            )}

            {/* 5. YouTube Video Player (if available) */}
            {problem.youtubeUrl && (
              <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
                <div className="space-y-6">
                  {/* Video Section */}
                  <div className="space-y-4">
                    {/* YouTube Player */}
                    <YouTubePlayer
                      youtubeUrl={problem.youtubeUrl}
                      algorithmName={problem.title}
                    />

                    {/* Credits */}
                  </div>

                  <Separator />

                  {/* Complexity Analysis */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Time & Space Complexity
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Time Complexity
                        </div>
                        <div className="text-lg font-mono font-semibold text-foreground">
                          {problem.timeComplexity}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Space Complexity
                        </div>
                        <div className="text-lg font-mono font-semibold text-foreground">
                          {problem.spaceComplexity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blind75Detail;
