import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  i: number;
  checking: string;
  dp: boolean[];
  found: boolean;
  highlightedLine: number;
  description: string;
}

export const WordBreakVisualization = () => {
  const s = "leetcode";
  const wordDict = ["leet", "code"];
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `def wordBreak(s, wordDict):
    dp = [False] * (len(s) + 1)
    dp[0] = True  # Empty string
    
    for i in range(1, len(s) + 1):
        for word in wordDict:
            start = i - len(word)
            if start >= 0 and dp[start]:
                if s[start:i] == word:
                    dp[i] = True
                    break
    
    return dp[len(s)]`;

  useEffect(() => {
    const newSteps: Step[] = [];
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    
    newSteps.push({
      i: 0,
      checking: "",
      dp: [...dp],
      found: false,
      highlightedLine: 2,
      description: "Initialize DP array. dp[0] = true (empty string)"
    });

    for (let i = 1; i <= s.length; i++) {
      for (const word of wordDict) {
        const start = i - word.length;
        if (start >= 0 && dp[start]) {
          const substring = s.substring(start, i);
          newSteps.push({
            i,
            checking: substring,
            dp: [...dp],
            found: false,
            highlightedLine: 7,
            description: `Check if "${substring}" matches word "${word}"`
          });
          
          if (substring === word) {
            dp[i] = true;
            newSteps.push({
              i,
              checking: substring,
              dp: [...dp],
              found: true,
              highlightedLine: 8,
              description: `Match found! dp[${i}] = true`
            });
            break;
          }
        }
      }
    }

    newSteps.push({
      i: s.length,
      checking: "",
      dp: [...dp],
      found: dp[s.length],
      highlightedLine: 11,
      description: `Result: ${dp[s.length] ? "Can" : "Cannot"} segment string`
    });

    setSteps(newSteps);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (steps.length === 0) return <div>Loading...</div>;

  const step = steps[currentStep];

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Word Break</h3>
        <div className="space-y-4">
          <div className="flex gap-1">
            {s.split('').map((char, i) => (
              <div key={i} className={`w-10 h-10 flex items-center justify-center border-2 rounded ${i < step.i ? 'border-primary bg-primary/10' : 'border-border'}`}>
                {char}
              </div>
            ))}
          </div>
          {step.checking && (
            <div className={`p-3 rounded ${step.found ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'}`}>
              Checking: {step.checking} {step.found && '✓'}
            </div>
          )}
          <div className="p-3 bg-muted rounded">{step.description}</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeHighlighter code={code} highlightedLine={step.highlightedLine} language="Python" />
        <VariablePanel variables={{ i: step.i, result: step.dp[s.length] ? "true" : "false" }} />
      </div>

      <StepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
        onStepBack={() => setCurrentStep(Math.max(currentStep - 1, 0))}
        onReset={() => { setCurrentStep(0); setIsPlaying(false); }}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};
