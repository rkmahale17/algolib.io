import { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: boolean[];
  s: string;
  wordDict: string[];
  i: number;
  j: number;
  currentWord: string;
  message: string;
  lineNumber: number;
}

export const WordBreakVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function wordBreak(s, wordDict) {
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  const wordSet = new Set(wordDict);
  
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`;

  const generateSteps = () => {
    const s = "leetcode";
    const wordDict = ["leet", "code"];
    const wordSet = new Set(wordDict);

    const newSteps: Step[] = [];
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;

    newSteps.push({
      dp: [...dp],
      s,
      wordDict,
      i: -1,
      j: -1,
      currentWord: "",
      message: "Initialize DP. Empty string is always breakable",
      lineNumber: 2,
    });

    for (let i = 1; i <= s.length; i++) {
      newSteps.push({
        dp: [...dp],
        s,
        wordDict,
        i,
        j: -1,
        currentWord: "",
        message: `Check if substring[0:${i}] "${s.substring(
          0,
          i
        )}" can be segmented`,
        lineNumber: 5,
      });

      for (let j = 0; j < i; j++) {
        const word = s.substring(j, i);

        newSteps.push({
          dp: [...dp],
          s,
          wordDict,
          i,
          j,
          currentWord: word,
          message: `Check word "${word}" (dp[${j}]=${
            dp[j]
          }, in dict=${wordSet.has(word)})`,
          lineNumber: 7,
        });

        if (dp[j] && wordSet.has(word)) {
          dp[i] = true;

          newSteps.push({
            dp: [...dp],
            s,
            wordDict,
            i,
            j,
            currentWord: word,
            message: `Found valid segmentation! dp[${i}] = true`,
            lineNumber: 8,
          });
          break;
        }
      }
    }

    newSteps.push({
      dp: [...dp],
      s,
      wordDict,
      i: s.length,
      j: -1,
      currentWord: "",
      message: `Result: ${dp[s.length] ? "Can break" : "Cannot break"} "${s}"`,
      lineNumber: 13,
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
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
  const handleStepForward = () =>
    currentStepIndex < steps.length - 1 &&
    setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () =>
    currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">
                String: "{currentStep.s}"
              </div>
              <div className="flex gap-1">
                {currentStep.s.split("").map((char, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 border-2 flex items-center justify-center font-mono transition-all duration-300 ${
                      idx >= currentStep.j && idx < currentStep.i
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">DP Array:</div>
              <div className="flex gap-1">
                {currentStep.dp.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      idx === currentStep.i
                        ? "border-primary bg-primary text-white"
                        : val
                        ? "border-green-500 bg-green-500/20 text-green-500"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    {val ? "T" : "F"}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {currentStep.dp.map((_, idx) => (
                  <div
                    key={idx}
                    className="w-8 text-center text-xs text-muted-foreground"
                  >
                    {idx}
                  </div>
                ))}
              </div>
            </div>

            {currentStep.currentWord && (
              <div className="text-sm">
                <span className="font-semibold">Current word:</span>{" "}
                <span className="font-mono bg-accent px-2 py-1 rounded">
                  {currentStep.currentWord}
                </span>
              </div>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">
              {currentStep.message}
            </p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                dictionary: currentStep.wordDict,
                i: currentStep.i >= 0 ? currentStep.i : "N/A",
                j: currentStep.j >= 0 ? currentStep.j : "N/A",
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <CodeHighlighter
            code={code}
            highlightedLine={currentStep.lineNumber}
            language="typescript"
          />
        </div>
      </div>
    </div>
  );
};
