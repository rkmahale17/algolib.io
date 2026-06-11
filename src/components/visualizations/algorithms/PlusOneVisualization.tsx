import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Sparkles } from 'lucide-react';

interface Step {
  digits: number[];
  highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const PlusOneVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // We use [9, 9] as it beautifully shows the carry-over and new digit creation!
  const initialDigits = [9, 9];

  const code = `function plusOne(digits: number[]): number[] {
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
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const digits = [...initialDigits];

    stepsList.push({
      digits: [...digits],
      highlights: [],
      variables: { digits: `[${digits.join(', ')}]` },
      explanation: "Imagine we have the number 99, but each digit lives in its own magic box! Our mission: Add 1 to the whole number.",
      lineExecution: "function plusOne(digits: number[]): number[] {",
      highlightedLines: [1]
    });

    stepsList.push({
      digits: [...digits],
      highlights: [],
      variables: { n: digits.length },
      explanation: "First, let's count our magic boxes. We have 2 boxes here.",
      lineExecution: "const n = digits.length;",
      highlightedLines: [2]
    });

    const n = digits.length;
    for (let i = n - 1; i >= 0; i--) {
      stepsList.push({
        digits: [...digits],
        highlights: [i],
        variables: { i, "digits[i]": digits[i] },
        explanation: `We start from the right (the ones place) and move left. We are looking at the box at position ${i}. It has a ${digits[i]} inside!`,
        lineExecution: "for (let i = n - 1; i >= 0; i--) {",
        highlightedLines: [3]
      });

      stepsList.push({
        digits: [...digits],
        highlights: [i],
        variables: { i, "digits[i]": digits[i] },
        explanation: `We ask a simple question: Is the number in this box smaller than 9?`,
        lineExecution: "if (digits[i] < 9) {",
        highlightedLines: [4]
      });

      if (digits[i] < 9) {
        digits[i]++;
        stepsList.push({
          digits: [...digits],
          highlights: [i],
          variables: { i, "digits[i]": digits[i] },
          explanation: `Yes, it is! So we just add 1 to it. Now it becomes ${digits[i]}. Easy peasy!`,
          lineExecution: "digits[i]++;",
          highlightedLines: [5]
        });

        stepsList.push({
          digits: [...digits],
          highlights: [i],
          variables: { result: `[${digits.join(', ')}]` },
          explanation: "Since it didn't turn into a 10, we don't have to carry anything over. Our mission is complete!",
          lineExecution: "return digits;",
          highlightedLines: [6]
        });
        return stepsList;
      } else {
        digits[i] = 0;
        stepsList.push({
          digits: [...digits],
          highlights: [i],
          variables: { i, "digits[i]": digits[i] },
          explanation: `Oh no, it's a 9! 9 plus 1 is 10, but a magic box can only hold one digit. So we turn it into a 0, and carry a 1 to the next box on the left.`,
          lineExecution: "digits[i] = 0;",
          highlightedLines: [8]
        });
      }
    }

    digits.unshift(1);
    stepsList.push({
      digits: [...digits],
      highlights: [0], // Highlight the new digit at the front
      variables: { digits: `[${digits.join(', ')}]` },
      explanation: `We ran out of boxes, but we still have a 1 to carry over! So, we magically create a brand new box at the very front and put our 1 inside.`,
      lineExecution: "digits.unshift(1);",
      highlightedLines: [11]
    });

    stepsList.push({
      digits: [...digits],
      highlights: [],
      variables: { result: `[${digits.join(', ')}]` },
      explanation: "Ta-da! 99 plus 1 equals 100. We successfully added one to our big number! 🎉",
      lineExecution: "return digits;",
      highlightedLines: [12]
    });

    return stepsList;
  }, [initialDigits]);

  const step = steps[currentStep];

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
                    // Special case: if we are at the unshift step, index 0 is the newly added box
                    const isNewBox = step.highlightedLines.includes(11) && idx === 0;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className={`w-16 h-16 flex items-center justify-center rounded-2xl border-4 font-black transition-all duration-300 shadow-sm ${
                            isCurrent 
                              ? isNewBox 
                                ? "border-green-500 bg-green-100 text-green-900 scale-110 z-10 shadow-green-500/20 shadow-xl"
                                : "border-indigo-500 bg-indigo-100 text-indigo-900 scale-110 z-10 shadow-indigo-500/20 shadow-xl"
                              : "border-gray-200 bg-white text-gray-800"
                          }`}
                        >
                          <span className="text-3xl">{num}</span>
                        </div>
                        {isCurrent && (
                          <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                            isNewBox ? "text-green-700 bg-green-200" : "text-indigo-700 bg-indigo-200"
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

          <div>
             <Card className="p-5 border-l-4 border-indigo-500 bg-indigo-500/5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-600/80 dark:text-indigo-400/80 mb-2">
                       Current Magic Spell (Code)
                    </h4>
                    <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block text-foreground">
                       {step.lineExecution}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-600/80 dark:text-indigo-400/80 mb-1">
                       Story Time
                    </h4>
                    <p className="text-[15px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
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
