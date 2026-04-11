import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { Layers, Hash, ListOrdered } from 'lucide-react';

interface Step {
  nums: number[];
  k: number;
  i: number | null; // index in nums or freq
  currentNum: number | null;
  count: Record<number, number>;
  freq: number[][];
  res: number[];
  message: string;
  highlightedLines: number[];
  phase: 'counting' | 'bucketing' | 'collecting' | 'done';
}

const DEFAULT_NUMS = [1, 1, 1, 2, 2, 3];
const DEFAULT_K = 2;

export const TopKFrequentElementsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function topKFrequent(nums: number[], k: number): number[] {
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
};`;

  const steps = useMemo(() => {
    const s: Step[] = [];
    const count: Record<number, number> = {};
    const freq: number[][] = Array.from({ length: DEFAULT_NUMS.length + 1 }, () => []);
    const res: number[] = [];

    // Initial state
    s.push({
      nums: DEFAULT_NUMS,
      k: DEFAULT_K,
      i: null,
      currentNum: null,
      count: { ...count },
      freq: freq.map(f => [...f]),
      res: [...res],
      message: "Initialize count map and frequency buckets array.",
      highlightedLines: [2, 3],
      phase: 'counting'
    });

    // Phase 1: Counting
    for (let i = 0; i < DEFAULT_NUMS.length; i++) {
      const n = DEFAULT_NUMS[i];
      count[n] = (count[n] || 0) + 1;
      s.push({
        nums: DEFAULT_NUMS,
        k: DEFAULT_K,
        i,
        currentNum: n,
        count: { ...count },
        freq: freq.map(f => [...f]),
        res: [...res],
        message: `Counting frequency: found ${n}, current count is ${count[n]}.`,
        highlightedLines: [5, 6],
        phase: 'counting'
      });
    }

    // Phase 2: Bucketing
    const countEntries = Object.entries(count);
    for (let i = 0; i < countEntries.length; i++) {
        const [n, c] = countEntries[i].map(Number);
        freq[c].push(n);
        s.push({
            nums: DEFAULT_NUMS,
            k: DEFAULT_K,
            i,
            currentNum: n,
            count: { ...count },
            freq: freq.map(f => [...f]),
            res: [...res],
            message: `Placing ${n} into bucket for frequency ${c}.`,
            highlightedLines: [9, 10],
            phase: 'bucketing'
        });
    }

    // Phase 3: Collecting
    s.push({
        nums: DEFAULT_NUMS,
        k: DEFAULT_K,
        i: freq.length,
        currentNum: null,
        count: { ...count },
        freq: freq.map(f => [...f]),
        res: [...res],
        message: "Start collecting top K elements from the highest frequency buckets.",
        highlightedLines: [13, 14],
        phase: 'collecting'
    });

    for (let i = freq.length - 1; i > 0; i--) {
        if (freq[i].length > 0) {
            s.push({
                nums: DEFAULT_NUMS,
                k: DEFAULT_K,
                i,
                currentNum: null,
                count: { ...count },
                freq: freq.map(f => [...f]),
                res: [...res],
                message: `Checking bucket for frequency ${i}. Found elements: [${freq[i].join(', ')}].`,
                highlightedLines: [15],
                phase: 'collecting'
            });

            for (const n of freq[i]) {
                res.push(n);
                const isKReached = res.length === DEFAULT_K;
                s.push({
                    nums: DEFAULT_NUMS,
                    k: DEFAULT_K,
                    i,
                    currentNum: n,
                    count: { ...count },
                    freq: freq.map(f => [...f]),
                    res: [...res],
                    message: `Adding ${n} to result. ${isKReached ? 'K elements reached!' : `Still need ${DEFAULT_K - res.length} more.`}`,
                    highlightedLines: [16, 17, 18],
                    phase: 'collecting'
                });
                if (isKReached) {
                    s.push({
                        nums: DEFAULT_NUMS,
                        k: DEFAULT_K,
                        i,
                        currentNum: n,
                        count: { ...count },
                        freq: freq.map(f => [...f]),
                        res: [...res],
                        message: `Successfully found the top ${DEFAULT_K} frequent elements: [${res.join(', ')}].`,
                        highlightedLines: [18],
                        phase: 'done'
                    });
                    return s;
                }
            }
        } else {
            s.push({
                nums: DEFAULT_NUMS,
                k: DEFAULT_K,
                i,
                currentNum: null,
                count: { ...count },
                freq: freq.map(f => [...f]),
                res: [...res],
                message: `Bucket for frequency ${i} is empty. Moving to next bucket.`,
                highlightedLines: [14],
                phase: 'collecting'
            });
        }
    }

    return s;
  }, []);

  const currentStep = steps[currentStepIndex];

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
        {/* Nums Input Hook */}
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
            {/* Counts Map */}
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

            {/* Frequency Buckets */}
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
                                className={`flex items-start gap-3 p-1.5 rounded-lg border-2 bg-card/50 ${isCurrentBucket ? 'ring-2 ring-primary/20' : ''}`}
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

        {/* Result Area */}
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
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            <VariablePanel variables={variables} />
          </div>
        </div>

        <div className="lg:h-[calc(100vh-200px)] min-h-[500px]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
