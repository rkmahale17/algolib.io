import Link from 'next/link';
import { Play, Check, BookOpen, Video, Edit3, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlgorithmListItem, DIFFICULTY_MAP } from '@/types/algorithm';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { useApp } from '@/contexts/AppContext';
import { useAppDispatch } from '@/store/hooks';
import { updateProgressItem } from '@/store/slices/userProgressSlice';
import { updateSolutionProgress, updateVisualizationProgress, updateDrawingProgress } from '@/utils/userAlgorithmDataHelpers';
import { toast } from 'sonner';

interface ContinueLearningCardProps {
  algorithm: AlgorithmListItem;
  progress: UserAlgorithmData;
}

const getRemainingTime = (difficulty: string, progress: UserAlgorithmData) => {
  const norm = difficulty.toLowerCase();
  let readTime = 5;
  let vizTime = 5;
  let codeTime = 15;
  
  if (norm === 'easy' || norm === 'beginner' || norm === 'beginners' || norm === 'begineers') {
    readTime = 3;
    vizTime = 4;
    codeTime = 8;
  } else if (norm === 'hard' || norm === 'expert') {
    readTime = 10;
    vizTime = 10;
    codeTime = 25;
  } else {
    readTime = 5;
    vizTime = 7;
    codeTime = 13;
  }
  
  let remaining = 0;
  if (!progress.solution_completed) remaining += readTime;
  if (!progress.visualization_completed) remaining += vizTime;
  if (!progress.drawing_completed || !progress.completed) remaining += codeTime;
  
  if (remaining === 0 && !progress.completed) {
    remaining = 2;
  }
  
  return remaining > 0 ? `${remaining} minutes remaining` : 'Completed';
};

export const ContinueLearningCard = ({ algorithm, progress }: ContinueLearningCardProps) => {
  const { user } = useApp();
  const dispatch = useAppDispatch();

  const rawDifficulty = algorithm.mappedDifficulty || DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] || 'Medium';
  const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;
  
  const remainingText = getRemainingTime(algorithm.difficulty, progress);
  const targetUrl = algorithm.slug ? `/problem/${algorithm.slug}` : `/problem/${algorithm.id}`;
  
  const handleToggleSolution = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to update progress');
      return;
    }
    try {
      const nextVal = !progress.solution_completed;
      const success = await updateSolutionProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update solution progress');
      dispatch(updateProgressItem({
        ...progress,
        solution_completed: nextVal
      }));
      toast.success(nextVal ? "Marked explanation as read" : "Marked explanation as unread");
    } catch (err) {
      console.error(err);
      toast.error('Failed to update progress');
    }
  };

  const handleToggleVisualization = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to update progress');
      return;
    }
    try {
      const nextVal = !progress.visualization_completed;
      const success = await updateVisualizationProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update visualization progress');
      dispatch(updateProgressItem({
        ...progress,
        visualization_completed: nextVal
      }));
      toast.success(nextVal ? "Marked visualization as completed" : "Marked visualization as incomplete");
    } catch (err) {
      console.error(err);
      toast.error('Failed to update progress');
    }
  };

  const handleToggleDrawing = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to update progress');
      return;
    }
    try {
      const nextVal = !progress.drawing_completed;
      const success = await updateDrawingProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update drawing progress');
      dispatch(updateProgressItem({
        ...progress,
        drawing_completed: nextVal
      }));
      toast.success(nextVal ? "Marked whiteboard as completed" : "Marked whiteboard as incomplete");
    } catch (err) {
      console.error(err);
      toast.error('Failed to update progress');
    }
  };

  return (
    <div className="mb-6 w-full max-w-[820px] mx-auto bg-gradient-to-br from-card to-card/95 border border-primary/20 rounded-xl shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-primary/30">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-2xl pointer-events-none transition-all group-hover:bg-primary/10" />
      
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-foreground/90">Continue Learning</span>
          </div>
          {remainingText !== 'Completed' && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground/80 bg-muted/40 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span>{remainingText}</span>
            </div>
          )}
        </div>
        
        {/* Content Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-md sm:text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {algorithm.title || algorithm.name}
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span>{algorithm.category}</span>
              <span>•</span>
              <span className={cn(
                "font-semibold",
                displayDifficulty === "Easy" && "text-green-500",
                displayDifficulty === "Med" && "text-yellow-500",
                displayDifficulty === "Hard" && "text-red-500"
              )}>
                {displayDifficulty}
              </span>
            </p>
          </div>
          
          {/* Steps Grid */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs select-none flex-wrap">
            {/* Step: Read */}
            <button
              onClick={handleToggleSolution}
              className="flex items-center gap-1.5 bg-muted/30 dark:bg-muted/15 hover:bg-muted/50 dark:hover:bg-muted/25 px-2.5 py-1.5 rounded-lg border border-border/30 transition-colors cursor-pointer active:scale-95"
            >
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center border text-[9px] transition-all",
                progress.solution_completed 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "bg-background border-muted-foreground/20 text-transparent"
              )}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground/75" />
              <span className="font-semibold text-foreground/80">Read</span>
            </button>
            
            {/* Step: Visualize */}
            <button
              onClick={handleToggleVisualization}
              className="flex items-center gap-1.5 bg-muted/30 dark:bg-muted/15 hover:bg-muted/50 dark:hover:bg-muted/25 px-2.5 py-1.5 rounded-lg border border-border/30 transition-colors cursor-pointer active:scale-95"
            >
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center border text-[9px] transition-all",
                progress.visualization_completed 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "bg-background border-muted-foreground/20 text-transparent"
              )}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <Video className="w-3.5 h-3.5 text-muted-foreground/75" />
              <span className="font-semibold text-foreground/80">Visualize</span>
            </button>
            
            {/* Step: Thinkpad */}
            <button
              onClick={handleToggleDrawing}
              className="flex items-center gap-1.5 bg-muted/30 dark:bg-muted/15 hover:bg-muted/50 dark:hover:bg-muted/25 px-2.5 py-1.5 rounded-lg border border-border/30 transition-colors cursor-pointer active:scale-95"
            >
              <div className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center border text-[9px] transition-all",
                (progress.drawing_completed || progress.completed)
                  ? "bg-green-500 border-green-500 text-white" 
                  : "bg-background border-muted-foreground/20 text-transparent"
              )}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <Edit3 className="w-3.5 h-3.5 text-muted-foreground/75" />
              <span className="font-semibold text-foreground/80">Thinkpad</span>
            </button>
          </div>
          
          {/* Action Button */}
          <Link
            href={targetUrl}
            className="sm:self-center shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)] hover:bg-primary/95 transition-all duration-300 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
