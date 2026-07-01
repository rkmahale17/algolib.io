import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Bike, Mountain, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  altitude: number;
  maxAltitude: number;
  g?: number;
  currentIndex: number; // Index in gain array (-1 to 4)
  currentPointIndex: number; // Index of the point visited (0 to 5)
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function largestAltitude(gain: number[]): number {
  let altitude = 0;
  let maxAltitude = 0;
  for (const g of gain) {
    altitude += g;
    maxAltitude = Math.max(maxAltitude, altitude);
  }
  return maxAltitude;
}`,
  python: `def largestAltitude(gain: list[int]) -> int:
    altitude = 0
    max_altitude = 0
    for g in gain:
        altitude += g
        max_altitude = max(max_altitude, altitude)
    return max_altitude`,
  java: `public static class Solution {
    public int largestAltitude(int[] gain) {
        int currentAltitude = 0;
        int maxAltitude = 0;
        for (int g : gain) {
            currentAltitude += g;
            maxAltitude = Math.max(maxAltitude, currentAltitude);
        }
        return maxAltitude;
    }
}`,
  cpp: `class Solution {
public:
    int largestAltitude(vector<int>& gain) {
        int altitude = 0;
        int maxAltitude = 0;
        for (int g : gain) {
            altitude += g;
            maxAltitude = max(maxAltitude, altitude);
        }
        return maxAltitude;
    }
};`
};

export const FindTheHighestAltitudeVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const gain = [-5, 1, 5, 0, -7];
  const altitudes = [0, -5, -4, 1, 1, -6];

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const getVariables = (altitude: number, maxAltitude: number, g?: number, currentPointIndex?: number) => {
      return {
        altitude,
        maxAltitude,
        g: g !== undefined ? g : 'undefined',
        currentPointIndex: currentPointIndex !== undefined ? currentPointIndex : 0
      };
    };

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      explanation: string,
      pseudo: string,
      altitude: number,
      maxAltitude: number,
      g?: number,
      currentIndex?: number,
      currentPointIndex?: number
    ) => {
      s.push({
        altitude,
        maxAltitude,
        g,
        currentIndex: currentIndex !== undefined ? currentIndex : -1,
        currentPointIndex: currentPointIndex !== undefined ? currentPointIndex : 0,
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(altitude, maxAltitude, g, currentPointIndex)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      1, 1, 2, 3,
      "The biker begins their road trip at Point 0 with an initial altitude of 0.",
      "largestAltitude(gain=[-5, 1, 5, 0, -7])",
      0, 0, undefined, -1, 0
    );

    pushStep(
      2, 2, 3, 4,
      "We initialize `altitude` to 0, representing the starting altitude.",
      "altitude = 0",
      0, 0, undefined, -1, 0
    );

    pushStep(
      3, 3, 4, 5,
      "We initialize `maxAltitude` to 0, which will track the highest altitude reached so far.",
      "max_altitude = 0",
      0, 0, undefined, -1, 0
    );

    // Iteration 0
    pushStep(
      4, 4, 5, 6,
      "Start the loop. The first net gain is `g = -5` between Point 0 and Point 1.",
      "FOR g in gain  →  g = -5",
      0, 0, -5, 0, 0
    );
    pushStep(
      5, 5, 6, 7,
      "Add `g = -5` to the current `altitude`. The biker descends to Point 1 at altitude `-5`.",
      "altitude += g  →  0 + (-5) = -5",
      -5, 0, -5, 0, 1
    );
    pushStep(
      6, 6, 7, 8,
      "Compare the current `altitude = -5` with `maxAltitude = 0`. Since `-5` is smaller, `maxAltitude` remains `0`.",
      "max_altitude = max(max_altitude, altitude)  →  max(0, -5) = 0",
      -5, 0, -5, 0, 1
    );

    // Iteration 1
    pushStep(
      4, 4, 5, 6,
      "Next loop iteration. We read the next gain `g = 1` between Point 1 and Point 2.",
      "FOR g in gain  →  g = 1",
      -5, 0, 1, 1, 1
    );
    pushStep(
      5, 5, 6, 7,
      "Add `g = 1` to `altitude`. The biker climbs to Point 2 at altitude `-4`.",
      "altitude += g  →  -5 + 1 = -4",
      -4, 0, 1, 1, 2
    );
    pushStep(
      6, 6, 7, 8,
      "Compare `altitude = -4` with `maxAltitude = 0`. Since `-4` is smaller, `maxAltitude` remains `0`.",
      "max_altitude = max(max_altitude, altitude)  →  max(0, -4) = 0",
      -4, 0, 1, 1, 2
    );

    // Iteration 2
    pushStep(
      4, 4, 5, 6,
      "Next loop iteration. We read the next gain `g = 5` between Point 2 and Point 3.",
      "FOR g in gain  →  g = 5",
      -4, 0, 5, 2, 2
    );
    pushStep(
      5, 5, 6, 7,
      "Add `g = 5` to `altitude`. The biker climbs to Point 3 at altitude `1`.",
      "altitude += g  →  -4 + 5 = 1",
      1, 0, 5, 2, 3
    );
    pushStep(
      6, 6, 7, 8,
      "Compare `altitude = 1` with `maxAltitude = 0`. Since `1 > 0`, we update `maxAltitude` to `1`!",
      "max_altitude = max(max_altitude, altitude)  →  max(0, 1) = 1",
      1, 1, 5, 2, 3
    );

    // Iteration 3
    pushStep(
      4, 4, 5, 6,
      "Next loop iteration. We read the next gain `g = 0` between Point 3 and Point 4.",
      "FOR g in gain  →  g = 0",
      1, 1, 0, 3, 3
    );
    pushStep(
      5, 5, 6, 7,
      "Add `g = 0` to `altitude`. The altitude at Point 4 remains `1`.",
      "altitude += g  →  1 + 0 = 1",
      1, 1, 0, 3, 4
    );
    pushStep(
      6, 6, 7, 8,
      "Compare `altitude = 1` with `maxAltitude = 1`. No change, so `maxAltitude` remains `1`.",
      "max_altitude = max(max_altitude, altitude)  →  max(1, 1) = 1",
      1, 1, 0, 3, 4
    );

    // Iteration 4
    pushStep(
      4, 4, 5, 6,
      "Next loop iteration. We read the final gain `g = -7` between Point 4 and Point 5.",
      "FOR g in gain  →  g = -7",
      1, 1, -7, 4, 4
    );
    pushStep(
      5, 5, 6, 7,
      "Add `g = -7` to `altitude`. The biker descends to Point 5 at altitude `-6`.",
      "altitude += g  →  1 + (-7) = -6",
      -6, 1, -7, 4, 5
    );
    pushStep(
      6, 6, 7, 8,
      "Compare `altitude = -6` with `maxAltitude = 1`. Since `-6` is smaller, `maxAltitude` remains `1`.",
      "max_altitude = max(max_altitude, altitude)  →  max(1, -6) = 1",
      -6, 1, -7, 4, 5
    );

    pushStep(
      8, 7, 9, 10,
      "All elements processed. Return the highest altitude reached: `1`.",
      "RETURN max_altitude  →  1",
      -6, 1, undefined, 4, 5
    );

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  // Map altitude values to Y coordinates for SVG representation
  // viewBox width is 600, height is 240
  const getCoords = (idx: number) => {
    const x = 50 + idx * 100;
    // Sea level is at Y=120. Scale: 15px per altitude unit.
    const y = 120 - altitudes[idx] * 15;
    return { x, y };
  };

  const pathD = altitudes
    .map((_, idx) => {
      const { x, y } = getCoords(idx);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const currentCoords = getCoords(step.currentPointIndex);
  const maxAltY = 120 - step.maxAltitude * 15;

  return (
    <div className="space-y-6">
      <VisualizationLayout
        controls={
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        }
        leftContent={
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mountain className="text-primary h-5 w-5" />
                  <h3 className="text-sm font-semibold text-foreground">Elevation Profile</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full" /> Altitude
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 border-t border-dashed border-amber-500" /> Max Altitude Record
                  </span>
                </div>
              </div>

              {/* SVG Elevation Path */}
              <div className="relative w-full h-[240px] border border-border/30 rounded bg-background/50 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                  {/* Horizontal Sea Level line */}
                  <line
                    x1="20"
                    y1="120"
                    x2="580"
                    y2="120"
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text x="25" y="115" className="text-[10px] fill-muted-foreground font-mono">
                    Sea Level (0)
                  </text>

                  {/* Dynamic Max Altitude line */}
                  <line
                    x1="20"
                    y1={maxAltY}
                    x2="580"
                    y2={maxAltY}
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <text x="500" y={maxAltY - 6} className="text-[10px] fill-amber-500 font-bold font-mono">
                    RECORD: {step.maxAltitude}
                  </text>

                  {/* Elevation profile line path */}
                  <path
                    d={pathD}
                    stroke="var(--primary)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points/Milestones along the road trip */}
                  {altitudes.map((alt, idx) => {
                    const { x, y } = getCoords(idx);
                    const isVisited = idx <= step.currentPointIndex;
                    const isCurrentPoint = idx === step.currentPointIndex;

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isCurrentPoint ? "7" : "5"}
                          className={`transition-all duration-300 ${
                            isCurrentPoint
                              ? "fill-amber-500 stroke-background stroke-2"
                              : isVisited
                              ? "fill-primary stroke-background stroke-1"
                              : "fill-muted border stroke-muted-foreground/30"
                          }`}
                        />
                        {/* Altitude label for the point */}
                        {isVisited && (
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-semibold fill-foreground"
                          >
                            {alt}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating Biker overlay widget */}
                {step.currentPointIndex >= 0 && (
                  <div
                    className="absolute -translate-x-1/2 -translate-y-full mb-3 flex flex-col items-center z-10 transition-all duration-150"
                    style={{
                      left: `${(currentCoords.x / 600) * 100}%`,
                      top: `${(currentCoords.y / 240) * 100}%`,
                    }}
                  >
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
                      <Bike size={12} className="animate-bounce" />
                      <span>Point {step.currentPointIndex}</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-primary rotate-45 -mt-1" />
                  </div>
                )}
              </div>

              {/* Input Array Visualizer */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gain Array (Gains between points)
                  </h4>
                  {step.g !== undefined && (
                    <span className="text-xs font-mono text-primary font-semibold flex items-center gap-1">
                      <ArrowUpRight size={12} />
                      Current gain g = {step.g}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {gain.map((val, idx) => {
                    const isCurrent = idx === step.currentIndex;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 text-center py-2.5 rounded-lg border font-mono text-sm transition-all duration-150 ${
                          isCurrent
                            ? 'bg-primary border-primary text-primary-foreground font-bold shadow-md scale-105'
                            : 'bg-muted/30 border-border text-muted-foreground'
                        }`}
                      >
                        {val > 0 ? `+${val}` : val}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Altitude Sequence Progress */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-muted-foreground">
                  Sequence of Altitudes
                </h4>
                <div className="flex items-center gap-2">
                  {altitudes.map((alt, idx) => {
                    const isVisited = idx <= step.currentPointIndex;
                    const isCurrentPoint = idx === step.currentPointIndex;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 text-center py-2 rounded border font-mono text-sm transition-all duration-150 ${
                          isCurrentPoint
                            ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-md scale-105'
                            : isVisited
                            ? 'bg-primary/20 border-primary/30 text-foreground'
                            : 'opacity-30 border-dashed border-border text-muted-foreground'
                        }`}
                      >
                        {isVisited ? alt : '?'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Commentary Box at the bottom */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </Card>

            {/* VariablePanel below commentary */}
            <VariablePanel variables={step.variables} />
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
export default FindTheHighestAltitudeVisualization;
