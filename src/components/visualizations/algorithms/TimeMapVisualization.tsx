import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";

interface Step {
  type: "init" | "set" | "get";
  operation: string;
  message: string;
  detailedMessage: string;
  highlightedLine: number;
  substep: number;
  totalSubsteps: number;
  
  store: Record<string, [string, number][]>;
  
  // Highlighting
  activeKey?: string;
  activeValue?: string;
  activeTimestamp?: number;
  
  // Binary Search State
  bsActive?: boolean;
  left?: number;
  right?: number;
  mid?: number;
  res?: string;
  targetTimestamp?: number;
}

const codeExamples = {
  typescript: `class TimeMap {
  private store: Map<string, [string, number][]>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    this.store.get(key)!.push([value, timestamp]);
  }

  get(key: string, timestamp: number): string {
    let res = "";
    const values = this.store.get(key) || [];
    let left = 0;
    let right = values.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (values[mid][1] <= timestamp) {
        res = values[mid][0];
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return res;
  }
}`
};

export const TimeMapVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generatedSteps: Step[] = [];
    const store: Record<string, [string, number][]> = {};
    
    const getStore = () => JSON.parse(JSON.stringify(store));

    const addStep = (
      type: Step["type"],
      operation: string,
      message: string,
      detailedMessage: string,
      highlightedLine: number,
      substep: number,
      totalSubsteps: number,
      extras: Partial<Step> = {}
    ) => {
      generatedSteps.push({
        type,
        operation,
        message,
        detailedMessage,
        highlightedLine,
        substep,
        totalSubsteps,
        store: getStore(),
        ...extras
      });
    };

    const doSet = (key: string, value: string, timestamp: number) => {
      const op = `set("${key}", "${value}", ${timestamp})`;
      let s = 1; const total = 3;
      addStep("set", op, "Setting value", `Calling set for key "${key}" with value "${value}" at timestamp ${timestamp}.`, 8, s++, total, { activeKey: key, activeValue: value, activeTimestamp: timestamp });
      
      if (!store[key]) {
        store[key] = [];
        addStep("set", op, "Initializing key", `Key "${key}" does not exist, creating new empty array.`, 10, s++, total, { activeKey: key });
      }
      
      store[key].push([value, timestamp]);
      addStep("set", op, "Appending value", `Pushed ["${value}", ${timestamp}] to array for key "${key}".`, 12, s++, total, { activeKey: key, activeValue: value, activeTimestamp: timestamp });
    };

    const doGet = (key: string, timestamp: number) => {
      const op = `get("${key}", ${timestamp})`;
      const baseExtras = { activeKey: key, targetTimestamp: timestamp, bsActive: true };
      let s = 1; 
      
      // We will count steps dynamically
      const tempSteps: any[] = [];
      
      let res = "";
      const values = store[key] || [];
      let left = 0;
      let right = values.length - 1;

      tempSteps.push({ msg: "Initializing get", detail: `Looking up key "${key}" for timestamp <= ${timestamp}.`, line: 15, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Setting default result", detail: "res = \"\"", line: 16, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Retrieving values", detail: values.length ? `Found array of length ${values.length} for key "${key}".` : `Key "${key}" not found, using empty array.`, line: 17, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Initializing pointers", detail: `left = 0, right = ${right}`, line: 19, extras: { ...baseExtras, res, left, right, mid: -1 } });

      while (left <= right) {
        tempSteps.push({ msg: "Loop condition", detail: `left (${left}) <= right (${right}) is true.`, line: 21, extras: { ...baseExtras, res, left, right, mid: -1 } });
        const mid = Math.floor((left + right) / 2);
        tempSteps.push({ msg: "Calculating mid", detail: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}`, line: 22, extras: { ...baseExtras, res, left, right, mid } });
        
        const midTimestamp = values[mid][1];
        if (midTimestamp <= timestamp) {
          tempSteps.push({ msg: "Comparing timestamps", detail: `values[mid] timestamp ${midTimestamp} <= ${timestamp} is true.`, line: 23, extras: { ...baseExtras, res, left, right, mid } });
          res = values[mid][0];
          tempSteps.push({ msg: "Updating result", detail: `Found potential answer. res = "${res}".`, line: 24, extras: { ...baseExtras, res, left, right, mid } });
          left = mid + 1;
          tempSteps.push({ msg: "Moving left pointer", detail: `Searching right half for potentially larger valid timestamp. left = ${left}.`, line: 25, extras: { ...baseExtras, res, left, right, mid } });
        } else {
          tempSteps.push({ msg: "Comparing timestamps", detail: `values[mid] timestamp ${midTimestamp} <= ${timestamp} is false.`, line: 26, extras: { ...baseExtras, res, left, right, mid } });
          right = mid - 1;
          tempSteps.push({ msg: "Moving right pointer", detail: `Timestamp too large. Searching left half. right = ${right}.`, line: 27, extras: { ...baseExtras, res, left, right, mid } });
        }
      }

      tempSteps.push({ msg: "Loop condition", detail: `left (${left}) <= right (${right}) is false. Exiting loop.`, line: 21, extras: { ...baseExtras, res, left, right, mid: -1 } });
      tempSteps.push({ msg: "Returning result", detail: `Returning final result: "${res}".`, line: 30, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });

      const total = tempSteps.length;
      tempSteps.forEach((t) => {
        addStep("get", op, t.msg, t.detail, t.line, s++, total, t.extras);
      });
    };

    // INIT
    addStep("init", "TimeMap()", "Initialize TimeMap", "Created new Map for store.", 5, 1, 1);

    // Sequence
    doSet("foo", "bar", 1);
    doGet("foo", 1); // Exact match
    doGet("foo", 3); // Larger target timestamp
    doSet("foo", "bar2", 4);
    doGet("foo", 4); // Exact match again
    doGet("foo", 5); // Larger target timestamp
    doGet("foo", 0); // Edge case: smaller target timestamp than anything

    setSteps(generatedSteps);
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex((prev) => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex((prev) => prev - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between w-full gap-4 p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button onClick={handleStepBack} disabled={currentStepIndex === 0} variant="outline" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={isPlaying ? handlePause : handlePlay} disabled={currentStepIndex === steps.length - 1} variant="default" size="icon">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={handleStepForward} disabled={currentStepIndex === steps.length - 1} variant="outline" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button onClick={handleReset} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} / {steps.length}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <Slider value={[speed]} onValueChange={(val) => setSpeed(val[0])} min={0.5} max={3} step={0.5} className="w-24" />
            <span className="text-sm font-medium">{speed}x</span>
          </div>
        </div>
      </div>

      <VisualizationLayout
        controls={null}
        leftContent={
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Current Operation</h3>
              <p className="text-lg font-mono text-primary">{currentStep.operation}</p>
              <p className="text-base font-semibold text-foreground mt-2">{currentStep.message}</p>
              <p className="text-sm text-muted-foreground mt-1">{currentStep.detailedMessage}</p>
              <div className="mt-2 text-xs text-muted-foreground">Substep {currentStep.substep} of {currentStep.totalSubsteps}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Hash Map Store</h3>
              {Object.keys(currentStep.store).length === 0 && <p className="text-sm text-muted-foreground italic">Store is empty.</p>}
              <div className="flex flex-col gap-3">
                  {Object.entries(currentStep.store).map(([key, values]) => (
                  <div key={key} className={`p-3 rounded-lg border-2 ${key === currentStep.activeKey ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}>
                      <div className="font-mono text-sm text-foreground mb-2 flex items-center gap-2">
                          <span className="font-bold">"{key}"</span> 
                          <span className="text-muted-foreground">-&gt;</span>
                      </div>
                      
                      {/* Array Representation */}
                      <div className="flex flex-wrap gap-2">
                          {values.length === 0 && <span className="text-xs text-muted-foreground">[]</span>}
                          {values.map(([val, time], i) => {
                              const isMid = currentStep.bsActive && currentStep.activeKey === key && currentStep.mid === i;
                              const isLeft = currentStep.bsActive && currentStep.activeKey === key && currentStep.left === i;
                              const isRight = currentStep.bsActive && currentStep.activeKey === key && currentStep.right === i;
                              const isSearchRange = currentStep.bsActive && currentStep.activeKey === key && i >= (currentStep.left ?? 0) && i <= (currentStep.right ?? -1);
                              
                              let borderColor = "border-border";
                              let bgColor = "bg-background";
                              if (isMid) { borderColor = "border-primary"; bgColor = "bg-primary/20"; }
                              else if (isSearchRange) { borderColor = "border-secondary"; bgColor = "bg-secondary/10"; }
                              else if (currentStep.bsActive && currentStep.activeKey === key) { borderColor = "border-border/50 opacity-50"; }

                              return (
                                  <div key={time} className="relative mt-4">
                                      <div className={`text-xs px-2 py-1.5 rounded-md border-2 flex flex-col items-center min-w-[70px] ${borderColor} ${bgColor}`}>
                                          <span className="font-semibold text-foreground">"{val}"</span>
                                          <span className="text-muted-foreground text-[10px]">t: {time}</span>
                                      </div>
                                      
                                      {/* Pointer indicators */}
                                      <div className="absolute -top-6 left-0 w-full flex justify-center gap-1 z-20">
                                          {isLeft && <span className="text-[10px] font-bold text-blue-500">Left</span>}
                                          {isMid && <span className="text-[10px] font-bold text-blue-500">Mid</span>}
                                          {isRight && <span className="text-[10px] font-bold text-blue-500">Right</span>}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  ))}
              </div>
            </div>

            {currentStep.bsActive && (
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Search Target</h3>
                      <div className="font-mono text-sm text-muted-foreground">Key: <span className="text-foreground font-semibold">"{currentStep.activeKey}"</span></div>
                      <div className="font-mono text-sm text-muted-foreground">Timestamp: <span className="text-foreground font-semibold">{currentStep.targetTimestamp}</span></div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Binary Search Variables</h3>
                      <div className="font-mono text-sm text-muted-foreground">left = <span className="text-secondary">{currentStep.left !== -1 ? currentStep.left : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground">right = <span className="text-secondary">{currentStep.right !== -1 ? currentStep.right : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground">mid = <span className="text-primary">{currentStep.mid !== -1 ? currentStep.mid : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground mt-2 border-t pt-2">res = <span className="text-foreground font-bold font-mono">"{currentStep.res}"</span></div>
                  </div>
              </div>
            )}
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <AnimatedCodeEditor code={codeExamples.typescript} language="typescript" highlightedLines={[currentStep.highlightedLine]} />
            <VariablePanel variables={{ "Target Timestamp": currentStep.targetTimestamp !== undefined ? currentStep.targetTimestamp : "N/A", "Current Result (res)": `"${currentStep.res ?? ""}"` }} />
          </div>
        }
      />
    </div>
  );
};
