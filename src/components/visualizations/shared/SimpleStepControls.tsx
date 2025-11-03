import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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

  const handlePlay = () => {
    if (currentStep >= totalSteps - 1) {
      onStepChange(0);
    }
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || isPlaying}
          variant="outline"
          size="icon"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {isPlaying ? (
          <Button onClick={() => setIsPlaying(false)} size="icon">
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handlePlay} disabled={currentStep >= totalSteps - 1 && !isPlaying} size="icon">
            <Play className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
          variant="outline"
          size="icon"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button onClick={() => { onStepChange(0); setIsPlaying(false); }} variant="outline" size="icon">
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

      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1 text-center">
          Speed: {speed.toFixed(1)}x
        </div>
        <Slider
          value={[speed]}
          onValueChange={(values) => setSpeed(values[0])}
          min={0.5}
          max={3}
          step={0.5}
          disabled={isPlaying}
        />
      </div>
    </div>
  );
};
