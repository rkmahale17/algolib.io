import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import { VisualizationLayout } from "../shared/VisualizationLayout";
import { Card } from "@/components/ui/card";
import type { VisualizationLanguageMap, StepLineNumberMap } from "@/types/visualization";

interface Step {
  type: "init" | "set" | "get";
  operation: string;
  message: string;
  detailedMessage: string;
  substep: number;
  totalSubsteps: number;
  store: Record<string, [string, number][]>;
  pseudoStep: string;
  
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

const languages: VisualizationLanguageMap = {
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
}`,
  python: `class TimeMap:
    def __init__(self):
        self.store = {}
    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((value, timestamp))
    def get(self, key: str, timestamp: int) -> str:
        res = ""
        values = self.store.get(key, [])
        left, right = 0, len(values) - 1
        while left <= right:
            mid = (left + right) // 2
            if values[mid][1] <= timestamp:
                res = values[mid][0]
                left = mid + 1
            else:
                right = mid - 1
        return res`,
  java: `class TimeMap {
    private Map<String, List<Pair<String, Integer>>> store;
    public TimeMap() {
        store = new HashMap<>();
    }
    public void set(String key, String value, int timestamp) {
        if (!store.containsKey(key)) {
            store.put(key, new ArrayList<>());
        }
        store.get(key).add(new Pair<>(value, timestamp));
    }
    public String get(String key, int timestamp) {
        if (!store.containsKey(key)) {
            return "";
        }
        List<Pair<String, Integer>> values = store.get(key);
        String res = "";
        int left = 0;
        int right = values.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (values.get(mid).getValue() <= timestamp) {
                res = values.get(mid).getKey();
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return res;
    }
}`,
  cpp: `class TimeMap {
private:
    unordered_map<string, vector<pair<string, int>>> store;
public:
    TimeMap() {}
    void set(string key, string value, int timestamp) {
        store[key].push_back({value, timestamp});
    }
    string get(string key, int timestamp) {
        string res = "";
        auto& values = store[key];
        int left = 0;
        int right = values.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (values[mid].second <= timestamp) {
                res = values[mid].first;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return res;
    }
};`
};

export const TimeMapVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { steps, stepLineNumbers } = useMemo(() => {
    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const store: Record<string, [string, number][]> = {};
    
    const getStore = () => JSON.parse(JSON.stringify(store));

    const addStep = (
      type: Step["type"],
      operation: string,
      message: string,
      detailedMessage: string,
      substep: number,
      totalSubsteps: number,
      extras: Partial<Step>,
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        type,
        operation,
        message,
        detailedMessage,
        substep,
        totalSubsteps,
        store: getStore(),
        pseudoStep: operation,
        ...extras
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    const doSet = (key: string, value: string, timestamp: number) => {
      const op = `set("${key}", "${value}", ${timestamp})`;
      let s = 1; const total = 3;
      addStep("set", op, "Setting value", `Calling set for key "${key}" with value "${value}" at timestamp ${timestamp}.`, s++, total, { activeKey: key, activeValue: value, activeTimestamp: timestamp }, 6, 4, 6, 6);
      
      if (!store[key]) {
        store[key] = [];
        addStep("set", op, "Initializing key", `Key "${key}" does not exist, creating new empty array.`, s++, total, { activeKey: key }, 7, 5, 7, 7);
      }
      
      store[key].push([value, timestamp]);
      addStep("set", op, "Appending value", `Pushed ["${value}", ${timestamp}] to array for key "${key}".`, s++, total, { activeKey: key, activeValue: value, activeTimestamp: timestamp }, 10, 7, 10, 7);
    };

    const doGet = (key: string, timestamp: number) => {
      const op = `get("${key}", ${timestamp})`;
      const baseExtras = { activeKey: key, targetTimestamp: timestamp, bsActive: true };
      let s = 1; 
      
      const tempSteps: any[] = [];
      let res = "";
      const values = store[key] || [];
      let left = 0;
      let right = values.length - 1;

      tempSteps.push({ msg: "Initializing get", detail: `Looking up key "${key}" for timestamp <= ${timestamp}.`, ts: 12, py: 8, j: 12, c: 9, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Setting default result", detail: 'res = ""', ts: 13, py: 9, j: 17, c: 10, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Retrieving values", detail: values.length ? `Found array of length ${values.length} for key "${key}".` : `Key "${key}" not found, using empty array.`, ts: 14, py: 10, j: 16, c: 11, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });
      tempSteps.push({ msg: "Initializing pointers", detail: `left = 0, right = ${right}`, ts: 15, py: 11, j: 18, c: 12, extras: { ...baseExtras, res, left, right, mid: -1 } });

      while (left <= right) {
        tempSteps.push({ msg: "Loop condition", detail: `left (${left}) <= right (${right}) is true.`, ts: 17, py: 12, j: 20, c: 14, extras: { ...baseExtras, res, left, right, mid: -1 } });
        const mid = Math.floor((left + right) / 2);
        tempSteps.push({ msg: "Calculating mid", detail: `mid = Math.floor((${left} + ${right}) / 2) = ${mid}`, ts: 18, py: 13, j: 21, c: 15, extras: { ...baseExtras, res, left, right, mid } });
        
        const midTimestamp = values[mid][1];
        if (midTimestamp <= timestamp) {
          tempSteps.push({ msg: "Comparing timestamps", detail: `values[mid] timestamp ${midTimestamp} <= ${timestamp} is true.`, ts: 19, py: 14, j: 22, c: 16, extras: { ...baseExtras, res, left, right, mid } });
          res = values[mid][0];
          tempSteps.push({ msg: "Updating result", detail: `Found potential answer. res = "${res}".`, ts: 20, py: 15, j: 23, c: 17, extras: { ...baseExtras, res, left, right, mid } });
          left = mid + 1;
          tempSteps.push({ msg: "Moving left pointer", detail: `Searching right half for potentially larger valid timestamp. left = ${left}.`, ts: 21, py: 16, j: 24, c: 18, extras: { ...baseExtras, res, left, right, mid } });
        } else {
          tempSteps.push({ msg: "Comparing timestamps", detail: `values[mid] timestamp ${midTimestamp} <= ${timestamp} is false.`, ts: 19, py: 14, j: 22, c: 16, extras: { ...baseExtras, res, left, right, mid } });
          right = mid - 1;
          tempSteps.push({ msg: "Moving right pointer", detail: `Timestamp too large. Searching left half. right = ${right}.`, ts: 23, py: 18, j: 26, c: 20, extras: { ...baseExtras, res, left, right, mid } });
        }
      }

      tempSteps.push({ msg: "Loop condition", detail: `left (${left}) <= right (${right}) is false. Exiting loop.`, ts: 17, py: 12, j: 20, c: 14, extras: { ...baseExtras, res, left, right, mid: -1 } });
      tempSteps.push({ msg: "Returning result", detail: `Returning final result: "${res}".`, ts: 26, py: 19, j: 29, c: 23, extras: { ...baseExtras, res, left: -1, right: -1, mid: -1 } });

      const total = tempSteps.length;
      tempSteps.forEach((t) => {
        addStep("get", op, t.msg, t.detail, s++, total, t.extras, t.ts, t.py, t.j, t.c);
      });
    };

    // INIT
    addStep("init", "TimeMap()", "Initialize TimeMap", "Created new Map for store.", 1, 1, {}, 4, 3, 4, 7);

    // Sequence
    doSet("foo", "bar", 1);
    doGet("foo", 1); // Exact match
    doGet("foo", 3); // Larger target timestamp
    doSet("foo", "bar2", 4);
    doGet("foo", 4); // Exact match again
    doGet("foo", 5); // Larger target timestamp
    doGet("foo", 0); // Edge case: smaller target timestamp than anything

    return { steps: generatedSteps, stepLineNumbers: lines };
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
  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <div className="flex flex-col h-full gap-4">
      <VisualizationLayout
        controls={
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 p-4 bg-card border border-border rounded-lg shadow-sm">
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
        }
        leftContent={
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Current Operation</h3>
              <p className="text-lg font-mono text-primary">{step.operation}</p>
              <p className="text-base font-semibold text-foreground mt-2">{step.message}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.detailedMessage}</p>
              <div className="mt-2 text-xs text-muted-foreground">Substep {step.substep} of {step.totalSubsteps}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-foreground">Hash Map Store</h3>
              {Object.keys(step.store).length === 0 && <p className="text-sm text-muted-foreground italic">Store is empty.</p>}
              <div className="flex flex-col gap-3">
                  {Object.entries(step.store).map(([key, values]) => (
                  <div key={key} className={`p-3 rounded-lg border-2 ${key === step.activeKey ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}>
                      <div className="font-mono text-sm text-foreground mb-2 flex items-center gap-2">
                          <span className="font-bold">&quot;{key}&quot;</span> 
                          <span className="text-muted-foreground">-&gt;</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                          {values.length === 0 && <span className="text-xs text-muted-foreground">[]</span>}
                          {values.map(([val, time], i) => {
                              const isMid = step.bsActive && step.activeKey === key && step.mid === i;
                              const isLeft = step.bsActive && step.activeKey === key && step.left === i;
                              const isRight = step.bsActive && step.activeKey === key && step.right === i;
                              const isSearchRange = step.bsActive && step.activeKey === key && i >= (step.left ?? 0) && i <= (step.right ?? -1);
                              
                              let borderColor = "border-border";
                              let bgColor = "bg-background";
                              if (isMid) { borderColor = "border-primary"; bgColor = "bg-primary/20"; }
                              else if (isSearchRange) { borderColor = "border-secondary"; bgColor = "bg-secondary/10"; }
                              else if (step.bsActive && step.activeKey === key) { borderColor = "border-border/50 opacity-50"; }

                              return (
                                  <div key={time} className="relative mt-4">
                                      <div className={`text-xs px-2 py-1.5 rounded-md border-2 flex flex-col items-center min-w-[70px] ${borderColor} ${bgColor}`}>
                                          <span className="font-semibold text-foreground">&quot;{val}&quot;</span>
                                          <span className="text-muted-foreground text-[10px]">t: {time}</span>
                                      </div>
                                      
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

            {step.bsActive && (
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Search Target</h3>
                      <div className="font-mono text-sm text-muted-foreground">Key: <span className="text-foreground font-semibold">&quot;{step.activeKey}&quot;</span></div>
                      <div className="font-mono text-sm text-muted-foreground">Timestamp: <span className="text-foreground font-semibold">{step.targetTimestamp}</span></div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">Binary Search Variables</h3>
                      <div className="font-mono text-sm text-muted-foreground">left = <span className="text-secondary">{step.left !== -1 ? step.left : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground">right = <span className="text-secondary">{step.right !== -1 ? step.right : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground">mid = <span className="text-primary">{step.mid !== -1 ? step.mid : "?"}</span></div>
                      <div className="font-mono text-sm text-muted-foreground mt-2 border-t pt-2">res = <span className="text-foreground font-bold font-mono">&quot;{step.res}&quot;</span></div>
                  </div>
              </div>
            )}

            <VariablePanel variables={{ "Target Timestamp": step.targetTimestamp !== undefined ? step.targetTimestamp : "N/A", "Current Result (res)": `"${step.res ?? ""}"` }} />
          </div>
        }
        rightContent={
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
        }
      />
    </div>
  );
};
export default TimeMapVisualization;
