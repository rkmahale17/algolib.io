import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface StepControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

export const StepControls = ({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  disabled = false
}: StepControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={onStepBack}
          disabled={disabled || currentStep === 0}
          variant="outline"
          size="icon"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button onClick={onPause} disabled={disabled} size="icon">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onPlay} disabled={disabled || currentStep >= totalSteps} size="icon">
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps}
          variant="outline"
          size="icon"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button onClick={onReset} disabled={disabled} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1">
          Step {currentStep} / {totalSteps}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1">
          Speed: {speed.toFixed(1)}x
        </div>
        <Slider
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          min={0.5}
          max={3}
          step={0.5}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
