import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Scale, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  dp: boolean[];
  nums: number[];
  currentNumIdx: number;
  currentSum: number | null;
  target: number | null;
  totalSum: number;
  message: string;
  highlightedLines: number[];
}

export const PartitionEqualSubsetVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTestCase, setActiveTestCase] = useState(0);

  const code = `function canPartition(nums: number[]): boolean {
  const total = nums.reduce((sum, num) => sum + num, 0);

  if (total % 2 !== 0) {
    return false;
  }

  const target = total / 2;
  const dp: boolean[] = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }

  return dp[target];
}`;

  const testCases = [
    { id: 'case1', name: 'Example 1 (Possible)', nums: [1, 5, 11, 5] },
    { id: 'case2', name: 'Example 2 (Odd Sum)', nums: [1, 2, 3, 5] }
  ];

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const nums = testCases[activeTestCase].nums;
    const total = nums.reduce((a, b) => a + b, 0);

    stepsList.push({
      dp: [], nums, currentNumIdx: -1, currentSum: null, target: null, totalSum: total,
      message: `First, we calculate the total sum of all numbers. The sum of [${nums.join(', ')}] is ${total}.`,
      highlightedLines: [2]
    });

    if (total % 2 !== 0) {
      stepsList.push({
        dp: [], nums, currentNumIdx: -1, currentSum: null, target: null, totalSum: total,
        message: `The total sum ${total} is an odd number. It's mathematically impossible to divide an odd sum into two equal integer halves. We instantly return false.`,
        highlightedLines: [4, 5]
      });
      return stepsList;
    }

    const target = total / 2;
    stepsList.push({
      dp: [], nums, currentNumIdx: -1, currentSum: null, target, totalSum: total,
      message: `The total sum is even (${total}). We need to find if ANY subset of numbers adds up to exactly exactly half of it (${target}). If we can form ${target}, the remaining numbers naturally form the other half!`,
      highlightedLines: [8]
    });

    const dp = new Array(target + 1).fill(false);
    dp[0] = true;

    stepsList.push({
      dp: [...dp], nums, currentNumIdx: -1, currentSum: null, target, totalSum: total,
      message: `We initialize a Dynamic Programming (DP) array up to our target (${target}). We set dp[0] to true, because a sum of 0 is always achievable by picking no numbers.`,
      highlightedLines: [9, 10]
    });

    for (let idx = 0; idx < nums.length; idx++) {
      const num = nums[idx];
      
      stepsList.push({
        dp: [...dp], nums, currentNumIdx: idx, currentSum: null, target, totalSum: total,
        message: `We now pick the number ${num}. We will iterate backwards from our target down to ${num} to see what new sums we can form by adding ${num} to previously reachable sums.`,
        highlightedLines: [12]
      });

      for (let s = target; s >= num; s--) {
        const canReachWithoutNum = dp[s];
        const canReachWithNum = dp[s - num];
        
        stepsList.push({
          dp: [...dp], nums, currentNumIdx: idx, currentSum: s, target, totalSum: total,
          message: `Checking if we can form sum ${s}... We look back at dp[${s} - ${num}] (which is dp[${s - num}]). Is it reachable?`,
          highlightedLines: [13, 14]
        });

        if (canReachWithNum && !canReachWithoutNum) {
          dp[s] = true;
          stepsList.push({
            dp: [...dp], nums, currentNumIdx: idx, currentSum: s, target, totalSum: total,
            message: `Yes! We previously formed the sum ${s - num}. By adding our current number ${num}, we can now reach the sum ${s}! We update dp[${s}] to true.`,
            highlightedLines: [14]
          });
        } else if (canReachWithoutNum) {
          stepsList.push({
            dp: [...dp], nums, currentNumIdx: idx, currentSum: s, target, totalSum: total,
            message: `The sum ${s} was already reachable from previous numbers. We just keep it true.`,
            highlightedLines: [14]
          });
        }
      }
    }

    stepsList.push({
      dp: [...dp], nums, currentNumIdx: -1, currentSum: null, target, totalSum: total,
      message: `We've considered all numbers. We check our final goal: dp[${target}]. It is ${dp[target]}, so we return ${dp[target]}!`,
      highlightedLines: [18]
    });

    return stepsList;
  }, [activeTestCase]);

  const step = steps[currentStep];

  const renderDPArray = () => {
    if (step.dp.length === 0) return (
      <div className="flex items-center justify-center h-48 w-full text-muted-foreground italic">
        DP array not yet initialized
      </div>
    );

    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {step.dp.map((isReachable, idx) => {
          const currentNum = step.currentNumIdx >= 0 ? step.nums[step.currentNumIdx] : null;
          const isCurrentSum = step.currentSum === idx;
          const isLookbackSum = step.currentSum !== null && currentNum !== null && idx === step.currentSum - currentNum;
          
          let borderColor = "border-border";
          let bgColor = "bg-muted";
          let textColor = "text-muted-foreground";
          let label = "F";

          if (isReachable) {
            borderColor = "border-green-500/50";
            bgColor = "bg-green-500/10";
            textColor = "text-green-500";
            label = "T";
          }

          if (isCurrentSum) {
            borderColor = "border-primary ring-2 ring-primary ring-offset-2";
          } else if (isLookbackSum) {
            borderColor = "border-amber-500 ring-2 ring-amber-500 ring-offset-1";
            textColor = "text-amber-600 dark:text-amber-400 font-bold";
          }

          return (
            <motion.div
              key={idx}
              layout
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[10px] font-mono text-muted-foreground">{idx}</span>
              <motion.div
                className={`w-10 h-10 rounded flex items-center justify-center font-bold border-2 transition-colors ${borderColor} ${bgColor} ${textColor}`}
                animate={isCurrentSum ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {label}
              </motion.div>
            </motion.div>
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
          
          <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
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
              <Scale size={16} className="text-primary" />
              Partition Equal Subset Sum
            </h2>
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden min-h-[220px]">
              <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <Database size={14} />
                  DP Array State
                </span>
                {step.target !== null && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">Target: {step.target}</span>
                )}
              </div>
              {renderDPArray()}
              
              <div className="mt-6 flex justify-center gap-6 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></div>
                  <span>Reachable (True)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted border border-border"></div>
                  <span>Unreachable (False)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-primary ring-1 ring-primary ring-offset-1"></div>
                  <span>Current Target Sum (s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border-2 border-amber-500 ring-1 ring-amber-500 ring-offset-1"></div>
                  <span>Lookback Sum (s - num)</span>
                </div>
              </div>
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
                  Input Numbers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {step.nums.map((num, idx) => {
                    const isCurrent = step.currentNumIdx === idx;
                    const isProcessed = step.currentNumIdx > idx;
                    return (
                      <motion.div 
                        key={`${num}-${idx}`}
                        className={`p-2 rounded border shadow-sm min-w-[35px] text-center transition-colors ${
                          isCurrent 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : isProcessed 
                              ? 'bg-muted border-border text-muted-foreground opacity-50' 
                              : 'bg-background border-border text-foreground'
                        }`}
                      >
                        <span className="text-[12px] font-bold">{num}</span>
                      </motion.div>
                    );
                  })}
                </div>
             </Card>
          </div>

          <VariablePanel
            variables={{
              totalSum: step.totalSum,
              targetSum: step.target !== null ? step.target : "N/A",
              "current number (num)": step.currentNumIdx >= 0 ? step.nums[step.currentNumIdx] : "N/A",
              "current sum check (s)": step.currentSum !== null ? step.currentSum : "N/A",
              "lookback sum (s - num)": (step.currentSum !== null && step.currentNumIdx >= 0) ? step.currentSum - step.nums[step.currentNumIdx] : "N/A",
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
