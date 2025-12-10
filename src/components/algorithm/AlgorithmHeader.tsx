import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Shuffle,
  Menu,
  Share2,
  Bug,
  Monitor,
  Timer,
  Pause,
  Play,
  RotateCcw,
  MessageSquare,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeatureGuard } from "@/components/FeatureGuard";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.svg";

interface AlgorithmHeaderProps {
  user: any;
  algorithm: any;
  isMobile: boolean;
  windowWidth: number;
  
  // Timer / Interview
  isInterviewMode: boolean;
  toggleInterviewMode: () => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  formatTime: (seconds: number) => string;

  // Actions
  handleRandomProblem: () => void;
  handleNextProblem: () => void;
  handleShare: () => void;
  handleSignOut: () => void;
}

export const AlgorithmHeader: React.FC<AlgorithmHeaderProps> = ({
  user,
  algorithm,
  isMobile,
  windowWidth,
  isInterviewMode,
  toggleInterviewMode,
  timerSeconds,
  isTimerRunning,
  setIsTimerRunning,
  setTimerSeconds,
  formatTime,
  handleRandomProblem,
  handleNextProblem,
  handleShare,
  handleSignOut,
}) => {
  const showCondensedMenu = windowWidth < 778;

  return (
    <div className="h-12 border-b flex items-center px-4 gap-4 shrink-0 bg-background/95">
      {/* Left Side: Logo + Navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Algo Lib Logo" className="w-8 h-8" />
          <span className="text-xl">Algo Lib</span>
        </Link>
        
        <div className="h-4 w-px bg-border" />
        
        {/* Desktop Navigation - Show only if NOT condensed menu */}
        {!showCondensedMenu && (
          <TooltipProvider>
            {(!algorithm?.controls || algorithm.controls?.header?.random_problem !== false) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRandomProblem} className="h-8 w-8">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Random Problem</TooltipContent>
              </Tooltip>
            )}

            {(!algorithm?.controls || algorithm.controls?.header?.next_problem !== false) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleNextProblem} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next Problem</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        )}
      </div>

      {/* Right Side: Share, Bug, Timer, Interview, Theme, Profile */}
      <div className="ml-auto flex items-center gap-2">
          
          {/* Condensed Menu (Tablet/Mobile < 778px) */}
          {showCondensedMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNextProblem}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  <span>Next Problem</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleRandomProblem}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  <span>Random Problem</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("/feedback", "_blank")}>
                  <Bug className="mr-2 h-4 w-4" />
                  <span>Report Issue</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <FeatureGuard flag="interview_mode">
                  <DropdownMenuItem onClick={toggleInterviewMode}>
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>{isInterviewMode ? "Exit Interview Mode" : "Interview Mode"}</span>
                  </DropdownMenuItem>
                </FeatureGuard>
                
                {/* Timer in Dropdown */}
                <div className="p-2 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4" />
                      <span className="font-mono">{formatTime(timerSeconds)}</span>
                   </div>
                   <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setIsTimerRunning(!isTimerRunning); }}>
                        {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setTimerSeconds(0); setIsTimerRunning(false); }}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                   </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Desktop Actions - Show only if NOT condensed menu */}
          {!showCondensedMenu && (!algorithm?.controls || algorithm.controls?.social?.share !== false) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Share</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {!showCondensedMenu && (!algorithm?.controls || algorithm.controls?.header?.bug_report !== false) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open("/feedback", "_blank")}>
                    <Bug className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Report Issue</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        {!showCondensedMenu && (!algorithm?.controls || algorithm.controls?.header?.timer !== false) && (
          <TooltipProvider>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={isTimerRunning ? "secondary" : "ghost"} 
                  size="sm" 
                  className="gap-2 font-mono h-8 text-xs"
                >
                  <Timer className="h-4 w-4" />
                  {formatTime(timerSeconds)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">{formatTime(timerSeconds)}</span>
                    <Button variant="ghost" size="icon" onClick={() => setTimerSeconds(0)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => setIsTimerRunning(!isTimerRunning)}>
                      {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isTimerRunning ? "Pause" : "Start"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </TooltipProvider>
        )}

        {/* Interview Mode - Show only if NOT condensed menu */}
        {!showCondensedMenu && (!algorithm?.controls || algorithm.controls?.header?.interview_mode !== false) && (
            <TooltipProvider>
            <FeatureGuard flag="interview_mode">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isInterviewMode ? "default" : "ghost"} 
                    size="icon" 
                    onClick={toggleInterviewMode}
                    className="h-8 w-8"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Interview Mode</TooltipContent>
              </Tooltip>
            </FeatureGuard>
            </TooltipProvider>
        )}

        <div className="h-4 w-px bg-border mx-1" />

        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
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
              <DropdownMenuItem asChild>
                <Link to="/feedback">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Feedback</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
