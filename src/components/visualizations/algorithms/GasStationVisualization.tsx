import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  gas: number[];
  cost: number[];
  res: number;
  total: number;
  current: number;
  totalGas: number;
  totalCost: number;
  message: string;
  lineNumber: number;
}

export const GasStationVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function canCompleteCircuit(gas: number[], cost: number[]): number {
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
}`;

  const generateSteps = () => {
    const gas = [1, 2, 3, 4, 5];
    const cost = [3, 4, 5, 1, 2];
    const newSteps: Step[] = [];

    newSteps.push({
      gas, cost, res: 0, total: 0, current: -1, totalGas: 0, totalCost: 0,
      message: 'Calculate total gas available.',
      lineNumber: 2
    });

    const totalGas = gas.reduce((a, b) => a + b, 0);
    newSteps.push({
      gas, cost, res: 0, total: 0, current: -1, totalGas, totalCost: 0,
      message: 'Calculate total cost to travel between stations.',
      lineNumber: 3
    });

    const totalCost = cost.reduce((a, b) => a + b, 0);
    newSteps.push({
      gas, cost, res: 0, total: 0, current: -1, totalGas, totalCost,
      message: 'Check if total gas < total cost is true.',
      lineNumber: 5
    });

    if (totalGas < totalCost) {
      newSteps.push({
        gas, cost, res: 0, total: 0, current: -1, totalGas, totalCost,
        message: 'Not enough gas globally. Return -1.',
        lineNumber: 5
      });
      setSteps(newSteps);
      return;
    }

    let total = 0;
    newSteps.push({
      gas, cost, res: 0, total: total, current: -1, totalGas, totalCost,
      message: 'Initialize current tank total = 0.',
      lineNumber: 7
    });

    let res = 0;
    newSteps.push({
      gas, cost, res: res, total: total, current: -1, totalGas, totalCost,
      message: 'Initialize potential starting station res = 0.',
      lineNumber: 8
    });

    for (let i = 0; i < gas.length; i++) {
      newSteps.push({
        gas, cost, res: res, total: total, current: i, totalGas, totalCost,
        message: `Iteration i=${i}: Arrived at station ${i}.`,
        lineNumber: 10
      });

      total += gas[i] - cost[i];
      newSteps.push({
        gas, cost, res: res, total: total, current: i, totalGas, totalCost,
        message: `Update tank total += gas[${i}] - cost[${i}].`,
        lineNumber: 11
      });

      newSteps.push({
        gas, cost, res: res, total: total, current: i, totalGas, totalCost,
        message: `Check if current tank total < 0.`,
        lineNumber: 13
      });

      if (total < 0) {
        total = 0;
        newSteps.push({
          gas, cost, res: res, total: total, current: i, totalGas, totalCost,
          message: `Tank exhausted! Reset total = 0.`,
          lineNumber: 14
        });

        res = i + 1;
        newSteps.push({
          gas, cost, res: res, total: total, current: i, totalGas, totalCost,
          message: `Set new potential starting point res = ${res}.`,
          lineNumber: 15
        });
      }
    }

    newSteps.push({
      gas, cost, res: res, total: total, current: -1, totalGas, totalCost,
      message: `Loop complete. Return starting index ${res}.`,
      lineNumber: 19
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  const renderCircularVisualization = () => {
    const n = currentStep.gas.length;
    const cx = 150;
    const cy = 150;
    const radius = 100;

    return (
      <div className="flex justify-center my-6">
        <svg width="340" height="340" viewBox="0 0 300 300" className="overflow-visible">
          {/* Edges */}
          {currentStep.gas.map((_, i) => {
            const nextI = (i + 1) % n;
            const angle1 = (i * 2 * Math.PI) / n - Math.PI / 2;
            const angle2 = (nextI * 2 * Math.PI) / n - Math.PI / 2;

            const x1 = cx + radius * Math.cos(angle1);
            const y1 = cy + radius * Math.sin(angle1);
            const x2 = cx + radius * Math.cos(angle2);
            const y2 = cy + radius * Math.sin(angle2);

            // Make the path a slight curve instead of a straight line through the center
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const nodeRadius = 26;
            const padding = nodeRadius + 4;
            const reqPaddingRatio = padding / dist;

            const startX = x1 + dx * reqPaddingRatio;
            const startY = y1 + dy * reqPaddingRatio;
            const endX = x2 - dx * reqPaddingRatio;
            const endY = y2 - dy * reqPaddingRatio;

            // Output mid point mapped out a little radially
            const midAngle = ((i + 0.5) * 2 * Math.PI) / n - Math.PI / 2;
            const midX = cx + (radius + 20) * Math.cos(midAngle);
            const midY = cy + (radius + 20) * Math.sin(midAngle);

            const isTraveling = currentStep.current === i;

            return (
              <g key={`edge-${i}`}>
                <defs>
                  <marker id={`arrowhead-${i}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill={isTraveling ? "#10b981" : "currentColor"} className="text-muted-foreground dark:text-gray-500" />
                  </marker>
                </defs>
                <line
                  x1={startX} y1={startY}
                  x2={endX} y2={endY}
                  stroke={isTraveling ? "#10b981" : "currentColor"}
                  strokeWidth={isTraveling ? 3 : 2}
                  className={isTraveling ? "" : "text-muted-foreground/40 dark:text-gray-600/60"}
                  markerEnd={`url(#arrowhead-${i})`}
                />

                {/* Cost badge */}
                <rect
                  x={midX - 12} y={midY - 10}
                  width={24} height={20}
                  rx={4}
                  fill="var(--background)"
                  className="fill-card border stroke-border"
                />
                <text
                  x={midX}
                  y={midY + 1}
                  dominantBaseline="middle" textAnchor="middle"
                  className="fill-red-500 text-xs font-bold font-mono"
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

            return (
              <g key={`node-${i}`}>
                <circle
                  cx={x} cy={y}
                  r={26}
                  className={`transition-all duration-300 ${isCurrent ? 'fill-primary/20 stroke-primary stroke-2'
                    : isStart ? 'fill-green-500/20 stroke-green-500 stroke-2'
                      : 'fill-card stroke-border stroke-2'
                    }`}
                />
                <text x={x} y={y - 8} dominantBaseline="middle" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">
                  S{i}
                </text>
                <text x={x} y={y + 8} dominantBaseline="middle" textAnchor="middle" className="text-sm font-bold fill-green-500 font-mono">
                  +{gas}
                </text>

                {isCurrent && (
                  <circle cx={x} cy={y} r={32} fill="none" className="stroke-primary stroke-[3px] opacity-40 animate-pulse" />
                )}
              </g>
            );
          })}

          {/* Center Info text */}
          <text x={cx} y={cy - 10} dominantBaseline="middle" textAnchor="middle" className="text-xs fill-muted-foreground">
            {currentStep.total >= 0 ? "Tank" : "Empty!"}
          </text>
          <text x={cx} y={cy + 10} dominantBaseline="middle" textAnchor="middle" className={`text-2xl font-bold ${currentStep.total >= 0 ? "fill-primary" : "fill-red-500"}`}>
            {currentStep.total}
          </text>
        </svg>
      </div >
    );
  };

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Circular Route</h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            There are <strong>n</strong> gas stations along a circular route. You have a car with an unlimited gas tank.
            It costs <strong>cost[i]</strong> to travel to the next station, and you pump <strong>gas[i]</strong> when you arrive.
          </p>

          {renderCircularVisualization()}

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Start Station (res)</div>
              <div className="text-2xl font- text-green-500">{currentStep.res}</div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Current Tank (total)</div>
              <div className={`text-2xl font- ${currentStep.total >= 0 ? 'text-primary' : 'text-red-500'}`}>
                {currentStep.total}
              </div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
              <div className={`text-2xl font- ${currentStep.totalGas >= currentStep.totalCost ? 'text-green-500' : 'text-red-500'}`}>
                {currentStep.totalGas - currentStep.totalCost}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          'res': currentStep.res,
          'total': currentStep.total,
          'totalGas': currentStep.totalGas,
          'totalCost': currentStep.totalCost
        }}
      />
    </div>
  );
};
