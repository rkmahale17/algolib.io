import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';

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
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const MonotonicStackVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const heights = [2, 1, 5, 6, 2, 3];

  const steps = useMemo(() => {
    const s: Step[] = [];
    const stack: number[] = [];
    let maxArea = 0;

    // Initial state
    s.push({
      heights,
      stack: [],
      currentIndex: -1,
      topIndex: -1,
      width: 0,
      area: 0,
      maxArea: 0,
      activeRange: null,
      explanation: "Initialize maxArea to 0 and an empty stack to store indices.",
      highlightedLines: [1, 2, 3],
      variables: { maxArea: 0, stack: '[]' }
    });

    for (let i = 0; i <= heights.length; i++) {
      const currentHeight = i === heights.length ? 0 : heights[i];

      s.push({
        heights,
        stack: [...stack],
        currentIndex: i,
        topIndex: -1,
        width: 0,
        area: 0,
        maxArea,
        activeRange: null,
        explanation: i === heights.length
          ? "Reached the end of the histogram. Let's process the remaining bars in the stack by treating the end as a bar of height 0."
          : `Processing bar at index ${i} with height ${currentHeight}. We check if this bar breaks our increasing (monotonic) property in the stack.`,
        highlightedLines: [5, 6, 7],
        variables: { i, currentHeight, stack: `[${stack.join(', ')}]`, maxArea }
      });

      while (stack.length > 0 && (i === heights.length || heights[stack[stack.length - 1]] >= heights[i])) {
        const topIndex = stack.pop()!;
        const h = heights[topIndex];
        const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        const area = h * w;
        const leftBoundary = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
        const rightBoundary = i - 1;

        s.push({
          heights,
          stack: [...stack, topIndex], // Show it's about to be popped
          currentIndex: i,
          topIndex: topIndex,
          width: 0,
          area: 0,
          maxArea,
          activeRange: null,
          explanation: `The bar at index ${i} (height ${currentHeight}) is shorter than or equal to the bar at the top of our stack (index ${topIndex}, height ${h}). This means index ${topIndex} cannot extend its rectangle any further to the right.`,
          highlightedLines: [6, 7, 8],
          variables: { i, currentHeight, top: topIndex, topHeight: h, stack: `[${[...stack, topIndex].join(', ')}]` }
        });

        s.push({
          heights,
          stack: [...stack],
          currentIndex: i,
          topIndex: topIndex,
          width: w,
          area: area,
          maxArea,
          activeRange: [leftBoundary, rightBoundary],
          explanation: `We pop ${topIndex} and calculate the area. The height is ${h}. The width is ${w} (from index ${leftBoundary} to ${rightBoundary}). The area is ${h} * ${w} = ${area}.`,
          highlightedLines: [9, 10, 11, 12, 13, 14],
          variables: { height: h, width: w, area, currentStack: `[${stack.join(', ')}]` }
        });

        const prevMax = maxArea;
        maxArea = Math.max(maxArea, area);
        s.push({
          heights,
          stack: [...stack],
          currentIndex: i,
          topIndex: topIndex,
          width: w,
          area: area,
          maxArea,
          activeRange: [leftBoundary, rightBoundary],
          explanation: area > prevMax
            ? `New maximum area found! ${area} is greater than ${prevMax}.`
            : `The current area ${area} is not greater than our maximum ${prevMax}. maxArea remains ${maxArea}.`,
          highlightedLines: [15],
          variables: { area, maxArea }
        });
      }

      if (i < heights.length) {
        stack.push(i);
        s.push({
          heights,
          stack: [...stack],
          currentIndex: i,
          topIndex: -1,
          width: 0,
          area: 0,
          maxArea,
          activeRange: null,
          explanation: `Now that all bars taller than ${heights[i]} are processed, we push index ${i} onto the stack. This maintains our non-decreasing property.`,
          highlightedLines: [17],
          variables: { pushed: i, stack: `[${stack.join(', ')}]` }
        });
      }
    }

    s.push({
      heights,
      stack: [],
      currentIndex: heights.length,
      topIndex: -1,
      width: 0,
      area: 0,
      maxArea,
      activeRange: null,
      explanation: `Algorithm finished. The largest rectangular area found in the histogram is ${maxArea}.`,
      highlightedLines: [19],
      variables: { maxArea }
    });

    return s;
  }, []);

  const code = `function largestRectangleArea(heights: number[]): number {
    let maxArea = 0;
    const stack: number[] = [];

    for (let i = 0; i <= heights.length; i++) {
        const h = i === heights.length ? 0 : heights[i];
        while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
            const top = stack.pop()!;
            const width = stack.length === 0 
                ? i 
                : i - stack[stack.length - 1] - 1;
            
            const area = heights[top] * width;
            maxArea = Math.max(maxArea, area);
        }
        stack.push(i);
    }
    return maxArea;
}`;

  const step = steps[currentStep];
  const maxH = Math.max(...heights);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
            <h3 className="text-sm font-semibold mb-12 text-muted-foreground uppercase tracking-widest text-center">Largest Rectangle in Histogram</h3>

            <div className="relative flex items-end justify-center h-64 mb-16 px-4">
              {/* Histogram Bars */}
              <div className="flex items-end w-full h-full relative">
                {heights.map((h, idx) => {
                  const isCurrent = idx === step.currentIndex;
                  const isInStack = step.stack.includes(idx);
                  const isTop = idx === step.topIndex;
                  const isActiveRange = step.activeRange && idx >= step.activeRange[0] && idx <= step.activeRange[1];

                  return (
                    <div key={idx} className="flex-1 relative h-full flex items-end group">
                      <motion.div
                        animate={{
                          height: `${(h / maxH) * 100}%`,
                          backgroundColor: isTop
                            ? "rgba(249, 115, 22, 0.4)" // Orange highlight for height provider
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
                  {step.activeRange && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-0 bg-primary/40 border-2 border-primary z-20 shadow-[0_0_20px_rgba(var(--primary),0.3)] rounded-sm"
                      style={{
                        left: `${(step.activeRange[0] / heights.length) * 100}%`,
                        width: `${((step.activeRange[1] - step.activeRange[0] + 1) / heights.length) * 100}%`,
                        height: `${(heights[step.topIndex] / maxH) * 100}%`,
                        transformOrigin: 'bottom'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-primary-foreground drop-shadow-md">
                          Area: {step.area}
                        </span>
                      </div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 rounded-full">
                          w: {step.width} × h: {heights[step.topIndex]}
                        </span>
                        <div className="w-0.5 h-2 bg-primary" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* X-Axis Labels */}
              <div className="absolute -bottom-8 left-0 right-0 flex">
                {heights.map((_, idx) => (
                  <div key={idx} className="flex-1 text-center text-[10px] font-mono text-muted-foreground">
                    {idx}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-1">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Monotonic Stack (Indices)</h4>
                <div className="flex gap-2 min-h-[50px] p-4 bg-muted/20 border-2 border-dashed border-border rounded-xl items-center flex-wrap">
                  <AnimatePresence>
                    {step.stack.map((idx, sIdx) => (
                      <motion.div
                        key={`${idx}-${sIdx}`}
                        initial={{ scale: 0, y: 10 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm
                          ${idx === step.topIndex
                            ? 'bg-orange-500 text-white ring-4 ring-orange-500/20'
                            : 'bg-primary/20 text-primary border border-primary/20'}
                        `}
                      >
                        {idx}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {step.stack.length === 0 && <span className="text-xs text-muted-foreground italic">Stack is empty</span>}
                </div>
              </div>

              <div className="w-40 text-right">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-tighter">Global Max</h4>
                <div className="text-4xl font-black text-primary tracking-tighter">
                  {step.maxArea}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Algorithm Insights</h4>
            <p className="text-sm font-medium leading-relaxed min-h-[3rem] animate-in fade-in slide-in-from-left-1">
              {step.explanation}
            </p>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={step.highlightedLines}
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
  );
};
