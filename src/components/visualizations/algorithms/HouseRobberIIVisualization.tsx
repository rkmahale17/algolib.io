import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  nums: number[];
  range: string;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const HouseRobberIIVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nums = [2, 3, 2];

  const code = `function rob(nums: number[]): number {
    // Edge case: only one house
    if (nums.length === 1) return nums[0];

    // Helper function that follows rob1 / rob2 logic
    const robLinear = (start: number, end: number): number => {
        let rob1 = 0;
        let rob2 = 0;

        for (let i = start; i <= end; i++) {
            // Same logic as screenshot
            const temp = Math.max(rob1 + nums[i], rob2);
            rob1 = rob2;
            rob2 = temp;
        }

        return rob2;
    };

    // Two valid cases due to circular houses
    const case1 = robLinear(0, nums.length - 2);
    const case2 = robLinear(1, nums.length - 1);

    return Math.max(case1, case2);
}`;

  const steps = useMemo(() => {
    const steps: Step[] = [];
    
    // Initial Step
    steps.push({
      nums,
      range: "",
      variables: { nums: `[${nums.join(', ')}]`, length: nums.length },
      explanation: "Start execution. We have circular houses.",
      highlightedLines: [1],
      lineExecution: "function rob(nums: number[]): number"
    });

    // Edge case check
    steps.push({
      nums,
      range: "",
      variables: { length: nums.length },
      explanation: `Check if there is only one house. ${nums.length} === 1 is false.`,
      highlightedLines: [3],
      lineExecution: "if (nums.length === 1) return nums[0];"
    });

    // Helper definition (conceptual)
    steps.push({
      nums,
      range: "",
      variables: {},
      explanation: "Define the helper function 'robLinear' which solves the linear House Robber problem.",
      highlightedLines: [6],
      lineExecution: "const robLinear = (start: number, end: number): number => {"
    });

    // robLinear Simulation Logic
    const simulateRobLinear = (start: number, end: number, caseName: string) => {
      let rob1 = 0;
      let rob2 = 0;
      const rangeStr = `[${start}..${end}]`;

      // Call Step
      steps.push({
        nums,
        range: rangeStr,
        variables: { start, end, [caseName]: 'pending' },
        explanation: `Start ${caseName}: robLinear(${start}, ${end}). This covers houses from index ${start} to ${end}.`,
        highlightedLines: caseName === 'case1' ? [21] : [22],
        lineExecution: `const ${caseName} = robLinear(${start}, nums.length - ${caseName === 'case1' ? 2 : 1});`
      });

      // Init variables
      steps.push({
        nums,
        range: rangeStr,
        variables: { rob1, rob2, start, end },
        explanation: "Initialize rob1 = 0, rob2 = 0.",
        highlightedLines: [7, 8],
        lineExecution: "let rob1 = 0; let rob2 = 0;"
      });

      for (let i = start; i <= end; i++) {
        // Loop Start
        steps.push({
            nums,
            range: rangeStr,
            variables: { i, start, end, rob1, rob2 },
            explanation: `Loop iteration i=${i}. Current house value is ${nums[i]}.`,
            highlightedLines: [10],
            lineExecution: `for (let i = ${start}; i <= ${end}; i++)` // conceptually
        });

        const currentVal = nums[i];
        const valWithRob1 = rob1 + currentVal;
        const temp = Math.max(valWithRob1, rob2);

        // Temp calc
        steps.push({
            nums,
            range: rangeStr,
            variables: { i, rob1, rob2, 'nums[i]': currentVal, temp },
            explanation: `Calculate temp = max(rob1 + nums[i], rob2) = max(${rob1} + ${currentVal}, ${rob2}) = ${temp}.`,
            highlightedLines: [12],
            lineExecution: "const temp = Math.max(rob1 + nums[i], rob2);"
        });

        const oldRob2 = rob2;
        rob1 = oldRob2;
        rob2 = temp;

        // Update vars
        steps.push({
            nums,
            range: rangeStr,
            variables: { i, rob1, rob2, temp },
            explanation: `Update rob1 = rob2 (${oldRob2}), rob2 = temp (${temp}).`,
            highlightedLines: [13, 14],
            lineExecution: "rob1 = rob2; rob2 = temp;"
        });
      }

      // Return
      steps.push({
        nums,
        range: rangeStr,
        variables: { rob2 },
        explanation: `Finished loop. Return rob2 (${rob2}) as the result for ${caseName}.`,
        highlightedLines: [17],
        lineExecution: "return rob2;"
      });

      return rob2;
    };

    // Case 1
    const res1 = simulateRobLinear(0, nums.length - 2, 'case1');

    // Case 2
    const res2 = simulateRobLinear(1, nums.length - 1, 'case2');

    // Final Comparison
    const finalMax = Math.max(res1, res2);
    steps.push({
      nums,
      range: "both",
      variables: { case1: res1, case2: res2, result: finalMax },
      explanation: `Compare case1 (${res1}) and case2 (${res2}). The maximum is ${finalMax}.`,
      highlightedLines: [24],
      lineExecution: "return Math.max(case1, case2);"
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
              <h3 className="text-sm font-semibold mb-3">Houses in Circle</h3>
              <div className="flex gap-2 flex-wrap items-center">
                {step.nums.map((num, idx) => {
                    // Determine if active based on range string [start..end]
                    let isActive = false;
                    if (step.range.startsWith('[')) {
                        const parts = step.range.slice(1, -1).split('..');
                        const s = parseInt(parts[0]);
                        const e = parseInt(parts[1]);
                        if (idx >= s && idx <= e) isActive = true;
                    }
                    
                    return (
                      <div
                        key={idx}
                        className={`px-4 py-3 rounded font-mono text-center ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-xs">House {idx}</div>
                        <div className="font-bold">${num}</div>
                      </div>
                    );
                })}
                <div className="text-xl">🔄</div>
              </div>
              {step.range && step.range !== 'both' && (
                <div className="text-xs mt-2 text-muted-foreground">
                  Current range: {step.range}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
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
