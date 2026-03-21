import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
    board: string[][];
    row: number;
    col: number;
    rows: Record<number, string[]>;
    cols: Record<number, string[]>;
    squares: Record<string, string[]>;
    message: string;
    lineNumber: number;
    isInvalid: boolean;
}

export const ValidSudokuVisualization: React.FC = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(200);
    const intervalRef = useRef<number | null>(null);

    const code = `function isValidSudoku(board: string[][]): boolean {
  const rows: Map<number, Set<string>> = new Map();
  const cols: Map<number, Set<string>> = new Map();
  const squares: Map<string, Set<string>> = new Map();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const value = board[r][c];

      if (value === ".") continue;

      const squareKey = \`\${Math.floor(r / 3)},\${Math.floor(c / 3)}\`;

      if (
        (rows.get(r)?.has(value)) ||
        (cols.get(c)?.has(value)) ||
        (squares.get(squareKey)?.has(value))
      ) {
        return false;
      }

      if (!rows.has(r)) rows.set(r, new Set());
      if (!cols.has(c)) cols.set(c, new Set());
      if (!squares.has(squareKey)) squares.set(squareKey, new Set());

      rows.get(r)!.add(value);
      cols.get(c)!.add(value);
      squares.get(squareKey)!.add(value);
    }
  }

  return true;
}`;

    const generateSteps = () => {
        const board = [
            ["5", "3", ".", ".", "7", ".", ".", ".", "."],
            ["6", ".", ".", "1", "9", "5", ".", ".", "."],
            [".", "9", "8", ".", ".", ".", ".", "6", "."],
            ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
            ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
            ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
            [".", "6", ".", ".", ".", ".", "2", "8", "."],
            [".", ".", ".", "4", "1", "9", ".", ".", "5"],
            [".", ".", ".", ".", "8", ".", ".", "7", "9"]
        ];

        const newSteps: Step[] = [];
        const rows: Map<number, Set<string>> = new Map();
        const cols: Map<number, Set<string>> = new Map();
        const squares: Map<string, Set<string>> = new Map();

        const getSnapshot = (r: number, c: number, message: string, line: number, isInvalid = false) => {
            const rowsSnapshot: Record<number, string[]> = {};
            rows.forEach((set, key) => { rowsSnapshot[key] = Array.from(set); });

            const colsSnapshot: Record<number, string[]> = {};
            cols.forEach((set, key) => { colsSnapshot[key] = Array.from(set); });

            const squaresSnapshot: Record<string, string[]> = {};
            squares.forEach((set, key) => { squaresSnapshot[key] = Array.from(set); });

            return {
                board: board.map(row => [...row]),
                row: r,
                col: c,
                rows: rowsSnapshot,
                cols: colsSnapshot,
                squares: squaresSnapshot,
                message,
                lineNumber: line,
                isInvalid
            };
        };

        newSteps.push(getSnapshot(-1, -1, "Initializing memory maps for rows, columns, and 3x3 squares", 2));

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const value = board[r][c];
                newSteps.push(getSnapshot(r, c, `Checking cell at row ${r}, column ${c}`, 9));

                if (value === ".") {
                    newSteps.push(getSnapshot(r, c, "Empty cell, skipping...", 12));
                    continue;
                }

                const squareKey = `${Math.floor(r / 3)},${Math.floor(c / 3)}`;
                newSteps.push(getSnapshot(r, c, `Calculated square key: ${squareKey}`, 15));

                newSteps.push(getSnapshot(r, c, `Checking if ${value} exists in row ${r}, column ${c}, or square ${squareKey}`, 18));
                if (
                    (rows.get(r)?.has(value)) ||
                    (cols.get(c)?.has(value)) ||
                    (squares.get(squareKey)?.has(value))
                ) {
                    newSteps.push(getSnapshot(r, c, `Duplicate found! Value ${value} is already present.`, 24, true));
                    setSteps(newSteps);
                    return;
                }

                newSteps.push(getSnapshot(r, c, `No duplicate. Adding ${value} to row, column, and square sets.`, 28));
                if (!rows.has(r)) rows.set(r, new Set());
                if (!cols.has(c)) cols.set(c, new Set());
                if (!squares.has(squareKey)) squares.set(squareKey, new Set());

                rows.get(r)!.add(value);
                cols.get(c)!.add(value);
                squares.get(squareKey)!.add(value);
                newSteps.push(getSnapshot(r, c, `Updated sets with value ${value}`, 33));
            }
        }

        newSteps.push(getSnapshot(-1, -1, "Algorithm complete. Sudoku board is valid.", 40));
        setSteps(newSteps);
    };

    useEffect(() => {
        generateSteps();
    }, []);

    useEffect(() => {
        if (isPlaying && currentStepIndex < steps.length - 1) {
            intervalRef.current = window.setInterval(() => {
                setCurrentStepIndex((prev) => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, speed);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleStepForward = () => {
        if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
    };
    const handleStepBack = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };
    const handleReset = () => {
        setCurrentStepIndex(0);
        setIsPlaying(false);
    };

    if (steps.length === 0) return null;

    const currentStep = steps[currentStepIndex];
    const currentSquareRow = Math.floor(currentStep.row / 3);
    const currentSquareCol = Math.floor(currentStep.col / 3);

    return (
        <div className="space-y-6">
            <StepControls
                onPlay={handlePlay}
                onPause={handlePause}
                onStepForward={handleStepForward}
                onStepBack={handleStepBack}
                onReset={handleReset}
                isPlaying={isPlaying}
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                speed={speed}
                onSpeedChange={setSpeed}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border">
                    <h3 className="text-lg font-semibold mb-4">Sudoku Board Validation</h3>

                    <div className="grid grid-cols-9 gap-px bg-border border border-border mb-6 max-w-[400px]">
                        {currentStep.board.map((row, r) =>
                            row.map((cell, c) => {
                                const isCurrentRow = r === currentStep.row;
                                const isCurrentCol = c === currentStep.col;
                                const isInSquare = Math.floor(r / 3) === currentSquareRow && Math.floor(c / 3) === currentSquareCol;
                                const isCurrentCell = isCurrentRow && isCurrentCol;

                                return (
                                    <div
                                        key={`${r}-${c}`}
                                        className={`aspect-square flex items-center justify-center text-sm font-medium transition-all ${isCurrentCell
                                                ? 'bg-primary text-primary-foreground scale-110 z-10 shadow-lg'
                                                : isCurrentRow || isCurrentCol || isInSquare
                                                    ? 'bg-primary/10'
                                                    : 'bg-card'
                                            } ${currentStep.isInvalid && isCurrentCell ? 'bg-destructive text-destructive-foreground' : ''
                                            }`}
                                        style={{
                                            borderRight: (c + 1) % 3 === 0 && c < 8 ? '2px solid hsl(var(--border))' : '',
                                            borderBottom: (r + 1) % 3 === 0 && r < 8 ? '2px solid hsl(var(--border))' : ''
                                        }}
                                    >
                                        {cell !== "." ? cell : ""}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="mt-4 p-4 bg-muted/50 border rounded-lg">
                            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Row {currentStep.row}</span>
                                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-muted/30 rounded border">
                                    {currentStep.row >= 0 && (currentStep.rows[currentStep.row] || []).map(v => (
                                        <span key={v} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-xs border border-blue-500/30">{v}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Col {currentStep.col}</span>
                                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-muted/30 rounded border">
                                    {currentStep.col >= 0 && (currentStep.cols[currentStep.col] || []).map(v => (
                                        <span key={v} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded text-xs border border-purple-500/30">{v}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Square {currentSquareRow},{currentSquareCol}</span>
                                <div className="flex flex-wrap gap-1 min-h-[40px] p-2 bg-muted/30 rounded border">
                                    {currentStep.row >= 0 && (currentStep.squares[`${currentSquareRow},${currentSquareCol}`] || []).map(v => (
                                        <span key={v} className="px-1.5 py-0.5 bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded text-xs border border-orange-500/30">{v}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <VariablePanel
                            variables={{
                                'row': currentStep.row,
                                'col': currentStep.col,
                                'value': currentStep.row >= 0 && currentStep.col >= 0 ? currentStep.board[currentStep.row][currentStep.col] : 'N/A',
                                'square': currentStep.row >= 0 ? `${currentSquareRow},${currentSquareCol}` : 'N/A',
                                'isValid': !currentStep.isInvalid
                            }}
                        />
                    </div>
                </div>
                <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
            </div>
        </div>
    );
};
