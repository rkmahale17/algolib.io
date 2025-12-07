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

export const TwoSumVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;

  const generateSteps = () => {
    const nums = [2, 7, 10, 9, 11];
    const target = 18;
    const newSteps: Step[] = [];
    const map = new Map<number, number>();

    newSteps.push({
      array: [...nums],
      highlights: [],
      variables: { target, map: '{}', i: '-', complement: '-' },
      explanation: `Initialize: Looking for two numbers that sum to ${target}. Create empty hash map.`,
      lineNumber: 1
    });

    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      
      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, i, 'nums[i]': nums[i], complement, map: JSON.stringify(Object.fromEntries(map)) },
        explanation: `i=${i}: Check nums[${i}]=${nums[i]}. Calculate complement = ${target} - ${nums[i]} = ${complement}`,
        lineNumber: 4
      });

      if (map.has(complement)) {
        const j = map.get(complement)!;
        newSteps.push({
          array: [...nums],
          highlights: [j, i],
          variables: { target, i, j, 'nums[i]': nums[i], 'nums[j]': nums[j], result: `[${j}, ${i}]` },
          explanation: `Found! nums[${j}]=${nums[j]} + nums[${i}]=${nums[i]} = ${target}. Return [${j}, ${i}]`,
          lineNumber: 7
        });
        break;
      }

      newSteps.push({
        array: [...nums],
        highlights: [i],
        variables: { target, i, 'nums[i]': nums[i], action: `map.set(${nums[i]}, ${i})` },
        explanation: `Complement ${complement} not in map. Store nums[${i}]=${nums[i]} with index ${i} in map.`,
        lineNumber: 10
      });

      map.set(nums[i], i);
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
                    className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                      currentStep.highlights.includes(idx)
                        ? 'bg-primary border-primary scale-110 shadow-lg'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <span className="font-bold text-sm sm:text-lg">{value}</span>
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

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
