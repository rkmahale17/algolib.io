import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  i: number;
  j: number;
  activeStack: [number, number][];
  memo: Record<string, boolean>;
  success: Record<string, boolean>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const InterleavingStringVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  const s1 = "aabcc";
  const s2 = "dbbca";
  const s3 = "aadbbcbcac";

  const code = `function isInterleave(s1: string, s2: string, s3: string): boolean {
    if (s1.length + s2.length !== s3.length) {
        return false;
    }

    const dp = new Map<string, boolean>();

    const dfs = (i: number, j: number): boolean => {
        if (i === s1.length && j === s2.length) {
            return true;
        }

        const key = \`\${i},\${j}\`;
        if (dp.has(key)) {
            return dp.get(key)!;
        }

        if (
            i < s1.length &&
            s1[i] === s3[i + j] &&
            dfs(i + 1, j)
        ) {
            return true;
        }

        if (
            j < s2.length &&
            s2[j] === s3[i + j] &&
            dfs(i, j + 1)
        ) {
            return true;
        }

        dp.set(key, false);
        return false;
    };

    return dfs(0, 0);
}`;

  useEffect(() => {
    const tempSteps: Step[] = [];
    const memo: Record<string, boolean> = {};
    const success: Record<string, boolean> = {};
    const currentStack: [number, number][] = [];

    // Step 1: Initial check
    tempSteps.push({
      i: -1,
      j: -1,
      activeStack: [],
      memo: {},
      success: {},
      explanation: `First, check if the sum of s1's length (${s1.length}) and s2's length (${s2.length}) is equal to s3's length (${s3.length}). Since 5 + 5 = 10, the lengths match and we can proceed.`,
      highlightedLines: [2],
      lineExecution: "if (s1.length + s2.length !== s3.length)"
    });

    // Step 2: Initialize Memo
    tempSteps.push({
      i: -1,
      j: -1,
      activeStack: [],
      memo: {},
      success: {},
      explanation: `Initialize a memoization Map 'dp' to cache results for subproblems. This prevents recomputing states (i, j) that have already been evaluated.`,
      highlightedLines: [6],
      lineExecution: "const dp = new Map<string, boolean>();"
    });

    // Step 3: Trigger DFS
    tempSteps.push({
      i: -1,
      j: -1,
      activeStack: [],
      memo: {},
      success: {},
      explanation: `Start the depth-first search (DFS) by invoking dfs(0, 0). Pointers for both s1 and s2 start at index 0.`,
      highlightedLines: [38],
      lineExecution: "return dfs(0, 0);"
    });

    const runDfs = (i: number, j: number): boolean => {
      const key = `${i},${j}`;
      currentStack.push([i, j]);

      // Enter dfs
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: `dfs(${i}, ${j}) is called. This means we are attempting to form the prefix of s3 of length ${i + j} using ${i} characters from s1 and ${j} characters from s2.`,
        highlightedLines: [8],
        lineExecution: `const dfs = (${i}, ${j}) => {`
      });

      // Base Case Check
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: `Check if we have reached the end of both strings. i is ${i}/${s1.length} and j is ${j}/${s2.length}.`,
        highlightedLines: [9],
        lineExecution: "if (i === s1.length && j === s2.length)"
      });

      if (i === s1.length && j === s2.length) {
        success[key] = true;
        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `Both s1 and s2 are fully exhausted! We have successfully formed the entire s3 string. Return true.`,
          highlightedLines: [10],
          lineExecution: "return true;"
        });
        currentStack.pop();
        return true;
      }

      // Memo check
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: `Check if state (${i}, ${j}) is already in the memo Map. Key is "${key}".`,
        highlightedLines: [13, 14],
        lineExecution: `const key = "${key}"; if (dp.has(key))`
      });

      if (key in memo) {
        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `Memo hit! dfs(${i}, ${j}) was already computed and stored as false. Return cached result.`,
          highlightedLines: [15],
          lineExecution: "return dp.get(key);"
        });
        currentStack.pop();
        return memo[key];
      }

      // Match character from s1
      const canMatchS1 = i < s1.length && s1[i] === s3[i + j];
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: i < s1.length 
          ? `Compare current character of s1 ('${s1[i]}') at index ${i} with s3 ('${s3[i + j]}') at index ${i + j}.`
          : `s1 is fully exhausted. Cannot match from s1.`,
        highlightedLines: [19, 20],
        lineExecution: "i < s1.length && s1[i] === s3[i + j]"
      });

      if (canMatchS1) {
        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `Match! s1[${i}] ('${s1[i]}') matches s3[${i + j}] ('${s3[i + j]}'). Recursively search by moving s1's pointer: dfs(${i + 1}, ${j}).`,
          highlightedLines: [21],
          lineExecution: "dfs(i + 1, j)"
        });

        const matched = runDfs(i + 1, j);
        if (matched) {
          success[key] = true;
          tempSteps.push({
            i,
            j,
            activeStack: [...currentStack],
            memo: { ...memo },
            success: { ...success },
            explanation: `dfs(${i + 1}, ${j}) returned true. Thus, dfs(${i}, ${j}) also succeeds. Return true.`,
            highlightedLines: [23],
            lineExecution: "return true;"
          });
          currentStack.pop();
          return true;
        }

        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `dfs(${i + 1}, ${j}) returned false. That branch failed; backtrack and try matching from s2 instead.`,
          highlightedLines: [21],
          lineExecution: "dfs(i + 1, j) // failed"
        });
      }

      // Match character from s2
      const canMatchS2 = j < s2.length && s2[j] === s3[i + j];
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: j < s2.length
          ? `Compare current character of s2 ('${s2[j]}') at index ${j} with s3 ('${s3[i + j]}') at index ${i + j}.`
          : `s2 is fully exhausted. Cannot match from s2.`,
        highlightedLines: [27, 28],
        lineExecution: "j < s2.length && s2[j] === s3[i + j]"
      });

      if (canMatchS2) {
        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `Match! s2[${j}] ('${s2[j]}') matches s3[${i + j}] ('${s3[i + j]}'). Recursively search by moving s2's pointer: dfs(${i}, ${j + 1}).`,
          highlightedLines: [29],
          lineExecution: "dfs(i, j + 1)"
        });

        const matched = runDfs(i, j + 1);
        if (matched) {
          success[key] = true;
          tempSteps.push({
            i,
            j,
            activeStack: [...currentStack],
            memo: { ...memo },
            success: { ...success },
            explanation: `dfs(${i}, ${j + 1}) returned true. Thus, dfs(${i}, ${j}) also succeeds. Return true.`,
            highlightedLines: [31],
            lineExecution: "return true;"
          });
          currentStack.pop();
          return true;
        }

        tempSteps.push({
          i,
          j,
          activeStack: [...currentStack],
          memo: { ...memo },
          success: { ...success },
          explanation: `dfs(${i}, ${j + 1}) returned false. That branch also failed.`,
          highlightedLines: [29],
          lineExecution: "dfs(i, j + 1) // failed"
        });
      }

      // No match works, cache and return false
      memo[key] = false;
      tempSteps.push({
        i,
        j,
        activeStack: [...currentStack],
        memo: { ...memo },
        success: { ...success },
        explanation: `No valid paths could be formed from state (${i}, ${j}). Store false in memo and return false.`,
        highlightedLines: [34, 35],
        lineExecution: "dp.set(key, false); return false;"
      });

      currentStack.pop();
      return false;
    };

    const finalResult = runDfs(0, 0);

    // Final result step
    tempSteps.push({
      i: -1,
      j: -1,
      activeStack: [],
      memo: { ...memo },
      success: { ...success },
      explanation: `dfs(0, 0) returned ${finalResult}. Since there exists a valid path that interleaves s1 and s2 to form s3, the function returns true.`,
      highlightedLines: [38],
      lineExecution: `return dfs(0, 0); // returned ${finalResult}`
    });

    setSteps(tempSteps);
    setCurrentStep(0);
  }, []);

  if (steps.length === 0) {
    return <div className="text-center py-10">Loading visualization...</div>;
  }

  const step = steps[currentStep];

  // Helper to determine the status of a grid cell
  const getCellStatus = (r: number, c: number) => {
    const key = `${r},${c}`;
    const isActive = step.activeStack.some(([sI, sJ]) => sI === r && sJ === c);
    const isSuccess = step.success[key] === true;
    const isFailed = step.memo[key] === false;

    if (isActive) return 'active';
    if (isSuccess) return 'success';
    if (isFailed) return 'failed';
    return 'unvisited';
  };

  // Check if a character is matched on the active path
  const isCharMatchedS1 = (index: number) => {
    for (let k = 0; k < step.activeStack.length - 1; k++) {
      const [currI, currJ] = step.activeStack[k];
      const [nextI, nextJ] = step.activeStack[k + 1];
      if (currI === index && nextI === index + 1 && currJ === nextJ) {
        return true;
      }
    }
    return false;
  };

  const isCharMatchedS2 = (index: number) => {
    for (let k = 0; k < step.activeStack.length - 1; k++) {
      const [currI, currJ] = step.activeStack[k];
      const [nextI, nextJ] = step.activeStack[k + 1];
      if (currJ === index && nextJ === index + 1 && currI === nextI) {
        return true;
      }
    }
    return false;
  };

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
      leftContent={
        <div className="space-y-6">
          {/* Strings and Pointers Panel */}
          <Card className="p-5 border shadow-sm">
            <h3 className="text-sm font-semibold mb-4 text-foreground/80 uppercase tracking-wider">String Pointers</h3>
            <div className="space-y-4">
              {/* String 1 */}
              <div className="flex items-center gap-4">
                <span className="w-12 text-sm font-semibold text-muted-foreground">s1:</span>
                <div className="flex gap-1">
                  {s1.split('').map((char, index) => {
                    const isActive = step.i === index;
                    const isMatched = isCharMatchedS1(index);
                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                          isActive
                            ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                            : isMatched
                            ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                            : 'bg-muted/30 border-border/50 text-muted-foreground'
                        }`}
                      >
                        {char}
                        {isActive && (
                          <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                            i={index}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div
                    className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                      step.i === s1.length
                        ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    ∅
                    {step.i === s1.length && (
                      <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                        i={s1.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* String 2 */}
              <div className="flex items-center gap-4 pt-2">
                <span className="w-12 text-sm font-semibold text-muted-foreground">s2:</span>
                <div className="flex gap-1">
                  {s2.split('').map((char, index) => {
                    const isActive = step.j === index;
                    const isMatched = isCharMatchedS2(index);
                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                          isActive
                            ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                            : isMatched
                            ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                            : 'bg-muted/30 border-border/50 text-muted-foreground'
                        }`}
                      >
                        {char}
                        {isActive && (
                          <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                            j={index}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div
                    className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                      step.j === s2.length
                        ? 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/30'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    ∅
                    {step.j === s2.length && (
                      <div className="absolute -bottom-5 text-[8px] font-black uppercase text-blue-600 dark:text-blue-400">
                        j={s2.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* String 3 */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <span className="w-12 text-sm font-semibold text-muted-foreground">s3:</span>
                <div className="flex gap-1 flex-wrap">
                  {s3.split('').map((char, index) => {
                    const isActive = step.i !== -1 && step.j !== -1 && (step.i + step.j) === index;
                    const isMatched = step.i !== -1 && step.j !== -1 && index < (step.i + step.j);
                    return (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-sm font-bold transition-all relative ${
                          isActive
                            ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/30'
                            : isMatched
                            ? 'bg-green-500/25 border-green-500/40 text-green-700 dark:text-green-400'
                            : 'bg-muted/30 border-border/50 text-muted-foreground'
                        }`}
                      >
                        {char}
                        {isActive && (
                          <div className="absolute -bottom-5 text-[7px] font-black uppercase text-primary">
                            i+j={index}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div
                    className={`w-8 h-8 rounded border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground/40 transition-all relative ${
                      step.i !== -1 && step.j !== -1 && (step.i + step.j) === s3.length
                        ? 'bg-primary/20 border-primary text-primary ring-2 ring-primary/30'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    ∅
                    {step.i !== -1 && step.j !== -1 && (step.i + step.j) === s3.length && (
                      <div className="absolute -bottom-5 text-[7px] font-black uppercase text-primary">
                        i+j={s3.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 2D DP Table / State space */}
          <Card className="p-5 border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">DFS Memoization Grid</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500" />
                  <span className="text-muted-foreground">Active Stack</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500" />
                  <span className="text-muted-foreground">Path Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500" />
                  <span className="text-muted-foreground">Memoized False</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted text-xs text-muted-foreground font-mono text-center">
                      s1\s2
                    </th>
                    <th className="border border-border p-2 bg-muted text-xs font-mono text-center">
                      ∅<div className="text-[10px] text-muted-foreground font-normal">0</div>
                    </th>
                    {s2.split('').map((char, index) => (
                      <th key={index} className="border border-border p-2 bg-muted text-xs font-mono text-center font-bold">
                        {char}
                        <div className="text-[10px] text-muted-foreground font-normal">{index + 1}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: s1.length + 1 }).map((_, r) => (
                    <tr key={r}>
                      <td className="border border-border p-2 bg-muted text-xs font-mono font-bold text-center">
                        {r === 0 ? '∅' : s1[r - 1]}
                        <div className="text-[10px] text-muted-foreground font-normal">{r}</div>
                      </td>
                      {Array.from({ length: s2.length + 1 }).map((_, c) => {
                        const status = getCellStatus(r, c);
                        const isCurrent = step.i === r && step.j === c;
                        
                        let cellClass = 'bg-background text-muted-foreground/40';
                        let symbol = '';

                        if (status === 'active') {
                          cellClass = 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500 font-extrabold animate-pulse';
                          symbol = '●';
                        } else if (status === 'success') {
                          cellClass = 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500 font-bold';
                          symbol = '✓';
                        } else if (status === 'failed') {
                          cellClass = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
                          symbol = '✗';
                        }

                        return (
                          <td
                            key={c}
                            className={`border border-border p-2 text-center text-xs font-semibold select-none transition-all ${cellClass} ${
                              isCurrent ? 'ring-2 ring-primary ring-inset font-black' : ''
                            }`}
                            style={{ minWidth: '40px', height: '40px' }}
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <span className="text-xs">{symbol}</span>
                              <span className="text-[8px] text-muted-foreground/40 font-mono">
                                ({r},{c})
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Educational Commentary */}
          <Card className="p-5 border-l-4 border-primary bg-primary/5 relative shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
              Step Explanation
            </h4>
            <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">
              {step.explanation}
            </p>
          </Card>

          {/* Variable Panel */}
          <VariablePanel
            variables={{
              "Current State (i, j)": step.i >= 0 ? `(${step.i}, ${step.j})` : 'Initial Check',
              "Next s3 character": step.i >= 0 && (step.i + step.j) < s3.length ? `'${s3[step.i + step.j]}' at index ${step.i + step.j}` : 'None',
              "Active Stack Depth": step.activeStack.length,
              "Memoization Size": Object.keys(step.memo).length,
              "Line Execution": step.lineExecution
            }}
          />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col">
          <Card className="flex-1 overflow-hidden border shadow-sm">
            <AnimatedCodeEditor
              code={code}
              language="TypeScript"
              highlightedLines={step.highlightedLines}
            />
          </Card>
        </div>
      }
    />
  );
};
