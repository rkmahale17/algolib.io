import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  LogOut,
  Menu as MenuIcon,
  MessageSquare,
  ShieldCheck,
  User,
  Crown,
  ChevronDown,
  Languages,
  PenTool,
  Map,
  BookOpen,
  Code2,
  ListTodo,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.svg";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeatureGuard } from "./FeatureGuard";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "./ui/badge";
import { useSidebar } from "./ui/sidebar";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const { profile } = useApp();
  const { setOpenMobile } = useSidebar();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";
  const adminId = import.meta.env.VITE_ADMIN_USER_ID;

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!supabase) {
      toast.error("Authentication not available");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const isAdmin = user && adminId && user.id === adminId;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="w-full px-4 md:px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="RulCode Logo" className="w-6 h-6" />
              <span className="font-bold text-lg tracking-tight">rulcode</span>
            </Link>
          </div>

          {/* Desktop/Tablet Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-6 flex-1 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none relative font-normal">
                <span className="hidden lg:inline">Interviews</span>
                <Languages className="w-4 h-4 lg:hidden" />
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] p-4">
                <div className="text-xs text-muted-foreground mb-3 font-normal">Products</div>
                <div className="flex flex-col gap-1 mb-4">
                  <Link to="/" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                    <img src={logo} alt="RulCode Logo" className="w-5 h-5" />
                    <span className="font-medium text-sm">Rulcode <span className="text-muted-foreground font-normal ml-1">Interviews</span></span>
                  </Link>
                  <div className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors cursor-not-allowed opacity-80">
                    <img src={logo} alt="RulCode Logo" className="w-5 h-5" />
                    <span className="font-medium text-sm flex items-center gap-2">Rulcode <span className="text-muted-foreground font-normal ml-1">Projects</span><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div></span>
                    <Badge variant="secondary" className="bg-[#E5FF7F] text-black hover:bg-[#d6f555] border-transparent ml-auto text-[10px] h-5 py-0 whitespace-nowrap">Coming soon</Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3 font-normal">Others</div>
                <div className="flex flex-col gap-1">
                  <Link to="/blog" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                    <PenTool className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-normal">Blog</span>
                  </Link>
                  <Link to="/roadmap" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors">
                    <Map className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-normal">Roadmap</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors text-emerald-500">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-sm font-normal">Admin</span>
                    </Link>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-[1px] bg-border/60 mx-1"></div>

            <Link to="/dashboard" className="font-normal hover:text-primary transition-colors">
              Dashboard
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none font-normal">
                <span className="hidden lg:inline">Prepare</span>
                <PenTool className="w-4 h-4 lg:hidden" />
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[650px] p-0 flex flex-row overflow-hidden border-border mt-2 rounded-xl">
                {/* Left Side Menu */}
                <div className="w-[220px] bg-muted/20 p-4 border-r border-border flex flex-col gap-2">
                  <div className="p-2.5 bg-background rounded-md text-sm font-medium shadow-sm">
                    Practice questions
                  </div>
                  <div className="p-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-normal">
                    Recommended strategy
                  </div>
                  <div className="p-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-normal">
                    Time-savers
                  </div>
                  <div className="p-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors font-normal">
                    Guides
                  </div>
                </div>
                {/* Right Side Content */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                  <Link to="/problems" className="group flex items-start gap-4">
                    <div className="p-2.5 bg-muted rounded-md group-hover:bg-primary/10 transition-colors border border-border">
                      <ListTodo className="w-5 h-5 text-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">All practice questions</h4>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">The largest question bank of 500+ practice questions for front end interviews</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Coding</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">System design</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Quiz</Badge>
                      </div>
                    </div>
                  </Link>

                  <Link to="/core-patterns" className="group flex items-start gap-4">
                    <div className="p-2.5 bg-muted rounded-md group-hover:bg-primary/10 transition-colors border border-border">
                      <BookOpen className="w-5 h-5 text-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Core patterns</h4>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">Targeted practice in specific problem-solving patterns and algorithms</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Two Pointers</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Sliding Window</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">DP</Badge>
                      </div>
                    </div>
                  </Link>

                  <Link to="/blind75" className="group flex items-start gap-4">
                    <div className="p-2.5 bg-muted rounded-md group-hover:bg-primary/10 transition-colors border border-border">
                      <Code2 className="w-5 h-5 text-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Blind 75 list</h4>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">Targeted practice in the most famous 75 problem set curated for interviews</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Algorithms</Badge>
                        <Badge variant="secondary" className="bg-muted/50 text-[10px] font-normal hover:bg-muted border-transparent">Data Structures</Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Link to="/pricing" className="text-sm font-normal hover:text-primary transition-colors hidden md:block mr-2">
              Pricing
            </Link>

            <ThemeToggle />

            {user && !isAuthPage && (
              <div className="ml-1">
                {profile?.subscription_status === 'active' && (
                  <div className="hidden md:flex items-center gap-2 mr-2">
                    <Badge variant="outline" className="text-[10px] font-normal py-0 h-5 gap-1 border-amber-500/20 bg-amber-500/5 text-amber-600">
                      <Crown className="w-3 h-3" />
                      PREMIUM
                    </Badge>
                  </div>
                )}

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
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
                    <FeatureGuard flag="profiles">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </FeatureGuard>
                    <DropdownMenuItem asChild>
                      <Link to="/feedback">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Feedback</span>
                      </Link>
                    </DropdownMenuItem>

                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Sidebar Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 ml-1"
              onClick={() => setOpenMobile(true)}
            >
              <MenuIcon className="w-4 h-4" />
            </Button>

            <Link to="/pricing" className="hidden md:block ml-1">
              <Button className="h-8 px-4 rounded-full bg-[#E5FF7F] text-black hover:bg-[#d6f555] font-medium border border-transparent shadow-[0_2px_10px_0_rgba(229,255,127,0.3)] text-xs">
                Get full access
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
