import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  s: string;
  memo: Map<number, number>;
  i: number | null;
  res: number | null;
  stack: number[];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const DecodeWaysVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const s = "11106";

  const code = `function numDecodings(s: string): number {
  const dp: Map<number, number> = new Map();
  dp.set(s.length, 1);
  function dfs(i: number): number {
    if (dp.has(i)) return dp.get(i)!;
    if (s[i] === '0') return 0;
    
    let res = dfs(i + 1);
    if (
      i + 1 < s.length &&
      (s[i] === '1' || (s[i] === '2' && '0123456'.includes(s[i + 1])))
    ) {
      res += dfs(i + 2);
    }
    
    dp.set(i, res);
    return res;
  }
  return dfs(0);
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const memo = new Map<number, number>();
    const stack: number[] = [];
    const n = s.length;

    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [...stack],
      variables: { s: `"${s}"` },
      explanation: `Problem: Count the number of ways to decode "${s}" using the mapping 1=A, 2=B, ..., 26=Z. We will use Depth-First Search with Memoization to explore all valid decoding paths.`,
      lineExecution: "function numDecodings(s: string): number {",
      highlightedLines: [1]
    });

    memo.set(n, 1);
    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [...stack],
      variables: { "memo[5]": 1 },
      explanation: `Initialize the memoization Map. Base case: Reaching the end of the string (index ${n}) is a successful decoding. dp.set(${n}, 1).`,
      lineExecution: "const dp: Map<number, number> = new Map();\ndp.set(s.length, 1);",
      highlightedLines: [2, 3]
    });

    const solve = (i: number): number => {
      stack.push(i);
      
      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res: null,
        stack: [...stack],
        variables: { i, stack: stack.join(" → ") },
        explanation: `Enter dfs(${i}). We are looking at the character '${s[i]}' at index ${i}. First, check the memo Map to see if we've already solved this subproblem.`,
        lineExecution: "function dfs(i: number): number {",
        highlightedLines: [4]
      });

      if (memo.has(i)) {
        const val = memo.get(i)!;
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res: val,
          stack: [...stack],
          variables: { i, "memo.get(i)": val },
          explanation: `MEMO HIT: The result for index ${i} is already in our Map (${val}). We return this value to skip re-computation.`,
          lineExecution: "if (dp.has(i)) return dp.get(i)!;",
          highlightedLines: [5]
        });
        stack.pop();
        return val;
      }

      if (s[i] === '0') {
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res: 0,
          stack: [...stack],
          variables: { i, "s[i]": "0" },
          explanation: `Invalid leading zero: The character at index ${i} is '0'. A valid decoding cannot start with '0'. This path returns 0 ways.`,
          lineExecution: "if (s[i] === '0') return 0;",
          highlightedLines: [6]
        });
        stack.pop();
        return 0;
      }

      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res: null,
        stack: [...stack],
        variables: { i, next_call: `dfs(${i + 1})` },
        explanation: `Valid single-digit decoding: Taking the number ${s[i]} as a letter (e.g., '${s[i]}' → '${String.fromCharCode(64 + parseInt(s[i]))}'). Now, call dfs(${i + 1}) to explore the rest of the string.`,
        lineExecution: "let res = dfs(i + 1);",
        highlightedLines: [8]
      });
      
      let res = solve(i + 1);
      
      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res,
        stack: [...stack],
        variables: { i, res },
        explanation: `Returned to dfs(${i}). The single-digit path starting at index ${i} found ${res} ways. Now, check if taking two digits starting at index ${i} forms a valid letter code (10–26).`,
        lineExecution: "let res = dfs(i + 1);",
        highlightedLines: [8]
      });

      if (i + 1 < n && (s[i] === '1' || (s[i] === '2' && '0123456'.includes(s[i + 1])))) {
        const combined = s.substring(i, i + 2);
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, combined_digits: combined, next_call: `dfs(${i + 2})` },
          explanation: `Valid two-digit decoding: The digits "${combined}" form a valid letter (10–26). Now, call dfs(${i + 2}) to explore this branch.`,
          lineExecution: "res += dfs(i + 2);",
          highlightedLines: [13]
        });
        const res2 = solve(i + 2);
        res += res2;
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, ways_from_combined: res2, total_ways_so_far: res },
          explanation: `Returned to dfs(${i}). The two-digit path ("${combined}") added ${res2} more way(s). The current total for index ${i} is now ${res}.`,
          lineExecution: "res += dfs(i + 2);",
          highlightedLines: [13]
        });
      } else {
        const combined = i + 1 < n ? s.substring(i, i + 2) : "n/a";
        stepsList.push({
          s,
          memo: new Map(memo),
          i,
          res,
          stack: [...stack],
          variables: { i, combined_digits: combined },
          explanation: combined !== "n/a" 
            ? `Two-digit check: "${combined}" is NOT a valid letter code (>26 or starting with '0'). Skipping this branch.`
            : `Two-digit check: End of string reached. No more pairs possible.`,
          lineExecution: "if (i + 1 < s.length && ...)",
          highlightedLines: [10, 11]
        });
      }

      memo.set(i, res);
      stepsList.push({
        s,
        memo: new Map(memo),
        i,
        res,
        stack: [...stack],
        variables: { i, final_subproblem_result: res },
        explanation: `Completed subproblem for index ${i}. The final count of ways to decode "${s.substring(i)}" is ${res}. We store this in our memo and return to the caller.`,
        lineExecution: "dp.set(i, res);\nreturn res;",
        highlightedLines: [16, 17]
      });
      
      stack.pop();
      return res;
    };

    stepsList.push({
      s,
      memo: new Map(memo),
      i: null,
      res: null,
      stack: [],
      variables: { initial_call: "dfs(0)" },
      explanation: "Now calling the recursive DFS function starting at the very beginning of the string (index 0).",
      lineExecution: "return dfs(0);",
      highlightedLines: [20]
    });

    const finalRes = solve(0);

    stepsList.push({
      s,
      memo: new Map(memo),
      i: 0,
      res: finalRes,
      stack: [],
      variables: { final_result: finalRes },
      explanation: `ALGORITHM COMPLETE. The final result for dfs(0) is ${finalRes}. There are exactly ${finalRes} different ways to decode "${s}". (Paths: AAJF, KJF)`,
      lineExecution: "return final_result;",
      highlightedLines: [20]
    });

    return stepsList;
  }, [s]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Decode Ways (DFS + Memoization)
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative">
              <div className="mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Input String Inspection</h4>
                <div className="flex gap-2">
                  {s.split('').map((char, idx) => {
                    const isProcessing = step.i === idx;
                    const isInStack = step.stack.includes(idx);
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 group relative">
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold transition-colors duration-0 ${
                            isProcessing ? "border-orange-500 bg-orange-100 text-black shadow-lg scale-110 z-10" :
                            isInStack ? "border-blue-500 bg-blue-50 text-black shadow-sm" :
                            "border-gray-200 bg-white text-black"
                          }`}
                        >
                          {char}
                        </div>
                        {isProcessing && <div className="text-[8px] font-black text-orange-600 bg-orange-100 px-1 rounded uppercase">DFS({idx})</div>}
                        {!isProcessing && isInStack && <div className="text-[8px] font-bold text-blue-600 uppercase">Wait</div>}
                      </div>
                    );
                  })}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 border-dashed font-bold transition-colors ${
                      step.i === s.length ? "border-green-500 bg-green-100 text-black" : "border-gray-200 text-gray-300"
                    }`}>
                      END
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Memoization Table (dp Map)</h4>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: s.length + 1 }).map((_, idx) => {
                    const hasValue = step.memo.has(idx);
                    const val = step.memo.get(idx);
                    const isProcessing = step.i === idx;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1 group relative">
                        <div 
                          className={`w-14 h-14 flex flex-col items-center justify-center rounded-lg border-2 font-black transition-colors duration-0 shadow-sm ${
                            hasValue ? "border-green-500 bg-green-100 text-black" :
                            isProcessing ? "border-orange-200 bg-orange-50/50" :
                            "border-gray-100 bg-gray-50/50 text-gray-300"
                          }`}
                        >
                          <span className={`text-[9px] uppercase font-bold italic ${hasValue ? "text-green-800" : "text-gray-400"}`}>dp[{idx}]</span>
                          <span className={`text-xl ${hasValue ? "text-black" : "text-gray-300"}`}>{hasValue ? val : "?"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {step.stack.length > 0 && (
                <div className="mt-8 border-t border-dashed pt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Active Call Stack</h4>
                  <div className="flex gap-2 items-center flex-wrap">
                    {step.stack.map((idx, pos) => (
                      <React.Fragment key={pos}>
                        <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold ring-1 ring-blue-700/20 shadow-sm">
                          dfs({idx})
                        </div>
                        {pos < step.stack.length - 1 && <span className="text-gray-300 font-bold">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
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
                    <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap text-black">
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
