import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';

export const LongestCommonSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const text1 = "abcde";
  const text2 = "ace";
  
  const steps = [
    {
      grid: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      row: 0,
      col: 0,
      variables: { i: 0, j: 0, lcsLength: 0 },
      explanation: "Initialize dp table. dp[i][j] = LCS length for text1[0..i-1] and text2[0..j-1]"
    },
    {
      grid: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 1, 1]
      ],
      row: 1,
      col: 1,
      variables: { i: 1, j: 1, lcsLength: 1 },
      explanation: "text1[0]='a', text2[0]='a': Match! dp[1][1] = dp[0][0] + 1 = 1"
    },
    {
      grid: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 2, 2],
        [0, 1, 2, 2],
        [0, 1, 2, 2]
      ],
      row: 3,
      col: 2,
      variables: { i: 3, j: 2, lcsLength: 2 },
      explanation: "text1[2]='c', text2[1]='c': Match! dp[3][2] = dp[2][1] + 1 = 2. LCS so far: 'ac'"
    },
    {
      grid: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [0, 1, 1, 1],
        [0, 1, 2, 2],
        [0, 1, 2, 2],
        [0, 1, 2, 3]
      ],
      row: 5,
      col: 3,
      variables: { i: 5, j: 3, lcsLength: 3 },
      explanation: "text1[4]='e', text2[2]='e': Match! dp[5][3] = dp[4][2] + 1 = 3. LCS: 'ace'"
    }
  ];

  const code = `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match: extend LCS
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Take max from excluding one char
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Space optimized O(min(m,n))
def longestCommonSubsequence_optimized(text1, text2):
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    prev = [0] * (len(text2) + 1)
    
    for char1 in text1:
        curr = [0] * (len(text2) + 1)
        for j, char2 in enumerate(text2):
            if char1 == char2:
                curr[j+1] = prev[j] + 1
            else:
                curr[j+1] = max(curr[j], prev[j+1])
        prev = curr
    
    return prev[-1]`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Text 1</h3>
          <div className="font-mono text-xl">{text1}</div>
        </div>
        <div className="p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-semibold mb-2">Text 2</h3>
          <div className="font-mono text-xl">{text2}</div>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="font-semibold mb-3 text-center">DP Table</h3>
        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 text-xs"></th>
                <th className="border border-border p-2 text-xs">ε</th>
                {text2.split('').map((char, i) => (
                  <th key={i} className="border border-border p-2 text-xs font-mono">{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 text-xs">ε</td>
                {steps[currentStep].grid[0].map((val, j) => (
                  <td key={j} className="border border-border p-2 text-center text-sm">{val}</td>
                ))}
              </tr>
              {text1.split('').map((char, i) => (
                <tr key={i}>
                  <td className="border border-border p-2 text-xs font-mono">{char}</td>
                  {steps[currentStep].grid[i + 1].map((val, j) => (
                    <td
                      key={j}
                      className={`border border-border p-2 text-center text-sm transition-colors ${
                        i + 1 === steps[currentStep].row && j === steps[currentStep].col
                          ? 'bg-primary text-primary-foreground font-bold'
                          : ''
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <VariablePanel variables={steps[currentStep].variables} />
      
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm">{steps[currentStep].explanation}</p>
        <p className="text-xs text-muted-foreground mt-2">
          If chars match: dp[i][j] = dp[i-1][j-1] + 1, else max(dp[i-1][j], dp[i][j-1])
        </p>
      </div>

      <CodeHighlighter code={code} language="python" />
      
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />
    </div>
  );
};
