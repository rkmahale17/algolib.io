import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  nums: number[];
  highlights: number[];
  seen: Set<number>;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const ContainsDuplicateVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [1, 2, 3, 1];

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

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const seen = new Set<number>();

    stepsList.push({
      nums,
      highlights: [],
      seen: new Set(seen),
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: "Given an array of integers, check if any value appears at least twice.",
      lineExecution: "function containsDuplicate(nums: number[]): boolean {",
      highlightedLines: [1]
    });

    stepsList.push({
      nums,
      highlights: [],
      seen: new Set(seen),
      variables: { seen: "{}" },
      explanation: "Initialize an empty Set to store numbers we encounter.",
      lineExecution: "const seen = new Set<number>();",
      highlightedLines: [2]
    });

    for (let i = 0; i < nums.length; i++) {
      stepsList.push({
        nums,
        highlights: [i],
        seen: new Set(seen),
        variables: { i, "nums[i]": nums[i], seen: `{${Array.from(seen).join(', ')}}` },
        explanation: `Iteration i = ${i}: Examining the value ${nums[i]}.`,
        lineExecution: "for (let i = 0; i < nums.length; i++) {",
        highlightedLines: [3]
      });

      const duplicate = seen.has(nums[i]);
      stepsList.push({
        nums,
        highlights: [i],
        seen: new Set(seen),
        variables: { "seen.has(nums[i])": duplicate },
        explanation: `Check if ${nums[i]} is already in our 'seen' set. ${duplicate ? "Yes, it is!" : "No, not yet."}`,
        lineExecution: "if (seen.has(nums[i])) {",
        highlightedLines: [4]
      });

      if (duplicate) {
        stepsList.push({
          nums,
          highlights: [i],
          seen: new Set(seen),
          variables: { result: true },
          explanation: `Found a duplicate! Since ${nums[i]} exists in the set, we return true.`,
          lineExecution: "return true;",
          highlightedLines: [5]
        });
        return stepsList;
      }

      seen.add(nums[i]);
      stepsList.push({
        nums,
        highlights: [i],
        seen: new Set(seen),
        variables: { seen: `{${Array.from(seen).join(', ')}}` },
        explanation: `Add ${nums[i]} to the 'seen' set and continue to the next index.`,
        lineExecution: "seen.add(nums[i]);",
        highlightedLines: [7]
      });
    }

    stepsList.push({
      nums,
      highlights: [],
      seen: new Set(seen),
      variables: { result: false },
      explanation: "Finished loop without finding any duplicates. Return false.",
      lineExecution: "return false;",
      highlightedLines: [10]
    });

    return stepsList;
  }, [nums]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Contains Duplicate (Hash Set)
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-10">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6">Input Array</h4>
                <div className="flex gap-3 justify-center">
                  {nums.map((num, idx) => {
                    const isCurrent = step.highlights.includes(idx);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 font-black transition-colors duration-0 shadow-sm ${
                            isCurrent ? "border-orange-500 bg-orange-100 text-black scale-110 z-10 shadow-lg" :
                            "border-gray-100 bg-white text-black"
                          }`}
                        >
                          <span className="text-xl">{num}</span>
                        </div>
                        {isCurrent && <div className="text-[9px] font-black text-orange-700 bg-orange-200 px-1.5 rounded uppercase tracking-tighter">i</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">Seen Set Content</h4>
                <div className="min-h-[60px] p-4 bg-muted/20 border border-dashed border-gray-200 rounded-xl flex flex-wrap gap-2 items-center justify-center">
                  {step.seen.size === 0 ? (
                    <span className="text-xs text-gray-400 italic">Empty Set</span>
                  ) : (
                    Array.from(step.seen).map((val) => (
                      <div key={val} className="px-3 py-1 bg-green-100 border border-green-300 text-green-800 rounded-full font-bold text-sm shadow-sm ring-1 ring-green-500/10">
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div>
             <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                       Current Execution
                    </h4>
                    <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                       Commentary
                    </h4>
                    <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap text-black">
                       {step.explanation}
                    </p>
                  </div>
                </div>
             </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
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
