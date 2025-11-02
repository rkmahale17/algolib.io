import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, LogOut, Menu as MenuIcon, MessageSquare, Trophy } from "lucide-react";
import logo from "@/assets/logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProgress(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProgress(session.user.id);
      } else {
        setCompletedCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .eq("completed", true);

    if (!error && data) {
      setCompletedCount(data.length);
    }
  };

  // Set up realtime subscription for progress updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch progress when any change occurs
          fetchProgress(user.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={logo} alt="Algo Lib Logo" className="w-8 h-8" />
              <span className="font-bold text-xl">Algo Lib</span>
            </Link>
            <a 
              href="https://neetcode.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              With Neetcode videos
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/blind75" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Blind 75
            </Link>
            <Link to="/feedback" className="text-sm font-medium hover:text-primary transition-colors">
              Feedback
            </Link>
            <a
              href="https://github.com/rkmahale17/algolib.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/blind75">Blind 75</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/feedback">Feedback</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://github.com/rkmahale17/algolib.io" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
            {user ? (
              <>
                {/* Progress indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{completedCount} / 80 completed</span>
                </div>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{user.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                {" "}
                <Button className="none">Sign In</Button>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
