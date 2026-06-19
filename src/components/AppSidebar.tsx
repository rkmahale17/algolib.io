"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Github,
  LayoutDashboard,
  Linkedin,
  ListTodo,
  LogOut,
  MonitorSmartphone,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  Database,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useApp } from "@/contexts/AppContext";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { ListType } from "@/types/algorithm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.svg";
import Image from "next/image";
import { guidesData } from "@/data/guidesData";
import { cn } from "@/lib/utils";
import {
  PATTERN_IDS,
  getGuideUrl,
  DSA_ITEMS,
  DATABASE_ITEMS,
  GUIDE_GROUPS,
  isSidebarRoute,
  isGuideRoute,
} from "@/config/sidebarNav";

// ─── Subcomponents ──────────────────────────────────────────────────────────

interface SidebarLinkProps {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
}

function SidebarLink({ href, title, icon: Icon, isActive, onClick, badge }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between text-[13px] py-1.5 px-3 rounded-xl transition-all duration-300 relative border border-transparent font-medium",
        isActive
          ? "text-foreground bg-muted/50 shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon
          className={cn(
            "w-3.5 h-3.5 opacity-60 shrink-0 group-hover:scale-110 group-hover:rotate-6 group-hover:text-foreground transition-all duration-300",
            isActive && "text-foreground opacity-100"
          )}
        />
        <span className="truncate">{title}</span>
      </div>
      {badge}
    </Link>
  );
}

interface SidebarCollapsibleProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SidebarCollapsible({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}: SidebarCollapsibleProps) {
  return (
    <div className="flex flex-col mb-1 group relative select-none">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between h-8 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors px-2 relative text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 opacity-70 shrink-0" />
          <span className="text-[13px] font-medium text-foreground/80">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 opacity-50 transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )}
        />
      </button>
      {isExpanded && <div className="flex flex-col gap-1 mt-1 pl-3">{children}</div>}
    </div>
  );
}

interface SidebarHoverCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  children: React.ReactNode;
}

function SidebarHoverCard({ title, icon: Icon, isActive, children }: SidebarHoverCardProps) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <SidebarMenuButton
          className={cn(
            "flex w-full items-center justify-center h-8 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors px-2 cursor-pointer",
            isActive && "bg-muted/50 text-foreground"
          )}
        >
          <Icon className="w-4 h-4 opacity-70" />
        </SidebarMenuButton>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={15}
        className="w-[280px] flex flex-col rounded-xl border border-border bg-popover text-popover-foreground shadow-lg p-1.5 py-2 z-[100] max-h-[400px] overflow-y-auto"
      >
        <div className="text-xs font-semibold px-3 py-1 text-foreground border-b border-border/40 mb-1 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          {title}
        </div>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

interface SidebarLinkHoverCardProps {
  href: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarLinkHoverCard({
  href,
  title,
  icon: Icon,
  isActive,
  onClick,
}: SidebarLinkHoverCardProps) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <SidebarMenuButton
          asChild
          className={cn(
            "flex w-full items-center justify-center h-8 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors px-2 cursor-pointer",
            isActive && "bg-muted/50 text-foreground"
          )}
        >
          <Link href={href} onClick={onClick}>
            <Icon className="w-4 h-4 opacity-70" />
          </Link>
        </SidebarMenuButton>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="center"
        sideOffset={15}
        className="w-[120px] flex flex-col rounded-xl border border-border bg-popover text-popover-foreground shadow-lg p-2 z-[100]"
      >
        <div className="text-xs font-semibold text-center text-foreground">{title}</div>
      </HoverCardContent>
    </HoverCard>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, hasPremiumAccess } = useApp();
  const { data: algorithmsData } = useAlgorithms();

  const isCollapsed = state === "collapsed" && !isMobile;
  const isGuides = isGuideRoute(pathname);
  const isVisualLibrary = pathname?.startsWith("/dsa/visual-library");
  const isPractice = pathname?.startsWith("/dsa") && !isVisualLibrary;
  const isDatabase = pathname?.startsWith("/database");
  const isDashboard = pathname?.startsWith("/dashboard");
  const isProfile = pathname?.startsWith("/profile");

  const coreAlgorithms = React.useMemo(() => {
    if (!algorithmsData?.algorithms) return [];
    return algorithmsData.algorithms
      .filter((a) => a.problemType === "dsa" && a.published !== false && (a.listTypes?.includes(ListType.Core) || a.list_type === "core"))
      .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0))
      .map((algo, index) => {
        const isPro = index >= 10;
        return {
          ...algo,
          is_premium: isPro,
          is_pro: isPro,
          metadata: {
            ...(algo.metadata || {}),
            is_pro: isPro
          }
        };
      });
  }, [algorithmsData]);

  const headerSubtitle = isGuides ? "Guides" : isVisualLibrary ? "Visual" : isPractice ? "DSA" : isDatabase ? "Database" : isDashboard ? "Dashboard" : isProfile ? "Profile" : "Dashboard";

  // Independent accordion states
  const [isPracticeExpanded, setIsPracticeExpanded] = React.useState(isPractice);
  const [isDatabaseExpanded, setIsDatabaseExpanded] = React.useState(isDatabase);
  const [isVisualExpanded, setIsVisualExpanded] = React.useState(isVisualLibrary);
  const [isGuidesExpanded, setIsGuidesExpanded] = React.useState(isGuides);

  // Sync expanded state with route
  React.useEffect(() => {
    if (isGuides) setIsGuidesExpanded(true);
    if (isVisualLibrary) setIsVisualExpanded(true);
    if (isPractice) setIsPracticeExpanded(true);
    if (isDatabase) setIsDatabaseExpanded(true);
  }, [pathname, isGuides, isVisualLibrary, isPractice, isDatabase]);
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {
      "time-complexity": false,
      "space-complexity": false,
      fundamentals: false,
      patterns: false,
    };
    if (pathname?.startsWith("/guides/")) {
      const slugParts = pathname.replace("/guides/", "").split("/");
      const slug = slugParts[slugParts.length - 1];
      const fundamentalsCat = guidesData.find((c) => c.id === "fundamentals");
      if (fundamentalsCat?.guides.some((g) => g.slug === slug)) state.fundamentals = true;
      const patternGuides = guidesData
        .filter((c) => (PATTERN_IDS as readonly string[]).includes(c.id))
        .flatMap((c) => c.guides);
      if (patternGuides.some((g) => g.slug === slug)) state.patterns = true;
    }
    return state;
  });

  // Keep expanded categories in sync with pathname changes (e.g. prev/next navigation)
  React.useEffect(() => {
    if (!pathname?.startsWith("/guides/")) return;
    const slugParts = pathname.replace("/guides/", "").split("/");
    const slug = slugParts[slugParts.length - 1];

    setExpandedCategories((prev) => {
      const isFundamentals = guidesData
        .find((c) => c.id === "fundamentals")
        ?.guides.some((g) => g.slug === slug);
      const patternGuides = guidesData
        .filter((c) => (PATTERN_IDS as readonly string[]).includes(c.id))
        .flatMap((c) => c.guides);
      const isPattern = patternGuides.some((g) => g.slug === slug);

      if (isFundamentals && !prev.fundamentals) {
        return { ...prev, fundamentals: true };
      }
      if (isPattern && !prev.patterns) {
        return { ...prev, patterns: true };
      }
      return prev;
    });
  }, [pathname]);

  const closeMobileNav = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Failed to sign out");
    else {
      toast.success("Signed out successfully");
      router.refresh();
      router.push("/");
    }
  };

  // On desktop, only show if it's a sidebar route
  if (!isMobile && !isSidebarRoute(pathname)) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background" {...props}>
      <SidebarHeader className="p-4 border-b border-border/50 h-12 flex items-center justify-center">
        <div className="flex items-center gap-3 w-full">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group-data-[collapsible=icon]:mx-auto"
          >
            <Image
              src={typeof logo === "string" ? logo : (logo as any).src}
              alt="RulCode Logo"
              width={24}
              height={24}
              className="w-6 h-6 transition-all"
              unoptimized
            />
            <span className="font-medium group-data-[collapsible=icon]:hidden">rulcode</span>
          </Link>
          <div className="h-4 w-[1px] bg-border/80 group-data-[collapsible=icon]:hidden"></div>
          <span className="flex items-center gap-1 text-[13px] text-muted-foreground group-data-[collapsible=icon]:hidden">
            {headerSubtitle}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 gap-0 overflow-y-auto">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                {isCollapsed ? (
                  <div className="flex flex-col gap-2 items-center">
                    <SidebarLinkHoverCard
                      href="/dashboard"
                      title="Dashboard"
                      icon={LayoutDashboard}
                      isActive={pathname === "/dashboard"}
                      onClick={closeMobileNav}
                    />
                    <SidebarHoverCard
                      title="DSA"
                      icon={ListTodo}
                      isActive={isPractice}
                    >
                      {DSA_ITEMS.map((item) => (
                        <SidebarLink
                          key={item.id}
                          href={item.url}
                          title={item.title}
                          icon={item.icon}
                          isActive={pathname === item.url || (pathname === '/dsa/problems' && item.url === '/dsa/get-started')}
                          onClick={closeMobileNav}
                        />
                      ))}
                    </SidebarHoverCard>

                    <SidebarHoverCard
                      title="Database"
                      icon={Database}
                      isActive={isDatabase}
                    >
                      {DATABASE_ITEMS.map((item) => (
                        <SidebarLink
                          key={item.id}
                          href={item.url}
                          title={item.title}
                          icon={item.icon}
                          isActive={pathname === item.url}
                          onClick={closeMobileNav}
                        />
                      ))}
                    </SidebarHoverCard>
                    
                    {isVisualLibrary ? (
                      <SidebarHoverCard
                        title="Visual Library"
                        icon={Target}
                        isActive={isVisualLibrary}
                      >
                        {coreAlgorithms.map((algo) => (
                          <SidebarLink
                            key={algo.id}
                            href={`/dsa/visual-library?problem=${algo.slug || algo.id}`}
                            title={algo.name}
                            icon={FileText}
                            isActive={searchParams.get("problem") === (algo.slug || algo.id)}
                            onClick={closeMobileNav}
                            badge={(algo.is_pro || algo.is_premium) && (
                              <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                PRO
                              </span>
                            )}
                          />
                        ))}
                      </SidebarHoverCard>
                    ) : (
                      <SidebarLinkHoverCard
                        href="/dsa/visual-library"
                        title="Visual Library"
                        icon={Target}
                        isActive={isVisualLibrary}
                        onClick={closeMobileNav}
                      />
                    )}

                    <SidebarHoverCard
                      title="Guidebook"
                      icon={BookOpen}
                      isActive={isGuides}
                    >
                      {GUIDE_GROUPS.map((group) => {
                        if (group.isSingleLink) {
                          const url = group.id === "time-complexity" ? "/guides/time-complexity" : "/guides/space-complexity";
                          return (
                            <SidebarLink
                              key={group.id}
                              href={url}
                              title={group.title}
                              icon={group.icon}
                              isActive={pathname === url}
                              onClick={closeMobileNav}
                            />
                          );
                        }
                        return (
                          <div key={group.id} className="mt-2 px-1">
                            <div className="text-[11px] font-semibold text-muted-foreground px-2 py-0.5 flex items-center gap-1.5 uppercase tracking-wider">
                              <group.icon className="w-3 h-3 opacity-60" />
                              {group.title}
                            </div>
                            <div className="flex flex-col gap-1 mt-1 pl-1">
                              {group.guides.map((guide) => {
                                const url = getGuideUrl(group.id, guide.slug);
                                return (
                                  <SidebarLink
                                    key={guide.slug}
                                    href={url}
                                    title={guide.title}
                                    icon={FileText}
                                    isActive={pathname === url}
                                    onClick={closeMobileNav}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </SidebarHoverCard>
                  </div>
                ) : (
                  /* Expanded state */
                  <div className="flex flex-col gap-4 select-none animate-fadeIn">
                    {isGuides ? (
                      <>
                        {/* Guides items at the root level */}
                        {GUIDE_GROUPS.map((group) => {
                          if (group.isSingleLink) {
                            const url = group.id === "time-complexity" ? "/guides/time-complexity" : "/guides/space-complexity";
                            return (
                              <SidebarLink
                                key={group.id}
                                href={url}
                                title={group.title}
                                icon={group.icon}
                                isActive={pathname === url}
                                onClick={closeMobileNav}
                              />
                            );
                          }
                          const isExpanded = !!expandedCategories[group.id];
                          return (
                            <SidebarCollapsible
                              key={group.id}
                              title={group.title}
                              icon={group.icon}
                              isExpanded={isExpanded}
                              onToggle={() =>
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [group.id]: !prev[group.id],
                                }))
                              }
                            >
                              {group.guides.map((guide) => {
                                const url = getGuideUrl(group.id, guide.slug);
                                return (
                                  <SidebarLink
                                    key={guide.slug}
                                    href={url}
                                    title={guide.title}
                                    icon={FileText}
                                    isActive={pathname === url}
                                    onClick={closeMobileNav}
                                  />
                                );
                              })}
                            </SidebarCollapsible>
                          );
                        })}

                        {/* Border separator */}
                        <div className="h-px bg-border my-2 mx-2 opacity-50" />

                        <SidebarLink
                          href="/dashboard"
                          title="Dashboard"
                          icon={LayoutDashboard}
                          isActive={false}
                          onClick={closeMobileNav}
                        />

                        <SidebarLink
                          href="/dsa/visual-library"
                          title="Visual Library"
                          icon={Target}
                          isActive={false}
                          onClick={closeMobileNav}
                        />

                        <SidebarLink
                          href="/dsa/problems"
                          title="DSA"
                          icon={ListTodo}
                          isActive={false}
                          onClick={closeMobileNav}
                        />

                        <SidebarLink
                          href="/database/sql-basics"
                          title="Database"
                          icon={Database}
                          isActive={false}
                          onClick={closeMobileNav}
                        />
                      </>
                    ) : (
                      <>
                        <SidebarLink
                          href="/dashboard"
                          title="Dashboard"
                          icon={LayoutDashboard}
                          isActive={pathname === "/dashboard"}
                          onClick={closeMobileNav}
                        />

                        {isVisualLibrary ? (
                          <SidebarCollapsible
                            title="Visual Library"
                            icon={Target}
                            isExpanded={isVisualExpanded}
                            onToggle={() => setIsVisualExpanded(!isVisualExpanded)}
                          >
                            {coreAlgorithms.map((algo) => (
                              <SidebarLink
                                key={algo.id}
                                href={`/dsa/visual-library?problem=${algo.slug || algo.id}`}
                                title={algo.name}
                                icon={FileText}
                                isActive={searchParams.get("problem") === (algo.slug || algo.id)}
                                onClick={closeMobileNav}
                                badge={(algo.is_pro || algo.is_premium) && (
                                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                    PRO
                                  </span>
                                )}
                              />
                            ))}
                          </SidebarCollapsible>
                        ) : (
                          <SidebarLink
                            href="/dsa/visual-library"
                            title="Visual Library"
                            icon={Target}
                            isActive={false}
                            onClick={closeMobileNav}
                          />
                        )}

                        <SidebarCollapsible
                          title="DSA"
                          icon={ListTodo}
                          isExpanded={isPracticeExpanded}
                          onToggle={() => setIsPracticeExpanded(!isPracticeExpanded)}
                        >
                          {DSA_ITEMS.map((item) => (
                            <SidebarLink
                              key={item.id}
                              href={item.url}
                              title={item.title}
                              icon={item.icon}
                              isActive={pathname === item.url || (pathname === '/dsa/problems' && item.url === '/dsa/get-started')}
                              onClick={closeMobileNav}
                            />
                          ))}
                        </SidebarCollapsible>

                        <SidebarCollapsible
                          title="Database"
                          icon={Database}
                          isExpanded={isDatabaseExpanded}
                          onToggle={() => setIsDatabaseExpanded(!isDatabaseExpanded)}
                        >
                          {DATABASE_ITEMS.map((item) => (
                            <SidebarLink
                              key={item.id}
                              href={item.url}
                              title={item.title}
                              icon={item.icon}
                              isActive={pathname === item.url}
                              onClick={closeMobileNav}
                            />
                          ))}
                        </SidebarCollapsible>

                        <SidebarCollapsible
                          title="Guidebook"
                          icon={BookOpen}
                          isExpanded={isGuidesExpanded}
                          onToggle={() => setIsGuidesExpanded(!isGuidesExpanded)}
                        >
                          {GUIDE_GROUPS.map((group) => {
                            let url = "";
                            if (group.id === "time-complexity") url = "/guides/time-complexity";
                            else if (group.id === "space-complexity") url = "/guides/space-complexity";
                            else if (group.guides.length > 0) {
                              url = getGuideUrl(group.id, group.guides[0].slug);
                            } else {
                              url = "/guides";
                            }

                            return (
                              <SidebarLink
                                key={group.id}
                                href={url}
                                title={group.title}
                                icon={group.icon}
                                isActive={false}
                                onClick={closeMobileNav}
                              />
                            );
                          })}
                        </SidebarCollapsible>
                      </>
                    )}
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-border/50 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full">
          {/* Socials - hidden when collapsed */}
          <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <Link
              href="#"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent shadow-none hover:border-border/50 hover:shadow-sm"
            >
              <Github className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent shadow-none hover:border-border/50 hover:shadow-sm"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-48">
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer text-xs"
                >
                  <MonitorSmartphone className="mr-2 h-4 w-4" />
                  <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!hasPremiumAccess && (
                  <DropdownMenuItem asChild>
                    <Link href="/pricing" className="cursor-pointer text-xs">
                      Pricing
                    </Link>
                  </DropdownMenuItem>
                )}
                {user ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer text-xs"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer text-xs">
                        Log in
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Standalone More Menu specifically for collapsed state, since the one above is hidden */}
          <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center gap-2 w-full justify-center text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-full hover:text-foreground border border-transparent hover:border-border/50 hover:shadow-sm bg-muted/30"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 ml-0.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:text-foreground border border-transparent hover:border-border/50 hover:shadow-sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" sideOffset={10} className="w-48">
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer text-xs"
                >
                  <MonitorSmartphone className="mr-2 h-4 w-4" />
                  <span>Theme: {theme === "dark" ? "Dark" : "Light"}</span>
                </DropdownMenuItem>
                {user ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive cursor-pointer text-xs dark:text-foreground"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer text-xs">
                        Log in
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Expand/Collapse Toggle Button */}
          <div className="hidden md:flex ml-auto group-data-[collapsible=icon]:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50 hover:shadow-sm"
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
