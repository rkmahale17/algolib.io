import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

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
  const { user } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
        return;
      }
      onStepChange(currentStep + 1);
    }, 1500 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, totalSteps, onStepChange, currentStep]);

  const requireAuth = (): boolean => {
    if (!user) {
      toast.error("Sign in required", {
        description: "Please sign in to interact with visualizations."
      });
      return true;
    }
    return false;
  };

  const handlePlay = () => {
    if (requireAuth()) return;
    if (currentStep >= totalSteps - 1) {
      onStepChange(0);
    }
    setIsPlaying(true);
  };

  const handleStepBack = () => {
    if (requireAuth()) return;
    onStepChange(Math.max(0, currentStep - 1));
  };

  const handleStepForward = () => {
    if (requireAuth()) return;
    onStepChange(Math.min(totalSteps - 1, currentStep + 1));
  };

  const handleReset = () => {
    if (requireAuth()) return;
    onStepChange(0);
    setIsPlaying(false);
  };

  const handlePause = () => {
    if (requireAuth()) return;
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handleStepBack}
          disabled={currentStep === 0 || isPlaying}
          variant="outline"
          size="icon"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button onClick={handlePause} size="icon">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handlePlay} disabled={currentStep >= totalSteps - 1 && !isPlaying} size="icon">
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          onClick={handleStepForward}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
          variant="outline"
          size="icon"
          title="Step Forward"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button onClick={handleReset} variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Step Counter */}
      <div className="text-sm text-muted-foreground">
        Step {currentStep + 1} / {totalSteps}
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Speed: {speed.toFixed(1)}x
        </span>
        <Slider
          value={[speed]}
          onValueChange={(values) => {
            if (!user) {
              toast.error("Sign in required", {
                description: "Please sign in to interact with visualizations."
              });
              return;
            }
            setSpeed(values[0]);
          }}
          min={0.5}
          max={3}
          step={0.5}
          disabled={isPlaying}
          className="flex-1"
        />
      </div>
    </div>
  );
};
