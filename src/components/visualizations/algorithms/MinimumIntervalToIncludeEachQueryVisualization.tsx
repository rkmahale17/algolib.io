import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';

interface IntervalState {
  l: number;
  r: number;
  size: number;
  status: 'pending' | 'in_heap' | 'expired' | 'min_selected';
}

interface HeapItem {
  size: number;
  right: number;
  intervalStr: string;
  id: string;
}

interface QueryItem {
  q: number;
  index: number;
  result: number;
  status: 'pending' | 'current' | 'done';
}

interface Step {
  intervals: IntervalState[];
  currentIntervalIdx: number;
  heap: HeapItem[];
  queries: QueryItem[];
  currentQueryIdx: number;
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, unknown>;
  lineExecution: string;
}

export const MinimumIntervalToIncludeEachQueryVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function minInterval(intervals: number[][], queries: number[]): number[] {
    intervals.sort((a, b) => a[0] - b[0]);

    const indexedQueries = queries.map((q, index) => ({ q, index }));
    indexedQueries.sort((a, b) => a.q - b.q);

    const result: number[] = new Array(queries.length).fill(-1);
    const heap: [number, number][] = [];

    const push = (val: [number, number]) => {
        heap.push(val);
        let idx = heap.length - 1;

        while (idx > 0) {
            const parentIdx = Math.floor((idx - 1) / 2);

            if (heap[parentIdx][0] < heap[idx][0] ||
                (heap[parentIdx][0] === heap[idx][0] &&
                    heap[parentIdx][1] <= heap[idx][1])) {
                break;
            }

            [heap[parentIdx], heap[idx]] = [heap[idx], heap[parentIdx]];
            idx = parentIdx;
        }
    };

    const pop = (): [number, number] | undefined => {
        if (heap.length === 0) return undefined;
        if (heap.length === 1) return heap.pop();

        const top = heap[0];
        heap[0] = heap.pop()!;

        let idx = 0;

        while (true) {
            let smallest = idx;
            const left = idx * 2 + 1;
            const right = idx * 2 + 2;

            if (
                left < heap.length &&
                (heap[left][0] < heap[smallest][0] ||
                    (heap[left][0] === heap[smallest][0] &&
                        heap[left][1] < heap[smallest][1]))
            ) {
                smallest = left;
            }

            if (
                right < heap.length &&
                (heap[right][0] < heap[smallest][0] ||
                    (heap[right][0] === heap[smallest][0] &&
                        heap[right][1] < heap[smallest][1]))
            ) {
                smallest = right;
            }

            if (smallest === idx) break;

            [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
            idx = smallest;
        }

        return top;
    };

    const peek = (): [number, number] | undefined => heap.length > 0 ? heap[0] : undefined;

    let intervalIdx = 0;

    for (const { q, index } of indexedQueries) {
        while (intervalIdx < intervals.length && intervals[intervalIdx][0] <= q) {
            const [l, r] = intervals[intervalIdx];
            push([r - l + 1, r]);
            intervalIdx++;
        }

        while (heap.length && peek()![1] < q) {
            pop();
        }

        if (heap.length) {
            result[index] = peek()![0];
        } else {
            result[index] = -1;
        }
    }

    return result;
}`;

  const steps: Step[] = useMemo(() => {
    const origIntervals: [number, number][] = [[1, 4], [2, 4], [3, 6], [4, 4]];
    const origQueries = [2, 3, 4, 5];
    
    const stepsList: Step[] = [];
    
    // 1. Initial State
    stepsList.push({
      intervals: origIntervals.map(inv => ({ l: inv[0], r: inv[1], size: inv[1] - inv[0] + 1, status: 'pending' })),
      currentIntervalIdx: 0,
      heap: [],
      queries: origQueries.map((q, idx) => ({ q, index: idx, result: -1, status: 'pending' })),
      currentQueryIdx: -1,
      explanation: "Start the function. We are given the input intervals and queries.",
      highlightedLines: [1],
      variables: { intervals: JSON.stringify(origIntervals), queries: JSON.stringify(origQueries) },
      lineExecution: "function minInterval(intervals, queries)"
    });

    // 2. Sort intervals
    const sortedIntervals = [...origIntervals].sort((a, b) => a[0] - b[0]);
    stepsList.push({
      intervals: sortedIntervals.map(inv => ({ l: inv[0], r: inv[1], size: inv[1] - inv[0] + 1, status: 'pending' })),
      currentIntervalIdx: 0,
      heap: [],
      queries: origQueries.map((q, idx) => ({ q, index: idx, result: -1, status: 'pending' })),
      currentQueryIdx: -1,
      explanation: "Sort the intervals in ascending order by their starting points (left endpoints). This enables us to process them sequentially from left to right.",
      highlightedLines: [2],
      variables: { intervals: JSON.stringify(sortedIntervals) },
      lineExecution: "intervals.sort((a, b) => a[0] - b[0]);"
    });

    // 3. Map queries and sort them
    const indexedQueries = origQueries.map((q, index) => ({ q, index }));
    indexedQueries.sort((a, b) => a.q - b.q);
    stepsList.push({
      intervals: sortedIntervals.map(inv => ({ l: inv[0], r: inv[1], size: inv[1] - inv[0] + 1, status: 'pending' })),
      currentIntervalIdx: 0,
      heap: [],
      queries: indexedQueries.map((iq) => ({ q: iq.q, index: iq.index, result: -1, status: 'pending' })),
      currentQueryIdx: -1,
      explanation: "Map the queries with their original indices and sort them in ascending order. Sorting queries lets us process them swept left-to-right, reusing intervals in the heap.",
      highlightedLines: [4, 5],
      variables: { indexedQueries: JSON.stringify(indexedQueries) },
      lineExecution: "const indexedQueries = queries.map(...).sort(...);"
    });

    // 4. Initialize result and heap
    const result: number[] = new Array(origQueries.length).fill(-1);
    const heap: [number, number][] = [];
    
    stepsList.push({
      intervals: sortedIntervals.map(inv => ({ l: inv[0], r: inv[1], size: inv[1] - inv[0] + 1, status: 'pending' })),
      currentIntervalIdx: 0,
      heap: [],
      queries: indexedQueries.map((iq) => ({ q: iq.q, index: iq.index, result: result[iq.index], status: 'pending' })),
      currentQueryIdx: -1,
      explanation: "Initialize the results array with -1 and an empty min-heap.",
      highlightedLines: [7, 8],
      variables: { result: JSON.stringify(result), heap: "[]" },
      lineExecution: "const result: number[] = ...; const heap: ... = [];"
    });

    const pushSim = (val: [number, number]) => {
      heap.push(val);
      heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    };

    const popSim = () => {
      heap.shift();
    };

    const peekSim = (): [number, number] | undefined => heap.length > 0 ? heap[0] : undefined;

    let intervalIdx = 0;
    const expiredIntervalIndices = new Set<number>();

    const getIntervalStates = (currentMinSelected?: [number, number]): IntervalState[] => {
      return sortedIntervals.map((inv, idx) => {
        const size = inv[1] - inv[0] + 1;
        let status: 'pending' | 'in_heap' | 'expired' | 'min_selected' = 'pending';
        
        if (expiredIntervalIndices.has(idx)) {
          status = 'expired';
        } else if (currentMinSelected && inv[0] === currentMinSelected[1] - currentMinSelected[0] + 1 && inv[1] === currentMinSelected[1]) {
          status = 'min_selected';
        } else {
          const inHeap = heap.some(item => {
            const itemL = item[1] - item[0] + 1;
            const itemR = item[1];
            return inv[0] === itemL && inv[1] === itemR;
          });
          if (inHeap) {
            status = 'in_heap';
          } else if (idx < intervalIdx) {
            status = 'expired';
          }
        }
        return { l: inv[0], r: inv[1], size, status };
      });
    };

    const getHeapState = (): HeapItem[] => {
      return heap.map((item, idx) => ({
        size: item[0],
        right: item[1],
        intervalStr: `[${item[1] - item[0] + 1}, ${item[1]}]`,
        id: `${item[0]}-${item[1]}-${idx}`
      }));
    };

    const getQueriesState = (currentIdx: number, doneIdxs: Set<number>): QueryItem[] => {
      return indexedQueries.map((iq, idx) => {
        let status: 'pending' | 'current' | 'done' = 'pending';
        if (idx === currentIdx) {
          status = 'current';
        } else if (doneIdxs.has(idx)) {
          status = 'done';
        }
        return { q: iq.q, index: iq.index, result: result[iq.index], status };
      });
    };

    const doneQueries = new Set<number>();

    for (let qIdx = 0; qIdx < indexedQueries.length; qIdx++) {
      const { q, index } = indexedQueries[qIdx];
      
      stepsList.push({
        intervals: getIntervalStates(),
        currentIntervalIdx: intervalIdx,
        heap: getHeapState(),
        queries: getQueriesState(qIdx, doneQueries),
        currentQueryIdx: qIdx,
        explanation: `Process query q = ${q} (originally at index ${index}).`,
        highlightedLines: [73],
        variables: { q, index, intervalIdx, heap: JSON.stringify(heap), result: JSON.stringify(result) },
        lineExecution: `for (const { q: ${q}, index: ${index} } of indexedQueries)`
      });

      stepsList.push({
        intervals: getIntervalStates(),
        currentIntervalIdx: intervalIdx,
        heap: getHeapState(),
        queries: getQueriesState(qIdx, doneQueries),
        currentQueryIdx: qIdx,
        explanation: `Check if we can add intervals: Is intervalIdx (${intervalIdx}) < ${sortedIntervals.length} AND intervals[${intervalIdx}].left <= q (${q})?`,
        highlightedLines: [74],
        variables: { 
          intervalIdx, 
          'intervals.length': sortedIntervals.length, 
          'current_interval_left': intervalIdx < sortedIntervals.length ? sortedIntervals[intervalIdx][0] : null, 
          q 
        },
        lineExecution: `while (intervalIdx < intervals.length && intervals[intervalIdx][0] <= q)`
      });

      while (intervalIdx < sortedIntervals.length && sortedIntervals[intervalIdx][0] <= q) {
        const [l, r] = sortedIntervals[intervalIdx];
        const size = r - l + 1;
        
        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Interval [${l}, ${r}] starts at ${l} <= q (${q}). Push size ${size} and right boundary ${r} to the min-heap.`,
          highlightedLines: [75, 76],
          variables: { l, r, 'size (r - l + 1)': size },
          lineExecution: `const [l, r] = [${l}, ${r}]; push([${size}, ${r}]);`
        });

        pushSim([size, r]);
        intervalIdx++;

        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Increment intervalIdx to ${intervalIdx} and update heap elements.`,
          highlightedLines: [77],
          variables: { intervalIdx, heap: JSON.stringify(heap) },
          lineExecution: `intervalIdx++;`
        });

        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Check if we can add more intervals: Is intervalIdx (${intervalIdx}) < ${sortedIntervals.length} AND intervals[${intervalIdx}].left <= q (${q})?`,
          highlightedLines: [74],
          variables: { 
            intervalIdx, 
            'intervals.length': sortedIntervals.length, 
            'current_interval_left': intervalIdx < sortedIntervals.length ? sortedIntervals[intervalIdx][0] : null, 
            q 
          },
          lineExecution: `while (intervalIdx < intervals.length && intervals[intervalIdx][0] <= q)`
        });
      }

      stepsList.push({
        intervals: getIntervalStates(),
        currentIntervalIdx: intervalIdx,
        heap: getHeapState(),
        queries: getQueriesState(qIdx, doneQueries),
        currentQueryIdx: qIdx,
        explanation: `Check for expired intervals in heap: Is heap not empty AND does the smallest interval's right end (${peekSim() ? peekSim()![1] : 'N/A'}) < q (${q})?`,
        highlightedLines: [80],
        variables: { 
          'heap.length': heap.length, 
          'heap_top_right': peekSim() ? peekSim()![1] : null, 
          q 
        },
        lineExecution: `while (heap.length && peek()![1] < q)`
      });

      while (heap.length && peekSim()![1] < q) {
        const expired = peekSim()!;
        const expiredL = expired[1] - expired[0] + 1;
        const expiredR = expired[1];
        
        const expIdx = sortedIntervals.findIndex(inv => inv[0] === expiredL && inv[1] === expiredR);
        if (expIdx !== -1) {
          expiredIntervalIndices.add(expIdx);
        }

        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Interval [${expiredL}, ${expiredR}] expires since its right end ${expiredR} is less than current query q (${q}). Pop it.`,
          highlightedLines: [81],
          variables: { popped: `[${expiredL}, ${expiredR}]`, heap: JSON.stringify(heap) },
          lineExecution: `pop();`
        });

        popSim();

        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Check for expired intervals again: Is heap not empty AND does top interval's right end (${peekSim() ? peekSim()![1] : 'N/A'}) < q (${q})?`,
          highlightedLines: [80],
          variables: { 
            'heap.length': heap.length, 
            'heap_top_right': peekSim() ? peekSim()![1] : null, 
            q 
          },
          lineExecution: `while (heap.length && peek()![1] < q)`
        });
      }

      stepsList.push({
        intervals: getIntervalStates(),
        currentIntervalIdx: intervalIdx,
        heap: getHeapState(),
        queries: getQueriesState(qIdx, doneQueries),
        currentQueryIdx: qIdx,
        explanation: `Check if heap is not empty to answer query: heap.length is ${heap.length}`,
        highlightedLines: [84],
        variables: { 'heap.length': heap.length },
        lineExecution: `if (heap.length)`
      });

      if (heap.length) {
        const best = peekSim()!;
        const bestL = best[1] - best[0] + 1;
        const bestR = best[1];
        result[index] = best[0];

        stepsList.push({
          intervals: getIntervalStates(best),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `Smallest interval covering q = ${q} is [${bestL}, ${bestR}] of size ${best[0]}. Store size ${best[0]} in result array at index ${index}.`,
          highlightedLines: [85],
          variables: { result: JSON.stringify(result), selected: `[${bestL}, ${bestR}]`, size: best[0] },
          lineExecution: `result[index] = peek()![0];`
        });
      } else {
        result[index] = -1;
        stepsList.push({
          intervals: getIntervalStates(),
          currentIntervalIdx: intervalIdx,
          heap: getHeapState(),
          queries: getQueriesState(qIdx, doneQueries),
          currentQueryIdx: qIdx,
          explanation: `No interval in the heap covers query q = ${q}. Store -1 in result array at index ${index}.`,
          highlightedLines: [87],
          variables: { result: JSON.stringify(result) },
          lineExecution: `result[index] = -1;`
        });
      }

      doneQueries.add(qIdx);
    }

    // Return result step
    stepsList.push({
      intervals: sortedIntervals.map((inv, idx) => ({ 
        l: inv[0], 
        r: inv[1], 
        size: inv[1] - inv[0] + 1, 
        status: expiredIntervalIndices.has(idx) ? 'expired' : 'pending' 
      })),
      currentIntervalIdx: intervalIdx,
      heap: getHeapState(),
      queries: indexedQueries.map((iq) => ({ q: iq.q, index: iq.index, result: result[iq.index], status: 'done' })),
      currentQueryIdx: -1,
      explanation: `All queries processed! Return the final results array: [${result.join(', ')}].`,
      highlightedLines: [91],
      variables: { result: JSON.stringify(result) },
      lineExecution: `return result;`
    });

    return stepsList;
  }, []);

  const step = steps[currentStep];
  const sortedQueries = useMemo(() => {
    return [2, 3, 4, 5].map((q, idx) => ({ q, originalIndex: idx })).sort((a, b) => a.q - b.q);
  }, []);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Timeline Sweeper */}
          <Card className="p-6 relative overflow-hidden bg-card border border-border">
            <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">
              Timeline sweep & Intervals
            </h3>
            
            <div className="flex gap-4">
              {/* Left Label column */}
              <div className="flex flex-col gap-3 pt-8 w-8 text-xs font-bold text-muted-foreground select-none">
                {step.intervals.map((_, idx) => (
                  <div key={idx} className="h-8 flex items-center justify-end">I{idx}</div>
                ))}
              </div>

              {/* Right tracks container */}
              <div className="flex-1 relative">
                {/* Timeline ruler */}
                <div className="relative h-6 mb-2">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted-foreground/20 -translate-y-1/2" />
                  {Array.from({ length: 8 }).map((_, val) => {
                    const leftPct = (val / 7) * 100;
                    return (
                      <div key={val} className="absolute -translate-x-1/2 flex flex-col items-center top-0" style={{ left: `${leftPct}%` }}>
                        <div className="w-1 h-1.5 bg-muted-foreground/40 rounded-full" />
                        <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{val}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Tracks */}
                <div className="space-y-3 relative">
                  {step.intervals.map((inv, idx) => {
                    const leftPct = (inv.l / 7) * 100;
                    const widthPct = ((inv.r - inv.l) / 7) * 100;

                    let colorClass = '';
                    if (inv.status === 'min_selected') {
                      colorClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-extrabold';
                    } else if (inv.status === 'in_heap') {
                      colorClass = 'bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400';
                    } else if (inv.status === 'expired') {
                      colorClass = 'bg-muted/30 border-muted/50 text-muted-foreground/30 line-through';
                    } else {
                      colorClass = 'bg-card border-dashed border-muted-foreground/20 text-muted-foreground/60';
                    }

                    return (
                      <div key={idx} className="h-8 relative">
                        <div
                          className={`absolute h-8 rounded-lg border-2 flex items-center justify-between px-3 text-xs font-semibold shadow-sm transition-all duration-200 ${colorClass}`}
                          style={{
                            left: `${leftPct}%`,
                            width: `${Math.max(widthPct, 12)}%`
                          }}
                        >
                          <span>{inv.l}</span>
                          <span className="text-[9px] font-normal uppercase opacity-80">Size: {inv.size}</span>
                          <span>{inv.r}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sweeper line */}
                {step.currentQueryIdx !== -1 && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 pointer-events-none transition-all duration-200"
                    style={{
                      left: `${(sortedQueries[step.currentQueryIdx].q / 7) * 100}%`
                    }}
                  >
                    <div className="absolute bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow -translate-x-1/2 -top-5 whitespace-nowrap z-20">
                      q = {sortedQueries[step.currentQueryIdx].q}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Min-Heap Priority Queue */}
          <Card className="p-4 bg-card border border-border">
            <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center justify-between">
              <span>Min-Heap (Priority Queue)</span>
              <span className="text-xs font-normal text-muted-foreground">Sorted primarily by interval size</span>
            </h3>
            <div className="flex flex-wrap gap-3 p-3 bg-muted/20 border border-border rounded-lg min-h-[70px] items-center">
              {step.heap.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border-2 shadow-sm transition-all duration-200 ${
                    idx === 0 
                      ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="text-xs font-bold text-foreground">{item.intervalStr}</div>
                  <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">Size: {item.size}</div>
                  {idx === 0 && (
                    <span className="text-[8px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      Top (Min)
                    </span>
                  )}
                </div>
              ))}
              {step.heap.length === 0 && (
                <div className="text-sm text-muted-foreground w-full text-center py-2">
                  Heap is empty
                </div>
              )}
            </div>
          </Card>

          {/* Queries Output Tracker */}
          <Card className="p-4 bg-card border border-border">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Queries & Output</h3>
            <div className="grid grid-cols-4 gap-3">
              {step.queries.map((qItem, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col items-center transition-all duration-200 ${
                    qItem.status === 'current'
                      ? 'bg-primary/10 border-primary shadow-sm scale-105'
                      : qItem.status === 'done'
                      ? 'bg-muted/40 border-border/80'
                      : 'bg-card border-border'
                  }`}
                >
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Query {qItem.index}</span>
                  <span className="text-lg font-black text-foreground mt-1">q = {qItem.q}</span>
                  <div className="w-full border-t border-border/60 my-2" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Output</span>
                  <span className={`text-md font-extrabold mt-0.5 ${
                    qItem.result !== -1 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : qItem.result === -1 && qItem.status === 'done' 
                      ? 'text-rose-500' 
                      : 'text-muted-foreground/50'
                  }`}>
                    {qItem.result === -1 && qItem.status !== 'done' ? '?' : qItem.result}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Guide (Descriptive Commentary Box) at bottom */}
          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Interactive Guide
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          {/* Variables Panel below commentary */}
          <VariablePanel variables={step.variables} />
        </div>
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
