import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Book,
  Eye,
  Code2,
  PanelLeftClose,
  Maximize,
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
  Lightbulb,
  Zap,
  ListChecks,
  Lock,
  Tag,
  Building2,
  Check,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthGuard } from "@/components/AuthGuard";
import { TabWarning } from "@/components/TabWarning";
import { FeatureGuard } from "@/components/FeatureGuard";
import { useApp } from "@/contexts/AppContext";
import { ProOverlay } from "@/components/ProOverlay";
import { VideoTutorialCard } from "./VideoTutorialCard";

// Lazy components
const TreeDiagram = React.lazy(() => import("../visualizations/TreeDiagram").then(mod => ({ default: mod.TreeDiagram })));
const GraphDiagram = React.lazy(() => import("../visualizations/GraphDiagram").then(mod => ({ default: mod.GraphDiagram })));
const SolutionViewer = React.lazy(() => import("@/components/SolutionViewer").then(mod => ({ default: mod.SolutionViewer })));
const RichText = React.lazy(() => import("@/components/RichText").then(mod => ({ default: mod.RichText })));
const ContentRights = React.lazy(() => import("@/pages/ContentRights"));

import { renderBlind75Visualization } from "@/utils/blind75Visualizations";
import { renderVisualization as renderVizFromMapping, hasVisualization } from "@/utils/visualizationMapping";
import { TOP_COMPANIES } from "@/constants/companies";
import { CompanyIcon } from "@/components/CompanyIcon";
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { isTreeType } from "@/utils/treeUtils";
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
  isPlatformPreview?: boolean;
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
  isPlatformPreview = false,
}: ProblemDescriptionPanelProps) => {
  const { hasPremiumAccess } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  const companiesRef = useRef<HTMLDivElement>(null);
  const hintsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const slug = params?.slug as string;
  const [isCompact, setIsCompact] = useState(false);
  const [isUltraCompact, setIsUltraCompact] = useState(false);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.width < 400);
        setIsUltraCompact(entry.contentRect.width < 300);
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
    <div ref={containerRef} className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden w-full pt-0 mt-0">
        <div className="px-0 shrink-0 flex items-stretch border-b">
          <TabsList className="flex-1 grid grid-cols-3 p-0 bg-transparent gap-0 rounded-none">
            <TooltipProvider>
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-transparent data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
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
                className="data-[state=active]:bg-transparent data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
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
                className="data-[state=active]:bg-transparent data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4"
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
              <div className="p-4 space-y-6">
                {/* Title & Progress */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h1 className="text-xl font-medium">
                        {<span className="font-medium text-md mr-1">{algorithm.serial_no ? `${algorithm.serial_no}. ` : ''}</span>}{algorithm.name}
                      </h1>
                      {(algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20 text-[10px] sm:text-xs font-bold px-3 py-1 uppercase tracking-wide h-7 rounded-full">
                          PRO
                        </Badge>
                      )}
                    </div>

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
                              font-semibold px-3 py-1 h-7 rounded-full text-[10px] sm:text-xs
                            `}
                        >
                          {DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || algorithm.difficulty}
                        </Badge>
                      )}

                      {/* Metadata Badges (Topics, Companies, Hint) */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Topics Badge */}
                        {algorithm.category && (
                          <Badge
                            variant="outline"
                            className="bg-transparent text-foreground border-border text-[10px] sm:text-xs px-3 py-1 cursor-pointer hover:bg-muted/50 transition-all flex items-center h-7 rounded-full gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToSection(topicsRef);
                            }}
                          >
                            <Tag className="w-3.5 h-3.5 text-primary" />
                            Topics
                          </Badge>
                        )}

                        {/* Companies Badge */}
                        {algorithm.metadata?.companies && algorithm.metadata.companies.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-transparent text-foreground border-border text-[10px] sm:text-xs px-3 py-1 cursor-pointer hover:bg-muted/50 transition-all flex items-center h-7 rounded-full gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToSection(companiesRef);
                            }}
                          >
                            {hasPremiumAccess || isPlatformPreview ? (
                              <Building2 className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                            )}
                            Companies
                          </Badge>
                        )}

                        {/* Hint Badge */}
                        {algorithm.metadata?.hints && algorithm.metadata.hints.length > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-transparent text-foreground border-border text-[10px] sm:text-xs px-3 py-1 cursor-pointer hover:bg-muted/50 transition-all flex items-center h-7 rounded-full gap-1.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToSection(hintsRef);
                            }}
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-primary" />
                            Hints
                          </Badge>
                        )}
                      </div>
                    </div>


                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    {(!algorithm?.controls || algorithm.controls?.metadata?.attempted_badge !== false) && isCompleted && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 px-3 py-1 hover:bg-primary/20 transition-colors cursor-default flex items-center h-7 rounded-full text-[10px] sm:text-xs font-medium"
                      >
                        <div className="bg-primary rounded-full p-0.5 mr-1.5 flex items-center justify-center text-primary-foreground shadow-sm">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        Solved
                      </Badge>
                    )}
                  </div>
                </div>
                <section className="max-w-[800px] ">
                  {algorithm.explanation.problemStatement && (!algorithm?.controls || algorithm.controls?.description?.problem_statement !== false) && (
                    <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded-md" />}>
                      <RichText
                        content={algorithm.explanation.problemStatement}
                        className="text-base leading-relaxed pr-4 dark:text-muted-foreground"
                        onClick={handleRichTextClick}
                      ></RichText>
                    </React.Suspense>

                  )}
                </section>

                {/* Examples Section */}
                {algorithm.explanation.io && algorithm.explanation.io.length > 0 && (!algorithm?.controls || algorithm.controls?.description?.examples !== false) && (
                  <Card className="glass-card max-w-[600px] overflow-hidden">
                    {algorithm.explanation.io.map((example: any, index: number) => (
                      <React.Fragment key={index}>
                        <div className="p-4">
                          <h4 className="font-medium mb-3">Example {index + 1}:</h4>
                          <div className="space-y-2 font-mono text-sm">
                            {example.inputBeforeHtml && (
                              <React.Suspense fallback={<div className="h-6 w-full animate-pulse bg-muted rounded" />}>
                                <RichText content={example.inputBeforeHtml} className="mb-2" />
                              </React.Suspense>
                            )}
                            {example.input && (
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Input:</span>{' '}
                                  <code className="bg-muted px-2 py-0.5 rounded">{example.input}</code>
                                </div>
                                {example.inputAfterHtml && (
                                  <React.Suspense fallback={<div className="h-6 w-full animate-pulse bg-muted rounded" />}>
                                    <RichText content={example.inputAfterHtml} className="mt-2" />
                                  </React.Suspense>
                                )}
                                {(algorithm?.controls?.visualizations?.tree?.enabled ?? algorithm?.controls?.show_tree_visualization) && algorithm?.controls?.visualizations?.tree?.examples_input !== false && (
                                  <React.Suspense fallback={<div className="h-[120px] w-full animate-pulse bg-muted rounded-md" />}>
                                    <TreeDiagram data={example.input} height={120} multiple={algorithm?.controls?.visualizations?.tree?.multiple} />
                                  </React.Suspense>
                                )}
                                {(algorithm?.controls?.visualizations?.graph?.enabled ?? algorithm?.controls?.show_graph_visualization) && algorithm?.controls?.visualizations?.graph?.examples_input !== false && (
                                  <React.Suspense fallback={<div className="h-[120px] w-full animate-pulse bg-muted rounded-md" />}>
                                    <GraphDiagram data={example.input} height={120} />
                                  </React.Suspense>
                                )}
                              </div>
                            )}
                            {example.outputBeforeHtml && (
                              <React.Suspense fallback={<div className="h-6 w-full animate-pulse bg-muted rounded" />}>
                                <RichText content={example.outputBeforeHtml} className="mb-2" />
                              </React.Suspense>
                            )}
                            {example.output && (
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Output:</span>{' '}
                                  <code className="bg-muted px-2 py-0.5 rounded">{example.output}</code>
                                </div>
                                {example.outputAfterHtml && (
                                  <React.Suspense fallback={<div className="h-6 w-full animate-pulse bg-muted rounded" />}>
                                    <RichText content={example.outputAfterHtml} className="mt-2" />
                                  </React.Suspense>
                                )}
                                {(algorithm?.controls?.visualizations?.tree?.enabled ?? algorithm?.controls?.show_tree_visualization) && algorithm?.controls?.visualizations?.tree?.examples_output !== false && (
                                  <React.Suspense fallback={<div className="h-[120px] w-full animate-pulse bg-muted rounded-md" />}>
                                    <TreeDiagram data={example.output} height={120} multiple={algorithm?.controls?.visualizations?.tree?.multiple} />
                                  </React.Suspense>
                                )}
                                {(algorithm?.controls?.visualizations?.graph?.enabled ?? algorithm?.controls?.show_graph_visualization) && algorithm?.controls?.visualizations?.graph?.examples_output !== false && (
                                  <React.Suspense fallback={<div className="h-[120px] w-full animate-pulse bg-muted rounded-md" />}>
                                    <GraphDiagram data={example.output} height={120} />
                                  </React.Suspense>
                                )}
                              </div>
                            )}
                            {example.explanation && (
                              <div className="mt-2">
                                <span className="font-medium">Explanation:</span>{' '}
                                <span className="text-muted-foreground whitespace-pre-line">{example.explanation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {index < algorithm.explanation.io.length - 1 && <Separator className="bg-border/50 mx-5 w-auto" />}
                      </React.Fragment>
                    ))}
                  </Card>
                )}

                {/* Constraints Section */}
                {algorithm.explanation.constraints && algorithm.explanation.constraints.length > 0 && (!algorithm?.controls || algorithm.controls?.description?.constraints !== false) && (
                  <Card className="glass-card max-w-[500px] p-4 overflow-hidden">
                    <h4 className="font-medium mb-3">Constraints:</h4>
                    <ul className="space-y-1.5 font-mono text-sm">
                      {algorithm.explanation.constraints.map((constraint: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground mt-0.5">•</span>
                          <React.Suspense fallback={<div className="h-6 w-full animate-pulse bg-muted rounded" />}>
                            <RichText
                              content={constraint}
                              className="text-base leading-relaxed pr-4 text-sm "
                              onClick={handleRichTextClick}
                            ></RichText>
                          </React.Suspense>
                        </li>
                      ))}
                    </ul>
                  </Card>
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
                            <div className="flex items-center gap-2 text-lg font-medium">
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
                                      <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded" />}>
                                        {overview ? (
                                          <RichText content={overview} />
                                        ) : (
                                          <RichText content={algorithm.explanation.problemStatement} />
                                        )}
                                      </React.Suspense>
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
                                        <TooltipProvider>
                                          <TabsTrigger value="usecase" className="text-xs sm:text-sm">
                                            {isUltraCompact ? (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Lightbulb className="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>Use Cases</TooltipContent>
                                              </Tooltip>
                                            ) : (
                                              <>
                                                <Lightbulb className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                Use Cases
                                              </>
                                            )}
                                          </TabsTrigger>
                                          <TabsTrigger value="tips" className="text-xs sm:text-sm">
                                            {isUltraCompact ? (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Zap className="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>Pro Tips</TooltipContent>
                                              </Tooltip>
                                            ) : (
                                              <>
                                                <Zap className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                Pro Tips
                                              </>
                                            )}
                                          </TabsTrigger>
                                          <TabsTrigger value="steps" className="text-xs sm:text-sm">
                                            {isUltraCompact ? (
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <ListChecks className="w-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>Steps to solve</TooltipContent>
                                              </Tooltip>
                                            ) : (
                                              <>
                                                <ListChecks className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                Steps to solve
                                              </>
                                            )}
                                          </TabsTrigger>
                                        </TooltipProvider>
                                      </TabsList>

                                      <div className="p-1 min-h-[150px] relative">
                                        <TabsContent value="steps" className="mt-4 h-full">
                                          {(algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !isPlatformPreview ? (
                                            <ProOverlay className="rounded-none border-0 py-12" />
                                          ) : (
                                            <div className="text-sm text-muted-foreground">
                                              <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded" />}>
                                                <RichText content={algorithm.explanation.steps} />
                                              </React.Suspense>
                                            </div>
                                          )}
                                        </TabsContent>

                                        <TabsContent value="usecase" className="mt-4">
                                          <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded" />}>
                                            <RichText
                                              className="text-sm text-muted-foreground"
                                              content={algorithm.explanation.useCase}
                                            />
                                          </React.Suspense>
                                        </TabsContent>

                                        <TabsContent value="tips" className="mt-4 h-full">
                                          {(algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !isPlatformPreview ? (
                                            <ProOverlay className="rounded-none border-0 py-12" />
                                          ) : (
                                            <div className="text-sm text-muted-foreground">
                                              <React.Suspense fallback={<div className="h-20 w-full animate-pulse bg-muted rounded" />}>
                                                <RichText content={algorithm.explanation.tips} />
                                              </React.Suspense>
                                            </div>
                                          )}
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

                {/* Metadata Accordions (Topics, Companies, Hints) */}
                <div className="space-y-0 max-w-5xl mx-auto w-full">
                  <Accordion type="multiple" className="w-full space-y-4">
                    {/* Topics Item */}
                    {algorithm.category && (
                      <AccordionItem value="topics" className="border rounded-lg glass-card shadow-sm border-border/50" ref={topicsRef}>
                        <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline group">
                          <div className="flex items-center gap-2 text-base font-medium transition-colors text-foreground">
                            <Tag className="w-5 h-5 text-primary" />
                            Topics
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 sm:px-6 pb-6 pt-0">
                          <Separator className="mb-4 bg-border/40" />
                          <div className="flex flex-wrap gap-2">
                            {(algorithm.category.includes(',') ? algorithm.category.split(',').map((c: string) => c.trim()) : [algorithm.category]).map((tag: string, i: number) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-muted hover:bg-muted/80 text-foreground border-border font-normal cursor-pointer flex items-center gap-1.5"
                                onClick={() => router.push(`/dsa/query?topic=${tag}`)}
                              >
                                <Tag className="w-3 h-3 text-primary/70" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Companies Item */}
                    {algorithm.metadata?.companies && algorithm.metadata.companies.length > 0 && (
                      <AccordionItem value="companies" className="border rounded-lg glass-card shadow-sm border-border/50" ref={companiesRef}>
                        <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline group">
                          <div className="flex items-center gap-2 text-base font-medium transition-colors text-foreground">
                            {hasPremiumAccess || isPlatformPreview ? (
                              <Building2 className="w-5 h-5 text-primary" />
                            ) : (
                              <Lock className="w-5 h-5 text-amber-500" />
                            )}
                            Companies
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 sm:px-6 pb-6 pt-0">
                          <Separator className="mb-4 bg-border/40" />
                          {hasPremiumAccess || isPlatformPreview ? (
                            <div className="flex flex-wrap gap-2">
                              {algorithm.metadata.companies.map((company: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-muted hover:bg-muted/80 text-foreground border-border text-xs px-2 py-1 flex items-center gap-1.5 font-normal cursor-pointer"
                                  onClick={() => router.push(`/dsa/query?company=${company}`)}
                                >
                                  <CompanyIcon company={company} className="w-3.5 h-3.5 opacity-80" />
                                  {company}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="relative overflow-hidden rounded-lg">
                              <div className="flex flex-wrap gap-2 filter blur-[3px] select-none pointer-events-none opacity-50">
                                {algorithm.metadata.companies.slice(0, 5).map((company: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="px-2 py-1">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <ProOverlay className="rounded-none border-0 h-full p-2" />
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Hints Item */}
                    {algorithm.metadata?.hints && algorithm.metadata.hints.length > 0 && (
                      <AccordionItem value="hints" className="border rounded-lg glass-card shadow-sm border-border/50" ref={hintsRef}>
                        <AccordionTrigger className="px-4 sm:px-6 py-4 hover:no-underline group">
                          <div className="flex items-center gap-2 text-base font-medium transition-colors text-foreground">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            Hints
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 sm:px-6 pb-6 pt-0 space-y-3">
                          <Separator className="mb-4 bg-border/40" />
                          {algorithm.metadata.hints.map((hint: string, i: number) => (
                            <div key={i} className="flex gap-3 text-sm text-muted-foreground p-3 rounded-lg bg-muted/20 border border-border/30">
                              <span className="font-semibold text-amber-500 shrink-0">Hint {i + 1}:</span>
                              <React.Suspense fallback={<div className="h-4 w-full animate-pulse bg-muted rounded" />}>
                                <RichText content={hint} />
                              </React.Suspense>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>

                {/* Video Tutorial Card */}
                <FeatureGuard flag="youtube_video">
                  {algorithm.tutorials?.[0]?.url && (!algorithm?.controls || algorithm.controls?.content?.youtube_tutorial !== false) && (
                    <VideoTutorialCard tutorial={algorithm.tutorials[0]} title={`${algorithm.name} Tutorial`} />
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
                            href={`/problem/${problem.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">{problem.serial_no}.{problem.title}</p>
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
                disabled={isPlatformPreview}
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
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className={`flex-1 overflow-auto no-scrollbar relative flex flex-col ${(algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !isPlatformPreview ? 'p-0' : 'p-6'}`}>
                    {(algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !isPlatformPreview ? (
                      <ProOverlay className="rounded-none border-0 flex-1 h-full" />
                    ) : (
                      renderVisualization()
                    )}
                  </div>
                </div>
              </AuthGuard>
            )}
          </TabsContent>

          <TabsContent value="solutions" className="h-full m-0 data-[state=inactive]:hidden">
            {algorithm?.controls?.tabs?.solutions === false ? (
              <TabWarning message="Detailed solutions are not available for this problem yet." />
            ) : (algorithm?.is_premium || algorithm?.is_pro || algorithm?.metadata?.is_pro) && !hasPremiumAccess && !isPlatformPreview ? (
              <div className="h-full flex flex-col">
                <ProOverlay className="rounded-none border-0 flex-1" />
              </div>
            ) : (
              <ScrollArea className="h-full relative">
                <div className="p-4 space-y-4 pb-20">
                  {algorithm?.implementations ? (
                    <React.Suspense fallback={<div className="h-64 w-full animate-pulse bg-muted rounded-md" />}>
                      <SolutionViewer
                        implementations={algorithm.implementations}
                        approachName="Optimal Solution"
                        controls={algorithm?.controls?.solutions}
                        tutorial={algorithm.tutorials?.[0]}
                        problemName={algorithm.name}
                      />
                    </React.Suspense>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                      No solutions available.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Bottom Action Bar - Ultra Slim Capsule (Visible across all tabs) */}
          <div className="absolute bottom-[2px] left-0 right-0 z-10 flex justify-center pointer-events-none px-4">
            <div className="pointer-events-auto max-w-full overflow-x-auto no-scrollbar flex items-center gap-1 p-0.5 bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg rounded-full animate-in fade-in slide-in-from-bottom-4 duration-300">

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
                          className={`gap-1.5 h-7 px-2.5 rounded-full transition-all ${userVote === 'like' ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-muted'}`}
                        >
                          <ThumbsUp className={`h-3 w-3 ${userVote === 'like' ? 'fill-current' : ''}`} />
                          <span className="text-[11px] font-medium">{likes}</span>
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
                          className={`gap-1.5 h-7 px-2.5 rounded-full transition-all ${userVote === 'dislike' ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'hover:bg-muted'}`}
                        >
                          <ThumbsDown className={`h-3 w-3 ${userVote === 'dislike' ? 'fill-current' : ''}`} />
                          {dislikes > 0 && <span className="text-[11px] font-medium">{dislikes}</span>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Dislike</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}

              {(!algorithm?.controls || (algorithm.controls?.social?.voting !== false && algorithm.controls?.social?.favorite !== false)) && (
                <div className="w-px h-3 bg-border mx-0.5" />
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
                        className={`h-7 w-7 rounded-full transition-all ${isFavorite ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{isFavorite ? "Unfavorite" : "Favorite"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div >
      </Tabs >

      {/* Maximized Visualization Portal */}
      {
        isVisualizationMaximized && createPortal(
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
        )
      }
    </div >
  );
});
