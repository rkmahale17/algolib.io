import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  s: string;
  dp: number[];
  i: number;
  one?: number;
  two?: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const DecodeWaysVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const s = "226";

  const steps: Step[] = [
    {
      s,
      dp: [],
      i: -1,
      variables: { s: '"226"' },
      explanation: "String '226' to decode. Mapping: A=1, B=2, C=3, ..., Z=26. Find number of ways to decode.",
      highlightedLines: [1],
      lineExecution: "function numDecodings(s: string): number"
    },
    {
      s,
      dp: [],
      i: -1,
      variables: { 's[0]': '2' },
      explanation: "Check if string starts with '0'. s[0] = '2', not '0', continue.",
      highlightedLines: [2],
      lineExecution: "if (s[0] === '0') return 0; // '2' !== '0', continue"
    },
    {
      s,
      dp: [0, 0, 0, 0],
      i: -1,
      variables: { dpLength: 4 },
      explanation: "Create DP array of length n+1 = 4. dp[i] = ways to decode s[0..i-1].",
      highlightedLines: [4],
      lineExecution: "const dp = new Array(s.length + 1).fill(0); // length = 4"
    },
    {
      s,
      dp: [1, 0, 0, 0],
      i: 0,
      variables: { 'dp[0]': 1 },
      explanation: "Base case: dp[0] = 1 (empty string, one way to decode nothing).",
      highlightedLines: [5],
      lineExecution: "dp[0] = 1;"
    },
    {
      s,
      dp: [1, 1, 0, 0],
      i: 1,
      variables: { 'dp[1]': 1 },
      explanation: "Base case: dp[1] = 1 (first character '2' decodes to 'B', one way).",
      highlightedLines: [6],
      lineExecution: "dp[1] = 1;"
    },
    {
      s,
      dp: [1, 1, 0, 0],
      i: 2,
      variables: { i: 2, n: 3 },
      explanation: "Start loop: i = 2. Check: 2 <= 3? Yes, continue.",
      highlightedLines: [8],
      lineExecution: "for (let i = 2; i <= s.length; i++) // i=2"
    },
    {
      s,
      dp: [1, 1, 0, 0],
      i: 2,
      one: 2,
      variables: { one: 2, substring: 's[1..2]="2"' },
      explanation: "Extract one digit: s[1..2] = '2', one = 2. Valid single digit (1-9).",
      highlightedLines: [9],
      lineExecution: "const one = parseInt(s.substring(i-1, i)); // one = 2"
    },
    {
      s,
      dp: [1, 1, 0, 0],
      i: 2,
      one: 2,
      two: 22,
      variables: { two: 22, substring: 's[0..2]="22"' },
      explanation: "Extract two digits: s[0..2] = '22', two = 22. Valid double digit (10-26).",
      highlightedLines: [10],
      lineExecution: "const two = parseInt(s.substring(i-2, i)); // two = 22"
    },
    {
      s,
      dp: [1, 1, 1, 0],
      i: 2,
      one: 2,
      variables: { one: 2, 'dp[2]': 1 },
      explanation: "one = 2 is valid (1-9). Add dp[1] to dp[2]. dp[2] += 1.",
      highlightedLines: [12],
      lineExecution: "if (one >= 1 && one <= 9) dp[i] += dp[i-1]; // dp[2] = 1"
    },
    {
      s,
      dp: [1, 1, 2, 0],
      i: 2,
      two: 22,
      variables: { two: 22, 'dp[2]': 2 },
      explanation: "two = 22 is valid (10-26). Add dp[0] to dp[2]. dp[2] = 1 + 1 = 2.",
      highlightedLines: [13],
      lineExecution: "if (two >= 10 && two <= 26) dp[i] += dp[i-2]; // dp[2] = 2"
    },
    {
      s,
      dp: [1, 1, 2, 0],
      i: 3,
      variables: { i: 3 },
      explanation: "Increment loop: i = 3. Check: 3 <= 3? Yes, continue.",
      highlightedLines: [8],
      lineExecution: "for (let i = 3; i <= s.length; i++) // i=3"
    },
    {
      s,
      dp: [1, 1, 2, 0],
      i: 3,
      one: 6,
      variables: { one: 6, substring: 's[2..3]="6"' },
      explanation: "Extract one digit: s[2..3] = '6', one = 6. Valid single digit.",
      highlightedLines: [9],
      lineExecution: "const one = parseInt(s.substring(i-1, i)); // one = 6"
    },
    {
      s,
      dp: [1, 1, 2, 0],
      i: 3,
      one: 6,
      two: 26,
      variables: { two: 26, substring: 's[1..3]="26"' },
      explanation: "Extract two digits: s[1..3] = '26', two = 26. Valid double digit.",
      highlightedLines: [10],
      lineExecution: "const two = parseInt(s.substring(i-2, i)); // two = 26"
    },
    {
      s,
      dp: [1, 1, 2, 2],
      i: 3,
      one: 6,
      variables: { one: 6, 'dp[3]': 2 },
      explanation: "one = 6 is valid. Add dp[2] to dp[3]. dp[3] = 0 + 2 = 2.",
      highlightedLines: [12],
      lineExecution: "if (one >= 1 && one <= 9) dp[i] += dp[i-1]; // dp[3] = 2"
    },
    {
      s,
      dp: [1, 1, 2, 3],
      i: 3,
      two: 26,
      variables: { two: 26, 'dp[3]': 3 },
      explanation: "two = 26 is valid (exactly at limit). Add dp[1] to dp[3]. dp[3] = 2 + 1 = 3.",
      highlightedLines: [13],
      lineExecution: "if (two >= 10 && two <= 26) dp[i] += dp[i-2]; // dp[3] = 3"
    },
    {
      s,
      dp: [1, 1, 2, 3],
      i: 4,
      variables: { i: 4, n: 3 },
      explanation: "Increment loop: i = 4. Check: 4 <= 3? No, exit loop.",
      highlightedLines: [8],
      lineExecution: "for (let i = 4; i <= s.length; i++) // 4 <= 3 -> false"
    },
    {
      s,
      dp: [1, 1, 2, 3],
      i: 3,
      variables: { result: 3, 'dp[n]': 3 },
      explanation: "Return dp[s.length] = dp[3] = 3. Three ways to decode '226'.",
      highlightedLines: [16],
      lineExecution: "return dp[s.length]; // dp[3] = 3"
    },
    {
      s,
      dp: [1, 1, 2, 3],
      i: 3,
      variables: { ways: 3, decodings: '"BBF", "BZ", "VF"', complexity: 'O(n)' },
      explanation: "Algorithm complete! 3 ways: '2-2-6' (BBF), '2-26' (BZ), '22-6' (VF). Time: O(n), Space: O(n).",
      highlightedLines: [16],
      lineExecution: "Result: 3 ways"
    }
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

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`string-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Encoded String</h3>
              <div className="flex gap-1 mb-3">
                {step.s.split('').map((char, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded font-mono text-xl font-bold ${
                      idx < step.i - 1
                        ? 'bg-secondary'
                        : idx === step.i - 1
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {char}
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground bg-blue-500/10 p-2 rounded">
                <strong>Mapping:</strong> A=1, B=2, C=3, ..., Z=26
              </div>
            </Card>
          </motion.div>

          {step.dp.length > 0 && (
            <motion.div
              key={`dp-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">DP Array (ways to decode)</h3>
                <div className="flex gap-2 flex-wrap">
                  {step.dp.map((val, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded font-mono text-center ${
                        idx === step.i
                          ? 'bg-green-500/20 ring-2 ring-green-500'
                          : idx < step.i
                          ? 'bg-green-500/10'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-xs">dp[{idx}]</div>
                      <div className="font-bold text-lg">{val}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

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
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
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
