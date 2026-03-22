import { useEffect, useRef, useState } from 'react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
}

export const TwoSumVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    return [-1,-1];
}`;

  const generateSteps = () => {
    const nums = [2, 7, 10, 9, 11];
    const target = 18;
    const newSteps: Step[] = [];
    const seen = new Map<number, number>();

    // Line 2: const seen = new Map<number, number>();
    newSteps.push({
      array: [...nums],
      highlights: [],
      variables: { target, seen: '{}', i: '-', complement: '-' },
      explanation: `Initialize an empty hash map 'seen' to store numbers and their indices. Target is ${target}.`,
      lineNumber: 2
    });

    for (let i = 0; i < nums.length; i++) {
      // Line 3: for (let i = 0; i < nums.length; i++) {
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement: '-' },
        explanation: `Iteration i=${i}: Process nums[${i}] = ${nums[i]}.`,
        lineNumber: 3
      });

      const complement = target - nums[i];

      // Line 4: const complement = target - nums[i];
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement },
        explanation: `Calculate complement: ${target} - ${nums[i]} = ${complement}. This is the number we need to find in 'seen'.`,
        lineNumber: 4
      });

      // Line 5: if (seen.has(complement)) {
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement },
        explanation: `Check if 'seen' has the complement (${complement}).`,
        lineNumber: 5
      });

      if (seen.has(complement)) {
        const j = seen.get(complement)!;
        // Line 6: return [seen.get(complement)!, i];
        newSteps.push({
          array: [...nums],
          highlights: [j, i],
          variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], result: `[${j}, ${i}]` },
          explanation: `Found ${complement} at index ${j}! The numbers at indices ${j} and ${i} add up to ${target}. Return [${j}, ${i}].`,
          lineNumber: 6
        });
        break; // Stop generator here as we return
      } else {
        // Line 8: seen.set(nums[i], i);
        newSteps.push({
          array: [...nums],
          highlights: [i],
          variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i, 'nums[i]': nums[i], complement, action: `seen.set(${nums[i]}, ${i})` },
          explanation: `${complement} is not in 'seen'. Add current number ${nums[i]} to 'seen' with its index ${i}.`,
          lineNumber: 8
        });
        seen.set(nums[i], i);
      }
    }

    if (!newSteps[newSteps.length - 1]?.variables.result) {
        // Line 10: return [-1,-1];
        newSteps.push({
          array: [...nums],
          highlights: [],
          variables: { target, seen: JSON.stringify(Object.fromEntries(seen)), i: '-', complement: '-' },
          explanation: `Loop completed and no sum was found. Return [-1, -1].`,
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
            <div className="flex justify-center gap-2 flex-wrap">
              {currentStep.array.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${currentStep.highlights.includes(idx)
                      ? 'bg-primary border-primary scale-110 shadow-lg'
                      : 'bg-muted/50 border-border'
                      }`}
                  >
                    <span className="font-semibold text-sm sm:text-base">{value}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm">Hash Map Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• For each number, calculate its complement (target - num)</p>
              <p>• Check if complement exists in hash map</p>
              <p>• If yes: found the pair! If no: store current number</p>
              <p>• Time: O(n), Space: O(n)</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
