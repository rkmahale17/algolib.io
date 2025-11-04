import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  s: string;
  dp: number[];
  i: number;
  message: string;
  lineNumber: number;
}

export const DecodeWaysVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { s: "226", dp: [1, 0, 0, 0], i: 0, message: "String '226': A=1, B=2, ..., Z=26. dp[i] = ways to decode s[0..i-1]", lineNumber: 3 },
    { s: "226", dp: [1, 1, 0, 0], i: 1, message: "s[0]='2': Valid single digit. dp[1]=1 way: '2'->B", lineNumber: 5 },
    { s: "226", dp: [1, 1, 2, 0], i: 2, message: "s[1]='2': Single '2'->B (1 way) + Double '22'->V (1 way). dp[2]=2", lineNumber: 11 },
    { s: "226", dp: [1, 1, 2, 3], i: 3, message: "s[2]='6': Single '6'->F (2 ways) + Double '26'->Z (1 way). dp[3]=3", lineNumber: 11 },
    { s: "226", dp: [1, 1, 2, 3], i: 4, message: "Complete! 3 ways to decode '226': 'BBF', 'BZ', 'VF'. Time: O(n), Space: O(n)", lineNumber: 14 }
  ];

  const code = `function numDecodings(s: string): number {
  if (s[0] === '0') return 0;
  
  const dp = new Array(s.length + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  
  for (let i = 2; i <= s.length; i++) {
    const one = parseInt(s.substring(i-1, i));
    const two = parseInt(s.substring(i-2, i));
    
    if (one >= 1 && one <= 9) dp[i] += dp[i-1];
    if (two >= 10 && two <= 26) dp[i] += dp[i-2];
  }
  
  return dp[s.length];
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Decode Ways</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Encoded String:</div>
              <div className="flex gap-1">
                {currentStep.s.split('').map((char, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-xl font-bold ${idx < currentStep.i - 1 ? 'bg-secondary' : idx === currentStep.i - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {char}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Mapping:</strong> A=1, B=2, C=3, ..., Z=26
            </div>
            <div>
              <div className="text-sm font-medium mb-2">DP Array (ways to decode):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.dp.map((val, idx) => (
                  <div key={idx} className={`px-4 py-3 rounded font-mono text-center ${idx === currentStep.i ? 'bg-green-500/20 ring-2 ring-green-500' : idx < currentStep.i ? 'bg-green-500/10' : 'bg-muted'}`}>
                    <div className="text-xs">dp[{idx}]</div>
                    <div className="font-bold text-lg">{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
