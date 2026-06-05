"use client";

import { ReactNode, useRef, useState } from "react";
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
    Brain,
    ChevronDown,
    ChevronRight,
    Clock,
    Code2,
    HardDrive,
    Layers,
    MenuIcon,
    PenTool,
    Rocket,
    Target,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { useApp } from "@/contexts/AppContext";
import UserMenu from "./UserMenu";
import { GlobalDunningBanner } from "./GlobalDunningBanner";
import logo from "@/assets/logo.svg";

interface SidebarLayoutProps {
    children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const pathname = usePathname();
    const isDsaRoute = pathname?.startsWith("/dsa/");
    const { hasPremiumAccess } = useApp();
    const { setOpenMobile } = useSidebar();

    // ── Prepare dropdown state (mirrors Navbar.tsx) ──────────────────────────
    const [isPrepareOpen, setIsPrepareOpen] = useState(false);
    const [activePrepareTab, setActivePrepareTab] = useState<
        "dsa_practice" | "dsa_strategy" | "blogs"
    >("dsa_practice");
    const prepareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handlePrepareMouseEnter = () => {
        if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
        setIsPrepareOpen(true);
    };

    const handlePrepareMouseLeave = () => {
        prepareTimeoutRef.current = setTimeout(() => {
            setIsPrepareOpen(false);
        }, 150);
    };

    const closePrepare = () => {
        if (prepareTimeoutRef.current) clearTimeout(prepareTimeoutRef.current);
        setIsPrepareOpen(false);
    };
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <SidebarInset>
            <GlobalDunningBanner />
            <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6 w-full sticky top-0 z-50 overflow-x-hidden">
                {/* Left: sidebar trigger / logo */}
                <div className="flex items-center gap-3">
                    {!isDsaRoute && (
                        <SidebarTrigger className="-ml-1" />
                    )}

                    {isDsaRoute && (
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity md:hidden">
                            <img src={typeof logo === "string" ? logo : (logo as any).src} alt="RulCode Logo" className="w-5 h-5" />
                            <span className="font-bold text-base tracking-tight">rulcode</span>
                        </Link>
                    )}
                </div>

                {/* Center: Prepare dropdown (desktop only) */}
                <div className="hidden md:flex items-center">
                    <div
                        onMouseEnter={handlePrepareMouseEnter}
                        onMouseLeave={handlePrepareMouseLeave}
                    >
                        <DropdownMenu
                            open={isPrepareOpen}
                            onOpenChange={setIsPrepareOpen}
                            modal={false}
                        >
                            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none font-normal text-sm text-muted-foreground hover:text-foreground shutter-click">
                                <span>Prepare</span>
                                <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-[700px] p-0 flex flex-row overflow-hidden border-border mt-2 rounded-xl shadow-2xl bg-background"
                                onMouseEnter={handlePrepareMouseEnter}
                                onMouseLeave={handlePrepareMouseLeave}
                                sideOffset={4}
                            >
                                {/* Left tab strip */}
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

                                {/* Right content panel */}
                                <div className="flex-1 p-8 flex flex-col gap-8 bg-background overflow-y-auto max-h-[500px]">
                                    {/* ── DSA Practice ───────────────────────────────────────────── */}
                                    {activePrepareTab === "dsa_practice" && (
                                        <div className="flex flex-col gap-8">
                                            <Link
                                                href="/dsa/get-started"
                                                className="group flex items-start gap-5 relative shutter-click"
                                                onClick={closePrepare}
                                            >
                                                <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                    <Rocket className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                </div>
                                                <div className="flex-1 pr-8">
                                                    <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                        Get Started
                                                    </h4>
                                                    <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                                        Master DSA with our curated roadmaps and guided paths
                                                    </p>
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
                                                onClick={closePrepare}
                                            >
                                                <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                    <Layers className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                </div>
                                                <div className="flex-1 pr-8">
                                                    <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                        All practice questions
                                                    </h4>
                                                    <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                                        The largest question bank of 150+ practice questions for DSA interviews
                                                    </p>
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
                                                onClick={closePrepare}
                                            >
                                                <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                    <Target className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                </div>
                                                <div className="flex-1 pr-8">
                                                    <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                        Core patterns
                                                    </h4>
                                                    <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                                        Targeted practice in specific problem-solving patterns and algorithms
                                                    </p>
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
                                                onClick={closePrepare}
                                            >
                                                <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors border border-primary/10 shrink-0 text-primary">
                                                    <Brain className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 pr-8">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                            Blind 75 list
                                                        </h4>
                                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent text-[9px] hover:bg-primary/20 h-4 px-1.5 uppercase font-bold tracking-wider">
                                                            Top Pick
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                                        The essential 75 problems for interviews. Perfect if you have less than 2 weeks to prepare.
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                            </Link>
                                        </div>
                                    )}

                                    {/* ── DSA Strategy ──────────────────────────────────────────── */}
                                    {activePrepareTab === "dsa_strategy" && (
                                        <Link
                                            href="/dsa/blind-75"
                                            className="group flex items-start gap-5 relative shutter-click"
                                            onClick={closePrepare}
                                        >
                                            <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                <Code2 className="w-5 h-5 text-foreground group-hover:text-primary" />
                                            </div>
                                            <div className="flex-1 pr-8">
                                                <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">
                                                    Blind 75 list
                                                </h4>
                                                <p className="text-[13px] text-muted-foreground mb-3 leading-relaxed max-w-[320px]">
                                                    The essential 75 problems for interviews. Perfect if you have less than 2 weeks to prepare.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Curated</Badge>
                                                    <Badge variant="secondary" className="bg-muted text-[11px] font-normal hover:bg-muted/80 border-transparent px-2.5 py-0.5">Time-saver</Badge>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                        </Link>
                                    )}

                                    {/* ── Guides / Blogs ──────────────────────────────────────────── */}
                                    {activePrepareTab === "blogs" && (
                                        <div className="flex flex-col gap-6">
                                            <div className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                                                Guides
                                            </div>

                                            <div className="grid grid-cols-1 gap-5">
                                                {/* Time Complexity */}
                                                <Link href="/guides/time-complexity" className="group flex items-start gap-5 relative shutter-click" onClick={closePrepare}>
                                                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                        <Clock className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Time Complexity</h4>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Big O runtime analysis and operation budgets cheat sheet.</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                                </Link>

                                                {/* Space Complexity */}
                                                <Link href="/guides/space-complexity" className="group flex items-start gap-5 relative shutter-click" onClick={closePrepare}>
                                                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                        <HardDrive className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Space Complexity</h4>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Recursion stack, memory bounds, and allocations cheat sheet.</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                                </Link>

                                                {/* DSA Fundamentals */}
                                                <Link href="/guides/fundamentals/core-data-structures" className="group flex items-start gap-5 relative shutter-click" onClick={closePrepare}>
                                                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                        <Layers className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">DSA Fundamentals</h4>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Core structures like Lists, Trees, Graphs, and Tries.</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                                </Link>

                                                {/* Coding Patterns */}
                                                <Link href="/guides/patterns/arrays-hashing" className="group flex items-start gap-5 relative shutter-click" onClick={closePrepare}>
                                                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                        <Target className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Coding Patterns</h4>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">High-impact blueprints like Pointers and Sliding Windows.</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                                                </Link>

                                                {/* Engineering Blogs */}
                                                <Link href="/blog" className="group flex items-start gap-5 relative shutter-click" onClick={closePrepare}>
                                                    <div className="p-3 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors border border-border/50 shrink-0">
                                                        <PenTool className="w-5 h-5 text-foreground group-hover:text-primary" />
                                                    </div>
                                                    <div className="flex-1 pr-8">
                                                        <h4 className="text-[15px] font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors tracking-tight">Engineering Blogs</h4>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Deep dive tutorials and competitive programming insights.</p>
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

                {/* Right: actions */}
                <div className="flex-1 w-full flex justify-end items-center">
                    <div className="flex items-center gap-5">
                        {!isDsaRoute && (
                            <Link href="/dsa/get-started">
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground px-2">
                                    <Rocket className="w-3.5 h-3.5" />
                                    <span>Get started</span>
                                </Button>
                            </Link>
                        )}

                        {!hasPremiumAccess && (
                            <Link href="/pricing" className="text-[12px] font-normal text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                                Pricing
                            </Link>
                        )}

                        <ThemeToggle />
                        <UserMenu />

                        {isDsaRoute && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden h-8 w-8 ml-1"
                                onClick={() => setOpenMobile(true)}
                            >
                                <MenuIcon className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-[calc(100vh-48px)] min-w-0">
                {children}
            </div>
        </SidebarInset>
    );
}
