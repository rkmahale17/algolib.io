import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Book,
  Eye,
  Code2,
  PanelLeftClose,
  Maximize2,
  Minimize2,
  BookOpen,
  Youtube,
  ExternalLink,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Star,
  Flashlight,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
import { TabWarning } from "@/components/TabWarning";
import { FeatureGuard } from "@/components/FeatureGuard";
import { SolutionViewer } from "@/components/SolutionViewer";
import { RichText } from "@/components/RichText";
import { renderBlind75Visualization } from "@/utils/blind75Visualizations";
import { renderVisualization as renderVizFromMapping, hasVisualization } from "@/utils/visualizationMapping";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { AlgoLink } from "../AlgoLink";

interface ProblemDescriptionPanelProps {
  algorithm: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  toggleLeftPanel: () => void;
  isCompleted: boolean;
  
  // Interaction props
  likes: number;
  dislikes: number;
  userVote: 'like' | 'dislike' | null;
  isFavorite: boolean;
  handleVote: (vote: 'like' | 'dislike') => void;
  toggleFavorite: () => void;
  
  // Visualization props
  isVisualizationMaximized: boolean;
  setIsVisualizationMaximized: (val: boolean) => void;
  handleRichTextClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ProblemDescriptionPanel = React.memo(({
  algorithm,
  activeTab,
  setActiveTab,
  isMobile,
  toggleLeftPanel,
  isCompleted,
  likes,
  dislikes,
  userVote,
  isFavorite,
  handleVote,
  toggleFavorite,
  isVisualizationMaximized,
  setIsVisualizationMaximized,
  handleRichTextClick,
}: ProblemDescriptionPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.width < 400);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  
  const renderVisualization = () => {
    if (!algorithm) return null;

    // 1. Check DB Visualization URL
    const dbUrl = algorithm.metadata?.visualizationUrl || algorithm.visualizationUrl;
    if (dbUrl && dbUrl.startsWith('http')) {
      return (
        <iframe 
          src={dbUrl} 
          className="w-full h-full border-0 " 
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
    const vizKey = algorithm.id || algorithm.slug;
    
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

  return (
    <div ref={containerRef} className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full pt-0 mt-0">
        <div className="px-0 shrink-0 flex items-stretch border-b">
          <TabsList className="flex-1 grid grid-cols-3 p-0 bg-transparent gap-0 rounded-none">
            <TooltipProvider>
              <TabsTrigger 
                value="description" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
              >
                {isCompact ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FileText className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>Description</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2 shrink-0" />
                    Description
                  </>
                )}
              </TabsTrigger>

              <TabsTrigger 
                value="visualizations"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
              >
                {isCompact ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Eye className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>Visualizations</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2 shrink-0" />
                    Visualizations
                  </>
                )}
              </TabsTrigger>

              <TabsTrigger 
                value="solutions"
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
              >
                {isCompact ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Flashlight className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>Solutions</TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Flashlight className="w-4 h-4 mr-2 shrink-0" />
                    Solutions
                  </>
                )}
              </TabsTrigger>
            </TooltipProvider>
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
                        {(!algorithm?.controls || algorithm.controls?.metadata?.difficulty !== false) && algorithm.difficulty && (
                          <Badge 
                            variant="outline"
                            className={`
                              ${DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] === 'Easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' : ''}
                              ${DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] === 'Medium' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' : ''}
                              ${DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] === 'Hard' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : ''}
                              font-semibold px-3 py-1
                            `}
                          >
                            {DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || algorithm.difficulty}
                          </Badge>
                        )}
                        
                        {/* Company Tags */}
                        {(!algorithm?.controls || algorithm.controls?.metadata?.companies !== false) && algorithm.metadata?.companies && algorithm.metadata.companies.length > 0 && (
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
                       {(!algorithm?.controls || algorithm.controls?.metadata?.attempted_badge !== false) && isCompleted && (
                        <Badge 
                          variant="outline" 
                          className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1.5 hover:bg-green-500/20 transition-colors cursor-default"
                        >
                          
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Solved
                        </Badge>
                      )}
                    </div>
                  </div>
                  <section className="max-w-[800px] ">
                    {algorithm.explanation.problemStatement && (!algorithm?.controls || algorithm.controls?.description?.problem_statement !== false) && (
                        <RichText
                        content={algorithm.explanation.problemStatement}
                        className="text-base leading-relaxed pr-4 dark:text-muted-foreground"
                        onClick={handleRichTextClick}
                        ></RichText>
                      )}
                  </section>

                  {/* Examples Section */}
                  {algorithm.explanation.io && algorithm.explanation.io.length > 0 && (!algorithm?.controls || algorithm.controls?.description?.examples !== false) && (
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
                  {algorithm.explanation.constraints && algorithm.explanation.constraints.length > 0 && (!algorithm?.controls || algorithm.controls?.description?.constraints !== false) && (
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
                  {algorithm.explanation.note && (!algorithm?.controls || algorithm.controls?.description?.problem_statement !== false) && (
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm text-muted-foreground italic">{algorithm.explanation.note}</p>
                    </div>
                  )}

                  {/* Collapsible Section for Overview and Guides */}
                  {(() => {
                    const showOverview = !algorithm?.controls || algorithm.controls?.description?.overview !== false;
                    const showGuides = algorithm && (!algorithm?.controls || algorithm.controls?.description?.guides !== false);

                    if (!showOverview && !showGuides) return null;
                    
                    // Prioritize metadata (Preview Mode) then root properties (Production Mode)
                    const overview = algorithm.metadata?.overview || algorithm.overview;
                    const timeComplexity = algorithm.metadata?.timeComplexity || algorithm.timeComplexity;
                    const spaceComplexity = algorithm.metadata?.spaceComplexity || algorithm.spaceComplexity;

                    return (
                      <Card className="glass-card overflow-hidden">
                        <Accordion type="single" collapsible defaultValue="details" className="w-full">
                          <AccordionItem value="details" className="border-none">
                            <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline">
                               <div className="flex items-center gap-2 text-lg font-semibold">
                                  <BookOpen className="w-5 h-5 text-primary" />
                                  Algorithm Overview
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-1 sm:px-1 pb-4">
                               <div className="space-y-6 pt-0">
                                    <div className="px-3 sm:px-5 space-y-4">
                                      {showOverview && (
                                        <>
                                          <div className="text-sm text-muted-foreground">
                                            {/* Using RichText if available, otherwise fallback */}
                                            {overview ? (
                                                <RichText content={overview} />
                                            ) : (
                                                <RichText content={algorithm.explanation.problemStatement} />
                                            )}
                                          </div>

                                          <Separator />

                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <p className="text-sm font-medium mb-1">Time Complexity</p>
                                              <Badge variant="outline" className="font-mono">
                                                {timeComplexity || "N/A"}
                                              </Badge>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium mb-1">Space Complexity</p>
                                              <Badge variant="outline" className="font-mono">
                                                {spaceComplexity || "N/A"}
                                              </Badge>
                                            </div>
                                          </div>
                                          <Separator />

                                        </>
                                      )}

                                      {/* Steps, Use Cases & Tips */}
                                      {showGuides && (
                                        <div className="pt-2">
                                          <Tabs defaultValue="usecase">
                                            <TabsList className="grid w-full grid-cols-3 h-auto">
                                              <TabsTrigger value="usecase" className="text-xs sm:text-sm">
                                                Use Cases
                                              </TabsTrigger>
                                              <TabsTrigger value="tips" className="text-xs sm:text-sm">
                                                Pro Tips
                                              </TabsTrigger>
                                              <TabsTrigger value="steps" className="text-xs sm:text-sm">
                                                Steps to solve
                                              </TabsTrigger>
                                            </TabsList>

                                            <div className="p-1">
                                                <TabsContent value="steps" className="mt-4">
                                                  <div className="text-sm text-muted-foreground">
                                                    <RichText content={algorithm.explanation.steps} />
                                                  </div>
                                                </TabsContent>

                                                <TabsContent value="usecase" className="mt-4">
                                                  <RichText
                                                    className="text-sm text-muted-foreground"
                                                    content={algorithm.explanation.useCase}
                                                  />
                                                </TabsContent>

                                                <TabsContent value="tips" className="mt-4">
                                                  <div className="text-sm text-muted-foreground">
                                                    <RichText content={algorithm.explanation.tips} />
                                                  </div>
                                                </TabsContent>
                                            </div>
                                          </Tabs>
                                        </div>
                                      )}
                                    </div>
                               </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </Card>
                    );
                  })()}

                  {/* Video Tutorial Card */}
                  <FeatureGuard flag="youtube_video">
                    {algorithm.tutorials?.[0]?.url && (!algorithm?.controls || algorithm.controls?.content?.youtube_tutorial !== false) && (
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
                        explanations, code examples, and additional insights provided by Rulcode.com.
                      </p>
                    </div>
                                    </div>
                                  </div>
                                </Card>
                    )}
                  </FeatureGuard>

                  {/* Practice Problems Card */}
                  <FeatureGuard flag="external_links">
                    {algorithm?.problems_to_solve?.internal && algorithm.problems_to_solve.internal.length > 0 && 
                      (!algorithm?.controls || algorithm.controls?.content?.practice_problems !== false) ? (
                      <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                        <h3 className="font-semibold mb-4">Practice Problems</h3>
                        <div className="space-y-2">
                          {algorithm.problems_to_solve.internal.map((problem: any, i: number) => (
                            <Link
                              key={`internal-${i}`}
                              to={`/algorithm/${problem.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">{problem.title}</p>
                                <div className="mt-1.5 flex">
                                  <Badge 
                                    variant="secondary" 
                                    className={`
                                      text-[10px] h-5 px-2 capitalize font-medium border
                                      ${problem.type.toLowerCase() === 'easy' ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200  ' : ''}
                                      ${problem.type.toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200' : ''}
                                      ${problem.type.toLowerCase() === 'hard' ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' : ''}
                                    `}
                                  >
                                    {problem.type}
                                  </Badge>
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </Card>
                    ) : null}
                  </FeatureGuard>
                  
                  {/* Bottom Action Bar moved to parent container */}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="visualizations" className="h-full m-0 flex flex-col data-[state=inactive]:hidden">
              {algorithm?.controls?.tabs?.visualization === false ? (
                 <TabWarning message="Visualization is not available for this problem at the moment." />
              ) : (
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
              )}
            </TabsContent>

            <TabsContent value="solutions" className="h-full m-0 data-[state=inactive]:hidden">
               {algorithm?.controls?.tabs?.solutions === false ? (
                 <TabWarning message="Detailed solutions are not available for this problem yet." />
               ) : (
                 <ScrollArea className="h-full">
                    <div className="p-4 space-y-4 pb-20">
                      {algorithm?.implementations ? (
                        <SolutionViewer
                          implementations={algorithm.implementations}
                          approachName="Optimal Solution"
                          controls={algorithm?.controls?.solutions}
                        />
                      ) : (
                        <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                          No solutions available.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
               )}
            </TabsContent>

            {/* Bottom Action Bar - Floating & Centered (Visible across all tabs) */}
            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center pointer-events-none">
              <div className="pointer-events-auto flex items-center gap-1 p-1.5 bg-background/60 backdrop-blur-xl border shadow-lg rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* Like Button */}
                {(!algorithm?.controls || algorithm.controls?.social?.voting !== false) && (
                  <>
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
                  </TooltipProvider>
                  </>
                )}

                {(!algorithm?.controls || (algorithm.controls?.social?.voting !== false && algorithm.controls?.social?.favorite !== false)) && (
                   <div className="w-px h-4 bg-border mx-1" />
                )}

                {/* Favorite Button */}
                {(!algorithm?.controls || algorithm.controls?.social?.favorite !== false) && (
                  <TooltipProvider>
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
                )}
              </div>
            </div>
        </div>
      </Tabs>
      
      {/* Maximized Visualization Portal */}
      {isVisualizationMaximized && createPortal(
        <div className="fixed inset-0 z-[100] bg-background flex flex-col w-screen h-screen">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0 h-14">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Visualization
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsVisualizationMaximized(false)}
                className="gap-2"
              >
                <Minimize2 className="w-4 h-4" />
                Exit Fullscreen
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 relative">
               {renderVisualization()}
            </div>
        </div>,
        document.body
      )}
    </div>
  );
});
