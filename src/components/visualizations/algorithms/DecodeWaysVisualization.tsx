import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const DecodeWaysVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const s = "226";
  
  const steps = [
    {
      s: s,
      highlighting: [],
      dp: [1, 1, 0, 0],
      variables: { i: 0, prev2: 1, prev1: 1 },
      explanation: "String '226'. Each digit 1-26 can decode to A-Z. Count ways to decode. Init: prev2=1, prev1=1.",
      highlightedLine: 4
    },
    {
      s: s,
      highlighting: [0, 1],
      dp: [1, 1, 2, 0],
      variables: { i: 1, prev2: 1, prev1: 2, single: '2', twoDigit: '22' },
      explanation: "i=1: Single '2' (valid) adds prev1=1 way. Two-digit '22' (valid: V) adds prev2=1 way. Total: 2 ways.",
      highlightedLine: 13
    },
    {
      s: s,
      highlighting: [1, 2],
      dp: [1, 1, 2, 3],
      variables: { i: 2, prev2: 2, prev1: 3, single: '6', twoDigit: '26' },
      explanation: "i=2: Single '6' (valid: F) adds prev1=2 ways. Two-digit '26' (valid: Z) adds prev2=1 way. Total: 3 ways.",
      highlightedLine: 13
    },
    {
      s: s,
      highlighting: [],
      dp: [1, 1, 2, 3],
      variables: { result: 3, ways: ['BZ', 'VF', 'BBF'] },
      explanation: "Complete! 3 ways to decode '226': 'BZ' (2,26), 'VF' (22,6), 'BBF' (2,2,6). Time: O(n), Space: O(1).",
      highlightedLine: 16
    }
  ];

  const code = `function numDecodings(s: string): number {
  if (!s || s[0] === '0') {
    return 0;
  }
  
  const n = s.length;
  let prev2 = 1;  // dp[i-2]
  let prev1 = 1;  // dp[i-1]
  
  for (let i = 1; i < n; i++) {
    let current = 0;
    
    // Single digit decode (1-9)
    if (s[i] !== '0') {
      current += prev1;
    }
    
    // Two digit decode (10-26)
    const twoDigit = parseInt(s.substring(i-1, i+1));
    if (twoDigit >= 10 && twoDigit <= 26) {
      current += prev2;
    }
    
    prev2 = prev1;
    prev1 = current;
  }
  
  return prev1;
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Decode Ways</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-xs font-semibold mb-2">String to Decode</div>
                  <div className="flex gap-1 justify-center">
                    {step.s.split('').map((char, i) => (
                      <div key={i} className={`w-12 h-12 rounded flex items-center justify-center font-mono text-lg font-bold ${
                        step.highlighting.includes(i) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {char}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs font-semibold mb-2 text-center">Mapping</div>
                  <div className="text-xs text-center text-muted-foreground">
                    1→A, 2→B, ..., 26→Z
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-center">DP Array (ways to decode up to i)</div>
                  <div className="flex gap-2 justify-center">
                    {step.dp.map((val, i) => (
                      <div key={i} className="w-10 h-10 bg-accent/20 rounded flex items-center justify-center text-sm font-bold">
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                <strong>Pattern:</strong> ways(i) = ways(i-1) [if single digit valid] + ways(i-2) [if two digits 10-26]
              </div>
            </div>
          </Card>
          <VariablePanel variables={step.variables} />
        </>
      }
      rightContent={
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="TypeScript"
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
