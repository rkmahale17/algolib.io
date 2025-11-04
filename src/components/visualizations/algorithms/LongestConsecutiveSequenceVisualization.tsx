import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  nums: number[];
  numSet: Set<number>;
  currentNum: number | null;
  checking: number | null;
  longestStreak: number;
  currentStreak: number;
  message: string;
  lineNumber: number;
}

export const LongestConsecutiveSequenceVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function longestConsecutive(nums: number[]): number {
  if (nums.length === 0) return 0;
  
  const numSet = new Set(nums);
  let longestStreak = 0;
  
  for (const num of numSet) {
    // Only check if it's the start of a sequence
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      
      while (numSet.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  }
  
  return longestStreak;
}`;

  const generateSteps = () => {
    const nums = [100, 4, 200, 1, 3, 2];
    const newSteps: Step[] = [];

    // Step 1: Initial state
    newSteps.push({
      nums: [...nums],
      numSet: new Set(),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      message: "Input array: [100, 4, 200, 1, 3, 2]. We'll find the longest consecutive sequence.",
      lineNumber: 0
    });

    // Step 2: Create set
    const numSet = new Set(nums);
    newSteps.push({
      nums: [...nums],
      numSet: new Set(numSet),
      currentNum: null,
      checking: null,
      longestStreak: 0,
      currentStreak: 0,
      message: "Create a set from nums for O(1) lookups: {1, 2, 3, 4, 100, 200}",
      lineNumber: 3
    });

    let longestStreak = 0;

    // Process each number
    const sortedNums = Array.from(numSet).sort((a, b) => a - b);
    
    for (const num of sortedNums) {
      // Check if it's the start of a sequence
      newSteps.push({
        nums: [...nums],
        numSet: new Set(numSet),
        currentNum: num,
        checking: num - 1,
        longestStreak: longestStreak,
        currentStreak: 0,
        message: `Check if ${num} is the start of a sequence. Does ${num - 1} exist in set?`,
        lineNumber: 7
      });

      if (!numSet.has(num - 1)) {
        // It's a sequence start
        newSteps.push({
          nums: [...nums],
          numSet: new Set(numSet),
          currentNum: num,
          checking: null,
          longestStreak: longestStreak,
          currentStreak: 1,
          message: `${num - 1} not in set, so ${num} starts a sequence. Count consecutive numbers.`,
          lineNumber: 8
        });

        let currentNum = num;
        let currentStreak = 1;

        // Count consecutive numbers
        while (numSet.has(currentNum + 1)) {
          currentNum++;
          currentStreak++;
          
          newSteps.push({
            nums: [...nums],
            numSet: new Set(numSet),
            currentNum: currentNum,
            checking: currentNum,
            longestStreak: longestStreak,
            currentStreak: currentStreak,
            message: `Found ${currentNum} in set! Current streak: ${currentStreak}`,
            lineNumber: 12
          });
        }

        // Check if we should update longestStreak
        newSteps.push({
          nums: [...nums],
          numSet: new Set(numSet),
          currentNum: currentNum,
          checking: currentNum + 1,
          longestStreak: longestStreak,
          currentStreak: currentStreak,
          message: `${currentNum + 1} not in set. Streak ended at length ${currentStreak}.`,
          lineNumber: 15
        });

        longestStreak = Math.max(longestStreak, currentStreak);

        newSteps.push({
          nums: [...nums],
          numSet: new Set(numSet),
          currentNum: null,
          checking: null,
          longestStreak: longestStreak,
          currentStreak: currentStreak,
          message: `Update longest streak: max(${longestStreak - currentStreak === 0 ? 0 : longestStreak - currentStreak}, ${currentStreak}) = ${longestStreak}`,
          lineNumber: 17
        });
      } else {
        newSteps.push({
          nums: [...nums],
          numSet: new Set(numSet),
          currentNum: num,
          checking: null,
          longestStreak: longestStreak,
          currentStreak: 0,
          message: `${num - 1} exists, so ${num} is not a sequence start. Skip it.`,
          lineNumber: 7
        });
      }
    }

    // Final step
    newSteps.push({
      nums: [...nums],
      numSet: new Set(numSet),
      currentNum: null,
      checking: null,
      longestStreak: longestStreak,
      currentStreak: 0,
      message: `Longest consecutive sequence length: ${longestStreak}. The sequence is [1,2,3,4].`,
      lineNumber: 21
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              disabled={currentStepIndex === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStepIndex === steps.length - 1}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Button
              variant={speed === 2000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(2000)}
            >
              0.5x
            </Button>
            <Button
              variant={speed === 1000 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(1000)}
            >
              1x
            </Button>
            <Button
              variant={speed === 500 ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeed(500)}
            >
              2x
            </Button>
          </div>
          <div className="text-sm font-medium">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Visualization */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Longest Consecutive Sequence</h3>
            
            {/* Original Array */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Original Array:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.nums.map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm font-bold ${
                      num === currentStep.currentNum
                        ? 'bg-primary text-primary-foreground'
                        : num === currentStep.checking
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Set */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Number Set (for O(1) lookup):</div>
              <div className="flex gap-2 flex-wrap">
                {Array.from(currentStep.numSet).sort((a, b) => a - b).map((num, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded flex items-center justify-center font-mono text-sm font-bold ${
                      num === currentStep.currentNum
                        ? 'bg-primary text-primary-foreground'
                        : num === currentStep.checking
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary/50'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div className="space-y-2 p-4 bg-muted/50 rounded">
              <div className="text-sm">
                <span className="font-semibold">Longest Streak:</span> {currentStep.longestStreak}
              </div>
              {currentStep.currentStreak > 0 && (
                <div className="text-sm">
                  <span className="font-semibold">Current Streak:</span> {currentStep.currentStreak}
                </div>
              )}
              {currentStep.currentNum !== null && (
                <div className="text-sm">
                  <span className="font-semibold">Current Num:</span> {currentStep.currentNum}
                </div>
              )}
            </div>

            {/* Message */}
            <div className="mt-4 p-4 bg-muted/50 rounded text-sm">
              {currentStep.message}
            </div>
          </Card>
        </div>

        {/* Code */}
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript Code</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => ({
                style: {
                  backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
                  display: 'block',
                  width: '100%'
                }
              })}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
