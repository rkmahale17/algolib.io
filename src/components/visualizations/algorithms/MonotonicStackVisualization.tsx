import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  heights: number[];
  stack: number[];
  currentIndex: number;
  topIndex: number;
  width: number;
  area: number;
  maxArea: number;
  activeRange: [number, number] | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── Hardcoded code per language (no comments) ──────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function largestRectangleArea(heights: number[]): number {
    let maxArea = 0;
    const stack: number[] = [];
    for (let i = 0; i <= heights.length; i++) {
        while (
            stack.length > 0 &&
            (i === heights.length || heights[stack[stack.length - 1]] >= heights[i])
        ) {
            const top = stack.pop()!;
            const width =
                stack.length === 0
                    ? i
                    : i - stack[stack.length - 1] - 1;
            const area = heights[top] * width;
            maxArea = Math.max(maxArea, area);
        }
        stack.push(i);
    }
    return maxArea;
}`,

  python: `def largestRectangleArea(heights):
    stack = []
    max_area = 0
    n = len(heights)
    for i in range(n + 1):
        while stack and (i == n or heights[stack[-1]] >= heights[i]):
            top_index = stack.pop()
            height = heights[top_index]
            width = i if not stack else i - stack[-1] - 1
            area = height * width
            max_area = max(max_area, area)
        stack.append(i)
    return max_area`,

  java: `public int largestRectangleArea(int[] heights) {
    int maxArea = 0;
    Stack<Integer> stack = new Stack<>();
    for (int i = 0; i <= heights.length; i++) {
        while (!stack.isEmpty() &&
               (i == heights.length || heights[stack.peek()] >= heights[i])) {
            int top = stack.pop();
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            int area = heights[top] * width;
            maxArea = Math.max(maxArea, area);
        }
        stack.push(i);
    }
    return maxArea;
}`,

  cpp: `int largestRectangleArea(vector<int>& heights) {
    int maxArea = 0;
    stack<int> st;
    int n = heights.size();
    for (int i = 0; i <= n; i++) {
        while (!st.empty() &&
               (i == n || heights[st.top()] >= heights[i])) {
            int top = st.top();
            st.pop();
            int width = st.empty() ? i : i - st.top() - 1;
            int area = heights[top] * width;
            maxArea = max(maxArea, area);
        }
        st.push(i);
    }
    return maxArea;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const heights = [2, 1, 5, 6, 2, 3];
  const steps: Step[] = [];
  const stack: number[] = [];
  let maxArea = 0;

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    heights,
    stack: [],
    currentIndex: -1,
    topIndex: -1,
    width: 0,
    area: 0,
    maxArea: 0,
    activeRange: null,
    explanation: "Initialize maxArea to 0 and an empty stack to store indices.",
    pseudoStep: "SET maxArea = 0, stack = []",
    variables: { maxArea: 0, stack: '[]', i: '-' }
  });
  addLines(2, 2, 2, 2);

  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];

    steps.push({
      heights,
      stack: [...stack],
      currentIndex: i,
      topIndex: -1,
      width: 0,
      area: 0,
      maxArea,
      activeRange: null,
      explanation: i === heights.length
        ? "Reached the end of the histogram. Process the remaining bars in the stack by treating the end as a bar of height 0."
        : `Loop iteration: i = ${i}, current height = ${h}. Check if this bar breaks our increasing monotonic property in the stack.`,
      pseudoStep: i === heights.length
        ? `FOR i = ${i} (end of list, height = 0)`
        : `FOR i = ${i}: height = ${h}`,
      variables: { i, h, maxArea, stack: `[${stack.join(', ')}]` }
    });
    addLines(4, 5, 4, 5);

    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const topIndex = stack[stack.length - 1];
      const h_top = heights[topIndex];

      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: topIndex,
        width: 0,
        area: 0,
        maxArea,
        activeRange: null,
        explanation: `The bar at index ${i} (height ${h}) is shorter than or equal to the bar at the top of stack (index ${topIndex}, height ${h_top}). This means index ${topIndex} cannot extend its rectangle further.`,
        pseudoStep: `WHILE stack not empty AND stack.top >= ${h}  →  ${h_top} >= ${h}  →  YES ✓`,
        variables: { i, h, top: topIndex, topHeight: h_top, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(5, 6, 5, 6);

      stack.pop();
      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: topIndex,
        width: 0,
        area: 0,
        maxArea,
        activeRange: null,
        explanation: `Pop index ${topIndex} from stack. We will calculate the largest rectangle where this bar (height = ${h_top}) is the shortest bar.`,
        pseudoStep: `SET top = stack.pop()  →  pop index ${topIndex}`,
        variables: { i, h, popped: topIndex, height: h_top, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(9, 7, 7, 9);

      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      const leftBoundary = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
      const rightBoundary = i - 1;

      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: topIndex,
        width: w,
        area: 0,
        maxArea,
        activeRange: [leftBoundary, rightBoundary],
        explanation: stack.length === 0
          ? `Stack is empty. The width extends from index 0 to ${i - 1} (width = ${i}).`
          : `Stack is not empty. The width extends from index ${leftBoundary} to ${rightBoundary} (width = ${i} − ${stack[stack.length - 1]} − 1 = ${w}).`,
        pseudoStep: stack.length === 0
          ? `SET width = i  →  ${i}`
          : `SET width = i − stack.top − 1  →  ${i} − ${stack[stack.length - 1]} − 1 = ${w}`,
        variables: { i, h, height: h_top, width: w, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(10, 9, 8, 10);

      const area = h_top * w;
      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: topIndex,
        width: w,
        area: area,
        maxArea,
        activeRange: [leftBoundary, rightBoundary],
        explanation: `Calculate area: height (${h_top}) * width (${w}) = ${area}.`,
        pseudoStep: `SET area = heights[top] * width  →  ${h_top} * ${w} = ${area}`,
        variables: { i, h, height: h_top, width: w, area, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(14, 10, 9, 11);

      const prevMax = maxArea;
      maxArea = Math.max(maxArea, area);
      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: topIndex,
        width: w,
        area: area,
        maxArea,
        activeRange: [leftBoundary, rightBoundary],
        explanation: area > prevMax
          ? `New maximum area found! ${area} is greater than ${prevMax}. Update maxArea = ${maxArea}.`
          : `The current area ${area} is not greater than our maximum ${prevMax}. maxArea remains ${maxArea}.`,
        pseudoStep: `maxArea = max(maxArea, area)  →  max(${prevMax}, ${area}) = ${maxArea}`,
        variables: { i, h, area, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(15, 11, 10, 12);
    }

    if (i < heights.length) {
      stack.push(i);
      steps.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: -1,
        width: 0,
        area: 0,
        maxArea,
        activeRange: null,
        explanation: `Push current index ${i} onto the stack. This maintains our increasing monotonic property.`,
        pseudoStep: `stack.push(${i})`,
        variables: { i, h, maxArea, stack: `[${stack.join(', ')}]` }
      });
      addLines(17, 12, 12, 14);
    }
  }

  steps.push({
    heights,
    stack: [],
    currentIndex: heights.length,
    topIndex: -1,
    width: 0,
    area: 0,
    maxArea,
    activeRange: null,
    explanation: `Algorithm finished. The largest rectangular area in the histogram is ${maxArea}.`,
    pseudoStep: `RETURN maxArea  →  ${maxArea}`,
    variables: { maxArea, result: maxArea }
  });
  addLines(19, 13, 14, 16);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MonotonicStackVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);
  const maxH = Math.max(...currentStep.heights);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-6 border shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-semibold mb-8 text-muted-foreground uppercase tracking-widest text-center">Largest Rectangle in Histogram</h3>

            <div className="relative flex items-end justify-center h-64 mb-12 px-4">
              <div className="flex items-end w-full h-full relative">
                {currentStep.heights.map((h, idx) => {
                  const isCurrent = idx === currentStep.currentIndex;
                  const isInStack = currentStep.stack.includes(idx);
                  const isTop = idx === currentStep.topIndex;
                  const isActiveRange = currentStep.activeRange && idx >= currentStep.activeRange[0] && idx <= currentStep.activeRange[1];

                  return (
                    <div key={idx} className="flex-1 relative h-full flex items-end group">
                      <motion.div
                        animate={{
                          height: `${(h / maxH) * 100}%`,
                          backgroundColor: isTop
                            ? "rgba(249, 115, 22, 0.4)"
                            : isActiveRange
                              ? "rgba(var(--primary), 0.1)"
                              : isInStack
                                ? "rgba(var(--primary), 0.2)"
                                : "rgba(var(--primary), 0.05)",
                          borderColor: isTop
                            ? "rgb(249, 115, 22)"
                            : isCurrent
                              ? "rgb(var(--primary))"
                              : "rgba(var(--primary), 0.2)"
                        }}
                        className={`w-full border-x border-t-2 transition-colors relative z-10 
                          ${isTop ? 'border-orange-500' : ''}
                          ${isCurrent ? 'border-primary ring-2 ring-primary/20' : ''}
                        `}
                      >
                        <div className="absolute inset-x-0 -top-5 text-center text-[10px] font-bold text-muted-foreground/80">
                          {h}
                        </div>
                        {isCurrent && (
                          <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold"
                          >
                            i:{idx}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}

                {/* Rectangle Overlay */}
                <AnimatePresence>
                  {currentStep.activeRange && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-0 bg-primary/40 border-2 border-primary z-20 shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-sm"
                      style={{
                        left: `${(currentStep.activeRange[0] / currentStep.heights.length) * 100}%`,
                        width: `${((currentStep.activeRange[1] - currentStep.activeRange[0] + 1) / currentStep.heights.length) * 100}%`,
                        height: `${(currentStep.heights[currentStep.topIndex] / maxH) * 100}%`,
                        transformOrigin: 'bottom'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-primary-foreground drop-shadow-md">
                          Area: {currentStep.area}
                        </span>
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 rounded-full">
                          w: {currentStep.width} × h: {currentStep.heights[currentStep.topIndex]}
                        </span>
                        <div className="w-0.5 h-2 bg-primary" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* X-Axis Labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex">
                {currentStep.heights.map((_, idx) => (
                  <div key={idx} className="flex-1 text-center text-[10px] font-mono text-muted-foreground">
                    {idx}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 items-start mt-4">
              <div className="flex-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter">Monotonic Stack (Indices)</h4>
                <div className="flex gap-2 min-h-[44px] p-2 bg-muted/20 border-2 border-dashed border-border rounded-xl items-center flex-wrap">
                  <AnimatePresence>
                    {currentStep.stack.map((idx, sIdx) => (
                      <motion.div
                        key={`${idx}-${sIdx}`}
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm
                          ${idx === currentStep.topIndex
                            ? 'bg-orange-500 text-white ring-4 ring-orange-500/20'
                            : 'bg-primary/20 text-primary border border-primary/20'}
                        `}
                      >
                        {idx}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {currentStep.stack.length === 0 && <span className="text-xs text-muted-foreground italic pl-2">Stack is empty</span>}
                </div>
              </div>

              <div className="w-24 text-right">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-tighter">Global Max</h4>
                <div className="text-3xl font-black text-primary tracking-tighter">
                  {currentStep.maxArea}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Monotonic Stack Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Store indices of bars in a stack representing non-decreasing heights</p>
              <p>• Pop bars when current bar breaks increasing order (its height is shorter)</p>
              <p>• For popped bar, width extends from next item in stack to current index `i`</p>
              <p>• Time: O(n) · Space: O(n)</p>
            </div>
          </div>

        </div>

        {/* Right: code / pseudocode panel and variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              i: currentStep.currentIndex >= 0 && currentStep.currentIndex <= currentStep.heights.length ? currentStep.currentIndex : '-',
              stack: `[${currentStep.stack.join(', ')}]`,
              topIndex: currentStep.topIndex >= 0 ? currentStep.topIndex : '-',
              height: currentStep.topIndex >= 0 ? currentStep.heights[currentStep.topIndex] : '-',
              width: currentStep.width || '-',
              area: currentStep.area || '-',
              maxArea: currentStep.maxArea
            }}
          />
        </div>
      </div>
    </div>
  );
};
