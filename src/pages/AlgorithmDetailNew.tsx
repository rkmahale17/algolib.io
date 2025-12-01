import {
  ArrowLeft,
  Book,
  BookOpen,
  CheckCircle2,
  Code2,
  Eye,
  Lightbulb,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Youtube,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Clock,
  Database,
  ListChecks,
  Target,
  ExternalLink
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle, ImperativePanelHandle } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import AlgoMetaHead from "@/services/meta.injectot";
import { Badge } from "@/components/ui/badge";
import { BrainstormSection } from "@/components/brainstorm/BrainstormSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { Separator } from "@/components/ui/separator";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { algorithmsDB } from "@/data/algorithmsDB";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { ShareButton } from "@/components/ShareButton";

const AlgorithmDetailNew: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const algorithm = id ? algorithmsDB[id] : undefined;
  
  const [user, setUser] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Layout State
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isCodeRunnerMaximized, setIsCodeRunnerMaximized] = useState(false);
  const [isVisualizationMaximized, setIsVisualizationMaximized] = useState(false);
  const [isBrainstormMaximized, setIsBrainstormMaximized] = useState(false);
  
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'typescript'
  );

  const currentImplementation = algorithm?.implementations.find(
    (impl) => impl.lang.toLowerCase() === selectedLanguage.toLowerCase()
  );
  const currentCode = currentImplementation?.code.find(c => c.codeType === 'optimize')?.code || '';

  // Detect mobile and window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 480);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLeftPanel = () => {
    const newCollapsed = !isLeftCollapsed;
    setIsLeftCollapsed(newCollapsed);
    localStorage.setItem('leftPanelCollapsed', String(newCollapsed));
    if (newCollapsed) {
      leftPanelRef.current?.collapse();
    } else {
      leftPanelRef.current?.expand();
    }
  };

  const toggleRightPanel = () => {
    const newCollapsed = !isRightCollapsed;
    setIsRightCollapsed(newCollapsed);
    localStorage.setItem('rightPanelCollapsed', String(newCollapsed));
    if (newCollapsed) {
      rightPanelRef.current?.collapse();
    } else {
      rightPanelRef.current?.expand();
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    localStorage.setItem('preferredLanguage', value);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkProgress = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('algorithm_id', id)
          .maybeSingle();
          
        if (error) throw error;
        setIsCompleted(!!data);
      } catch (error) {
        console.error('Error checking progress:', error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    checkProgress();
  }, [user, id]);

  const toggleCompletion = async () => {
    if (!user) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      if (isCompleted) {
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('algorithm_id', id);

        if (error) throw error;
        setIsCompleted(false);
        toast.success("Progress removed");
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            algorithm_id: id,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
        setIsCompleted(true);
        toast.success("Algorithm marked as completed!");
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error("Failed to update progress");
    }
  };

  const renderVisualization = () => {
    const vizMap: Record<string, any> = {
      "two-pointers": () => import("@/components/visualizations/algorithms/TwoPointersVisualization").then(m => ({ default: m.TwoPointersVisualization })),
      "sliding-window": () => import("@/components/visualizations/algorithms/SlidingWindowVisualization").then(m => ({ default: m.SlidingWindowVisualization })),
      "prefix-sum": () => import("@/components/visualizations/algorithms/PrefixSumVisualization").then(m => ({ default: m.PrefixSumVisualization })),
      "binary-search": () => import("@/components/visualizations/algorithms/BinarySearchVisualization").then(m => ({ default: m.BinarySearchVisualization })),
      "kadanes-algorithm": () => import("@/components/visualizations/algorithms/KadanesVisualization").then(m => ({ default: m.KadanesVisualization })),
      "dutch-national-flag": () => import("@/components/visualizations/algorithms/DutchNationalFlagVisualization").then(m => ({ default: m.DutchNationalFlagVisualization })),
      "merge-intervals": () => import("@/components/visualizations/algorithms/MergeIntervalsVisualization").then(m => ({ default: m.MergeIntervalsVisualization })),
      "monotonic-stack": () => import("@/components/visualizations/algorithms/MonotonicStackVisualization").then(m => ({ default: m.MonotonicStackVisualization })),
      "quick-select": () => import("@/components/visualizations/algorithms/QuickSelectVisualization").then(m => ({ default: m.QuickSelectVisualization })),
      "container-with-most-water": () => import("@/components/visualizations/algorithms/ContainerWithMostWaterVisualization").then(m => ({ default: m.ContainerWithMostWaterVisualization })),
      "trapping-rain-water": () => import("@/components/visualizations/algorithms/TrappingRainWaterVisualization").then(m => ({ default: m.TrappingRainWaterVisualization })),
      "dfs-preorder": () => import("@/components/visualizations/algorithms/DFSPreorderVisualization").then(m => ({ default: m.DFSPreorderVisualization })),
      "rotate-array": () => import("@/components/visualizations/algorithms/RotateArrayVisualization").then(m => ({ default: m.RotateArrayVisualization })),
      "cyclic-sort": () => import("@/components/visualizations/algorithms/CyclicSortVisualization").then(m => ({ default: m.CyclicSortVisualization })),
      "merge-sorted-lists": () => import("@/components/visualizations/algorithms/MergeSortedListsVisualization").then(m => ({ default: m.MergeSortedListsVisualization })),
      "dfs-inorder": () => import("@/components/visualizations/algorithms/DFSInorderVisualization").then(m => ({ default: m.DFSInorderVisualization })),
      "dfs-postorder": () => import("@/components/visualizations/algorithms/DFSPostorderVisualization").then(m => ({ default: m.DFSPostorderVisualization })),
      "bfs-level-order": () => import("@/components/visualizations/algorithms/BFSLevelOrderVisualization").then(m => ({ default: m.BFSLevelOrderVisualization })),
      "bst-insert": () => import("@/components/visualizations/algorithms/BSTInsertVisualization").then(m => ({ default: m.BSTInsertVisualization })),
      "lca": () => import("@/components/visualizations/algorithms/LowestCommonAncestorVisualization").then(m => ({ default: m.LowestCommonAncestorVisualization })),
      "serialize-tree": () => import("@/components/visualizations/algorithms/SerializeTreeVisualization").then(m => ({ default: m.SerializeTreeVisualization })),
      "recover-bst": () => import("@/components/visualizations/algorithms/RecoverBSTVisualization").then(m => ({ default: m.RecoverBSTVisualization })),
      "fast-slow-pointers": () => import("@/components/visualizations/algorithms/FastSlowPointersVisualization").then(m => ({ default: m.FastSlowPointersVisualization })),
      "reverse-linked-list": () => import("@/components/visualizations/algorithms/ReverseLinkedListVisualization").then(m => ({ default: m.ReverseLinkedListVisualization })),
      "detect-cycle": () => import("@/components/visualizations/algorithms/DetectCycleVisualization").then(m => ({ default: m.DetectCycleVisualization })),
      "middle-node": () => import("@/components/visualizations/algorithms/MiddleNodeVisualization").then(m => ({ default: m.MiddleNodeVisualization })),
      "trie": () => import("@/components/visualizations/algorithms/TrieVisualization").then(m => ({ default: m.TrieVisualization })),
      "graph-dfs": () => import("@/components/visualizations/algorithms/GraphDFSVisualization").then(m => ({ default: m.GraphDFSVisualization })),
      "graph-bfs": () => import("@/components/visualizations/algorithms/GraphBFSVisualization").then(m => ({ default: m.GraphBFSVisualization })),
      "topological-sort": () => import("@/components/visualizations/algorithms/TopologicalSortVisualization").then(m => ({ default: m.TopologicalSortVisualization })),
      "union-find": () => import("@/components/visualizations/algorithms/UnionFindVisualization").then(m => ({ default: m.UnionFindVisualization })),
      "knapsack-01": () => import("@/components/visualizations/algorithms/KnapsackVisualization").then(m => ({ default: m.KnapsackVisualization })),
      "coin-change": () => import("@/components/visualizations/algorithms/CoinChangeVisualization").then(m => ({ default: m.CoinChangeVisualization })),
      "lcs": () => import("@/components/visualizations/algorithms/LCSVisualization").then(m => ({ default: m.LCSVisualization })),
      "lis": () => import("@/components/visualizations/algorithms/LISVisualization").then(m => ({ default: m.LISVisualization })),
      "edit-distance": () => import("@/components/visualizations/algorithms/EditDistanceVisualization").then(m => ({ default: m.EditDistanceVisualization })),
      "matrix-path-dp": () => import("@/components/visualizations/algorithms/MatrixPathVisualization").then(m => ({ default: m.MatrixPathVisualization })),
      "house-robber": () => import("@/components/visualizations/algorithms/HouseRobberVisualization").then(m => ({ default: m.HouseRobberVisualization })),
      "climbing-stairs": () => import("@/components/visualizations/algorithms/ClimbingStairsVisualization").then(m => ({ default: m.ClimbingStairsVisualization })),
      "kruskals": () => import("@/components/visualizations/algorithms/KruskalsVisualization").then(m => ({ default: m.KruskalsVisualization })),
      "prims": () => import("@/components/visualizations/algorithms/PrimsVisualization").then(m => ({ default: m.PrimsVisualization })),
      "dijkstras": () => import("@/components/visualizations/algorithms/DijkstrasVisualization").then(m => ({ default: m.DijkstrasVisualization })),
      "bellman-ford": () => import("@/components/visualizations/algorithms/BellmanFordVisualization").then(m => ({ default: m.BellmanFordVisualization })),
      "floyd-warshall": () => import("@/components/visualizations/algorithms/FloydWarshallVisualization").then(m => ({ default: m.FloydWarshallVisualization })),
      "a-star": () => import("@/components/visualizations/algorithms/AStarVisualization").then(m => ({ default: m.AStarVisualization })),
      "partition-equal-subset": () => import("@/components/visualizations/algorithms/PartitionEqualSubsetVisualization").then(m => ({ default: m.PartitionEqualSubsetVisualization })),
      "word-break": () => import("@/components/visualizations/algorithms/WordBreakVisualization").then(m => ({ default: m.WordBreakVisualization })),
      "subsets": () => import("@/components/visualizations/algorithms/SubsetsVisualization").then(m => ({ default: m.SubsetsVisualization })),
      "permutations": () => import("@/components/visualizations/algorithms/PermutationsVisualization").then(m => ({ default: m.PermutationsVisualization })),
      "combinations": () => import("@/components/visualizations/algorithms/CombinationsVisualization").then(m => ({ default: m.CombinationsVisualization })),
      "combination-sum": () => import("@/components/visualizations/algorithms/CombinationSumVisualization").then(m => ({ default: m.CombinationSumVisualization })),
      "word-search": () => import("@/components/visualizations/algorithms/WordSearchVisualization").then(m => ({ default: m.WordSearchVisualization })),
      "word-search-grid": () => import("@/components/visualizations/algorithms/WordSearchVisualization").then(m => ({ default: m.WordSearchVisualization })),
      "n-queens": () => import("@/components/visualizations/algorithms/NQueensVisualization").then(m => ({ default: m.NQueensVisualization })),
      "sudoku-solver": () => import("@/components/visualizations/algorithms/SudokuSolverVisualization").then(m => ({ default: m.SudokuSolverVisualization })),
      "segment-tree": () => import("@/components/visualizations/algorithms/SegmentTreeVisualization").then(m => ({ default: m.SegmentTreeVisualization })),
      "fenwick-tree": () => import("@/components/visualizations/algorithms/FenwickTreeVisualization").then(m => ({ default: m.FenwickTreeVisualization })),
      "kmp": () => import("@/components/visualizations/algorithms/KMPVisualization").then(m => ({ default: m.KMPVisualization })),
      "kmp-string-matching": () => import("@/components/visualizations/algorithms/KMPVisualization").then(m => ({ default: m.KMPVisualization })),
      "rabin-karp": () => import("@/components/visualizations/algorithms/RabinKarpVisualization").then(m => ({ default: m.RabinKarpVisualization })),
      "activity-selection": () => import("@/components/visualizations/algorithms/ActivitySelectionVisualization").then(m => ({ default: m.ActivitySelectionVisualization })),
      "xor-trick": () => import("@/components/visualizations/algorithms/XORTrickVisualization").then(m => ({ default: m.XORTrickVisualization })),
      "count-bits": () => import("@/components/visualizations/algorithms/CountBitsVisualization").then(m => ({ default: m.CountBitsVisualization })),
      "subset-generation-bits": () => import("@/components/visualizations/algorithms/SubsetBitsVisualization").then(m => ({ default: m.SubsetBitsVisualization })),
      "kth-largest": () => import("@/components/visualizations/algorithms/KthLargestVisualization").then(m => ({ default: m.KthLargestVisualization })),
      "kth-largest-element": () => import("@/components/visualizations/algorithms/KthLargestVisualization").then(m => ({ default: m.KthLargestVisualization })),
      "merge-k-lists": () => import("@/components/visualizations/algorithms/MergeKSortedListsVisualization").then(m => ({ default: m.MergeKSortedListsVisualization })),
      "merge-k-sorted-lists": () => import("@/components/visualizations/algorithms/MergeKSortedListsVisualization").then(m => ({ default: m.MergeKSortedListsVisualization })),
      "sliding-window-maximum": () => import("@/components/visualizations/algorithms/SlidingWindowMaxVisualization").then(m => ({ default: m.SlidingWindowMaxVisualization })),
      "gcd-euclidean": () => import("@/components/visualizations/algorithms/GCDVisualization").then(m => ({ default: m.GCDVisualization })),
      "gcd": () => import("@/components/visualizations/algorithms/GCDVisualization").then(m => ({ default: m.GCDVisualization })),
      "sieve-eratosthenes": () => import("@/components/visualizations/algorithms/SieveVisualization").then(m => ({ default: m.SieveVisualization })),
      "sieve-of-eratosthenes": () => import("@/components/visualizations/algorithms/SieveVisualization").then(m => ({ default: m.SieveVisualization })),
      "modular-exponentiation": () => import("@/components/visualizations/algorithms/ModularExpVisualization").then(m => ({ default: m.ModularExpVisualization })),
      "sparse-table": () => import("@/components/visualizations/algorithms/SparseTableVisualization").then(m => ({ default: m.SparseTableVisualization })),
      "gas-station": () => import("@/components/visualizations/algorithms/GasStationVisualization").then(m => ({ default: m.GasStationVisualization })),
      "manachers": () => import("@/components/visualizations/algorithms/ManachersVisualization").then(m => ({ default: m.ManachersVisualization })),
      "karatsuba": () => import("@/components/visualizations/algorithms/KaratsubaVisualization").then(m => ({ default: m.KaratsubaVisualization })),
      "tarjans": () => import("@/components/visualizations/algorithms/TarjansVisualization").then(m => ({ default: m.TarjansVisualization })),
      "binary-lifting": () => import("@/components/visualizations/algorithms/BinaryLiftingVisualization").then(m => ({ default: m.BinaryLiftingVisualization })),
      "lru-cache": () => import("@/components/visualizations/algorithms/LRUCacheVisualization").then(m => ({ default: m.LRUCacheVisualization })),
    };

    if (vizMap[algorithm.id]) {
      const VizComponent = React.lazy(vizMap[algorithm.id]);
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <VizComponent />
        </React.Suspense>
      );
    }

    return (
      <div className="text-center space-y-3 py-12">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">Visualization Coming Soon</p>
          <p className="text-sm text-muted-foreground mt-1">
            We're working on an interactive visualization for this algorithm
          </p>
        </div>
      </div>
    );
  };

  if (!algorithm) {
    return (
      <>
        <AlgoMetaHead id={id} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Algorithm not found</h2>
            <p className="text-sm text-muted-foreground">
              The algorithm <code>{id}</code> could not be found.
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const renderLeftPanel = () => (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      {/* Left Header */}
      <div className="h-14 border-b flex items-center px-4 gap-4 shrink-0 justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <Breadcrumbs
              items={[
                {
                  label: "Home",
                  href: "/",
                },
                {
                  label: algorithm.category,
                  href: `/?category=${encodeURIComponent(algorithm.category)}`,
                },
                {
                  label: algorithm.name,
                },
              ]}
            />
          </div>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleLeftPanel} title="Collapse Panel">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Left Content */}
      <Tabs defaultValue="description" className="flex-1 flex flex-col overflow-hidden w-full pt-0 mt-0">
        <div className="px-4  shrink-0">
            <TabsList className="w-full grid grid-cols-3 p-0 bg-transparent gap-0 border-b rounded-none">
              <TabsTrigger 
                value="description" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
              >
                <Book className="w-4 h-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="visualizations"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizations
              </TabsTrigger>
              <TabsTrigger 
                value="solutions"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Solutions
              </TabsTrigger>
            </TabsList>
        </div>

        <div className="flex-1 overflow-hidden relative">
            <TabsContent value="description" className="h-full m-0 data-[state=inactive]:hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  {/* Title & Progress */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{algorithm.name}</h1>
                      {algorithm.explanation.problemStatement && (
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {algorithm.explanation.problemStatement}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {isCompleted ? (
                        <Badge 
                          variant="outline" 
                          className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1.5 cursor-pointer hover:bg-green-500/20 transition-colors"
                          onClick={toggleCompletion}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Attempted
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2 border rounded-full px-3 py-1.5 hover:bg-muted/50 transition-colors cursor-pointer" onClick={toggleCompletion}>
                          <Checkbox checked={false} className="rounded-full" />
                          <span className="text-sm font-medium">Mark Complete</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Algorithm Overview Card (Reused from AlgorithmDetail) */}
                  <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Algorithm Overview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {algorithm.overview || algorithm.explanation.problemStatement}
                      </p>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Time Complexity</p>
                          <Badge variant="outline" className="font-mono">
                            {algorithm.timeComplexity}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Space Complexity</p>
                          <Badge variant="outline" className="font-mono">
                            {algorithm.spaceComplexity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Steps, Use Cases & Tips Card (Reused from AlgorithmDetail) */}
                  {algorithm && (
                    <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                      <Tabs defaultValue="steps">
                        <TabsList className="grid w-full grid-cols-3 h-auto">
                          <TabsTrigger value="steps" className="text-xs sm:text-sm">
                            Steps
                          </TabsTrigger>
                          <TabsTrigger value="usecase" className="text-xs sm:text-sm">
                            Use Cases
                          </TabsTrigger>
                          <TabsTrigger value="tips" className="text-xs sm:text-sm">
                            Pro Tips
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="steps" className="mt-4">
                          <ol className="space-y-2 list-decimal list-inside">
                            {algorithm.explanation.steps.map((step, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </TabsContent>

                        <TabsContent value="usecase" className="mt-4">
                          <p className="text-sm text-muted-foreground">{algorithm.explanation.useCase}</p>
                        </TabsContent>

                        <TabsContent value="tips" className="mt-4">
                          <ul className="space-y-2 list-disc list-inside">
                            {algorithm.explanation.tips.map((tip, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  )}

                  {/* Video Tutorial Card (Reused from AlgorithmDetail) */}
                  {algorithm.tutorials[0]?.url && (
                   <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
                                 <div className="space-y-6">
                                   {/* Video Section */}
                                   <div className="space-y-4">
                                     <div className="flex items-center gap-2">
                                       <Youtube className="w-5 h-5 text-red-500" />
                                       <h3 className="font-semibold">Video Tutorial</h3>
                                     </div>
                 
                                     {/* Responsive YouTube Player */}
                                     <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                                       <iframe
                                         className="absolute top-0 left-0 w-full h-full rounded-lg"
                                          src={`https://www.youtube.com/embed/${
                                            algorithm.tutorials[0].url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ||
                                            algorithm.tutorials[0].url
                                          }`}
                                         title={`${algorithm.name} Tutorial`}
                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                         allowFullScreen
                                       />
                                     </div>
                 
                                     {/* What the video teaches */}
                                     <div className="space-y-2">
                                       <h4 className="text-lg font-semibold">What This Video Teaches</h4>
                                       <p className="text-sm text-muted-foreground leading-relaxed">
                                         This tutorial provides a comprehensive walkthrough of the {algorithm.name} algorithm,
                                         demonstrating its practical application through step-by-step code implementation. The video
                                         breaks down complex concepts into digestible segments, making it easier to understand how the
                                         algorithm works under the hood and when to apply it in real-world scenarios.
                                       </p>
                                     </div>
                 
                                     {/* Credits */}
                                     <div className="pt-2 border-t border-border/50">
                                       <p className="text-xs text-muted-foreground">
                                         <strong>Credits:</strong> Video tutorial by NeetCode (used with permission). All written
                                         explanations, code examples, and additional insights provided by Algolib.io.
                                       </p>
                                     </div>
                                   </div>
                 
                                   <Separator />
                 
                                   {/* Code example explanation */}
                                   {algorithm && (
                                     <div className="space-y-3">
                                       <h3 className="text-xl font-semibold flex items-center gap-2">
                                         <Code2 className="w-5 h-5 text-primary" />
                                         Code Example & Logic
                                       </h3>
                                       <p className="text-sm text-muted-foreground leading-relaxed">
                                         {algorithm.overview ||
                                           `The implementation of ${algorithm.name} follows a systematic approach that ensures optimal performance. 
                                           Each step in the algorithm is carefully designed to handle specific cases while maintaining efficiency.`}
                                       </p>
                                       {algorithm.explanation.steps && algorithm.explanation.steps.length > 0 && (
                                         <div className="mt-4">
                                           <h4 className="font-medium mb-2">Key Steps:</h4>
                                           <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                                             {algorithm.explanation.steps.slice(0, 4).map((step, i) => (
                                               <li key={i}>{step}</li>
                                             ))}
                                           </ol>
                                         </div>
                                       )}
                                     </div>
                                   )}
                 
                                   <Separator />
                 
                                   {/* Complexity Analysis */}
                                   <div className="space-y-3">
                                     <h3 className="text-xl font-semibold flex items-center gap-2">
                                       <Clock className="w-5 h-5 text-primary" />
                                       Time & Space Complexity
                                     </h3>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                       <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                         <div className="text-xs font-medium text-muted-foreground mb-1">Time Complexity</div>
                                         <div className="text-lg font-mono font-semibold text-foreground">
                                           {algorithm.timeComplexity}
                                         </div>
                                       </div>
                                       <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                         <div className="text-xs font-medium text-muted-foreground mb-1">Space Complexity</div>
                                         <div className="text-lg font-mono font-semibold text-foreground">
                                           {algorithm.spaceComplexity}
                                         </div>
                                       </div>
                                     </div>
                                   </div>
                 
                                   {/* Additional Insights */}
                                   {algorithm.explanation.tips && algorithm.explanation.tips.length > 0 && (
                                     <>
                                       <Separator />
                                       <div className="space-y-3">
                                         <h3 className="text-xl font-semibold flex items-center gap-2">
                                           <Lightbulb className="w-5 h-5 text-primary" />
                                           Additional Insights & Improvements
                                         </h3>
                                         <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                                           {algorithm.explanation.tips.map((tip, i) => (
                                             <li key={i}>{tip}</li>
                                           ))}
                                         </ul>
                                       </div>
                                     </>
                                   )}
                                 </div>
                               </Card>
                  )}

                  {/* Practice Problems Card (Reused from AlgorithmDetail) */}
                  {algorithm.problemsToSolve.external && algorithm.problemsToSolve.external.length > 0 ? (
                    <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                      <h3 className="font-semibold mb-4">Practice Problems</h3>
                      <div className="space-y-2">
                        {algorithm.problemsToSolve.external.map((problem, i) => (
                          <a
                            key={i}
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{problem.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 capitalize">{problem.difficulty}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        ))}

                      </div>
                    </Card>
                  ) : null}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="visualizations" className="h-full m-0 flex flex-col data-[state=inactive]:hidden">
               <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-muted/10 m-4">
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-background/50 backdrop-blur-sm shrink-0">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      Visualization
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => setIsVisualizationMaximized(true)}
                      title="Maximize Visualization"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 overflow-auto p-6 no-scrollbar relative">
                    {renderVisualization()}
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="solutions" className="h-full m-0 data-[state=inactive]:hidden">
               <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="cpp">C++</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentCode ? (
                      <div className="relative rounded-lg border bg-muted/30 overflow-hidden">
                        <div className="absolute right-4 top-4 z-10">
                          <CopyCodeButton code={currentCode} />
                        </div>
                        <ScrollArea className="h-[500px] w-full">
                          <pre className="p-6 text-sm font-mono leading-relaxed">
                            <code>{currentCode}</code>
                          </pre>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No implementation available for {selectedLanguage}.
                      </div>
                    )}
                  </div>
               </ScrollArea>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  const renderRightPanel = () => (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      {/* Right Content - No Header, Tabs with Collapse Button */}
         <div className="h-14 border-b flex items-center px-4 gap-4 shrink-0 justify-between">
        <div className="flex items-center gap-4 overflow-hidden">
                              <ShareButton title={algorithm.name} description={algorithm.explanation.problemStatement} />
          
        </div>
         {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleRightPanel} 
                  title="Collapse Panel"
                  className="w-[40px] h-auto rounded-none border-l border-border/50 hover:bg-primary/10 hover:text-primary"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              )}
      </div>
      <div className="flex-1 overflow-hidden p-0">
         <Tabs defaultValue="code" className="h-full flex flex-col">
            <div className="flex items-stretch border-b bg-muted/10 shrink-0">
              <TabsList className="flex-1 flex p-0 bg-transparent gap-0 rounded-none">
                <TabsTrigger 
                  value="code" 
                  className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger 
                  value="brainstorm"
                  className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Brainstorm
                </TabsTrigger>
              </TabsList>
           
            </div>

            <TabsContent value="code" className="flex-1 m-0 overflow-hidden relative group flex flex-col data-[state=inactive]:hidden">
              {id && (
                <CodeRunner 
                  algorithmId={id} 
                  onToggleFullscreen={() => setIsCodeRunnerMaximized(true)}
                  className="h-full border-0 rounded-none shadow-none"
                />
              )}
            </TabsContent>

            <TabsContent value="brainstorm" className="flex-1 m-0 overflow-hidden relative group data-[state=inactive]:hidden">
              
              <ScrollArea className="h-full">
                <div className="p-6">
                  {user && id ? (
                    <BrainstormSection algorithmId={id} algorithmTitle={algorithm.name} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Please sign in to use the brainstorm feature
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col bg-background items-center">
      <AlgoMetaHead id={id} />

      {/* Full Screen Overlays */}
      {isCodeRunnerMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Code Runner
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCodeRunnerMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {id && (
              <CodeRunner 
                algorithmId={id} 
                isMaximized={true}
                onToggleFullscreen={() => setIsCodeRunnerMaximized(false)}
                className="h-full border-0 rounded-none shadow-none"
              />
            )}
          </div>
        </div>
      )}

      {isVisualizationMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Visualization
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsVisualizationMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-6 pb-20">
            {renderVisualization()}
          </div>
        </div>
      )}

      {isBrainstormMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Brainstorm
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsBrainstormMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {user && id ? (
              <BrainstormSection algorithmId={id} algorithmTitle={algorithm.name} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Please sign in to use the brainstorm feature
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="w-full max-w-[1900px] flex-1 overflow-hidden relative flex flex-col">
        {isMobile ? (
          // Mobile Stacked Layout
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col min-h-full">
              {/* Left Panel Content */}
              <div className="flex-none">
                {renderLeftPanel()}
              </div>
              
              {/* Right Panel Content */}
              <div className="flex-none h-[600px] border-t-4 border-muted">
                {renderRightPanel()}
              </div>
            </div>
            
            {/* Floating Code Button for Mobile */}
            <div className="fixed bottom-6 right-6 z-40">
              <Button 
                size="lg" 
                className="rounded-full shadow-lg h-14 w-14 p-0"
                onClick={() => {
                  // Scroll to code section
                  const codeSection = document.querySelector('[value="code"]');
                  codeSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Code2 className="w-6 h-6" />
              </Button>
            </div>
          </div>
        ) : (
          // Desktop/Tablet Split Layout
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
             <div className="h-full min-w-[900px]">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Left Panel */}
                  <ResizablePanel 
                    ref={leftPanelRef}
                    defaultSize={50} 
                    minSize={30} 
                    collapsible={true}
                    collapsedSize={0}
                    className={isLeftCollapsed ? "min-w-0" : ""}
                  >
                    {renderLeftPanel()}
                  </ResizablePanel>

                  {/* Collapsed Left Panel Toggle */}
                  {isLeftCollapsed && (
                    <div className="w-12 border-r flex flex-col items-center py-4 gap-4 bg-muted/10">
                       <Button variant="ghost" size="icon" onClick={toggleLeftPanel} title="Expand Panel">
                        <PanelLeftOpen className="w-4 h-4" />
                      </Button>
                      <div className="h-px w-6 bg-border" />
                      <div className="writing-mode-vertical text-xs font-medium tracking-wider text-muted-foreground whitespace-nowrap py-4">
                        ALGORITHM SOLUTION
                      </div>
                      <div className="h-px w-6 bg-border" />
                      <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Back">
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <ResizableHandle withHandle />

                  {/* Right Panel */}
                  <ResizablePanel 
                    ref={rightPanelRef}
                    defaultSize={50} 
                    minSize={30}
                    collapsible={true}
                    collapsedSize={0}
                    className={isRightCollapsed ? "min-w-0" : ""}
                  >
                    {renderRightPanel()}
                  </ResizablePanel>

                  {/* Collapsed Right Panel Toggle */}
                  {isRightCollapsed && (
                    <div className="w-12 border-l flex flex-col items-center py-4 gap-4 bg-muted/10">
                       <Button variant="ghost" size="icon" onClick={toggleRightPanel} title="Expand Panel">
                        <PanelRightOpen className="w-4 h-4" />
                      </Button>
                      <div className="h-px w-6 bg-border" />
                      <div className="writing-mode-vertical text-xs font-medium tracking-wider text-muted-foreground whitespace-nowrap py-4">
                        CODE AND NOTES
                      </div>
                    </div>
                  )}
                </ResizablePanelGroup>
             </div>
          </div>
        )}
      </div>
      
      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AlgorithmDetailNew;
