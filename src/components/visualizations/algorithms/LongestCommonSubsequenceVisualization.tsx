import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  dp: number[][];
  i: number;
  j: number;
  char1: string;
  char2: string;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const LongestCommonSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const text1 = "abcde";
  const text2 = "ace";

  const steps: Step[] = [
    {
      dp: [],
      i: 0,
      j: 0,
      char1: '',
      char2: '',
      variables: { text1: '"abcde"', text2: '"ace"' },
      explanation: "Starting with text1 = 'abcde' and text2 = 'ace'. Find longest common subsequence.",
      highlightedLines: [1, 2, 3, 4],
      lineExecution: "function longestCommonSubsequence(text1: string, text2: string): number"
    },
    {
      dp: [],
      i: 0,
      j: 0,
      char1: '',
      char2: '',
      variables: { m: 5, n: 3 },
      explanation: "Get lengths: m = text1.length = 5, n = text2.length = 3.",
      highlightedLines: [5],
      lineExecution: "const m = text1.length, n = text2.length; // m=5, n=3"
    },
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 0,
      j: 0,
      char1: '',
      char2: '',
      variables: { m: 5, n: 3, dpSize: '(6 × 4)' },
      explanation: "Create (m+1) × (n+1) DP table = 6 × 4. Initialize all to 0.",
      highlightedLines: [6, 7],
      lineExecution: "const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));"
    },
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 0,
      char1: '',
      char2: '',
      variables: { i: 1, m: 5 },
      explanation: "Start outer loop: i = 1. Check: 1 <= 5? Yes.",
      highlightedLines: [9],
      lineExecution: "for (let i = 1; i <= m; i++) // i=1"
    },
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 1,
      char1: '',
      char2: '',
      variables: { i: 1, j: 1 },
      explanation: "Start inner loop: j = 1. Check: 1 <= 3? Yes.",
      highlightedLines: [10],
      lineExecution: "for (let j = 1; j <= n; j++) // j=1"
    },
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 1,
      char1: 'a',
      char2: 'a',
      variables: { i: 1, j: 1, 'text1[0]': 'a', 'text2[0]': 'a' },
      explanation: "i=1, j=1: Compare text1[0]='a' with text2[0]='a'. Match!",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'a' === 'a' -> true"
    },
    {
      dp: [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 1,
      char1: 'a',
      char2: 'a',
      variables: { 'dp[1][1]': 1 },
      explanation: "Characters match: dp[1][1] = dp[0][0] + 1 = 0 + 1 = 1.",
      highlightedLines: [12],
      lineExecution: "dp[i][j] = dp[i - 1][j - 1] + 1; // dp[1][1] = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 2,
      char1: 'a',
      char2: 'c',
      variables: { i: 1, j: 2, 'text1[0]': 'a', 'text2[1]': 'c' },
      explanation: "i=1, j=2: Compare text1[0]='a' with text2[1]='c'. No match.",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'a' === 'c' -> false"
    },
    {
      dp: [[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 2,
      char1: 'a',
      char2: 'c',
      variables: { 'dp[1][2]': 1 },
      explanation: "No match: dp[1][2] = max(dp[0][2], dp[1][1]) = max(0, 1) = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(0, 1) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 3,
      char1: 'a',
      char2: 'e',
      variables: { i: 1, j: 3, 'text1[0]': 'a', 'text2[2]': 'e' },
      explanation: "i=1, j=3: Compare text1[0]='a' with text2[2]='e'. No match.",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'a' === 'e' -> false"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 1,
      j: 3,
      char1: 'a',
      char2: 'e',
      variables: { 'dp[1][3]': 1 },
      explanation: "No match: dp[1][3] = max(dp[0][3], dp[1][2]) = max(0, 1) = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(0, 1) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 2,
      j: 1,
      char1: 'b',
      char2: 'a',
      variables: { i: 2, j: 1, 'text1[1]': 'b', 'text2[0]': 'a' },
      explanation: "i=2, j=1: Compare text1[1]='b' with text2[0]='a'. No match.",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'b' === 'a' -> false"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 2,
      j: 1,
      char1: 'b',
      char2: 'a',
      variables: { 'dp[2][1]': 1 },
      explanation: "No match: dp[2][1] = max(dp[1][1], dp[2][0]) = max(1, 0) = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 0) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 2,
      j: 2,
      char1: 'b',
      char2: 'c',
      variables: { i: 2, j: 2, 'text1[1]': 'b', 'text2[1]': 'c' },
      explanation: "i=2, j=2: Compare text1[1]='b' with text2[1]='c'. No match.",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'b' === 'c' -> false"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 2,
      j: 2,
      char1: 'b',
      char2: 'c',
      variables: { 'dp[2][2]': 1 },
      explanation: "No match: dp[2][2] = max(dp[1][2], dp[2][1]) = max(1, 1) = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 1) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 2,
      j: 3,
      char1: 'b',
      char2: 'e',
      variables: { i: 2, j: 3 },
      explanation: "i=2, j=3: Compare 'b' with 'e'. No match. dp[2][3] = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 1) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,0,0],[0,0,0,0],[0,0,0,0]],
      i: 3,
      j: 1,
      char1: 'c',
      char2: 'a',
      variables: { i: 3, j: 1, 'text1[2]': 'c', 'text2[0]': 'a' },
      explanation: "i=3, j=1: Compare 'c' with 'a'. No match. dp[3][1] = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 0) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
      i: 3,
      j: 2,
      char1: 'c',
      char2: 'c',
      variables: { i: 3, j: 2, 'text1[2]': 'c', 'text2[1]': 'c' },
      explanation: "i=3, j=2: Compare text1[2]='c' with text2[1]='c'. Match!",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'c' === 'c' -> true"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,0],[0,0,0,0],[0,0,0,0]],
      i: 3,
      j: 2,
      char1: 'c',
      char2: 'c',
      variables: { 'dp[3][2]': 2 },
      explanation: "Characters match: dp[3][2] = dp[2][1] + 1 = 1 + 1 = 2. Found 'ac' so far.",
      highlightedLines: [12],
      lineExecution: "dp[i][j] = dp[i - 1][j - 1] + 1; // dp[3][2] = 2"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,0,0,0],[0,0,0,0]],
      i: 3,
      j: 3,
      char1: 'c',
      char2: 'e',
      variables: { i: 3, j: 3 },
      explanation: "i=3, j=3: Compare 'c' with 'e'. No match. dp[3][3] = 2.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 2) = 2"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,0,0],[0,0,0,0]],
      i: 4,
      j: 1,
      char1: 'd',
      char2: 'a',
      variables: { i: 4, j: 1 },
      explanation: "i=4, j=1: Compare 'd' with 'a'. No match. dp[4][1] = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 0) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,0],[0,0,0,0]],
      i: 4,
      j: 2,
      char1: 'd',
      char2: 'c',
      variables: { i: 4, j: 2 },
      explanation: "i=4, j=2: Compare 'd' with 'c'. No match. dp[4][2] = max(dp[3][2], dp[4][1]) = 2.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(2, 1) = 2"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,0,0,0]],
      i: 4,
      j: 3,
      char1: 'd',
      char2: 'e',
      variables: { i: 4, j: 3 },
      explanation: "i=4, j=3: Compare 'd' with 'e'. No match. dp[4][3] = 2.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(2, 2) = 2"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,0,0]],
      i: 5,
      j: 1,
      char1: 'e',
      char2: 'a',
      variables: { i: 5, j: 1 },
      explanation: "i=5, j=1: Compare 'e' with 'a'. No match. dp[5][1] = 1.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(1, 0) = 1"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,0]],
      i: 5,
      j: 2,
      char1: 'e',
      char2: 'c',
      variables: { i: 5, j: 2 },
      explanation: "i=5, j=2: Compare 'e' with 'c'. No match. dp[5][2] = 2.",
      highlightedLines: [14, 15, 16],
      lineExecution: "dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // max(2, 1) = 2"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,2]],
      i: 5,
      j: 3,
      char1: 'e',
      char2: 'e',
      variables: { i: 5, j: 3, 'text1[4]': 'e', 'text2[2]': 'e' },
      explanation: "i=5, j=3: Compare text1[4]='e' with text2[2]='e'. Match!",
      highlightedLines: [11],
      lineExecution: "if (text1[i - 1] === text2[j - 1]) // 'e' === 'e' -> true"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5,
      j: 3,
      char1: 'e',
      char2: 'e',
      variables: { 'dp[5][3]': 3 },
      explanation: "Characters match: dp[5][3] = dp[4][2] + 1 = 2 + 1 = 3. Found 'ace'!",
      highlightedLines: [12],
      lineExecution: "dp[i][j] = dp[i - 1][j - 1] + 1; // dp[5][3] = 3"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 6,
      j: 0,
      char1: '',
      char2: '',
      variables: { i: 6, m: 5 },
      explanation: "Check loop condition: i (6) <= m (5)? No, exit outer loop.",
      highlightedLines: [9],
      lineExecution: "for (let i = 1; i <= m; i++) // i=6, 6 <= 5 -> false, exit"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5,
      j: 3,
      char1: '',
      char2: '',
      variables: { m: 5, n: 3, result: 3 },
      explanation: "Return dp[m][n] = dp[5][3] = 3. LCS length is 3.",
      highlightedLines: [20],
      lineExecution: "return dp[m][n]; // dp[5][3] = 3"
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5,
      j: 3,
      char1: '',
      char2: '',
      variables: { result: 3, lcs: '"ace"' },
      explanation: "Algorithm complete! Longest common subsequence is 'ace'. Time: O(m×n), Space: O(m×n).",
      highlightedLines: [20],
      lineExecution: "Result: 3 (LCS = 'ace')"
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
    if (step.dp.length === 0) return null;

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

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`table-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderDPTable()}
          </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`algo-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2 text-sm">Algorithm:</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>• If match: dp[i][j] = dp[i-1][j-1] + 1</p>
                <p>• If no match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])</p>
                <p>• Result is at dp[m][n]</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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