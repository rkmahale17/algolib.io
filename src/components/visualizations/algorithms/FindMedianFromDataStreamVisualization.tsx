import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  operation: string;
  num: number | null;
  maxHeap: number[];
  minHeap: number[];
  median: number | null;
  message: string;
  lineNumber: number;
}

export const FindMedianFromDataStreamVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { operation: "init", num: null, maxHeap: [], minHeap: [], median: null, message: "MedianFinder: Use 2 heaps. MaxHeap (left half) ≤ MinHeap (right half)", lineNumber: 1 },
    { operation: "addNum", num: 1, maxHeap: [1], minHeap: [], median: null, message: "Add 1: Insert to maxHeap (left). Balance: maxHeap=[1], minHeap=[]", lineNumber: 7 },
    { operation: "findMedian", num: null, maxHeap: [1], minHeap: [], median: 1, message: "Median: Only maxHeap has 1. Return 1.0", lineNumber: 22 },
    { operation: "addNum", num: 2, maxHeap: [1], minHeap: [2], median: null, message: "Add 2: 2 > max(maxHeap). Add to minHeap. Balance: [1] | [2]", lineNumber: 13 },
    { operation: "findMedian", num: null, maxHeap: [1], minHeap: [2], median: 1.5, message: "Median: Even count. (max(maxHeap) + min(minHeap))/2 = (1+2)/2 = 1.5", lineNumber: 24 },
    { operation: "addNum", num: 3, maxHeap: [1], minHeap: [2,3], median: null, message: "Add 3: 3 > 1. Add to minHeap. Balance: [1] | [2,3]", lineNumber: 13 },
    { operation: "findMedian", num: null, maxHeap: [2], minHeap: [3], median: 2, message: "Rebalance: Move 2 to maxHeap. Median = 2. Time: O(log n), Space: O(n)", lineNumber: 22 }
  ];

  const code = `class MedianFinder {
  maxHeap: number[] = []; // left half (max at top)
  minHeap: number[] = []; // right half (min at top)
  
  addNum(num: number): void {
    // Add to maxHeap first
    this.maxHeap.push(num);
    this.maxHeapifyUp(this.maxHeap.length - 1);
    
    // Balance: move max of maxHeap to minHeap if needed
    if (this.maxHeap.length > 0 && this.minHeap.length > 0 &&
        this.maxHeap[0] > this.minHeap[0]) {
      const val = this.extractMax(this.maxHeap);
      this.minHeap.push(val);
      this.minHeapifyUp(this.minHeap.length - 1);
    }
    
    // Ensure maxHeap.size >= minHeap.size
    if (this.minHeap.length > this.maxHeap.length) {
      const val = this.extractMin(this.minHeap);
      this.maxHeap.push(val);
      this.maxHeapifyUp(this.maxHeap.length - 1);
    }
  }
  
  findMedian(): number {
    if (this.maxHeap.length > this.minHeap.length) {
      return this.maxHeap[0];
    }
    return (this.maxHeap[0] + this.minHeap[0]) / 2;
  }
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
          <h3 className="text-lg font-semibold mb-4">Find Median from Data Stream</h3>
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 rounded">
              <div className="text-sm"><strong>Operation:</strong> {currentStep.operation}{currentStep.num !== null ? `(${currentStep.num})` : '()'}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">MaxHeap (Left Half):</div>
                <div className="p-4 bg-blue-500/10 rounded min-h-[80px]">
                  <div className="flex flex-col gap-1">
                    {currentStep.maxHeap.map((val, idx) => (
                      <div key={idx} className={`px-3 py-2 rounded font-mono bg-blue-500/20 text-blue-700 font-bold ${
                        idx === 0 ? 'ring-2 ring-blue-500' : ''
                      }`}>
                        {val}
                      </div>
                    ))}
                    {currentStep.maxHeap.length === 0 && <span className="text-muted-foreground text-sm">Empty</span>}
                  </div>
                  {currentStep.maxHeap.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Top: {currentStep.maxHeap[0]} (max)
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">MinHeap (Right Half):</div>
                <div className="p-4 bg-purple-500/10 rounded min-h-[80px]">
                  <div className="flex flex-col gap-1">
                    {currentStep.minHeap.map((val, idx) => (
                      <div key={idx} className={`px-3 py-2 rounded font-mono bg-purple-500/20 text-purple-700 font-bold ${
                        idx === 0 ? 'ring-2 ring-purple-500' : ''
                      }`}>
                        {val}
                      </div>
                    ))}
                    {currentStep.minHeap.length === 0 && <span className="text-muted-foreground text-sm">Empty</span>}
                  </div>
                  {currentStep.minHeap.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Top: {currentStep.minHeap[0]} (min)
                    </div>
                  )}
                </div>
              </div>
            </div>
            {currentStep.median !== null && (
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-sm text-muted-foreground mb-1">Current Median</div>
                <div className="text-3xl font-bold text-green-600">{currentStep.median}</div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key:</strong> MaxHeap stores smaller half (max on top), MinHeap stores larger half (min on top). Median is middle element(s).
            </div>
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
