import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  s: string;
  dp: boolean[];
  i: number;
  j: number;
  currentSubstring: string;
  variables: Record<string, any>;
  explanation: string;
  lineExecution: string;
  highlightedLines: number[];
}

export const WordBreakVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const s = "leetcode";
  const wordDict = ["leet", "code"];

  const code = `function wordBreak(s: string, wordDict: string[]): boolean {
  const wordSet = new Set(wordDict);
  const n = s.length;
  const dp: boolean[] = new Array(n + 1).fill(false);
  dp[0] = true;
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

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const n = s.length;
    const wordSet = new Set(wordDict);
    const dp = new Array(n + 1).fill(false);

    stepsList.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { s: `"${s}"`, wordDict: `["${wordDict.join('", "')}"]` },
      explanation: "Function started. Input string and dictionary received.",
      lineExecution: "function wordBreak(s: string, wordDict: string[]): boolean {",
      highlightedLines: [1]
    });

    stepsList.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { wordSet: 'Set(...)', n },
      explanation: `Initialize wordSet and determine length of string n = ${n}.`,
      lineExecution: "const wordSet = new Set(wordDict);\nconst n = s.length;",
      highlightedLines: [2, 3]
    });

    dp[0] = true;
    stepsList.push({
      s,
      dp: [...dp],
      i: 0,
      j: -1,
      currentSubstring: '',
      variables: { n, dp: '[true, false, ...]', 'dp[0]': true },
      explanation: "Initialize DP array of size n + 1 with false. Set dp[0] = true as the base case representing an empty prefix string.",
      lineExecution: "const dp: boolean[] = new Array(n + 1).fill(false);\ndp[0] = true;",
      highlightedLines: [4, 5]
    });

    for (let i = 1; i <= n; i++) {
      stepsList.push({
        s,
        dp: [...dp],
        i,
        j: -1,
        currentSubstring: '',
        variables: { n, i },
        explanation: `Outer loop iteration checking prefix of length i = ${i}. We analyze the substring up to character ${i}.`,
        lineExecution: "for (let i = 1; i <= n; i++) {",
        highlightedLines: [6]
      });

      for (let j = 0; j < i; j++) {
        const sub = s.substring(j, i);
        const dpVal = dp[j];
        const inDict = wordSet.has(sub);

        stepsList.push({
          s,
          dp: [...dp],
          i,
          j,
          currentSubstring: sub,
          variables: { i, j, substring: `"${sub}"`, 'dp[j]': dpVal },
          explanation: `Inner loop evaluating split position j = ${j}.\nIs prefix up to j valid? (dp[${j}] = ${dpVal})\nWe extract substring "${sub}" starting from index ${j} to ${i}.`,
          lineExecution: "for (let j = 0; j < i; j++) {",
          highlightedLines: [7]
        });

        stepsList.push({
          s,
          dp: [...dp],
          i,
          j,
          currentSubstring: sub,
          variables: { i, j, substring: `"${sub}"`, 'dp[j]': dpVal, inDict },
          explanation: `Verify validity: Is prefix up to ${j} segmented (dp[${j}]) AND is "${sub}" present in our valid wordSet?\nBoth conditions must be true.`,
          lineExecution: "if (dp[j] && wordSet.has(s.substring(j, i))) {",
          highlightedLines: [8]
        });

        if (dpVal && inDict) {
          dp[i] = true;
          stepsList.push({
            s,
            dp: [...dp],
            i,
            j,
            currentSubstring: sub,
            variables: { i, j, substring: `"${sub}"`, 'dp[i]': true },
            explanation: `Match successful! dp[${j}] is true and "${sub}" exists in dictionary. \nWe can safely conclude prefix of length ${i} is successfully segmented. Set dp[${i}] = true.`,
            lineExecution: "dp[i] = true;\nbreak;",
            highlightedLines: [9, 10]
          });
          break;
        }
      }
    }

    stepsList.push({
      s,
      dp: [...dp],
      i: n,
      j: -1,
      currentSubstring: '',
      variables: { result: dp[n] },
      explanation: `All prefix evaluations completed. Final outcome is retrieved from dp[${n}], resulting in ${dp[n]}.`,
      lineExecution: "return dp[n];",
      highlightedLines: [14]
    });

    return stepsList;
  }, [s, wordDict]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Word Break Visualization
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden">
              <div className="p-3 bg-muted/30 rounded text-sm text-black dark:text-white mb-4">
                  <span className="font-semibold">Dictionary:</span> [{wordDict.map(w => `"${w}"`).join(', ')}]
              </div>
              
              <h3 className="text-sm font-semibold text-black dark:text-white mb-4 border-b border-primary/20 pb-2">
                 Input String (s="leetcode")
              </h3>
              <div className="flex flex-wrap gap-1 mb-6">
                {s.split('').map((char, idx) => {
                  let charBoxClass = "bg-white dark:bg-card border-gray-300 dark:border-border text-black dark:text-white";
                  const isCurrentRange = step.j !== -1 && idx >= step.j && idx < step.i;
                  const isProcessed = idx < step.i;

                  if (isCurrentRange) {
                    charBoxClass = "bg-blue-300 border-blue-500 shadow-lg text-black";
                  } else if (isProcessed) {
                    charBoxClass = "bg-green-300 border-green-500 text-black";
                  }

                  return (
                    <div
                      key={idx}
                      className={`w-8 h-8 flex flex-col items-center justify-center font-bold border-2 rounded ${charBoxClass}`}
                    >
                      <span className="text-sm">{char}</span>
                    </div>
                  );
                })}
              </div>

              <h3 className="text-xs font-semibold text-black dark:text-white mb-4 border-b border-primary/20 pb-2">
                 DP Array (can segment prefix of length i)
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-6">
                {step.dp.map((val, idx) => {
                   const isI = idx === step.i && step.i !== -1;
                   const isJ = idx === step.j && step.j !== -1;
                   
                   let dpBoxClass = val ? 'bg-green-300 border-green-500 text-black' : 'bg-white dark:bg-card border-gray-300 dark:border-border text-black dark:text-white';
                   
                   if (isI) {
                     dpBoxClass = 'bg-orange-300 border-orange-500 text-black shadow-lg';
                   } else if (isJ) {
                     dpBoxClass = 'bg-blue-300 border-blue-500 text-black shadow-lg';
                   }

                   return (
                     <div key={idx} className="flex flex-col items-center gap-1">
                       <div
                         className={`w-8 h-8 flex items-center justify-center font-bold text-xs border-2 rounded ${dpBoxClass}`}
                       >
                         {val ? 'T' : 'F'}
                       </div>
                       <div className="flex flex-col items-center h-4">
                          {isI && <div className="text-[9px] font-black text-primary bg-primary/20 px-1 rounded uppercase tracking-tighter">i</div>}
                          {isJ && <div className="text-[9px] font-black text-secondary bg-secondary/20 px-1 rounded uppercase tracking-tighter">j</div>}
                       </div>
                     </div>
                   );
                })}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <div className="space-y-4">
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                     Current Execution
                   </h4>
                   <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                     {step.lineExecution}
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                     Commentary
                   </h4>
                   <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
                     {step.explanation}
                   </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
           <div className="flex-1 overflow-hidden min-h-[400px]">
             <AnimatedCodeEditor
               code={code}
               language="typescript"
               highlightedLines={step.highlightedLines}
             />
           </div>
           
           <div className="p-1">
             <VariablePanel variables={step.variables} />
           </div>
        </div>
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