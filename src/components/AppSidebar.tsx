import * as React from "react"
import { ListTodo, BookOpen, Code2, Play, Search, Folder, MoreHorizontal, LayoutDashboard, Compass, Rocket, ChevronRight, Eye, Code, FileText, PanelLeftClose, PanelLeftOpen, Github, Linkedin, MonitorSmartphone, LogOut, Code as CodeIcon, ThumbsUp, Clock } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import logo from "@/assets/logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { useTheme } from "next-themes"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

// Defined Products Configuration
const sidebarConfig = {
    interviews: {
        title: "Interviews",
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
                hasCaret: false,
            },
            {
                title: "Practice questions",
                url: "/problems",
                icon: ListTodo,
                hasCaret: true,
                isGroup: true,
                items: [
                    {
                        title: "All practice",
                        url: "/problems",
                        icon: ListTodo,
                        description: "Browse and filter the entire coding question bank."
                    },
                    {
                        title: "Core patterns",
                        url: "/core-patterns",
                        icon: BookOpen,
                        description: "Master the essential recurring algorithm patterns."
                    },
                    {
                        title: "Blind 75",
                        url: "/blind75",
                        icon: Code,
                        description: "The curated list of top 75 must-do questions."
                    },
                ],
            },
            // {
            //     title: "Recommended strategy",
            //     url: "#",
            //     icon: ThumbsUp,
            //     hasCaret: true,
            // },
            // {
            //     title: "Time-savers",
            //     url: "#",
            //     icon: Clock,
            //     hasCaret: true,
            // },
            // {
            //     title: "Guides",
            //     url: "#",
            //     icon: BookOpen,
            //     hasCaret: true,
            // },
        ],
    }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const location = useLocation()
    const { toggleSidebar, state, isMobile } = useSidebar()
    const { theme, setTheme } = useTheme()
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        if (!supabase) return;
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) toast.error("Failed to sign out");
        else toast.success("Signed out successfully");
    };

    const isCollapsed = state === "collapsed";

    const sidebarRoutes = ['/dashboard', '/problems', '/blind75', '/core-patterns'];
    const isSidebarRoute = sidebarRoutes.some(route => location.pathname.startsWith(route));

    // On desktop, only show if it's a sidebar route
    if (!isMobile && !isSidebarRoute) {
        return null;
    }

    const currentConfig = sidebarConfig.interviews;

    return (
        <Sidebar collapsible="icon" className="border-r border-border bg-background" {...props}>
            <SidebarHeader className="p-4 border-b border-border/50 h-14 flex items-center justify-center">
                <div className="flex items-center gap-3 w-full">
                    <Link to="/" className="flex items-center gap-2 shrink-0 group-data-[collapsible=icon]:mx-auto">
                        <img src={logo} alt="RulCode Logo" className="w-5 h-5 grayscale hover:grayscale-0 transition-all" />
                        <span className="font-bold text-[15px] tracking-tight text-foreground group-data-[collapsible=icon]:hidden">rulcode</span>
                    </Link>
                    <div className="h-4 w-[1px] bg-border/80 group-data-[collapsible=icon]:hidden"></div>
                    <span className="flex items-center gap-1 text-[13px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {currentConfig.title}
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4 gap-0">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {currentConfig.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {!item.isGroup ? (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={location.pathname === item.url}
                                            tooltip={item.title}
                                            className="h-8 justify-between hover:bg-muted/50 text-[#666] data-[active=true]:text-foreground data-[active=true]:font-medium"
                                        >
                                            <Link to={item.url} className="w-full flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                                                    <span className="text-[13px] group-data-[collapsible=icon]:hidden">{item.title}</span>
                                                </div>
                                                {item.hasCaret && <ChevronRight className="w-3.5 h-3.5 opacity-50 group-data-[collapsible=icon]:hidden absolute right-2 top-1/2 -translate-y-1/2" />}
                                            </Link>
                                        </SidebarMenuButton>
                                    ) : (
                                        <div className="flex flex-col mb-2 mt-2 group relative">
                                            {isCollapsed ? (
                                                <HoverCard openDelay={100} closeDelay={100}>
                                                    <HoverCardTrigger asChild>
                                                        <SidebarMenuButton className="flex w-full items-center justify-center h-8 text-[#666] hover:bg-muted/50 rounded-md transition-colors px-2 cursor-pointer">
                                                            {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                                                        </SidebarMenuButton>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent side="right" align="start" sideOffset={15} className="w-[260px] flex flex-col rounded-xl border border-border bg-popover text-popover-foreground shadow-lg p-1.5 py-2 z-[100]">
                                                        <div className="text-xs font-semibold px-3 py-1 text-foreground border-b border-border/40 mb-1">{item.title}</div>
                                                        {item.items?.map((subItem) => (
                                                            <Link key={subItem.title} to={subItem.url} className="flex items-center justify-between gap-3 cursor-pointer rounded-md p-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group/sub">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <div className="flex items-center gap-2 text-foreground">
                                                                        {subItem.icon && <subItem.icon className="w-4 h-4 opacity-70" />}
                                                                        <span className="font-medium text-[13px]">{subItem.title}</span>
                                                                    </div>
                                                                    {subItem.description && (
                                                                        <span className="text-[11px] text-muted-foreground pl-6 leading-tight">{subItem.description}</span>
                                                                    )}
                                                                </div>
                                                                <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all" />
                                                            </Link>
                                                        ))}
                                                    </HoverCardContent>
                                                </HoverCard>
                                            ) : (
                                                <SidebarMenuButton tooltip={item.title} className="flex w-full items-center justify-between h-8 text-[#666] hover:bg-muted/50 rounded-md transition-colors px-2 relative">
                                                    <div className="flex items-center gap-2.5">
                                                        {item.icon && <item.icon className="w-4 h-4 opacity-70" />}
                                                        <span className="text-[13px] font-medium">{item.title}</span>
                                                    </div>
                                                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                                </SidebarMenuButton>
                                            )}

                                            {!isCollapsed && item.items && (
                                                <div className="flex flex-col gap-1 mt-1 pl-9">
                                                    {item.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.title}
                                                            to={subItem.url}
                                                            className={`flex items-center gap-2 text-[13px] py-1.5 px-2 rounded-md transition-colors ${location.pathname === subItem.url
                                                                ? "text-foreground font-medium bg-muted/50"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                                }`}
                                                        >
                                                            {subItem.icon && <subItem.icon className="w-3.5 h-3.5 opacity-70" />}
                                                            {subItem.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto border-t border-border/50 flex flex-col gap-4">
                {/* Promotional cards - Hidden when collapsed completely */}
                <div className="flex flex-col gap-4 group-data-[collapsible=icon]:hidden">
                    {/* Sponsored Card */}
                    <Link to="#" className="group flex items-start gap-3 rounded-lg bg-transparent transition-colors">
                        <div className="w-12 h-12 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                            <CodeIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col mt-0.5">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider mb-0.5">Sponsored</span>
                            <span className="text-xs font-medium leading-tight text-foreground group-hover:underline decoration-border underline-offset-2">
                                30% off the fastest way to learn front end skills &rarr;
                            </span>
                        </div>
                    </Link>

                    {/* 20% off Simple Card */}
                    <Link to="#" className="group flex items-start gap-3 rounded-lg overflow-hidden border border-border bg-card hover:bg-muted/50 transition-colors p-3">
                        <div className="w-12 shrink-0 flex items-center justify-center font-bold text-sm bg-transparent border-0">
                            20% off
                        </div>
                        <div className="flex flex-col mt-0.5 border-l border-border/50 pl-3">
                            <span className="text-xs font-medium leading-tight text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden text-ellipsis whitespace-normal line-clamp-2">
                                Complete simple social tasks &rarr;
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Showing a simple 20% badge instead of large cards when collapsed */}
                <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full my-2">
                    <Badge variant="outline" className="text-[9px] px-1 py-0 shadow-none border-border">20%</Badge>
                </div>

                {/* Bottom Action Row */}
                <div className="flex items-center justify-between w-full">
                    {/* Socials - hidden when collapsed */}
                    <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                        <Link to="#" className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent shadow-none hover:border-border/50 hover:shadow-sm">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link to="#" className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-transparent shadow-none hover:border-border/50 hover:shadow-sm">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="top" className="w-48">
                                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer text-xs">
                                    <MonitorSmartphone className="mr-2 h-4 w-4" />
                                    <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/pricing" className="cursor-pointer text-xs">Pricing</Link>
                                </DropdownMenuItem>
                                {user ? (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer text-xs">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign out</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/login" className="cursor-pointer text-xs">Log in</Link>
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
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:text-foreground border border-transparent hover:border-border/50 hover:shadow-sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="right" sideOffset={10} className="w-48">
                                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer text-xs">
                                    <MonitorSmartphone className="mr-2 h-4 w-4" />
                                    <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                                </DropdownMenuItem>
                                {user ? (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer text-xs">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign out</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/login" className="cursor-pointer text-xs">Log in</Link>
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
    )
}
