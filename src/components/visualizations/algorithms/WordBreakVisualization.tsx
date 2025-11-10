import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  s: string;
  dp: boolean[];
  currentIndex: number;
  currentSubstring: string;
  checking: string;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const WordBreakVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const s = "leetcode";
  const wordDict = ["leet", "code"];

  const steps: Step[] = [
    {
      s,
      dp: [],
      currentIndex: 0,
      currentSubstring: '',
      checking: '',
      variables: { s: '"leetcode"', wordDict: '["leet","code"]', n: 8 },
      explanation: "Starting with s = 'leetcode' and wordDict = ['leet', 'code'].",
      highlightedLines: [1],
      lineExecution: "function wordBreak(s: string, wordDict: string[]): boolean {"
    },
    {
      s,
      dp: [],
      currentIndex: 0,
      currentSubstring: '',
      checking: '',
      variables: { n: 8, s: '"leetcode"' },
      explanation: "Get string length: n = s.length = 8.",
      highlightedLines: [2],
      lineExecution: "const n = s.length = 8;"
    },
    {
      s,
      dp: [false, false, false, false, false, false, false, false, false],
      currentIndex: 0,
      currentSubstring: '',
      checking: '',
      variables: { n: 8, dp: 'array size n+1' },
      explanation: "Initialize dp array of size n+1 = 9. All values = false initially.",
      highlightedLines: [3],
      lineExecution: "const dp = new Array(n + 1).fill(false);"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 0,
      currentSubstring: '',
      checking: '',
      variables: { 'dp[0]': true },
      explanation: "Base case: dp[0] = true. Empty string can always be segmented.",
      highlightedLines: [4],
      lineExecution: "dp[0] = true;"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 0,
      currentSubstring: '',
      checking: '',
      variables: { wordSet: 'Set(["leet","code"])' },
      explanation: "Convert wordDict to Set for O(1) lookup.",
      highlightedLines: [5],
      lineExecution: "const wordSet = new Set(wordDict);"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 1,
      currentSubstring: 'l',
      checking: '',
      variables: { i: 1, n: 8 },
      explanation: "Start outer loop: i = 1. Check: 1 <= 8? Yes.",
      highlightedLines: [7],
      lineExecution: "for (let i = 1; i <= n; i++)"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 1,
      currentSubstring: 'l',
      checking: 'l',
      variables: { i: 1, j: 0, substring: 'l' },
      explanation: "i=1, j=0: Check substring 'l' (from 0 to 1). Not in wordDict.",
      highlightedLines: [8, 9],
      lineExecution: "s.substring(0, 1) = 'l'"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 4,
      currentSubstring: 'leet',
      checking: '',
      variables: { i: 4 },
      explanation: "Skip to i=4. Previous iterations didn't find valid words.",
      highlightedLines: [7],
      lineExecution: "for (let i = 4; i <= n; i++)"
    },
    {
      s,
      dp: [true, false, false, false, false, false, false, false, false],
      currentIndex: 4,
      currentSubstring: 'leet',
      checking: 'leet',
      variables: { i: 4, j: 0, substring: 'leet', 'dp[0]': true },
      explanation: "i=4, j=0: Check substring 'leet' (from 0 to 4). dp[0]=true AND 'leet' in wordDict!",
      highlightedLines: [9],
      lineExecution: "if (dp[j] && wordSet.has(s.substring(j, i))) -> true"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, false],
      currentIndex: 4,
      currentSubstring: 'leet',
      checking: '',
      variables: { 'dp[4]': true },
      explanation: "Set dp[4] = true. Can form 'leet' from start. Break inner loop.",
      highlightedLines: [10, 11],
      lineExecution: "dp[4] = true; break;"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, false],
      currentIndex: 5,
      currentSubstring: 'leetc',
      checking: '',
      variables: { i: 5 },
      explanation: "i=5: Check all possible substrings ending at 5.",
      highlightedLines: [7],
      lineExecution: "for (let i = 5; i <= n; i++)"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, false],
      currentIndex: 5,
      currentSubstring: 'leetc',
      checking: 'c',
      variables: { i: 5, j: 4, substring: 'c' },
      explanation: "i=5, j=4: Check 'c' (from 4 to 5). Not in wordDict.",
      highlightedLines: [9],
      lineExecution: "s.substring(4, 5) = 'c'"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, false],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: '',
      variables: { i: 8 },
      explanation: "i=8: Final check. Try all possible splits.",
      highlightedLines: [7],
      lineExecution: "for (let i = 8; i <= n; i++)"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, false],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: 'code',
      variables: { i: 8, j: 4, substring: 'code', 'dp[4]': true },
      explanation: "i=8, j=4: Check 'code' (from 4 to 8). dp[4]=true AND 'code' in wordDict!",
      highlightedLines: [9],
      lineExecution: "if (dp[j] && wordSet.has(s.substring(j, i))) -> true"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, true],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: '',
      variables: { 'dp[8]': true },
      explanation: "Set dp[8] = true. Can form 'code' after 'leet'. Break inner loop.",
      highlightedLines: [10, 11],
      lineExecution: "dp[8] = true; break;"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, true],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: '',
      variables: { i: 9, n: 8 },
      explanation: "Check loop condition: i (9) <= n (8)? No, exit loop.",
      highlightedLines: [7],
      lineExecution: "for (let i = 9; i <= n; i++) -> false"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, true],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: '',
      variables: { result: true },
      explanation: "Return dp[n] = dp[8] = true. Yes, 'leetcode' can be segmented!",
      highlightedLines: [15],
      lineExecution: "return dp[n] = true"
    },
    {
      s,
      dp: [true, false, false, false, true, false, false, false, true],
      currentIndex: 8,
      currentSubstring: 'leetcode',
      checking: '',
      variables: { result: true, segmentation: '"leet" + "code"' },
      explanation: "Algorithm complete! Time: O(n² × m), Space: O(n). m = avg word length.",
      highlightedLines: [15],
      lineExecution: "Result: true ('leet' + 'code')"
    }
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
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Word Break: "{s}"</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted/30 rounded text-sm">
                  Dictionary: [{wordDict.map(w => `"${w}"`).join(', ')}]
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.split('').map((char, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`w-10 h-10 flex items-center justify-center font-bold border-2 ${
                        idx < step.currentIndex ? 'bg-green-500/20 border-green-500 text-green-500' :
                        idx === step.currentIndex - 1 ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 
                        'bg-muted border-border'
                      }`}
                    >
                      {char}
                    </motion.div>
                  ))}
                </div>
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
              <Card className="p-3 bg-muted/50">
                <div className="text-xs font-semibold mb-2">DP Array</div>
                <div className="flex gap-1 overflow-x-auto">
                  {step.dp.map((val, idx) => (
                    <div
                      key={idx}
                      className={`min-w-[2.5rem] h-10 flex items-center justify-center font-bold text-sm border-2 ${
                        val ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-muted border-border'
                      }`}
                    >
                      {idx}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step.checking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-3 bg-blue-500/10 border border-blue-500">
                <div className="text-sm">Checking: "{step.checking}"</div>
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