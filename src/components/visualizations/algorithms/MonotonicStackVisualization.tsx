import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  heights: number[];
  stack: number[];
  currentIndex: number;
  maxArea: number;
  currentArea: number;
  width: number;
  topIndex: number;
  activeRange: [number, number] | null;
  message: string;
  lineNumber: number;
}

export const MonotonicStackVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function largestRectangleArea(heights: number[]): number {
  let maxArea = 0;
  const stack: number[] = [];

  for (let i = 0; i <= heights.length; i++) {
    while (
      stack.length > 0 &&
      (i === heights.length || heights[stack[stack.length - 1]] >= heights[i])
    ) {
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

  const generateSteps = () => {
    const heights = [2, 1, 5, 6, 2, 3];
    const newSteps: Step[] = [];
    const stack: number[] = [];
    let maxArea = 0;

    // Line 1: Function entry
    newSteps.push({
      heights: [...heights],
      stack: [],
      currentIndex: -1,
      maxArea: 0,
      currentArea: 0,
      width: 0,
      topIndex: -1,
      activeRange: null,
      message: 'Starting Largest Rectangle in Histogram calculation.',
      lineNumber: 1
    });

    // Line 2: Initialize maxArea
    newSteps.push({
      heights: [...heights],
      stack: [],
      currentIndex: -1,
      maxArea: 0,
      currentArea: 0,
      width: 0,
      topIndex: -1,
      activeRange: null,
      message: 'Initialize maxArea to 0.',
      lineNumber: 2
    });

    for (let i = 0; i <= heights.length; i++) {
      // Line 5: For loop
      newSteps.push({
        heights: [...heights],
        stack: [...stack],
        currentIndex: i,
        maxArea,
        currentArea: 0,
        width: 0,
        topIndex: -1,
        activeRange: null,
        message: i === heights.length
          ? 'Reached the end. Processing remaining bars in stack.'
          : `Processing bar at index ${i} with height ${heights[i]}.`,
        lineNumber: 5
      });

      while (
        stack.length > 0 &&
        (i === heights.length || heights[stack[stack.length - 1]] >= heights[i])
      ) {
        // Line 6-9: While condition check
        const top = stack[stack.length - 1];
        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: 0,
          width: 0,
          topIndex: top,
          activeRange: null,
          message: i === heights.length
            ? 'Stack is not empty at end. Flushing...'
            : `Bar at index ${i} (${heights[i]}) is shorter than or equal to bar at index ${top} (${heights[top]}). Breaking increasing pattern.`,
          lineNumber: 6
        });

        // Line 10: Pop top
        stack.pop();
        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: 0,
          width: 0,
          topIndex: top,
          activeRange: null,
          message: `Pop index ${top} from stack. This will be the height of our rectangle.`,
          lineNumber: 10
        });

        // Line 11-13: Calculate width
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        const leftBoundary = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
        const rightBoundary = i - 1;

        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: 0,
          width,
          topIndex: top,
          activeRange: [leftBoundary, rightBoundary],
          message: stack.length === 0
            ? `Stack is empty. Width = i = ${i}. Rectangle spans from index 0 to ${i - 1}.`
            : `New stack top is ${stack[stack.length - 1]}. Width = i - stackTop - 1 = ${i} - ${stack[stack.length - 1]} - 1 = ${width}.`,
          lineNumber: 11
        });

        // Line 15: Calculate area
        const area = heights[top] * width;
        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: area,
          width,
          topIndex: top,
          activeRange: [leftBoundary, rightBoundary],
          message: `Calculate area: height (${heights[top]}) * width (${width}) = ${area}.`,
          lineNumber: 15
        });

        // Line 16: Update maxArea
        const oldMax = maxArea;
        maxArea = Math.max(maxArea, area);
        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: area,
          width,
          topIndex: top,
          activeRange: [leftBoundary, rightBoundary],
          message: area > oldMax
            ? `New max area found! ${area} > ${oldMax}.`
            : `Max area remains ${maxArea}.`,
          lineNumber: 16
        });
      }

      if (i < heights.length) {
        // Line 18: Push i
        stack.push(i);
        newSteps.push({
          heights: [...heights],
          stack: [...stack],
          currentIndex: i,
          maxArea,
          currentArea: 0,
          width: 0,
          topIndex: -1,
          activeRange: null,
          message: `Push index ${i} to stack. Maintains increasing height order.`,
          lineNumber: 18
        });
      }
    }

    // Line 21: Return
    newSteps.push({
      heights: [...heights],
      stack: [...stack],
      currentIndex: heights.length,
      maxArea,
      currentArea: 0,
      width: 0,
      topIndex: -1,
      activeRange: null,
      message: `Final maximum rectangle area is ${maxArea}.`,
      lineNumber: 21
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

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
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const maxVal = Math.max(...currentStep.heights);

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
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 space-y-8">
            <div className="relative pt-12">
              <h4 className="text-sm font-semibold mb-6 text-muted-foreground">Histogram</h4>
              <div className="flex items-end justify-center gap-1 h-48">
                {currentStep.heights.map((h, idx) => {
                  const isCurrent = idx === currentStep.currentIndex;
                  const isInStack = currentStep.stack.includes(idx);
                  const isTop = idx === currentStep.topIndex;
                  const isActiveRange = currentStep.activeRange &&
                    idx >= currentStep.activeRange[0] &&
                    idx <= currentStep.activeRange[1];

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1 max-w-[40px] relative">
                      {isCurrent && (
                        <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">CURR</div>
                      )}
                      {isTop && (
                        <div className="absolute -top-12 text-xs font-bold text-orange-500">HEIGHT</div>
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${isTop
                            ? 'bg-orange-500 ring-2 ring-orange-500 shadow-lg scale-105'
                            : isActiveRange
                              ? 'bg-primary/80 ring-1 ring-primary'
                              : isCurrent
                                ? 'bg-primary/40'
                                : isInStack
                                  ? 'bg-yellow-500/80 shadow-sm'
                                  : 'bg-muted/40'
                          }`}
                        style={{ height: `${(h / maxVal) * 100}%`, minHeight: '4px' }}
                      />
                      <span className={`text-[10px] font-mono ${isTop ? 'text-orange-500 font-bold' : 'text-muted-foreground'}`}>
                        {h}
                      </span>
                    </div>
                  );
                })}
              </div>
              {currentStep.activeRange && (
                <div className="absolute bottom-[24px] flex justify-center w-full pointer-events-none">
                  <div className="bg-primary/20 border-x-2 border-t-2 border-primary/40 h-[170px]"
                    style={{
                      width: `${(currentStep.width / currentStep.heights.length) * 100}%`,
                      marginLeft: `${((currentStep.activeRange[0] - (currentStep.heights.length - currentStep.width) / 2) / currentStep.heights.length) * 0}%`, // Simplified centering logic
                      position: 'absolute',
                      left: `${(currentStep.activeRange[0] / currentStep.heights.length) * 100}%`,
                      width: `${((currentStep.activeRange[1] - currentStep.activeRange[0] + 1) / currentStep.heights.length) * 100}%`
                    }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary bg-background px-1">
                      WIDTH: {currentStep.width}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Stack (indices)</h4>
                <div className="flex flex-row gap-1 h-12 items-end">
                  {currentStep.stack.length > 0 ? (
                    currentStep.stack.map((idx, i) => (
                      <div
                        key={i}
                        className="bg-yellow-500 text-white rounded text-[10px] w-8 h-8 flex items-center justify-center font-mono font-bold animate-in slide-in-from-bottom"
                      >
                        {idx}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic">empty</div>
                  )}
                </div>
              </div>
              <div className="flex-1 border-l pl-4">
                <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Current Check</h4>
                <div className="space-y-1">
                  <div className="text-xs">Max Area: <span className="font-bold text-green-600">{currentStep.maxArea}</span></div>
                  {currentStep.currentArea > 0 && (
                    <div className="text-xs font-medium text-primary animate-pulse">Rect: {currentStep.currentArea}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4 min-h-[80px]">
            <p className="text-sm text-foreground font-medium leading-relaxed">{currentStep.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />

          <VariablePanel
            variables={{
              i: currentStep.currentIndex <= currentStep.heights.length ? currentStep.currentIndex : 'done',
              maxArea: currentStep.maxArea,
              stack: `[${currentStep.stack.join(', ')}]`,
              height: currentStep.topIndex >= 0 ? currentStep.heights[currentStep.topIndex] : 'N/A',
              width: currentStep.width > 0 ? currentStep.width : 'N/A',
              area: currentStep.currentArea > 0 ? currentStep.currentArea : 'N/A'
            }}
          />
        </div>
      </div>
    </div>
  );
};

