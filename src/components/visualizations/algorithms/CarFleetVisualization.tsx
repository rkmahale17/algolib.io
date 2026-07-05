import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface CarState {
  id: number;
  position: number;
  speed: number;
  timeToTarget: number;
}

interface Step {
  cars: CarState[];
  sortedCars: CarState[];
  stack: number[];
  fleetsCount: number;
  activeCarIdx: number | null;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
  phase: 'init' | 'sort' | 'calc_time' | 'check_loop' | 'evaluate' | 'push' | 'merge_check' | 'merge_action' | 'done';
}

const languages: VisualizationLanguageMap = {
  typescript: `function carFleet(target: number, position: number[], speed: number[]): number {
  const pair: number[][] = position.map((p, i) => [p, speed[i]]);
  const stack: number[] = [];
  for (const [p, s] of pair.sort((a, b) => a[0] - b[0]).reverse()) {
    const timeToTarget = (target - p) / s;
    stack.push(timeToTarget);
    if (stack.length >= 2 && stack[stack.length - 1] <= stack[stack.length - 2]) {
      stack.pop();
    }
  }
  return stack.length;
}`,
  python: `def carFleet(target: int, position: list[int], speed: list[int]) -> int:
    pair = sorted(zip(position, speed)) 
    times = [float(target - p) / s for p, s in pair] 
    fleet = 0
    curr_max_time = 0.0
    for time in reversed(times):
        if time > curr_max_time:
            fleet += 1
            curr_max_time = time
    return fleet`,
  java: `public static class Solution {
    public int carFleet(int target, int[] position, int[] speed) {
        int n = position.length;
        double[][] pair = new double[n][2];
        for (int i = 0; i < n; i++) {
            pair[i][0] = position[i];
            pair[i][1] = speed[i];
        }
        java.util.Arrays.sort(pair, (a, b) -> Double.compare(a[0], b[0]));
        java.util.Stack<Double> stack = new java.util.Stack<>();
        for (int i = n - 1; i >= 0; i--) {
            double p = pair[i][0];
            double s = pair[i][1];
            double time = (target - p) / s;
            stack.push(time);
            if (stack.size() >= 2 && stack.peek() <= stack.get(stack.size() - 2)) {
                stack.pop();
            }
        }
        return stack.size();
    }
}`,
  cpp: `class Solution {
public:
    int carFleet(int target, vector<int>& position, vector<int>& speed) {       
        int n = position.size();
        vector<pair<int, double>> cars;
        for (int i = 0; i < n; ++i) {
            cars.push_back({position[i], (double)(target - position[i]) / speed[i]});
        }
        sort(cars.begin(), cars.end());
        int fleets = 0;
        double slowestTime = 0.0;
        for (int i = n - 1; i >= 0; --i) {
            double time = cars[i].second;
            if (time > slowestTime) {
                fleets++;
                slowestTime = time;
            }
        }
        return fleets;
    }
};`
};

export const CarFleetVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const target = 12;
  const initialPositions = useMemo(() => [10, 8, 0, 5, 3], []);
  const initialSpeeds = useMemo(() => [2, 4, 1, 1, 3], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const stack: number[] = [];

    const cars: CarState[] = initialPositions.map((pos, idx) => ({
      id: idx,
      position: pos,
      speed: initialSpeeds[idx],
      timeToTarget: (target - pos) / initialSpeeds[idx]
    }));

    const sortedCars = [...cars].sort((a, b) => a.position - b.position);

    const addStep = (
      activeCarIdx: number | null,
      explanation: string,
      pseudo: string,
      vars: any,
      phase: Step['phase'],
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        cars,
        sortedCars,
        stack: [...stack],
        fleetsCount: stack.length,
        activeCarIdx,
        message: explanation,
        pseudoStep: pseudo,
        variables: vars,
        phase
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // Step 0: init
    addStep(
      null,
      `Initialize car fleet calculation. Target is ${target}.`,
      `carFleet(target=${target})`,
      { target, position: `[${initialPositions.join(', ')}]`, speed: `[${initialSpeeds.join(', ')}]` },
      'init',
      1, 1, 2, 3
    );

    // Step 1: Zip & sort
    addStep(
      null,
      `Sort cars ascending by position: [${sortedCars.map(c => `(pos: ${c.position}, speed: ${c.speed})`).join(', ')}].`,
      "pair.sort()",
      { sortedCars: sortedCars.map(c => `[${c.position}, ${c.speed}]`) },
      'sort',
      2, 2, 9, 9
    );

    // Step 2: Init stack
    addStep(
      null,
      "Initialize empty stack to hold the arrival times of fleet leaders.",
      "SET stack = []",
      { stack: "[]" },
      'init',
      3, 4, 10, 10
    );

    // Process from right to left (closest to target)
    for (let idx = sortedCars.length - 1; idx >= 0; idx--) {
      const car = sortedCars[idx];
      
      addStep(
        idx,
        `Evaluate next car from right: Position ${car.position}, Speed ${car.speed}.`,
        `FOR car IN sorted(cars).reverse()  →  car = (pos: ${car.position}, speed: ${car.speed})`,
        { position: car.position, speed: car.speed, timeToTarget: car.timeToTarget, stack: `[${stack.join(', ')}]` },
        'check_loop',
        4, 6, 11, 12
      );

      addStep(
        idx,
        `Calculate time to reach target: (${target} - ${car.position}) / ${car.speed} = ${car.timeToTarget} hours.`,
        `SET timeToTarget = (${target} - ${car.position}) / ${car.speed}  →  ${car.timeToTarget}`,
        { position: car.position, speed: car.speed, timeToTarget: car.timeToTarget },
        'calc_time',
        5, 6, 14, 13
      );

      stack.push(car.timeToTarget);
      addStep(
        idx,
        `Push arrival time ${car.timeToTarget} onto stack. Stack: [${stack.join(', ')}].`,
        `stack.push(${car.timeToTarget})`,
        { time: car.timeToTarget, stack: `[${stack.join(', ')}]` },
        'push',
        6, 7, 15, 14
      );

      addStep(
        idx,
        `Check if this car catches up with the one in front of it: Compare ${car.timeToTarget} <= previous leader time ${stack[stack.length - 2] ?? 'N/A'}.`,
        `IF stack.length >= 2 AND stack[last] <= stack[second_last]  →  ${stack[stack.length - 1]} <= ${stack[stack.length - 2] ?? '?'}`,
        { "last time": stack[stack.length - 1], "second last time": stack[stack.length - 2] ?? 'N/A' },
        'merge_check',
        7, 7, 16, 14
      );

      if (stack.length >= 2 && stack[stack.length - 1] <= stack[stack.length - 2]) {
        stack.pop();
        addStep(
          idx,
          `Since arrival time ${car.timeToTarget} <= ${stack[stack.length - 1]}, this car catches up and joins the leading fleet. Pop it from the stack.`,
          "stack.pop()",
          { stack: `[${stack.join(', ')}]` },
          'merge_action',
          8, 7, 17, 14
        );
      }
    }

    addStep(
      null,
      `All cars evaluated. Total fleets remaining: ${stack.length}.`,
      `RETURN stack.length  →  ${stack.length}`,
      { fleets: stack.length, stack: `[${stack.join(', ')}]` },
      'done',
      11, 10, 20, 19
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [initialPositions, initialSpeeds]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur border border-primary/20 relative overflow-hidden">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center">
              Target Track Lane (0 to {target})
            </h3>

            {/* Target Lane Scale */}
            <div className="relative h-24 bg-muted/20 border border-dashed rounded-xl flex items-center px-4 mb-6">
              {/* Lane track line */}
              <div className="absolute left-6 right-6 h-1.5 bg-muted rounded-full" />
              
              {/* Target Line marker */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
                <div className="h-10 w-1 bg-red-500 rounded" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Target ({target})</span>
              </div>

              {/* Cars visual dots */}
              {step.sortedCars.map((car, idx) => {
                const percentage = (car.position / target) * 85;
                const isActive = step.activeCarIdx === idx;
                const isStackLeader = step.stack.includes(car.timeToTarget);
                
                return (
                  <div
                    key={`car-${car.id}`}
                    style={{ left: `calc(1.5rem + ${percentage}%)` }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-all duration-300"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.25 : 1,
                        borderColor: isActive ? 'hsl(var(--primary))' : isStackLeader ? '#22c55e' : 'rgba(156,163,175,0.4)',
                        backgroundColor: isActive ? 'hsl(var(--primary)/0.2)' : isStackLeader ? '#22c55e/0.1' : 'hsl(var(--muted)/0.3)'
                      }}
                      className="w-10 h-10 rounded-xl border-2 flex flex-col items-center justify-center font-bold text-xs select-none shadow-sm"
                    >
                      <span className="text-[9px] text-muted-foreground font-black uppercase">C{car.id}</span>
                      <span className="text-[11px] font-bold">{car.position}</span>
                    </motion.div>
                    
                    {/* Speed Indicator */}
                    <span className="text-[9px] text-muted-foreground font-bold font-mono">
                      {car.speed}m/s ({car.timeToTarget}h)
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stack Visual Card */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Active Fleet stack (Slowest Arrival Times)
              </span>
              <div className="flex flex-wrap items-center gap-3 min-h-[56px] p-3 bg-muted/20 border border-dashed border-border rounded-xl">
                <AnimatePresence mode="popLayout">
                  {step.stack.map((time, idx) => (
                    <motion.div
                      key={`stack-${idx}-${time}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5 shadow-sm"
                    >
                      <span className="text-[10px] font-black text-green-500 uppercase mr-1">
                        Fleet {idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {time} hours
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {step.stack.length === 0 && (
                  <span className="text-xs text-muted-foreground/60 py-1">
                    Stack is empty. Waiting to process cars.
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">
              Interactive Commentary
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {step.message}
            </p>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
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
export default CarFleetVisualization;
