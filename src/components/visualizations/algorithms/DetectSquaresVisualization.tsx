import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, Plus, Hash, Target, Eye, Database } from 'lucide-react';

interface Step {
  operation: string;
  args?: number[];
  pts: number[][];
  ptsCount: Record<string, number>;
  activeOp: number;
  lineNumber: number[];
  explanation: string;
  variables: Record<string, any>;
  queryPoint?: number[] | null;
  currentPoint?: number[] | null;
  diagonalPoint?: number[] | null;
  corner1?: number[] | null;
  corner2?: number[] | null;
  corner1Count?: number;
  corner2Count?: number;
  product?: number;
  res?: number;
}

const OPERATIONS = [
  { name: 'Constructor()', type: 'init' },
  { name: 'add([3, 10])', type: 'add', val: [3, 10] },
  { name: 'add([11, 2])', type: 'add', val: [11, 2] },
  { name: 'add([3, 2])', type: 'add', val: [3, 2] },
  { name: 'count([11, 10])', type: 'count', val: [11, 10] },
  { name: 'count([14, 8])', type: 'count', val: [14, 8] },
  { name: 'add([11, 2])', type: 'add', val: [11, 2] },
  { name: 'count([11, 10])', type: 'count', val: [11, 10] },
];

export const DetectSquaresVisualization: React.FC = () => {
  const code = `class DetectSquares {
    private ptsCount: Map<string, number>;
    private pts: number[][];

    constructor() {
        this.ptsCount = new Map();
        this.pts = [];
    }

    add(point: number[]): void {
        const key = \`\${point[0]},\${point[1]}\`;
        this.ptsCount.set(key, (this.ptsCount.get(key) || 0) + 1);
        this.pts.push(point);
    }

    count(point: number[]): number {
        let res = 0;
        const [px, py] = point;

        for (const [x, y] of this.pts) {
            if (
                Math.abs(py - y) !== Math.abs(px - x) ||
                x === px ||
                y === py
            ) {
                continue;
            }

            const count1 = this.ptsCount.get(\`\${x},\${py}\`) || 0;
            const count2 = this.ptsCount.get(\`\${px},\${y}\`) || 0;

            res += count1 * count2;
        }

        return res;
    }
}`;

  const steps: Step[] = [
    {
      operation: 'Constructor()',
      pts: [],
      ptsCount: {},
      activeOp: 0,
      lineNumber: [5, 6, 7, 8],
      explanation: 'We initialize an empty DetectSquares instance. Inside, we create ptsCount (a map to count frequencies of added coordinates) and pts (an array of all added points).',
      variables: {
        pts: '[]',
        ptsCount: '{}',
      },
    },
    {
      operation: 'add([3, 10])',
      args: [3, 10],
      pts: [[3, 10]],
      ptsCount: { '3,10': 1 },
      activeOp: 1,
      lineNumber: [10, 11, 12, 13],
      explanation: 'We add the point [3, 10] to the stream. The point\'s count is updated to 1 in the frequency map ptsCount, and the point is pushed to the pts array.',
      variables: {
        point: '[3, 10]',
        pts: '[[3, 10]]',
        ptsCount: '{"3,10": 1}',
      },
    },
    {
      operation: 'add([11, 2])',
      args: [11, 2],
      pts: [[3, 10], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 1 },
      activeOp: 2,
      lineNumber: [10, 11, 12, 13],
      explanation: 'We add the point [11, 2] to the stream. Its count is initialized to 1 in ptsCount, and it is appended to the pts array.',
      variables: {
        point: '[11, 2]',
        pts: '[[3, 10], [11, 2]]',
        ptsCount: '{"3,10": 1, "11,2": 1}',
      },
    },
    {
      operation: 'add([3, 2])',
      args: [3, 2],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 3,
      lineNumber: [10, 11, 12, 13],
      explanation: 'We add the point [3, 2] to the stream. Its count is initialized to 1, and it is added to the pts array.',
      variables: {
        point: '[3, 2]',
        pts: '[[3, 10], [11, 2], [3, 2]]',
        ptsCount: '{"3,10": 1, "11,2": 1, "3,2": 1}',
      },
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 4,
      lineNumber: [16, 17, 18],
      explanation: 'We call count([11, 10]). We initialize the running result res = 0 and extract the query coordinates px = 11 and py = 10.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
      },
      queryPoint: [11, 10],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 4,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We iterate through pts. First, we examine [3, 10]. It lies on the same horizontal axis as the query point (y === py since 10 === 10). A square must have positive area, so it cannot form a diagonal. We skip it.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
        x: 3,
        y: 10,
      },
      queryPoint: [11, 10],
      currentPoint: [3, 10],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 4,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'Next, we examine [11, 2]. It lies on the same vertical axis as the query point (x === px since 11 === 11). We skip it.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
        x: 11,
        y: 2,
      },
      queryPoint: [11, 10],
      currentPoint: [11, 2],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 4,
      lineNumber: [20, 29, 30, 32],
      explanation: 'Next, we examine [3, 2]. The absolute horizontal and vertical distances are equal (abs(11 - 3) = 8 and abs(10 - 2) = 8). It is a valid diagonal corner! To complete the square, the other two corners must be [3, 10] and [11, 2]. We retrieve their frequencies (1 for each) and add count([3, 10]) * count([11, 2]) = 1 * 1 = 1 to res.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 1,
        x: 3,
        y: 2,
        'count([3, 10])': 1,
        'count([11, 2])': 1,
        product: 1,
      },
      queryPoint: [11, 10],
      currentPoint: [3, 2],
      diagonalPoint: [3, 2],
      corner1: [3, 10],
      corner2: [11, 2],
      corner1Count: 1,
      corner2Count: 1,
      product: 1,
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 4,
      lineNumber: [35],
      explanation: 'We finish iterating through the points. We return the final value of res, which is 1.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 1,
      },
      queryPoint: [11, 10],
      res: 1,
    },
    {
      operation: 'count([14, 8])',
      args: [14, 8],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 5,
      lineNumber: [16, 17, 18],
      explanation: 'We call count([14, 8]). We initialize res = 0 and extract the query coordinates px = 14 and py = 8.',
      variables: {
        point: '[14, 8]',
        px: 14,
        py: 8,
        res: 0,
      },
      queryPoint: [14, 8],
    },
    {
      operation: 'count([14, 8])',
      args: [14, 8],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 5,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine [3, 10]. The horizontal distance (11) does not equal the vertical distance (2). It is not diagonal, so we skip it.',
      variables: {
        point: '[14, 8]',
        px: 14,
        py: 8,
        res: 0,
        x: 3,
        y: 10,
      },
      queryPoint: [14, 8],
      currentPoint: [3, 10],
    },
    {
      operation: 'count([14, 8])',
      args: [14, 8],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 5,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine [11, 2]. The horizontal distance (3) does not equal the vertical distance (6). It is not diagonal, so we skip it.',
      variables: {
        point: '[14, 8]',
        px: 14,
        py: 8,
        res: 0,
        x: 11,
        y: 2,
      },
      queryPoint: [14, 8],
      currentPoint: [11, 2],
    },
    {
      operation: 'count([14, 8])',
      args: [14, 8],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 5,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine [3, 2]. The horizontal distance (11) does not equal the vertical distance (6). It is not diagonal, so we skip it.',
      variables: {
        point: '[14, 8]',
        px: 14,
        py: 8,
        res: 0,
        x: 3,
        y: 2,
      },
      queryPoint: [14, 8],
      currentPoint: [3, 2],
    },
    {
      operation: 'count([14, 8])',
      args: [14, 8],
      pts: [[3, 10], [11, 2], [3, 2]],
      ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
      activeOp: 5,
      lineNumber: [35],
      explanation: 'We finish iterating through the points. None of them could form an axis-aligned square with [14, 8], so we return res = 0.',
      variables: {
        point: '[14, 8]',
        px: 14,
        py: 8,
        res: 0,
      },
      queryPoint: [14, 8],
      res: 0,
    },
    {
      operation: 'add([11, 2])',
      args: [11, 2],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 6,
      lineNumber: [10, 11, 12, 13],
      explanation: 'We add another point at [11, 2] to the stream. Duplicate points are allowed, so the count of [11, 2] in ptsCount is incremented to 2, and the point is pushed to pts.',
      variables: {
        point: '[11, 2]',
        pts: '[[3, 10], [11, 2], [3, 2], [11, 2]]',
        ptsCount: '{"3,10": 1, "11,2": 2, "3,2": 1}',
      },
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [16, 17, 18],
      explanation: 'We query count([11, 10]) again. We initialize res = 0 and extract px = 11, py = 10.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
      },
      queryPoint: [11, 10],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine [3, 10]. It lies on the same row as the query point (y === py). We skip it.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
        x: 3,
        y: 10,
      },
      queryPoint: [11, 10],
      currentPoint: [3, 10],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine the first copy of [11, 2] in our points. It lies on the same column as the query point (x === px). We skip it.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 0,
        x: 11,
        y: 2,
      },
      queryPoint: [11, 10],
      currentPoint: [11, 2],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [20, 29, 30, 32],
      explanation: 'Next, we examine [3, 2]. This is diagonal to [11, 10] (distance 8). We find the other two corners: [3, 10] with count 1, and [11, 2] with count 2. We add count([3, 10]) * count([11, 2]) = 1 * 2 = 2 to res. The running sum res becomes 2.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 2,
        x: 3,
        y: 2,
        'count([3, 10])': 1,
        'count([11, 2])': 2,
        product: 2,
      },
      queryPoint: [11, 10],
      currentPoint: [3, 2],
      diagonalPoint: [3, 2],
      corner1: [3, 10],
      corner2: [11, 2],
      corner1Count: 1,
      corner2Count: 2,
      product: 2,
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [20, 21, 22, 23, 24, 25, 26],
      explanation: 'We examine the second copy of [11, 2] in our points. It lies on the same column as the query point (x === px). We skip it.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 2,
        x: 11,
        y: 2,
      },
      queryPoint: [11, 10],
      currentPoint: [11, 2],
    },
    {
      operation: 'count([11, 10])',
      args: [11, 10],
      pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
      ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
      activeOp: 7,
      lineNumber: [35],
      explanation: 'We finish iterating. We return the final value of res, which is 2.',
      variables: {
        point: '[11, 10]',
        px: 11,
        py: 10,
        res: 2,
      },
      queryPoint: [11, 10],
      res: 2,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // SVG coordinate grid parameters
  const GRID_SIZE = 15;
  const PADDING = 35;
  const WIDTH = 440;
  const HEIGHT = 440;
  const GRID_WIDTH = WIDTH - PADDING * 2;
  const GRID_HEIGHT = HEIGHT - PADDING * 2;
  const CELL_SIZE = GRID_WIDTH / GRID_SIZE;

  const getScreenCoords = (x: number, y: number) => {
    const sx = PADDING + x * CELL_SIZE;
    const sy = HEIGHT - PADDING - y * CELL_SIZE;
    return { x: sx, y: sy };
  };

  const getOpIcon = (type: string) => {
    switch (type) {
      case 'init':
        return <Database className="w-3.5 h-3.5" />;
      case 'add':
        return <Plus className="w-3.5 h-3.5" />;
      case 'count':
        return <Hash className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const labelUnits = [0, 3, 6, 9, 12, 15];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Operation Sequence Flow */}
          <Card className="p-4 bg-card border border-border/50 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Operation Sequence
            </span>
            <div className="flex flex-wrap gap-2">
              {OPERATIONS.map((op, idx) => {
                const isActive = currentStep.activeOp === idx;
                const isProcessed = idx < currentStep.activeOp;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all duration-0 ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(var(--primary),0.3)] ring-2 ring-primary/20 scale-105 z-10'
                        : isProcessed
                        ? 'bg-muted/40 border-muted text-muted-foreground opacity-60'
                        : 'bg-card border-border text-foreground/80'
                    }`}
                  >
                    {getOpIcon(op.type)}
                    <span>{op.name}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Coordinate Grid Card */}
          <Card className="p-6 bg-card border border-border/50 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 self-start">
              X-Y Plane Visualization
            </span>

            <div className="relative bg-muted/5 rounded-xl border border-border/30 p-2">
              <svg width={WIDTH} height={HEIGHT} className="max-w-full">
                {/* Vertical Grid Lines */}
                {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => {
                  const { x, y: y1 } = getScreenCoords(i, 0);
                  const { y: y2 } = getScreenCoords(i, GRID_SIZE);
                  return (
                    <line
                      key={`v-${i}`}
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke="currentColor"
                      strokeWidth={i === 0 ? 2 : 1}
                      className={i === 0 ? 'text-muted-foreground/60' : 'text-border/30'}
                    />
                  );
                })}

                {/* Horizontal Grid Lines */}
                {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => {
                  const { x: x1, y } = getScreenCoords(0, i);
                  const { x: x2 } = getScreenCoords(GRID_SIZE, i);
                  return (
                    <line
                      key={`h-${i}`}
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth={i === 0 ? 2 : 1}
                      className={i === 0 ? 'text-muted-foreground/60' : 'text-border/30'}
                    />
                  );
                })}

                {/* X-Axis ticks/labels */}
                {labelUnits.map((val) => {
                  const { x, y } = getScreenCoords(val, 0);
                  return (
                    <g key={`x-tick-${val}`}>
                      <line x1={x} y1={y} x2={x} y2={y + 4} stroke="currentColor" className="text-muted-foreground" />
                      <text
                        x={x}
                        y={y + 16}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-muted-foreground font-bold"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Y-Axis ticks/labels */}
                {labelUnits.map((val) => {
                  const { x, y } = getScreenCoords(0, val);
                  return (
                    <g key={`y-tick-${val}`}>
                      <line x1={x} y1={y} x2={x - 4} y2={y} stroke="currentColor" className="text-muted-foreground" />
                      <text
                        x={x - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[10px] font-mono fill-muted-foreground font-bold"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Axes Labels */}
                <text
                  x={WIDTH - PADDING}
                  y={HEIGHT - PADDING + 25}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-muted-foreground font-bold uppercase tracking-wider"
                >
                  X-Axis
                </text>
                <text
                  x={PADDING - 10}
                  y={PADDING - 15}
                  textAnchor="start"
                  className="text-[10px] font-mono fill-muted-foreground font-bold uppercase tracking-wider"
                >
                  Y-Axis
                </text>

                {/* Draw squares if a diagonal corner is found */}
                {currentStep.diagonalPoint && currentStep.queryPoint && currentStep.corner1 && currentStep.corner2 && (
                  (() => {
                    const pQuery = getScreenCoords(currentStep.queryPoint[0], currentStep.queryPoint[1]);
                    const pCorner1 = getScreenCoords(currentStep.corner1[0], currentStep.corner1[1]);
                    const pDiag = getScreenCoords(currentStep.diagonalPoint[0], currentStep.diagonalPoint[1]);
                    const pCorner2 = getScreenCoords(currentStep.corner2[0], currentStep.corner2[1]);
                    
                    const pointsStr = `${pQuery.x},${pQuery.y} ${pCorner1.x},${pCorner1.y} ${pDiag.x},${pDiag.y} ${pCorner2.x},${pCorner2.y}`;

                    return (
                      <g>
                        {/* Shaded Square Area */}
                        <polygon
                          points={pointsStr}
                          className="fill-indigo-500/10 stroke-indigo-500 stroke-2"
                          strokeDasharray="4 4"
                        />
                        
                        {/* Query-to-corners paths */}
                        <path
                          d={`M ${pCorner1.x} ${pCorner1.y} L ${pQuery.x} ${pQuery.y} L ${pCorner2.x} ${pCorner2.y}`}
                          fill="none"
                          className="stroke-emerald-500"
                          strokeWidth={2.5}
                        />
                        {/* Corner-to-diagonal paths */}
                        <path
                          d={`M ${pCorner1.x} ${pCorner1.y} L ${pDiag.x} ${pDiag.y} L ${pCorner2.x} ${pCorner2.y}`}
                          fill="none"
                          className="stroke-indigo-400"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                        />
                      </g>
                    );
                  })()
                )}

                {/* Plot existing points in database */}
                {Object.entries(currentStep.ptsCount).map(([key, count]) => {
                  if (count <= 0) return null;
                  const [xStr, yStr] = key.split(',');
                  const x = parseInt(xStr, 10);
                  const y = parseInt(yStr, 10);
                  const { x: sx, y: sy } = getScreenCoords(x, y);

                  const isQuery = currentStep.queryPoint && currentStep.queryPoint[0] === x && currentStep.queryPoint[1] === y;
                  const isCurrent = currentStep.currentPoint && currentStep.currentPoint[0] === x && currentStep.currentPoint[1] === y;
                  const isCorner = (currentStep.corner1 && currentStep.corner1[0] === x && currentStep.corner1[1] === y) ||
                                   (currentStep.corner2 && currentStep.corner2[0] === x && currentStep.corner2[1] === y);

                  let fillClass = 'fill-primary/80 stroke-primary';
                  if (isCurrent) {
                    fillClass = 'fill-amber-500 stroke-amber-600';
                  } else if (isCorner) {
                    fillClass = 'fill-indigo-500 stroke-indigo-600';
                  }

                  return (
                    <g key={`pt-${key}`}>
                      <circle
                        cx={sx}
                        cy={sy}
                        r={6}
                        className={`${fillClass} stroke-2 transition-all duration-0`}
                      />
                      {count > 1 && (
                        <text
                          x={sx + 8}
                          y={sy - 4}
                          className="text-[10px] font-bold fill-foreground font-mono"
                        >
                          x{count}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Highlight non-matching current loop inspection point */}
                {currentStep.currentPoint && !currentStep.diagonalPoint && (() => {
                  const { x, y } = getScreenCoords(currentStep.currentPoint[0], currentStep.currentPoint[1]);
                  return (
                    <g>
                      <circle
                        cx={x}
                        cy={y}
                        r={9}
                        className="fill-none stroke-amber-500 stroke-2"
                      />
                      {/* Red cross out showing skip */}
                      <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} className="stroke-destructive stroke-2" />
                      <line x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5} className="stroke-destructive stroke-2" />
                      <text
                        x={x + 10}
                        y={y - 8}
                        className="text-[9px] font-semibold fill-amber-600 dark:fill-amber-400 font-mono"
                      >
                        Skip
                      </text>
                    </g>
                  );
                })()}

                {/* Draw labels for diagonal corners if match found */}
                {currentStep.diagonalPoint && (() => {
                  const { x, y } = getScreenCoords(currentStep.diagonalPoint[0], currentStep.diagonalPoint[1]);
                  return (
                    <g>
                      <circle cx={x} cy={y} r={9} className="fill-none stroke-amber-500 stroke-2" />
                      <text
                        x={x + 10}
                        y={y - 8}
                        className="text-[9px] font-bold fill-amber-600 dark:fill-amber-400 font-mono"
                      >
                        Diagonal
                      </text>
                    </g>
                  );
                })()}

                {currentStep.corner1 && (() => {
                  const { x, y } = getScreenCoords(currentStep.corner1[0], currentStep.corner1[1]);
                  return (
                    <g>
                      <circle cx={x} cy={y} r={8} className="fill-none stroke-indigo-400 stroke-2" />
                      <text
                        x={x - 12}
                        y={y - 10}
                        className="text-[9px] font-semibold fill-indigo-500 dark:fill-indigo-300 font-mono bg-background"
                      >
                        C1 (x={currentStep.corner1[0]}, y={currentStep.corner1[1]}) count={currentStep.corner1Count}
                      </text>
                    </g>
                  );
                })()}

                {currentStep.corner2 && (() => {
                  const { x, y } = getScreenCoords(currentStep.corner2[0], currentStep.corner2[1]);
                  return (
                    <g>
                      <circle cx={x} cy={y} r={8} className="fill-none stroke-indigo-400 stroke-2" />
                      <text
                        x={x + 10}
                        y={y + 12}
                        className="text-[9px] font-semibold fill-indigo-500 dark:fill-indigo-300 font-mono bg-background"
                      >
                        C2 (x={currentStep.corner2[0]}, y={currentStep.corner2[1]}) count={currentStep.corner2Count}
                      </text>
                    </g>
                  );
                })()}

                {/* Draw query point */}
                {currentStep.queryPoint && (() => {
                  const { x, y } = getScreenCoords(currentStep.queryPoint[0], currentStep.queryPoint[1]);
                  return (
                    <g>
                      <circle
                        cx={x}
                        cy={y}
                        r={9}
                        className="fill-emerald-500/20 stroke-emerald-500 stroke-2"
                      />
                      <circle cx={x} cy={y} r={4} className="fill-emerald-600 stroke-background stroke-2" />
                      <text
                        x={x + 10}
                        y={y + 14}
                        className="text-[9.5px] font-bold fill-emerald-600 dark:fill-emerald-400 font-mono"
                      >
                        Query Point ({currentStep.queryPoint[0]}, {currentStep.queryPoint[1]})
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </Card>

          {/* Narrative Commentary Box - Positioned at the bottom (Rule 13) */}
          <Card className="p-4 border-l-4 border-primary bg-accent/40 shadow-sm flex items-center min-h-[70px]">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Narrative
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90">
                  {currentStep.explanation}
                </p>
              </div>
            </div>
          </Card>

          {/* VariablePanel - Positioned below commentary box (Rule 13) */}
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      rightContent={
        <div className="h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={currentStep.lineNumber}
            language="typescript"
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
