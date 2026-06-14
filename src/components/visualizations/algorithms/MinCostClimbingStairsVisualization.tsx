import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Construction, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  cost: number[];
  originalCost: number[];
  i: number | null;
  lookAhead1: number | null;
  lookAhead2: number | null;
  finalAns: number | null;
  message: string;
  highlightedLines: number[];
}

export const MinCostClimbingStairsVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTestCase, setActiveTestCase] = useState(0);

  const code = `function minCostClimbingStairs(cost: number[]): number {
  cost.push(0);

  for (let i = cost.length - 3; i >= 0; i--) {
    cost[i] += Math.min(cost[i + 1], cost[i + 2]);
  }

  return Math.min(cost[0], cost[1]);
}`;

  const testCases = [
    { id: 'case1', name: 'Example 1', data: [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] },
    { id: 'case2', name: 'Example 2', data: [10, 15, 20] }
  ];

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const originalInput = [...testCases[activeTestCase].data];
    const cost = [...originalInput];

    stepsList.push({
      cost: [...cost],
      originalCost: [...originalInput],
      i: null, lookAhead1: null, lookAhead2: null, finalAns: null,
      message: `We start with our staircase costs. We can either start at index 0 or index 1, and our goal is to reach the "top" of the floor.`,
      highlightedLines: []
    });

    cost.push(0);
    const originalWithZero = [...cost];

    stepsList.push({
      cost: [...cost],
      originalCost: [...originalWithZero],
      i: null, lookAhead1: null, lookAhead2: null, finalAns: null,
      message: `We append a virtual step with cost 0 at the end. This represents the absolute top of the staircase that we need to reach.`,
      highlightedLines: [2]
    });

    for (let i = cost.length - 3; i >= 0; i--) {
      stepsList.push({
        cost: [...cost],
        originalCost: [...originalWithZero],
        i: i, lookAhead1: null, lookAhead2: null, finalAns: null,
        message: `Working backwards! We are now at step ${i}. We need to find the cheapest way to reach the top from here. We have two choices: jump 1 step or jump 2 steps.`,
        highlightedLines: [4]
      });

      stepsList.push({
        cost: [...cost],
        originalCost: [...originalWithZero],
        i: i, lookAhead1: i + 1, lookAhead2: null, finalAns: null,
        message: `Choice 1 (Jump 1 Step): If we jump 1 step, we land on step ${i + 1}. The minimum cost from step ${i + 1} to the top is ${cost[i + 1]}.`,
        highlightedLines: [5]
      });

      stepsList.push({
        cost: [...cost],
        originalCost: [...originalWithZero],
        i: i, lookAhead1: null, lookAhead2: i + 2, finalAns: null,
        message: `Choice 2 (Jump 2 Steps): If we jump 2 steps, we land on step ${i + 2}. The minimum cost from step ${i + 2} to the top is ${cost[i + 2]}.`,
        highlightedLines: [5]
      });

      const minAhead = Math.min(cost[i + 1], cost[i + 2]);
      
      stepsList.push({
        cost: [...cost],
        originalCost: [...originalWithZero],
        i: i, lookAhead1: i + 1, lookAhead2: i + 2, finalAns: null,
        message: `Comparing the choices: ${cost[i + 1]} vs ${cost[i + 2]}. The cheaper path is ${minAhead}! We will confidently choose this optimal path.`,
        highlightedLines: [5]
      });

      cost[i] += minAhead;

      stepsList.push({
        cost: [...cost],
        originalCost: [...originalWithZero],
        i: i, lookAhead1: i + 1, lookAhead2: i + 2, finalAns: null,
        message: `We add the optimal path cost (${minAhead}) to our current step's base cost (${originalWithZero[i]}). The absolute minimum cost to reach the top starting from step ${i} is now recorded as ${cost[i]}!`,
        highlightedLines: [5]
      });
    }

    const finalResult = Math.min(cost[0], cost[1]);

    stepsList.push({
      cost: [...cost],
      originalCost: [...originalWithZero],
      i: null, lookAhead1: 0, lookAhead2: 1, finalAns: finalResult,
      message: `We've calculated the minimum cost from every step to the top. Since we can start at step 0 or 1, we just return the minimum of cost[0] (${cost[0]}) and cost[1] (${cost[1]}). The answer is ${finalResult}!`,
      highlightedLines: [8]
    });

    return stepsList;
  }, [activeTestCase]);

  const step = steps[currentStep];

  const renderStairs = () => {
    return (
      <div className="flex items-end justify-center w-full min-h-[200px] gap-1 sm:gap-2 px-2 overflow-x-auto pb-4">
        {step.cost.map((val, idx) => {
          const isVirtualTop = idx === step.cost.length - 1;
          const isCurrent = step.i === idx;
          const isLookAhead1 = step.lookAhead1 === idx;
          const isLookAhead2 = step.lookAhead2 === idx;
          const isFinalCompare = step.finalAns !== null && (idx === 0 || idx === 1);
          
          let bgColor = "bg-muted";
          let borderColor = "border-border";
          let textColor = "text-foreground";
          
          if (isVirtualTop) {
            bgColor = "bg-green-500/20";
            borderColor = "border-green-500/50";
            textColor = "text-green-600 dark:text-green-400";
          }
          
          if (isCurrent) {
            bgColor = "bg-primary text-primary-foreground";
            borderColor = "border-primary";
            textColor = "text-primary-foreground";
          } else if (isLookAhead1 || isLookAhead2 || isFinalCompare) {
            bgColor = "bg-amber-500/20";
            borderColor = "border-amber-500 ring-2 ring-amber-500 ring-offset-2";
            textColor = "text-amber-700 dark:text-amber-400 font-bold";
          }

          // Calculate height progressively. 
          // Base height + increments.
          // Example 2 has 10 steps, so we need to keep the height scaling reasonable.
          const stepHeight = 40 + (idx * (150 / step.cost.length));

          return (
            <div key={idx} className="flex flex-col items-center flex-1 min-w-[30px] max-w-[60px]">
              <span className="text-[10px] font-mono text-muted-foreground mb-1">
                {isVirtualTop ? 'Top' : idx}
              </span>
              
              {/* Dynamic Value */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`val-${val}`}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-xs sm:text-sm font-bold mb-1 ${textColor}`}
                >
                  {val}
                </motion.div>
              </AnimatePresence>

              {/* Stair block */}
              <motion.div
                layout
                className={`w-full rounded-t-sm border-t-2 border-l-2 border-r-2 transition-colors duration-300 ${bgColor} ${borderColor} shadow-sm relative`}
                style={{ height: `${stepHeight}px` }}
              >
                {/* Original Cost Marker */}
                {!isVirtualTop && step.originalCost && (
                  <div className="absolute bottom-1 w-full text-center text-[9px] opacity-50">
                    +{step.originalCost[idx]}
                  </div>
                )}
                {isVirtualTop && (
                   <div className="absolute inset-0 flex items-center justify-center">
                     <CheckCircle2 size={16} className="text-green-500 opacity-60" />
                   </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          
          <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50 shrink-0">
            {testCases.map((tc, idx) => (
              <button
                key={tc.id}
                onClick={() => { setActiveTestCase(idx); setCurrentStep(0); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all relative ${
                  activeTestCase === idx 
                    ? 'text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTestCase === idx && (
                  <motion.div
                    layoutId="active-case-bg"
                    className="absolute inset-0 bg-primary rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tc.name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 opacity-90 flex items-center gap-2">
              <Construction size={16} className="text-primary" />
              Min Cost Climbing Stairs
            </h2>
            <Card className="p-4 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden flex flex-col justify-end items-center pt-8">
              {renderStairs()}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="p-4 bg-primary/5 border-l-4 border-primary shadow-sm h-full flex flex-col justify-center">
               <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mb-2">Commentary</h4>
               <p className="text-[13px] font-medium leading-relaxed text-foreground/90">
                 {step.message}
               </p>
             </Card>
             
             <Card className="p-4 bg-muted/30 border-muted">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  Legend
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded border border-primary"></div>
                    <span>Current Step Being Calculated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500/20 rounded border-2 border-amber-500"></div>
                    <span>Look-Ahead Choices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500/20 rounded border border-green-500"></div>
                    <span>Virtual Top (Cost 0)</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 italic">
                    * The number at the top of the stair is the total minimum cost from that step to the top. The small number at the bottom is the original base cost of that step.
                  </p>
                </div>
             </Card>
          </div>

          <VariablePanel
            variables={{
              "current step (i)": step.i !== null ? step.i : "N/A",
              "1 step ahead (i+1)": step.lookAhead1 !== null ? step.lookAhead1 : "N/A",
              "2 steps ahead (i+2)": step.lookAhead2 !== null ? step.lookAhead2 : "N/A",
              "final min cost": step.finalAns !== null ? step.finalAns : "Pending",
            }}
          />
        </div>
      }
      rightContent={
        <Card className="h-full overflow-hidden flex flex-col shadow-sm border-border/50">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={step.highlightedLines}
          />
        </Card>
      }
    />
  );
};
