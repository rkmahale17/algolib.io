import Link from 'next/link';
import { ArrowRight, Check, BookOpen, Video, Edit3, Code2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlgorithmListItem, DIFFICULTY_MAP } from '@/types/algorithm';
import type { UserAlgorithmData } from '@/types/userAlgorithmData';
import { useApp } from '@/contexts/AppContext';
import { useAppDispatch } from '@/store/hooks';
import { updateProgressItem } from '@/store/slices/userProgressSlice';
import {
  updateSolutionProgress,
  updateVisualizationProgress,
  updateDrawingProgress,
} from '@/utils/userAlgorithmDataHelpers';
import { toast } from 'sonner';

interface ContinueLearningCardProps {
  algorithm: AlgorithmListItem;
  progress: UserAlgorithmData;
}

const STEPS = [
  {
    key: 'read',
    label: 'Read',
    icon: BookOpen,
    doneKey: 'solution_completed' as keyof UserAlgorithmData,
  },
  {
    key: 'visualize',
    label: 'Visualize',
    icon: Video,
    doneKey: 'visualization_completed' as keyof UserAlgorithmData,
  },
  {
    key: 'thinkpad',
    label: 'Thinkpad',
    icon: Edit3,
    doneKey: 'drawing_completed' as keyof UserAlgorithmData,
  },
  {
    key: 'code',
    label: 'Code',
    icon: Code2,
    doneKey: 'completed' as keyof UserAlgorithmData,
  },
  {
    key: 'review',
    label: 'Review',
    icon: Star,
    doneKey: null,
  },
] as const;

function computeProgress(progress: UserAlgorithmData): { pct: number; stepsCompleted: number } {
  let done = 0;
  if (progress.solution_completed) done++;
  if (progress.visualization_completed) done++;
  if (progress.drawing_completed || progress.completed) done++;
  if (progress.completed) done++;
  if (progress.completed) done++;
  const stepsCompleted = Math.min(done, STEPS.length);
  return { pct: Math.min(Math.round((stepsCompleted / STEPS.length) * 100), 100), stepsCompleted };
}

function isStepDone(
  step: (typeof STEPS)[number],
  progress: UserAlgorithmData,
): boolean {
  if (step.doneKey === null) return progress.completed ?? false;
  if (step.doneKey === 'completed') return progress.completed ?? false;
  return !!(progress[step.doneKey] as boolean);
}

export const ContinueLearningCard = ({
  algorithm,
  progress,
}: ContinueLearningCardProps) => {
  const { user } = useApp();
  const dispatch = useAppDispatch();

  const rawDifficulty =
    algorithm.mappedDifficulty ||
    DIFFICULTY_MAP[algorithm.difficulty?.toLowerCase()] ||
    'Medium';
  const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;

  const targetUrl = algorithm.slug
    ? `/problem/${algorithm.slug}`
    : `/problem/${algorithm.id}`;

  const { pct, stepsCompleted } = computeProgress(progress);
  const currentStepName = stepsCompleted < STEPS.length ? STEPS[stepsCompleted].label : 'Complete';

  const handleToggleSolution = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to update progress'); return; }
    try {
      const nextVal = !progress.solution_completed;
      const success = await updateSolutionProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update solution progress');
      dispatch(updateProgressItem({ ...progress, solution_completed: nextVal }));
      toast.success(nextVal ? 'Marked explanation as read' : 'Marked explanation as unread');
    } catch { toast.error('Failed to update progress'); }
  };

  const handleToggleVisualization = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to update progress'); return; }
    try {
      const nextVal = !progress.visualization_completed;
      const success = await updateVisualizationProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update visualization progress');
      dispatch(updateProgressItem({ ...progress, visualization_completed: nextVal }));
      toast.success(nextVal ? 'Marked visualization as completed' : 'Marked visualization as incomplete');
    } catch { toast.error('Failed to update progress'); }
  };

  const handleToggleDrawing = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to update progress'); return; }
    try {
      const nextVal = !progress.drawing_completed;
      const success = await updateDrawingProgress(user.id, algorithm.id, nextVal);
      if (!success) throw new Error('Failed to update drawing progress');
      dispatch(updateProgressItem({ ...progress, drawing_completed: nextVal }));
      toast.success(nextVal ? 'Marked whiteboard as completed' : 'Marked whiteboard as incomplete');
    } catch { toast.error('Failed to update progress'); }
  };

  const stepHandlers: Record<string, ((e: React.MouseEvent) => Promise<void>) | null> = {
    read: handleToggleSolution,
    visualize: handleToggleVisualization,
    thinkpad: handleToggleDrawing,
    code: null,
    review: null,
  };

  return (
    <div className="w-full max-w-[820px] mx-auto bg-card border border-primary/25 rounded-xl shadow-sm overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-primary/40 mb-2">


      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/30 bg-muted/10">
        <div className="flex items-center gap-2">

          <span className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
            Continue Learning
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
              displayDifficulty === 'Easy' && 'text-green-500 bg-green-500/10 border-green-500/20',
              displayDifficulty === 'Med' && 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
              displayDifficulty === 'Hard' && 'text-red-500 bg-red-500/10 border-red-500/20',
            )}
          >
            {displayDifficulty}
          </span>
          {algorithm.category && (
            <span className="text-[10px] text-muted-foreground bg-muted/40 border border-border/30 px-2 py-0.5 rounded-full hidden sm:inline">
              {algorithm.category.split(',')[0].trim()}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Title + step counter */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
            {algorithm.title || algorithm.name}
          </h3>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-primary tabular-nums leading-none">
              Step {Math.min(stepsCompleted + 1, STEPS.length)} of {STEPS.length}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
              {pct === 100 ? 'All steps done!' : `${currentStepName} up next`}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground/60 font-medium text-right">{pct}% complete</div>
        </div>

        {/* Steps: numbered timeline (horizontal on desktop, wrapping on mobile) */}
        <div className="flex flex-wrap items-center gap-x-0 gap-y-2">
          {STEPS.map((step, i) => {
            const done = isStepDone(step, progress);
            const handler = stepHandlers[step.key];
            const isClickable = !!handler;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-center">
                {/* Step node */}
                <button
                  onClick={handler ?? undefined}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 select-none',
                    isClickable && 'cursor-pointer active:scale-95',
                    !isClickable && 'cursor-default',
                    done
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-muted/30 text-muted-foreground border border-border/30 hover:bg-muted/50',
                  )}
                >
                  {/* Step number / checkmark */}
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border shrink-0',
                      done
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-muted-foreground/30 text-muted-foreground/60',
                    )}
                  >
                    {done ? <Check className="w-3 h-3 stroke-[3]" /> : i + 1}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {step.label}
                </button>

                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'w-4 h-0.5 shrink-0 mx-0.5',
                      done ? 'bg-primary/30' : 'bg-border/40',
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-end pt-1">
          <Link
            href={targetUrl}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all duration-200 active:scale-95"
          >
            {pct === 100 ? '🎉 Review Journey' : pct === 0 ? '▶ Begin Journey' : '▶ Resume Journey'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
