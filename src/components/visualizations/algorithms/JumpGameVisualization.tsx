import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  nums: number[];
  i: number | null;
  goal: number | null;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const JumpGameVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'reachable' | 'unreachable'>('reachable');

  const nums = useMemo(() => 
    caseType === 'reachable' ? [2, 3, 1, 1, 4] : [3, 2, 1, 0, 4], 
  [caseType]);

  const code = `function canJump(nums: number[]): boolean {
  let goal = nums.length - 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (i + nums[i] >= goal) {
      goal = i;
    }
  }
  return goal === 0;
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const n = nums.length;
    let goal = n - 1;

    stepsList.push({
      nums,
      i: null,
      goal: null,
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: `Use Case: ${caseType.toUpperCase()}. Can we reach the last index? We work backward from target index ${n-1}.`,
      lineExecution: "function canJump(nums: number[]): boolean {",
      highlightedLines: [1]
    });

    stepsList.push({
      nums,
      i: null,
      goal: n - 1,
      variables: { goal: n - 1 },
      explanation: `Initially, the target we must reach is the last index (${n - 1}).`,
      lineExecution: "let goal = nums.length - 1;",
      highlightedLines: [2]
    });

    for (let i = n - 1; i >= 0; i--) {
      stepsList.push({
        nums,
        i,
        goal,
        variables: { i, goal },
        explanation: `Checking index ${i}. Target goal post is at index ${goal}.`,
        lineExecution: "for (let i = nums.length - 1; i >= 0; i--) {",
        highlightedLines: [3]
      });

      const reach = i + nums[i];
      const canReach = reach >= goal;

      stepsList.push({
        nums,
        i,
        goal,
        variables: { i, "nums[i]": nums[i], reach, goal, result: canReach },
        explanation: `Index ${i} jumps to ${reach}. Is this >= ${goal}? ${canReach ? "Yes." : "No."}`,
        lineExecution: "if (i + nums[i] >= goal) {",
        highlightedLines: [4]
      });

      if (canReach) {
        goal = i;
        stepsList.push({
          nums,
          i,
          goal,
          variables: { goal },
          explanation: `Updated: Index ${i} can reach the goal, so ${i} becomes the new target index.`,
          lineExecution: "goal = i;",
          highlightedLines: [5]
        });
      }
    }

    stepsList.push({
      nums,
      i: null,
      goal,
      variables: { goal, result: goal === 0 },
      explanation: `Finished. Did we reach index 0? ${goal === 0 ? "YES (Successful)" : "NO (Failed)"}. Final result: ${goal === 0}.`,
      lineExecution: "return goal === 0;",
      highlightedLines: [8]
    });

    return stepsList;
  }, [nums, caseType]);

  const handleCaseToggle = (type: 'reachable' | 'unreachable') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={() => handleCaseToggle('reachable')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'reachable' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: Reachable
            </button>
            <button 
              onClick={() => handleCaseToggle('unreachable')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'unreachable' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: Unreachable
            </button>
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 opacity-90">
              Jump Game (Greedy Strategy)
            </h2>
            <Card className="p-4 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-6">
                <div className="flex gap-2 justify-center items-end">
                  {nums.map((num, idx) => {
                    const isGoal = idx === step.goal;
                    const isCurrent = idx === step.i;
                    const isPassed = step.goal !== null && idx > step.goal;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 group relative">
                        <div 
                          className={`w-8 h-8 flex items-center justify-center rounded border-2 font-black transition-colors duration-0 ${
                            isGoal ? "border-green-500 bg-green-100 text-black shadow-sm ring-2 ring-green-500/10" :
                            isCurrent ? "border-orange-500 bg-orange-100 text-black scale-105 z-10" :
                            isPassed ? "border-green-200 bg-green-50/50 text-gray-400" :
                            "border-gray-100 bg-white text-black"
                          }`}
                        >
                          <span className="text-xs">{num}</span>
                        </div>
                        <div className="h-3 flex items-center">
                          {isGoal && <div className="text-[8px] font-black text-green-700 bg-green-200 px-1 rounded uppercase tracking-tighter">Goal</div>}
                          {!isGoal && isCurrent && <div className="text-[8px] font-black text-orange-700 bg-orange-200 px-1 rounded uppercase tracking-tighter">i</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {step.goal !== null && (
                <div className="mt-2 p-3 rounded bg-green-50 border border-green-200 flex items-center justify-between">
                  <div>
                    <div className="text-[8px] font-bold text-green-700 uppercase tracking-widest mb-0.5">Current Target</div>
                    <div className="text-xs font-black text-black">Index {step.goal}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-bold text-green-600 uppercase tracking-widest mb-0.5">Dist to Start</div>
                    <div className="text-xs font-black text-black">{step.goal}</div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div>
             <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Current Execution
                    </h4>
                    <div className="text-[11px] font-mono bg-background/80 p-1.5 rounded border border-border/50 shadow-sm inline-block">
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-0.5">
                       Commentary
                    </h4>
                    <p className="text-[12px] font-medium leading-tight text-foreground/90 whitespace-pre-wrap text-black">
                       {step.explanation}
                    </p>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4 flex flex-col h-full">
           <div className="flex-1 overflow-hidden min-h-[400px]">
             <AnimatedCodeEditor
               code={code}
               language="typescript"
               highlightedLines={step.highlightedLines}
             />
           </div>
           
           <div className="p-1">
             <VariablePanel variables={step.variables} />
           </div>
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
