import { useEffect, useState } from 'react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  resArray: number[];
  n1Array: string[];
  n2Array: string[];
  resHighlights: number[];
  n1Highlights: number[];
  n2Highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
}

export const MultiplyStringsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function multiply(num1: string, num2: string): string {
    if (num1 === "0" || num2 === "0") {
        return "0";
    }

    const res = new Array(num1.length + num2.length).fill(0);
    const n1 = num1.split("").reverse();
    const n2 = num2.split("").reverse();

    for (let i = 0; i < n1.length; i++) {
        for (let j = 0; j < n2.length; j++) {
            const digitProduct = Number(n1[i]) * Number(n2[j]);
            res[i + j] += digitProduct;
            res[i + j + 1] += Math.floor(res[i + j] / 10);
            res[i + j] %= 10;
        }
    }

    res.reverse();

    let start = 0;
    while (start < res.length && res[start] === 0) {
        start++;
    }

    return res.slice(start).join("");
}`;

  const generateSteps = () => {
    const num1 = "123";
    const num2 = "45";
    const newSteps: Step[] = [];

    // Line 2
    newSteps.push({
      resArray: [], n1Array: [], n2Array: [],
      resHighlights: [], n1Highlights: [], n2Highlights: [],
      variables: { num1, num2 },
      explanation: `First, let's see if any of our numbers are 0. If we multiply anything by 0, the answer is just 0! Here, we have "${num1}" and "${num2}". Neither is "0", so we can continue.`,
      lineNumber: 2
    });

    const res = new Array(num1.length + num2.length).fill(0);
    // Line 6
    newSteps.push({
      resArray: [...res], n1Array: [], n2Array: [],
      resHighlights: [], n1Highlights: [], n2Highlights: [],
      variables: { num1, num2, "res.length": res.length },
      explanation: `We make a list called 'res' (result) to hold our answer digits. It has ${res.length} empty spots (0s) because ${num1} has 3 digits and ${num2} has 2 digits (3 + 2 = 5). The biggest possible answer won't need more than 5 spots!`,
      lineNumber: 6
    });

    const n1 = num1.split("").reverse();
    const n2 = num2.split("").reverse();
    // Line 7
    newSteps.push({
      resArray: [...res], n1Array: [...n1], n2Array: [...n2],
      resHighlights: [], n1Highlights: [], n2Highlights: [],
      variables: { num1, num2 },
      explanation: `To multiply like we do on paper, we flip both numbers backwards so we can start from the ones place (the rightmost digit). So, "${num1}" becomes n1 = [${n1.join(', ')}] and "${num2}" becomes n2 = [${n2.join(', ')}].`,
      lineNumber: 7
    });

    for (let i = 0; i < n1.length; i++) {
        // Line 10
        newSteps.push({
            resArray: [...res], n1Array: [...n1], n2Array: [...n2],
            resHighlights: [], n1Highlights: [i], n2Highlights: [],
            variables: { i, 'n1[i]': n1[i] },
            explanation: `We pick the digit '${n1[i]}' from our first flipped number (n1). We will multiply this with each digit of the second number (n2).`,
            lineNumber: 10
        });

        for (let j = 0; j < n2.length; j++) {
            // Line 11
            newSteps.push({
                resArray: [...res], n1Array: [...n1], n2Array: [...n2],
                resHighlights: [], n1Highlights: [i], n2Highlights: [j],
                variables: { i, j, 'n1[i]': n1[i], 'n2[j]': n2[j] },
                explanation: `Now we look at the digit '${n2[j]}' from our second flipped number (n2).`,
                lineNumber: 11
            });

            const digitProduct = Number(n1[i]) * Number(n2[j]);
            // Line 12
            newSteps.push({
                resArray: [...res], n1Array: [...n1], n2Array: [...n2],
                resHighlights: [], n1Highlights: [i], n2Highlights: [j],
                variables: { i, j, digitProduct, 'n1[i]': n1[i], 'n2[j]': n2[j] },
                explanation: `We multiply '${n1[i]}' and '${n2[j]}' together. ${n1[i]} * ${n2[j]} = ${digitProduct}.`,
                lineNumber: 12
            });

            res[i + j] += digitProduct;
            // Line 13
            newSteps.push({
                resArray: [...res], n1Array: [...n1], n2Array: [...n2],
                resHighlights: [i + j], n1Highlights: [i], n2Highlights: [j],
                variables: { i, j, digitProduct, 'res[i+j]': res[i+j] },
                explanation: `We add this product (${digitProduct}) to the spot at index ${i + j} in our 'res' list.`,
                lineNumber: 13
            });

            const carry = Math.floor(res[i + j] / 10);
            res[i + j + 1] += carry;
            // Line 14
            newSteps.push({
                resArray: [...res], n1Array: [...n1], n2Array: [...n2],
                resHighlights: [i + j + 1], n1Highlights: [i], n2Highlights: [j],
                variables: { i, j, carry, 'res[i+j+1]': res[i+j+1] },
                explanation: `If the spot got too big (10 or more), we carry over the tens part (${carry}) to the next spot (index ${i + j + 1}).`,
                lineNumber: 14
            });

            res[i + j] %= 10;
            // Line 15
            newSteps.push({
                resArray: [...res], n1Array: [...n1], n2Array: [...n2],
                resHighlights: [i + j], n1Highlights: [i], n2Highlights: [j],
                variables: { i, j, 'res[i+j]': res[i+j] },
                explanation: `And we keep only the ones part (the last digit) in the current spot (index ${i + j}). So it becomes ${res[i+j]}.`,
                lineNumber: 15
            });
        }
    }

    res.reverse();
    // Line 19
    newSteps.push({
        resArray: [...res], n1Array: [...n1], n2Array: [...n2],
        resHighlights: [], n1Highlights: [], n2Highlights: [],
        variables: {},
        explanation: `We have multiplied all the digits! But remember we flipped the numbers earlier? We need to flip our answer list back to normal. Now the biggest place values are on the left.`,
        lineNumber: 19
    });

    let start = 0;
    // Line 21
    newSteps.push({
        resArray: [...res], n1Array: [...n1], n2Array: [...n2],
        resHighlights: [start], n1Highlights: [], n2Highlights: [],
        variables: { start },
        explanation: `Let's find the true start of our number. Sometimes we have extra zeros at the very beginning (like 0123). We want to skip them!`,
        lineNumber: 21
    });

    while (start < res.length && res[start] === 0) {
        // Line 22
        newSteps.push({
            resArray: [...res], n1Array: [...n1], n2Array: [...n2],
            resHighlights: [start], n1Highlights: [], n2Highlights: [],
            variables: { start, 'res[start]': res[start] },
            explanation: `The spot at index ${start} has a 0, so we will skip it.`,
            lineNumber: 22
        });
        start++;
        // Line 23
        newSteps.push({
            resArray: [...res], n1Array: [...n1], n2Array: [...n2],
            resHighlights: [start], n1Highlights: [], n2Highlights: [],
            variables: { start },
            explanation: `Moving our start point one step to the right.`,
            lineNumber: 23
        });
    }
    
    // Line 26
    newSteps.push({
        resArray: [...res], n1Array: [...n1], n2Array: [...n2],
        resHighlights: res.map((_, idx) => idx).filter(idx => idx >= start), n1Highlights: [], n2Highlights: [],
        variables: { finalResult: res.slice(start).join("") },
        explanation: `Yay! We got our final answer! We just glue the remaining digits together. The answer is "${res.slice(start).join("")}". You are a math superstar! ⭐`,
        lineNumber: 26
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-6 bg-muted/30 rounded-lg border border-border/50 p-6">
            {currentStep.n1Array.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">First Flipped Number (n1)</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentStep.n1Array.map((value, idx) => (
                    <div key={`n1-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                          currentStep.n1Highlights.includes(idx)
                            ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        <span className="font-semibold text-base sm:text-lg">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.n2Array.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Second Flipped Number (n2)</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentStep.n2Array.map((value, idx) => (
                    <div key={`n2-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                          currentStep.n2Highlights.includes(idx)
                            ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        <span className="font-semibold text-base sm:text-lg">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Result List (res)</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {currentStep.resArray.length > 0 ? currentStep.resArray.map((value, idx) => (
                  <div key={`res-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep.resHighlights.includes(idx)
                          ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground'
                          : 'bg-muted/50 border-border text-foreground'
                      }`}
                    >
                      <span className="font-semibold text-base sm:text-lg">{value}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground italic">Waiting to create the list...</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
