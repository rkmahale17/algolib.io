import { useEffect, useRef, useState } from 'react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  A: number[];
  B: number[];
  i: number;
  j: number;
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
}

export const MedianOfTwoSortedArraysVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    let A = nums1;
    let B = nums2;
    const total = A.length + B.length;
    const half = Math.floor(total / 2);

    if (B.length < A.length) {
        [A, B] = [B, A];
    }

    let l = 0;
    let r = A.length - 1;

    while (true) {
        const i = Math.floor((l + r) / 2);
        const j = half - i - 2;

        const Aleft = i >= 0 ? A[i] : -Infinity;
        const Aright = i + 1 < A.length ? A[i + 1] : Infinity;
        const Bleft = j >= 0 ? B[j] : -Infinity;
        const Bright = j + 1 < B.length ? B[j + 1] : Infinity;

        if (Aleft <= Bright && Bleft <= Aright) {
            if (total % 2) {
                return Math.min(Aright, Bright);
            }
            return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
        } else if (Aleft > Bright) {
            r = i - 1;
        } else {
            l = i + 1;
        }
    }
}`;

  const formatInf = (val: number) => {
    if (val === -Infinity) return '-∞';
    if (val === Infinity) return '∞';
    return val;
  };

  const generateSteps = () => {
    const nums1 = [1, 3, 8, 9, 15];
    const nums2 = [7, 11, 18, 19, 21, 25];
    const newSteps: Step[] = [];

    let A = [...nums1];
    let B = [...nums2];
    let i_val = -2; // invalid initially
    let j_val = -2;

    const pushStep = (exp: string, line: number, vars: any = {}) => {
      newSteps.push({
        A: [...A],
        B: [...B],
        i: i_val,
        j: j_val,
        variables: { ...vars },
        explanation: exp,
        lineNumber: line
      });
    };

    let vars: any = { A: 'nums1', B: 'nums2' };

    pushStep(`Initialize pointers to our arrays A and B.`, 2, vars);
    
    const total = A.length + B.length;
    const half = Math.floor(total / 2);
    vars = { ...vars, total, half };
    
    pushStep(`Calculate total length (${total}) and the target half length (${half}) for the left partition.`, 4, vars);

    pushStep(`Check if B is shorter than A to optimize binary search on the smaller array.`, 7, vars);
    if (B.length < A.length) {
        [A, B] = [B, A];
        pushStep(`Swapped A and B so A is the shorter array.`, 8, vars);
    }

    let l = 0;
    let r = A.length - 1;
    vars = { ...vars, l, r };
    pushStep(`Initialize binary search bounds l=${l} and r=${r} for array A.`, 11, vars);

    let maxIters = 20; // safety
    while (maxIters-- > 0) {
        pushStep(`Start binary search iteration.`, 14, vars);
        
        const i = Math.floor((l + r) / 2);
        i_val = i;
        vars = { ...vars, i };
        pushStep(`Calculate partition index i for array A: floor((${l} + ${r}) / 2) = ${i}. This means taking ${i + 1} elements from A's left part.`, 15, vars);

        const j = half - i - 2;
        j_val = j;
        vars = { ...vars, j };
        pushStep(`Calculate corresponding partition index j for array B: half - i - 2 = ${half} - ${i} - 2 = ${j}. This means taking ${j + 1} elements from B's left part.`, 16, vars);

        const Aleft = i >= 0 ? A[i] : -Infinity;
        vars = { ...vars, Aleft: formatInf(Aleft) };
        pushStep(`Aleft is the rightmost element in A's left partition: A[${i}] = ${formatInf(Aleft)}.`, 18, vars);

        const Aright = i + 1 < A.length ? A[i + 1] : Infinity;
        vars = { ...vars, Aright: formatInf(Aright) };
        pushStep(`Aright is the leftmost element in A's right partition: A[${i+1}] = ${formatInf(Aright)}.`, 19, vars);

        const Bleft = j >= 0 ? B[j] : -Infinity;
        vars = { ...vars, Bleft: formatInf(Bleft) };
        pushStep(`Bleft is the rightmost element in B's left partition: B[${j}] = ${formatInf(Bleft)}.`, 20, vars);

        const Bright = j + 1 < B.length ? B[j + 1] : Infinity;
        vars = { ...vars, Bright: formatInf(Bright) };
        pushStep(`Bright is the leftmost element in B's right partition: B[${j+1}] = ${formatInf(Bright)}.`, 21, vars);

        pushStep(`Check partition validity: Is Aleft (${formatInf(Aleft)}) <= Bright (${formatInf(Bright)}) AND Bleft (${formatInf(Bleft)}) <= Aright (${formatInf(Aright)})?`, 23, vars);

        if (Aleft <= Bright && Bleft <= Aright) {
            pushStep(`Partition is valid! We have correctly divided the merged arrays.`, 24, vars);
            if (total % 2) {
                const median = Math.min(Aright, Bright);
                vars = { ...vars, median };
                pushStep(`Total length is odd. The median is the smallest element in the right partition: min(${formatInf(Aright)}, ${formatInf(Bright)}) = ${median}.`, 26, vars);
                break;
            } else {
                const maxLeft = Math.max(Aleft, Bleft);
                const minRight = Math.min(Aright, Bright);
                const median = (maxLeft + minRight) / 2;
                vars = { ...vars, maxLeft, minRight, median };
                pushStep(`Total length is even. The median is the average of max(left) and min(right): (${maxLeft} + ${minRight}) / 2 = ${median}.`, 28, vars);
                break;
            }
        } else if (Aleft > Bright) {
            r = i - 1;
            vars = { ...vars, r };
            pushStep(`Aleft (${Aleft}) is greater than Bright (${Bright}). This means A's left partition has elements that are too large. Move partition left: r = ${r}.`, 30, vars);
        } else {
            l = i + 1;
            vars = { ...vars, l };
            pushStep(`Bleft (${Bleft}) is greater than Aright (${Aright}). This means B's left partition has elements that are too large. Move partition right: l = ${l}.`, 32, vars);
        }
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

  const ArrayRenderer = ({ title, array, partitionIndex, isA }: { title: string, array: number[], partitionIndex: number, isA: boolean }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-sm mb-2 text-muted-foreground">{title}</h3>
      <div className="flex items-center flex-wrap gap-x-2 gap-y-4">
        {array.length === 0 && (
          <div className="text-sm text-muted-foreground italic">Empty Array</div>
        )}
        {array.map((value, idx) => {
          const isLeft = idx <= partitionIndex;
          const isBoundaryLeft = idx === partitionIndex;
          const isBoundaryRight = idx === partitionIndex + 1;
          
          return (
            <div key={idx} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 \${
                    isLeft ? 'bg-primary/20 border-primary/50' : 'bg-secondary border-border'
                  } \${isBoundaryLeft ? 'ring-2 ring-blue-500' : ''} \${isBoundaryRight ? 'ring-2 ring-amber-500' : ''}`}
                >
                  <span className="font-semibold text-sm">{value}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{idx}</span>
              </div>
              {/* Draw partition line if this is the last element of the left partition */}
              {isBoundaryLeft && idx < array.length - 1 && (
                <div className="mx-1 h-12 w-0.5 bg-destructive rounded-full self-start mt-1"></div>
              )}
            </div>
          );
        })}
        {/* If partitionIndex is -1, draw line at the very beginning */}
        {partitionIndex === -1 && array.length > 0 && (
          <div className="absolute -ml-3 h-12 w-0.5 bg-destructive rounded-full self-start mt-1"></div>
        )}
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50"></div>
          <span className="text-muted-foreground">Left Partition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-secondary border border-border"></div>
          <span className="text-muted-foreground">Right Partition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-destructive rounded-full"></div>
          <span className="text-muted-foreground">Cut</span>
        </div>
      </div>
    </div>
  );

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden relative">
            <ArrayRenderer title="Array A (Shorter)" array={currentStep.A} partitionIndex={currentStep.i} isA={true} />
            <ArrayRenderer title="Array B (Longer)" array={currentStep.B} partitionIndex={currentStep.j} isA={false} />
            
            {currentStep.i >= -1 && (
                <div className="mt-4 p-3 bg-background rounded border text-xs grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1 border-r pr-2">
                        <span className="font-semibold text-blue-500">Left Max (Aleft, Bleft)</span>
                        <span>Aleft = {currentStep.variables.Aleft || '-∞'}</span>
                        <span>Bleft = {currentStep.variables.Bleft || '-∞'}</span>
                    </div>
                    <div className="flex flex-col gap-1 pl-2">
                        <span className="font-semibold text-amber-500">Right Min (Aright, Bright)</span>
                        <span>Aright = {currentStep.variables.Aright || '∞'}</span>
                        <span>Bright = {currentStep.variables.Bright || '∞'}</span>
                    </div>
                </div>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
