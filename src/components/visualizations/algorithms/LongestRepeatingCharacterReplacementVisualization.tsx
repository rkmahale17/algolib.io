import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  l: number;
  r: number;
  maxf: number;
  res: number;
  count: Record<string, number>;
  highlightedLines: number[];
  message: string;
}

export const LongestRepeatingCharacterReplacementVisualization = () => {
  const s = "AABABBA";
  const k = 1;

  const code = `function characterReplacement(s: string, k: number): number {
  const count: { [char: string]: number } = {};
  let res = 0;
  let l = 0;
  let maxf = 0;

  for (let r = 0; r < s.length; r++) {
    count[s[r]] = 1 + (count[s[r]] || 0);
    maxf = Math.max(maxf, count[s[r]]);

    while ((r - l + 1) - maxf > k) {
      count[s[l]] -= 1;
      l += 1;
    }

    res = Math.max(res, r - l + 1);
  }

  return res;
}`;

  const steps: Step[] = [
    {
      l: 0,
      r: -1,
      maxf: 0,
      res: 0,
      count: {},
      highlightedLines: [2, 3, 4, 5],
      message: "Initialize variables: l = 0, res = 0, count = {}, maxf = 0."
    },
    {
      l: 0,
      r: 0,
      maxf: 0,
      res: 0,
      count: {},
      highlightedLines: [7],
      message: "Start loop with r = 0. Character at s[0] is 'A'."
    },
    {
      l: 0,
      r: 0,
      maxf: 0,
      res: 0,
      count: { A: 1 },
      highlightedLines: [8],
      message: "Increment frequency of 'A'. count['A'] becomes 1."
    },
    {
      l: 0,
      r: 0,
      maxf: 1,
      res: 0,
      count: { A: 1 },
      highlightedLines: [9],
      message: "Update maxf: max(0, 1) = 1."
    },
    {
      l: 0,
      r: 0,
      maxf: 1,
      res: 0,
      count: { A: 1 },
      highlightedLines: [11],
      message: "Window size (1) - maxf (1) = 0. Since 0 <= k (1), the window is valid."
    },
    {
      l: 0,
      r: 0,
      maxf: 1,
      res: 1,
      count: { A: 1 },
      highlightedLines: [16],
      message: "Update res: max(0, 1) = 1."
    },
    {
      l: 0,
      r: 1,
      maxf: 1,
      res: 1,
      count: { A: 1 },
      highlightedLines: [7],
      message: "Increment r to 1. Character at s[1] is 'A'."
    },
    {
      l: 0,
      r: 1,
      maxf: 1,
      res: 1,
      count: { A: 2 },
      highlightedLines: [8],
      message: "Increment frequency of 'A'. count['A'] becomes 2."
    },
    {
      l: 0,
      r: 1,
      maxf: 2,
      res: 1,
      count: { A: 2 },
      highlightedLines: [9],
      message: "Update maxf: max(1, 2) = 2."
    },
    {
      l: 0,
      r: 1,
      maxf: 2,
      res: 1,
      count: { A: 2 },
      highlightedLines: [11],
      message: "Window size (2) - maxf (2) = 0 <= k. Window is valid."
    },
    {
      l: 0,
      r: 1,
      maxf: 2,
      res: 2,
      count: { A: 2 },
      highlightedLines: [16],
      message: "Update res: max(1, 2) = 2."
    },
    {
      l: 0,
      r: 2,
      maxf: 2,
      res: 2,
      count: { A: 2 },
      highlightedLines: [7],
      message: "Increment r to 2. Character at s[2] is 'B'."
    },
    {
      l: 0,
      r: 2,
      maxf: 2,
      res: 2,
      count: { A: 2, B: 1 },
      highlightedLines: [8],
      message: "Increment frequency of 'B'. count['B'] becomes 1."
    },
    {
      l: 0,
      r: 2,
      maxf: 2,
      res: 2,
      count: { A: 2, B: 1 },
      highlightedLines: [9],
      message: "Update maxf: max(2, 1) = 2."
    },
    {
      l: 0,
      r: 2,
      maxf: 2,
      res: 2,
      count: { A: 2, B: 1 },
      highlightedLines: [11],
      message: "Window size (3) - maxf (2) = 1 <= k. Window is valid (one character can be replaced)."
    },
    {
      l: 0,
      r: 2,
      maxf: 2,
      res: 3,
      count: { A: 2, B: 1 },
      highlightedLines: [16],
      message: "Update res: max(2, 3) = 3."
    },
    {
      l: 0,
      r: 3,
      maxf: 2,
      res: 3,
      count: { A: 2, B: 1 },
      highlightedLines: [7],
      message: "Increment r to 3. Character at s[3] is 'A'."
    },
    {
      l: 0,
      r: 3,
      maxf: 2,
      res: 3,
      count: { A: 3, B: 1 },
      highlightedLines: [8],
      message: "Increment frequency of 'A'. count['A'] becomes 3."
    },
    {
      l: 0,
      r: 3,
      maxf: 3,
      res: 3,
      count: { A: 3, B: 1 },
      highlightedLines: [9],
      message: "Update maxf: max(2, 3) = 3."
    },
    {
      l: 0,
      r: 3,
      maxf: 3,
      res: 3,
      count: { A: 3, B: 1 },
      highlightedLines: [11],
      message: "Window size (4) - maxf (3) = 1 <= k. Window is valid."
    },
    {
      l: 0,
      r: 3,
      maxf: 3,
      res: 4,
      count: { A: 3, B: 1 },
      highlightedLines: [16],
      message: "Update res: max(3, 4) = 4."
    },
    {
      l: 0,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 3, B: 1 },
      highlightedLines: [7],
      message: "Increment r to 4. Character at s[4] is 'B'."
    },
    {
      l: 0,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 3, B: 2 },
      highlightedLines: [8],
      message: "Increment frequency of 'B'. count['B'] becomes 2."
    },
    {
      l: 0,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 3, B: 2 },
      highlightedLines: [9],
      message: "Update maxf: max(3, 2) = 3."
    },
    {
      l: 0,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 3, B: 2 },
      highlightedLines: [11],
      message: "Window size (5) - maxf (3) = 2 > k. Window is invalid, need to shrink."
    },
    {
      l: 0,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [12],
      message: "Decrement count of character at l (index 0): 'A'."
    },
    {
      l: 1,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [13],
      message: "Increment l to 1."
    },
    {
      l: 1,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [11],
      message: "Window size (4) - maxf (3) = 1 <= k. Window is now valid."
    },
    {
      l: 1,
      r: 4,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [16],
      message: "Update res: max(4, 4) = 4."
    },
    {
      l: 1,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [7],
      message: "Increment r to 5. Character at s[5] is 'B'."
    },
    {
      l: 1,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [8],
      message: "Increment frequency of 'B'. count['B'] becomes 3."
    },
    {
      l: 1,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [9],
      message: "Update maxf: max(3, 3) = 3."
    },
    {
      l: 1,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [11],
      message: "Window size (5) - maxf (3) = 2 > k. Window is invalid."
    },
    {
      l: 1,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 1, B: 3 },
      highlightedLines: [12],
      message: "Decrement count of character at l (index 1): 'A'."
    },
    {
      l: 2,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 1, B: 3 },
      highlightedLines: [13],
      message: "Increment l to 2."
    },
    {
      l: 2,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 1, B: 3 },
      highlightedLines: [11],
      message: "Window size (4) - maxf (3) = 1 <= k. Window is valid."
    },
    {
      l: 2,
      r: 5,
      maxf: 3,
      res: 4,
      count: { A: 1, B: 3 },
      highlightedLines: [16],
      message: "Update res: max(4, 4) = 4."
    },
    {
      l: 2,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 1, B: 3 },
      highlightedLines: [7],
      message: "Increment r to 6. Character at s[6] is 'A'."
    },
    {
      l: 2,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [8],
      message: "Increment frequency of 'A'. count['A'] becomes 2."
    },
    {
      l: 2,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [9],
      message: "Update maxf: max(3, 2) = 3."
    },
    {
      l: 2,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 3 },
      highlightedLines: [11],
      message: "Window size (5) - maxf (3) = 2 > k. Window is invalid."
    },
    {
      l: 2,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [12],
      message: "Decrement count of character at l (index 2): 'B'."
    },
    {
      l: 3,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [13],
      message: "Increment l to 3."
    },
    {
      l: 3,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [11],
      message: "Window size (4) - maxf (3) = 1 <= k. Window is valid."
    },
    {
      l: 3,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [16],
      message: "Update res: max(4, 4) = 4."
    },
    {
      l: 3,
      r: 6,
      maxf: 3,
      res: 4,
      count: { A: 2, B: 2 },
      highlightedLines: [19],
      message: "Loop finished. Final result is 4."
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Input String: "{s}" (k={k})</h3>
              <div className="flex flex-wrap gap-2">
                {s.split('').map((char, idx) => {
                  const isInWindow = idx >= currentStep.l && idx <= currentStep.r;
                  const isLeft = idx === currentStep.l;
                  const isRight = idx === currentStep.r;
                  return (
                    <div key={idx} className="relative">
                      <motion.div
                        animate={{
                          backgroundColor: isInWindow ? 'rgba(132, 204, 22, 0.2)' : 'transparent',
                          borderColor: isInWindow ? '#84CC16' : '#e2e8f0',
                          scale: isInWindow ? 1.05 : 1,
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded border-2 font-mono font-bold text-black"
                      >
                        {char}
                      </motion.div>
                      {isLeft && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600">l</div>
                      )}
                      {isRight && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-600">r</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <VariablePanel
              variables={{
                l: currentStep.l,
                r: currentStep.r,
                maxf: currentStep.maxf,
                res: currentStep.res,
                ...(Object.keys(currentStep.count).length > 0 && { count: JSON.stringify(currentStep.count) })
              }}
            />

            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-black leading-relaxed">{currentStep.message}</p>
            </Card>
          </div>
        </Card>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={currentStep.highlightedLines}
        />
      }
    />
  );
};
