import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  n: number;
  stack: string[];
  result: string[];
  openN: number;
  closedN: number;
  message: string;
  lineNumber: number;
}

export const GenerateParenthesesVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function generateParenthesis(n: number): string[] {
  const stack: string[] = [];
  const result: string[] = [];

  const backtrack = (openN: number, closedN: number): void => {
    if (openN === n && closedN === n) {
      result.push(stack.join(""));
      return;
    }

    if (openN < n) {
      stack.push("(");
      backtrack(openN + 1, closedN);
      stack.pop();
    }

    if (closedN < openN) {
      stack.push(")");
      backtrack(openN, closedN + 1);
      stack.pop();
    }
  };

  backtrack(0, 0);
  return result;
}`;

  const generateSteps = () => {
    const n = 3; 
    const newSteps: Step[] = [];
    const stack: string[] = [];
    const result: string[] = [];

    newSteps.push({
      n, stack: [...stack], result: [...result], openN: 0, closedN: 0,
      message: `We want to build well-formed parenthesis strings with ${n} pairs. Let's start with an empty stack and an empty result list!`,
      lineNumber: 2
    });

    const backtrack = (openN: number, closedN: number) => {
      newSteps.push({
        n, stack: [...stack], result: [...result], openN, closedN,
        message: `Checking our current state: We have placed ${openN} '(' and ${closedN} ')'.`,
        lineNumber: 5
      });

      newSteps.push({
        n, stack: [...stack], result: [...result], openN, closedN,
        message: `Did we use all ${n} open and ${n} closed parentheses? (${openN} === ${n} and ${closedN} === ${n})`,
        lineNumber: 6
      });

      if (openN === n && closedN === n) {
        result.push(stack.join(""));
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Yes! We successfully built a complete and valid string: "${stack.join("")}". Let's save it to our result list!`,
          lineNumber: 7
        });
        
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Going back (returning) to explore other possibilities.`,
          lineNumber: 8
        });
        return;
      }

      newSteps.push({
        n, stack: [...stack], result: [...result], openN, closedN,
        message: `Can we add an open parenthesis '('? We can if we haven't reached our limit of ${n}. (${openN} < ${n})`,
        lineNumber: 11
      });

      if (openN < n) {
        stack.push("(");
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Yes, we can! Let's add '(' to our building stack.`,
          lineNumber: 12
        });

        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Now let's move forward and see what we can build next with this '(' in place.`,
          lineNumber: 13
        });
        backtrack(openN + 1, closedN);

        stack.pop();
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Backtracking! We've explored everything with that last '('. Let's remove it and try something else.`,
          lineNumber: 14
        });
      }

      newSteps.push({
        n, stack: [...stack], result: [...result], openN, closedN,
        message: `Can we add a closed parenthesis ')'? We can only do this if it matches an open one we've already placed! (${closedN} < ${openN})`,
        lineNumber: 17
      });

      if (closedN < openN) {
        stack.push(")");
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Yes! We have an unmatched '(' waiting for a ')'. Let's add ')' to our building stack.`,
          lineNumber: 18
        });

        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Now let's move forward and explore what we can build next with this ')' in place.`,
          lineNumber: 19
        });
        backtrack(openN, closedN + 1);

        stack.pop();
        newSteps.push({
          n, stack: [...stack], result: [...result], openN, closedN,
          message: `Backtracking! We've explored everything with that last ')'. Let's remove it and try something else.`,
          lineNumber: 20
        });
      }
    };

    newSteps.push({
      n, stack: [...stack], result: [...result], openN: 0, closedN: 0,
      message: `Let's start the building process from the very beginning.`,
      lineNumber: 24
    });
    backtrack(0, 0);

    newSteps.push({
      n, stack: [...stack], result: [...result], openN: 0, closedN: 0,
      message: `Awesome! We have explored all possible paths and generated every valid combination!`,
      lineNumber: 25
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border shadow-sm flex flex-col">
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Building the String (Stack)</h3>
            <div className="flex gap-2 mb-2 min-h-[4rem] items-center p-4 rounded-xl bg-muted/30 border border-muted">
              {currentStep.stack.length > 0 ? (
                currentStep.stack.map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 flex items-center justify-center text-2xl font-bold rounded-lg border-2 shadow-sm transition-all animate-in zoom-in ${
                      char === "(" 
                        ? "bg-blue-500/20 text-blue-600 border-blue-500/50 dark:text-blue-400 dark:border-blue-400/50" 
                        : "bg-green-500/20 text-green-600 border-green-500/50 dark:text-green-400 dark:border-green-400/50"
                    }`}
                  >
                    {char}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground italic flex items-center h-14 px-2">Start placing blocks...</div>
              )}
            </div>
            <p className="text-xs text-muted-foreground ml-2">Open left: {currentStep.n - currentStep.openN} &nbsp; | &nbsp; Needs closing: {currentStep.openN - currentStep.closedN}</p>
          </div>

          <div className="mb-8 flex-1">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Valid Combinations Found ({currentStep.result.length})
            </h3>
            <div className="flex flex-wrap gap-3 max-h-[12rem] overflow-y-auto w-full p-4 border rounded-xl bg-muted/10 min-h-[8rem] content-start">
              {currentStep.result.length > 0 ? (
                currentStep.result.map((str, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-green-400 font-mono font-bold rounded-lg border border-green-500/30 text-lg animate-in fade-in slide-in-from-bottom-2 shadow-sm"
                  >
                    {str}
                  </div>
                ))
              ) : (
                 <div className="text-muted-foreground italic text-sm">No valid combinations found yet...</div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            {/* Descriptive commentary box placed above VariablePanel */}
            <div className="mb-6 p-5 bg-primary/5 border border-primary/20 rounded-xl shadow-inner relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <p className="text-base font-medium text-foreground leading-relaxed">{currentStep.message}</p>
            </div>

            <div className="rounded-xl overflow-hidden border border-muted bg-card shadow-sm">
              <VariablePanel
                variables={{
                  "n (Pairs)": currentStep.n,
                  "openN (Used '(')": currentStep.openN,
                  "closedN (Used ')')": currentStep.closedN,
                }}
              />
            </div>
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="TypeScript"
        />
      </div>
    </div>
  );
};
