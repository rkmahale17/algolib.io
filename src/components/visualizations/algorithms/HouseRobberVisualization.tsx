import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  rob1: number;
  rob2: number;
  currentMoney: number | null;
  temp: number | null;
  i: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
}

export const HouseRobberVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nums = [2, 7, 9, 3, 1];

  const code = `function rob(nums: number[]): number {
    // rob1 → maximum money robbed up to two houses before
    // rob2 → maximum money robbed up to the previous house
    let rob1 = 0;
    let rob2 = 0;

    // Iterate through each house
    for (const money of nums) {
        // If we rob this house:
        //   we add current money to rob1 (two houses back)
        // If we skip this house:
        //   we keep rob2 (previous best)
        const temp = Math.max(money + rob1, rob2);

        // Shift the window forward
        rob1 = rob2;
        rob2 = temp;
    }

    // rob2 always holds the best possible result
    return rob2;
}`;

  const steps = useMemo(() => {
    const steps: Step[] = [];
    let rob1 = 0;
    let rob2 = 0;
    
    // Initial state
    steps.push({
      nums,
      rob1: 0,
      rob2: 0,
      currentMoney: null,
      temp: null,
      i: -1,
      variables: { nums: `[${nums.join(', ')}]` },
      explanation: "Function started. Input houses array received.",
      highlightedLines: [1]
    });

    // Initialize variables
    steps.push({
      nums,
      rob1: 0,
      rob2: 0,
      currentMoney: null,
      temp: null,
      i: -1,
      variables: { rob1: 0, rob2: 0 },
      explanation: "Initialize rob1 = 0 (max money 2 houses back) and rob2 = 0 (max money 1 house back).",
      highlightedLines: [5, 6]
    });

    for (let i = 0; i < nums.length; i++) {
        const money = nums[i];

        // Loop start
        steps.push({
            nums,
            rob1,
            rob2,
            currentMoney: money,
            temp: null,
            i,
            variables: { money, rob1, rob2 },
            explanation: `Process house ${i} with money ${money}.`,
            highlightedLines: [9]
        });

        const robCurrent = money + rob1;
        const skipCurrent = rob2;
        const temp = Math.max(robCurrent, skipCurrent);

        // Calculate temp
        steps.push({
            nums,
            rob1,
            rob2,
            currentMoney: money,
            temp,
            i,
            variables: { money, rob1, rob2, 'money+rob1': robCurrent, 'skipCurrent': skipCurrent, temp },
            explanation: `Calculate temp = max(money + rob1, rob2) = max(${money} + ${rob1}, ${rob2}) = max(${robCurrent}, ${skipCurrent}) = ${temp}.`,
            highlightedLines: [14]
        });

        // Update pointers
        const prevRob1 = rob1;
        rob1 = rob2;
        steps.push({
            nums,
            rob1,
            rob2, // rob2 not updated yet
            currentMoney: money,
            temp,
            i,
            variables: { rob1 },
            explanation: `Shift rob1: rob1 becomes old rob2 (${rob1}).`,
            highlightedLines: [17]
        });

        rob2 = temp;
        steps.push({
            nums,
            rob1,
            rob2,
            currentMoney: money,
            temp,
            i,
            variables: { rob2 },
            explanation: `Shift rob2: rob2 becomes temp (${temp}).`,
            highlightedLines: [18]
        });
    }

    // Return result
    steps.push({
        nums,
        rob1,
        rob2,
        currentMoney: null,
        temp: null,
        i: nums.length,
        variables: { result: rob2 },
        explanation: `Loop finished. Return rob2 = ${rob2}.`,
        highlightedLines: [22]
    });

    return steps;
  }, [nums]);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <motion.div
            key={`houses-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Houses</h3>
              <div className="flex gap-2 flex-wrap">
                {step.nums.map((num, idx) => {
                    const isCurrent = idx === step.i;
                    // Visualize "rob1" relative position (2 houses back from current step i)
                    // At start of loop i, rob1 is accumulated from i-2. 
                    // But effectively it represents max up to that point. 
                    // Let's just highlight the current house being processed.
                    
                    return (
                        <div
                            key={idx}
                            className={`px-4 py-3 rounded font-mono text-center relative border-2 transition-all duration-300 ${
                            isCurrent
                                ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg'
                                : idx < step.i
                                ? 'bg-muted/50 border-muted text-muted-foreground'
                                : 'bg-card border-border'
                            }`}
                        >
                            <div className="text-[10px] uppercase tracking-wider mb-1 opacity-70">House {idx}</div>
                            <div className="font-bold text-lg">${num}</div>
                            {isCurrent && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[10px] px-1 rounded shadow">
                                    Current
                                </div>
                            )}
                        </div>
                    );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
              key={`vars-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
          >
              <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-500/10 border-blue-200">
                      <div className="text-xs text-blue-600 font-semibold mb-1">rob1 (2 houses back)</div>
                      <div className="text-2xl font-bold text-blue-700">{step.rob1}</div>
                  </Card>
                  <Card className="p-4 bg-green-500/10 border-green-200">
                      <div className="text-xs text-green-600 font-semibold mb-1">rob2 (Previous Best)</div>
                      <div className="text-2xl font-bold text-green-700">{step.rob2}</div>
                  </Card>
              </div>
          </motion.div>

          {step.temp !== null && (
               <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2"
               >
                   <Card className="p-4 border-dashed border-2 border-yellow-400 bg-yellow-50">
                       <div className="text-center">
                           <div className="text-xs text-muted-foreground mb-1">Decision: max(money + rob1, rob2)</div>
                           <div className="font-mono text-lg font-bold">
                               max({step.currentMoney} + {step.rob1}, {step.rob2}) = <span className="text-primary text-xl">{step.temp}</span>
                           </div>
                       </div>
                   </Card>
               </motion.div>
          )}

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50 mt-4">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Explanation:</div>
                <div className="text-sm bg-background/50 p-3 rounded">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div> */}
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
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
