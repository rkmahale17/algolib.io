import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const WordBreakVisualization = () => {
  const s = "leetcode";
  const wordDict = ["leet", "code"];
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      i: 0,
      checking: '',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 0,
      description: "Initialize: Create DP array of length s.length + 1. dp[0] = true (empty string can be segmented)",
      checkIndices: []
    },
    {
      i: 1,
      checking: '',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 1,
      description: "Start outer loop: i = 1. Check if s[0...1) = 'l' can be segmented",
      checkIndices: [0]
    },
    {
      i: 1,
      checking: 'l',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "Check word 'leet': substring 'l' ≠ 'leet'. No match",
      checkIndices: [0]
    },
    {
      i: 2,
      checking: 'le',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 2: Check 'le'. Not in dictionary",
      checkIndices: [0, 1]
    },
    {
      i: 3,
      checking: 'lee',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 3: Check 'lee'. Not in dictionary",
      checkIndices: [0, 1, 2]
    },
    {
      i: 4,
      checking: 'leet',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 4: Check word 'leet'. start = 4 - 4 = 0. substring s[0...4) = 'leet'",
      checkIndices: [0, 1, 2, 3]
    },
    {
      i: 4,
      checking: 'leet',
      dp: [true, false, false, false, false, false, false, false, false],
      found: false,
      highlightedLine: 3,
      description: "Check if dp[start=0] is true. Yes! And 'leet' matches word 'leet' ✓",
      checkIndices: [0, 1, 2, 3]
    },
    {
      i: 4,
      checking: 'leet',
      dp: [true, false, false, false, true, false, false, false, false],
      found: true,
      highlightedLine: 3,
      description: "Match found! Set dp[4] = true. Can segment 'leet'",
      checkIndices: [0, 1, 2, 3]
    },
    {
      i: 5,
      checking: 'c',
      dp: [true, false, false, false, true, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 5: Check 'code' starting from position 1. 'leetc' - no match",
      checkIndices: [4]
    },
    {
      i: 6,
      checking: 'co',
      dp: [true, false, false, false, true, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 6: Check 'code' from different positions. 'leetco' - no match yet",
      checkIndices: [4, 5]
    },
    {
      i: 7,
      checking: 'cod',
      dp: [true, false, false, false, true, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 7: Check 'code' from position 3. 'leetcod' - no match yet",
      checkIndices: [4, 5, 6]
    },
    {
      i: 8,
      checking: 'code',
      dp: [true, false, false, false, true, false, false, false, false],
      found: false,
      highlightedLine: 2,
      description: "i = 8: Check word 'code'. start = 8 - 4 = 4. substring s[4...8) = 'code'",
      checkIndices: [4, 5, 6, 7]
    },
    {
      i: 8,
      checking: 'code',
      dp: [true, false, false, false, true, false, false, false, false],
      found: false,
      highlightedLine: 3,
      description: "Check if dp[start=4] is true. Yes! And 'code' matches word 'code' ✓",
      checkIndices: [4, 5, 6, 7]
    },
    {
      i: 8,
      checking: 'code',
      dp: [true, false, false, false, true, false, false, false, true],
      found: true,
      highlightedLine: 3,
      description: "Match found! Set dp[8] = true. Can segment entire string 'leetcode'",
      checkIndices: [4, 5, 6, 7]
    },
    {
      i: 8,
      checking: '',
      dp: [true, false, false, false, true, false, false, false, true],
      found: true,
      highlightedLine: 4,
      description: "Complete! Return dp[8] = true. String 'leetcode' can be segmented as 'leet' + 'code'",
      checkIndices: []
    }
  ];

  const code = `function wordBreak(
  s: string, 
  wordDict: string[]
): boolean {
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  
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

  const step = steps[currentStep];

  const leftContent = (
    <>
      <div>
        <h3 className="font-semibold mb-3 text-sm">Word Break - String: "{s}"</h3>
        <div className="flex gap-1 mb-4 justify-center">
          {s.split('').map((char, i) => (
            <div key={i} className={`w-10 h-10 flex items-center justify-center border-2 rounded font-mono transition-all ${
              step.checkIndices.includes(i)
                ? 'border-primary bg-primary/30 font-bold scale-105' 
                : 'border-border bg-muted/30'
            }`}>
              {char}
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold mb-2">Dictionary: {JSON.stringify(wordDict)}</h4>
        </div>

        <div className="mb-4">
          <h4 className="text-xs font-semibold mb-2">DP Array (can segment up to position i?)</h4>
          <div className="flex gap-1 justify-center">
            {step.dp.map((val, idx) => (
              <div key={idx} className={`w-10 h-10 flex items-center justify-center border-2 rounded text-xs font-mono ${
                val 
                  ? 'bg-green-500/20 border-green-500 font-bold' 
                  : 'bg-muted border-border'
              } ${idx === step.i ? 'ring-2 ring-accent scale-110' : ''}`}>
                {val ? 'T' : 'F'}
              </div>
            ))}
          </div>
          <div className="flex gap-1 justify-center mt-1">
            {step.dp.map((_, idx) => (
              <div key={idx} className="w-10 text-center text-xs text-muted-foreground">
                {idx}
              </div>
            ))}
          </div>
        </div>

        {step.checking && (
          <div className={`p-3 rounded border ${
            step.found 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30'
          }`}>
            <span className="text-sm">
              Checking: <span className="font-mono font-bold">"{step.checking}"</span> 
              {step.found && ' ✓ Found!'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.description}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• dp[i] = true if s[0...i) can be segmented</p>
          <p>• For each position i, try each word in dictionary</p>
          <p>• If word fits and dp[start] is true, set dp[i] = true</p>
          <p>• Time: O(n × m × k), Space: O(n)</p>
        </div>
      </div>

      <VariablePanel variables={{ i: step.i, 'dp[i]': step.dp[step.i] ? 'true' : 'false' }} />
    </>
  );

  const rightContent = (
    <>
      <CodeHighlighter 
        code={code} 
        highlightedLine={step.highlightedLine} 
        language="TypeScript" 
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