import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { ArrowRight, Box } from "lucide-react";

interface Step {
  l1: number[];
  l2: number[];
  result: number[];
  l1Index: number;
  l2Index: number;
  carry: number;
  v1: number | null;
  v2: number | null;
  sum: number | null;
  message: string;
  lineNumber: number;
}

export const AddTwoNumbersVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const intervalRef = useRef<number | null>(null);

  const code = `function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let cur = dummy;
  let carry = 0;

  while (l1 || l2 || carry) {
    const v1 = l1 ? l1.val : 0;
    const v2 = l2 ? l2.val : 0;

    let sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    sum = sum % 10;

    cur.next = new ListNode(sum);

    cur = cur.next;
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }

  return dummy.next;
}`;

  const generateSteps = () => {
    // We are adding 342 + 465 = 807
    // Linked lists represent numbers backward:
    // l1: 2 -> 4 -> 3
    // l2: 5 -> 6 -> 4
    const l1 = [2, 4, 3];
    const l2 = [5, 6, 4];
    const result = [0]; // dummy node
    let carry = 0;
    let l1Index = 0;
    let l2Index = 0;

    const newSteps: Step[] = [];

    newSteps.push({
      l1, l2, result: [...result], l1Index, l2Index, carry, v1: null, v2: null, sum: null,
      message: "We have two numbers stored as chains of boxes (Linked Lists). They are stored backward! The first box is the ones place. Let's add them box by box.",
      lineNumber: 1
    });

    newSteps.push({
      l1, l2, result: [...result], l1Index, l2Index, carry, v1: null, v2: null, sum: null,
      message: "First, we create a 'dummy' box with a 0 to start our new answer chain. We also get ready to track any 'carry-over' if our addition goes over 9.",
      lineNumber: 4
    });

    while (l1Index < l1.length || l2Index < l2.length || carry > 0) {
      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1: null, v2: null, sum: null,
        message: "As long as there are boxes left in either chain, or we have a carry-over, we keep going!",
        lineNumber: 6
      });

      const v1 = l1Index < l1.length ? l1[l1Index] : 0;
      const v2 = l2Index < l2.length ? l2[l2Index] : 0;

      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1, v2, sum: null,
        message: `We look at the current boxes. Chain 1 has ${l1Index < l1.length ? v1 : 'nothing (so 0)'}. Chain 2 has ${l2Index < l2.length ? v2 : 'nothing (so 0)'}.`,
        lineNumber: 8
      });

      let sum = v1 + v2 + carry;
      
      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1, v2, sum,
        message: `We add them together along with our carry! ${v1} + ${v2} + ${carry} (carry) = ${sum}.`,
        lineNumber: 10
      });

      carry = Math.floor(sum / 10);
      sum = sum % 10;

      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1, v2, sum,
        message: `Since a box can only hold one digit (0-9), our new box will hold ${sum}, and we will carry over ${carry} to the next round!`,
        lineNumber: 12
      });

      result.push(sum);

      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1, v2, sum,
        message: `We attach the new box (${sum}) to our answer chain!`,
        lineNumber: 14
      });

      if (l1Index < l1.length) l1Index++;
      if (l2Index < l2.length) l2Index++;

      newSteps.push({
        l1, l2, result: [...result], l1Index, l2Index, carry, v1, v2, sum,
        message: `Now we move our focus to the next boxes in line.`,
        lineNumber: 18
      });
    }

    newSteps.push({
      l1, l2, result: [...result], l1Index, l2Index, carry, v1: null, v2: null, sum: null,
      message: "We're out of boxes and have no carry-overs left! Our new answer chain is complete. We return it, skipping the first 'dummy' box we made.",
      lineNumber: 21
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

  const renderLinkedList = (list: number[], currentIndex: number, label: string, colorClass: string, activeColorClass: string) => {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3 text-muted-foreground">{label}</h4>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {list.map((val, idx) => (
            <React.Fragment key={idx}>
              <div
                className={"w-10 h-10 flex flex-col items-center justify-center text-base font-bold rounded-lg border-2 shadow-sm transition-all " + (idx === currentIndex ? activeColorClass : colorClass)}
              >
                {val}
              </div>
              {idx < list.length - 1 && (
                <ArrowRight className={"w-4 h-4 " + (idx === currentIndex ? "text-primary" : "text-muted-foreground/50")} />
              )}
            </React.Fragment>
          ))}
          {/* If the index is past the end, show a "null" pointer */}
          {currentIndex >= list.length && (
            <React.Fragment>
               <ArrowRight className="w-4 h-4 text-primary" />
               <div className="text-sm font-mono text-muted-foreground px-2 py-1 bg-muted/30 rounded border border-dashed">null</div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  };

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
          
          <div className="mb-4">
             {renderLinkedList(
                currentStep.l1, 
                currentStep.l1Index, 
                "Chain 1 (l1)", 
                "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
                "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-110 z-10 dark:bg-blue-600 dark:border-blue-500 dark:text-white"
             )}
             
             {renderLinkedList(
                currentStep.l2, 
                currentStep.l2Index, 
                "Chain 2 (l2)", 
                "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900",
                "bg-green-500 text-white border-green-600 shadow-md shadow-green-500/30 scale-110 z-10 dark:bg-green-600 dark:border-green-500 dark:text-white"
             )}
          </div>

          <div className="mb-4 flex items-center gap-4 bg-yellow-50/50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/50">
             <div className="flex-1">
               <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1">Carry Over</h4>
               <p className="text-xs text-yellow-700/80 dark:text-yellow-600">Added to the next round</p>
             </div>
             <div className={"w-12 h-12 flex items-center justify-center text-2xl font-black rounded-lg transition-all " + (currentStep.carry > 0 ? "bg-yellow-400 text-yellow-900 shadow-md scale-110" : "bg-muted text-muted-foreground")}>
                {currentStep.carry}
             </div>
          </div>

          <div className="mb-6">
             <div className="p-4 bg-muted/20 border rounded-xl">
               <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                 <Box className="w-4 h-4" /> Result Answer Chain
               </h4>
               <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {currentStep.result.map((val, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        className={"w-10 h-10 flex items-center justify-center text-base font-bold rounded-lg border-2 shadow-sm transition-all " + (idx === 0 ? "bg-gray-100 text-gray-500 border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-800" : idx === currentStep.result.length - 1 ? "bg-purple-500 text-white border-purple-600 shadow-md shadow-purple-500/30 scale-110 animate-in zoom-in z-10 dark:bg-purple-600 dark:border-purple-500 dark:text-white" : "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900")}
                        title={idx === 0 ? "Dummy Node" : `Value: ${val}`}
                      >
                        {val}
                      </div>
                      {idx < currentStep.result.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                      )}
                    </React.Fragment>
                  ))}
               </div>
             </div>
          </div>

          <div>
            {/* Descriptive commentary box */}
            <div className="mb-0 p-4 bg-background border border-border rounded-lg shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-foreground/20"></div>
              <p className="text-sm font-medium text-foreground leading-relaxed">{currentStep.message}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="TypeScript"
          />
          <div className="rounded-xl overflow-hidden border border-muted bg-card shadow-sm">
            <VariablePanel
              variables={{
                "v1 (Chain 1)": currentStep.v1 !== null ? currentStep.v1 : "null",
                "v2 (Chain 2)": currentStep.v2 !== null ? currentStep.v2 : "null",
                "sum (v1+v2+carry)": currentStep.sum !== null ? currentStep.sum : "null",
                "carry": currentStep.carry,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
