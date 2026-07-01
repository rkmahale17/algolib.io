import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Sparkles } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  digits: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function plusOne(digits: number[]): number[] {
  const n = digits.length;
  for (let i = n - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    } else {
      digits[i] = 0;
    }
  }
  digits.unshift(1);
  return digits;
}`,
  python: `def plusOne(digits: list[int]) -> list[int]:
    n = len(digits)
    for i in range(n - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        else:
            digits[i] = 0
    return [1] + digits`,
  java: `public static class Solution {
    public int[] plusOne(int[] digits) {
        int n = digits.length;
        for (int i = n - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        int[] newDigits = new int[n + 1];
        newDigits[0] = 1;
        return newDigits;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        int n = digits.size();
        for (int i = n - 1; i >= 0; --i) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        digits.insert(digits.begin(), 1);
        return digits;
    }
};`
};

export const PlusOneVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const initialDigits = useMemo(() => [9, 9], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const digits = [...initialDigits];

    const addStep = (
      h: number[],
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        digits: [...digits],
        highlights: h,
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      [],
      "Imagine we have the number 99, but each digit lives in its own magic box! Our mission: Add 1 to the whole number.",
      "plusOne(digits=[9, 9])",
      { digits: `[${digits.join(', ')}]` },
      1, 1, 2, 3
    );

    addStep(
      [],
      "First, let's count our magic boxes. We have 2 boxes here.",
      "SET n = len(digits)",
      { n: digits.length },
      2, 2, 3, 4
    );

    const n = digits.length;
    for (let i = n - 1; i >= 0; i--) {
      addStep(
        [i],
        `We start from the right (the ones place) and move left. We are looking at the box at position ${i}. It has a ${digits[i]} inside!`,
        `FOR i FROM ${n - 1} DOWNTO 0  →  i = ${i}`,
        { i, "digits[i]": digits[i] },
        3, 3, 4, 5
      );

      addStep(
        [i],
        `We ask a simple question: Is the number in this box smaller than 9?`,
        `IF digits[${i}] < 9  →  ${digits[i]} < 9`,
        { i, "digits[i]": digits[i] },
        4, 4, 5, 6
      );

      if (digits[i] < 9) {
        digits[i]++;
        addStep(
          [i],
          `Yes, it is! So we just add 1 to it. Now it becomes ${digits[i]}. Easy peasy!`,
          `SET digits[${i}] += 1  →  ${digits[i]}`,
          { i, "digits[i]": digits[i] },
          5, 5, 6, 7
        );

        addStep(
          [i],
          "Since it didn't turn into a 10, we don't have to carry anything over. Our mission is complete!",
          `RETURN digits  →  [${digits.join(", ")}]`,
          { result: `[${digits.join(', ')}]` },
          6, 6, 7, 8
        );
        return { steps: stepsList, stepLineNumbers: lines };
      } else {
        digits[i] = 0;
        addStep(
          [i],
          `Oh no, it's a 9! 9 plus 1 is 10, but a magic box can only hold one digit. So we turn it into a 0, and carry a 1 to the next box on the left.`,
          `SET digits[${i}] = 0`,
          { i, "digits[i]": digits[i] },
          8, 8, 9, 10
        );
      }
    }

    digits.unshift(1);
    addStep(
      [0],
      `We ran out of boxes, but we still have a 1 to carry over! So, we magically create a brand new box at the very front and put our 1 inside.`,
      "digits.unshift(1)  →  [1, 0, 0]",
      { digits: `[${digits.join(', ')}]` },
      11, 9, 11, 12
    );

    addStep(
      [],
      "Ta-da! 99 plus 1 equals 100. We successfully added one to our big number! 🎉",
      `RETURN digits  →  [${digits.join(", ")}]`,
      { result: `[${digits.join(', ')}]` },
      12, 9, 13, 13
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [initialDigits]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-bold text-foreground opacity-90">
                Plus One Magic Adventure!
              </h2>
            </div>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-6 text-center">
                  Magic Number Boxes
                </h4>
                <div className="flex gap-4 justify-center">
                  {step.digits.map((num, idx) => {
                    const isCurrent = step.highlights.includes(idx);
                    const isNewBox = step.pseudoStep.includes("unshift") && idx === 0;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-16 h-16 flex items-center justify-center rounded-2xl border-4 font-black transition-all duration-300 shadow-sm ${
                            isCurrent 
                              ? isNewBox 
                                ? "border-green-500 bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200 scale-110 z-10 shadow-green-500/20 shadow-xl"
                                : "border-indigo-500 bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 scale-110 z-10 shadow-indigo-500/20 shadow-xl"
                              : "border-gray-200 bg-white text-gray-800 dark:border-border dark:bg-muted dark:text-foreground"
                          }`}
                        >
                          <span className="text-3xl">{num}</span>
                        </div>
                        {isCurrent && (
                          <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                            isNewBox ? "text-green-700 bg-green-200 dark:text-green-200 dark:bg-green-900" : "text-indigo-700 bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-900"
                          }`}>
                            {isNewBox ? "New!" : "Here!"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
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
export default PlusOneVisualization;
