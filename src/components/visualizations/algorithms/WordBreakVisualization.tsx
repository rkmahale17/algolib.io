import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  s: string;
  dp: boolean[];
  currentIndex: number;
  currentSubstring: string;
  checking: string;
  variables: Record<string, any>;
  message: string;
  lineNumber: number;
}

export const WordBreakVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const s = "leetcode";
  const wordDict = ["leet", "code"];

  const steps: Step[] = [
    { s, dp: [true, false, false, false, false, false, false, false, false], currentIndex: 0, currentSubstring: '', checking: '', variables: { dp: '[T,F,F,F,F,F,F,F,F]' }, message: "Initialize DP array. dp[0]=true (empty string)", lineNumber: 3 },
    { s, dp: [true, false, false, false, false, false, false, false, false], currentIndex: 1, currentSubstring: 'l', checking: 'l', variables: { i: 1, substring: 'l', found: false }, message: "Check index 1: 'l' not in wordDict", lineNumber: 6 },
    { s, dp: [true, false, false, false, false, false, false, false, false], currentIndex: 4, currentSubstring: 'leet', checking: 'leet', variables: { i: 4, substring: 'leet', found: true }, message: "Check index 4: 'leet' found in wordDict! dp[4]=true", lineNumber: 8 },
    { s, dp: [true, false, false, false, true, false, false, false, false], currentIndex: 4, currentSubstring: 'leet', checking: '', variables: { dp: '[T,F,F,F,T,F,F,F,F]' }, message: "Updated dp[4]=true. Can form 'leet'", lineNumber: 9 },
    { s, dp: [true, false, false, false, true, false, false, false, false], currentIndex: 5, currentSubstring: 'leetc', checking: 'c', variables: { i: 5, substring: 'c', found: false }, message: "Check index 5: 'c' not in wordDict", lineNumber: 6 },
    { s, dp: [true, false, false, false, true, false, false, false, false], currentIndex: 8, currentSubstring: 'leetcode', checking: 'code', variables: { i: 8, substring: 'code', found: true }, message: "Check index 8: 'code' found in wordDict! dp[8]=true", lineNumber: 8 },
    { s, dp: [true, false, false, false, true, false, false, false, true], currentIndex: 8, currentSubstring: 'leetcode', checking: '', variables: { dp: '[T,F,F,F,T,F,F,F,T]', result: true }, message: "Complete! dp[8]=true means 'leetcode' can be segmented. Time: O(n²*m), Space: O(n)", lineNumber: 12 }
  ];

  const code = `function wordBreak(s: string, wordDict: string[]): boolean {
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  const wordSet = new Set(wordDict);
  
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  
  return dp[n];
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
          <h3 className="text-lg font-semibold mb-4">Word Break: "{s}"</h3>
          <div className="space-y-4">
            <div className="p-3 bg-muted/30 rounded text-sm">Dictionary: [{wordDict.map(w => `"${w}"`).join(', ')}]</div>
            <div className="flex flex-wrap gap-1">
              {s.split('').map((char, idx) => (
                <div key={idx} className={`w-10 h-10 flex items-center justify-center font-bold border-2 ${
                  idx < currentStep.currentIndex ? 'bg-green-500/20 border-green-500 text-green-500' :
                  idx === currentStep.currentIndex - 1 ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-muted border-border'
                }`}>{char}</div>
              ))}
            </div>
            <div className="p-3 bg-muted/50 rounded"><div className="text-xs font-semibold mb-2">DP Array</div><div className="flex gap-1 overflow-x-auto">{currentStep.dp.map((val, idx) => (
              <div key={idx} className={`min-w-[2.5rem] h-10 flex items-center justify-center font-bold text-sm border-2 ${val ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-muted border-border'}`}>{idx}</div>
            ))}</div></div>
            {currentStep.checking && (<div className="p-3 bg-blue-500/10 border border-blue-500 rounded text-sm">Checking: "{currentStep.checking}"</div>)}
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
