import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  matrix: number[][];
  sumMat: number[][];
  activeCellOrig: { r: number; c: number } | null;
  activeCellSum: { r: number; c: number } | null;
  highlightedOrigCells: { r: number; c: number }[];
  highlightedSumCells: { r: number; c: number; type: 'bottomRight' | 'above' | 'left' | 'topLeft' | 'above_contrib' }[];
  phase: 'precompute' | 'query';
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  python: `class NumMatrix:
    def __init__(self, matrix: list[list[int]]):
        if not matrix or not matrix[0]:
            self.sumMat = [[0]]
            return
        ROWS = len(matrix)
        COLS = len(matrix[0])
        self.sumMat = [[0] * (COLS + 1) for _ in range(ROWS + 1)]
        for r in range(ROWS):
            prefix = 0
            for c in range(COLS):
                prefix += matrix[r][c]
                above = self.sumMat[r][c + 1]
                self.sumMat[r + 1][c + 1] = prefix + above

    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:
        R1 = row1 + 1
        C1 = col1 + 1
        R2 = row2 + 1
        C2 = col2 + 1
        bottomRight = self.sumMat[R2][C2]
        above = self.sumMat[R1 - 1][C2]
        left = self.sumMat[R2][C1 - 1]
        topLeft = self.sumMat[R1 - 1][C1 - 1]
        return bottomRight - above - left + topLeft`,

  typescript: `class NumMatrix {
    private sumMat: number[][];
    constructor(matrix: number[][]) {
        const ROWS = matrix.length;
        const COLS = matrix[0].length;
        this.sumMat = Array.from({ length: ROWS + 1 }, () =>
            new Array(COLS + 1).fill(0)
        );
        for (let r = 0; r < ROWS; r++) {
            let prefixSumRow = 0;
            for (let c = 0; c < COLS; c++) {
                prefixSumRow += matrix[r][c];
                this.sumMat[r + 1][c + 1] = prefixSumRow + this.sumMat[r][c + 1];
            }
        }
    }
    sumRegion(row1: number, col1: number, row2: number, col2: number): number {
        row1++; 
        col1++; 
        row2++; 
        col2++; 
        const bottomRight = this.sumMat[row2][col2];
        const above = this.sumMat[row1 - 1][col2];
        const left = this.sumMat[row2][col1 - 1];
        const topLeft = this.sumMat[row1 - 1][col1 - 1];
        return bottomRight - above - left + topLeft;
    }
}`,

  java: `class NumMatrix {
    private int[][] sumMat;
    public NumMatrix(int[][] matrix) {
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            this.sumMat = new int[1][1];
            return;
        }
        int ROWS = matrix.length;
        int COLS = matrix[0].length;
        this.sumMat = new int[ROWS + 1][COLS + 1];
        for (int r = 0; r < ROWS; r++) {
            int prefix = 0;
            for (int c = 0; c < COLS; c++) {
                prefix += matrix[r][c];
                this.sumMat[r + 1][c + 1] = prefix + this.sumMat[r][c + 1];
            }
        }
    }
    public int sumRegion(int row1, int col1, int row2, int col2) {
        row1++;
        col1++;
        row2++;
        col2++;
        int bottomRight = this.sumMat[row2][col2];
        int above = this.sumMat[row1 - 1][col2];
        int left = this.sumMat[row2][col1 - 1];
        int topLeft = this.sumMat[row1 - 1][col1 - 1];
        return bottomRight - above - left + topLeft;
    }
}`,

  cpp: `class NumMatrix {
private:
    vector<vector<int>> sumMat;
public:
    NumMatrix(vector<vector<int>>& matrix) {
        int ROWS = matrix.size();
        if (ROWS == 0) return;
        int COLS = matrix[0].size();
        sumMat.resize(ROWS + 1, vector<int>(COLS + 1, 0));
        for (int r = 0; r < ROWS; ++r) {
            int prefix = 0;
            for (int c = 0; c < COLS; ++c) {
                prefix += matrix[r][c]; 
                int above = sumMat[r][c + 1]; 
                sumMat[r + 1][c + 1] = prefix + above;
            }
        }
    }
    int sumRegion(int row1, int col1, int row2, int col2) {
        row1++;
        col1++;
        row2++;
        col2++;
        int bottomRight = sumMat[row2][col2]; 
        int above = sumMat[row1 - 1][col2];    
        int left = sumMat[row2][col1 - 1];     
        int topLeft = sumMat[row1 - 1][col1 - 1]; 
        return bottomRight - above - left + topLeft;
    }
};`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const matrix = [
    [3, 0, 1],
    [5, 6, 3],
    [1, 2, 0]
  ];
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const tempSumMat = Array.from({ length: ROWS + 1 }, () => new Array(COLS + 1).fill(0));

  // Step 0: Constructor Init
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [],
    highlightedSumCells: [],
    phase: 'precompute',
    variables: { r: '-', c: '-', prefix: '-', above: '-', 'sumMat[r+1][c+1]': '-' },
    explanation: 'Initialize sumMat with size (ROWS+1) x (COLS+1) filled with 0s.',
    pseudoStep: `SET sumMat = (ROWS+1) x (COLS+1) of 0s`
  });
  addLines(6, 8, 10, 9);

  for (let r = 0; r < ROWS; r++) {
    // Outer loop init
    steps.push({
      matrix,
      sumMat: tempSumMat.map(row => [...row]),
      activeCellOrig: null,
      activeCellSum: null,
      highlightedOrigCells: [],
      highlightedSumCells: [],
      phase: 'precompute',
      variables: { r, c: '-', prefix: 0, above: '-', 'sumMat[r+1][c+1]': '-' },
      explanation: `Start row r = ${r}. Initialize row prefix sum to 0.`,
      pseudoStep: `FOR r = ${r}: SET prefix = 0`
    });
    addLines(9, 9, 11, 10);

    let prefix = 0;
    for (let c = 0; c < COLS; c++) {
      prefix += matrix[r][c];

      // Inner loop step (Update prefix)
      steps.push({
        matrix,
        sumMat: tempSumMat.map(row => [...row]),
        activeCellOrig: { r, c },
        activeCellSum: null,
        highlightedOrigCells: Array.from({ length: c + 1 }, (_, idx) => ({ r, c: idx })),
        highlightedSumCells: [],
        phase: 'precompute',
        variables: { r, c, prefix, above: '-', 'sumMat[r+1][c+1]': '-' },
        explanation: `Inspect matrix[${r}][${c}] = ${matrix[r][c]}. Row prefix sum becomes ${prefix}.`,
        pseudoStep: `FOR c = ${c}: prefix = prefix + matrix[r][c] → ${prefix}`
      });
      addLines(12, 12, 14, 13);

      const aboveVal = tempSumMat[r][c + 1];
      tempSumMat[r + 1][c + 1] = prefix + aboveVal;

      // Update sumMat step
      steps.push({
        matrix,
        sumMat: tempSumMat.map(row => [...row]),
        activeCellOrig: null,
        activeCellSum: { r: r + 1, c: c + 1 },
        highlightedOrigCells: Array.from({ length: c + 1 }, (_, idx) => ({ r, c: idx })),
        highlightedSumCells: [{ r, c: c + 1, type: 'above_contrib' }],
        phase: 'precompute',
        variables: { r, c, prefix, above: aboveVal, 'sumMat[r+1][c+1]': tempSumMat[r + 1][c + 1] },
        explanation: `sumMat[${r+1}][${c+1}] = prefix (${prefix}) + sumMat[${r}][${c+1}] (${aboveVal}) = ${tempSumMat[r + 1][c + 1]}.`,
        pseudoStep: `SET sumMat[${r+1}][${c+1}] = prefix + sumMat[${r}][${c+1}] → ${tempSumMat[r + 1][c + 1]}`
      });
      addLines(13, 14, 15, 15);
    }
  }

  // Precomputation end
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [],
    highlightedSumCells: [],
    phase: 'precompute',
    variables: { r: '-', c: '-', prefix: '-', above: '-', 'sumMat[r+1][c+1]': '-' },
    explanation: '2D Prefix Sum matrix pre-computation completed successfully!',
    pseudoStep: 'CONSTRUCTOR DONE'
  });
  addLines(16, 15, 17, 18);

  // SumRegion query: row1=1, col1=1, row2=2, col2=2 (targets matrix [[6, 3], [2, 0]])
  const query = { r1: 1, c1: 1, r2: 2, c2: 2 };
  
  // Query Step 1: Adjust coords
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [],
    highlightedSumCells: [],
    phase: 'query',
    variables: { row1: query.r1, col1: query.c1, row2: query.r2, col2: query.c2 },
    explanation: `Query sumRegion(${query.r1}, ${query.c1}, ${query.r2}, ${query.c2}). Adjust coordinates to 1-based index (R1=${query.r1+1}, C1=${query.c1+1}, R2=${query.r2+1}, C2=${query.c2+1}) to match sumMat.`,
    pseudoStep: 'ADJUST row1, col1, row2, col2 to 1-indexed'
  });
  addLines(21, 20, 23, 23);

  // Query Step 2: bottomRight
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
      { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }
    ],
    highlightedSumCells: [{ r: query.r2 + 1, c: query.c2 + 1, type: 'bottomRight' }],
    phase: 'query',
    variables: { bottomRight: tempSumMat[query.r2 + 1][query.c2 + 1], above: '-', left: '-', topLeft: '-' },
    explanation: `Get bottomRight = sumMat[${query.r2+1}][${query.c2+1}] = ${tempSumMat[query.r2 + 1][query.c2 + 1]}. This represents the sum of the full rectangle from (0,0) to (${query.r2},${query.c2}).`,
    pseudoStep: `SET bottomRight = sumMat[${query.r2+1}][${query.c2+1}] → ${tempSumMat[query.r2 + 1][query.c2 + 1]}`
  });
  addLines(22, 21, 24, 24);

  // Query Step 3: above
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }
    ],
    highlightedSumCells: [
      { r: query.r2 + 1, c: query.c2 + 1, type: 'bottomRight' },
      { r: query.r1, c: query.c2 + 1, type: 'above' }
    ],
    phase: 'query',
    variables: { bottomRight: tempSumMat[query.r2 + 1][query.c2 + 1], above: tempSumMat[query.r1][query.c2 + 1], left: '-', topLeft: '-' },
    explanation: `Get above = sumMat[${query.r1}][${query.c2+1}] = ${tempSumMat[query.r1][query.c2 + 1]}. This represents the sum of the rectangle above the query region, to be subtracted.`,
    pseudoStep: `SET above = sumMat[${query.r1}][${query.c2+1}] → ${tempSumMat[query.r1][query.c2 + 1]}`
  });
  addLines(23, 22, 25, 25);

  // Query Step 4: left
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [
      { r: 0, c: 0 },
      { r: 1, c: 0 },
      { r: 2, c: 0 }
    ],
    highlightedSumCells: [
      { r: query.r2 + 1, c: query.c2 + 1, type: 'bottomRight' },
      { r: query.r1, c: query.c2 + 1, type: 'above' },
      { r: query.r2 + 1, c: query.c1, type: 'left' }
    ],
    phase: 'query',
    variables: { bottomRight: tempSumMat[query.r2 + 1][query.c2 + 1], above: tempSumMat[query.r1][query.c2 + 1], left: tempSumMat[query.r2 + 1][query.c1], topLeft: '-' },
    explanation: `Get left = sumMat[${query.r2+1}][${query.c1}] = ${tempSumMat[query.r2 + 1][query.c1]}. This represents the sum of the rectangle to the left of the query region, to be subtracted.`,
    pseudoStep: `SET left = sumMat[${query.r2+1}][${query.c1}] → ${tempSumMat[query.r2 + 1][query.c1]}`
  });
  addLines(24, 23, 26, 26);

  // Query Step 5: topLeft
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [
      { r: 0, c: 0 }
    ],
    highlightedSumCells: [
      { r: query.r2 + 1, c: query.c2 + 1, type: 'bottomRight' },
      { r: query.r1, c: query.c2 + 1, type: 'above' },
      { r: query.r2 + 1, c: query.c1, type: 'left' },
      { r: query.r1, c: query.c1, type: 'topLeft' }
    ],
    phase: 'query',
    variables: { bottomRight: tempSumMat[query.r2 + 1][query.c2 + 1], above: tempSumMat[query.r1][query.c2 + 1], left: tempSumMat[query.r2 + 1][query.c1], topLeft: tempSumMat[query.r1][query.c1] },
    explanation: `Get topLeft = sumMat[${query.r1}][${query.c1}] = ${tempSumMat[query.r1][query.c1]}. This region was subtracted twice, so we add it back.`,
    pseudoStep: `SET topLeft = sumMat[${query.r1}][${query.c1}] → ${tempSumMat[query.r1][query.c1]}`
  });
  addLines(25, 24, 27, 27);

  const res = tempSumMat[query.r2 + 1][query.c2 + 1] - tempSumMat[query.r1][query.c2 + 1] - tempSumMat[query.r2 + 1][query.c1] + tempSumMat[query.r1][query.c1];

  // Query Step 6: Return
  steps.push({
    matrix,
    sumMat: tempSumMat.map(row => [...row]),
    activeCellOrig: null,
    activeCellSum: null,
    highlightedOrigCells: [
      { r: 1, c: 1 }, { r: 1, c: 2 },
      { r: 2, c: 1 }, { r: 2, c: 2 }
    ],
    highlightedSumCells: [],
    phase: 'query',
    variables: { result: res },
    explanation: `Calculate: bottomRight - above - left + topLeft = ${tempSumMat[query.r2 + 1][query.c2 + 1]} - ${tempSumMat[query.r1][query.c2 + 1]} - ${tempSumMat[query.r2 + 1][query.c1]} + ${tempSumMat[query.r1][query.c1]} = ${res}. Return ${res}.`,
    pseudoStep: `RETURN result → ${res}`
  });
  addLines(26, 25, 28, 28);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const RangeSumQuery2DImmutableVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col gap-6">
            
            {/* Matrices Row */}
            <div className="flex flex-col sm:flex-row gap-8 justify-around">
              
              {/* Original Matrix */}
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Original Matrix</h4>
                <div className="flex flex-col gap-1.5 bg-background/50 p-3 rounded-lg border border-border/50">
                  {currentStep.matrix.map((row, r) => (
                    <div key={r} className="flex gap-1.5">
                      {row.map((val, c) => {
                        let cellClass = 'border-border bg-muted/30 text-foreground';
                        
                        const isHighlighted = currentStep.highlightedOrigCells.some(cell => cell.r === r && cell.c === c);
                        const isActive = currentStep.activeCellOrig && currentStep.activeCellOrig.r === r && currentStep.activeCellOrig.c === c;

                        if (isActive) {
                          cellClass = 'border-primary bg-primary/20 scale-105 z-10 text-primary-foreground';
                        } else if (isHighlighted) {
                          cellClass = currentStep.phase === 'query' 
                            ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400' 
                            : 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400';
                        }

                        return (
                          <div
                            key={c}
                            className={`w-8 h-8 rounded-md flex items-center justify-center border-2 transition-all ${cellClass}`}
                          >
                            <span className="text-xs font-bold font-mono">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prefix Sum Matrix */}
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Prefix Sum (sumMat)</h4>
                <div className="flex flex-col gap-1.5 bg-background/50 p-3 rounded-lg border border-border/50">
                  {currentStep.sumMat.map((row, r) => (
                    <div key={r} className="flex gap-1.5">
                      {row.map((val, c) => {
                        let cellClass = 'border-border bg-muted/10 text-muted-foreground/60';
                        
                        const isActive = currentStep.activeCellSum && currentStep.activeCellSum.r === r && currentStep.activeCellSum.c === c;
                        const sumHighlight = currentStep.highlightedSumCells.find(cell => cell.r === r && cell.c === c);

                        if (r > 0 && c > 0) {
                          cellClass = 'border-border bg-muted/40 text-foreground';
                        }

                        if (isActive) {
                          cellClass = 'border-primary bg-primary scale-110 z-10 text-primary-foreground font-black';
                        } else if (sumHighlight) {
                          switch (sumHighlight.type) {
                            case 'bottomRight':
                              cellClass = 'border-blue-500 bg-blue-500 text-white font-bold scale-105 z-10';
                              break;
                            case 'above':
                              cellClass = 'border-destructive bg-destructive text-white font-bold scale-105 z-10';
                              break;
                            case 'left':
                              cellClass = 'border-orange-500 bg-orange-500 text-white font-bold scale-105 z-10';
                              break;
                            case 'topLeft':
                              cellClass = 'border-emerald-500 bg-emerald-500 text-white font-bold scale-105 z-10';
                              break;
                            case 'above_contrib':
                              cellClass = 'border-violet-500 bg-violet-500/20 text-violet-600 dark:text-violet-400 font-bold';
                              break;
                          }
                        }

                        return (
                          <div
                            key={c}
                            className={`w-8 h-8 rounded-md flex items-center justify-center border-2 transition-all ${cellClass}`}
                          >
                            <span className="text-xs font-bold font-mono">{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Query Legend Panel (Visible only during query phase) */}
            {currentStep.phase === 'query' && (
              <div className="border-t border-border/50 pt-4 flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inclusion-Exclusion Formula:</span>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500 text-white">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>bottomRight ({currentStep.variables.bottomRight || 0})</span>
                  </div>
                  <span className="text-sm font-bold">-</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-destructive text-white">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>above ({currentStep.variables.above || 0})</span>
                  </div>
                  <span className="text-sm font-bold">-</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500 text-white">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>left ({currentStep.variables.left || 0})</span>
                  </div>
                  <span className="text-sm font-bold">+</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500 text-white">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>topLeft ({currentStep.variables.topLeft || 0})</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>
          
          <VariablePanel variables={currentStep.variables} />

        </div>

        {/* Right column: code */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};
