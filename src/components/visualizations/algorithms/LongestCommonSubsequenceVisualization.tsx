import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const LongestCommonSubsequenceVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const text1 = "abcde";
  const text2 = "ace";

  const steps = [
    {
      dp: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
      i: 0, j: 0,
      explanation: "Initialize DP table with zeros",
      highlightedLine: 2
    },
    {
      dp: [[0,0,0,0],[0,1,1,1],[0,1,1,1],[0,1,2,2],[0,1,2,2],[0,1,2,3]],
      i: 5, j: 3,
      explanation: "Final LCS length = 3",
      highlightedLine: 11
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
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`;

  const leftContent = (
    <>
      <div className="p-4 bg-primary/20 rounded-lg border border-primary/30">
        <p className="text-sm font-medium">{steps[currentStep].explanation}</p>
      </div>
      <VariablePanel variables={{ 'LCS Length': steps[currentStep].dp[steps[currentStep].i][steps[currentStep].j] }} />
    </>
  );

  const rightContent = (
    <>
      <div className="text-sm font-semibold text-muted-foreground mb-2">TypeScript</div>
      <CodeHighlighter 
        code={code} 
        language="typescript"
        highlightedLine={steps[currentStep].highlightedLine}
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
