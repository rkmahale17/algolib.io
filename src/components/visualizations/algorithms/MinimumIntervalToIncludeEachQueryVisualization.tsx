import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  variables: Record<string, unknown>;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function minInterval(intervals: number[][], queries: number[]): number[] {
  intervals.sort((a, b) => a[0] - b[0]);
  const indexedQueries = queries.map((q, index) => ({ q, index }));
  indexedQueries.sort((a, b) => a.q - b.q);
  const result: number[] = new Array(queries.length).fill(-1);
  const heap: [number, number][] = [];
  const push = (val: [number, number]) => {
    heap.push(val);
    heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  };
  const pop = (): [number, number] | undefined => heap.shift();
  const peek = (): [number, number] | undefined => heap[0];
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
    }
  }
  return result;
}`,
  python: `import heapq

def minInterval(intervals: list[list[int]], queries: list[int]) -> list[int]:
    intervals.sort()
    sorted_queries = sorted([(q, idx) for idx, q in enumerate(queries)])
    min_heap = []
    result = [-1] * len(queries)
    interval_idx = 0
    n_intervals = len(intervals)
    for q_val, original_idx in sorted_queries:
        while interval_idx < n_intervals and intervals[interval_idx][0] <= q_val:
            l, r = intervals[interval_idx]
            size = r - l + 1
            heapq.heappush(min_heap, (size, r))
            interval_idx += 1
        while min_heap and min_heap[0][1] < q_val:
            heapq.heappop(min_heap)
        if min_heap:
            result[original_idx] = min_heap[0][0]
    return result`,
  java: `public static class Solution {
    public int[] minInterval(int[][] intervals, int[] queries) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        int[][] sortedQueries = new int[queries.length][2];
        for (int i = 0; i < queries.length; i++) {
            sortedQueries[i][0] = queries[i];
            sortedQueries[i][1] = i;
        }
        Arrays.sort(sortedQueries, (a, b) -> Integer.compare(a[0], b[0]));
        int[] result = new int[queries.length];
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[0], b[0])
        );
        int intervalIdx = 0;
        for (int[] query : sortedQueries) {
            int currentQuery = query[0];
            int originalIndex = query[1];
            while (
                intervalIdx < intervals.length &&
                intervals[intervalIdx][0] <= currentQuery
            ) {
                int left = intervals[intervalIdx][0];
                int right = intervals[intervalIdx][1];
                int size = right - left + 1;
                minHeap.offer(new int[] { size, right });
                intervalIdx++;
            }
            while (
                !minHeap.isEmpty() &&
                minHeap.peek()[1] < currentQuery
            ) {
                minHeap.poll();
            }
            result[originalIndex] =
                minHeap.isEmpty() ? -1 : minHeap.peek()[0];
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {
        sort(intervals.begin(), intervals.end());
        vector<pair<int, int>> sortedQueries;
        for (int i = 0; i < queries.size(); ++i) {
            sortedQueries.push_back({queries[i], i});
        }
        sort(sortedQueries.begin(), sortedQueries.end());
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
        vector<int> result(queries.size(), -1);
        int intervalIdx = 0;
        for (const auto& q : sortedQueries) {
            int q_val = q.first;
            int original_idx = q.second;
            while (intervalIdx < intervals.size() && intervals[intervalIdx][0] <= q_val) {
                int l = intervals[intervalIdx][0];
                int r = intervals[intervalIdx][1];
                minHeap.push({r - l + 1, r});
                intervalIdx++;
            }
            while (!minHeap.empty() && minHeap.top().second < q_val) {
                minHeap.pop();
            }
            if (!minHeap.empty()) {
                result[original_idx] = minHeap.top().first;
            }
        }
        return result;
    }
};`
};

export const MinimumIntervalToIncludeEachQueryVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const origIntervals: [number, number][] = [[1, 4], [2, 4], [3, 6], [4, 4]];
    const origQueries = [2, 3, 4, 5];
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getVariables = (currentIndex: number, extra: Record<string, any> = {}) => {
      return {
        'intervals': JSON.stringify(origIntervals),
        'queries': JSON.stringify(origQueries),
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['intervals'][0]['status'] | 'init' | 'loop' | 'done',
      currentIntervalIdx: number,
      currentQueryIdx: number,
      heapList: HeapItem[],
      queriesList: QueryItem[],
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        intervals: sortedIntervals.map((inv, idx) => {
          const size = inv[1] - inv[0] + 1;
          let status: IntervalState['status'] = 'pending';
          if (expiredIntervalIndices.has(idx)) {
            status = 'expired';
          } else if (variablesExtra.selected && inv[0] === variablesExtra.selected[1] - variablesExtra.selected[0] + 1 && inv[1] === variablesExtra.selected[1]) {
            status = 'min_selected';
          } else {
            const inHeap = heap.some(item => {
              const itemL = item[1] - item[0] + 1;
              const itemR = item[1];
              return inv[0] === itemL && inv[1] === itemR;
            });
            if (inHeap) {
              status = 'in_heap';
            } else if (idx < currentIntervalIdx) {
              status = 'expired';
            }
          }
          return { l: inv[0], r: inv[1], size, status };
        }),
        currentIntervalIdx,
        heap: heapList,
        queries: queriesList,
        currentQueryIdx,
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(currentQueryIdx, variablesExtra)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    const sortedIntervals = [...origIntervals].sort((a, b) => a[0] - b[0]);
    const indexedQueries = origQueries.map((q, index) => ({ q, index }));
    indexedQueries.sort((a, b) => a.q - b.q);

    const result: number[] = new Array(origQueries.length).fill(-1);
    const heap: [number, number][] = [];
    let intervalIdx = 0;
    const expiredIntervalIndices = new Set<number>();
    const doneQueries = new Set<number>();

    const getHeapState = (): HeapItem[] => {
      return heap.map((item, idx) => ({
        size: item[0],
        right: item[1],
        intervalStr: `[${item[1] - item[0] + 1}, ${item[1]}]`,
        id: `${item[0]}-${item[1]}-${idx}`
      }));
    };

    const getQueriesState = (currentIdx: number): QueryItem[] => {
      return indexedQueries.map((iq, idx) => {
        let status: QueryItem['status'] = 'pending';
        if (idx === currentIdx) {
          status = 'current';
        } else if (doneQueries.has(idx)) {
          status = 'done';
        }
        return { q: iq.q, index: iq.index, result: result[iq.index], status };
      });
    };

    const pushSim = (val: [number, number]) => {
      heap.push(val);
      heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    };

    const popSim = () => {
      heap.shift();
    };

    const peekSim = (): [number, number] | undefined => heap.length > 0 ? heap[0] : undefined;

    pushStep(
      "Start the function. We are given the input intervals and queries.",
      "minInterval(intervals, queries)",
      'init', 0, -1, [], getQueriesState(-1),
      {},
      1, 3, 2, 3
    );

    pushStep(
      "Sort the intervals in ascending order by their starting points (left endpoints).",
      "intervals.sort()",
      'init', 0, -1, [], getQueriesState(-1),
      {},
      2, 4, 3, 4
    );

    pushStep(
      "Map the queries with their original indices and sort them in ascending order.",
      "sorted_queries = sorted(...)",
      'init', 0, -1, [], getQueriesState(-1),
      {},
      4, 5, 9, 9
    );

    pushStep(
      "Initialize results array with -1 and an empty min-heap.",
      "SET min_heap = [], result = [-1] * len(queries)",
      'init', 0, -1, [], getQueriesState(-1),
      {},
      6, 6, 11, 10
    );

    for (let qIdx = 0; qIdx < indexedQueries.length; qIdx++) {
      const { q, index } = indexedQueries[qIdx];
      
      pushStep(
        `Process query q = ${q} (originally at index ${index}).`,
        `// Processing query q = ${q}`,
        'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
        { q, index },
        14, 10, 15, 13
      );

      pushStep(
        `Check if we can add intervals: Is intervalIdx (${intervalIdx}) < ${sortedIntervals.length} AND intervals[${intervalIdx}].left <= q (${q})?`,
        `WHILE interval_idx < n_intervals AND intervals[interval_idx][0] <= q_val`,
        'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
        { q, index },
        15, 11, 18, 16
      );

      while (intervalIdx < sortedIntervals.length && sortedIntervals[intervalIdx][0] <= q) {
        const [l, r] = sortedIntervals[intervalIdx];
        const size = r - l + 1;
        
        pushStep(
          `Interval [${l}, ${r}] starts at ${l} <= q (${q}). Push size ${size} and right boundary ${r} to the min-heap.`,
          `heapq.heappush(min_heap, (size, r))`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          { l, r, 'size': size },
          17, 14, 25, 19
        );

        pushSim([size, r]);
        intervalIdx++;

        pushStep(
          `Increment intervalIdx to ${intervalIdx} and update heap elements.`,
          `interval_idx += 1  →  ${intervalIdx}`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          {},
          18, 15, 26, 20
        );

        pushStep(
          `Check if we can add more intervals: Is intervalIdx (${intervalIdx}) < ${sortedIntervals.length} AND intervals[${intervalIdx}].left <= q (${q})?`,
          `WHILE interval_idx < n_intervals AND intervals[interval_idx][0] <= q_val`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          {},
          15, 11, 18, 16
        );
      }

      pushStep(
        `Check for expired intervals in heap: Is heap not empty AND does top interval's right end (${peekSim() ? peekSim()![1] : 'N/A'}) < q (${q})?`,
        `WHILE min_heap AND min_heap[0][1] < q_val`,
        'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
        {},
        20, 16, 28, 22
      );

      while (heap.length && peekSim()![1] < q) {
        const expired = peekSim()!;
        const expiredL = expired[1] - expired[0] + 1;
        const expiredR = expired[1];
        
        const expIdx = sortedIntervals.findIndex(inv => inv[0] === expiredL && inv[1] === expiredR);
        if (expIdx !== -1) {
          expiredIntervalIndices.add(expIdx);
        }

        pushStep(
          `Interval [${expiredL}, ${expiredR}] expires since its right end ${expiredR} is less than current query q (${q}). Pop it.`,
          `heapq.heappop(min_heap)`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          { popped: `[${expiredL}, ${expiredR}]` },
          21, 17, 32, 23
        );

        popSim();

        pushStep(
          `Check for expired intervals again: Is heap not empty AND does top interval's right end (${peekSim() ? peekSim()![1] : 'N/A'}) < q (${q})?`,
          `WHILE min_heap AND min_heap[0][1] < q_val`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          {},
          20, 16, 28, 22
        );
      }

      pushStep(
        `Check if heap is not empty to answer query: heap.length is ${heap.length}`,
        `IF min_heap`,
        'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
        {},
        23, 18, 34, 25
      );

      if (heap.length) {
        const best = peekSim()!;
        const bestL = best[1] - best[0] + 1;
        const bestR = best[1];
        result[index] = best[0];

        pushStep(
          `Smallest interval covering q = ${q} is [${bestL}, ${bestR}] of size ${best[0]}. Store size ${best[0]} in result array.`,
          `result[original_idx] = min_heap[0][0]  →  ${best[0]}`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          { selected: best, size: best[0] },
          24, 19, 35, 26
        );
      } else {
        result[index] = -1;
        pushStep(
          `No interval in the heap covers query q = ${q}. Store -1 in result array.`,
          `// result[original_idx] = -1`,
          'loop', intervalIdx, qIdx, getHeapState(), getQueriesState(qIdx),
          {},
          23, 18, 34, 25
        );
      }

      doneQueries.add(qIdx);
    }

    pushStep(
      `All queries processed! Return the final results array: [${result.join(', ')}].`,
      `RETURN result  →  [${result.join(', ')}]`,
      'done', intervalIdx, -1, getHeapState(), getQueriesState(-1),
      { return: result },
      27, 20, 37, 29
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  const sortedQueries = useMemo(() => {
    return [2, 3, 4, 5].map((q, idx) => ({ q, originalIndex: idx })).sort((a, b) => a.q - b.q);
  }, []);

  return (
    <div className="space-y-6">
      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Timeline Sweeper */}
            <Card className="p-6 relative overflow-hidden bg-card border border-border">
              <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">
                Timeline sweep & Intervals
              </h3>
              
              <div className="flex gap-4">
                <div className="flex flex-col gap-3 pt-8 w-8 text-xs font-bold text-muted-foreground select-none">
                  {step.intervals.map((_, idx) => (
                    <div key={idx} className="h-8 flex items-center justify-end">I{idx}</div>
                  ))}
                </div>

                <div className="flex-1 relative">
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

            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" />
                Interactive Guide
              </h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
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
    </div>
  );
};
export default MinimumIntervalToIncludeEachQueryVisualization;
