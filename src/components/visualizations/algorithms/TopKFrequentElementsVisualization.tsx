import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Layers, Hash, ListOrdered } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  nums: number[];
  k: number;
  i: number | null;
  currentNum: number | null;
  count: Record<number, number>;
  freq: number[][];
  res: number[];
  message: string;
  pseudoStep: string;
  phase: 'counting' | 'bucketing' | 'collecting' | 'done';
}

const DEFAULT_NUMS = [1, 1, 1, 2, 2, 3];
const DEFAULT_K = 2;

const languages: VisualizationLanguageMap = {
  typescript: `function topKFrequent(nums: number[], k: number): number[] {
  const count: Map<number, number> = new Map();
  const freq: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const n of nums) {
    count.set(n, (count.get(n) || 0) + 1);
  }
  for (const [n, c] of count.entries()) {
    freq[c].push(n);
  }
  const res: number[] = [];
  for (let i = freq.length - 1; i > 0; i--) {
    for (const n of freq[i]) {
      res.push(n);
      if (res.length === k) {
        return res;
      }
    }
  }
  return res;
}`,
  python: `def topKFrequent(nums, k):
    count = defaultdict(int)
    for n in nums:
        count[n] += 1
    freq = [[] for _ in range(len(nums) + 1)]
    for n, c in count.items():
        freq[c].append(n)
    res = []
    for i in range(len(freq) - 1, 0, -1):
        for n in freq[i]:
            res.append(n)
            if len(res) == k:
                return res
    return res`,
  java: `public static class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }
        List<int[]> arr = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            arr.add(new int[]{entry.getValue(), entry.getKey()});
        }
        arr.sort((a, b) -> Integer.compare(b[0], a[0]));
        int[] res = new int[k];
        for (int i = 0; i < k; i++) {
            res[i] = arr.get(i)[1];
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) {
            count[num]++;
        }
        vector<vector<int>> freq(nums.size() + 1);
        for (auto& [num, c] : count) {
            freq[c].push_back(num);
        }
        vector<int> result;
        for (int i = freq.size() - 1; i >= 0 && result.size() < k; i--) {
            for (int num : freq[i]) {
                result.push_back(num);
                if (result.size() == k) return result;
            }
        }
        return result;
    }
};`
};

export const TopKFrequentElementsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const count: Record<number, number> = {};
    const freq: number[][] = Array.from({ length: DEFAULT_NUMS.length + 1 }, () => []);
    const res: number[] = [];

    function addStep(
      i: number | null,
      currentNum: number | null,
      msg: string,
      pseudo: string,
      phase: 'counting' | 'bucketing' | 'collecting' | 'done',
      ts: number, py: number, java: number, cpp: number
    ) {
      s.push({
        nums: DEFAULT_NUMS,
        k: DEFAULT_K,
        i,
        currentNum,
        count: { ...count },
        freq: freq.map(f => [...f]),
        res: [...res],
        message: msg,
        pseudoStep: pseudo,
        phase
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    }

    addStep(
      null, null, 
      "Initialize count map and frequency buckets array.",
      "SET count = {}, freq = []",
      'counting',
      2, 2, 3, 4
    );

    for (let i = 0; i < DEFAULT_NUMS.length; i++) {
      const n = DEFAULT_NUMS[i];
      count[n] = (count[n] || 0) + 1;
      addStep(
        i, n,
        `Counting frequency: found ${n}, current count is ${count[n]}.`,
        `SET count[${n}] = count[${n}] + 1 → ${count[n]}`,
        'counting',
        5, 4, 5, 6
      );
    }

    const countEntries = Object.entries(count);
    for (let i = 0; i < countEntries.length; i++) {
        const [n, c] = countEntries[i].map(Number);
        freq[c].push(n);
        addStep(
            i, n,
            `Placing ${n} into bucket for frequency ${c}.`,
            `CALL freq[${c}].push(${n})`,
            'bucketing',
            8, 7, 9, 10
        );
    }

    addStep(
        freq.length, null,
        "Start collecting top K elements from the highest frequency buckets.",
        "SET res = []",
        'collecting',
        10, 8, 12, 12
    );

    for (let i = freq.length - 1; i > 0; i--) {
        if (freq[i].length > 0) {
            addStep(
                i, null,
                `Checking bucket for frequency ${i}. Found elements: [${freq[i].join(', ')}].`,
                `FOR n IN freq[${i}]`,
                'collecting',
                12, 10, 13, 14
            );

            for (const n of freq[i]) {
                res.push(n);
                const isKReached = res.length === DEFAULT_K;
                addStep(
                    i, n,
                    `Adding ${n} to result. ${isKReached ? 'K elements reached!' : `Still need ${DEFAULT_K - res.length} more.`}`,
                    `CALL res.push(${n})`,
                    'collecting',
                    13, 11, 14, 15
                );
                if (isKReached) {
                    addStep(
                        i, n,
                        `Successfully found the top ${DEFAULT_K} frequent elements: [${res.join(', ')}].`,
                        `RETURN res`,
                        'done',
                        15, 13, 16, 16
                    );
                    return { steps: s, stepLineNumbers: lines };
                }
            }
        } else {
            addStep(
                i, null,
                `Bucket for frequency ${i} is empty. Moving to next bucket.`,
                `IF freq[${i}] IS EMPTY`,
                'collecting',
                11, 9, 13, 13
            );
        }
    }

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const variables = useMemo(() => ({
    'current num': currentStep.currentNum ?? 'None',
    'counts': Object.keys(currentStep.count).length > 0
      ? Object.entries(currentStep.count).map(([n, c]) => `${n}: ${c}`).join(', ')
      : 'Empty',
    'k': currentStep.k,
    'res length': currentStep.res.length
  }), [currentStep]);

  const renderVisuals = () => {
    return (
      <div className="space-y-8 w-full">
        <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-3 h-3" /> Input Numbers
            </h4>
            <div className="flex flex-wrap gap-2">
                {currentStep.nums.map((n, idx) => (
                    <motion.div
                        key={idx}
                        animate={{
                            scale: currentStep.phase === 'counting' && currentStep.i === idx ? 1.1 : 1,
                            backgroundColor: currentStep.phase === 'counting' && currentStep.i === idx ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                            color: currentStep.phase === 'counting' && currentStep.i === idx ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))'
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm text-sm"
                    >
                        {n}
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Frequencies
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(currentStep.count).map(([n, c]) => {
                        const isBucketSelected = currentStep.phase === 'bucketing' && currentStep.currentNum === Number(n);
                        return (
                            <motion.div
                                key={n}
                                animate={{
                                    scale: isBucketSelected ? 1.05 : 1,
                                    borderColor: isBucketSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                                }}
                                className="flex items-center justify-between p-2 rounded-lg border-2 bg-card"
                            >
                                <span className="font-bold text-base">{n}</span>
                                <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                    {c}x
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <ListOrdered className="w-3 h-3" /> Frequency Buckets
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-auto pr-2 custom-scrollbar">
                    {currentStep.freq.map((bucket, freq) => {
                        if (freq === 0) return null;
                        const isCurrentBucket = currentStep.phase === 'collecting' && currentStep.i === freq;
                        return (
                            <motion.div
                                key={freq}
                                animate={{
                                    opacity: freq > currentStep.nums.length ? 0.3 : 1,
                                    borderColor: isCurrentBucket ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                                }}
                                className={`flex items-start gap-3 p-1.5 rounded-lg border-2 bg-card/50 \${isCurrentBucket ? 'ring-2 ring-primary/20' : ''}`}
                            >
                                <div className="min-w-[45px] text-[10px] font-bold text-muted-foreground flex items-center h-full">
                                    Freq {freq}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {bucket.length === 0 ? (
                                        <span className="text-[10px] italic text-muted-foreground/50">empty</span>
                                    ) : (
                                        bucket.map((n, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]"
                                            >
                                                {n}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        );
                    }).reverse()}
                </div>
            </div>
        </div>

        <div className="pt-4 border-t space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Top {DEFAULT_K} Frequent Elements</h4>
            <div className="flex gap-3 min-h-[48px] p-2 rounded-xl bg-primary/5 border-2 border-dashed border-primary/20 items-center justify-center">
                <AnimatePresence>
                    {currentStep.res.map((n, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-base shadow-lg ring-4 ring-primary/20"
                        >
                            {n}
                        </motion.div>
                    ))}
                    {currentStep.res.length === 0 && (
                        <span className="text-muted-foreground/50 italic text-sm">Searching...</span>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/5 shadow-lg overflow-hidden min-h-[400px] flex flex-col justify-center">
            {renderVisuals()}
          </Card>

          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-2 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-sm font-medium leading-relaxed"
                  >
                    {currentStep.message}
                  </motion.p>
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <VariablePanel variables={variables} />
        </div>
      }
    />
  );
};
