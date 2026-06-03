import { useEffect, useRef, useState } from 'react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  activeNumber: number;
  visitSet: number[];
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
  calculatingMath?: boolean;
}

export const HappyNumberVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function isHappy(n: number): boolean {
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
}`;

  const generateSteps = () => {
    const newSteps: Step[] = [];
    let n = 19;
    let startN = n;
    const visit = new Set<number>();
    
    const addStep = (explanation: string, lineNumber: number, vars: any, calculatingMath = false) => {
      newSteps.push({
        activeNumber: n,
        visitSet: Array.from(visit),
        variables: vars,
        explanation,
        lineNumber,
        calculatingMath
      });
    };

    addStep(`Initialize an empty set 'visit' to keep track of numbers we've seen. Target: ${n}.`, 2, { n, visit: '{}' });

    while (true) {
      let cycleDetected = visit.has(n);
      addStep(`Check if ${n} is in 'visit' set. ${cycleDetected ? 'It is! We found a cycle.' : 'Not yet seen, proceed.'}`, 3, { n, visit: JSON.stringify(Array.from(visit)) });
      
      if (cycleDetected) {
         break;
      }

      visit.add(n);
      addStep(`Add ${n} to the 'visit' set to detect future cycles.`, 4, { n, visit: JSON.stringify(Array.from(visit)) });

      addStep(`Calculate the sum of the squares of its digits for n = ${n}.`, 5, { n, visit: JSON.stringify(Array.from(visit)) });
      
      let innerN = n;
      let output = 0;
      addStep(`Initialize output = 0 for the sum.`, 14, { n: innerN, output, visit: JSON.stringify(Array.from(visit)) }, true);

      while (true) {
         addStep(`Check if n > 0. Current n is ${innerN}.`, 15, { n: innerN, output, visit: JSON.stringify(Array.from(visit)) }, true);
         if (innerN <= 0) break;

         let digit = innerN % 10;
         addStep(`Extract the rightmost digit: ${innerN} % 10 = ${digit}.`, 16, { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) }, true);

         output += digit * digit;
         addStep(`Square the digit (${digit}^2 = ${digit*digit}) and add to output. output = ${output}.`, 17, { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) }, true);

         innerN = Math.floor(innerN / 10);
         addStep(`Remove the last digit from n using division. n is now ${innerN}.`, 18, { n: innerN, output, digit, visit: JSON.stringify(Array.from(visit)) }, true);
      }
      
      addStep(`Return the final computed sum: ${output}.`, 20, { n: innerN, output, visit: JSON.stringify(Array.from(visit)) }, true);
      
      n = output;
      addStep(`Update n to the new sum: ${n}.`, 5, { n, visit: JSON.stringify(Array.from(visit)) });

      let isOne = (n === 1);
      addStep(`Check if n is 1. Currently n = ${n}.`, 6, { n, visit: JSON.stringify(Array.from(visit)) });

      if (isOne) {
         addStep(`n reached 1! The number ${startN} is a Happy Number.`, 7, { n, visit: JSON.stringify(Array.from(visit)) });
         setSteps(newSteps);
         setCurrentStepIndex(0);
         return;
      }
    }

    addStep(`Cycle detected! ${n} was seen before. Thus, ${startN} is NOT a happy number. Return false.`, 10, { n, visit: JSON.stringify(Array.from(visit)) });
    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 min-h-[200px] flex flex-col justify-center">
            <h3 className="text-sm font-semibold mb-6 text-center text-muted-foreground uppercase tracking-wider">Number Sequence Trajectory</h3>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              {currentStep.visitSet.map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    !currentStep.calculatingMath && currentStep.activeNumber === v 
                      ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30' 
                      : 'bg-muted/50 border-border text-foreground'
                  }`}>
                    <span className="font-bold">{v}</span>
                  </div>
                  {i < currentStep.visitSet.length - 1 && (
                    <div className="text-muted-foreground/60 font-bold">➔</div>
                  )}
                </div>
              ))}
              
              {!currentStep.visitSet.includes(currentStep.activeNumber) && (
                <>
                  {currentStep.visitSet.length > 0 && <div className="text-muted-foreground/60 font-bold">➔</div>}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30 transition-all duration-300">
                     <span className="font-bold">{currentStep.activeNumber}</span>
                  </div>
                </>
              )}
            </div>
            
            {currentStep.lineNumber === 10 && (
              <div className="mt-6 text-center animate-pulse text-destructive font-semibold">
                Infinite Cycle Detected!
              </div>
            )}
            {currentStep.lineNumber === 7 && (
              <div className="mt-6 text-center animate-bounce text-green-500 font-semibold">
                Happy Number Reached! 🎉
              </div>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <VariablePanel variables={currentStep.variables} />

          {/* Creative Commentary */}
          <div className="mt-8 bg-secondary/20 p-6 rounded-xl border border-secondary/50 relative overflow-hidden group hover:bg-secondary/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="text-primary">✨</span> The Philosophy of Happy Numbers
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Happy Number algorithm is essentially a <strong>cycle detection problem</strong> wrapped in a math puzzle. 
              Every number's destiny is one of two paths: it either reduces down to the perfect unity of <strong className="text-foreground">1</strong>, 
              or it falls into an endless, inescapable cycle (like the infamous sequence starting at 4).
              <br/><br/>
              By using a <strong className="text-foreground">Hash Set</strong>, we act as a time traveler leaving breadcrumbs. If we ever step on a crumb we left before, 
              we know we're trapped in a cycle forever! The math behind squaring digits uniquely guarantees that numbers either rapidly shrink or enter a well-known bounded cycle.
            </p>
          </div>

        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
