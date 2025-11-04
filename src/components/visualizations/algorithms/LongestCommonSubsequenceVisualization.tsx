import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';

export const LongestCommonSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const text1 = "abcde";
  const text2 = "ace";

  const steps = [
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 0, j: 0,
      char1: '', char2: '',
      explanation: "Initialize: Create (m+1)×(n+1) DP table filled with zeros. Rows=text1, Cols=text2",
      highlightedLine: 0
    },
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1, j: 1,
      char1: 'a', char2: 'a',
      explanation: "i=1, j=1: Compare text1[0]='a' with text2[0]='a'. Match! dp[1][1] = dp[0][0] + 1",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1]],
      i: 1, j: 1,
      char1: 'a', char2: 'a',
      explanation: "dp[1][1] = 1. Characters match, increment diagonal value",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1]],
      i: 1, j: 2,
      char1: 'a', char2: 'c',
      explanation: "i=1, j=2: Compare text1[0]='a' with text2[1]='c'. No match. Take max(dp[0][2], dp[1][1])",
      highlightedLine: 3
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1]],
      i: 1, j: 3,
      char1: 'a', char2: 'e',
      explanation: "i=1, j=3: Compare text1[0]='a' with text2[2]='e'. No match. dp[1][3] = max(dp[0][3], dp[1][2]) = 1",
      highlightedLine: 3
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1]],
      i: 2, j: 1,
      char1: 'b', char2: 'a',
      explanation: "i=2, j=1: Compare text1[1]='b' with text2[0]='a'. No match. dp[2][1] = max(dp[1][1], dp[2][0]) = 1",
      highlightedLine: 3
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1],[0,1,1,1]],
      i: 3, j: 2,
      char1: 'c', char2: 'c',
      explanation: "i=3, j=2: Compare text1[2]='c' with text2[1]='c'. Match! dp[3][2] = dp[2][1] + 1 = 2",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,2]],
      i: 3, j: 2,
      char1: 'c', char2: 'c',
      explanation: "dp[3][2] = 2. Found second matching character",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,2]],
      i: 4, j: 3,
      char1: 'd', char2: 'e',
      explanation: "i=4, j=3: Compare text1[3]='d' with text2[2]='e'. No match. dp[4][3] = max(dp[3][3], dp[4][2]) = 2",
      highlightedLine: 3
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5, j: 3,
      char1: 'e', char2: 'e',
      explanation: "i=5, j=3: Compare text1[4]='e' with text2[2]='e'. Match! dp[5][3] = dp[4][2] + 1 = 3",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5, j: 3,
      char1: '', char2: '',
      explanation: "Complete! LCS length = dp[5][3] = 3. The subsequence is 'ace'",
      highlightedLine: 4
    }
  ];

  const code = `function longestCommonSubsequence(
  text1: string, 
  text2: string
): number {
  const m = text1.length, n = text2.length;
  const dp = Array(m + 1).fill(0)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(
          dp[i - 1][j], 
          dp[i][j - 1]
        );
      }
    }
  }
  
  return dp[m][n];
}`;

  const step = steps[currentStep];

  const renderDPTable = () => {
    return (
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-center">DP Table</h3>
        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted text-xs"></th>
                <th className="border border-border p-2 bg-muted text-xs">∅</th>
                {text2.split('').map((char, idx) => (
                  <th key={idx} className="border border-border p-2 bg-muted text-xs font-mono">{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 bg-muted text-xs">∅</td>
                {step.dp[0].map((val, idx) => (
                  <td key={idx} className={`border border-border p-2 text-center text-sm ${
                    step.i === 0 && step.j === idx ? 'bg-primary/20 font-bold' : ''
                  }`}>
                    {val}
                  </td>
                ))}
              </tr>
              {text1.split('').map((char, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="border border-border p-2 bg-muted text-xs font-mono">{char}</td>
                  {step.dp[rowIdx + 1].map((val, colIdx) => (
                    <td key={colIdx} className={`border border-border p-2 text-center text-sm ${
                      step.i === rowIdx + 1 && step.j === colIdx ? 'bg-primary/20 font-bold' : ''
                    }`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {step.char1 && step.char2 && (
          <div className="mt-4 text-center text-sm">
            <span className="font-mono bg-primary/10 px-2 py-1 rounded">
              Comparing: '{step.char1}' vs '{step.char2}' 
              {step.char1 === step.char2 ? ' ✓' : ' ✗'}
            </span>
          </div>
        )}
      </Card>
    );
  };

  const leftContent = (
    <>
      {renderDPTable()}
      
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{step.explanation}</p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border">
        <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• If characters match: dp[i][j] = dp[i-1][j-1] + 1</p>
          <p>• If no match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</p>
          <p>• Result is at dp[m][n]</p>
          <p>• Time: O(m×n), Space: O(m×n)</p>
        </div>
      </div>

      <VariablePanel variables={{ 'LCS Length': step.dp[step.i][step.j] }} />
    </>
  );

  const rightContent = (
    <>
      <CodeHighlighter 
        code={code} 
        language="TypeScript"
        highlightedLine={step.highlightedLine}
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