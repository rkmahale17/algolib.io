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
  Search, 
  MoveRight, 
  Info,
  Hash,
  MoveLeft
} from 'lucide-react';

interface Step {
  array: number[];
  i: number;
  left: number;
  right: number;
  currentSum: number | '-';
  target: number | '-';
  result: number[][];
  message: string;
  lineNumber: number;
  phase: 'sorting' | 'loop' | 'check-dupe' | 'pointers-init' | 'calc-sum' | 'match' | 'move' | 'skip-dupe' | 'done';
  highlights: number[];
  insight?: string;
  isMatch?: boolean;
}

export const ThreeSumVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`;

  const steps: Step[] = useMemo(() => {
    const nums = [-1, 0, 1, 2, -1, -4];
    const s: Step[] = [];
    
    // Initial State
    s.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [],
      message: "The 3Sum problem asks for all unique triplets that sum to zero. Our first step is to sort the input array.",
      lineNumber: 2,
      phase: 'sorting',
      highlights: [],
      insight: "Sorting is crucial because it allows us to use the Two-Pointer approach and easily skip duplicate elements."
    });

    // Sort
    nums.sort((a, b) => a - b);
    s.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [],
      message: `Array sorted: [${nums.join(', ')}]. Now we can use one fixed element (i) and search for the other two using pointers.`,
      lineNumber: 3,
      phase: 'sorting',
      highlights: []
    });

    const result: number[][] = [];

    for (let i = 0; i < nums.length - 2; i++) {
      // Loop Check i
      s.push({
        array: [...nums],
        i,
        left: -1,
        right: -1,
        currentSum: '-',
        target: 0,
        result: [...result.map(r => [...r])],
        message: `Outer loop iteration: i = ${i}, nums[i] = ${nums[i]}.`,
        lineNumber: 5,
        phase: 'loop',
        highlights: [i]
      });

      if (i > 0 && nums[i] === nums[i - 1]) {
        s.push({
          array: [...nums],
          i,
          left: -1,
          right: -1,
          currentSum: '-',
          target: 0,
          result: [...result.map(r => [...r])],
          message: `nums[${i}] (${nums[i]}) is the same as nums[${i - 1}]. Skip it to avoid duplicate triplets.`,
          lineNumber: 6,
          phase: 'check-dupe',
          highlights: [i, i - 1],
          insight: "If we use the same starting element again, we would find exactly the same triplets we already found."
        });
        continue;
      }

      let left = i + 1;
      let right = nums.length - 1;

      s.push({
        array: [...nums],
        i,
        left,
        right,
        currentSum: '-',
        target: 0,
        result: [...result.map(r => [...r])],
        message: `Initialize pointers: left = ${left} (after i), right = ${right} (end of array).`,
        lineNumber: 8,
        phase: 'pointers-init',
        highlights: [i, left, right]
      });

      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];

        s.push({
          array: [...nums],
          i,
          left,
          right,
          currentSum: sum,
          target: 0,
          result: [...result.map(r => [...r])],
          message: `Calculating sum: ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`,
          lineNumber: 10,
          phase: 'calc-sum',
          highlights: [i, left, right]
        });

        if (sum === 0) {
          result.push([nums[i], nums[left], nums[right]]);
          
          s.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: sum,
            target: 0,
            result: [...result.map(r => [...r])],
            message: `Match found! [${nums[i]}, ${nums[left]}, ${nums[right]}] sums to 0. Added to result.`,
            lineNumber: 12,
            phase: 'match',
            highlights: [i, left, right],
            isMatch: true,
            insight: "One triplet found. Now we need to skip any identical values for 'left' and 'right' to maintain uniqueness."
          });

          // Skip duplicate lefts
          if (left < right && nums[left] === nums[left + 1]) {
            s.push({
              array: [...nums],
              i,
              left,
              right,
              currentSum: sum,
              target: 0,
              result: [...result.map(r => [...r])],
              message: `nums[${left}] is ${nums[left]}, and the next is also ${nums[left + 1]}. Skipping...`,
              lineNumber: 13,
              phase: 'skip-dupe',
              highlights: [left, left + 1]
            });
            while (left < right && nums[left] === nums[left + 1]) left++;
          }

          // Skip duplicate rights
          if (left < right && nums[right] === nums[right - 1]) {
             s.push({
              array: [...nums],
              i,
              left,
              right,
              currentSum: sum,
              target: 0,
              result: [...result.map(r => [...r])],
              message: `nums[${right}] is ${nums[right]}, and the previous was also ${nums[right - 1]}. Skipping...`,
              lineNumber: 14,
              phase: 'skip-dupe',
              highlights: [right, right - 1]
            });
            while (left < right && nums[right] === nums[right - 1]) right--;
          }

          left++;
          right--;

          s.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: '-',
            target: 0,
            result: [...result.map(r => [...r])],
            message: `Advanced both pointers to search for more pairs.`,
            lineNumber: 15,
            phase: 'move',
            highlights: [i, left, right]
          });

        } else if (sum < 0) {
          s.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: sum,
            target: 0,
            result: [...result.map(r => [...r])],
            message: `Sum (${sum}) is less than zero. Since the array is sorted, we need a larger value. Move 'left' inward.`,
            lineNumber: 17,
            phase: 'move',
            highlights: [i, left, right],
            insight: "Increasing 'left' increases the total sum in a sorted array."
          });
          left++;
        } else {
          s.push({
            array: [...nums],
            i,
            left,
            right,
            currentSum: sum,
            target: 0,
            result: [...result.map(r => [...r])],
            message: `Sum (${sum}) is greater than zero. Since the array is sorted, we need a smaller value. Move 'right' inward.`,
            lineNumber: 19,
            phase: 'move',
            highlights: [i, left, right],
            insight: "Decreasing 'right' decreases the total sum in a sorted array."
          });
          right--;
        }
      }
    }

    s.push({
      array: [...nums],
      i: -1,
      left: -1,
      right: -1,
      currentSum: '-',
      target: '-',
      result: [...result.map(r => [...r])],
      message: `Execution finished. Found ${result.length} unique triplets.`,
      lineNumber: 23,
      phase: 'done',
      highlights: [],
      insight: "The Two-Pointer approach allowed us to solve this in O(n²) time complexity."
    });

    return s;
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-8">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[480px] flex flex-col shadow-lg shadow-primary/5">
            {/* Header Info */}
            <div className="flex justify-between items-center mb-12">
               <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Search className="w-3 h-3 text-primary" />
                Three-Pointers Search
              </h3>
              <div className="flex gap-4 items-center">
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Repeat className="w-3 h-3" />
                    Phase: {currentStep.phase.replace('-', ' ')}
                 </div>
              </div>
            </div>

            {/* Pointer Visualization */}
            <div className="flex-1 flex justify-center items-center pb-12">
               <div className="relative flex justify-center items-center gap-4">
                  <div className="flex items-center gap-4 relative z-10">
                    <AnimatePresence mode="popLayout">
                      {currentStep.array.map((value, index) => {
                        const isI = index === currentStep.i;
                        const isL = index === currentStep.left;
                        const isR = index === currentStep.right;
                        const isHighlighted = currentStep.highlights.includes(index);
                        
                        return (
                          <div key={index} className="flex flex-col items-center w-8 relative group">
                            {/* Top Pointer Labels */}
                            <div className="h-10 relative w-full mb-2">
                               <AnimatePresence>
                                  {isI && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute -top-2 left-1/2 flex flex-col items-center gap-1"
                                      style={{ left: '50%', transform: 'translateX(-50%)' }}
                                    >
                                      <span className="px-1 py-0.5 rounded-sm bg-orange-500 text-[8px] font-bold text-white shadow-md">i</span>
                                      <div className="w-0.5 h-1.5 bg-orange-500/50" />
                                    </motion.div>
                                  )}
                                  {isL && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute -top-2 left-1/2 flex flex-col items-center gap-1"
                                      style={{ left: '50%', transform: 'translateX(-50%)' }}
                                    >
                                      <span className="px-1 py-0.5 rounded-sm bg-green-500 text-[8px] font-bold text-white shadow-md">L</span>
                                      <div className="w-0.5 h-1.5 bg-green-500/50" />
                                    </motion.div>
                                  )}
                                  {isR && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute -top-2 left-1/2 flex flex-col items-center gap-1"
                                      style={{ left: '50%', transform: 'translateX(-50%)' }}
                                    >
                                      <span className="px-1 py-0.5 rounded-sm bg-blue-500 text-[8px] font-bold text-white shadow-md">R</span>
                                      <div className="w-0.5 h-1.5 bg-blue-500/50" />
                                    </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>

                            {/* Value Box */}
                            <motion.div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 z-30 transition-all duration-300 ${
                                isHighlighted
                                  ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-xl shadow-primary/30'
                                  : 'bg-muted/50 border-border text-foreground hover:bg-muted'
                              } ${isI && 'border-orange-500/50 shadow-lg shadow-orange-500/10'} ${isL && 'border-green-500/50'} ${isR && 'border-blue-500/50'}`}
                              animate={{
                                scale: isHighlighted ? 1.1 : 1,
                              }}
                            >
                              {value}
                            </motion.div>

                            <div className="mt-4 text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                              IDX {index}
                            </div>
                          </div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-auto pt-6 border-t border-border/40">
              <div className="flex flex-col items-center p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-[9px] font-bold text-blue-600 uppercase mb-0.5">currentSum</span>
                <span className="text-base font-black text-blue-600 font-mono">{currentStep.currentSum}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-primary/5 border border-primary/10">
                <span className="text-[9px] font-bold text-primary uppercase mb-0.5 flex items-center gap-1">
                   <Target className="w-2 h-2" /> target
                </span>
                <span className="text-base font-black text-primary font-mono">{currentStep.target}</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <span className="text-[9px] font-bold text-indigo-600 uppercase mb-0.5">triplets</span>
                <span className="text-base font-black text-indigo-600 font-mono">{currentStep.result.length}</span>
              </div>
            </div>
          </Card>

          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[120px] flex items-center ${currentStep.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${currentStep.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {currentStep.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                   Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90 leading-tight">
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

          <Card className="p-5 bg-card border border-border/50 shadow-sm">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-3">
              <Zap className="w-3 h-3 text-primary" />
              Computational Insight
            </h4>
            
            <div className="space-y-3">
               {currentStep.insight ? (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary">
                       <Repeat className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      {currentStep.insight}
                    </p>
                  </div>
               ) : (
                  <div className="p-3 rounded-xl bg-muted/20 border border-border/40 flex flex-col items-center justify-center gap-1.5 py-6 text-center">
                    <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center opacity-40">
                       <Repeat className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground/40 tracking-wider">
                       Searching for matches...
                    </p>
                  </div>
               )}

               <div className="grid grid-cols-2 gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/5 border border-orange-500/10 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-orange-600/60 uppercase">fixed (i)</span>
                      <span className="text-xs font-mono font-bold text-orange-600">{currentStep.i === -1 ? 'N/A' : currentStep.array[currentStep.i]}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-green-500/5 border border-green-500/10 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-green-600/60 uppercase">left (L)</span>
                      <span className="text-xs font-mono font-bold text-green-600">{currentStep.left === -1 ? 'N/A' : currentStep.array[currentStep.left]}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-blue-600/60 uppercase">right (R)</span>
                      <span className="text-xs font-mono font-bold text-blue-600">{currentStep.right === -1 ? 'N/A' : currentStep.array[currentStep.right]}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10 flex justify-between items-center">
                      <span className="text-[9px] font-bold text-primary/60 uppercase flex items-center gap-1">
                        <Hash className="w-2 h-2" /> results
                      </span>
                      <span className="text-xs font-mono font-bold text-primary">{currentStep.result.length}</span>
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
