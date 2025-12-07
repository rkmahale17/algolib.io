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
  Star,
  Pause,
  RotateCcw,
  Play,
  Heart
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
import logo from "@/assets/logo.svg";

import AlgoMetaHead from "@/services/meta.injectot";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, MessageSquare } from "lucide-react";
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
import { AuthGuard } from "@/components/AuthGuard";
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
import { renderVisualization as renderVizFromMapping, hasVisualization } from "@/utils/visualizationMapping";
import { SolutionViewer } from "@/components/SolutionViewer";
import { RichText } from "@/components/RichText";

const AlgorithmDetailNew: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const algorithmIdOrSlug = id || slug; // Support both /algorithm/:id and /blind75/:slug
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
  const [activeTab, setActiveTab] = useState("description");
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [showInterviewSummary, setShowInterviewSummary] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [savedCode, setSavedCode] = useState<string>("");
  
  const leftPanelRef = useRef<any>(null);
  const rightPanelRef = useRef<any>(null);

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'typescript'
  );

  // Local code cache per language to prevent race conditions
  const [codeCache, setCodeCache] = useState<Record<string, string>>({});
  
  // Track if user has modified code (to prevent saving on initial load)
  const [isUserModified, setIsUserModified] = useState(false);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  // Fetch Algorithm
  useEffect(() => {
    const fetchAlgorithm = async () => {
      if (!algorithmIdOrSlug) return;
      
      if (!supabase) {
        console.warn('Supabase not available, cannot fetch algorithm from database');
        setIsLoadingAlgorithm(false);
        return;
      }

      setIsLoadingAlgorithm(true);
      try {
        // Try to fetch by id first, then by slug
        let query = supabase
          .from('algorithms')
          .select('*');
        
        // If it looks like a slug (contains hyphens and no UUID pattern), search by slug
        const isSlug = algorithmIdOrSlug.includes('-') && !algorithmIdOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        
        if (isSlug) {
          query = query.eq('id', algorithmIdOrSlug);
        } else {
          query = query.eq('id', algorithmIdOrSlug);
        }
        
        const { data, error } = await query.single();
        
        if (error) throw error;
        
        // Transform Supabase data structure
        const transformedData = {
          ...data,
          ...(data.metadata || {}),
          metadata: data.metadata
        };
        
        setAlgorithm(transformedData);
        setLikes(transformedData.likes || 0);
        setDislikes(transformedData.dislikes || 0);
      } catch (error) {
        console.error('Error fetching algorithm:', error);
        toast.error('Failed to load algorithm details');
      } finally {
        setIsLoadingAlgorithm(false);
      }
    };

    fetchAlgorithm();
  }, [algorithmIdOrSlug]);

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
    return () => subscription.unsubscribe();
  }, []);

  const handleRichTextClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#visualization') {
        e.preventDefault();
        setActiveTab('visualizations');
        // Scroll to top of tab content if needed
        const tabsContent = document.querySelector('[role="tabpanel"][data-state="active"]');
        if (tabsContent) {
          tabsContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Use the custom hook to fetch user algorithm data
  const { data: userAlgoData, loading: loadingUserData, refetch: refetchUserData } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: algorithmIdOrSlug || '',
    enabled: !!user && !!algorithmIdOrSlug,
  });

  // Update state when user data changes (INITIAL LOAD ONLY)
  useEffect(() => {
    if (userAlgoData) {
      setIsCompleted(userAlgoData.completed || false);
      setIsFavorite(userAlgoData.is_favorite || false);
      setUserVote(userAlgoData.user_vote || null);
      
      // Load all code from DB into cache
      if (userAlgoData.code && typeof userAlgoData.code === 'object') {
        setCodeCache(userAlgoData.code as Record<string, string>);
        
        // Set current language code
        const codeForLanguage = userAlgoData.code[selectedLanguage] || '';
        setSavedCode(codeForLanguage);
      }
    }
    setIsLoadingProgress(loadingUserData);
  }, [userAlgoData, loadingUserData]); // Removed selectedLanguage from deps!

  // Handle language switching - load from cache, not DB
  useEffect(() => {
    const codeForLanguage = codeCache[selectedLanguage] || '';
    setSavedCode(codeForLanguage);
    setIsUserModified(false); // Reset flag when switching languages
  }, [selectedLanguage]);

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

  const handleVote = async (vote: 'like' | 'dislike') => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    const previousVote = userVote;
    const previousLikes = likes;
    const previousDislikes = dislikes;

    // Optimistic update
    if (userVote === vote) {
      // Toggle off
      setUserVote(null);
      if (vote === 'like') setLikes(l => Math.max(0, l - 1));
      else setDislikes(d => Math.max(0, d - 1));
    } else {
      // Change vote or new vote
      setUserVote(vote);
      if (vote === 'like') {
        setLikes(l => l + 1);
        if (previousVote === 'dislike') setDislikes(d => Math.max(0, d - 1));
      } else {
        setDislikes(d => d + 1);
        if (previousVote === 'like') setLikes(l => Math.max(0, l - 1));
      }
    }

    try {
      // DB Update Logic
      let likeIncrement = 0;
      let dislikeIncrement = 0;

      if (previousVote === vote) {
        // Removing vote
        if (vote === 'like') likeIncrement = -1;
        else dislikeIncrement = -1;
      } else {
        // Adding or changing vote
        if (vote === 'like') {
          likeIncrement = 1;
          if (previousVote === 'dislike') dislikeIncrement = -1;
        } else {
          dislikeIncrement = 1;
          if (previousVote === 'like') likeIncrement = -1;
        }
      }

      // Update algorithm counts in DB
      // Update algorithm counts in DB
      if (likeIncrement !== 0 || dislikeIncrement !== 0) {
        // Fallback: manual update of metadata since 'likes' column doesn't exist on 'algorithms' table
        const { data: current, error: fetchError } = await supabase
            .from('algorithms')
            .select('metadata')
            .eq('id', algorithm.id)
            .single();
        
        if (current && !fetchError) {
             const currentMeta = (current.metadata as any) || {};
             const newLikes = Math.max(0, (currentMeta.likes || 0) + likeIncrement);
             const newDislikes = Math.max(0, (currentMeta.dislikes || 0) + dislikeIncrement);
             
             await supabase.from('algorithms').update({
                 metadata: {
                     ...currentMeta,
                     likes: newLikes,
                     dislikes: newDislikes
                 }
             }).eq('id', algorithm.id);
        }
      }
      
      // Also persist the user's vote to their personal data so it sticks on reload
      const newVote = (previousVote === vote) ? null : vote; // If same vote, we toggled off (null), else we switched/added
      await updateSocial(user.id, algorithmIdOrSlug || '', {
         user_vote: newVote
      });

    } catch (error) {
      console.error("Error updating vote:", error);
      toast.error("Failed to update vote");
      // Revert optimistic update
      setUserVote(previousVote);
      setLikes(previousLikes);
      setDislikes(previousDislikes);
    }
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
    setIsUserModified(true); // Mark as modified by user
    // Update local cache immediately
    setCodeCache(prev => ({
      ...prev,
      [selectedLanguage]: newCode
    }));
  };

  // Periodic code save with multi-language support (6 second debounce)
  // ONLY saves if user has actually modified the code
  useEffect(() => {
    // Don't save if user hasn't modified code
    if (!isUserModified) return;
    
    const saveTimeout = setTimeout(async () => {
      if (!user || !id || !savedCode) return;
      
      try {
        const success = await updateCode(user.id, id, {
          language: selectedLanguage,
          code: savedCode,
        });
          
        if (!success) throw new Error('Failed to save code');
        
        // Reset modified flag after successful save
        setIsUserModified(false);
      } catch (err) {
        console.error("Error saving code:", err);
      }
    }, 6000); // 6 second debounce

    return () => clearTimeout(saveTimeout);
  }, [savedCode, user, id, selectedLanguage, isUserModified]);

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

    // 2. Try centralized visualization mapping (internal components)
    const algorithmKey = algorithm.id || algorithm.slug;
    if (hasVisualization(algorithmKey)) {
      return renderVizFromMapping(algorithmKey);
    }

    // 3. Try Blind 75 Visualization Mapping (legacy fallback)
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

    // 4. Fallback: "Coming Soon" message
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
     

      {/* Left Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full pt-0 mt-0">
        <div className="px-0 shrink-0 flex items-stretch border-b">
          {/* Collapse Button - Left Panel */}
         
          
          <TabsList className="flex-1 grid grid-cols-3 p-0 bg-transparent gap-0 rounded-none">
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
           {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLeftPanel} 
              title="Collapse Panel"
              className="h-10 w-10 rounded-none border-r border-border/50 hover:bg-primary/10 hover:text-primary shrink-0"
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-hidden relative">
            <TabsContent value="description" className="h-full m-0 data-[state=inactive]:hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6 pb-20">
                  {/* Title & Progress */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-3">{algorithm.name}</h1>
                      
                      {/* Difficulty and Company Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {/* Difficulty Badge */}
                        {algorithm.difficulty && (
                          <Badge 
                            variant="outline"
                            className={`
                              ${algorithm.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' : ''}
                              ${algorithm.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' : ''}
                              ${algorithm.difficulty.toLowerCase() === 'hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : ''}
                              ${algorithm.difficulty.toLowerCase() === 'advanced' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : ''}
                              ${algorithm.difficulty.toLowerCase() === 'advance' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : ''}
                              ${algorithm.difficulty.toLowerCase() === 'intermediate' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30' : ''}
                              font-semibold px-3 py-1
                            `}
                          >
                            {algorithm.difficulty}
                          </Badge>
                        )}
                        
                        {/* Company Tags */}
                        {algorithm.metadata?.companies && algorithm.metadata.companies.length > 0 && (
                          <>
                            <span className="text-muted-foreground text-sm">•</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {algorithm.metadata.companies.slice(0, 5).map((company: string, index: number) => (
                                <Badge 
                                  key={index}
                                  variant="secondary"
                                  className="bg-primary/5 text-primary border-primary/20 text-xs px-2 py-0.5"
                                >
                                  {company}
                                </Badge>
                              ))}
                              {algorithm.metadata.companies.length > 5 && (
                                <Badge 
                                  variant="secondary"
                                  className="bg-muted text-muted-foreground text-xs px-2 py-0.5"
                                >
                                  +{algorithm.metadata.companies.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      
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
                  <section className="max-w-[800px] ">
{algorithm.explanation.problemStatement && (
                        <RichText
                        content={algorithm.explanation.problemStatement}
                        className="text-base leading-relaxed pr-4"
                        onClick={handleRichTextClick}
                        ></RichText>
                      )}
                  </section>

                  {/* Examples Section */}
                  {algorithm.explanation.io && algorithm.explanation.io.length > 0 && (
                    <div className="space-y-4 max-w-[600px] ">
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
                    <div className="border rounded-lg max-w-[500px] p-4 bg-muted/20">
                      <h4 className="font-semibold mb-3">Constraints:</h4>
                      <ul className="space-y-1.5 font-mono text-sm">
                        {algorithm.explanation.constraints.map((constraint: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-muted-foreground mt-0.5">•</span>
                            <RichText
                              content={constraint}
                              className="text-base leading-relaxed pr-4"
                              onClick={handleRichTextClick}
                            ></RichText>
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
                        {algorithm.tutorials?.[0]?.moreInfo && (
                         
                              <RichText 
                                        content={algorithm.tutorials?.[0]?.moreInfo}
                                        
                                    />
                        
                                  
                                )}
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
                                     <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        <strong>Credits:</strong> Video tutorial by NeetCode (used with permission). All written
                        explanations, code examples, and additional insights provided by Algolib.io.
                      </p>
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
                  
                  {/* Bottom Action Bar moved to parent container */}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="visualizations" className="h-full m-0 flex flex-col data-[state=inactive]:hidden">
              <AuthGuard
                fallbackTitle="Sign in to view Visualizations"
                fallbackDescription="Create an account or sign in to access interactive algorithm visualizations."
              >
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
              </AuthGuard>
            </TabsContent>

            <TabsContent value="solutions" className="h-full m-0 data-[state=inactive]:hidden">
               <ScrollArea className="h-full">
                  <div className="p-4 space-y-4 pb-20">
                    {algorithm?.implementations ? (
                      <SolutionViewer
                        implementations={algorithm.implementations}
                        approachName="Optimal Solution"
                      />
                    ) : (
                      <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No solutions available.
                      </div>
                    )}
                  </div>
                </ScrollArea>
            </TabsContent>

            {/* Bottom Action Bar - Floating & Centered (Visible across all tabs) */}
            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 p-1.5 bg-background/60 backdrop-blur-xl border shadow-lg rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* Like Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={userVote === 'like' ? "secondary" : "ghost"} 
                        size="sm" 
                        onClick={() => handleVote('like')}
                        className={`gap-1.5 h-8 px-3 rounded-full transition-all ${userVote === 'like' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted'}`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${userVote === 'like' ? 'fill-current' : ''}`} />
                        <span className="text-xs font-medium">{likes}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Like</TooltipContent>
                  </Tooltip>

                  {/* Dislike Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant={userVote === 'dislike' ? "secondary" : "ghost"} 
                        size="sm" 
                        onClick={() => handleVote('dislike')}
                        className={`gap-1.5 h-8 px-3 rounded-full transition-all ${userVote === 'dislike' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'hover:bg-muted'}`}
                      >
                        <ThumbsDown className={`h-3.5 w-3.5 ${userVote === 'dislike' ? 'fill-current' : ''}`} />
                        {dislikes > 0 && <span className="text-xs font-medium">{dislikes}</span>}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Dislike</TooltipContent>
                  </Tooltip>

                  <div className="w-px h-4 bg-border mx-1" />

                  {/* Favorite Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleFavorite}
                        className={`h-8 w-8 rounded-full transition-all ${isFavorite ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{isFavorite ? "Unfavorite" : "Favorite"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
        </div>
      </Tabs>
    </div>
  );

  const renderRightPanel = () => (
    <div className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      {/* Right Header with Tools */}
        
      <div className="flex-1 overflow-hidden p-0">
            {/* Collapse Button - Right Panel */}
           
         <Tabs defaultValue="code" className="h-full flex flex-col">
            <div className="flex items-stretch border-b bg-muted/10 shrink-0">
               {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleRightPanel} 
                  title="Collapse Panel"
                  className="h-10 w-10 rounded-none border-l border-border/50 hover:bg-primary/10 hover:text-primary shrink-0"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              )}
              
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
              <AuthGuard
                fallbackTitle="Sign in to use Code Runner"
                fallbackDescription="Create an account or sign in to run and test your code solutions."
              >
                {algorithmIdOrSlug && algorithm && (
                  <CodeRunner 
                    algorithmId={algorithmIdOrSlug}
                    algorithmData={algorithm}
                    onToggleFullscreen={() => setIsCodeRunnerMaximized(true)}
                    className="h-full border-0 rounded-none shadow-none"
                    initialCode={savedCode}
                    onCodeChange={handleCodeChange}
                    language={selectedLanguage as any}
                    onLanguageChange={(lang) => {
                      setSelectedLanguage(lang);
                      localStorage.setItem('preferredLanguage', lang);
                    }}
                  />
                )}
              </AuthGuard>
            </TabsContent>

            <TabsContent value="brainstorm" className="flex-1 m-0 overflow-hidden relative group data-[state=inactive]:hidden">
              <AuthGuard
                fallbackTitle="Sign in to use Brainstorm"
                fallbackDescription="Create an account or sign in to save notes and whiteboards."
              >
                <ScrollArea className="h-full">
                  <div className="p-0">
                    {algorithmIdOrSlug && (
                      <BrainstormSection algorithmId={algorithmIdOrSlug} algorithmTitle={algorithm.name} />
                    )}
                  </div>
                </ScrollArea>
              </AuthGuard>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );

  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col bg-background ${isInterviewMode ? 'border-4 border-green-500/30' : ''}`}>
      <AlgoMetaHead id={algorithmIdOrSlug} />

      {/* Custom 48px Header Bar */}
      <div className="h-12 border-b flex items-center px-4 gap-4 shrink-0 bg-background/95">
        {/* Left Side: Logo + Navigation */}
        <div className="flex items-center gap-3">
         <Link
                       to="/"
                       className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                     >
                       <img src={logo} alt="Algo Lib Logo" className="w-8 h-8" />
                       <span className=" text-xl">Algo Lib</span>
                     </Link>
          
          <div className="h-4 w-px bg-border" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleRandomProblem} className="h-8 w-8">
                  <Shuffle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Random Problem</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleNextProblem} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next Problem</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right Side: Share, Bug, Timer, Interview, Theme, Profile */}
        <div className="ml-auto flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!isMobile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("/feedback", "_blank")}>
                      <Bug className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Report Issue</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

          {!isMobile && (
            <TooltipProvider>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant={isTimerRunning ? "secondary" : "ghost"} 
                    size="sm" 
                    className="gap-2 font-mono h-8 text-xs"
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
                <TooltipContent>Interview Mode</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="h-4 w-px bg-border mx-1" />

          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/feedback">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Feedback</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

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
            {algorithmIdOrSlug && algorithm && (
              <CodeRunner 
                algorithmId={algorithmIdOrSlug}
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
            {user && algorithmIdOrSlug && algorithm ? (
              <BrainstormSection algorithmId={algorithmIdOrSlug} algorithmTitle={algorithm.name} />
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
      <div className="w-full max-w-[3200px] flex-1 m-auto overflow-hidden relative flex flex-col">
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
            {isMobile && (
              <div className="fixed bottom-6 right-6 z-40">
                <Button 
                  size="lg" 
                  className="rounded-full shadow-lg h-14 w-14 p-0 pointer-events-auto"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default
                    e.stopPropagation();
                    // Scroll to code section
                    const codeSection = document.querySelector('[value="code"]');
                    if (codeSection) {
                        codeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Also trigger tab change if needed
                        const trigger = document.querySelector('[value="code"][role="tab"]');
                        if (trigger instanceof HTMLElement) trigger.click();
                    } else {
                         // Fallback: try to find the tabs content container
                         const tabs = document.querySelector('[data-state="active"]');
                         tabs?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Code2 className="w-6 h-6" />
                </Button>
              </div>
            )}
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
