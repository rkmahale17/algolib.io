import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  nums: number[];
  k: number;
  freqMap: [number, number][];
  heap: number[];
  result: number[];
  message: string;
  lineNumber: number;
}

export const TopKFrequentElementsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [], heap: [], result: [], message: "Find top 2 frequent elements. Strategy: Count frequencies, use heap/bucket", lineNumber: 1 },
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [[1,3],[2,2],[3,1]], heap: [], result: [], message: "Count frequencies: 1→3, 2→2, 3→1. Build frequency map", lineNumber: 3 },
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [[1,3],[2,2],[3,1]], heap: [3,2,1], result: [], message: "Use max heap or bucket sort. Order by frequency: [3,2,1]", lineNumber: 8 },
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [[1,3],[2,2],[3,1]], heap: [3,2], result: [1], message: "Pop top: freq=3 → element=1. Result: [1]", lineNumber: 11 },
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [[1,3],[2,2],[3,1]], heap: [2], result: [1,2], message: "Pop next: freq=2 → element=2. Result: [1,2]. k=2 done!", lineNumber: 11 },
    { nums: [1,1,1,2,2,3], k: 2, freqMap: [[1,3],[2,2],[3,1]], heap: [], result: [1,2], message: "Complete! Top 2 frequent: [1,2]. Time: O(n log k) heap or O(n) bucket", lineNumber: 14 }
  ];

  const code = `function topKFrequent(nums: number[], k: number): number[] {
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  
  // Bucket sort approach (O(n))
  const buckets: number[][] = Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, freq] of freqMap) {
    buckets[freq].push(num);
  }
  
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  
  return result.slice(0, k);
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top K Frequent Elements</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Input Array (k={currentStep.k}):</div>
              <div className="flex gap-1 flex-wrap">
                {currentStep.nums.map((num, idx) => (
                  <div key={idx} className="px-3 py-2 rounded font-mono bg-secondary">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            {currentStep.freqMap.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Frequency Map:</div>
                <div className="space-y-2">
                  {currentStep.freqMap.map(([num, freq], idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded font-mono bg-primary/20 text-primary font-bold">
                        {num}
                      </div>
                      <span>→</span>
                      <div className="px-3 py-2 rounded font-mono bg-secondary">
                        {freq} times
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all"
                          style={{ width: `${(freq / Math.max(...currentStep.freqMap.map(f => f[1]))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentStep.heap.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Heap (by frequency):</div>
                <div className="flex gap-2 flex-wrap">
                  {currentStep.heap.map((freq, idx) => (
                    <div key={idx} className="px-4 py-3 rounded font-mono bg-blue-500/20 text-blue-700 font-bold">
                      freq={freq}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm font-medium mb-2">Result (Top {currentStep.k}):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.result.map((num, idx) => (
                  <div key={idx} className="px-4 py-3 rounded font-mono bg-green-500/30 text-green-700 font-bold">
                    {num}
                  </div>
                ))}
                {currentStep.result.length === 0 && <span className="text-muted-foreground text-sm">—</span>}
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
