import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { User } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  nums: number[];
  i: number | null;
  currentEnd: number;
  farthest: number;
  jumps: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function jump(nums: number[]): number {
  let res = 0;
  let l = 0;
  let r = 0;
  while (r < nums.length - 1) {
    let farthest = 0;
    for (let i = l; i <= r; i++) {
      farthest = Math.max(farthest, i + nums[i]);
    }
    l = r + 1;
    r = farthest;
    res++;
  }
  return res;
}`,
  python: `def jump(nums):
    res = 0
    l = 0
    r = 0
    while r < len(nums) - 1:
        farthest = 0
        for i in range(l, r + 1):
            farthest = max(farthest, i + nums[i])
        l = r + 1
        r = farthest
        res += 1
    return res`,
  java: `public static class Solution {
    public int jump(int[] nums) {
        int res = 0;
        int l = 0;
        int r = 0;
        while (r < nums.length - 1) {
            int farthest = 0;
            for (int i = l; i <= r; i++) {
                farthest = Math.max(farthest, i + nums[i]);
            }
            l = r + 1;
            r = farthest;
            res++;
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int jump(vector<int>& nums) {
        int n = nums.size();
        int res = 0;
        int l = 0;
        int r = 0;
        while (r < n - 1) {
            int farthest = 0;
            for (int i = l; i <= r; i++) {
                farthest = max(farthest, i + nums[i]);
            }
            l = r + 1;
            r = farthest;
            res++;
        }
        return res;
    }
};`
};

export const JumpGameIIVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const nums = useMemo(() => 
    caseType === 'case1' ? [2, 3, 1, 1, 4] : [2, 1, 1, 1, 4], 
  [caseType]);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const n = nums.length;
    let res = 0;
    let l = 0;
    let r = 0;

    const addStep = (
      i: number | null,
      currentEnd: number,
      farthest: number,
      jumps: number,
      msg: string,
      pseudo: string,
      variables: Record<string, any>,
      ts: number, py: number, java: number, cpp: number
    ) => {
      s.push({
        nums,
        i,
        currentEnd,
        farthest,
        jumps,
        variables,
        explanation: msg,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // Initialize
    addStep(
      null, r, 0, res,
      `Initialize variables. 'res' (jumps) = 0. Current window range is [l=${l}, r=${r}].`,
      "SET res = 0, l = 0, r = 0",
      { res, l, r },
      2, 2, 3, 5
    );

    while (r < n - 1) {
      // While loop condition check
      addStep(
        null, r, 0, res,
        `Check while loop condition: r (${r}) < nums.length - 1 (${n - 1}) → True. We haven't reached the end.`,
        `WHILE r < nums.length - 1  →  ${r} < ${n - 1} (YES)`,
        { r, "nums.length - 1": n - 1 },
        5, 5, 6, 8
      );

      let farthest = 0;
      // Initialize farthest
      addStep(
        null, r, farthest, res,
        `Initialize 'farthest = 0'. We will scan the current range [l=${l}, r=${r}] to find the furthest index we can reach.`,
        "SET farthest = 0",
        { l, r, farthest },
        6, 6, 7, 9
      );

      for (let i = l; i <= r; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        // Inner loop iteration
        addStep(
          i, r, farthest, res,
          `At index ${i}: nums[${i}] = ${nums[i]}. Farthest reachable index from here is ${i} + ${nums[i]} = ${i + nums[i]}. Update 'farthest' = ${farthest}.`,
          `SET farthest = max(farthest, ${i} + nums[${i}]) → ${farthest}`,
          { i, "nums[i]": nums[i], farthest },
          8, 8, 9, 11
        );
      }

      l = r + 1;
      r = farthest;
      res++;
      // Update window range and increment jump count
      addStep(
        null, r, farthest, res,
        `Update next jump window: l = r + 1 = ${l}. r = farthest = ${r}. Increment jumps 'res' = ${res}.`,
        `SET l = r + 1, r = farthest, res = res + 1`,
        { l, r, res },
        10, 9, 11, 13
      );
    }

    // Loop terminates
    addStep(
      null, r, 0, res,
      `Check while loop condition: r (${r}) < nums.length - 1 (${n - 1}) → False. We have reached or exceeded the last index!`,
      `WHILE r < nums.length - 1  →  ${r} < ${n - 1} (NO)`,
      { r, "nums.length - 1": n - 1 },
      5, 5, 6, 8
    );

    // Return result
    addStep(
      null, r, 0, res,
      `Return the minimum number of jumps required: ${res}.`,
      `RETURN res → ${res}`,
      { res },
      14, 12, 15, 17
    );

    return { steps: s, stepLineNumbers: lines };
  }, [nums]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={() => handleCaseToggle('case1')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case1' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: [2,3,1,1,4]
            </button>
            <button 
              onClick={() => handleCaseToggle('case2')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case2' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Case: [2,1,1,1,4]
            </button>
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground mb-3 opacity-90">
              Jump Game II Array State
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-8 mt-12 relative">
                
                {step.i !== null && step.farthest > step.i && (
                  <div className="absolute top-[-30px] left-0 w-full h-[30px] overflow-hidden opacity-30 pointer-events-none">
                     <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                       <path 
                         d={`M ${(step.i * 56) + 28} 30 Q ${((step.i + step.farthest) / 2) * 56 + 28} -10 ${(Math.min(step.farthest, nums.length - 1) * 56) + 28} 30`}
                         fill="none" 
                         stroke="currentColor" 
                         strokeWidth="2" 
                         strokeDasharray="4 4" 
                         className="text-green-500"
                       />
                     </svg>
                  </div>
                )}

                <div className="flex gap-4 justify-center items-end relative">
                  {nums.map((num, idx) => {
                    const isCurrent = idx === step.i;
                    const inCurrentWindow = idx <= step.currentEnd && idx >= (step.i !== null ? step.i : 0);
                    const isFarthest = idx === step.farthest;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 group relative w-10">
                        <div 
                          className={`absolute -top-10 transition-all duration-300 ease-in-out \${
                            isCurrent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                        >
                          <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-500/30 animate-bounce">
                            <User size={16} strokeWidth={2.5} />
                          </div>
                        </div>

                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded border-2 font-black transition-colors duration-0 \${
                            isCurrent ? "border-orange-500 bg-orange-100 text-black shadow-md z-10" :
                            inCurrentWindow ? "border-blue-300 bg-blue-50 text-blue-900" :
                            "border-gray-200 bg-white text-black"
                          }`}
                        >
                          <span className="text-sm">{num}</span>
                        </div>
                        <div className="h-6 flex flex-col items-center justify-start mt-1 gap-0.5">
                          {isCurrent && <div className="text-[9px] font-black text-orange-700 bg-orange-200 px-1.5 rounded-sm uppercase tracking-tighter shadow-sm">i</div>}
                          {isFarthest && <div className="text-[9px] font-black text-green-700 bg-green-200 px-1.5 rounded-sm uppercase tracking-tighter shadow-sm">Farthest</div>}
                          {!isFarthest && idx === step.currentEnd && <div className="text-[9px] font-black text-purple-700 bg-purple-200 px-1.5 rounded-sm uppercase tracking-tighter shadow-sm">End</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-2 space-y-4">
             <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm">
                <div className="space-y-2">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary/80">
                     Commentary
                  </h4>
                  <p className="text-[13px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                  </p>
                </div>
             </Card>
             
             <div className="p-1">
               <VariablePanel variables={step.variables} />
             </div>
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
    />
  );
};
