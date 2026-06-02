import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  s: string;
  p: string;
  i: number;
  j: number;
  cache: Record<string, boolean>;
  message: string;
  lineNumber: number;
  match?: boolean;
}

export const RegularExpressionMatchingVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function isMatch(s: string, p: string): boolean {
    const cache = new Map<string, boolean>();

    function dfs(i: number, j: number): boolean {
        const key = \`\${i},\${j}\`;

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        if (i >= s.length && j >= p.length) {
            return true;
        }

        if (j >= p.length) {
            return false;
        }

        const match = i < s.length && (s[i] === p[j] || p[j] === ".");

        if (j + 1 < p.length && p[j + 1] === "*") {
            const result = dfs(i, j + 2) || (match && dfs(i + 1, j));
            cache.set(key, result);
            return result;
        }

        if (match) {
            const result = dfs(i + 1, j + 1);
            cache.set(key, result);
            return result;
        }

        cache.set(key, false);
        return false;
    }

    return dfs(0, 0);
}`;

  const generateSteps = () => {
    const s = "aab";
    const p = "c*a*b";
    const newSteps: Step[] = [];
    const cache = new Map<string, boolean>();

    const recordStep = (i: number, j: number, message: string, lineNumber: number, match?: boolean) => {
      newSteps.push({
        s,
        p,
        i,
        j,
        cache: Object.fromEntries(cache.entries()),
        message,
        lineNumber,
        match,
      });
    };

    function dfs(i: number, j: number): boolean {
      const key = `${i},${j}`;
      
      recordStep(i, j, `Calling dfs(${i}, ${j})`, 4);

      if (cache.has(key)) {
        recordStep(i, j, `Cache hit for ${key}: ${cache.get(key)}`, 8);
        return cache.get(key)!;
      }

      if (i >= s.length && j >= p.length) {
        recordStep(i, j, `Both string and pattern reached end. Match successful.`, 12);
        return true;
      }

      if (j >= p.length) {
        recordStep(i, j, `Pattern exhausted but string has remaining characters. Match failed.`, 16);
        return false;
      }

      const match = i < s.length && (s[i] === p[j] || p[j] === ".");
      recordStep(i, j, `Checking match between s[${i}]('${s[i] || ""}') and p[${j}]('${p[j]}'): ${match}`, 19, match);

      if (j + 1 < p.length && p[j + 1] === "*") {
        recordStep(i, j, `Next character in pattern is '*', branching into two paths: skip '*' or use '*'`, 21, match);
        
        let result = dfs(i, j + 2);
        if (!result && match) {
          result = dfs(i + 1, j);
        }

        cache.set(key, result);
        recordStep(i, j, `Result for (${i}, ${j}) with '*' is ${result}. Saved to cache.`, 23, match);
        return result;
      }

      if (match) {
        recordStep(i, j, `Characters match. Proceeding to next characters.`, 27, match);
        const result = dfs(i + 1, j + 1);
        cache.set(key, result);
        recordStep(i, j, `Result for (${i}, ${j}) without '*' is ${result}. Saved to cache.`, 29, match);
        return result;
      }

      cache.set(key, false);
      recordStep(i, j, `Characters do not match. Result is false. Saved to cache.`, 33, match);
      return false;
    }

    recordStep(0, 0, `Starting matching process with s="${s}" and p="${p}"`, 37);
    dfs(0, 0);

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
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
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
        <div className="bg-card rounded-lg p-6 border space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">String (s)</h3>
              <div className="flex gap-2">
                {currentStep.s.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center border rounded font-mono text-lg
                      ${idx === currentStep.i ? "bg-primary/20 border-primary text-primary font-bold" : "bg-muted text-foreground"}`}
                  >
                    {char}
                  </div>
                ))}
                {currentStep.i === currentStep.s.length && (
                  <div className="w-10 h-10 flex items-center justify-center border rounded font-mono text-lg bg-primary/20 border-primary text-primary font-bold">
                    ∅
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Pattern (p)</h3>
              <div className="flex gap-2 flex-wrap">
                {currentStep.p.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 flex items-center justify-center border rounded font-mono text-lg
                      ${idx === currentStep.j ? "bg-primary/20 border-primary text-primary font-bold" : "bg-muted text-foreground"}`}
                  >
                    {char}
                  </div>
                ))}
                {currentStep.j === currentStep.p.length && (
                  <div className="w-10 h-10 flex items-center justify-center border rounded font-mono text-lg bg-primary/20 border-primary text-primary font-bold">
                    ∅
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded text-foreground">
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              i: currentStep.i,
              j: currentStep.j,
              "s[i]": currentStep.i < currentStep.s.length ? currentStep.s[currentStep.i] : "∅",
              "p[j]": currentStep.j < currentStep.p.length ? currentStep.p[currentStep.j] : "∅",
              match: currentStep.match !== undefined ? currentStep.match.toString() : "-",
              cacheSize: Object.keys(currentStep.cache).length,
            }}
          />
          
          {Object.keys(currentStep.cache).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-foreground">Cache</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-muted rounded">
                {Object.entries(currentStep.cache).map(([key, val]) => (
                  <div key={key} className={`text-xs px-2 py-1 rounded ${val ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"}`}>
                    {key}: {val.toString()}
                  </div>
                ))}
              </div>
            </div>
          )}
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
