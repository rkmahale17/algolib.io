import { useState, useEffect } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';

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
  const [steps, setSteps] = useState<Step[]>([]);

  const code = `function wordBreak(s: string, wordDict: string[]): boolean {
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;  // Empty string
  
  for (let i = 1; i <= s.length; i++) {
    for (const word of wordDict) {
      const start = i - word.length;
      if (start >= 0 && dp[start]) {
        if (s.substring(start, i) === word) {
          dp[i] = true;
          break;
        }
      }
    }
  }
  
  return dp[s.length];
}`;

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

  if (steps.length === 0) return <div>Loading...</div>;

  const step = steps[currentStep];

  const leftContent = (
    <>
      <div>
        <h3 className="font-semibold mb-3 text-sm">Word Break - String: "{s}"</h3>
        <div className="flex gap-1 mb-4">
          {s.split('').map((char, i) => (
            <div key={i} className={`w-10 h-10 flex items-center justify-center border-2 rounded font-mono ${i < step.i ? 'border-primary bg-primary/20' : 'border-border bg-muted/30'}`}>
              {char}
            </div>
          ))}
        </div>
        {step.checking && (
          <div className={`p-3 rounded border ${step.found ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <span className="text-sm">Checking: <span className="font-mono font-bold">{step.checking}</span> {step.found && '✓'}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.description}</p>
      </div>

      <VariablePanel variables={{ i: step.i, result: step.dp[s.length] ? "true" : "false" }} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        highlightedLine={step.highlightedLine} 
        language="typescript" 
      />
    </>
  );

  const controls = (
    <SimpleStepControls
      currentStep={currentStep}
      totalSteps={steps.length}
      onStepChange={setCurrentStep}
    />
  );

  return (
    <VisualizationLayout
      leftContent={leftContent}
      rightContent={rightContent}
      controls={controls}
    />
  );
};
