import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  s: string;
  dp: boolean[];
  i: number;
  j: number;
  currentSubstring: string;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
}

export const WordBreakVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const s = "leetcode";
  const wordDict = ["leet", "code"];

  const code = `function wordBreak(s: string, wordDict: string[]): boolean {
    const wordSet = new Set(wordDict);
    const n = s.length;
    
    // dp[i] = true if s.substring(0, i) can be segmented
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;  // Empty string can be segmented
    
    for (let i = 1; i <= n; i++) {
        // Check all possible last words
        for (let j = 0; j < i; j++) {
            // If s[0:j] can be segmented and s[j:i] is in dict
            if (dp[j] && wordSet.has(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}`;

  const steps = useMemo(() => {
    const steps: Step[] = [];
    const n = s.length;
    const wordSet = new Set(wordDict);
    const dp = new Array(n + 1).fill(false);
    
    // Initial state
    steps.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { s: `"${s}"`, wordDict: `[${wordDict.map(w => `"${w}"`).join(', ')}]` },
      explanation: "Function started. Input string and dictionary received.",
      highlightedLines: [1]
    });

    // Initialize variables
    steps.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { wordSet: 'Set(...)', n },
      explanation: `Initialize wordSet and n = ${n}.`,
      highlightedLines: [2, 3]
    });

    // Initialize DP
    dp[0] = true;
    steps.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { dp: '[true, false, ...]', 'dp[0]': true },
      explanation: "Initialize dp array. dp[0] = true (base case for empty string).",
      highlightedLines: [6, 7]
    });

    for (let i = 1; i <= n; i++) {
      // Start outer loop
      steps.push({
        s,
        dp: [...dp],
        i,
        j: -1,
        currentSubstring: '',
        variables: { i, n },
        explanation: `Outer loop: Checking substring length i = ${i}.`,
        highlightedLines: [9]
      });

      for (let j = 0; j < i; j++) {
        const sub = s.substring(j, i);
        const dpVal = dp[j];
        const inDict = wordSet.has(sub);
        
        steps.push({
          s,
          dp: [...dp],
          i,
          j,
          currentSubstring: sub,
          variables: { i, j, substring: `"${sub}"`, 'dp[j]': dpVal },
          explanation: `Inner loop: Check split at j=${j}. Substring "${sub}" (from ${j} to ${i}). dp[${j}] is ${dpVal}.`,
          highlightedLines: [11, 13]
        });

        if (dpVal && inDict) {
            steps.push({
                s,
                dp: [...dp],
                i,
                j,
                currentSubstring: sub,
                variables: { i, j, substring: `"${sub}"`, found: true },
                explanation: `Match found! dp[${j}] is true AND "${sub}" is in dictionary.`,
                highlightedLines: [13]
            });
            
            dp[i] = true;
            steps.push({
                s,
                dp: [...dp],
                i,
                j,
                currentSubstring: sub,
                variables: { i, 'dp[i]': true },
                explanation: `Set dp[${i}] = true. We can form the prefix of length ${i}. Break inner loop.`,
                highlightedLines: [14, 15]
            });
            break;
        }
      }
    }

    // Return result
    steps.push({
        s,
        dp: [...dp],
        i: n,
        j: -1,
        currentSubstring: '',
        variables: { result: dp[n] },
        explanation: `Computation complete. Return dp[${n}] = ${dp[n]}.`,
        highlightedLines: [20]
    });

    return steps;
  }, [s, wordDict]);

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
                  {s.split('').map((char, idx) => {
                    let className = "bg-muted border-border";
                    const isCurrentRange = step.j !== -1 && idx >= step.j && idx < step.i;
                    const isProcessed = idx < step.i;
                    
                    if (isCurrentRange) {
                        className = "bg-blue-500/20 border-blue-500 text-blue-500";
                    } else if (isProcessed) {
                        className = "bg-green-500/10 border-green-500/30 text-green-600";
                    }

                    return (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`w-10 h-10 flex items-center justify-center font-bold border-2 rounded ${className}`}
                        >
                          {char}
                          <span className="absolute -bottom-5 text-[10px] text-muted-foreground font-normal border-none">
                              {idx}
                          </span>
                        </motion.div>
                    );
                  })}
                </div>
                {/* Index markers for i and j if needed, or visual indicators */}
              </div>
            </Card>
          </motion.div>

          <motion.div
              key={`dp-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-3 bg-muted/50">
                <div className="text-xs font-semibold mb-2">DP Array (dp[i] = can segment prefix of length i)</div>
                <div className="flex gap-1 overflow-x-auto pb-4">
                  {step.dp.map((val, idx) => (
                    <div key={idx} className="relative">
                        <div
                        className={`min-w-[2.5rem] h-10 flex items-center justify-center font-bold text-sm border-2 rounded ${
                            val ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-muted border-border'
                        } ${idx === step.i ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                        >
                        {val ? 'T' : 'F'}
                        </div>
                        <div className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-muted-foreground">
                            {idx}
                        </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Explanation:</div>
                <div className="text-sm bg-background/50 p-3 rounded">
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