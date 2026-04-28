"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Github,
  Menu as MenuIcon,
  MessageSquare,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronRight,
  Languages,
  PenTool,
  CreditCard,
  BookOpen,
  Code2,
  ListTodo,
  Rocket,
  Layers,
  Target,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.svg";

import { useApp } from "@/contexts/AppContext";
import { Badge } from "./ui/badge";
import { useSidebar } from "@/components/ui/sidebar";

import UserMenu from "./UserMenu";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { profile, user, hasPremiumAccess } = useApp();
  const { setOpenMobile, toggleSidebar, state } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isInterviewsOpen, setIsInterviewsOpen] = useState(false);
  const [isPrepareOpen, setIsPrepareOpen] = useState(false);
  const [activePrepareTab, setActivePrepareTab] = useState<'dsa_practice' | 'dsa_strategy' | 'blogs'>('dsa_practice');

  const interviewsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthPage = pathname === "/login";

  // Hide Navbar on DSA and Problem pages as they have their own implementation
  if (pathname?.startsWith('/dsa/') || pathname?.startsWith('/problem/')) {
    return null;
  }

  const handleInterviewsMouseEnter = () => {
    if (interviewsTimeoutRef.current) clearTimeout(interviewsTimeoutRef.current);
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
    if (interviewsTimeoutRef.current) clearTimeout(interviewsTimeoutRef.current);
    if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
    setIsInterviewsOpen(false);
    setIsPrepareOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden data-[show=true]:md:flex h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-full"
              data-show={pathname?.startsWith('/dsa/') || pathname?.startsWith('/problems') || pathname?.startsWith('/dashboard')}
              onClick={toggleSidebar}
            >
              {(!mounted || state === "collapsed") ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shutter-click"
              onClick={closeMenus}
            >
              <img src={typeof logo === 'string' ? logo : (logo as any).src} alt="RulCode Logo" className="w-6 h-6" />
              <span className="font-bold text-lg tracking-tight">rulcode</span>
            </Link>
          </div>

          {/* Desktop/Tablet Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-6 flex-1 text-sm font-medium">
            <div
              onMouseEnter={handleInterviewsMouseEnter}
              onMouseLeave={handleInterviewsMouseLeave}
            >
              <DropdownMenu open={isInterviewsOpen} onOpenChange={setIsInterviewsOpen} modal={false}>
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
                  <div className="text-xs text-muted-foreground mb-3 font-normal">Products</div>
                  <div className="flex flex-col gap-1 mb-4">
                    <Link
                      href="/"
                      className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors shutter-click"
                    >
                      <img src={typeof logo === 'string' ? logo : (logo as any).src} alt="RulCode Logo" className="w-5 h-5" />
                      <span className="font-medium text-sm">Rulcode <span className="text-muted-foreground font-normal ml-1">Interviews</span></span>
                    </Link>
                    <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors cursor-not-allowed opacity-80">
                      <img src={typeof logo === 'string' ? logo : (logo as any).src} alt="RulCode Logo" className="w-5 h-5" />
                      <span className="font-medium text-sm flex items-center gap-2">Rulcode <span className="text-muted-foreground font-normal ml-1">Projects</span><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div></span>
                      <Badge variant="secondary" className="bg-[#E5FF7F] text-black hover:bg-[#d6f555] border-transparent ml-auto text-[10px] h-5 py-0 whitespace-nowrap">Coming soon</Badge>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3 font-normal">Resources</div>
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

            <div className="h-4 w-[1px] bg-border/60 mx-1"></div>

            <Link
              href={profile?.username ? `/profile/${profile.username}` : "/profile"}
              className="font-normal hover:text-primary transition-colors shutter-click"
              onClick={closeMenus}
            >
              Dashboard
            </Link>

            <div
              onMouseEnter={handlePrepareMouseEnter}
              onMouseLeave={handlePrepareMouseLeave}
            >
              <DropdownMenu open={isPrepareOpen} onOpenChange={setIsPrepareOpen} modal={false}>
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
                  {/* Left Side Menu - Grey Background */}
                  <div className="w-[240px] bg-muted/30 p-4 border-r border-border flex flex-col gap-1.5">
                    <div
                      onClick={() => setActivePrepareTab('dsa_practice')}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === 'dsa_practice' ? 'bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'}`}
                    >
                      DSA
                    </div>
                    <div
                      onClick={() => setActivePrepareTab('dsa_strategy')}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === 'dsa_strategy' ? 'bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'}`}
                    >
                      Recommended strategy
                    </div>
                    <div
                      onClick={() => setActivePrepareTab('blogs')}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 shutter-click ${activePrepareTab === 'blogs' ? 'bg-background shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] text-foreground' : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground'}`}
                    >
                      Guides
                    </div>
                  </div>

                  {/* Right Side Content - White Background */}
                  <div className="flex-1 p-8 flex flex-col gap-8 bg-background overflow-y-auto max-h-[500px]">
                    {activePrepareTab === 'dsa_practice' && (
                      <div className="flex flex-col gap-8">
                        <Link
                          href="/dsa/get-started"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                            <Rocket className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div className="flex-1 pr-8">
                            <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Get Started</h4>
                            <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">Master DSA with our curated roadmaps and guided paths</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Guided</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Roadmap</Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>

                        <Link
                          href="/dsa/problems"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                            <Layers className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div className="flex-1 pr-8">
                            <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">All practice questions</h4>
                            <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">The largest question bank of 150+ practice questions for DSA interviews</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Coding</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Data Structures</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Algorithms</Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>

                        <Link
                          href="/dsa/core"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                            <Target className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div className="flex-1 pr-8">
                            <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Core patterns</h4>
                            <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">Targeted practice in specific problem-solving patterns and algorithms</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Two Pointers</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Sliding Window</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">DP</Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>

                        <Link
                          href="/dsa/blind-75"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors border border-primary/10 shrink-0 text-primary">
                            <Brain className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pr-8">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">Blind 75 list</h4>
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent text-[9px] hover:bg-primary/20 h-4 px-1.5 uppercase font-bold tracking-wider">Top Pick</Badge>
                            </div>
                            <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">The essential 75 problems for interviews. Perfect if you have less than 2 weeks to prepare.</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>
                      </div>
                    )}

                    {activePrepareTab === 'dsa_strategy' && (
                      <Link
                        href="/dsa/blind-75"
                        className="group flex items-start gap-5 relative shutter-click"
                        onClick={closeMenus}
                      >
                        <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                          <Code2 className="w-5 h-5 text-foreground group-hover:text-primary" />
                        </div>
                        <div className="flex-1 pr-8">
                          <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Blind 75 list</h4>
                          <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">The essential 75 problems for interviews. Perfect if you have less than 2 weeks to prepare.</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Curated</Badge>
                            <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Time-saver</Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </Link>
                    )}

                    {activePrepareTab === 'blogs' && (
                      <div className="flex flex-col gap-8">
                        <div className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Guides</div>

                        <Link
                          href="/blog"
                          className="group flex items-start gap-5 relative shutter-click"
                          onClick={closeMenus}
                        >
                          <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                            <PenTool className="w-5 h-5 text-foreground group-hover:text-primary" />
                          </div>
                          <div className="flex-1 pr-8">
                            <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Engineering Blogs</h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Guides</Badge>
                              <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Insights</Badge>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {(!user || !hasPremiumAccess) && !isAuthPage && (
              <Link href="/pricing" className="text-sm font-normal hover:text-primary transition-colors hidden md:block mr-2">
                Pricing
              </Link>
            )}

            <ThemeToggle />

            {!isAuthPage && <UserMenu />}

            {/* Mobile Sidebar Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 ml-1"
              onClick={() => setOpenMobile(true)}
            >
              <MenuIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

