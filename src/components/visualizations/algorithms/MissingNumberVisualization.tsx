import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  highlighting: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calc?: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function missingNumber(nums: number[]): number {
  let res = nums.length;
  for (let i = 0; i < nums.length; i++) {
    res += i - nums[i];
  }
  return res;
}`,
  python: `def missingNumber(nums) -> int:
    res = len(nums)
    for i in range(len(nums)):
        res += (i - nums[i])
    return res`,
  java: `public static class Solution {
    public int missingNumber(int[] nums) {
        int res = nums.length;
        for (int i = 0; i < nums.length; i++) {
            res += i - nums[i];
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int res = nums.size();
        for (int i = 0; i < nums.size(); i++) {
            res += i - nums[i];
        }
        return res;
    }
};`
};

export const MissingNumberVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const nums = [3, 0, 1];

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    s.push({
      array: nums,
      highlighting: [],
      variables: { res: 3, n: 3 },
      explanation: "Initialize res = n = 3. This accounts for the missing index n in the 0..n range.",
      pseudoStep: "SET res = nums.length (res = 3)",
      calc: "res = 3"
    });
    addLines(2, 2, 3, 4);

    for (let i = 0; i < nums.length; i++) {
      s.push({
        array: nums,
        highlighting: [],
        variables: { res: s[s.length - 1].variables.res, i, 'nums[i]': nums[i] },
        explanation: `Start loop at index i = ${i}. We will compute the difference: i - nums[i].`,
        pseudoStep: `FOR i = 0 TO n-1 (i = ${i})`,
      });
      addLines(3, 3, 4, 5);

      const diff = i - nums[i];
      s.push({
        array: nums,
        highlighting: [i],
        variables: { res: s[s.length - 1].variables.res, i, 'nums[i]': nums[i], diff },
        explanation: `Calculate difference: i - nums[i] = ${i} - ${nums[i]} = ${diff}.`,
        pseudoStep: `SET diff = i - nums[i] (${i} - ${nums[i]} = ${diff})`,
        calc: `${i} - ${nums[i]} = ${diff}`
      });
      addLines(4, 4, 5, 6);

      const prevRes = s[s.length - 2].variables.res;
      const nextRes = prevRes + diff;
      s.push({
        array: nums,
        highlighting: [i],
        variables: { res: nextRes, i, 'nums[i]': nums[i], prevRes },
        explanation: `Update res by adding difference: res += diff → ${prevRes} + (${diff}) = ${nextRes}.`,
        pseudoStep: `SET res = res + diff (res = ${prevRes} + (${diff}) = ${nextRes})`,
        calc: `${prevRes} + (${diff}) = ${nextRes}`
      });
      addLines(4, 4, 5, 6);
    }

    const finalRes = s[s.length - 1].variables.res;
    s.push({
      array: nums,
      highlighting: [],
      variables: { res: finalRes },
      explanation: `Loop finished. The accumulated result is the missing number: ${finalRes}.`,
      pseudoStep: `RETURN res (res = ${finalRes})`,
      calc: `Result = ${finalRes}`
    });
    addLines(6, 5, 7, 8);

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest">Input Array (nums)</h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {step.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border-2 transition-all duration-200 ${step.highlighting.includes(index)
                        ? 'bg-primary border-primary text-primary-foreground scale-105 shadow-md'
                        : 'bg-muted/30 border-border text-foreground'
                        }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">i = {index}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2 opacity-50 border border-dashed rounded-lg p-1">
                  <div className="w-8 h-8 flex items-center justify-center text-[10px] text-center text-muted-foreground font-mono">
                    n = {nums.length}
                  </div>
                </div>
              </div>
            </Card>

            {step.calc && (
              <Card className="p-4 bg-primary/5 border-primary/10">
                <h3 className="font-semibold mb-2 text-xs text-primary uppercase tracking-wider">Calculation</h3>
                <p className="font-mono text-center text-lg font-bold">{step.calc}</p>
              </Card>
            )}
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
            </Card>

            <Card className="p-4 bg-muted/20 border border-border/40 rounded-lg text-xs space-y-1.5 text-muted-foreground leading-relaxed">
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2">Why this works</h4>
              <p>Consider the sum of indices [0...n] and sum of values in array. Missing Number = Sum(0...n) - Sum(nums).</p>
              <p>This approach computes this difference incrementally: `res` accumulates `n + (0-nums[0]) + (1-nums[1]) + ...` which re-arranges to `(n + 0 + 1 + ... ) - (nums[0] + nums[1] + ...)`, avoiding overflow.</p>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={step.variables} />
        </div>
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