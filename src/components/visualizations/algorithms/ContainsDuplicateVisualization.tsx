import { useEffect, useRef, useState } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
}

export const ContainsDuplicateVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(nums[i])) {
      return true;
    }
    seen.add(nums[i]);
  }
  
  return false;
}`;

  const generateSteps = () => {
    const nums = [1, 2, 3, 1];
    const newSteps: Step[] = [];
    const seen = new Set<number>();

    newSteps.push({
      array: [...nums],
      highlights: [],
      variables: { seen: '{}', i: '-' },
      explanation: 'Initialize: Create empty set to track seen numbers',
      lineNumber: 1
    });

    for (let i = 0; i < nums.length; i++) {
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { i, 'nums[i]': nums[i], seen: `{${Array.from(seen).join(', ')}}` },
        explanation: `i=${i}: Check if nums[${i}]=${nums[i]} is in set`,
        lineNumber: 4
      });

      if (seen.has(nums[i])) {
        newSteps.push({
          array: [...nums],
          highlights: [i],
          variables: { i, 'nums[i]': nums[i], result: true },
          explanation: `Found duplicate! nums[${i}]=${nums[i]} already seen. Return true.`,
          lineNumber: 5
        });
        break;
      }

      seen.add(nums[i]);
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { i, action: `seen.add(${nums[i]})`, seen: `{${Array.from(seen).join(', ')}}` },
        explanation: `nums[${i}]=${nums[i]} not seen before. Add to set.`,
        lineNumber: 7
      });
    }

    if (!seen.has(nums[nums.length - 1]) || seen.size === nums.length) {
      newSteps.push({
        array: [...nums],
        highlights: [],
        variables: { result: false },
        explanation: 'No duplicates found. Return false.',
        lineNumber: 10
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="flex justify-center gap-2  flex-wrap">
              {currentStep.array.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep.highlights.includes(idx)
                        ? 'bg-primary border-primary scale-110 shadow-lg'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <span className="font-bold text-lg">{value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm">Hash Set Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Use a Set to track seen numbers</p>
              <p>• For each number, check if it's in the set</p>
              <p>• If yes: duplicate found! If no: add to set</p>
              <p>• Time: O(n), Space: O(n)</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
