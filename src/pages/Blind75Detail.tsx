import { ArrowLeft, Book, BookOpen, CheckCircle2, Clock, Code2, ExternalLink, Eye, Lightbulb, Youtube } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Helmet } from 'react-helmet-async';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyCodeButton } from "@/components/CopyCodeButton";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { blind75Problems } from "@/data/blind75";
import { blind75Implementations } from "@/data/blind75Implementations";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { algorithms } from "@/data/algorithms";
import { getAlgorithmImplementation } from "@/data/algorithmImplementations";

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
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'java' | 'cpp' | 'typescript'>('python');

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
          completed_at: newCompletedState ? new Date().toISOString() : null
        })
        .eq("user_id", user.id)
        .eq("algorithm_id", `blind75-${slug}`);

      if (error) {
        // Revert on error
        setIsCompleted(!newCompletedState);
        toast.error("Failed to update progress");
        console.error(error);
      } else {
        toast.success(newCompletedState ? "Marked as completed! 🎉" : "Marked as incomplete");
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          algorithm_id: `blind75-${slug}`,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null
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
    if (algoId === "two-pointers") {
      const TwoPointersVisualization = React.lazy(() =>
        import(
          "@/components/visualizations/algorithms/TwoPointersVisualization"
        ).then((m) => ({ default: m.TwoPointersVisualization }))
      );
      return (
        <React.Suspense
          fallback={<div className="text-center py-12">Loading visualization...</div>}
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
          fallback={<div className="text-center py-12">Loading visualization...</div>}
        >
          <SlidingWindowVisualization />
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
          fallback={<div className="text-center py-12">Loading visualization...</div>}
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
          fallback={<div className="text-center py-12">Loading visualization...</div>}
        >
          <BinarySearchVisualization />
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
          fallback={<div className="text-center py-12">Loading visualization...</div>}
        >
          <KadanesVisualization />
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
          fallback={<div className="text-center py-12">Loading visualization...</div>}
        >
          <ContainerWithMostWaterVisualization />
        </React.Suspense>
      );
    }

    // Add more visualization mappings as needed
    return null;
  };

  const languageMap = {
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    typescript: 'TypeScript'
  };

  return (
    <>
      <Helmet>
        <title>{problem.title} - Blind 75 | AlgoLib.io</title>
        <meta name="description" content={problem.description} />
        <link rel="canonical" href={`https://algolib.io/blind75/${problem.slug}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": problem.title,
            "description": problem.description,
            "url": `https://algolib.io/blind75/${problem.slug}`,
            "articleSection": problem.category,
            "proficiencyLevel": problem.difficulty,
            "author": {
              "@type": "Organization",
              "name": "AlgoLib.io"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <div
          className={`
            sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 
            transition-all duration-300
            ${showBreadcrumb ? "opacity-100 translate-y-0" : "md:opacity-100 md:translate-y-0 opacity-0 -translate-y-full pointer-events-none md:pointer-events-auto"}
          `}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/blind75")}
                  className="gap-2 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Blind 75</span>
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <div className="overflow-hidden">
                  <Breadcrumbs
                    items={[
                      {
                        label: "Blind 75",
                        href: "/blind75",
                      },
                      {
                        label: problem.category,
                        href: `/blind75?category=${encodeURIComponent(problem.category)}`,
                      },
                      {
                        label: problem.title,
                      },
                    ]}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ShareButton title={problem.title} description={problem.description} />
                {problem.leetcodeSearch && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={problem.leetcodeSearch}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LeetCode
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Problem Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      #{problem.id}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={difficultyColors[problem.difficulty]}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </Badge>
                    <Badge variant="outline">{problem.category}</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {problem.title}
                  </h1>
                </div>
                
                {/* Progress Checkbox */}
                <div className="shrink-0">
                  <div
                    onClick={toggleCompletion}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={isCompleted}
                      disabled={isLoadingProgress}
                      className="pointer-events-none"
                    />
                    <span className="text-sm font-medium hidden sm:inline">
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complexity & Companies */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Time: {problem.timeComplexity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
              </div>

              {/* Companies */}
              {problem.companies && problem.companies.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Companies:</span>
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge key={company} variant="secondary">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Main Tabs */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
                <TabsTrigger value="description" className="gap-2">
                  <Book className="w-4 h-4" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="solution" className="gap-2">
                  <Code2 className="w-4 h-4" />
                  Solution
                </TabsTrigger>
                {problem.algorithmId && (
                  <TabsTrigger value="visualization" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Visualization
                  </TabsTrigger>
                )}
                {problem.youtubeUrl && (
                  <TabsTrigger value="video" className="gap-2">
                    <Youtube className="w-4 h-4" />
                    Video
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Description Tab */}
              <TabsContent value="description" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Problem Description</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {problem.description}
                  </p>
                </Card>

                {/* Use Cases */}
                {problem.useCases && problem.useCases.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-semibold">Real-World Applications</h2>
                    </div>
                    <ul className="space-y-3">
                      {problem.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </TabsContent>

              {/* Solution Tab */}
              <TabsContent value="solution" className="space-y-6">
                {implementation ? (
                  <>
                    {/* Approach Explanation */}
                    <Card className="p-6">
                      <h2 className="text-2xl font-semibold mb-4">Approach</h2>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {implementation.explanation}
                      </p>
                    </Card>

                    {/* Code Implementation */}
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                        <h2 className="text-2xl font-semibold">Implementation</h2>
                        <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
                          <TabsList>
                            {Object.entries(languageMap).map(([key, label]) => (
                              <TabsTrigger key={key} value={key}>
                                {label}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                      </div>

                      <div className="relative">
                        <CopyCodeButton code={implementation[selectedLanguage]} />
                        <pre className="bg-muted/50 rounded-lg border border-border overflow-x-auto p-4">
                          <code className="text-sm">{implementation[selectedLanguage]}</code>
                        </pre>
                      </div>
                    </Card>
                  </>
                ) : (
                  <Card className="p-6">
                    <div className="text-center py-8">
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
                  </Card>
                )}
              </TabsContent>

              {/* Visualization Tab */}
              {problem.algorithmId && (
                <TabsContent value="visualization" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Interactive Visualization</h2>
                    {renderVisualization()}
                  </Card>
                </TabsContent>
              )}

              {/* Video Tab */}
              {problem.youtubeUrl && (
                <TabsContent value="video" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">NeetCode Explanation</h2>
                    <YouTubePlayer youtubeUrl={problem.youtubeUrl} algorithmName={problem.title} />
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blind75Detail;
