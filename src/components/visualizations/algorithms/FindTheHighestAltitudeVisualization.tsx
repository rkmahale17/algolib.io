import { useEffect, useState } from 'react';
import { Bike, Mountain, ArrowUpRight, TrendingUp } from 'lucide-react';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  altitude: number;
  maxAltitude: number;
  g?: number;
  currentIndex: number; // Index in gain array (-1 to 4)
  currentPointIndex: number; // Index of the point visited (0 to 5)
  message: string;
  lineNumber: number;
}

export const FindTheHighestAltitudeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const gain = [-5, 1, 5, 0, -7];
  const altitudes = [0, -5, -4, 1, 1, -6];

  const code = `function largestAltitude(gain: number[]): number {
  let altitude = 0;
  let maxAltitude = 0;
  for (const g of gain) {
    altitude += g;
    maxAltitude = Math.max(maxAltitude, altitude);
  }
  return maxAltitude;
}`;

  const steps: Step[] = [
    {
      altitude: 0,
      maxAltitude: 0,
      currentIndex: -1,
      currentPointIndex: 0,
      message: "The biker begins their road trip at Point 0 with an initial altitude of 0.",
      lineNumber: 1
    },
    {
      altitude: 0,
      maxAltitude: 0,
      currentIndex: -1,
      currentPointIndex: 0,
      message: "We initialize `altitude` to 0, representing the starting altitude.",
      lineNumber: 2
    },
    {
      altitude: 0,
      maxAltitude: 0,
      currentIndex: -1,
      currentPointIndex: 0,
      message: "We initialize `maxAltitude` to 0, which will track the highest altitude reached so far.",
      lineNumber: 3
    },
    {
      altitude: 0,
      maxAltitude: 0,
      g: -5,
      currentIndex: 0,
      currentPointIndex: 0,
      message: "Start the loop. The first net gain is `g = -5` between Point 0 and Point 1.",
      lineNumber: 4
    },
    {
      altitude: -5,
      maxAltitude: 0,
      g: -5,
      currentIndex: 0,
      currentPointIndex: 1,
      message: "Add `g = -5` to the current `altitude`. The biker descends to Point 1 at altitude `-5`.",
      lineNumber: 5
    },
    {
      altitude: -5,
      maxAltitude: 0,
      g: -5,
      currentIndex: 0,
      currentPointIndex: 1,
      message: "Compare the current `altitude = -5` with `maxAltitude = 0`. Since `-5` is smaller, `maxAltitude` remains `0`.",
      lineNumber: 6
    },
    {
      altitude: -5,
      maxAltitude: 0,
      g: 1,
      currentIndex: 1,
      currentPointIndex: 1,
      message: "Next loop iteration. We read the next gain `g = 1` between Point 1 and Point 2.",
      lineNumber: 4
    },
    {
      altitude: -4,
      maxAltitude: 0,
      g: 1,
      currentIndex: 1,
      currentPointIndex: 2,
      message: "Add `g = 1` to `altitude`. The biker climbs to Point 2 at altitude `-4`.",
      lineNumber: 5
    },
    {
      altitude: -4,
      maxAltitude: 0,
      g: 1,
      currentIndex: 1,
      currentPointIndex: 2,
      message: "Compare `altitude = -4` with `maxAltitude = 0`. Since `-4` is smaller, `maxAltitude` remains `0`.",
      lineNumber: 6
    },
    {
      altitude: -4,
      maxAltitude: 0,
      g: 5,
      currentIndex: 2,
      currentPointIndex: 2,
      message: "Next loop iteration. We read the next gain `g = 5` between Point 2 and Point 3.",
      lineNumber: 4
    },
    {
      altitude: 1,
      maxAltitude: 0,
      g: 5,
      currentIndex: 2,
      currentPointIndex: 3,
      message: "Add `g = 5` to `altitude`. The biker climbs to Point 3 at altitude `1`.",
      lineNumber: 5
    },
    {
      altitude: 1,
      maxAltitude: 1,
      g: 5,
      currentIndex: 2,
      currentPointIndex: 3,
      message: "Compare `altitude = 1` with `maxAltitude = 0`. Since `1 > 0`, we update `maxAltitude` to `1`!",
      lineNumber: 6
    },
    {
      altitude: 1,
      maxAltitude: 1,
      g: 0,
      currentIndex: 3,
      currentPointIndex: 3,
      message: "Next loop iteration. We read the next gain `g = 0` between Point 3 and Point 4.",
      lineNumber: 4
    },
    {
      altitude: 1,
      maxAltitude: 1,
      g: 0,
      currentIndex: 3,
      currentPointIndex: 4,
      message: "Add `g = 0` to `altitude`. The altitude at Point 4 remains `1`.",
      lineNumber: 5
    },
    {
      altitude: 1,
      maxAltitude: 1,
      g: 0,
      currentIndex: 3,
      currentPointIndex: 4,
      message: "Compare `altitude = 1` with `maxAltitude = 1`. No change, so `maxAltitude` remains `1`.",
      lineNumber: 6
    },
    {
      altitude: 1,
      maxAltitude: 1,
      g: -7,
      currentIndex: 4,
      currentPointIndex: 4,
      message: "Next loop iteration. We read the final gain `g = -7` between Point 4 and Point 5.",
      lineNumber: 4
    },
    {
      altitude: -6,
      maxAltitude: 1,
      g: -7,
      currentIndex: 4,
      currentPointIndex: 5,
      message: "Add `g = -7` to `altitude`. The biker descends to Point 5 at altitude `-6`.",
      lineNumber: 5
    },
    {
      altitude: -6,
      maxAltitude: 1,
      g: -7,
      currentIndex: 4,
      currentPointIndex: 5,
      message: "Compare `altitude = -6` with `maxAltitude = 1`. Since `-6` is smaller, `maxAltitude` remains `1`.",
      lineNumber: 6
    },
    {
      altitude: -6,
      maxAltitude: 1,
      currentIndex: 4,
      currentPointIndex: 5,
      message: "All elements processed. Return the highest altitude reached: `1`.",
      lineNumber: 8
    }
  ];

  const currentStep = steps[currentStepIndex];

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

  const currentCoords = getCoords(currentStep.currentPointIndex);
  const maxAltY = 120 - currentStep.maxAltitude * 15;

  return (
    <div className="space-y-6">
      {/* SimpleStepControls at the top */}
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visualizations, Commentary & Variables */}
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg border border-border/50 p-6 flex flex-col justify-between relative overflow-hidden">
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
                  RECORD: {currentStep.maxAltitude}
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
                  const isVisited = idx <= currentStep.currentPointIndex;
                  const isCurrentPoint = idx === currentStep.currentPointIndex;

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
              {currentStep.currentPointIndex >= 0 && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-full mb-3 flex flex-col items-center z-10 transition-all duration-150"
                  style={{
                    left: `${(currentCoords.x / 600) * 100}%`,
                    top: `${(currentCoords.y / 240) * 100}%`,
                  }}
                >
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
                    <Bike size={12} className="animate-bounce" />
                    <span>Point {currentStep.currentPointIndex}</span>
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
                {currentStep.g !== undefined && (
                  <span className="text-xs font-mono text-primary font-semibold flex items-center gap-1">
                    <ArrowUpRight size={12} />
                    Current gain g = {currentStep.g}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {gain.map((val, idx) => {
                  const isCurrent = idx === currentStep.currentIndex;
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
                  const isVisited = idx <= currentStep.currentPointIndex;
                  const isCurrentPoint = idx === currentStep.currentPointIndex;
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
          <div className="bg-accent/40 rounded-lg border border-accent/60 p-4">
            <div className="flex items-start gap-2.5">
              <TrendingUp className="text-primary h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Step Action
                </h5>
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  {currentStep.message}
                </p>
              </div>
            </div>
          </div>

          {/* VariablePanel below commentary */}
          <VariablePanel
            variables={{
              altitude: currentStep.altitude,
              maxAltitude: currentStep.maxAltitude,
              g: currentStep.g !== undefined ? currentStep.g : 'undefined',
              currentPointIndex: currentStep.currentPointIndex
            }}
          />
        </div>

        {/* Right Column: Code Editor (direct child of parent block) */}
        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
