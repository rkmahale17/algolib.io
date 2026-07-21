import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  numsArray: number[];
  ansArray: number[];
  numsHighlights: number[];
  ansHighlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `def getConcatenation(nums: list[int]) -> list[int]:
    ans: list[int] = []
    for _ in range(2):
        for n in nums:
            ans.append(n)
    return ans`,

  typescript: `function getConcatenation(nums: number[]): number[] {
    const ans: number[] = [];
    for (let i = 0; i < 2; i++) {
        for (const n of nums) {
            ans.push(n);
        }
    }
    return ans;
}`,

  java: `public int[] getConcatenation(int[] nums) {
    int n = nums.length;
    int[] ans = new int[2 * n];
    for (int i = 0; i < n; i++) {
        ans[i] = nums[i];
        ans[i + n] = nums[i];
    }
    return ans;
}`,

  cpp: `vector<int> getConcatenation(vector<int>& nums) {
    vector<int> ans;
    for (int i = 0; i < 2; ++i) {
        for (int n : nums) {
            ans.push_back(n);
        }
    }
    return ans;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [1, 3, 2, 1];
  const steps: Step[] = [];
  const ans: number[] = [];
  
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    numsArray: [...nums],
    ansArray: [...ans],
    numsHighlights: [],
    ansHighlights: [],
    variables: { 'nums.length': nums.length, copy: '-', i: '-', val: '-' },
    explanation: 'Initialize an empty array "ans" to store the concatenated result.',
    pseudoStep: 'SET ans = [] (empty array)'
  });
  addLines(2, 2, 3, 2); // init

  for (let copy = 1; copy <= 2; copy++) {
    steps.push({
      numsArray: [...nums],
      ansArray: [...ans],
      numsHighlights: [],
      ansHighlights: [],
      variables: { copy, i: '-', val: '-' },
      explanation: `Start copy ${copy} of 2 to append elements from "nums" to "ans".`,
      pseudoStep: `FOR copy = ${copy} TO 2:`
    });
    addLines(3, 3, 4, 3); // outer loop

    for (let i = 0; i < nums.length; i++) {
      const val = nums[i];
      steps.push({
        numsArray: [...nums],
        ansArray: [...ans],
        numsHighlights: [i],
        ansHighlights: [],
        variables: { copy, i, val },
        explanation: `Iteration i=${i}: read val = nums[${i}] = ${val}.`,
        pseudoStep: `FOR i = ${i}, val = ${val} IN nums:`
      });
      addLines(4, 4, 4, 4); // inner loop

      ans.push(val);
      steps.push({
        numsArray: [...nums],
        ansArray: [...ans],
        numsHighlights: [i],
        ansHighlights: [ans.length - 1],
        variables: { copy, i, val },
        explanation: `Append ${val} to "ans".`,
        pseudoStep: `APPEND val (${val}) TO ans`
      });
      addLines(5, 5, copy === 1 ? 5 : 6, 5); // append
    }
  }

  steps.push({
    numsArray: [...nums],
    ansArray: [...ans],
    numsHighlights: [],
    ansHighlights: [],
    variables: { copy: '-', i: '-', val: '-' },
    explanation: '"ans" now contains two copies of "nums". Return "ans".',
    pseudoStep: 'RETURN ans'
  });
  addLines(8, 6, 8, 8); // return

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const ConcatenationOfArrayVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col gap-6">
            
            {/* nums Array */}
            <div>
              <h3 className="font-semibold mb-2 text-sm text-foreground">nums</h3>
              <div className="flex justify-start gap-2 flex-wrap">
                {currentStep.numsArray.map((value, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                      currentStep.numsHighlights.includes(idx)
                        ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground'
                        : 'bg-muted/50 border-border text-foreground'
                    }`}>
                      <span className="font-semibold text-sm">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ans Array */}
            <div>
              <h3 className="font-semibold mb-2 text-sm text-foreground">ans</h3>
              <div className="flex justify-start gap-2 flex-wrap">
                {currentStep.ansArray.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic h-8 flex items-center">Empty</div>
                ) : (
                  currentStep.ansArray.map((value, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                        currentStep.ansHighlights.includes(idx)
                          ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground'
                          : 'bg-muted/50 border-border text-foreground'
                      }`}>
                        <span className="font-semibold text-sm">{value}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>
          
          <VariablePanel variables={currentStep.variables} />

        </div>

        {/* Right column: code */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};
