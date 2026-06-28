import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Info } from 'lucide-react';

interface Step {
  nums: number[];
  i: number | null;
  goal: number | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function canJump(nums: number[]): boolean {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) {
      goal = i;
    }
  }
  return goal === 0;
}`,

  python: `def canJump(nums: list[int]) -> bool:
    goal = len(nums) - 1
    for i in range(len(nums) - 1, -1, -1):
        if i + nums[i] >= goal:
            goal = i
    return goal == 0`,

  java: `public static class Solution {
    public boolean canJump(int[] nums) {
        int goal = nums.length - 1;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (i + nums[i] >= goal) {
                goal = i;
            }
        }
        return goal == 0;
    }
}`,

  cpp: `class Solution {
public:
    bool canJump(vector<int>& nums) {
        int goal = nums.size() - 1;
        for (int i = nums.size() - 1; i >= 0; i--) {
            if (i + nums[i] >= goal) {
                goal = i;
            }
        }
        return goal == 0;
    }
};`
};

export const JumpGameVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [caseType, setCaseType] = useState<'reachable' | 'unreachable'>('reachable');

  const nums = useMemo(() => 
    caseType === 'reachable' ? [2, 3, 1, 1, 4] : [3, 2, 1, 0, 4], 
  [caseType]);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const n = nums.length;
    let goal = n - 1;

    stepsList.push({
      nums,
      i: null,
      goal: null,
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: `Check if we can reach the last index. We use a greedy strategy working backward from target index ${n-1}.`,
      pseudoStep: `START canJump(nums=[${nums.join(', ')}])`,
    });
    addLines(1, 1, 2, 3);

    stepsList.push({
      nums,
      i: null,
      goal: n - 1,
      variables: { goal: n - 1 },
      explanation: `Initially, the target we must reach is the last index (${n - 1}).`,
      pseudoStep: `SET goal = ${n - 1}`,
    });
    addLines(2, 2, 3, 4);

    for (let i = n - 1; i >= 0; i--) {
      stepsList.push({
        nums,
        i,
        goal,
        variables: { i, goal },
        explanation: `Checking index ${i}. Current goal post is at index ${goal}.`,
        pseudoStep: `FOR i = ${i} down to 0`,
      });
      addLines(3, 3, 4, 5);

      const reach = i + nums[i];
      const canReach = reach >= goal;

      stepsList.push({
        nums,
        i,
        goal,
        variables: { i, "nums[i]": nums[i], reach, goal, result: canReach },
        explanation: `Index ${i} has jump size ${nums[i]}, reaching up to index ${reach}. Is reach >= goal? ${canReach ? "Yes." : "No."}`,
        pseudoStep: `IF i + nums[i] >= goal → ${i} + ${nums[i]} >= ${goal} → ${canReach ? "YES ✓" : "NO ✗"}`,
      });
      addLines(4, 4, 5, 6);

      if (canReach) {
        goal = i;
        stepsList.push({
          nums,
          i,
          goal,
          variables: { goal },
          explanation: `Since index ${i} can reach the current goal, update the goal to ${i}. Any index that reaches ${i} can now reach the end.`,
          pseudoStep: `SET goal = ${i}`,
        });
        addLines(5, 5, 6, 7);
      }
    }

    stepsList.push({
      nums,
      i: null,
      goal,
      variables: { goal, result: goal === 0 },
      explanation: `Finished checking all indices. The leftmost index that can reach the end is ${goal}. Can we reach it from the start? ${goal === 0 ? "YES" : "NO"}.`,
      pseudoStep: `RETURN goal === 0 → ${goal === 0 ? "TRUE" : "FALSE"}`,
    });
    addLines(8, 6, 9, 10);

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, [nums, caseType]);

  const handleCaseToggle = (type: 'reachable' | 'unreachable') => {
    setCaseType(type);
    setCurrentStepIndex(0);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="flex gap-2">
            <button 
              onClick={() => handleCaseToggle('reachable')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'reachable' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: Reachable
            </button>
            <button 
              onClick={() => handleCaseToggle('unreachable')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'unreachable' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: Unreachable
            </button>
          </div>

          <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
            <h3 className="text-sm font-semibold mb-6 text-center text-foreground font-sans">
              Array State & Goal Post
            </h3>
            <div className="flex gap-3 justify-center items-end h-16">
              {nums.map((num, idx) => {
                const isGoal = idx === step.goal;
                const isCurrent = idx === step.i;
                const isPassed = step.goal !== null && idx > step.goal;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 group relative">
                    <div 
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-black transition-all duration-300 ${
                        isGoal ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm scale-105" :
                        isCurrent ? "border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 scale-110 z-10 font-bold" :
                        isPassed ? "border-border/30 bg-muted/10 text-muted-foreground/30" :
                        "border-border bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      <span className="text-sm font-mono">{num}</span>
                    </div>
                    <div className="h-4 flex items-center">
                      {isGoal && <div className="text-[8px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/50 px-1 rounded uppercase">Goal</div>}
                      {!isGoal && isCurrent && <div className="text-[8px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/50 px-1.5 rounded uppercase">i</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step.explanation}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
