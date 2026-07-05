import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info, Plus, Hash, Target, Eye, Database } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  operation: string;
  args?: number[];
  pts: number[][];
  ptsCount: Record<string, number>;
  activeOp: number;
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
  pseudoStep: string;
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

const languages: VisualizationLanguageMap = {
  typescript: `class DetectSquares {
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
}`,
  python: `import collections

class DetectSquares:
    def __init__(self):
        self.ptsCount = collections.defaultdict(int)
        self.pts = []
    def add(self, point: list[int]) -> None:
        x, y = point
        self.ptsCount[(x, y)] += 1
        self.pts.append(point)
    def count(self, point: list[int]) -> int:
        res = 0
        px, py = point
        for x, y in self.pts:
            dx = abs(px - x)
            dy = abs(py - y)
            if x == px or y == py or dx != dy:
                continue
            count1 = self.ptsCount[(x, py)]
            count2 = self.ptsCount[(px, y)]
            res += count1 * count2
        return res`,
  java: `class DetectSquares {
    private Map<String, Integer> ptsCount;
    private List<int[]> pts;
    public DetectSquares() {
        ptsCount = new HashMap<>();
        pts = new ArrayList<>();
    }
    public void add(int[] point) {
        String key = point[0] + "," + point[1];
        ptsCount.put(key, ptsCount.getOrDefault(key, 0) + 1);
        pts.add(point);
    }
    public int count(int[] point) {
        int res = 0;
        int px = point[0];
        int py = point[1];
        for (int[] p : pts) {
            int x = p[0];
            int y = p[1];
            if (Math.abs(py - y) != Math.abs(px - x) || x == px || y == py) {
                continue;
            }
            String key1 = x + "," + py;
            String key2 = px + "," + y;
            int count1 = ptsCount.getOrDefault(key1, 0);
            int count2 = ptsCount.getOrDefault(key2, 0);
            res += count1 * count2;
        }
        return res;
    }
}`,
  cpp: `class DetectSquares {
private:
    unordered_map<string, int> ptsCount;
    vector<vector<int>> pts;
    string getKey(int x, int y) {
        return to_string(x) + "," + to_string(y);
    }
public:
    DetectSquares() {
    }
    void add(vector<int> point) {
        int x = point[0];
        int y = point[1];
        string key = getKey(x, y);
        ptsCount[key]++; 
        pts.push_back(point);
    }
    int count(vector<int> point) {
        int res = 0;
        int px = point[0];
        int py = point[1];
        for (const auto& p : pts) {
            int x = p[0];
            int y = p[1];
            int sideLength = abs(px - x);
            if (sideLength == 0 || sideLength != abs(py - y)) {
                continue;
            }
            string key1 = getKey(x, py);
            string key2 = getKey(px, y);
            int count1 = ptsCount.count(key1) ? ptsCount[key1] : 0;
            int count2 = ptsCount.count(key2) ? ptsCount[key2] : 0;
            res += count1 * count2;
        }
        return res;
    }
};`
};

export const DetectSquaresVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const pushStep = (
      ts: number, py: number, jv: number, cp: number,
      opName: string,
      explanation: string,
      pseudo: string,
      opts: Partial<Step> = {}
    ) => {
      s.push({
        operation: opName,
        pts: opts.pts || [],
        ptsCount: opts.ptsCount || {},
        activeOp: opts.activeOp || 0,
        explanation,
        variables: opts.variables || {},
        pseudoStep: pseudo,
        args: opts.args,
        queryPoint: opts.queryPoint,
        currentPoint: opts.currentPoint,
        diagonalPoint: opts.diagonalPoint,
        corner1: opts.corner1,
        corner2: opts.corner2,
        corner1Count: opts.corner1Count,
        corner2Count: opts.corner2Count,
        product: opts.product,
        res: opts.res
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      4, 4, 4, 9,
      'Constructor()',
      'We initialize an empty DetectSquares instance. Inside, we create ptsCount (a map to count frequencies of added coordinates) and pts (an array of all added points).',
      'DetectSquares()',
      {
        pts: [],
        ptsCount: {},
        activeOp: 0,
        variables: {
          pts: '[]',
          ptsCount: '{}',
        }
      }
    );

    pushStep(
      8, 7, 8, 11,
      'add([3, 10])',
      'We add the point [3, 10] to the stream. The point\'s count is updated to 1 in the frequency map ptsCount, and the point is pushed to the pts array.',
      'add(point=[3, 10])',
      {
        args: [3, 10],
        pts: [[3, 10]],
        ptsCount: { '3,10': 1 },
        activeOp: 1,
        variables: {
          point: '[3, 10]',
          pts: '[[3, 10]]',
          ptsCount: '{"3,10": 1}',
        }
      }
    );

    pushStep(
      8, 7, 8, 11,
      'add([11, 2])',
      'We add the point [11, 2] to the stream. Its count is initialized to 1 in ptsCount, and it is appended to the pts array.',
      'add(point=[11, 2])',
      {
        args: [11, 2],
        pts: [[3, 10], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 1 },
        activeOp: 2,
        variables: {
          point: '[11, 2]',
          pts: '[[3, 10], [11, 2]]',
          ptsCount: '{"3,10": 1, "11,2": 1}',
        }
      }
    );

    pushStep(
      8, 7, 8, 11,
      'add([3, 2])',
      'We add the point [3, 2] to the stream. Its count is initialized to 1, and it is added to the pts array.',
      'add(point=[3, 2])',
      {
        args: [3, 2],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 3,
        variables: {
          point: '[3, 2]',
          pts: '[[3, 10], [11, 2], [3, 2]]',
          ptsCount: '{"3,10": 1, "11,2": 1, "3,2": 1}',
        }
      }
    );

    pushStep(
      13, 11, 13, 18,
      'count([11, 10])',
      'We call count([11, 10]). We initialize the running result res = 0 and extract the query coordinates px = 11 and py = 10.',
      'count(point=[11, 10])  →  res=0',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 4,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
        },
        queryPoint: [11, 10]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([11, 10])',
      'We iterate through pts. First, we examine [3, 10]. It lies on the same horizontal axis as the query point (y === py since 10 === 10). A square must have positive area, so it cannot form a diagonal. We skip it.',
      'CHECK p=[3, 10]  →  skip (y == py)',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 4,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
          x: 3,
          y: 10,
        },
        queryPoint: [11, 10],
        currentPoint: [3, 10]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([11, 10])',
      'Next, we examine [11, 2]. It lies on the same vertical axis as the query point (x === px since 11 === 11). We skip it.',
      'CHECK p=[11, 2]  →  skip (x == px)',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 4,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
          x: 11,
          y: 2,
        },
        queryPoint: [11, 10],
        currentPoint: [11, 2]
      }
    );

    pushStep(
      24, 19, 23, 29,
      'count([11, 10])',
      'Next, we examine [3, 2]. The absolute horizontal and vertical distances are equal (abs(11 - 3) = 8 and abs(10 - 2) = 8). It is a valid diagonal corner! To complete the square, the other two corners must be [3, 10] and [11, 2]. We retrieve their frequencies (1 for each) and add count([3, 10]) * count([11, 2]) = 1 * 1 = 1 to res.',
      'MATCH p=[3, 2]  →  res += count(3, 10) * count(11, 2)  →  1 * 1 = 1',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 4,
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
        product: 1
      }
    );

    pushStep(
      28, 22, 29, 35,
      'count([11, 10])',
      'We finish iterating through the points. We return the final value of res, which is 1.',
      'RETURN res  →  1',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 4,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 1,
        },
        queryPoint: [11, 10],
        res: 1
      }
    );

    pushStep(
      13, 11, 13, 18,
      'count([14, 8])',
      'We call count([14, 8]). We initialize res = 0 and extract the query coordinates px = 14 and py = 8.',
      'count(point=[14, 8])  →  res=0',
      {
        args: [14, 8],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 5,
        variables: {
          point: '[14, 8]',
          px: 14,
          py: 8,
          res: 0,
        },
        queryPoint: [14, 8]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([14, 8])',
      'We examine [3, 10]. The horizontal distance (11) does not equal the vertical distance (2). It is not diagonal, so we skip it.',
      'CHECK p=[3, 10]  →  skip (not diagonal)',
      {
        args: [14, 8],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 5,
        variables: {
          point: '[14, 8]',
          px: 14,
          py: 8,
          res: 0,
          x: 3,
          y: 10,
        },
        queryPoint: [14, 8],
        currentPoint: [3, 10]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([14, 8])',
      'We examine [11, 2]. The horizontal distance (3) does not equal the vertical distance (6). It is not diagonal, so we skip it.',
      'CHECK p=[11, 2]  →  skip (not diagonal)',
      {
        args: [14, 8],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 5,
        variables: {
          point: '[14, 8]',
          px: 14,
          py: 8,
          res: 0,
          x: 11,
          y: 2,
        },
        queryPoint: [14, 8],
        currentPoint: [11, 2]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([14, 8])',
      'We examine [3, 2]. The horizontal distance (11) does not equal the vertical distance (6). It is not diagonal, so we skip it.',
      'CHECK p=[3, 2]  →  skip (not diagonal)',
      {
        args: [14, 8],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 5,
        variables: {
          point: '[14, 8]',
          px: 14,
          py: 8,
          res: 0,
          x: 3,
          y: 2,
        },
        queryPoint: [14, 8],
        currentPoint: [3, 2]
      }
    );

    pushStep(
      28, 22, 29, 35,
      'count([14, 8])',
      'We finish iterating through the points. None of them could form an axis-aligned square with [14, 8], so we return res = 0.',
      'RETURN res  →  0',
      {
        args: [14, 8],
        pts: [[3, 10], [11, 2], [3, 2]],
        ptsCount: { '3,10': 1, '11,2': 1, '3,2': 1 },
        activeOp: 5,
        variables: {
          point: '[14, 8]',
          px: 14,
          py: 8,
          res: 0,
        },
        queryPoint: [14, 8],
        res: 0
      }
    );

    pushStep(
      8, 7, 8, 11,
      'add([11, 2])',
      'We add another point at [11, 2] to the stream. Duplicate points are allowed, so the count of [11, 2] in ptsCount is incremented to 2, and the point is pushed to pts.',
      'add(point=[11, 2])',
      {
        args: [11, 2],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 6,
        variables: {
          point: '[11, 2]',
          pts: '[[3, 10], [11, 2], [3, 2], [11, 2]]',
          ptsCount: '{"3,10": 1, "11,2": 2, "3,2": 1}',
        }
      }
    );

    pushStep(
      13, 11, 13, 18,
      'count([11, 10])',
      'We query count([11, 10]) again. We initialize res = 0 and extract px = 11, py = 10.',
      'count(point=[11, 10])  →  res=0',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
        },
        queryPoint: [11, 10]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([11, 10])',
      'We examine [3, 10]. It lies on the same row as the query point (y === py). We skip it.',
      'CHECK p=[3, 10]  →  skip (y == py)',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
          x: 3,
          y: 10,
        },
        queryPoint: [11, 10],
        currentPoint: [3, 10]
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([11, 10])',
      'We examine the first copy of [11, 2] in our points. It lies on the same column as the query point (x === px). We skip it.',
      'CHECK p=[11, 2]  →  skip (x == px)',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 0,
          x: 11,
          y: 2,
        },
        queryPoint: [11, 10],
        currentPoint: [11, 2]
      }
    );

    pushStep(
      24, 19, 23, 29,
      'count([11, 10])',
      'Next, we examine [3, 2]. This is diagonal to [11, 10] (distance 8). We find the other two corners: [3, 10] with count 1, and [11, 2] with count 2. We add count([3, 10]) * count([11, 2]) = 1 * 2 = 2 to res. The running sum res becomes 2.',
      'MATCH p=[3, 2]  →  res += count(3, 10) * count(11, 2)  →  1 * 2 = 2',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
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
        product: 2
      }
    );

    pushStep(
      17, 14, 17, 22,
      'count([11, 10])',
      'We examine the second copy of [11, 2] in our points. It lies on the same column as the query point (x === px). We skip it.',
      'CHECK p=[11, 2]  →  skip (x == px)',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 2,
          x: 11,
          y: 2,
        },
        queryPoint: [11, 10],
        currentPoint: [11, 2]
      }
    );

    pushStep(
      28, 22, 29, 35,
      'count([11, 10])',
      'We finish iterating. We return the final value of res, which is 2.',
      'RETURN res  →  2',
      {
        args: [11, 10],
        pts: [[3, 10], [11, 2], [3, 2], [11, 2]],
        ptsCount: { '3,10': 1, '11,2': 2, '3,2': 1 },
        activeOp: 7,
        variables: {
          point: '[11, 10]',
          px: 11,
          py: 10,
          res: 2,
        },
        queryPoint: [11, 10],
        res: 2
      }
    );

    return { steps: s, stepLineNumbers: lines };
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

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
    <div className="space-y-6">
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

              <div className="flex flex-col gap-2 mb-4 self-start w-full">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Points Database Array
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-2 w-full">
                  {currentStep.pts.map((pt, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg border bg-muted/40 border-border flex flex-col items-center justify-center font-mono text-[8px] font-bold text-foreground/80 shrink-0 animate-in zoom-in"
                    >
                      <span>{pt[0]}</span>
                      <span className="border-t border-border/60 w-4/5 text-center mt-0.5 pt-0.5">{pt[1]}</span>
                    </div>
                  ))}
                  {currentStep.pts.length === 0 && (
                    <span className="text-xs text-muted-foreground/50 italic">No points added yet</span>
                  )}
                </div>
              </div>

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
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            {/* Narrative Commentary Box */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
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

            <VariablePanel variables={currentStep.variables} />
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
    </div>
  );
};
export default DetectSquaresVisualization;
