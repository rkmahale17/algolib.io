import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Target, ArrowDown, ArrowUp } from 'lucide-react';

interface Step {
  top: number;
  bot: number;
  row: number;
  l: number;
  r: number;
  m: number;
  matrix: number[][];
  target: number;
  found: boolean;
  activePhase: 'row-search' | 'col-search' | 'finished';
  highlightedCells: { r: number; c: number }[];
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const Search2DMatrixVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const matrix = [
    [1, 3, 5, 7],
    [10, 11, 16, 20],
    [23, 30, 34, 60]
  ];
  const target = 3;

  const code = `function searchMatrix(matrix: number[][], target: number): boolean {
  const ROWS = matrix.length;
  const COLS = matrix[0].length;

  let top = 0;
  let bot = ROWS - 1;

  while (top <= bot) {
    const row = Math.floor((top + bot) / 2);

    if (target > matrix[row][COLS - 1]) {
      top = row + 1;
    } else if (target < matrix[row][0]) {
      bot = row - 1;
    } else {
      break;
    }
  }

  if (!(top <= bot)) {
    return false;
  }

  const row = Math.floor((top + bot) / 2);
  let l = 0;
  let r = COLS - 1;

  while (l <= r) {
    const m = Math.floor((l + r) / 2);

    if (target > matrix[row][m]) {
      l = m + 1;
    } else if (target < matrix[row][m]) {
      r = m - 1;
    } else {
      return true;
    }
  }

  return false;
}`;

  const steps = useMemo(() => {
    const stepsList: Step[] = [];
    const mtx = [
      [1, 3, 5, 7],
      [10, 11, 16, 20],
      [23, 30, 34, 60]
    ];
    const tgt = 3;

    // Step 0: Entry
    stepsList.push({
      top: -1,
      bot: -1,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: "Given a sorted 2D matrix, we want to find if the target value 3 is present in O(log(m * n)) time.",
      lineExecution: "function searchMatrix(matrix: number[][], target: number): boolean {",
      highlightedLines: [1]
    });

    // Step 1: ROWS
    stepsList.push({
      top: -1,
      bot: -1,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: "Define ROWS = 3 (the number of rows in our matrix).",
      lineExecution: "const ROWS = matrix.length;",
      highlightedLines: [2]
    });

    // Step 2: COLS
    stepsList.push({
      top: -1,
      bot: -1,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: "Define COLS = 4 (the number of columns in our matrix).",
      lineExecution: "const COLS = matrix[0].length;",
      highlightedLines: [3]
    });

    // Step 3: top = 0
    stepsList.push({
      top: 0,
      bot: -1,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: "Initialize the top row boundary pointer top = 0.",
      lineExecution: "let top = 0;",
      highlightedLines: [4]
    });

    // Step 4: bot = ROWS - 1
    stepsList.push({
      top: 0,
      bot: 2,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: "Initialize the bottom row boundary pointer bot = 2.",
      lineExecution: "let bot = ROWS - 1;",
      highlightedLines: [5]
    });

    let top = 0;
    let bot = 2;
    const ROWS = 3;
    const COLS = 4;

    while (top <= bot) {
      stepsList.push({
        top,
        bot,
        row: -1,
        l: -1,
        r: -1,
        m: -1,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'row-search',
        highlightedCells: [],
        explanation: `Check loop condition: top (${top}) <= bot (${bot}) is true. We search for the row that could contain the target.`,
        lineExecution: "while (top <= bot) {",
        highlightedLines: [7]
      });

      const row = Math.floor((top + bot) / 2);
      stepsList.push({
        top,
        bot,
        row,
        l: -1,
        r: -1,
        m: -1,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'row-search',
        highlightedCells: [],
        explanation: `Calculate candidate middle row index: row = Math.floor((${top} + ${bot}) / 2) = ${row}.`,
        lineExecution: "const row = Math.floor((top + bot) / 2);",
        highlightedLines: [8]
      });

      stepsList.push({
        top,
        bot,
        row,
        l: -1,
        r: -1,
        m: -1,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'row-search',
        highlightedCells: [{ r: row, c: COLS - 1 }],
        explanation: `Compare target (${tgt}) with the last element of row ${row}: matrix[${row}][${COLS - 1}] = ${mtx[row][COLS - 1]}. Since 3 > ${mtx[row][COLS - 1]} is false, the target is not in a later row.`,
        lineExecution: "if (target > matrix[row][COLS - 1]) {",
        highlightedLines: [10]
      });

      if (tgt > mtx[row][COLS - 1]) {
        top = row + 1;
        stepsList.push({
          top,
          bot,
          row,
          l: -1,
          r: -1,
          m: -1,
          matrix: mtx,
          target: tgt,
          found: false,
          activePhase: 'row-search',
          highlightedCells: [],
          explanation: `Since target (${tgt}) is greater than the row's largest element, shift top bound down to row + 1 = ${top}.`,
          lineExecution: "top = row + 1;",
          highlightedLines: [11]
        });
      } else {
        stepsList.push({
          top,
          bot,
          row,
          l: -1,
          r: -1,
          m: -1,
          matrix: mtx,
          target: tgt,
          found: false,
          activePhase: 'row-search',
          highlightedCells: [{ r: row, c: 0 }],
          explanation: `Compare target (${tgt}) with the first element of row ${row}: matrix[${row}][0] = ${mtx[row][0]}.`,
          lineExecution: "} else if (target < matrix[row][0]) {",
          highlightedLines: [12]
        });

        if (tgt < mtx[row][0]) {
          bot = row - 1;
          stepsList.push({
            top,
            bot: bot,
            row,
            l: -1,
            r: -1,
            m: -1,
            matrix: mtx,
            target: tgt,
            found: false,
            activePhase: 'row-search',
            highlightedCells: [],
            explanation: `Since target (${tgt}) is smaller than the row's first element, shift bot bound up to row - 1 = ${bot}.`,
            lineExecution: "bot = row - 1;",
            highlightedLines: [13]
          });
        } else {
          stepsList.push({
            top,
            bot,
            row,
            l: -1,
            r: -1,
            m: -1,
            matrix: mtx,
            target: tgt,
            found: false,
            activePhase: 'row-search',
            highlightedCells: [],
            explanation: `Since target (${tgt}) lies within row ${row}'s bounds [${mtx[row][0]}, ${mtx[row][COLS - 1]}], this must be the correct row. Break the search.`,
            lineExecution: "break;",
            highlightedLines: [15]
          });
          break;
        }
      }
    }

    stepsList.push({
      top,
      bot,
      row: -1,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'row-search',
      highlightedCells: [],
      explanation: `Check if we ended up with a valid row. top <= bot (${top} <= ${bot}) is true.`,
      lineExecution: "if (!(top <= bot)) {",
      highlightedLines: [19]
    });

    const targetRow = Math.floor((top + bot) / 2);
    stepsList.push({
      top,
      bot,
      row: targetRow,
      l: -1,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'col-search',
      highlightedCells: [],
      explanation: `Set the active row index to ${targetRow}. We will now run standard binary search on row ${targetRow}.`,
      lineExecution: "const row = Math.floor((top + bot) / 2);",
      highlightedLines: [23]
    });

    stepsList.push({
      top,
      bot,
      row: targetRow,
      l: 0,
      r: -1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'col-search',
      highlightedCells: [],
      explanation: "Initialize column search boundary left pointer l = 0.",
      lineExecution: "let l = 0;",
      highlightedLines: [24]
    });

    stepsList.push({
      top,
      bot,
      row: targetRow,
      l: 0,
      r: COLS - 1,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'col-search',
      highlightedCells: [],
      explanation: `Initialize column search boundary right pointer r = ${COLS - 1}.`,
      lineExecution: "let r = COLS - 1;",
      highlightedLines: [25]
    });

    let l = 0;
    let r = COLS - 1;
    while (l <= r) {
      stepsList.push({
        top,
        bot,
        row: targetRow,
        l,
        r,
        m: -1,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'col-search',
        highlightedCells: [],
        explanation: `Check loop condition: l (${l}) <= r (${r}) is true.`,
        lineExecution: "while (l <= r) {",
        highlightedLines: [27]
      });

      const m = Math.floor((l + r) / 2);
      stepsList.push({
        top,
        bot,
        row: targetRow,
        l,
        r,
        m,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'col-search',
        highlightedCells: [],
        explanation: `Calculate middle column index: m = Math.floor((${l} + ${r}) / 2) = ${m}.`,
        lineExecution: "const m = Math.floor((l + r) / 2);",
        highlightedLines: [28]
      });

      stepsList.push({
        top,
        bot,
        row: targetRow,
        l,
        r,
        m,
        matrix: mtx,
        target: tgt,
        found: false,
        activePhase: 'col-search',
        highlightedCells: [{ r: targetRow, c: m }],
        explanation: `Compare target (${tgt}) with matrix[${targetRow}][${m}] = ${mtx[targetRow][m]}.`,
        lineExecution: "if (target > matrix[row][m]) {",
        highlightedLines: [30]
      });

      if (tgt > mtx[targetRow][m]) {
        l = m + 1;
        stepsList.push({
          top,
          bot,
          row: targetRow,
          l,
          r,
          m,
          matrix: mtx,
          target: tgt,
          found: false,
          activePhase: 'col-search',
          highlightedCells: [],
          explanation: `Since target (${tgt}) > ${mtx[targetRow][m]}, search the right half. Update l = m + 1 = ${l}.`,
          lineExecution: "l = m + 1;",
          highlightedLines: [31]
        });
      } else {
        stepsList.push({
          top,
          bot,
          row: targetRow,
          l,
          r,
          m,
          matrix: mtx,
          target: tgt,
          found: false,
          activePhase: 'col-search',
          highlightedCells: [{ r: targetRow, c: m }],
          explanation: `Check if target (${tgt}) < matrix[${targetRow}][${m}] (${mtx[targetRow][m]}).`,
          lineExecution: "} else if (target < matrix[row][m]) {",
          highlightedLines: [32]
        });

        if (tgt < mtx[targetRow][m]) {
          r = m - 1;
          stepsList.push({
            top,
            bot,
            row: targetRow,
            l,
            r,
            m,
            matrix: mtx,
            target: tgt,
            found: false,
            activePhase: 'col-search',
            highlightedCells: [],
            explanation: `Since target (${tgt}) < ${mtx[targetRow][m]}, search the left half. Update r = m - 1 = ${r}.`,
            lineExecution: "r = m - 1;",
            highlightedLines: [33]
          });
        } else {
          stepsList.push({
            top,
            bot,
            row: targetRow,
            l,
            r,
            m,
            matrix: mtx,
            target: tgt,
            found: true,
            activePhase: 'finished',
            highlightedCells: [{ r: targetRow, c: m }],
            explanation: `Match found! matrix[${targetRow}][${m}] = ${mtx[targetRow][m]} is equal to target (${tgt}). Return true.`,
            lineExecution: "return true;",
            highlightedLines: [35]
          });
          return stepsList;
        }
      }
    }

    stepsList.push({
      top,
      bot,
      row: targetRow,
      l,
      r,
      m: -1,
      matrix: mtx,
      target: tgt,
      found: false,
      activePhase: 'finished',
      highlightedCells: [],
      explanation: `Search exhausted. Target ${tgt} not found in the matrix. Return false.`,
      lineExecution: "return false;",
      highlightedLines: [39]
    });

    return stepsList;
  }, []);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full text-foreground">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Search a 2D Matrix (Double Binary Search)
            </h2>
            
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden relative space-y-6">
              
              {/* Matrix Layout */}
              <div className="flex gap-4">
                
                {/* Left bounds pointers / Row indicators */}
                <div className="flex flex-col justify-around w-16 h-48 border-r border-border/30 pr-2">
                  {matrix.map((_, rIdx) => {
                    const isTop = step.top === rIdx;
                    const isBot = step.bot === rIdx;
                    const isRow = step.row === rIdx;
                    
                    return (
                      <div key={rIdx} className="h-12 flex flex-col justify-center items-end text-[10px] font-bold gap-0.5">
                        {isTop && (
                          <span className="flex items-center gap-1 text-green-500">
                            top <ArrowDown className="h-3 w-3" />
                          </span>
                        )}
                        {isRow && (
                          <span className="flex items-center gap-1 text-blue-500 animate-pulse">
                            row →
                          </span>
                        )}
                        {isBot && (
                          <span className="flex items-center gap-1 text-rose-500">
                            bot <ArrowUp className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Matrix Grid */}
                <div className="flex-1 flex flex-col justify-around h-48">
                  {matrix.map((rowArr, rIdx) => {
                    // Dim rows out of top/bot range in row-search phase, or non-active rows in col-search phase
                    const isDimmed = step.activePhase === 'row-search'
                      ? (step.top !== -1 && (rIdx < step.top || (step.bot !== -1 && rIdx > step.bot)))
                      : (step.row !== -1 && rIdx !== step.row);

                    return (
                      <div 
                        key={rIdx} 
                        className={`grid grid-cols-4 gap-2 transition-opacity duration-300 ${
                          isDimmed ? 'opacity-25 grayscale' : 'opacity-100'
                        }`}
                      >
                        {rowArr.map((cellValue, cIdx) => {
                          const isHighlighted = step.highlightedCells.some(
                            cell => cell.r === rIdx && cell.c === cIdx
                          );
                          const isL = step.row === rIdx && step.l === cIdx;
                          const isR = step.row === rIdx && step.r === cIdx;
                          const isM = step.row === rIdx && step.m === cIdx;
                          const isMatch = step.found && isHighlighted;

                          return (
                            <div key={cIdx} className="flex flex-col items-center relative">
                              
                              {/* Grid Cell */}
                              <div 
                                className={`w-14 h-11 flex items-center justify-center rounded-lg border-2 font-bold text-sm transition-all duration-200 shadow-sm ${
                                  isMatch
                                    ? 'bg-green-500 border-green-600 text-white scale-110 shadow-lg shadow-green-500/50 z-10'
                                    : isHighlighted
                                      ? 'bg-primary border-primary text-primary-foreground scale-105 shadow-md z-10'
                                      : 'bg-card border-border/80 text-foreground'
                                }`}
                              >
                                {cellValue}
                              </div>

                              {/* Col Pointers labels */}
                              <div className="absolute -bottom-5 flex gap-1 text-[9px] font-black tracking-tighter">
                                {isL && (
                                  <span className="bg-green-500 text-white px-0.5 rounded">L</span>
                                )}
                                {isM && (
                                  <span className="bg-primary text-primary-foreground px-0.5 rounded animate-bounce">M</span>
                                )}
                                {isR && (
                                  <span className="bg-rose-500 text-white px-0.5 rounded">R</span>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Target info */}
              <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/40">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Target value to find: <strong className="text-foreground">{target}</strong></span>
                </div>
                <div className="text-xs font-semibold px-2 py-1 rounded bg-muted">
                  {step.activePhase === 'row-search' ? 'Phase 1: Binary Row Search' :
                   step.activePhase === 'col-search' ? 'Phase 2: Binary Column Search' :
                   step.found ? 'Finished: Target Found' : 'Finished: Not Found'}
                </div>
              </div>

            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm text-foreground">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                    Current Execution
                  </h4>
                  <div className="text-sm font-mono bg-background/80 p-2.5 rounded-lg border border-border/50 shadow-sm inline-block">
                    {step.lineExecution}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-1">
                    Commentary
                  </h4>
                  <p className="text-[14px] font-medium leading-relaxed">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </Card>
            
            <VariablePanel 
              variables={{
                top: step.top !== -1 ? step.top : 'N/A',
                bot: step.bot !== -1 ? step.bot : 'N/A',
                row: step.row !== -1 ? step.row : 'N/A',
                l: step.l !== -1 ? step.l : 'N/A',
                r: step.r !== -1 ? step.r : 'N/A',
                m: step.m !== -1 ? step.m : 'N/A',
                target: step.target,
                'matrix[row][m]': (step.row !== -1 && step.m !== -1) ? step.matrix[step.row][step.m] : 'N/A'
              }} 
            />
          </div>
        </div>
      }
      rightContent={
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex-1 overflow-hidden min-h-[400px]">
            <AnimatedCodeEditor
              code={code}
              language="typescript"
              highlightedLines={step.highlightedLines}
            />
          </div>
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
