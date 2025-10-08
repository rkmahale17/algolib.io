import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  gas: number[];
  cost: number[];
  start: number;
  tank: number;
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
  let totalGas = 0, totalCost = 0;
  let tank = 0, start = 0;
  
  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    tank += gas[i] - cost[i];
    
    // If tank is negative, can't start from current 'start'
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  
  return totalGas >= totalCost ? start : -1;
}`;

  const generateSteps = () => {
    const gas = [1, 2, 3, 4, 5];
    const cost = [3, 4, 5, 1, 2];
    const newSteps: Step[] = [];

    let totalGas = 0, totalCost = 0;
    let tank = 0, start = 0;

    newSteps.push({
      gas,
      cost,
      start: 0,
      tank: 0,
      current: -1,
      totalGas: 0,
      totalCost: 0,
      message: 'Find starting gas station to complete circular route',
      lineNumber: 1
    });

    for (let i = 0; i < gas.length; i++) {
      totalGas += gas[i];
      totalCost += cost[i];
      tank += gas[i] - cost[i];

      newSteps.push({
        gas,
        cost,
        start,
        tank,
        current: i,
        totalGas,
        totalCost,
        message: `Station ${i}: gain ${gas[i]}, cost ${cost[i]}, tank = ${tank}`,
        lineNumber: 7
      });

      if (tank < 0) {
        start = i + 1;
        tank = 0;
        newSteps.push({
          gas,
          cost,
          start,
          tank: 0,
          current: i,
          totalGas,
          totalCost,
          message: `Tank negative! Reset start to station ${start}`,
          lineNumber: 10
        });
      }
    }

    const result = totalGas >= totalCost ? start : -1;
    newSteps.push({
      gas,
      cost,
      start: result,
      tank,
      current: -1,
      totalGas,
      totalCost,
      message: result >= 0 
        ? `Solution: Start at station ${result}` 
        : 'No solution: total gas < total cost',
      lineNumber: 15
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
          <h3 className="text-lg font-semibold">Gas Stations</h3>
          <div className="flex justify-center gap-2">
            {currentStep.gas.map((gas, idx) => {
              const cost = currentStep.cost[idx];
              const net = gas - cost;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-3 rounded border-2 transition-all ${
                    idx === currentStep.current
                      ? 'bg-primary/20 border-primary scale-110'
                      : idx === currentStep.start
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">{idx}</div>
                  <div className="text-sm font-bold text-green-500">G: {gas}</div>
                  <div className="text-sm font-bold text-red-500">C: {cost}</div>
                  <div
                    className={`text-xs font-bold ${
                      net >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {net >= 0 ? '+' : ''}{net}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Start Station</div>
              <div className="text-2xl font-bold text-green-500">{currentStep.start}</div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Current Tank</div>
              <div className={`text-2xl font-bold ${currentStep.tank >= 0 ? 'text-primary' : 'text-red-500'}`}>
                {currentStep.tank}
              </div>
            </div>
            <div className="p-4 bg-muted rounded border">
              <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
              <div className={`text-2xl font-bold ${currentStep.totalGas >= currentStep.totalCost ? 'text-green-500' : 'text-red-500'}`}>
                {currentStep.totalGas - currentStep.totalCost}
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          'start': currentStep.start,
          'tank': currentStep.tank,
          'total gas': currentStep.totalGas,
          'total cost': currentStep.totalCost
        }}
      />
    </div>
  );
};
