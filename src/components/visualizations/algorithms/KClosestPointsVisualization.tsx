import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Info, HelpCircle } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface HeapNode {
  distance: number;
  x: number;
  y: number;
}

interface Step {
  minHeap: HeapNode[];
  result: number[][];
  points: number[][];
  activePointIdx: number | null;
  activeDistance: number | null;
  i: number | null;
  current: HeapNode | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  pointStatuses: ('idle' | 'active' | 'heap' | 'result' | 'discarded')[];
}

const languages: VisualizationLanguageMap = {
  typescript: `function kClosest(points: number[][], k: number): number[][] {
  const minHeap: number[][] = [];
  const compare = (a: number[], b: number[]): number => {
    return a[0] - b[0];
  };
  const getDistance = (point: number[]): number => {
    return point[0] * point[0] + point[1] * point[1];
  };
  for (const point of points) {
    const distance = getDistance(point);
    minHeap.push([distance, point[0], point[1]]);
    minHeap.sort(compare);
  }
  const result: number[][] = [];
  for (let i = 0; i < k; i++) {
    const current = minHeap.shift();
    if (current) {
      result.push([current[1], current[2]]);
    }
  }
  return result;
}`,
  python: `import heapq

def kClosest(points, k):
    heap = []
    for (x, y) in points:
        dist = -(x * x + y * y)
        if len(heap) == k:
            heapq.heappushpop(heap, (dist, x, y))
        else:
            heapq.heappush(heap, (dist, x, y))
    result = []
    for (dist, x, y) in heap:
        result.append([x, y])
    return result`,
  java: `public static class Solution {
    public int[][] kClosest(int[][] points, int k) {
        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        for (int[] point : points) {
            int x = point[0];
            int y = point[1];
            int dist = (x * x) + (y * y);
            minHeap.offer(new int[]{dist, x, y});
        }
        int[][] res = new int[k][2];
        for (int i = 0; i < k; i++) {
            int[] current = minHeap.poll();
            res[i][0] = current[1];
            res[i][1] = current[2];
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> minHeap;
        for (auto& point : points) {
            int x = point[0];
            int y = point[1];
            int dist = (x * x) + (y * y);
            minHeap.push({dist, x, y});
        }
        vector<vector<int>> result;
        for (int i = 0; i < k; i++) {
            auto current = minHeap.top();
            minHeap.pop();
            result.push_back({current[1], current[2]});
        }
        return result;
    }
};`
};

export const KClosestPointsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const initialPoints = useMemo(() => [[3, 3], [5, -1], [-2, 4], [1, 2], [-1, -1]], []);
  const k = 2;

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const points = [...initialPoints];
    let heap: HeapNode[] = [];
    let result: number[][] = [];

    const getStatuses = (
      activeIdx: number | null,
      phase: 'init' | 'points' | 'pop' | 'done'
    ): ('idle' | 'active' | 'heap' | 'result' | 'discarded')[] => {
      return points.map((p, idx) => {
        const inResult = result.some(rp => rp[0] === p[0] && rp[1] === p[1]);
        if (inResult) return 'result';

        if (idx === activeIdx) return 'active';

        const inHeap = heap.some(hp => hp.x === p[0] && hp.y === p[1]);
        if (inHeap) return 'heap';

        if (phase === 'pop' || phase === 'done') {
          return 'discarded';
        }

        return 'idle';
      });
    };

    const addStep = (
      minHeap: HeapNode[],
      res: number[][],
      activePointIdx: number | null,
      activeDistance: number | null,
      i: number | null,
      current: HeapNode | null,
      explanation: string,
      pseudo: string,
      vars: any,
      status: Step['pointStatuses'],
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        minHeap,
        result: res,
        points,
        activePointIdx,
        activeDistance,
        i,
        current,
        explanation,
        pseudoStep: pseudo,
        variables: vars,
        pointStatuses: status
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    addStep(
      [], [], null, null, null, null,
      "Initialize an empty array minHeap to store the points sorted by their distance from the origin.",
      "SET minHeap = []",
      {
        points: '[[3, 3], [5, -1], [-2, 4], [1, 2], [-1, -1]]',
        k: k,
        minHeap: '[]',
        result: '[]'
      },
      points.map(() => 'idle'),
      2, 4, 3, 4
    );

    for (let idx = 0; idx < points.length; idx++) {
      const p = points[idx];
      const dist = p[0] * p[0] + p[1] * p[1];

      addStep(
        [...heap], [], idx, null, null, null,
        `Iterate over the points. Current point being evaluated is [${p[0]}, ${p[1]}].`,
        `FOR point IN points  →  point = [${p[0]}, ${p[1]}]`,
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: '[]',
          'current point': `[${p[0]}, ${p[1]}]`
        },
        getStatuses(idx, 'points'),
        9, 5, 4, 5
      );

      addStep(
        [...heap], [], idx, dist, null, null,
        `Calculate squared distance (d²) from origin for [${p[0]}, ${p[1]}]: x² + y² = ${p[0]}² + (${p[1]})² = ${p[0] * p[0]} + ${p[1] * p[1]} = ${dist}.`,
        `SET distance = point.x^2 + point.y^2  →  ${dist}`,
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: '[]',
          'current point': `[${p[0]}, ${p[1]}]`,
          'distance (d²)': dist
        },
        getStatuses(idx, 'points'),
        10, 6, 7, 8
      );

      const newHeapNode = { distance: dist, x: p[0], y: p[1] };
      heap.push(newHeapNode);
      addStep(
        [...heap], [], idx, dist, null, null,
        `Push the node [${dist}, ${p[0]}, ${p[1]}] onto the minHeap array.`,
        `CALL minHeap.push([distance, point])`,
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: '[]',
          'current point': `[${p[0]}, ${p[1]}]`,
          'distance (d²)': dist
        },
        getStatuses(idx, 'points'),
        11, 8, 8, 9
      );

      heap.sort((a, b) => a.distance - b.distance);
      addStep(
        [...heap], [], null, null, null, null,
        `Sort the minHeap ascending by distance so the closest element moves to the front. Heap is now: [${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}].`,
        "CALL minHeap.sortAscending()",
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: '[]'
        },
        getStatuses(null, 'points'),
        12, 10, 8, 9
      );
    }

    addStep(
      [...heap], [], null, null, null, null,
      "All points have been processed and sorted in the heap. Initialize an empty result array.",
      "SET result = []",
      {
        minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
        result: '[]'
      },
      getStatuses(null, 'pop'),
      14, 11, 10, 11
    );

    for (let i = 0; i < k; i++) {
      addStep(
        [...heap], [...result], null, null, i, null,
        `Check extraction loop condition: i = ${i} < k (${k}). Proceed to pull the next closest point.`,
        `FOR i FROM 0 TO k-1  →  i = ${i}`,
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: `[${result.map(r => `[${r.join(',')}]`).join(', ')}]`,
          i: i
        },
        getStatuses(null, 'pop'),
        15, 12, 11, 12
      );

      const current = heap.shift()!;
      const originalIdx = points.findIndex(pt => pt[0] === current.x && pt[1] === current.y);
      addStep(
        [...heap], [...result], originalIdx, current.distance, i, current,
        `Extract (shift) the front element from the minHeap: [${current.distance}, ${current.x}, ${current.y}] (closest remaining point).`,
        "SET current = minHeap.shift()",
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: `[${result.map(r => `[${r.join(',')}]`).join(', ')}]`,
          i: i,
          current: `[${current.distance}, ${current.x}, ${current.y}]`
        },
        getStatuses(originalIdx, 'pop'),
        16, 13, 12, 13
      );

      result.push([current.x, current.y]);
      addStep(
        [...heap], [...result], null, null, i, current,
        `Push the extracted coordinates [${current.x}, ${current.y}] to the result list.`,
        `CALL result.push([current.x, current.y])`,
        {
          minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
          result: `[${result.map(r => `[${r.join(',')}]`).join(', ')}]`,
          i: i,
          current: `[${current.distance}, ${current.x}, ${current.y}]`
        },
        getStatuses(null, 'pop'),
        18, 13, 13, 15
      );
    }

    addStep(
      [...heap], [...result], null, null, k, null,
      `Check loop condition: i = ${k} is not < k (${k}). Exit extraction loop.`,
      `FOR i FROM 0 TO k-1  →  i = ${k} (NO)`,
      {
        minHeap: `[${heap.map(h => `[${h.distance}, ${h.x}, ${h.y}]`).join(', ')}]`,
        result: `[${result.map(r => `[${r.join(',')}]`).join(', ')}]`,
        i: k
      },
      getStatuses(null, 'pop'),
      15, 12, 11, 12
    );

    addStep(
      [...heap], [...result], null, null, null, null,
      `Algorithm complete. Return the final result containing the k closest points: [${result.map(r => `[${r.join(',')}]`).join(', ')}].`,
      "RETURN result",
      {
        result: `[${result.map(r => `[${r.join(',')}]`).join(', ')}]`
      },
      getStatuses(null, 'done'),
      21, 14, 16, 17
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [initialPoints]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  // SVG dimensions & grid scaling details
  const svgSize = 320;
  const halfSize = svgSize / 2;
  const scale = 25; // 25px = 1 unit on coordinate system (-6 to +6)

  const toSvgX = (x: number) => halfSize + x * scale;
  const toSvgY = (y: number) => halfSize - y * scale;

  // Concentric circle radii based on actual distance-squared values
  const circles = [
    { name: 'd² = 2', rVal: Math.sqrt(2) },
    { name: 'd² = 5', rVal: Math.sqrt(5) },
    { name: 'd² = 18', rVal: Math.sqrt(18) },
    { name: 'd² = 20', rVal: Math.sqrt(20) },
    { name: 'd² = 26', rVal: Math.sqrt(26) },
  ];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden flex flex-col items-center">
            <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest text-center self-stretch">
              X-Y Coordinate Plane
            </h3>

            <div className="relative border border-border/60 bg-muted/10 rounded-2xl p-2 w-[340px] h-[340px] flex items-center justify-center shadow-inner">
              <svg width={svgSize} height={svgSize} className="overflow-visible select-none">
                {Array.from({ length: 13 }).map((_, idx) => {
                  const val = idx - 6;
                  if (val === 0) return null;
                  const sx = toSvgX(val);
                  const sy = toSvgY(val);
                  return (
                    <g key={`grid-${val}`}>
                      <line
                        x1={sx}
                        y1={0}
                        x2={sx}
                        y2={svgSize}
                        className="stroke-muted/30 stroke-[1]"
                        strokeDasharray="2,4"
                      />
                      <line
                        x1={0}
                        y1={sy}
                        x2={svgSize}
                        y2={sy}
                        className="stroke-muted/30 stroke-[1]"
                        strokeDasharray="2,4"
                      />
                    </g>
                  );
                })}

                <line
                  x1={0}
                  y1={halfSize}
                  x2={svgSize}
                  y2={halfSize}
                  className="stroke-muted-foreground/40 stroke-[1.5]"
                />
                <line
                  x1={halfSize}
                  y1={0}
                  x2={halfSize}
                  y2={svgSize}
                  className="stroke-muted-foreground/40 stroke-[1.5]"
                />

                {[-5, -3, 3, 5].map((val) => (
                  <g key={`axis-tick-${val}`}>
                    <line
                      x1={toSvgX(val)}
                      y1={halfSize - 3}
                      x2={toSvgX(val)}
                      y2={halfSize + 3}
                      className="stroke-muted-foreground/60 stroke-[1.5]"
                    />
                    <text
                      x={toSvgX(val)}
                      y={halfSize + 16}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-muted-foreground"
                    >
                      {val}
                    </text>

                    <line
                      x1={halfSize - 3}
                      y1={toSvgY(val)}
                      x2={halfSize + 3}
                      y2={toSvgY(val)}
                      className="stroke-muted-foreground/60 stroke-[1.5]"
                    />
                    <text
                      x={halfSize - 14}
                      y={toSvgY(val) + 3}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-muted-foreground"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {circles.map((c, idx) => {
                  const radiusPixels = c.rVal * scale;
                  const isActiveRadius = step.activeDistance !== null && Math.abs(c.rVal * c.rVal - step.activeDistance) < 0.1;
                  
                  return (
                    <circle
                      key={`circle-${idx}`}
                      cx={halfSize}
                      cy={halfSize}
                      r={radiusPixels}
                      fill="none"
                      className={`transition-all duration-100 \${
                        isActiveRadius
                          ? 'stroke-amber-500/40 stroke-[2] stroke-dash-animated'
                          : 'stroke-primary/5 stroke-[1]'
                      }`}
                      strokeDasharray={isActiveRadius ? '4,4' : '2,4'}
                    />
                  );
                })}

                <circle
                  cx={halfSize}
                  cy={halfSize}
                  r={7}
                  className="fill-indigo-500/20 stroke-indigo-500 stroke-[1.5] animate-pulse"
                />
                <circle
                  cx={halfSize}
                  cy={halfSize}
                  r={2.5}
                  className="fill-indigo-500"
                />

                {step.activePointIdx !== null && (
                  <motion.line
                    initial={{ x2: halfSize, y2: halfSize }}
                    animate={{
                      x2: toSvgX(step.points[step.activePointIdx][0]),
                      y2: toSvgY(step.points[step.activePointIdx][1]),
                    }}
                    transition={{ duration: 0 }}
                    x1={halfSize}
                    y1={halfSize}
                    className="stroke-amber-500/80 stroke-[2] stroke-dash-vector"
                    strokeDasharray="4,3"
                  />
                )}

                {step.points.map((pt, idx) => {
                  const sx = toSvgX(pt[0]);
                  const sy = toSvgY(pt[1]);
                  const status = step.pointStatuses[idx];

                  let dotClass = 'fill-muted stroke-muted-foreground/30 stroke-[1.5]';
                  let ringColor = 'transparent';

                  if (status === 'active') {
                    dotClass = 'fill-amber-500 stroke-amber-200 stroke-[2] drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]';
                    ringColor = 'rgba(245,158,11,0.4)';
                  } else if (status === 'heap') {
                    dotClass = 'fill-violet-600 stroke-violet-300 stroke-[1.5] drop-shadow-[0_0_4px_rgba(124,58,237,0.4)]';
                  } else if (status === 'result') {
                    dotClass = 'fill-emerald-500 stroke-emerald-200 stroke-[2] drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]';
                  } else if (status === 'discarded') {
                    dotClass = 'fill-slate-400/20 stroke-slate-500/20 stroke-[1]';
                  } else {
                    dotClass = 'fill-slate-400 dark:fill-zinc-600 stroke-slate-300 dark:stroke-zinc-500 stroke-[1.5]';
                  }

                  return (
                    <g key={`pt-${idx}`}>
                      {status === 'active' && (
                        <circle
                          cx={sx}
                          cy={sy}
                          r={10}
                          fill="none"
                          stroke={ringColor}
                          strokeWidth={2}
                          className="animate-ping"
                          style={{ transformOrigin: `${sx}px ${sy}px` }}
                        />
                      )}

                      <circle
                        cx={sx}
                        cy={sy}
                        r={status === 'active' ? 7.5 : 6}
                        className={`transition-all duration-100 \${dotClass}`}
                      />

                      <text
                        x={sx}
                        y={sy - 12}
                        textAnchor="middle"
                        className={`text-[9px] font-bold transition-all duration-100 \${
                          status === 'active'
                            ? 'fill-amber-500 dark:fill-amber-400 font-extrabold text-[10px]'
                            : status === 'result'
                            ? 'fill-emerald-500 dark:fill-emerald-400'
                            : status === 'discarded'
                            ? 'fill-muted-foreground/30'
                            : 'fill-foreground'
                        }`}
                      >
                        ({pt[0]}, {pt[1]})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden min-h-[96px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Interactive Guide
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium transition-all duration-100">
              {step.explanation}
            </p>
          </Card>

          <Card className="p-4 bg-card border border-border/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Min-Heap Queue Status (Sorted Ascending)
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600 border border-violet-300" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Heap Node</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 min-h-[56px] p-3 bg-muted/20 border border-dashed border-border rounded-xl">
              <AnimatePresence mode="popLayout">
                {step.minHeap.map((node, index) => (
                  <motion.div
                    key={`heap-\${node.x}-\${node.y}-\${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0 }}
                    className="flex items-center gap-1 bg-violet-600/10 dark:bg-violet-900/20 border border-violet-500/30 rounded-lg px-2.5 py-1.5 shadow-sm"
                  >
                    <span className="text-[10px] font-black text-violet-500 uppercase mr-1">
                      d²={node.distance}
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      ({node.x}, {node.y})
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {step.minHeap.length === 0 && (
                <span className="text-xs text-muted-foreground/60 py-1">
                  Heap is empty. Points will be inserted here.
                </span>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-card border border-border/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Final Closest Points (k = {k})
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300" />
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Closest K</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 min-h-[56px] p-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-dashed border-emerald-500/20 rounded-xl">
              <AnimatePresence mode="popLayout">
                {step.result.map((pt, index) => (
                  <motion.div
                    key={`res-${pt[0]}-${pt[1]}-${index}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0 }}
                    className="flex items-center bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5 shadow-sm"
                  >
                    <span className="text-xs font-mono font-black text-emerald-500 mr-1.5">
                      ✓ Closest
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      ({pt[0]}, {pt[1]})
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {step.result.length === 0 && (
                <span className="text-xs text-muted-foreground/60 py-1">
                  Result list is empty. Currently extracting...
                </span>
              )}
            </div>
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
          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden min-h-[96px] flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Interactive Guide
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium transition-all duration-100">
              {step.explanation}
            </p>
          </Card>
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
export default KClosestPointsVisualization;
