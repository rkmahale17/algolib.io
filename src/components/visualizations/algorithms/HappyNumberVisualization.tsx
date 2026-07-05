import { useState, useMemo } from 'react';
import { SimpleStepControls } from "../shared/SimpleStepControls";
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  activeNumber: number;
  visitSet: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  calculatingMath?: boolean;
}

const languages: VisualizationLanguageMap = {
  typescript: `function isHappy(n: number): boolean {
  const visit = new Set<number>();
  while (!visit.has(n)) {
    visit.add(n);
    n = sumOfSquares(n);
    if (n === 1) {
      return true;
    }
  }
  return false;
}

function sumOfSquares(n: number): number {
  let output = 0;
  while (n > 0) {
    let digit = n % 10;
    output += digit * digit;
    n = Math.floor(n / 10);
  }
  return output;
}`,
  python: `def isHappy(n: int) -> bool:
    visit = set()
    while n not in visit:
        visit.add(n)
        n = sumOfSquares(n)
        if n == 1:
            return True
    return False
    
def sumOfSquares(n: int) -> int:
    output = 0
    while n > 0:
        digit = n % 10
        output += digit ** 2
        n //= 10
    return output`,
  java: `class Solution {
    public static boolean isHappy(int n) {
        Set<Integer> visit = new HashSet<>();
        while (!visit.contains(n)) {
            visit.add(n);
            n = sumOfSquares(n);
            if (n == 1) {
                return true;
            }
        }
        return false;
    }
    private static int sumOfSquares(int n) {
        int output = 0;
        while (n > 0) {
            int digit = n % 10;
            output += digit * digit;
            n /= 10;
        }
        return output;
    }
}`,
  cpp: `class Solution {
public:
    bool isHappy(int n) {
        unordered_set<int> visit;
        while (!visit.count(n)) {
            visit.insert(n);
            n = sumOfSquares(n);
            if (n == 1) {
                return true;
            }
        }
        return false;
    }
private:
    int sumOfSquares(int n) {
        int output = 0;
        while (n > 0) {
            int digit = n % 10;
            output += digit * digit;
            n /= 10;
        }
        return output;
    }
};`
};

export const HappyNumberVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let n = 19;
    let startN = n;
    const visit = new Set<number>();
    
    const addStep = (
      explanation: string,
      pseudo: string,
      vars: any,
      calculatingMath: boolean,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        activeNumber: n,
        visitSet: Array.from(visit),
        variables: vars,
        explanation,
        pseudoStep: pseudo,
        calculatingMath
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      `Initialize isHappy logic with number ${n}.`,
      `isHappy(n=${n})`,
      { n },
      false,
      1, 1, 2, 3
    );

    addStep(
      `Initialize an empty set 'visit' to keep track of numbers we've seen.`,
      "SET visit = set()",
      { n, visit: '{}' },
      false,
      2, 2, 3, 4
    );

    while (true) {
      let cycleDetected = visit.has(n);
      addStep(
        `Check if ${n} is in 'visit' set. ${cycleDetected ? 'It is! We found a cycle.' : 'Not yet seen, proceed.'}`,
        `IF n NOT IN visit  →  ${n} NOT IN {${Array.from(visit).join(", ")}}`,
        { n, visit: JSON.stringify(Array.from(visit)) },
        false,
        3, 3, 4, 5
      );
      
      if (cycleDetected) {
         break;
      }

      visit.add(n);
      addStep(
        `Add ${n} to the 'visit' set to detect future cycles.`,
        `visit.add(${n})`,
        { n, visit: JSON.stringify(Array.from(visit)) },
        false,
        4, 4, 5, 6
      );

      addStep(
        `Calculate the sum of the squares of its digits for n = ${n}.`,
        `n = sumOfSquares(${n})`,
        { n, visit: JSON.stringify(Array.from(visit)) },
        false,
        5, 5, 6, 7
      );
      
      let innerN = n;
      let output = 0;
      addStep(
        `Initialize output = 0 for the sum of squares.`,
        "SET output = 0",
        { n: innerN, output, visit: JSON.stringify(Array.from(visit)) },
        true,
        14, 11, 14, 16
      );

      while (true) {
        addStep(
          `Check if n > 0. Current n is ${innerN}.`,
          `WHILE n > 0  →  ${innerN} > 0`,
          { n: innerN, output, visit: JSON.stringify(Array.from(visit)) },
          true,
          15, 12, 15, 17
        );
        if (innerN <= 0) break;

        let digit = innerN % 10;
        addStep(
          `Extract the rightmost digit: ${innerN} % 10 = ${digit}.`,
          `SET digit = n % 10  →  ${digit}`,
          { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) },
          true,
          16, 13, 16, 18
        );

        output += digit * digit;
        addStep(
          `Square the digit (${digit}^2 = ${digit*digit}) and add to output. output = ${output}.`,
          `SET output += digit * digit  →  ${output}`,
          { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) },
          true,
          17, 14, 17, 19
        );

        innerN = Math.floor(innerN / 10);
        addStep(
          `Remove the last digit from n using integer division. n is now ${innerN}.`,
          `SET n = n // 10  →  ${innerN}`,
          { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) },
          true,
          18, 15, 18, 20
        );
      }
      
      addStep(
        `Return the final computed sum: ${output}.`,
        `RETURN output  →  ${output}`,
        { n: innerN, output, visit: JSON.stringify(Array.from(visit)) },
        true,
        20, 16, 20, 22
      );
      
      n = output;
      addStep(
        `Update n to the new sum: ${n}.`,
        `SET n = ${n}`,
        { n, visit: JSON.stringify(Array.from(visit)) },
        false,
        5, 5, 6, 7
      );

      let isOne = (n === 1);
      addStep(
        `Check if n is 1. Currently n = ${n}.`,
        `IF n == 1  →  ${n} == 1`,
        { n, visit: JSON.stringify(Array.from(visit)) },
        false,
        6, 6, 7, 8
      );

      if (isOne) {
        addStep(
          `n reached 1! The number ${startN} is a Happy Number.`,
          "RETURN True",
          { n, visit: JSON.stringify(Array.from(visit)) },
          false,
          7, 7, 8, 9
        );
        return { steps: newSteps, stepLineNumbers: lines };
      }
    }

    addStep(
      `Cycle detected! ${n} was seen before. Thus, ${startN} is NOT a happy number. Return false.`,
      "RETURN False",
      { n, visit: JSON.stringify(Array.from(visit)) },
      false,
      10, 8, 11, 12
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="bg-muted/30 rounded-lg border border-border/50 p-6 min-h-[200px] flex flex-col justify-center">
            <h3 className="text-sm font-semibold mb-6 text-center text-muted-foreground uppercase tracking-wider">Number Sequence Trajectory</h3>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              {step.visitSet.map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    !step.calculatingMath && step.activeNumber === v 
                      ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30' 
                      : 'bg-muted/50 border-border text-foreground'
                  }`}>
                    <span className="font-bold">{v}</span>
                  </div>
                  {i < step.visitSet.length - 1 && (
                    <div className="text-muted-foreground/60 font-bold">➔</div>
                  )}
                </div>
              ))}
              
              {!step.visitSet.includes(step.activeNumber) && (
                <>
                  {step.visitSet.length > 0 && <div className="text-muted-foreground/60 font-bold">➔</div>}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30 transition-all duration-300">
                     <span className="font-bold">{step.activeNumber}</span>
                  </div>
                </>
              )}
            </div>
            
            {step.pseudoStep === "RETURN False" && (
              <div className="mt-6 text-center animate-pulse text-destructive font-semibold">
                Infinite Cycle Detected!
              </div>
            )}
            {step.pseudoStep === "RETURN True" && (
              <div className="mt-6 text-center animate-bounce text-green-500 font-semibold">
                Happy Number Reached! 🎉
              </div>
            )}
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <Card className="p-5 bg-card border border-border rounded-xl relative overflow-hidden group hover:bg-muted/20 transition-colors">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <span className="text-primary">✨</span> The Philosophy of Happy Numbers
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Happy Number algorithm is essentially a <strong>cycle detection problem</strong> wrapped in a math puzzle. 
              Every number's destiny is one of two paths: it either reduces down to the perfect unity of <strong className="text-foreground">1</strong>, 
              or it falls into an endless, inescapable cycle (like the infamous sequence starting at 4).
              <br/><br/>
              By using a <strong className="text-foreground">Hash Set</strong>, we act as a time traveler leaving breadcrumbs. If we ever step on a crumb we left before, 
              we know we're trapped in a cycle forever! The math behind squaring digits uniquely guarantees that numbers either rapidly shrink or enter a well-known bounded cycle.
            </p>
          </Card>
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
export default HappyNumberVisualization;
