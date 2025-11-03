import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleStepControlsProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

export const SimpleStepControls = ({
  currentStep,
  totalSteps,
  onStepChange
}: SimpleStepControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          variant="outline"
          size="icon"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep >= totalSteps - 1}
          variant="outline"
          size="icon"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button onClick={() => onStepChange(0)} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1 text-center">
          Step {currentStep + 1} / {totalSteps}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
