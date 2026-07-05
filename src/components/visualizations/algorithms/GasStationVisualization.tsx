import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  gas: number[];
  cost: number[];
  res: number;
  total: number;
  current: number;
  totalGas: number;
  totalCost: number;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function canCompleteCircuit(gas: number[], cost: number[]): number {
  const totalGas = gas.reduce((a, b) => a + b, 0);
  const totalCost = cost.reduce((a, b) => a + b, 0);
  if (totalGas < totalCost) return -1;
  let total = 0;
  let res = 0;
  for (let i = 0; i < gas.length; i++) {
    total += gas[i] - cost[i];
    if (total < 0) {
      total = 0;
      res = i + 1;
    }
  }
  return res;
}`,

  python: `def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:
  if sum(gas) < sum(cost):
    return -1
  total = 0
  res = 0
  for i in range(len(gas)):
    total += gas[i] - cost[i]
    if total < 0:
      total = 0
      res = i + 1
  return res`,

  java: `public static class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int sumGas = 0, sumCost = 0;
        for (int i = 0; i < gas.length; i++) {
            sumGas += gas[i];
            sumCost += cost[i];
        }
        if (sumGas < sumCost) return -1;
        int total = 0, res = 0;
        for (int i = 0; i < gas.length; i++) {
            total += gas[i] - cost[i];
            if (total < 0) {
                total = 0;
                res = i + 1;
            }
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int totalGas = 0, totalCost = 0;
        for (int i = 0; i < gas.size(); i++) {
            totalGas += gas[i];
            totalCost += cost[i];
        }
        if (totalGas < totalCost) return -1;
        int total = 0, res = 0;
        for (int i = 0; i < gas.size(); i++) {
            total += gas[i] - cost[i];
            if (total < 0) {
                total = 0;
                res = i + 1;
            }
        }
        return res;
    }
};`
};

function generateVisualizationData() {
  const gas = [1, 2, 3, 4, 5];
  const cost = [3, 4, 5, 1, 2];
  const steps: Step[] = [];
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

  const totalGas = gas.reduce((a, b) => a + b, 0);
  const totalCost = cost.reduce((a, b) => a + b, 0);

  steps.push({
    gas,
    cost,
    res: 0,
    total: 0,
    current: -1,
    totalGas,
    totalCost: 0,
    explanation: 'First, sum all the gas available globally to check feasibility.',
    pseudoStep: `START canCompleteCircuit() -> totalGas = sum(gas) = ${totalGas}`,
  });
  addLines(2, 2, 3, 4);

  steps.push({
    gas,
    cost,
    res: 0,
    total: 0,
    current: -1,
    totalGas,
    totalCost,
    explanation: 'Sum all the cost required globally to travel between all stations.',
    pseudoStep: `SET totalCost = sum(cost) = ${totalCost}`,
  });
  addLines(3, 2, 4, 5);

  steps.push({
    gas,
    cost,
    res: 0,
    total: 0,
    current: -1,
    totalGas,
    totalCost,
    explanation: `Check if total gas (${totalGas}) is less than total cost (${totalCost}).`,
    pseudoStep: `IF totalGas (${totalGas}) < totalCost (${totalCost})`,
  });
  addLines(4, 2, 8, 9);

  if (totalGas < totalCost) {
    steps.push({
      gas,
      cost,
      res: 0,
      total: 0,
      current: -1,
      totalGas,
      totalCost,
      explanation: 'Not enough gas globally to complete any circuit. Return -1.',
      pseudoStep: 'RETURN -1',
    });
    addLines(4, 3, 8, 9);
    return { steps, stepLineNumbers };
  }

  let total = 0;
  let res = 0;

  steps.push({
    gas,
    cost,
    res,
    total,
    current: -1,
    totalGas,
    totalCost,
    explanation: 'Initialize current tank total to 0 and candidate starting station index to 0.',
    pseudoStep: 'SET total = 0, res = 0',
  });
  addLines(5, 4, 9, 10);

  for (let i = 0; i < gas.length; i++) {
    steps.push({
      gas,
      cost,
      res,
      total,
      current: i,
      totalGas,
      totalCost,
      explanation: `Iteration i=${i}: Arrived at station ${i}.`,
      pseudoStep: `FOR i = ${i}`,
    });
    addLines(7, 6, 10, 11);

    total += gas[i] - cost[i];
    steps.push({
      gas,
      cost,
      res,
      total,
      current: i,
      totalGas,
      totalCost,
      explanation: `Pump gas[${i}] (+${gas[i]}) and pay cost[${i}] (-${cost[i]}). Tank level becomes ${total}.`,
      pseudoStep: `SET total = total + gas[${i}] - cost[${i}] → ${total}`,
    });
    addLines(8, 7, 11, 12);

    steps.push({
      gas,
      cost,
      res,
      total,
      current: i,
      totalGas,
      totalCost,
      explanation: `Check if current tank level is negative: ${total} < 0?`,
      pseudoStep: `IF total (${total}) < 0`,
    });
    addLines(9, 8, 12, 13);

    if (total < 0) {
      total = 0;
      res = i + 1;
      steps.push({
        gas,
        cost,
        res,
        total,
        current: i,
        totalGas,
        totalCost,
        explanation: `Tank is empty! Reset current tank total to 0 and set potential starting station to index ${res}.`,
        pseudoStep: `SET total = 0, res = ${res}`,
      });
      addLines(11, 10, 14, 15);
    }
  }

  steps.push({
    gas,
    cost,
    res,
    total,
    current: -1,
    totalGas,
    totalCost,
    explanation: `Circuit can be completed. Return the starting station index: ${res}.`,
    pseudoStep: `RETURN res → ${res}`,
  });
  addLines(14, 11, 17, 18);

  return { steps, stepLineNumbers };
}

export const GasStationVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  const renderCircularRoute = () => {
    const n = currentStep.gas.length;
    const cx = 150;
    const cy = 150;
    const radius = 95;

    return (
      <div className="flex justify-center my-6">
        <svg width="320" height="320" viewBox="0 0 300 300" className="overflow-visible select-none">
          {/* Edges */}
          {currentStep.gas.map((_, i) => {
            const nextI = (i + 1) % n;
            const angle1 = (i * 2 * Math.PI) / n - Math.PI / 2;
            const angle2 = (nextI * 2 * Math.PI) / n - Math.PI / 2;

            const x1 = cx + radius * Math.cos(angle1);
            const y1 = cy + radius * Math.sin(angle1);
            const x2 = cx + radius * Math.cos(angle2);
            const y2 = cy + radius * Math.sin(angle2);

            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const nodeRadius = 24;
            const padding = nodeRadius + 4;
            const reqPaddingRatio = padding / dist;

            const startX = x1 + dx * reqPaddingRatio;
            const startY = y1 + dy * reqPaddingRatio;
            const endX = x2 - dx * reqPaddingRatio;
            const endY = y2 - dy * reqPaddingRatio;

            const midAngle = ((i + 0.5) * 2 * Math.PI) / n - Math.PI / 2;
            const midX = cx + (radius + 18) * Math.cos(midAngle);
            const midY = cy + (radius + 18) * Math.sin(midAngle);

            const isTraveling = currentStep.current === i;

            return (
              <g key={`edge-${i}`}>
                <defs>
                  <marker
                    id={`arrowhead-${i}`}
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 8 3, 0 6"
                      fill={isTraveling ? 'var(--primary)' : 'currentColor'}
                      className="text-muted-foreground/50"
                    />
                  </marker>
                </defs>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isTraveling ? 'var(--primary)' : 'currentColor'}
                  strokeWidth={isTraveling ? 3 : 2}
                  className={isTraveling ? '' : 'text-muted-foreground/30'}
                  markerEnd={`url(#arrowhead-${i})`}
                />

                <rect
                  x={midX - 12}
                  y={midY - 9}
                  width={24}
                  height={18}
                  rx={4}
                  className="fill-card border stroke-border/40"
                />
                <text
                  x={midX}
                  y={midY + 1}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="fill-red-500 text-[10px] font-mono font-bold"
                >
                  -{currentStep.cost[i]}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {currentStep.gas.map((gas, i) => {
            const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            const isStart = i === currentStep.res;
            const isCurrent = i === currentStep.current;

            let nodeClass = 'fill-card stroke-border';
            if (isCurrent) {
              nodeClass = 'fill-primary/20 stroke-primary';
            } else if (isStart) {
              nodeClass = 'fill-green-500/20 stroke-green-500';
            }

            return (
              <g key={`node-${i}`}>
                <circle cx={x} cy={y} r={24} className={`transition-all duration-300 stroke-2 ${nodeClass}`} />
                <text
                  x={x}
                  y={y - 6}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-[9px] fill-muted-foreground font-mono font-bold"
                >
                  S{i}
                </text>
                <text
                  x={x}
                  y={y + 8}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-xs font-mono font-bold fill-green-600 dark:fill-green-400"
                >
                  +{gas}
                </text>

                {isCurrent && (
                  <circle
                    cx={x}
                    cy={y}
                    r={30}
                    fill="none"
                    className="stroke-primary stroke-[2px] opacity-40 animate-pulse"
                  />
                )}
              </g>
            );
          })}

          {/* Center Info Panel */}
          <text
            x={cx}
            y={cy - 10}
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-[10px] uppercase font-bold tracking-wider fill-muted-foreground"
          >
            {currentStep.total >= 0 ? 'Tank Level' : 'Empty!'}
          </text>
          <text
            x={cx}
            y={cy + 12}
            dominantBaseline="middle"
            textAnchor="middle"
            className={`text-2xl font-mono font-bold ${
              currentStep.total >= 0 ? 'fill-primary' : 'fill-red-500'
            }`}
          >
            {currentStep.total}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b border-primary/20 pb-2">
              Circular Route
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find the starting gas station index from which we can complete a full circle without running out of gas.
            </p>

            {renderCircularRoute()}

            <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Start candidate
                </div>
                <div className="text-lg font-mono font-bold text-green-600 dark:text-green-400">
                  {currentStep.res}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Current Tank
                </div>
                <div
                  className={`text-lg font-mono font-bold ${
                    currentStep.total >= 0 ? 'text-primary' : 'text-red-500'
                  }`}
                >
                  {currentStep.total}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl border border-border/50 text-center">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Global Fuel
                </div>
                <div
                  className={`text-lg font-mono font-bold ${
                    currentStep.totalGas >= currentStep.totalCost ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {currentStep.totalGas - currentStep.totalCost}
                </div>
              </div>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Code Display and Variables */}
        <div className="lg:col-span-5 space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              res: currentStep.res,
              total: currentStep.total,
              totalGas: currentStep.totalGas,
              totalCost: currentStep.totalCost
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GasStationVisualization;
