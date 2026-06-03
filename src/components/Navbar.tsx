"use client";

import {
  BookOpen,
  Brain,
  Bug,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Code2,
  CreditCard,
  Crown,
  Github,
  HardDrive,
  Languages,
  Layers,
  Lightbulb,
  List as ListIcon,
  ListTodo,
  Loader2,
  Menu,
  Menu as MenuIcon,
  MessageSquare,
  Monitor,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pause,
  PenTool,
  Play,
  Rocket,
  RotateCcw,
  Send,
  Share2,
  ShieldCheck,
  Shuffle,
  Target,
  Timer,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LIST_TYPE_LABELS, ListType } from "@/types/algorithm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureGuard } from "@/components/FeatureGuard";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";
import { trackEvent } from "@/lib/analytics";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { usePostHog } from "@posthog/react";
import { useSidebar } from "@/components/ui/sidebar";
import { isSidebarRoute } from "@/config/sidebarNav";

interface NavbarProps {
  isProblemMode?: boolean;
  algorithm?: any;
  isInterviewMode?: boolean;
  toggleInterviewMode?: () => void;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  setIsTimerRunning?: (running: boolean) => void;
  setTimerSeconds?: (seconds: number) => void;
  formatTime?: (seconds: number) => string;
  handleRandomProblem?: () => void;
  handleNextProblem?: () => void;
  handlePreviousProblem?: () => void;
  handleShare?: () => void;
  onToggleSidebar?: () => void;
  activeListType?: string;
  hideFeedback?: boolean;
  hideShare?: boolean;
  className?: string;
}

const Navbar = ({
  isProblemMode = false,
  algorithm,
  isInterviewMode = false,
  toggleInterviewMode,
  timerSeconds = 0,
  isTimerRunning = false,
  setIsTimerRunning,
  setTimerSeconds,
  formatTime,
  handleRandomProblem,
  handleNextProblem,
  handlePreviousProblem,
  handleShare,
  onToggleSidebar,
  activeListType,
  hideFeedback = false,
  hideShare = false,
  className,
}: NavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const { profile, user, hasPremiumAccess, setActiveListType } = useApp();
  const { setOpenMobile, toggleSidebar, state } = useSidebar();
  const pathname = usePathname();
  const posthog = usePostHog();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isInterviewsOpen, setIsInterviewsOpen] = useState(false);
  const [isPrepareOpen, setIsPrepareOpen] = useState(false);
  const [activePrepareTab, setActivePrepareTab] = useState<
    "dsa_practice" | "dsa_strategy" | "blogs"
  >("dsa_practice");

  const interviewsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentPath =
    pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  const isAuthPage = currentPath === "/login";
  const algorithms = useAppSelector((state) => state.algorithms.items);

  // We use a broad check to ensure we hide the global navbar on any problem-related page
  const isDsaProblemPage =
    currentPath?.includes("/problem/") ||
    currentPath?.startsWith("/dsa/") ||
    [
      "/dsa/problems",
      "/dsa/get-started",
      "/dsa/core",
      "/dsa/blind-75",
    ].includes(currentPath);

  const hasSidebar = isSidebarRoute(currentPath);

  // Hide Navbar on valid DSA and Problem pages as they have their own implementation
  // EXCEPT if we are explicitly in problem mode (passed as prop by the page itself)
  if (isDsaProblemPage && !isProblemMode) {
    return null;
  }

  const showCondensedMenu = windowWidth < 778;
  const listLabel =
    activeListType && activeListType !== "all"
      ? LIST_TYPE_LABELS[activeListType as ListType] || activeListType
      : "All Problems";

  const handleInterviewsMouseEnter = () => {
    if (interviewsTimeoutRef.current)
      clearTimeout(interviewsTimeoutRef.current);
    setIsInterviewsOpen(true);
  };

  const handleInterviewsMouseLeave = () => {
    interviewsTimeoutRef.current = setTimeout(() => {
      setIsInterviewsOpen(false);
    }, 150);
  };

  const handlePrepareMouseEnter = () => {
    if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
    setIsPrepareOpen(true);
  };

  const handlePrepareMouseLeave = () => {
    prepareTimeoutRef.current = setTimeout(() => {
      setIsPrepareOpen(false);
    }, 150);
  };

  // Close menus instantly on click
  const closeMenus = () => {
    if (interviewsTimeoutRef.current)
      clearTimeout(interviewsTimeoutRef.current);
    if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
    setIsInterviewsOpen(false);
    setIsPrepareOpen(false);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md",
        !isProblemMode && "border-b border-border/50",
        className,
      )}
    >
      <div className="w-full px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {isProblemMode ? (
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity shutter-click"
                onClick={closeMenus}
              >
                <img
                  src={typeof logo === "string" ? logo : (logo as any).src}
                  alt="RulCode Logo"
                  className="w-6 h-6"
                />
                <span className="hidden md:inline-block  font-medium ">
                  rulcode
                </span>
              </Link>
            ) : (
              <>
                {/* Desktop Sidebar Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden data-[show=true]:md:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-full"
                  data-show={hasSidebar}
                  onClick={toggleSidebar}
                >
                  {!mounted || state === "collapsed" ? (
                    <PanelLeftOpen className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </Button>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-2 hover:opacity-80 transition-opacity shutter-click",
                    hasSidebar && "md:hidden"
                  )}
                  onClick={closeMenus}
                >
                  <img
                    src={typeof logo === "string" ? logo : (logo as any).src}
                    alt="RulCode Logo"
                    className="w-6 h-6"
                  />
                  <span className="font-medium">rulcode</span>
                </Link>
              </>
            )}
          </div>

          {/* Standard Navigation Links (Desktop only) */}
          {!isProblemMode && (
            <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-6 flex-1 text-sm font-medium">
              {/* Hidden for now as per user request */}
              {false && (
                <div
                  onMouseEnter={handleInterviewsMouseEnter}
                  onMouseLeave={handleInterviewsMouseLeave}
                >
                  <DropdownMenu
                    open={isInterviewsOpen}
                    onOpenChange={setIsInterviewsOpen}
                    modal={false}
                  >
                    <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none relative font-normal shutter-click">
                      <span>Interviews</span>
                      <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[300px] p-4"
                      onMouseEnter={handleInterviewsMouseEnter}
                      onMouseLeave={handleInterviewsMouseLeave}
                      sideOffset={4}
                    >
                      <div className="text-xs text-muted-foreground mb-3 font-normal">
                        Products
                      </div>
                      <div className="flex flex-col gap-1 mb-4">
                        <Link
                          href="/"
                          className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors shutter-click"
                        >
                          <img
                            src={
                              typeof logo === "string"
                                ? logo
                                : (logo as any).src
                            }
                            alt="RulCode Logo"
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-sm">
                            rulcode{" "}
                            <span className="text-muted-foreground font-normal ml-1">
                              Interviews
                            </span>
                          </span>
                        </Link>
                        <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors cursor-not-allowed opacity-80">
                          <img
                            src={
                              typeof logo === "string"
                                ? logo
                                : (logo as any).src
                            }
                            alt="RulCode Logo"
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-sm flex items-center gap-2">
                            rulcode{" "}
                            <span className="text-muted-foreground font-normal ml-1">
                              Projects
                            </span>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-[#E5FF7F] text-black hover:bg-[#d6f555] border-transparent ml-auto text-[10px] h-5 py-0 whitespace-nowrap"
                          >
                            Coming soon
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground mb-3 font-normal">
                        Resources
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link
                          href="/blog"
                          className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors shutter-click"
                          onClick={closeMenus}
                        >
                          <MessageSquare className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-sm">Blog</span>
                        </Link>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {!hasSidebar && (
                <div className="h-4 w-[1px] bg-border/60 mx-1"></div>
              )}

              <Link
                href={
                  profile?.username
                    ? `/profile/${profile.username}`
                    : "/profile"
                }
                className="font-normal hover:text-primary transition-colors shutter-click"
                onClick={closeMenus}
              >
                Dashboard
              </Link>

              <div
                onMouseEnter={handlePrepareMouseEnter}
                onMouseLeave={handlePrepareMouseLeave}
              >
                <DropdownMenu
                  open={isPrepareOpen}
                  onOpenChange={setIsPrepareOpen}
                  modal={false}
                >
                  <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none font-normal shutter-click">
                    <span>Prepare</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[700px] p-0 flex flex-row overflow-hidden border-border mt-2 rounded-xl shadow-2xl bg-background"
                    onMouseEnter={handlePrepareMouseEnter}
                    onMouseLeave={handlePrepareMouseLeave}
                    sideOffset={4}
                  >
                    <div className="w-[240px] bg-muted/30 p-4 border-r border-border flex flex-col gap-1.5">
                      <div
                        onClick={() => setActivePrepareTab("dsa_practice")}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === "dsa_practice" ? "bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"}`}
                      >
                        DSA
                      </div>
                      <div
                        onClick={() => setActivePrepareTab("dsa_strategy")}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === "dsa_strategy" ? "bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"}`}
                      >
                        Recommended strategy
                      </div>
                      <div
                        onClick={() => setActivePrepareTab("blogs")}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === "blogs" ? "bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground" : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"}`}
                      >
                        Guides
                      </div>
                    </div>

                    <div className="flex-1 p-8 flex flex-col gap-8 bg-background overflow-y-auto max-h-[500px]">
                      {activePrepareTab === "dsa_practice" && (
                        <div className="flex flex-col gap-8">
                          <Link
                            href="/dsa/get-started"
                            className="group flex items-start gap-5 relative shutter-click"
                            onClick={() => {
                              closeMenus();
                              trackEvent(posthog, "home_cta_clicked", {
                                cta_label: "Get Started",
                                destination: "/dsa/get-started",
                                section: "navbar_prepare",
                              });
                            }}
                          >
                            <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                              <Rocket className="w-5 h-5 text-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 pr-8">
                              <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                Get Started
                              </h4>
                              <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                Master DSA with our curated roadmaps and guided
                                paths
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Guided
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Roadmap
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                          </Link>

                          <Link
                            href="/dsa/problems"
                            className="group flex items-start gap-5 relative shutter-click"
                            onClick={() => {
                              closeMenus();
                              trackEvent(posthog, "home_cta_clicked", {
                                cta_label: "All practice questions",
                                destination: "/dsa/problems",
                                section: "navbar_prepare",
                              });
                            }}
                          >
                            <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                              <Layers className="w-5 h-5 text-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 pr-8">
                              <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                All practice questions
                              </h4>
                              <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                The largest question bank of 150+ practice
                                questions for DSA interviews
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Coding
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Data Structures
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Algorithms
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                          </Link>

                          <Link
                            href="/dsa/core"
                            className="group flex items-start gap-5 relative shutter-click"
                            onClick={() => {
                              closeMenus();
                              trackEvent(posthog, "home_cta_clicked", {
                                cta_label: "Core patterns",
                                destination: "/dsa/core",
                                section: "navbar_prepare",
                              });
                            }}
                          >
                            <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                              <Target className="w-5 h-5 text-foreground group-hover:text-primary" />
                            </div>
                            <div className="flex-1 pr-8">
                              <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                Core patterns
                              </h4>
                              <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                Targeted practice in specific problem-solving
                                patterns and algorithms
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Two Pointers
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  Sliding Window
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                                >
                                  DP
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                          </Link>

                          <Link
                            href="/dsa/blind-75"
                            className="group flex items-start gap-5 relative shutter-click"
                            onClick={() => {
                              closeMenus();
                              trackEvent(posthog, "home_cta_clicked", {
                                cta_label: "Blind 75 list",
                                destination: "/dsa/blind-75",
                                section: "navbar_prepare",
                              });
                            }}
                          >
                            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors border border-primary/10 shrink-0 text-primary">
                              <Brain className="w-5 h-5" />
                            </div>
                            <div className="flex-1 pr-8">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  Blind 75 list
                                </h4>
                                <Badge
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-transparent text-[9px] hover:bg-primary/20 h-4 px-1.5 uppercase font-bold tracking-wider"
                                >
                                  Top Pick
                                </Badge>
                              </div>
                              <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                The essential 75 problems for interviews.
                                Perfect if you have less than 2 weeks to
                                prepare.
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                          </Link>
                        </div>
                      )}

                      {activePrepareTab === "dsa_strategy" && (
                        <Link
                          href="/dsa/blind-75"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                            <Code2 className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div className="flex-1 pr-8">
                            <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                              Blind 75 list
                            </h4>
                            <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                              The essential 75 problems for interviews. Perfect
                              if you have less than 2 weeks to prepare.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                              >
                                Curated
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5"
                              >
                                Time-saver
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>
                      )}

                      {activePrepareTab === "blogs" && (
                        <div className="flex flex-col gap-6">
                          <div className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                            Guides
                          </div>

                          <div className="grid grid-cols-1 gap-5">
                            {/* Time Complexity */}
                            <Link
                              href="/guides/time-complexity"
                              className="group flex items-start gap-5 relative shutter-click"
                              onClick={closeMenus}
                            >
                              <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                <Clock className="w-5 h-5 text-foreground group-hover:text-primary" />
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  Time Complexity
                                </h4>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  Big O runtime analysis and operation budgets cheat sheet.
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>

                            {/* Space Complexity */}
                            <Link
                              href="/guides/space-complexity"
                              className="group flex items-start gap-5 relative shutter-click"
                              onClick={closeMenus}
                            >
                              <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                <HardDrive className="w-5 h-5 text-foreground group-hover:text-primary" />
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  Space Complexity
                                </h4>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  Recursion stack, memory bounds, and allocations cheat sheet.
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>

                            {/* Fundamentals */}
                            <Link
                              href="/guides/fundamentals/core-data-structures"
                              className="group flex items-start gap-5 relative shutter-click"
                              onClick={closeMenus}
                            >
                              <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                <Layers className="w-5 h-5 text-foreground group-hover:text-primary" />
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  DSA Fundamentals
                                </h4>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  Core structures like Lists, Trees, Graphs, and Tries.
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>

                            {/* Patterns */}
                            <Link
                              href="/guides/patterns/arrays-hashing"
                              className="group flex items-start gap-5 relative shutter-click"
                              onClick={closeMenus}
                            >
                              <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                <Target className="w-5 h-5 text-foreground group-hover:text-primary" />
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  Coding Patterns
                                </h4>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  High-impact blueprints like Pointers and Sliding Windows.
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>

                            {/* Engineering Blogs */}
                            <Link
                              href="/blog"
                              className="group flex items-start gap-5 relative shutter-click"
                              onClick={closeMenus}
                            >
                              <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                <PenTool className="w-5 h-5 text-foreground group-hover:text-primary" />
                              </div>
                              <div className="flex-1 pr-8">
                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  Engineering Blogs
                                </h4>
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                  Deep dive tutorials and competitive programming insights.
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Problem Navigation */}
          {isProblemMode && (
            <div className="flex flex-1 justify-start lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:justify-center items-center z-10 ml-2 sm:ml-4 lg:ml-0 min-w-0 overflow-x-auto no-scrollbar">
              <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border bg-secondary/50 shrink-0">
                <button
                  onClick={onToggleSidebar}
                  className="flex items-center h-8 gap-1.5 sm:gap-2.5 px-2 sm:px-3 hover:bg-muted transition-colors group border-r border-border"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline-block text-[11px] sm:text-[13px] font-semibold text-foreground/90 group-hover:text-foreground transition-colors tracking-tight">
                    {listLabel.charAt(0).toUpperCase() +
                      listLabel.slice(1).toLowerCase()}
                  </span>
                </button>

                {/* Navigation Buttons Group */}
                <button
                  onClick={handlePreviousProblem}
                  className="flex items-center justify-center h-8 w-7 sm:w-8 hover:bg-muted transition-colors border-r border-border text-foreground/80 hover:text-foreground shrink-0"
                  title="Previous problem"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleRandomProblem}
                  className="flex items-center justify-center h-8 w-7 sm:w-8 hover:bg-muted transition-colors border-r border-border text-foreground/80 hover:text-foreground shrink-0"
                  title="Random problem"
                >
                  <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={handleNextProblem}
                  className="flex items-center justify-center h-8 w-7 sm:w-8 hover:bg-muted transition-colors text-foreground/80 hover:text-foreground shrink-0"
                  title="Next problem"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {isProblemMode ? (
              <>
                {showCondensedMenu && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MenuIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Menu</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {!hideShare && handleShare && (
                        <DropdownMenuItem onClick={handleShare}>
                          <Share2 className="mr-2 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            profile?.username
                              ? `/profile/${profile.username}`
                              : "/profile"
                          }
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Interview Mode - Hidden for now */}
                      <FeatureGuard flag="interview_mode">
                        <DropdownMenuItem onClick={toggleInterviewMode}>
                          <Monitor className="mr-2 h-4 w-4" />
                          <span>
                            {isInterviewMode
                              ? "Exit Interview Mode"
                              : "Interview Mode"}
                          </span>
                        </DropdownMenuItem>
                      </FeatureGuard>

                      {/* Timer in Dropdown */}
                      {formatTime && (
                        <div className="p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Timer className="h-4 w-4" />
                            <span className="font-mono">
                              {formatTime(timerSeconds)}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTimerRunning?.(!isTimerRunning);
                              }}
                            >
                              {isTimerRunning ? (
                                <Pause className="h-3 w-3" />
                              ) : (
                                <Play className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTimerSeconds?.(0);
                                setIsTimerRunning?.(false);
                              }}
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Desktop Actions - Button Group for Share, Timer & Bug */}
                {!showCondensedMenu && (
                  <div className="flex items-center shadow-sm rounded-md overflow-hidden border border-border/60 bg-background/50 h-8">
                    {/* Share Button */}
                    {!hideShare && handleShare && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={handleShare}
                                className="flex items-center justify-center h-8 w-8 hover:bg-muted/80 transition-colors text-foreground/80 hover:text-foreground shrink-0 outline-none"
                              >
                                <Share2 className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Share</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                    {/* Divider between Share and Timer */}
                    {!hideShare &&
                      handleShare &&
                      (!algorithm?.controls ||
                        algorithm.controls?.header?.timer !== false) &&
                      formatTime && (
                        <div className="w-px h-4 bg-border/60 shrink-0" />
                      )}

                    {/* Timer Button */}
                    {(!algorithm?.controls ||
                      algorithm.controls?.header?.timer !== false) &&
                      formatTime && (
                        <TooltipProvider>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                className={cn(
                                  "flex items-center justify-center h-8 w-8 hover:bg-muted/80 transition-colors text-foreground/80 hover:text-foreground shrink-0 outline-none",
                                  isTimerRunning && "bg-secondary/80 text-foreground font-medium"
                                )}
                                title="Timer"
                              >
                                <Timer className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-lg">
                                    {formatTime(timerSeconds)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTimerSeconds?.(0)}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1"
                                    onClick={() =>
                                      setIsTimerRunning?.(!isTimerRunning)
                                    }
                                  >
                                    {isTimerRunning ? (
                                      <Pause className="h-4 w-4 mr-2" />
                                    ) : (
                                      <Play className="h-4 w-4 mr-2" />
                                    )}
                                    {isTimerRunning ? "Pause" : "Start"}
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TooltipProvider>
                      )}

                    {/* Divider before Bug */}
                    {((!hideShare && handleShare) ||
                      ((!algorithm?.controls ||
                        algorithm.controls?.header?.timer !== false) &&
                        formatTime)) && (
                      <div className="w-px h-4 bg-border/60 shrink-0" />
                    )}

                    {/* Bug / Feedback Button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => window.open("/feedback", "_blank")}
                            className="flex items-center justify-center h-8 w-8 hover:bg-muted/80 transition-colors text-foreground/80 hover:text-foreground shrink-0 outline-none"
                          >
                            <Bug className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Feedback</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                <div className="h-4 w-px bg-border mx-1" />

                <ThemeToggle />

                {!isAuthPage && <UserMenu />}
              </>
            ) : (
              <>
                {(!user || !hasPremiumAccess) && !isAuthPage && (
                  <Link
                    href="/pricing"
                    className="text-sm font-normal hover:text-primary transition-colors hidden md:block mr-2"
                    onClick={() =>
                      trackEvent(posthog, "navbar_cta_clicked", {
                        cta_label: "Pricing",
                        destination: "/pricing",
                      })
                    }
                  >
                    Pricing
                  </Link>
                )}

                <ThemeToggle />

                {!isAuthPage && <UserMenu />}

                {/* Mobile Sidebar Trigger */}
                {hasSidebar && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden h-8 w-8 ml-1"
                    onClick={() => setOpenMobile(true)}
                  >
                    <MenuIcon className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
