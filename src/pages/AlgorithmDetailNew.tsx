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
  ExternalLink,
  Timer,
  Flag,
  Bug,
  Share2,
  Shuffle,
  Plus,
  Monitor,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Pause,
  RotateCcw,
  Play
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { ShareButton } from "@/components/ShareButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { blind75Problems } from "@/data/blind75";
import { renderBlind75Visualization } from "@/utils/blind75Visualizations";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";
import { updateProgress, updateCode, updateNotes, updateWhiteboard, updateSocial } from "@/utils/userAlgorithmDataHelpers";

const AlgorithmDetailNew: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState<any>(undefined);
  const [isLoadingAlgorithm, setIsLoadingAlgorithm] = useState(true);
  
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
  
  // New Features State
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [showInterviewSummary, setShowInterviewSummary] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [savedCode, setSavedCode] = useState<string>("");
  
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'typescript'
  );

  // Fetch Algorithm
  useEffect(() => {
    const fetchAlgorithm = async () => {
      if (!id) return;
      
      if (!supabase) {
        console.warn('Supabase not available, cannot fetch algorithm from database');
        setIsLoadingAlgorithm(false);
        return;
      }

      setIsLoadingAlgorithm(true);
      try {
        const { data, error } = await supabase
          .from('algorithms')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Transform Supabase data structure
        const transformedData = {
          ...data,
          ...(data.metadata || {}),
          metadata: data.metadata
        };
        
        setAlgorithm(transformedData);
        setLikes(transformedData.likes || 0);
      } catch (error) {
        console.error('Error fetching algorithm:', error);
        toast.error('Failed to load algorithm details');
      } finally {
        setIsLoadingAlgorithm(false);
      }
    };

    fetchAlgorithm();
  }, [id]);

  // Auth & Progress
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use the custom hook to fetch user algorithm data
  const { data: userAlgoData, loading: loadingUserData, refetch: refetchUserData } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: id || '',
    enabled: !!user && !!id,
  });

  // Update state when user data changes
  useEffect(() => {
    if (userAlgoData) {
      setIsCompleted(userAlgoData.completed || false);
      setIsFavorite(userAlgoData.is_favorite || false);
      // Get code for current language or default
      const codeForLanguage = userAlgoData.code?.[selectedLanguage] || userAlgoData.code?.default || '';
      if (codeForLanguage) setSavedCode(codeForLanguage);
    }
    setIsLoadingProgress(loadingUserData);
  }, [userAlgoData, loadingUserData, selectedLanguage]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleInterviewMode = () => {
    if (isInterviewMode) {
      // Stopping interview mode
      setIsInterviewMode(false);
      setIsTimerRunning(false);
      setInterviewTime(timerSeconds);
      setShowInterviewSummary(true);
    } else {
      // Starting interview mode
      setIsInterviewMode(true);
      setIsTimerRunning(true);
      setTimerSeconds(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const toggleCompletion = async () => {
    if (!user || !id) {
      toast.error("Please sign in to track progress");
      return;
    }

    try {
      const newStatus = !isCompleted;
      const success = await updateProgress(user.id, id, {
        completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      });

      if (!success) throw new Error('Failed to update');
      
      setIsCompleted(newStatus);
      toast.success(newStatus ? "Marked as completed!" : "Marked as incomplete");
      refetchUserData();
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error("Failed to update progress");
    }
  };

  const toggleFavorite = async () => {
    if (!user || !id) {
      toast.error("Please sign in to favorite");
      return;
    }

    try {
      const newStatus = !isFavorite;
      const success = await updateSocial(user.id, id, {
        is_favorite: newStatus,
      });

      if (!success) throw new Error('Failed to update');
      setIsFavorite(newStatus);
      toast.success(newStatus ? "Added to favorites" : "Removed from favorites");
      refetchUserData();
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleVote = (vote: 'like' | 'dislike') => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }
    // Optimistic update
    if (userVote === vote) {
      setUserVote(null);
      if (vote === 'like') setLikes(l => l - 1);
    } else {
      if (userVote === 'like') setLikes(l => l - 1);
      setUserVote(vote);
      if (vote === 'like') setLikes(l => l + 1);
    }
    // TODO: Implement actual DB update
  };

  const handleRandomProblem = async () => {
    const { data } = await supabase.from('algorithms').select('id');
    if (data && data.length > 0) {
      const random = data[Math.floor(Math.random() * data.length)];
      navigate(`/algorithm/${random.id}`);
    }
  };

  const handleNextProblem = async () => {
    if (!algorithm) return;

    // Try to find current problem in Blind 75 list
    const currentSlug = algorithm.slug || algorithm.id; // Fallback if slug is missing
    const currentIndex = blind75Problems.findIndex(p => p.slug === currentSlug || p.algorithmId === currentSlug);

    if (currentIndex !== -1 && currentIndex < blind75Problems.length - 1) {
      const nextProblem = blind75Problems[currentIndex + 1];
      
      // We need the UUID for the route, so we must query Supabase
      const { data } = await supabase
        .from('algorithms')
        .select('id')
        .eq('slug', nextProblem.slug)
        .maybeSingle();

      if (data) {
        navigate(`/algorithm/${data.id}`);
        return;
      }
    }

    // Fallback: Random or just stay (could also query next ID from DB if we had an order)
    toast.info("No next problem found in sequence. Trying random...");
    handleRandomProblem();
  };

  const handleCodeChange = async (newCode: string) => {
    setSavedCode(newCode);
  };

  // Periodic code save with multi-language support
  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (!user || !id || !savedCode) return;
      
      try {
        const success = await updateCode(user.id, id, {
          language: selectedLanguage,
          code: savedCode,
        });
          
        if (!success) throw new Error('Failed to save code');
      } catch (err) {
        console.error("Error saving code:", err);
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [savedCode, user, id, selectedLanguage]);

  const renderVisualization = () => {
    if (!algorithm) return null;

    // 1. Check DB Visualization URL
    const dbUrl = algorithm.metadata?.visualizationUrl || algorithm.visualizationUrl;
    if (dbUrl && dbUrl.startsWith('http')) {
      return (
        <iframe 
          src={dbUrl} 
          className="w-full h-full border-0" 
          title="Visualization"
        />
      );
    }

    // 2. Try Blind 75 Visualization Mapping
    // First, check if algorithm has a slug that matches Blind 75
    const blind75Match = blind75Problems.find(p => 
      p.slug === algorithm.slug || 
      p.algorithmId === algorithm.id ||
      p.algorithmId === algorithm.slug
    );
    
    const vizKey = blind75Match?.algorithmId || algorithm.id || algorithm.slug;
    
    // Try to render using Blind 75 visualization helper
    const blind75Viz = renderBlind75Visualization(vizKey);
    if (blind75Viz) {
      return blind75Viz;
    }

    // 3. Fallback: "Coming Soon" message
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

  if (isLoadingAlgorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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

  const renderLeftPanel = () => (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      {/* Left Header with Tools */}
      <div className="h-14 border-b flex items-center px-4 gap-4 shrink-0 justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* <Button variant="ghost" size="icon" onClick={() => navigate(-1)} title="Back">
            <ChevronLeft className="w-5 h-5" />
            {/* Back */}
          {/* </Button> */}
          
        

          
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
          <div className="h-4 w-px bg-border mx-2" />

            <TooltipProvider>
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/algorithms/new")} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">New Problem</TooltipContent>
            </Tooltip> */}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRandomProblem} className="h-8 w-8">
                  <Shuffle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Random Problem</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleNextProblem} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Next Problem</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleLeftPanel} title="Collapse Panel">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Left Content */}
      <Tabs defaultValue="description" className="flex-1 flex flex-col overflow-hidden w-full pt-0 mt-0">
        <div className="px-0  shrink-0">
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
                <div className="p-4 space-y-6 pb-20">
                  {/* Title & Progress */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{algorithm.name}</h1>
                      {algorithm.explanation.problemStatement && (
                        <div 
                          className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: algorithm.explanation.problemStatement }}
                        />
                      )}
                    </div>
                    <div className="shrink-0 flex flex-col gap-2">
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

                  {/* Examples Section */}
                  {algorithm.explanation.io && algorithm.explanation.io.length > 0 && (
                    <div className="space-y-4">
                      {algorithm.explanation.io.map((example: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 bg-muted/20">
                          <h4 className="font-semibold mb-3">Example {index + 1}:</h4>
                          <div className="space-y-2 font-mono text-sm">
                            {example.input && (
                              <div>
                                <span className="font-semibold">Input:</span>{' '}
                                <code className="bg-muted px-2 py-0.5 rounded">{example.input}</code>
                              </div>
                            )}
                            {example.output && (
                              <div>
                                <span className="font-semibold">Output:</span>{' '}
                                <code className="bg-muted px-2 py-0.5 rounded">{example.output}</code>
                              </div>
                            )}
                            {example.explanation && (
                              <div className="mt-2">
                                <span className="font-semibold">Explanation:</span>{' '}
                                <span className="text-muted-foreground whitespace-pre-line">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Constraints Section */}
                  {algorithm.explanation.constraints && algorithm.explanation.constraints.length > 0 && (
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <h4 className="font-semibold mb-3">Constraints:</h4>
                      <ul className="space-y-1.5 font-mono text-sm">
                        {algorithm.explanation.constraints.map((constraint: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-0.5">•</span>
                            <code className="flex-1">{constraint}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Note Section */}
                  {algorithm.explanation.note && (
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm text-muted-foreground italic">{algorithm.explanation.note}</p>
                    </div>
                  )}

                  {/* Algorithm Overview Card */}
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

                  {/* Steps, Use Cases & Tips Card */}
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
                            {algorithm.explanation.steps?.map((step: string, i: number) => (
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
                            {algorithm.explanation.tips?.map((tip: string, i: number) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  )}

                  {/* Video Tutorial Card */}
                  {algorithm.tutorials?.[0]?.url && (
                   <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
                                 <div className="space-y-6">
                                   <div className="space-y-4">
                                     <div className="flex items-center gap-2">
                                       <Youtube className="w-5 h-5 text-red-500" />
                                       <h3 className="font-semibold">Video Tutorial</h3>
                                     </div>
                 
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
                                   </div>
                                 </div>
                               </Card>
                  )}

                  {/* Practice Problems Card */}
                  {algorithm?.problems_to_solve?.external && algorithm.problems_to_solve.external.length > 0 ? (
                    <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                      <h3 className="font-semibold mb-4">Practice Problems</h3>
                      <div className="space-y-2">
                        {algorithm.problems_to_solve.external.map((problem: any, i: number) => (
                          <a
                            key={i}
                            href={problem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{problem.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 capitalize">{problem.type}</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        ))}

                      </div>
                    </Card>
                  ) : null}
                  
                  {/* Bottom Action Bar - Minimized */}
                  <div className="p-2 border-t bg-background/40 backdrop-blur-md sticky bottom-0 z-10 flex items-center justify-between rounded-lg h-10">
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={userVote === 'like' ? "default" : "ghost"} 
                              size="sm" 
                              onClick={() => handleVote('like')}
                              className="gap-2 h-8 px-2"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="text-xs">{likes}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Like</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={userVote === 'dislike' ? "secondary" : "ghost"} 
                              size="icon" 
                              onClick={() => handleVote('dislike')}
                              className="h-8 w-8"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Dislike</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={isFavorite ? "default" : "ghost"} 
                              size="icon" 
                              onClick={toggleFavorite}
                              className={`h-8 w-8 ${isFavorite ? "text-red-500 hover:text-red-600" : ""}`}
                            >
                              <Heart className={`h-3 w-3 ${isFavorite ? "fill-current" : ""}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Favorite</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
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
                      <Select value={selectedLanguage} onValueChange={(val) => {
                        setSelectedLanguage(val);
                        localStorage.setItem('preferredLanguage', val);
                      }}>
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

                    {algorithm?.implementations?.find((i: any) => i.lang.toLowerCase() === selectedLanguage.toLowerCase())?.code?.find((c: any) => c.codeType === 'optimize')?.code ? (
                      <div className="relative rounded-lg border bg-muted/30 overflow-hidden">
                        <div className="absolute right-4 top-4 z-10">
                          <CopyCodeButton code={algorithm.implementations.find((i: any) => i.lang.toLowerCase() === selectedLanguage.toLowerCase()).code.find((c: any) => c.codeType === 'optimize').code} />
                        </div>
                        <ScrollArea className="h-[500px] w-full">
                          <pre className="p-6 text-sm font-mono leading-relaxed">
                            <code>{algorithm.implementations.find((i: any) => i.lang.toLowerCase() === selectedLanguage.toLowerCase()).code.find((c: any) => c.codeType === 'optimize').code}</code>
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
      {/* Right Header with Tools */}
         <div className="h-14 border-b flex items-center px-4 gap-4 shrink-0 justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/feedback')}>
                  <Bug className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Report Bug</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={isTimerRunning ? "secondary" : "ghost"} 
                  size="sm" 
                  className="gap-2 font-mono h-8"
                >
                  <Timer className="h-4 w-4" />
                  {formatTime(timerSeconds)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
                    <Button variant="ghost" size="icon" onClick={() => setTimerSeconds(0)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                      {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isTimerRunning ? "Pause" : "Start"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isInterviewMode ? "default" : "ghost"} 
                  size="icon" 
                  onClick={toggleInterviewMode}
                  className="h-8 w-8"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Interview Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
              {id && algorithm && (
                <CodeRunner 
                  algorithmId={id}
                  algorithmData={algorithm}
                  onToggleFullscreen={() => setIsCodeRunnerMaximized(true)}
                  className="h-full border-0 rounded-none shadow-none"
                  initialCode={savedCode}
                  onCodeChange={handleCodeChange}
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
    <div className={`h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col bg-background items-center ${isInterviewMode ? 'border-4 border-green-500/30' : ''}`}>
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
            {id && algorithm && (
              <CodeRunner 
                algorithmId={id}
                algorithmData={algorithm}
                isMaximized={true}
                onToggleFullscreen={() => setIsCodeRunnerMaximized(false)}
                className="h-full border-0 rounded-none shadow-none"
                initialCode={savedCode}
                onCodeChange={handleCodeChange}
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
            {user && id && algorithm ? (
              <BrainstormSection algorithmId={id} algorithmTitle={algorithm.name} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Please sign in to use the brainstorm feature
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interview Summary Modal */}
      <Dialog open={showInterviewSummary} onOpenChange={setShowInterviewSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Interview Finished</DialogTitle>
            <DialogDescription>
              Great job! Here's a summary of your session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-medium">Time Spent</span>
              <span className="font-mono text-xl">{formatTime(interviewTime)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-medium">Status</span>
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInterviewSummary(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Layout */}
      <div className="w-full max-w-[1900px] flex-1 overflow-hidden relative flex flex-col">
        {isMobile ? (
          // Mobile Stacked Layout
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col min-h-full">
              {/* Left Panel Content */}
              <div className="flex-none">
                {algorithm && renderLeftPanel()}
              </div>
              
              {/* Right Panel Content */}
              <div className="flex-none h-[600px] border-t-4 border-muted">
                {algorithm && renderRightPanel()}
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
                    {algorithm && renderLeftPanel()}
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
                    {algorithm && renderRightPanel()}
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
