import { useState, useEffect, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  maxHeap: number[];
  queue: [number, number][];
  time: number;
  explanation: string;
  variables: Record<string, any>;
  timeline: string[];
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function leastInterval(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const task of tasks) {
    count.set(task, (count.get(task) || 0) + 1);
  }
  const maxHeap: number[] = [];
  for (const freq of count.values()) {
    maxHeap.push(freq);
  }
  maxHeap.sort((a, b) => b - a);
  let time = 0;
  const queue: [number, number][] = [];
  while (maxHeap.length > 0 || queue.length > 0) {
    time++;
    if (maxHeap.length > 0) {
      const cnt = maxHeap.shift()! - 1;
      if (cnt > 0) {
        queue.push([cnt, time + n]);
      }
    }
    if (queue.length > 0 && queue[0][1] === time) {
      const [cnt] = queue.shift()!;
      maxHeap.push(cnt);
      maxHeap.sort((a, b) => b - a);
    }
  }
  return time;
}`,
  python: `def leastInterval(tasks: list[str], n: int) -> int:
    counts = {}
    for task in tasks:
        counts[task] = counts.get(task, 0) + 1
    maxHeap = [-count for count in counts.values()]
    import heapq
    heapq.heapify(maxHeap)
    time = 0
    queue = []
    while maxHeap or queue:
        time += 1
        if maxHeap:
            count = heapq.heappop(maxHeap) + 1
            if count < 0:
                heapq.heappush(queue, (time + n, count))
        if queue and queue[0][0] == time:
            available_time, count = heapq.heappop(queue)
            heapq.heappush(maxHeap, count)
        queue = [item for item in queue if item[0] > time]
        heapq.heapify(queue)
    return time`,
  java: `public static class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] count = new int[26];
        for (char task : tasks) {
            count[task - 'A']++;
        }
        java.util.Arrays.sort(count);
        int maxVal = count[25] - 1;
        int idleSlots = maxVal * n;
        for (int i = 24; i >= 0 && count[i] > 0; i--) {
            idleSlots -= Math.min(count[i], maxVal);
        }
        return idleSlots > 0 ? idleSlots + tasks.length : tasks.length;
    }
}`,
  cpp: `class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        unordered_map<char, int> counts;
        for (char task : tasks) {
            counts[task]++;
        }
        priority_queue<int> pq;
        for (auto const& [key, val] : counts) {
            pq.push(val);
        }
        int time = 0;
        queue<pair<int, int>> q;
        while (!pq.empty() || !q.empty()) {
            time++;
            if (!pq.empty()) {
                int count = pq.top();
                pq.pop();
                count--;
                if (count > 0) {
                    q.push({count, time + n});
                }
            }
            if (!q.empty() && q.front().second == time) {
                pq.push(q.front().first);
                q.pop();
            }
        }
        return time;
    }
};`
};

export const TaskSchedulerVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const tasks = useMemo(() => ["A", "A", "A", "B", "B", "B"], []);
  const nParam = 2;

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let time = 0;
    let maxHeap: number[] = [];
    let queue: [number, number][] = [];
    let timeline: string[] = [];

    const addStep = (
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, java: number, cpp: number
    ) => {
      s.push({
        maxHeap: [...maxHeap],
        queue: [...queue],
        time,
        explanation,
        pseudoStep: pseudo,
        variables: vars,
        timeline: [...timeline]
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      "Initialize Map to count frequencies of each task.",
      "leastInterval(tasks, n=2)",
      { tasks: '["A","A","A","B","B","B"]', n: nParam },
      2, 2, 3, 4
    );

    const count = new Map<string, number>();
    for (const task of tasks) {
      count.set(task, (count.get(task) || 0) + 1);
    }

    addStep(
      "Count frequencies of each task: A -> 3, B -> 3.",
      "counts = countsOf(tasks)  →  {A: 3, B: 3}",
      { count: 'Map { A: 3, B: 3 }' },
      3, 3, 5, 5
    );

    for (const freq of count.values()) {
      maxHeap.push(freq);
    }
    maxHeap.sort((a, b) => b - a);

    addStep(
      "Add all frequencies to a maxHeap and sort it descending.",
      "SET maxHeap = sortDescending(counts.values)",
      { maxHeap: '[' + maxHeap.join(', ') + ']' },
      8, 5, 9, 10
    );

    addStep(
      "Initialize time = 0 and a queue to hold tasks in cooldown.",
      "SET time = 0, queue = []",
      { time, queue: '[]' },
      11, 8, 13, 12
    );

    while (maxHeap.length > 0 || queue.length > 0) {
      addStep(
        "Check condition: MaxHeap or Queue is not empty. Continue scheduling.",
        `WHILE maxHeap NOT EMPTY OR queue NOT EMPTY  →  ${maxHeap.length} > 0 OR ${queue.length} > 0`,
        { time },
        13, 10, 13, 14
      );

      time++;

      addStep(
        "Increment time to " + time + ".",
        `SET time = time + 1  →  ${time}`,
        { time },
        14, 11, 13, 15
      );

      if (maxHeap.length > 0) {
        const cnt = maxHeap.shift()! - 1;
        timeline.push("T");
        addStep(
          "Process the most frequent task. Decrement its count to " + cnt + ".",
          `SET cnt = maxHeap.shift() - 1  →  ${cnt}`,
          { time, cnt },
          16, 13, 13, 19
        );

        if (cnt > 0) {
          queue.push([cnt, time + nParam]);
          addStep(
            "Task still needs to run " + cnt + " more times. Push to queue with available time " + (time + nParam) + ".",
            `queue.push([cnt=${cnt}, readyTime=${time + nParam}])`,
            { time, queueItem: '[' + cnt + ', ' + (time + nParam) + ']' },
            18, 15, 13, 21
          );
        }
      } else {
        timeline.push("idle");
        addStep(
          "MaxHeap is empty. No task can run, so we idle.",
          "IDLE (no tasks available)",
          { time },
          15, 12, 13, 16
        );
      }

      if (queue.length > 0 && queue[0][1] === time) {
        const [cnt] = queue.shift()!;
        maxHeap.push(cnt);
        maxHeap.sort((a, b) => b - a);
        
        addStep(
          "A task in cooldown has reached its available time (" + time + "). Return it to the maxHeap.",
          `SET [cnt] = queue.shift()  →  maxHeap.push(${cnt})`,
          { time, cntRestored: cnt },
          22, 17, 13, 25
        );
      } else {
        addStep(
          "No task in the queue is ready to be returned to the heap at time " + time + ".",
          "IF queue[0].readyTime == time (NO)",
          { time },
          21, 16, 13, 24
        );
      }
    }
    
    addStep(
      "MaxHeap and Queue are empty. Return total time: " + time + ".",
      `RETURN time  →  ${time}`,
      { time },
      27, 21, 18, 29
    );

    return { steps: s, stepLineNumbers: lines };
  }, [tasks]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Max Heap (Frequencies)</h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  <AnimatePresence mode="popLayout">
                    {step.maxHeap.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground text-xs italic py-2">
                        Empty
                      </motion.div>
                    )}
                    {step.maxHeap.map((freq, idx) => (
                      <motion.div
                        key={'heap-' + idx + '-' + currentStep}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-10 h-10 rounded-lg bg-primary/20 border border-primary text-primary flex items-center justify-center font-bold"
                      >
                        {freq}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cooldown Queue</h3>
                <div className="flex flex-wrap gap-2 min-h-[60px]">
                  <AnimatePresence mode="popLayout">
                    {step.queue.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted-foreground text-xs italic py-2">
                        Empty
                      </motion.div>
                    )}
                    {step.queue.map(([freq, availTime], idx) => (
                      <motion.div
                        key={'queue-' + idx + '-' + currentStep}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="h-10 px-3 rounded-lg bg-accent/20 border border-accent text-foreground flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-bold">{freq}</span>
                        <span className="text-[10px] uppercase opacity-70">t={availTime}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Timeline (Current Time: {step.time})</h3>
              <div className="flex flex-wrap gap-1">
                {step.timeline.map((event, idx) => (
                  <div 
                    key={idx}
                    className={'w-8 h-8 rounded flex items-center justify-center text-xs font-bold ' + (event === 'idle' ? 'bg-muted text-muted-foreground' : 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30')}
                  >
                    {event === 'idle' ? 'I' : 'T'}
                  </div>
                ))}
                {step.time === 0 && (
                  <div className="text-muted-foreground text-xs italic py-2">Not started</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
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
export default TaskSchedulerVisualization;
