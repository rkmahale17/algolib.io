import { useEffect, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import confetti from 'canvas-confetti';

interface Step {
  nums: number[];
  currentIndex: number;
  res: number;
  prevRes: number;
  currentVal: number;
  binaryRes: string;
  binaryVal: string;
  explanation: string;
  phase: 'init' | 'loop' | 'xor' | 'done';
  pseudoStep: string;
  variables: Record<string, any>;
}

interface TestCase {
  id: string;
  name: string;
  nums: number[];
  expected: number;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', nums: [2, 2, 1], expected: 1 },
  { id: 'ex2', name: 'Example 2', nums: [4, 1, 2, 1, 2], expected: 4 },
  { id: 'ex3', name: 'Example 3', nums: [1], expected: 1 },
  { id: 'ex4', name: 'Five Elements', nums: [7, 3, 5, 3, 7], expected: 5 }
];

const languages: VisualizationLanguageMap = {
  typescript: `function singleNumber(nums: number[]): number {
  let res = 0;
  for (const n of nums) {
    res ^= n;
  }
  return res;
}`,
  python: `def singleNumber(nums: list[int]) -> int:
    res = 0
    for n in nums:
        res ^= n
    return res`,
  java: `public static class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int n : nums) {
            res ^= n;
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for (int n : nums) {
            res ^= n;
        }
        return res;
    }
};`
};

export const SingleNumberVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const nums = selectedTestCase.nums;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let res = 0;

    const toBinary = (num: number) => {
      const maxVal = Math.max(...nums, 1);
      const bitLength = Math.max(maxVal.toString(2).length, 4);
      return (num >>> 0).toString(2).padStart(bitLength, '0');
    };

    const getVariables = (currentIndex: number, currentVal: number, extra: Record<string, any> = {}) => {
      return {
        'nums': JSON.stringify(nums),
        'res': res,
        'res_binary': toBinary(res),
        'n': currentIndex >= 0 && currentIndex < nums.length ? currentVal : 'N/A',
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      currentIndex: number,
      prevRes: number,
      currentVal: number,
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        nums: [...nums],
        currentIndex,
        res,
        prevRes,
        currentVal,
        binaryRes: toBinary(res),
        binaryVal: toBinary(currentVal),
        explanation,
        pseudoStep: pseudo,
        phase,
        variables: getVariables(currentIndex, currentVal, variablesExtra)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      `Start singleNumber function. We are given an array nums: [${nums.join(', ')}].`,
      "singleNumber(nums)",
      'init', -1, 0, 0, {},
      1, 1, 2, 3
    );

    pushStep(
      `Initialize res = 0. Any number XORed with 0 stays unchanged (0 ^ x = x).`,
      "SET res = 0",
      'init', -1, 0, 0, {},
      2, 2, 3, 4
    );

    pushStep(
      `Start iterating through each number n in nums.`,
      "FOR n IN nums",
      'loop', -1, 0, 0, {},
      3, 3, 4, 5
    );

    for (let idx = 0; idx < nums.length; idx++) {
      const n = nums[idx];
      
      pushStep(
        `Loop iteration: current number n = ${n} (at index ${idx}).`,
        `// n = ${n}`,
        'loop', idx, res, n, {},
        3, 3, 4, 5
      );

      const prevRes = res;
      res ^= n;
      pushStep(
        `Perform bitwise XOR: res (${prevRes}) ^ n (${n}) = ${res}. In binary: ${toBinary(prevRes)} ^ ${toBinary(n)} = ${toBinary(res)}.`,
        `res ^= n  →  ${res}`,
        'xor', idx, prevRes, n, {},
        4, 4, 5, 6
      );
    }

    pushStep(
      `Finished iterating through all elements in nums.`,
      "// loop finished",
      'loop', nums.length, res, 0, {},
      3, 3, 4, 5
    );

    pushStep(
      `Return the final result res = ${res}. Since all duplicate elements cancel out to 0 (x ^ x = 0), only the unique single number remains.`,
      `RETURN res  →  ${res}`,
      'done', -1, res, 0, { return: res },
      6, 5, 7, 8
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const { currentIndex, res, prevRes, currentVal, binaryRes, binaryVal } = currentStep;

  const isProcessed = (idx: number) => {
    return currentIndex !== -1 && idx < currentIndex;
  };

  return (
    <div className="space-y-6">
      {/* Test Cases Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          Test Cases
        </h3>
        <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tc.name} ({tc.nums.length} items)
            </button>
          ))}
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Numbers Array blocks */}
            <Card className="p-4 bg-card border border-border shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Numbers Array (nums)
              </span>
              <div className="flex gap-2 flex-wrap">
                {selectedTestCase.nums.map((num, idx) => {
                  const isActive = currentIndex === idx;
                  const processed = isProcessed(idx);

                  return (
                    <motion.div
                      key={idx}
                      animate={isActive ? { scale: [1, 1.12, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                      className={`w-9 h-9 rounded-md border flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isActive
                          ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-extrabold ring-2 ring-amber-500/20'
                          : processed
                          ? 'bg-muted/50 border-border text-foreground/45 opacity-60'
                          : 'bg-card border-border text-foreground'
                      }`}
                    >
                      <span>{num}</span>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Bitwise XOR calculations */}
            <Card className="p-4 bg-card border border-border shadow-sm space-y-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
                Bitwise XOR Simulation
              </span>

              <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-3 font-mono text-xs max-w-sm mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">res:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{prevRes}</span>
                    <span className="text-[10px] text-primary tracking-widest">{binaryRes}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    <span className="w-4 h-4 flex items-center justify-center bg-primary/10 text-primary rounded-full font-bold">
                      ^
                    </span>
                    n:
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">
                      {currentIndex >= 0 && currentIndex < selectedTestCase.nums.length ? currentVal : '0'}
                    </span>
                    <span className="text-[10px] text-amber-500 tracking-widest">
                      {currentIndex >= 0 && currentIndex < selectedTestCase.nums.length ? binaryVal : '0000'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">result:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-base font-extrabold text-primary">{res}</span>
                    <span className="text-[10px] text-primary font-bold tracking-widest">{binaryRes}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Explanation Text */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4 h-full flex flex-col">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            <VariablePanel variables={currentStep.variables} />
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
    </div>
  );
};
export default SingleNumberVisualization;
