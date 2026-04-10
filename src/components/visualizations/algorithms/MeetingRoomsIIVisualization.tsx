import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';
import { Button } from '@/components/ui/button';

interface Meeting {
  start: number;
  end: number;
  id: number;
}

interface Step {
  startTimes: number[];
  endTimes: number[];
  s: number;
  e: number;
  count: number;
  res: number;
  activeMeetings: Meeting[];
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

const USE_CASES = [
  {
    id: 'standard',
    label: 'Case 1: Standard',
    intervals: [[0, 30], [5, 10], [15, 20]],
  },
  {
    id: 'heavy-overlap',
    label: 'Case 2: Heavy Overlap',
    intervals: [[1, 10], [2, 7], [3, 19], [8, 12]],
  },
  {
    id: 'sequential',
    label: 'Case 3: Sequential',
    intervals: [[1, 5], [5, 10], [10, 15]],
  }
];

export const MeetingRoomsIIVisualization = () => {
  const [useCaseIdx, setUseCaseIdx] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentCase = USE_CASES[useCaseIdx];

  const steps = useMemo(() => {
    const intervals = currentCase.intervals;
    const startArr = [...intervals.map(i => i[0])].sort((a, b) => a - b);
    const endArr = [...intervals.map(i => i[1])].sort((a, b) => a - b);

    const steps: Step[] = [];

    // Initial state / Signature
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s: 0,
      e: 0,
      count: 0,
      res: 0,
      activeMeetings: [],
      message: "Initialize the meeting rooms manager.",
      highlightedLines: [1],
      variables: { "intervals": JSON.stringify(intervals) }
    });

    let res = 0;
    let count = 0;
    let s = 0;
    let e = 0;

    // Line 2: start sort
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s, e, count, res,
      activeMeetings: [],
      message: "Sort all start times to process meetings in chronological order.",
      highlightedLines: [2],
      variables: { "start": JSON.stringify(startArr) }
    });

    // Line 3: end sort
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s, e, count, res,
      activeMeetings: [],
      message: "Sort all end times to know when rooms become available.",
      highlightedLines: [3],
      variables: { "end": JSON.stringify(endArr) }
    });

    // Line 5: res, count init
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s, e, count, res,
      activeMeetings: [],
      message: "Initialize the room count and peak occupancy to 0.",
      highlightedLines: [5],
      variables: { "res": 0, "count": 0 }
    });

    // Line 6: s, e init
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s: 0, e: 0, count, res,
      activeMeetings: [],
      message: "Set pointers for start times (s) and end times (e) to the beginning.",
      highlightedLines: [6],
      variables: { "s": 0, "e": 0 }
    });

    const activeMeetings: Meeting[] = [];

    while (s < intervals.length) {
      // While check (line 8)
      steps.push({
        startTimes: startArr,
        endTimes: endArr,
        s, e, count, res,
        activeMeetings: [...activeMeetings],
        message: `Current start pointer s is ${s}. Processing meeting starting at ${startArr[s]}.`,
        highlightedLines: [8],
        variables: { "s": s, "n": intervals.length }
      });

      const isStartBeforeEnd = startArr[s] < endArr[e];

      // If check (line 9)
      steps.push({
        startTimes: startArr,
        endTimes: endArr,
        s, e, count, res,
        activeMeetings: [...activeMeetings],
        message: `Is next start (${startArr[s]}) < next earliest end (${endArr[e]})?`,
        highlightedLines: [9],
        variables: { "start[s]": startArr[s], "end[e]": endArr[e], "result": isStartBeforeEnd }
      });

      if (isStartBeforeEnd) {
        s++;
        count++;
        activeMeetings.push({ start: startArr[s - 1], end: endArr[e], id: s - 1 });

        steps.push({
          startTimes: startArr,
          endTimes: endArr,
          s, e, count, res,
          activeMeetings: [...activeMeetings],
          message: "Yes. A new room must be allocated before any is freed. Increment 'count'.",
          highlightedLines: [10, 11],
          variables: { "count": count, "s": s }
        });
      } else {
        e++;
        count--;
        if (activeMeetings.length > 0) activeMeetings.shift();

        steps.push({
          startTimes: startArr,
          endTimes: endArr,
          s, e, count, res,
          activeMeetings: [...activeMeetings],
          message: "No. A room has been freed. Decrement 'count' and move end pointer e.",
          highlightedLines: [13, 14],
          variables: { "count": count, "e": e }
        });
      }

      const prevRes = res;
      res = Math.max(res, count);

      // res = Math.max (line 17)
      steps.push({
        startTimes: startArr,
        endTimes: endArr,
        s, e, count, res,
        activeMeetings: [...activeMeetings],
        message: res > prevRes
          ? `Updated peak room occupancy: ${res}.`
          : `Current occupancy (${count}) does not exceed peak (${res}).`,
        highlightedLines: [17],
        variables: { "count": count, "res": res }
      });
    }

    // Final while check failed (Line 8)
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s, e, count, res,
      activeMeetings: [],
      message: "All meetings processed (s >= intervals.length).",
      highlightedLines: [8],
      variables: { "s": s, "n": intervals.length }
    });

    // Return (line 20)
    steps.push({
      startTimes: startArr,
      endTimes: endArr,
      s, e, count, res,
      activeMeetings: [],
      message: `Final result: minimum of ${res} rooms required.`,
      highlightedLines: [20],
      variables: { "return": res }
    });

    return steps;
  }, [currentCase]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];

  const code = `function minMeetingRooms(intervals: number[][]): number {
  const start = intervals.map(i => i[0]).sort((a, b) => a - b);
  const end = intervals.map(i => i[1]).sort((a, b) => a - b);

  let res = 0, count = 0;
  let s = 0, e = 0;

  while (s < intervals.length) {
    if (start[s] < end[e]) {
      s++;
      count++;
    } else {
      e++;
      count--;
    }

    res = Math.max(res, count);
  }

  return res;
}`;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500 / speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleUseCaseChange = (idx: number) => {
    setUseCaseIdx(idx);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className=" space-y-6">
      {/* Controls at Top */}
      <div className="flex flex-col gap-6 bg-card p-6 rounded-xl border-2 border-primary/10 shadow-sm overflow-x-auto">
        <div className="flex flex-wrap gap-2 ">
          {USE_CASES.map((uc, idx) => (
            <Button
              key={uc.id}
              variant={useCaseIdx === idx ? "default" : "outline"}
              size="sm"
              onClick={() => handleUseCaseChange(idx)}
              className={`text-xs h-8 px-4 rounded-full transition-all duration-200 ${useCaseIdx === idx ? "shadow-md scale-105" : "hover:bg-muted"
                }`}
            >
              {uc.label}
            </Button>
          ))}
        </div>
        <div className="w-full pt-4 border-t border-border/50">
          <StepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length - 1}
            onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
            onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-2 flex flex-col gap-6 overflow-hidden border-2 border-primary/5 shadow-lg bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col items-center px-2 py-0.5 bg-primary/10 rounded-lg border border-primary/20 min-w-[50px]">
                <span className="text-[8px] font-bold text-primary/70 uppercase">Peak</span>
                <span className="text-sm font-bold text-primary">{currentStep.res}</span>
              </div>
              <div className="flex flex-col items-center px-2 py-0.5 bg-secondary/30 rounded-lg border border-secondary/50 min-w-[50px]">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Active</span>
                <span className="text-sm font-bold text-foreground">{currentStep.count}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start Times</span>
                  <span className="text-[10px] font-mono text-muted-foreground">s: {currentStep.s}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 px-1 w-full no-scrollbar">
                  {currentStep.startTimes.map((time, idx) => (
                    <div
                      key={`start-${idx}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-300 ${idx === currentStep.s
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10"
                        : idx < currentStep.s
                          ? "bg-primary/5 border-primary/10 text-primary/30"
                          : "bg-muted/50 border-border text-foreground/70"
                        }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">End Times</span>
                  <span className="text-[10px] font-mono text-muted-foreground">e: {currentStep.e}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
                  {currentStep.endTimes.map((time, idx) => (
                    <div
                      key={`end-${idx}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-mono font-bold text-xs transition-all duration-300 ${idx === currentStep.e
                        ? "bg-orange-500 text-white border-orange-600 scale-110 shadow-lg z-10"
                        : idx < currentStep.e
                          ? "bg-orange-500/5 border-orange-200/30 text-orange-400/40"
                          : "bg-muted/50 border-border text-foreground/70"
                        }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted/40 rounded-2xl p-4 border border-border/50 min-h-[140px] flex flex-col justify-center gap-4">
              <div className="flex justify-center items-center gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`text-xl font-bold ${currentStep.s < currentStep.startTimes.length ? 'text-primary' : 'text-muted-foreground/30'}`}>
                    {currentStep.s < currentStep.startTimes.length ? currentStep.startTimes[currentStep.s] : '—'}
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Next Start</div>
                </div>

                <div className="text-2xl font-light text-muted-foreground/30">
                  {currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length ? (
                    currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e] ? '<' : '≥'
                  ) : ''}
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className={`text-xl font-bold ${currentStep.e < currentStep.endTimes.length ? 'text-orange-500' : 'text-muted-foreground/30'}`}>
                    {currentStep.e < currentStep.endTimes.length ? currentStep.endTimes[currentStep.e] : '—'}
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Earliest End</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-tight transition-all duration-300 ${currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length
                  ? (currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e]
                    ? "bg-primary text-white shadow-sm border border-primary/20"
                    : "bg-orange-500 text-white shadow-sm border border-orange-600")
                  : "opacity-0 invisible"
                  }`}>
                  {currentStep.s < currentStep.startTimes.length && currentStep.e < currentStep.endTimes.length
                    ? (currentStep.startTimes[currentStep.s] < currentStep.endTimes[currentStep.e]
                      ? "Allocate New Room"
                      : "Free Available Room")
                    : ""
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-muted/50 rounded-lg text-[11px] leading-relaxed text-foreground border border-border/50 shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[9px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.message}
          </div>

          <div className="mt-auto pt-4">
            <VariablePanel variables={currentStep.variables} />
          </div>
        </Card>


        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={currentStep.highlightedLines}
        />
      </div>

    </div >
  );
};