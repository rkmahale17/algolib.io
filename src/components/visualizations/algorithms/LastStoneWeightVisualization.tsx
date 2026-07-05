import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  maxHeap: number[];
  first: number | null;
  second: number | null;
  resultStone: number | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'check' | 'sort' | 'extract_first' | 'extract_second' | 'compare' | 'push_diff' | 'done';
}

const languages: VisualizationLanguageMap = {
  typescript: `function lastStoneWeight(stones: number[]): number {
  const maxHeap: number[] = [...stones].sort((a, b) => b - a);
  while (maxHeap.length > 1) {
    maxHeap.sort((a, b) => b - a);
    const first = maxHeap.shift()!;
    const second = maxHeap.shift()!;
    if (first !== second) {
      maxHeap.push(first - second);
    }
  }
  return maxHeap.length === 0 ? 0 : maxHeap[0];
}`,
  python: `import heapq

def lastStoneWeight(stones):
    stones = [-stone for stone in stones]
    heapq.heapify(stones)
    while len(stones) > 1:
        first = -heapq.heappop(stones)
        second = -heapq.heappop(stones)
        if first != second:
            heapq.heappush(stones, -(first - second))
    return -stones[0] if stones else 0`,
  java: `public static class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
        for (int stone : stones) {
            maxHeap.offer(stone);
        }
        while (maxHeap.size() > 1) {
            int first = maxHeap.poll();
            int second = maxHeap.poll();
            if (first != second) {
                maxHeap.offer(first - second);
            }
        }
        return maxHeap.isEmpty() ? 0 : maxHeap.poll();
    }
}`,
  cpp: `class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        priority_queue<int> maxHeap;
        for (int stone : stones) {
            maxHeap.push(stone);
        }
        while (maxHeap.size() > 1) {
            int first = maxHeap.top();
            maxHeap.pop();
            int second = maxHeap.top();
            maxHeap.pop();
            if (first != second) {
                maxHeap.push(first - second);
            }
        }
        return maxHeap.empty() ? 0 : maxHeap.top();
    }
};`
};

export const LastStoneWeightVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const initialStones = [2, 7, 4, 1, 8, 1];

  const { steps, stepLineNumbers } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let heap = [...initialStones];

    const addStep = (
      maxHeap: number[],
      first: number | null,
      second: number | null,
      resultStone: number | null,
      explanation: string,
      pseudo: string,
      vars: any,
      phase: Step['phase'],
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        maxHeap,
        first,
        second,
        resultStone,
        explanation,
        pseudoStep: pseudo,
        variables: vars,
        phase
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      [...heap], null, null, null,
      `Receive array of stones: [${heap.join(', ')}].`,
      "lastStoneWeight(stones)",
      { stones: `[${initialStones.join(', ')}]` },
      'init',
      1, 3, 2, 3
    );

    heap.sort((a, b) => b - a);
    addStep(
      [...heap], null, null, null,
      `Initialize the maxHeap with the stones sorted in descending order: [${heap.join(', ')}].`,
      "SET maxHeap = maxHeapOf(stones)",
      { stones: `[${initialStones.join(', ')}]`, maxHeap: `[${heap.join(', ')}]` },
      'sort',
      2, 4, 3, 4
    );

    while (heap.length > 1) {
      addStep(
        [...heap], null, null, null,
        `Check loop condition: heap size is ${heap.length} (> 1). Continue smashing.`,
        `WHILE maxHeap.size > 1  →  ${heap.length} > 1 (YES)`,
        { maxHeap: `[${heap.join(', ')}]`, 'maxHeap.length': heap.length },
        'check',
        3, 6, 7, 8
      );

      heap.sort((a, b) => b - a);
      addStep(
        [...heap], null, null, null,
        `Sort the heap descending to ensure heaviest stones are at the beginning: [${heap.join(', ')}].`,
        "CALL maxHeap.sortDescending()",
        { maxHeap: `[${heap.join(', ')}]` },
        'sort',
        4, 6, 7, 8
      );

      const first = heap.shift()!;
      addStep(
        [...heap], first, null, null,
        `Extract the heaviest stone: first = ${first}. Remaining heap: [${heap.join(', ')}].`,
        `SET first = maxHeap.poll() → ${first}`,
        { maxHeap: `[${heap.join(', ')}]`, first },
        'extract_first',
        5, 7, 8, 9
      );

      const second = heap.shift()!;
      addStep(
        [...heap], first, second, null,
        `Extract the second heaviest stone: second = ${second}. Remaining heap: [${heap.join(', ')}].`,
        `SET second = maxHeap.poll() → ${second}`,
        { maxHeap: `[${heap.join(', ')}]`, first, second },
        'extract_second',
        6, 8, 9, 11
      );

      addStep(
        [...heap], first, second, null,
        `Compare weights: first (${first}) and second (${second}). Are they different?`,
        `IF first != second  →  ${first} != ${second} (YES)`,
        { first, second, 'first !== second': first !== second },
        'compare',
        7, 9, 10, 13
      );

      if (first !== second) {
        const diff = first - second;
        heap.push(diff);
        addStep(
          [...heap], first, second, diff,
          `Since ${first} !== ${second}, a new stone of weight first - second = ${diff} is added back to the heap.`,
          `CALL maxHeap.offer(${first} - ${second}) → ${diff}`,
          { maxHeap: `[${heap.join(', ')}]`, first, second, added: diff },
          'push_diff',
          8, 10, 11, 14
        );
      } else {
        addStep(
          [...heap], first, second, 0,
          `Since both stones have the same weight (${first}), they completely destroy each other. No new stone is added.`,
          "NO ACTION (both destroyed)",
          { maxHeap: `[${heap.join(', ')}]`, first, second },
          'push_diff',
          7, 9, 10, 13
        );
      }
    }

    addStep(
      [...heap], null, null, null,
      `Check loop condition: heap size is ${heap.length} (not > 1). Exit the loop.`,
      `WHILE maxHeap.size > 1  →  ${heap.length} > 1 (NO)`,
      { maxHeap: `[${heap.join(', ')}]`, 'maxHeap.length': heap.length },
      'check',
      3, 6, 7, 8
    );

    const result = heap.length === 0 ? 0 : heap[0];
    addStep(
      [...heap], null, null, null,
      `Game over. Return weight of last remaining stone: ${result}.`,
      `RETURN lastStone → ${result}`,
      { maxHeap: `[${heap.join(', ')}]`, result },
      'done',
      11, 11, 14, 17
    );

    return { steps: generatedSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
              Stone Smashing Game Arena
            </h3>

            <div className="mb-8">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-4">
                Current Heap Status (Sorted Descending)
              </span>
              <div className="flex flex-wrap items-center gap-4 min-h-[80px] p-4 bg-muted/20 border-2 border-dashed border-border rounded-xl">
                <AnimatePresence mode="popLayout">
                  {step.maxHeap.map((weight, idx) => (
                    <motion.div
                      key={`stone-${idx}-${weight}`}
                      layout
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.3 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        style={{
                          width: `${32 + weight * 5}px`,
                          height: `${32 + weight * 5}px`,
                        }}
                        className="rounded-full bg-gradient-to-br from-slate-400 via-slate-500 to-slate-700 dark:from-slate-600 dark:via-zinc-700 dark:to-zinc-950 border-2 border-slate-300 dark:border-zinc-800 shadow-md flex items-center justify-center relative select-none"
                      >
                        <span className="font-extrabold text-white text-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {weight}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {step.maxHeap.length === 0 && (
                  <span className="text-xs text-muted-foreground uppercase py-2">
                    No stones left
                  </span>
                )}
              </div>
            </div>

            <div className="relative p-6 bg-red-500/5 dark:bg-red-500/10 border-2 border-red-500/20 rounded-2xl overflow-hidden min-h-[220px] flex flex-col justify-between">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2.5 py-0.5 rounded">
                Smash Zone
              </div>

              <div className="flex justify-around items-center h-full my-auto py-4">
                <div className="flex flex-col items-center gap-2 w-1/3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Heaviest</span>
                  <div className="h-20 flex items-center justify-center">
                    {step.first !== null ? (
                      <motion.div
                        layoutId="first-stone"
                        style={{
                          width: `${32 + step.first * 5}px`,
                          height: `${32 + step.first * 5}px`,
                        }}
                        className="rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-700 border-2 border-orange-300 shadow-lg shadow-orange-500/20 flex items-center justify-center relative select-none"
                      >
                        <span className="font-extrabold text-white text-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {step.first}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground/30 font-bold uppercase select-none">
                        ?
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {step.phase === 'compare' || step.phase === 'push_diff' ? (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-red-500 text-3xl font-extrabold select-none"
                    >
                      💥
                    </motion.div>
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground/30 select-none">VS</span>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 w-1/3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">2nd Heaviest</span>
                  <div className="h-20 flex items-center justify-center">
                    {step.second !== null ? (
                      <motion.div
                        layoutId="second-stone"
                        style={{
                          width: `${32 + step.second * 5}px`,
                          height: `${32 + step.second * 5}px`,
                        }}
                        className="rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-700 border-2 border-orange-300 shadow-lg shadow-orange-500/20 flex items-center justify-center relative select-none"
                      >
                        <span className="font-extrabold text-white text-md drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {step.second}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-xs text-muted-foreground/30 font-bold uppercase select-none">
                        ?
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {step.resultStone !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-red-400 uppercase">Smash Result:</span>
                  <div className="flex items-center gap-2">
                    {step.resultStone > 0 ? (
                      <>
                        <span className="text-xs text-muted-foreground">Stone survives with weight:</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-700 border border-slate-300 flex items-center justify-center font-bold text-white text-xs select-none">
                          {step.resultStone}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs font-black text-red-500 uppercase">Both stones destroyed!</span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Interactive Guide
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>
          <VariablePanel variables={step.variables} />
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
export default LastStoneWeightVisualization;
