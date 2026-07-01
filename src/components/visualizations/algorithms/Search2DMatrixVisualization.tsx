import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Target, ArrowDown, ArrowUp } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  variables: Record<string, any>;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function searchMatrix(matrix: number[][], target: number): boolean {
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  let top = 0;
  let bot = ROWS - 1;
  let targetRow = -1;
  while (top <= bot) {
    const row = top + Math.floor((bot - top) / 2);
    if (target > matrix[row][COLS - 1]) {
      top = row + 1;
    } else if (target < matrix[row][0]) {
      bot = row - 1;
    } else {
      targetRow = row;
      break;
    }
  }
  if (targetRow === -1) {
    return false;
  }
  let l = 0;
  let r = COLS - 1;
  while (l <= r) {
    const m = l + Math.floor((r - l) / 2);
    if (target > matrix[targetRow][m]) {
      l = m + 1;
    } else if (target < matrix[targetRow][m]) {
      r = m - 1;
    } else {
      return true;
    }
  }
  return false;
}`,
  python: `def searchMatrix(matrix: list[list[int]], target: int) -> bool:
    ROWS = len(matrix)
    COLS = len(matrix[0])
    top = 0
    bot = ROWS - 1
    actual_row = -1
    while top <= bot:
        row = (top + bot) // 2
        if target > matrix[row][COLS - 1]:
            top = row + 1
        elif target < matrix[row][0]:
            bot = row - 1
        else:
            actual_row = row
            break
    if actual_row == -1:
        return False
    l = 0
    r = COLS - 1
    while l <= r:
        m = (l + r) // 2
        if target > matrix[actual_row][m]:
            l = m + 1
        elif target < matrix[actual_row][m]:
            r = m - 1
        else:
            return True
    return False`,
  java: `public static class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int ROWS = matrix.length;
        int COLS = matrix[0].length;
        int top = 0;
        int bot = ROWS - 1;
        int targetRow = -1;
        while (top <= bot) {
            int row = top + (bot - top) / 2;
            if (target > matrix[row][COLS - 1]) {
                top = row + 1;
            } else if (target < matrix[row][0]) {
                bot = row - 1;
            } else {
                targetRow = row;
                break;
            }
        }
        if (targetRow == -1) {
            return false;
        }
        int l = 0;
        int r = COLS - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (target > matrix[targetRow][m]) {
                l = m + 1;
            } else if (target < matrix[targetRow][m]) {
                r = m - 1;
            } else {
                return true;
            }
        }
        return false;
    }
}`,
  cpp: `class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int ROWS = matrix.size();
        if (ROWS == 0) return false;
        int COLS = matrix[0].size();
        if (COLS == 0) return false;
        int top = 0;
        int bot = ROWS - 1;
        int actual_row = -1;
        while (top <= bot) {
            int mid_row = top + (bot - top) / 2;
            if (target > matrix[mid_row][COLS - 1]) {
                top = mid_row + 1;
            } else if (target < matrix[mid_row][0]) {
                bot = mid_row - 1;
            } else {
                actual_row = mid_row;
                break;
            }
        }
        if (actual_row == -1) {
            return false;
        }
        int l = 0;
        int r = COLS - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (target > matrix[actual_row][m]) {
                l = m + 1;
            } else if (target < matrix[actual_row][m]) {
                r = m - 1;
            } else {
                return true;
            }
        }
        return false;
    }
};`
};

export const Search2DMatrixVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const matrix = [
    [1, 3, 5, 7],
    [10, 11, 16, 20],
    [23, 30, 34, 60]
  ];
  const target = 3;

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const mtx = [
      [1, 3, 5, 7],
      [10, 11, 16, 20],
      [23, 30, 34, 60]
    ];
    const tgt = 3;
    const ROWS = 3;
    const COLS = 4;

    const getVariables = (
      top: number, bot: number, row: number, l: number, r: number, m: number,
      extra: Record<string, any> = {}
    ) => {
      return {
        top: top !== -1 ? top : 'N/A',
        bot: bot !== -1 ? bot : 'N/A',
        row: row !== -1 ? row : 'N/A',
        l: l !== -1 ? l : 'N/A',
        r: r !== -1 ? r : 'N/A',
        m: m !== -1 ? m : 'N/A',
        target: tgt,
        'matrix[row][m]': (row !== -1 && m !== -1) ? mtx[row][m] : 'N/A',
        ...extra
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['activePhase'],
      top: number, bot: number, row: number, l: number, r: number, m: number,
      found: boolean,
      highlightedCells: { r: number; c: number }[],
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        top,
        bot,
        row,
        l,
        r,
        m,
        matrix: mtx,
        target: tgt,
        found,
        activePhase: phase,
        highlightedCells,
        explanation,
        pseudoStep: pseudo,
        variables: getVariables(top, bot, row, l, r, m, variablesExtra)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      "Given a sorted 2D matrix, we want to find if the target value 3 is present in O(log(m * n)) time.",
      "searchMatrix(matrix, target=3)",
      'row-search', -1, -1, -1, -1, -1, -1, false, [],
      {},
      1, 1, 2, 3
    );

    pushStep(
      "Define ROWS = 3 (the number of rows in our matrix).",
      "ROWS = len(matrix)  →  3",
      'row-search', -1, -1, -1, -1, -1, -1, false, [],
      {},
      2, 2, 3, 4
    );

    pushStep(
      "Define COLS = 4 (the number of columns in our matrix).",
      "COLS = len(matrix[0])  →  4",
      'row-search', -1, -1, -1, -1, -1, -1, false, [],
      {},
      3, 3, 4, 6
    );

    let top = 0;
    pushStep(
      "Initialize the top row boundary pointer top = 0.",
      "top = 0",
      'row-search', top, -1, -1, -1, -1, -1, false, [],
      {},
      4, 4, 5, 8
    );

    let bot = ROWS - 1;
    pushStep(
      "Initialize the bottom row boundary pointer bot = 2.",
      "bot = ROWS - 1  →  2",
      'row-search', top, bot, -1, -1, -1, -1, false, [],
      {},
      5, 5, 6, 9
    );

    let targetRow = -1;

    while (top <= bot) {
      pushStep(
        `Check loop condition: top (${top}) <= bot (${bot}) is true. We search for the row that could contain the target.`,
        `WHILE top <= bot  →  ${top} <= ${bot}`,
        'row-search', top, bot, -1, -1, -1, -1, false, [],
        {},
        7, 7, 8, 11
      );

      const row = top + Math.floor((bot - top) / 2);
      pushStep(
        `Calculate candidate middle row index: row = top + (bot - top) / 2 = ${row}.`,
        `row = (top + bot) // 2  →  ${row}`,
        'row-search', top, bot, row, -1, -1, -1, false, [],
        {},
        8, 8, 9, 12
      );

      pushStep(
        `Compare target (${tgt}) with the last element of row ${row}: matrix[${row}][${COLS - 1}] = ${mtx[row][COLS - 1]}.`,
        `IF target > matrix[row][COLS - 1]  →  3 > ${mtx[row][COLS - 1]}`,
        'row-search', top, bot, row, -1, -1, -1, false, [{ r: row, c: COLS - 1 }],
        {},
        9, 9, 10, 13
      );

      if (tgt > mtx[row][COLS - 1]) {
        top = row + 1;
        pushStep(
          `Since target (${tgt}) is greater than the row's largest element, shift top bound down to row + 1 = ${top}.`,
          `top = row + 1  →  ${top}`,
          'row-search', top, bot, row, -1, -1, -1, false, [],
          {},
          10, 10, 11, 14
        );
      } else {
        pushStep(
          `Compare target (${tgt}) with the first element of row ${row}: matrix[${row}][0] = ${mtx[row][0]}.`,
          `ELIF target < matrix[row][0]  →  3 < ${mtx[row][0]}`,
          'row-search', top, bot, row, -1, -1, -1, false, [{ r: row, c: 0 }],
          {},
          11, 11, 12, 15
        );

        if (tgt < mtx[row][0]) {
          bot = row - 1;
          pushStep(
            `Since target (${tgt}) is smaller than the row's first element, shift bot bound up to row - 1 = ${bot}.`,
            `bot = row - 1  →  ${bot}`,
            'row-search', top, bot, row, -1, -1, -1, false, [],
            {},
            12, 12, 13, 16
          );
        } else {
          targetRow = row;
          pushStep(
            `Since target (${tgt}) lies within row ${row}'s bounds [${mtx[row][0]}, ${mtx[row][COLS - 1]}], this must be the correct row. Break the search.`,
            `actual_row = row  →  break`,
            'row-search', top, bot, row, -1, -1, -1, false, [],
            {},
            14, 13, 14, 17
          );
          break;
        }
      }
    }

    if (targetRow === -1) {
      pushStep(
        `Check if we ended up with a valid row. targetRow is -1, so target is outside all row bounds. Return false.`,
        `IF actual_row == -1: return False`,
        'finished', top, bot, -1, -1, -1, -1, false, [],
        {},
        18, 16, 19, 22
      );
      pushStep(
        `Target not found in the matrix. Return false.`,
        "RETURN false",
        'finished', top, bot, -1, -1, -1, -1, false, [],
        {},
        19, 17, 20, 23
      );
      return { steps: stepsList, stepLineNumbers: lines };
    }

    pushStep(
      `Check if we ended up with a valid row. targetRow is ${targetRow}, which is valid.`,
      `IF actual_row == -1  →  ${targetRow} == -1`,
      'col-search', top, bot, targetRow, -1, -1, -1, false, [],
      {},
      18, 16, 19, 22
    );

    let l = 0;
    let r = COLS - 1;
    pushStep(
      `Initialize column search boundary left pointer l = 0 and right pointer r = ${COLS - 1}.`,
      `l = 0, r = COLS - 1`,
      'col-search', top, bot, targetRow, l, r, -1, false, [],
      {},
      21, 18, 22, 25
    );

    while (l <= r) {
      pushStep(
        `Check col-search loop condition: l (${l}) <= r (${r}) is true.`,
        `WHILE l <= r  →  ${l} <= ${r}`,
        'col-search', top, bot, targetRow, l, r, -1, false, [],
        {},
        23, 20, 24, 27
      );

      const m = l + Math.floor((r - l) / 2);
      pushStep(
        `Calculate middle column index: m = l + (r - l) / 2 = ${m}.`,
        `m = (l + r) // 2  →  ${m}`,
        'col-search', top, bot, targetRow, l, r, m, false, [],
        {},
        24, 21, 25, 28
      );

      pushStep(
        `Compare target (${tgt}) with matrix[${targetRow}][${m}] = ${mtx[targetRow][m]}.`,
        `IF target > matrix[row][m]  →  3 > ${mtx[targetRow][m]}`,
        'col-search', top, bot, targetRow, l, r, m, false, [{ r: targetRow, c: m }],
        {},
        25, 22, 26, 29
      );

      if (tgt > mtx[targetRow][m]) {
        l = m + 1;
        pushStep(
          `Since target (${tgt}) > ${mtx[targetRow][m]}, search the right half. Update l = m + 1 = ${l}.`,
          `l = m + 1  →  ${l}`,
          'col-search', top, bot, targetRow, l, r, m, false, [],
          {},
          26, 23, 27, 30
        );
      } else {
        pushStep(
          `Check if target (${tgt}) < matrix[${targetRow}][${m}] (${mtx[targetRow][m]}).`,
          `ELIF target < matrix[row][m]  →  3 < ${mtx[targetRow][m]}`,
          'col-search', top, bot, targetRow, l, r, m, false, [{ r: targetRow, c: m }],
          {},
          27, 24, 28, 31
        );

        if (tgt < mtx[targetRow][m]) {
          r = m - 1;
          pushStep(
            `Since target (${tgt}) < ${mtx[targetRow][m]}, search the left half. Update r = m - 1 = ${r}.`,
            `r = m - 1  →  ${r}`,
            'col-search', top, bot, targetRow, l, r, m, false, [],
            {},
            28, 25, 29, 32
          );
        } else {
          pushStep(
            `Match found! matrix[${targetRow}][${m}] = ${mtx[targetRow][m]} is equal to target (${tgt}). Return true.`,
            `RETURN True`,
            'finished', top, bot, targetRow, l, r, m, true, [{ r: targetRow, c: m }],
            {},
            30, 27, 31, 34
          );
          return { steps: stepsList, stepLineNumbers: lines };
        }
      }
    }

    pushStep(
      `Search exhausted. Target ${tgt} not found in the matrix. Return false.`,
      `RETURN False`,
      'finished', top, bot, targetRow, l, r, -1, false, [],
      {},
      33, 28, 35, 37
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStep] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <div className="space-y-6">
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
                        <div key={rIdx} className="h-12 flex flex-col justify-center items-end text-[10px] font-bold gap-0.5 animate-all duration-300">
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
              <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm text-foreground flex items-center min-h-[70px]">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                    <Target className="w-4 h-4" />
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
              
              <VariablePanel variables={step.variables} />
            </div>
          </div>
        }
        rightContent={
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
        }
        controls={
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
        }
      />
    </div>
  );
};
export default Search2DMatrixVisualization;
