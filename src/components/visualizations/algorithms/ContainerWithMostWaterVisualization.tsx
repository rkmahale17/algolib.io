import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Card } from '@/components/ui/card';
import { 
  Zap, 
  Target, 
  ArrowRight, 
  ArrowLeft, 
  Repeat, 
  CheckCircle2, 
  Info,
  Maximize2,
  MoveHorizontal,
  Droplets,
  ArrowDown
} from 'lucide-react';

interface Step {
  left: number;
  right: number;
  maxArea: number;
  width: number | '-';
  currentHeight: number | '-';
  currentArea: number | '-';
  message: string;
  lineNumber: number;
  phase: 'init' | 'loop' | 'calc-width' | 'calc-height' | 'calc-area' | 'update-max' | 'move' | 'done';
  insight?: string;
  isNewMax?: boolean;
}

export const ContainerWithMostWaterVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const maxHeight = Math.max(...heights);

  const code = `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    const area = width * h;

    maxArea = Math.max(maxArea, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    let left = 0;
    let right = heights.length - 1;
    let maxArea = 0;

    // Phase: Initialization
    s.push({
      left,
      right,
      maxArea,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      message: "Initialize pointers mapping to the ends of the array. Our goal is to maximize the area between these lines.",
      lineNumber: 2,
      phase: 'init',
      insight: "The area is limited by the shorter line, so we'll start with the maximum possible width."
    });

    s.push({
      left,
      right,
      maxArea,
      width: '-',
      currentHeight: '-',
      currentArea: '-',
      message: `Initialize maxArea to 0.`,
      lineNumber: 3,
      phase: 'init'
    });

    while (left < right) {
      // Loop Check
      s.push({
        left,
        right,
        maxArea,
        width: '-',
        currentHeight: '-',
        currentArea: '-',
        message: `Condition left (${left}) < right (${right}) is true. Proceed to calculate area.`,
        lineNumber: 5,
        phase: 'loop'
      });

      const width = right - left;
      s.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: '-',
        currentArea: '-',
        message: `Calculate width: right (${right}) - left (${left}) = ${width}.`,
        lineNumber: 6,
        phase: 'calc-width'
      });

      const h = Math.min(heights[left], heights[right]);
      s.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: '-',
        message: `Calculate height: min(${heights[left]}, ${heights[right]}) = ${h}.`,
        lineNumber: 7,
        phase: 'calc-height',
        insight: "The water level cannot exceed the shorter of the two lines."
      });

      const area = width * h;
      s.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: area,
        message: `Current area: width (${width}) × height (${h}) = ${area}.`,
        lineNumber: 8,
        phase: 'calc-area'
      });

      const isNewMax = area > maxArea;
      maxArea = Math.max(maxArea, area);
      s.push({
        left,
        right,
        maxArea,
        width,
        currentHeight: h,
        currentArea: area,
        message: isNewMax 
          ? `New maximum area found! Updated maxArea to ${maxArea}.`
          : `Current area (${area}) is not greater than maxArea (${maxArea}).`,
        lineNumber: 10,
        phase: 'update-max',
        isNewMax,
        insight: isNewMax ? "We've found a larger container!" : "No improvement over the global best."
      });

      if (heights[left] < heights[right]) {
        s.push({
          left,
          right,
          maxArea,
          width,
          currentHeight: h,
          currentArea: area,
          message: `heights[left] (${heights[left]}) < heights[right] (${heights[right]}). Move the shorter pointer inward to potentially find a taller line.`,
          lineNumber: 13,
          phase: 'move',
          insight: "To possibly find a larger area with a smaller width, we must increase the height. Only moving the shorter line can do this."
        });
        left++;
      } else {
        s.push({
          left,
          right,
          maxArea,
          width,
          currentHeight: h,
          currentArea: area,
          message: `heights[right] (${heights[right]}) ≤ heights[left] (${heights[left]}). Move the shorter pointer inward.`,
          lineNumber: 15,
          phase: 'move',
          insight: "Moving the taller line would only reduce the width without being able to increase the height (which is already limited by the shorter line)."
        });
        right--;
      }
    }

    s.push({
      left,
      right,
      maxArea,
      width: 0,
      currentHeight: 0,
      currentArea: 0,
      message: `Execution complete. Maximum area found is ${maxArea}.`,
      lineNumber: 18,
      phase: 'done',
      insight: "The Two-Pointer approach allows us to find the maximum area in O(n) time by optimally reducing the search space."
    });

    return s;
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-8">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[500px] flex flex-col shadow-lg shadow-primary/5">
            {/* Header Info */}
            <div className="flex justify-between items-center mb-12">
               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Droplets className="w-3 h-3 text-primary" />
                Container Volume Maximizer
              </h3>
              <div className="flex gap-4 items-center">
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Repeat className="w-3 h-3" />
                    Phase: {currentStep.phase.replace('-', ' ')}
                 </div>
              </div>
            </div>

            {/* Pointer & Line Visualization */}
            <div className="flex-1 flex justify-between items-end px-12 mb-2 relative h-64 border-b-2 border-muted-foreground/30">
              {/* X-Axis Label */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-10 text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                <span>x = 0</span>
                <span>x-axis (index)</span>
                <span>x = {heights.length - 1}</span>
              </div>

              {/* Overlay for Water Fill to ensure perfect alignment */}
              <div className="absolute top-0 bottom-0 left-12 right-12 z-0 pointer-events-none">
                 <AnimatePresence>
                    {currentStep.currentArea !== '-' && currentStep.width !== '-' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-0 bg-blue-500/20 border-x-2 border-t-2 border-blue-400 overflow-hidden"
                        style={{
                          left: `${(currentStep.left / (heights.length - 1)) * 100}%`,
                          width: `${(currentStep.width / (heights.length - 1)) * 100}%`,
                          height: `${(Number(currentStep.currentHeight) / maxHeight) * 100}%`,
                          transformOrigin: 'bottom'
                        }}
                      >
                         <div className="w-full h-full bg-[linear-gradient(180deg,rgba(59,130,246,0.3)_0%,rgba(59,130,246,0.05)_100%)] animate-pulse-subtle" />
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {heights.map((h, i) => {
                const isLeft = i === currentStep.left;
                const isRight = i === currentStep.right;
                const isMember = isLeft || isRight;
                const barHeight = (h / maxHeight) * 100;

                return (
                  <div key={i} className="flex flex-col items-center w-1 relative h-full justify-end group z-10">
                    {/* Floating Pointers Pinpointing Line Tops */}
                    <AnimatePresence>
                      {isMember && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute z-20 flex flex-col items-center gap-1"
                          style={{
                            bottom: `calc(${barHeight}% + 16px)`
                          }}
                        >
                          <div className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white shadow-lg whitespace-nowrap ${isLeft ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            {isLeft ? 'LEFT' : 'RIGHT'}
                          </div>
                          <div className={`w-1.5 h-1.5 rounded-full ${isLeft ? 'bg-orange-500' : 'bg-blue-500'} animate-ping shadow-[0_0_8px_currentColor]`} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Height Value */}
                    <div className={`absolute whitespace-nowrap text-[10px] font-black transition-all duration-300 ${isMember ? isLeft ? 'text-orange-500 scale-125' : 'text-blue-500 scale-125' : 'text-muted-foreground/30'}`}
                      style={{ bottom: `calc(${barHeight}% + 4px)` }}>
                      {h}
                    </div>

                    {/* The Line (from (i,0) to (i,height[i])) */}
                    <motion.div
                      className={`w-0.5 rounded-full transition-all duration-500 ${
                        isMember 
                          ? isLeft ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                          : 'bg-muted-foreground/20'
                      }`}
                      style={{ height: `${barHeight}%` }}
                      animate={{
                        scaleX: isMember ? 4 : 1,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mt-auto pt-6 border-t border-border/40">
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <span className="text-[9px] font-bold text-orange-600 uppercase mb-0.5 flex items-center gap-1">
                   <MoveHorizontal className="w-2 h-2" /> width
                </span>
                <span className="text-base font-black text-orange-600 font-mono">{currentStep.width}</span>
              </div>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-[9px] font-bold text-blue-600 uppercase mb-0.5 flex items-center gap-1">
                   <Target className="w-2 h-2" /> height
                </span>
                <span className="text-base font-black text-blue-600 font-mono">{currentStep.currentHeight}</span>
              </div>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                <span className="text-[9px] font-bold text-primary uppercase mb-0.5 flex items-center gap-1">
                   <Droplets className="w-2 h-2" /> area
                </span>
                <span className="text-base font-black text-primary font-mono">{currentStep.currentArea}</span>
              </div>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <span className="text-[9px] font-bold text-indigo-600 uppercase mb-0.5 flex items-center gap-1">
                   <Maximize2 className="w-2 h-2" /> best
                </span>
                <span className="text-base font-black text-indigo-600 font-mono">{currentStep.maxArea}</span>
              </div>
            </div>
          </Card>

          <Card className={`p-6 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[140px] flex items-center ${currentStep.isNewMax ? 'bg-indigo-500/10 border-indigo-500' : 'bg-primary/5 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl shrink-0 ${currentStep.isNewMax ? 'bg-indigo-500 text-white' : 'bg-primary/10 text-primary'}`}>
                {currentStep.isNewMax ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80">
                   Reasoning Insight
                </h4>
                <p className="text-[15px] font-medium leading-relaxed text-foreground/90 leading-tight">
                  {currentStep.message}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex-1 overflow-hidden min-h-[400px]">
             <AnimatedCodeEditor
                code={code}
                highlightedLines={[currentStep.lineNumber]}
                language="typescript"
              />
          </div>

          <Card className="p-6 bg-card border border-border/50 shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
              <Zap className="w-3 h-3 text-primary" />
              Algorithm intuition
            </h4>
            
            <div className="space-y-4">
               {currentStep.insight ? (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                       <Repeat className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {currentStep.insight}
                    </p>
                  </div>
               ) : (
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center opacity-40">
                       <Repeat className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/40 tracking-wider">
                       Optimizing search space...
                    </p>
                  </div>
               )}

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-orange-600/60 uppercase">left height</span>
                      <span className="text-sm font-mono font-bold text-orange-600">{heights[currentStep.left]}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-blue-600/60 uppercase">right height</span>
                      <span className="text-sm font-mono font-bold text-blue-600">{heights[currentStep.right]}</span>
                  </div>
               </div>
            </div>
          </Card>
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
