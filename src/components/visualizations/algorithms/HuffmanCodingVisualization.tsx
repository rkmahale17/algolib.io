import React, { useEffect, useRef, useState } from "react";
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface HuffmanNode {
    char: string;
    freq: number;
    left: HuffmanNode | null;
    right: HuffmanNode | null;
    id: string;
}

interface Step {
    freqMap: Record<string, number>;
    heap: HuffmanNode[];
    activeIds: string[];
    codes: Record<string, string>;
    message: string;
    lineNumber: number;
}

export const HuffmanCodingVisualization: React.FC = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1000);
    const intervalRef = useRef<number | null>(null);

    const code = `function huffmanEncoding(text: string): Map<string, string> {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  const heap: HuffmanNode[] = Array.from(freqMap.entries())
    .map(([char, freq]) => new HuffmanNode(char, freq));

  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift()!;
    const right = heap.shift()!;
    const parent = new HuffmanNode('', left.freq + right.freq, left, right);
    heap.push(parent);
  }

  const codes = new Map<string, string>();
  function buildCodes(node: HuffmanNode | null, code: string): void {
    if (!node) return;
    if (!node.left && !node.right) {
      codes.set(node.char, code || '0');
      return;
    }
    buildCodes(node.left, code + '0');
    buildCodes(node.right, code + '1');
  }
  buildCodes(heap[0], '');

  return codes;
}

class HuffmanNode {
  constructor(
    public char: string,
    public freq: number,
    public left: HuffmanNode | null = null,
    public right: HuffmanNode | null = null
  ) {}
}`;

    const generateSteps = () => {
        const text = "ABRACADABRA";
        const newSteps: Step[] = [];

        // 1. Frequency Map
        const freqMap: Record<string, number> = {};
        newSteps.push({
            freqMap: {},
            heap: [],
            activeIds: [],
            codes: {},
            message: `Start with text: "${text}". Calculate frequencies of each character.`,
            lineNumber: 1,
        });

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            freqMap[char] = (freqMap[char] || 0) + 1;
            newSteps.push({
                freqMap: { ...freqMap },
                heap: [],
                activeIds: [],
                codes: {},
                message: `Counted '${char}'. Current frequencies: ${JSON.stringify(freqMap)}`,
                lineNumber: 4,
            });
        }

        // 2. Initial Heap
        const nodes: HuffmanNode[] = Object.entries(freqMap).map(([char, freq]) => ({
            char,
            freq,
            left: null,
            right: null,
            id: `leaf-${char}`
        }));

        newSteps.push({
            freqMap: { ...freqMap },
            heap: [...nodes],
            activeIds: [],
            codes: {},
            message: "Create initial nodes from the frequency map and add them to the heap.",
            lineNumber: 7,
        });

        // 3. While loop - Building Tree
        let heap = [...nodes];

        while (heap.length > 1) {
            // Sort
            heap.sort((a, b) => a.freq - b.freq);
            newSteps.push({
                freqMap: { ...freqMap },
                heap: heap.map(n => ({ ...n })),
                activeIds: [],
                codes: {},
                message: "Sort the heap to find the two nodes with the smallest frequencies.",
                lineNumber: 11,
            });

            // Shift 2
            const left = heap.shift()!;
            const right = heap.shift()!;

            newSteps.push({
                freqMap: { ...freqMap },
                heap: [left, right, ...heap].map(n => ({ ...n })),
                activeIds: [left.id, right.id],
                codes: {},
                message: `Extract the two smallest nodes: '${left.char || 'internal'}' (${left.freq}) and '${right.char || 'internal'}' (${right.freq}).`,
                lineNumber: 12,
            });

            const parent: HuffmanNode = {
                char: '',
                freq: left.freq + right.freq,
                left,
                right,
                id: `node-${left.id}-${right.id}`
            };

            heap.push(parent);

            newSteps.push({
                freqMap: { ...freqMap },
                heap: heap.map(n => ({ ...n })),
                activeIds: [parent.id],
                codes: {},
                message: `Create a parent node with sum frequency ${parent.freq} and push it back to the heap.`,
                lineNumber: 15,
            });
        }

        // 4. Build Codes
        const codes: Record<string, string> = {};
        const traverse = (node: HuffmanNode | null, code: string) => {
            if (!node) return;

            newSteps.push({
                freqMap: { ...freqMap },
                heap: [...heap],
                activeIds: [node.id],
                codes: { ...codes },
                message: `Visiting ${node.char ? `'${node.char}'` : 'internal node'}. Current path code: ${code || 'root'}`,
                lineNumber: 21,
            });

            if (!node.left && !node.right) {
                codes[node.char] = code || '0';
                newSteps.push({
                    freqMap: { ...freqMap },
                    heap: [...heap],
                    activeIds: [node.id],
                    codes: { ...codes },
                    message: `Leaf node '${node.char}' reached. Huffman code: ${codes[node.char]}`,
                    lineNumber: 24,
                });
                return;
            }

            traverse(node.left, code + '0');
            traverse(node.right, code + '1');
        };

        traverse(heap[0], '');

        newSteps.push({
            freqMap: { ...freqMap },
            heap: [...heap],
            activeIds: [],
            codes: { ...codes },
            message: "Huffman encoding completed! Final codes generated for each character.",
            lineNumber: 31,
        });

        setSteps(newSteps);
        setCurrentStepIndex(0);
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
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleStepForward = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };
    const handleStepBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };
    const handleReset = () => {
        setCurrentStepIndex(0);
        setIsPlaying(false);
    };

    if (steps.length === 0) return null;

    const currentStep = steps[currentStepIndex];

    // Tree rendering helper
    const renderTree = (node: HuffmanNode | null, x: number, y: number, offset: number, depth: number = 0): JSX.Element | null => {
        if (!node) return null;

        const isActive = currentStep.activeIds.includes(node.id);

        return (
            <g key={node.id}>
                {node.left && (
                    <>
                        <line
                            x1={x} y1={y} x2={x - offset} y2={y + 50}
                            className={`stroke-2 ${isActive ? 'stroke-primary' : 'stroke-muted-foreground/30'}`}
                        />
                        <text x={x - offset / 2 - 5} y={y + 25} className="text-[8px] fill-muted-foreground">0</text>
                        {renderTree(node.left, x - offset, y + 50, offset / 1.8, depth + 1)}
                    </>
                )}
                {node.right && (
                    <>
                        <line
                            x1={x} y1={y} x2={x + offset} y2={y + 50}
                            className={`stroke-2 ${isActive ? 'stroke-primary' : 'stroke-muted-foreground/30'}`}
                        />
                        <text x={x + offset / 2 + 5} y={y + 25} className="text-[8px] fill-muted-foreground">1</text>
                        {renderTree(node.right, x + offset, y + 50, offset / 1.8, depth + 1)}
                    </>
                )}
                <circle
                    cx={x}
                    cy={y}
                    r={18}
                    className={`transition-all duration-300 ${isActive ? "fill-primary stroke-primary-foreground" : node.char ? "fill-secondary stroke-border" : "fill-accent/40 stroke-border"
                        } stroke-2`}
                />
                <text
                    x={x}
                    y={y - 2}
                    textAnchor="middle"
                    className={`text-[10px] font-bold ${isActive ? "fill-primary-foreground" : "fill-foreground"}`}
                >
                    {node.char || "∑"}
                </text>
                <text
                    x={x}
                    y={y + 10}
                    textAnchor="middle"
                    className={`text-[8px] ${isActive ? "fill-primary-foreground/80" : "fill-muted-foreground"}`}
                >
                    {node.freq}
                </text>
            </g>
        );
    };

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
                totalSteps={steps.length - 1}
                speed={speed}
                onSpeedChange={setSpeed}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-card rounded-lg p-6 border space-y-4">
                        <h3 className="text-lg font-semibold">Huffman Tree Workspace</h3>

                        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b">
                            <div className="bg-muted p-3 rounded-md flex-1 min-w-[150px]">
                                <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Frequency Map</h4>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                    {Object.entries(currentStep.freqMap).map(([char, freq]) => (
                                        <div key={char} className="bg-secondary px-2 py-1 rounded border border-border flex gap-2 items-center">
                                            <span className="font-bold">{char}</span>
                                            <span className="text-muted-foreground">× {freq}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {Object.keys(currentStep.codes).length > 0 && (
                                <div className="bg-primary/5 p-3 rounded-md border border-primary/20 flex-1 min-w-[150px]">
                                    <h4 className="text-xs font-semibold mb-2 text-primary uppercase">Generated Codes</h4>
                                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                                        {Object.entries(currentStep.codes).map(([char, code]) => (
                                            <div key={char} className="flex gap-2 items-center">
                                                <span className="font-bold">{char}:</span>
                                                <span className="text-primary font-mono">{code}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full overflow-x-auto min-h-[400px] flex items-center justify-center bg-muted/10 rounded border border-dashed p-4">
                            <svg
                                width={Math.max(500, currentStep.heap.length * 120)}
                                height="380"
                                viewBox={`0 0 ${Math.max(500, currentStep.heap.length * 120)} 380`}
                            >
                                {/* Horizontal guide for heap */}
                                <line x1="0" y1="350" x2="100%" y2="350" className="stroke-border stroke-1 stroke-dasharray-4" />

                                {currentStep.heap.map((root, idx) => {
                                    const xOffset = (Math.max(500, currentStep.heap.length * 120) / (currentStep.heap.length + 1)) * (idx + 1);
                                    return (
                                        <g key={root.id}>
                                            <text x={xOffset} y={370} textAnchor="middle" className="text-[8px] fill-muted-foreground uppercase">Tree {idx + 1}</text>
                                            {renderTree(root, xOffset, 60, currentStep.heap.length > 3 ? 40 : 80)}
                                        </g>
                                    )
                                })}
                            </svg>
                        </div>

                        <div className="p-4 bg-primary/5 rounded border border-primary/20">
                            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
                        </div>
                    </div>

                    <VariablePanel
                        variables={{
                            "Nodes in Heap": currentStep.heap.length,
                            "Phase": currentStepIndex < 12 ? "Counting Frequencies" : currentStep.heap.length > 1 ? "Building Tree" : "Extracting Codes",
                            "Characters Encoded": Object.keys(currentStep.codes).length,
                        }}
                    />
                </div>

                <div className="space-y-4">
                    <AnimatedCodeEditor
                        code={code}
                        highlightedLines={[currentStep.lineNumber]}
                        language="TypeScript"
                    />
                </div>
            </div>
        </div>
    );
};
