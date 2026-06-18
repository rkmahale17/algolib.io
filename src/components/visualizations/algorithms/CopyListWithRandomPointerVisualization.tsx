import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Info } from 'lucide-react';

interface NodeState {
  val: number;
  randomIdx: number | null;
  copied: boolean;
  nextConnected: boolean;
  randomConnected: boolean;
}

interface Step {
  originalNodes: NodeState[];
  currIdx: number | null;
  phase: 'init' | 'pass1' | 'between' | 'pass2' | 'return';
  mapEntries: Record<string, string>;
  highlightedLines: number[];
  explanation: string;
  lineExecution: string;
  variables: Record<string, unknown>;
}

export const CopyListWithRandomPointerVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function copyRandomList(head: Node | null): Node | null {
    const oldToCopy = new Map<Node | null, Node | null>();
    oldToCopy.set(null, null);

    let curr = head;

    while (curr) {
        const copy = new Node(curr.val);
        oldToCopy.set(curr, copy);
        curr = curr.next;
    }

    curr = head;

    while (curr) {
        const copy = oldToCopy.get(curr)!;

        copy.next = oldToCopy.get(curr.next) ?? null;
        copy.random = oldToCopy.get(curr.random) ?? null;

        curr = curr.next;
    }

    return oldToCopy.get(head) ?? null;
}`;

  const steps: Step[] = useMemo(() => {
    // Input list: [[7,null],[13,0],[11,4],[10,2],[1,0]]
    const inputNodes: { val: number; randomIdx: number | null }[] = [
      { val: 7, randomIdx: null },
      { val: 13, randomIdx: 0 },
      { val: 11, randomIdx: 4 },
      { val: 10, randomIdx: 2 },
      { val: 1, randomIdx: 0 }
    ];

    const stepsList: Step[] = [];
    const mapEntries: Record<string, string> = {};

    const getNodesState = (
      copiedIdxs: Set<number>,
      nextConnectedIdxs: Set<number>,
      randomConnectedIdxs: Set<number>
    ): NodeState[] => {
      return inputNodes.map((node, idx) => ({
        val: node.val,
        randomIdx: node.randomIdx,
        copied: copiedIdxs.has(idx),
        nextConnected: nextConnectedIdxs.has(idx),
        randomConnected: randomConnectedIdxs.has(idx)
      }));
    };

    // 1. Init function
    stepsList.push({
      originalNodes: getNodesState(new Set(), new Set(), new Set()),
      currIdx: null,
      phase: 'init',
      mapEntries: { ...mapEntries },
      highlightedLines: [1],
      explanation: "Start the deep copy process. The input is the head of the linked list containing next and random pointers.",
      lineExecution: "function copyRandomList(head)",
      variables: { head: "Node 0 (val: 7)" }
    });

    // 2. Initialize map oldToCopy
    mapEntries['null'] = 'null';
    stepsList.push({
      originalNodes: getNodesState(new Set(), new Set(), new Set()),
      currIdx: null,
      phase: 'init',
      mapEntries: { ...mapEntries },
      highlightedLines: [2, 3],
      explanation: "Initialize hash map oldToCopy. We map null to null to handle endpoints smoothly.",
      lineExecution: "const oldToCopy = new Map(); oldToCopy.set(null, null);",
      variables: { oldToCopy: "{ null -> null }" }
    });

    // 3. Set curr = head
    stepsList.push({
      originalNodes: getNodesState(new Set(), new Set(), new Set()),
      currIdx: 0,
      phase: 'pass1',
      mapEntries: { ...mapEntries },
      highlightedLines: [5],
      explanation: "Set curr pointer to the head of the list (Node 0) to begin the first pass.",
      lineExecution: "let curr = head;",
      variables: { curr: "Node 0 (val: 7)", oldToCopy: JSON.stringify(mapEntries) }
    });

    const copiedIdxs = new Set<number>();
    let currIdx = 0;

    // First Pass: Node Creations
    while (currIdx < inputNodes.length) {
      // while(curr) check
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
        currIdx,
        phase: 'pass1',
        mapEntries: { ...mapEntries },
        highlightedLines: [7],
        explanation: `Check if curr is not null. It points to Node ${currIdx} (val: ${inputNodes[currIdx].val}).`,
        lineExecution: `while (curr !== null) // curr is Node ${currIdx}`,
        variables: { curr: `Node ${currIdx}`, oldToCopy: JSON.stringify(mapEntries) }
      });

      // const copy = new Node(curr.val);
      copiedIdxs.add(currIdx);
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
        currIdx,
        phase: 'pass1',
        mapEntries: { ...mapEntries },
        highlightedLines: [8],
        explanation: `Create a standalone clone node: Copy ${currIdx} with value ${inputNodes[currIdx].val}.`,
        lineExecution: `const copy = new Node(${inputNodes[currIdx].val});`,
        variables: { curr: `Node ${currIdx}`, copy: `Copy ${currIdx}`, oldToCopy: JSON.stringify(mapEntries) }
      });

      // oldToCopy.set(curr, copy)
      mapEntries[`Node ${currIdx}`] = `Copy ${currIdx}`;
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
        currIdx,
        phase: 'pass1',
        mapEntries: { ...mapEntries },
        highlightedLines: [9],
        explanation: `Map Node ${currIdx} to Copy ${currIdx} in the oldToCopy hash map.`,
        lineExecution: `oldToCopy.set(curr, copy);`,
        variables: { curr: `Node ${currIdx}`, copy: `Copy ${currIdx}`, oldToCopy: JSON.stringify(mapEntries) }
      });

      // curr = curr.next
      currIdx++;
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
        currIdx: currIdx < inputNodes.length ? currIdx : null,
        phase: 'pass1',
        mapEntries: { ...mapEntries },
        highlightedLines: [10],
        explanation: `Advance curr pointer to the next node (Node ${currIdx < inputNodes.length ? currIdx : 'null'}).`,
        lineExecution: `curr = curr.next;`,
        variables: { curr: currIdx < inputNodes.length ? `Node ${currIdx}` : "null", oldToCopy: JSON.stringify(mapEntries) }
      });
    }

    // Check while(curr) loop termination
    stepsList.push({
      originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
      currIdx: null,
      phase: 'between',
      mapEntries: { ...mapEntries },
      highlightedLines: [7],
      explanation: "Check while loop condition: curr is null. Exit the node creation loop.",
      lineExecution: "while (curr) // curr is null",
      variables: { curr: "null", oldToCopy: JSON.stringify(mapEntries) }
    });

    // Reset curr = head
    currIdx = 0;
    stepsList.push({
      originalNodes: getNodesState(new Set(copiedIdxs), new Set(), new Set()),
      currIdx: 0,
      phase: 'pass2',
      mapEntries: { ...mapEntries },
      highlightedLines: [13],
      explanation: "Reset curr pointer to head (Node 0) to begin the second pass for pointer connections.",
      lineExecution: "curr = head;",
      variables: { curr: "Node 0", oldToCopy: JSON.stringify(mapEntries) }
    });

    const nextConnectedIdxs = new Set<number>();
    const randomConnectedIdxs = new Set<number>();

    // Second Pass: Connections
    while (currIdx < inputNodes.length) {
      // while(curr) check
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
        currIdx,
        phase: 'pass2',
        mapEntries: { ...mapEntries },
        highlightedLines: [15],
        explanation: `Check if curr is not null. It points to Node ${currIdx}.`,
        lineExecution: `while (curr) // curr is Node ${currIdx}`,
        variables: { curr: `Node ${currIdx}`, oldToCopy: JSON.stringify(mapEntries) }
      });

      // copy = oldToCopy.get(curr)
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
        currIdx,
        phase: 'pass2',
        mapEntries: { ...mapEntries },
        highlightedLines: [16],
        explanation: `Retrieve the copied counterpart Copy ${currIdx} from the map.`,
        lineExecution: `const copy = oldToCopy.get(curr);`,
        variables: { curr: `Node ${currIdx}`, copy: `Copy ${currIdx}`, oldToCopy: JSON.stringify(mapEntries) }
      });

      // copy.next = oldToCopy.get(curr.next)
      nextConnectedIdxs.add(currIdx);
      const nextIdx = currIdx + 1;
      const nextDest = nextIdx < inputNodes.length ? `Copy ${nextIdx}` : "null";
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
        currIdx,
        phase: 'pass2',
        mapEntries: { ...mapEntries },
        highlightedLines: [18],
        explanation: `Set Copy ${currIdx}'s next pointer to the clone of curr.next: oldToCopy.get(Node ${nextIdx < inputNodes.length ? nextIdx : 'null'}) = ${nextDest}.`,
        lineExecution: `copy.next = oldToCopy.get(curr.next) ?? null;`,
        variables: { curr: `Node ${currIdx}`, copy: `Copy ${currIdx}`, 'copy.next': nextDest }
      });

      // copy.random = oldToCopy.get(curr.random)
      randomConnectedIdxs.add(currIdx);
      const randomIdx = inputNodes[currIdx].randomIdx;
      const randomDest = randomIdx !== null ? `Copy ${randomIdx}` : "null";
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
        currIdx,
        phase: 'pass2',
        mapEntries: { ...mapEntries },
        highlightedLines: [19],
        explanation: `Set Copy ${currIdx}'s random pointer to the clone of curr.random: oldToCopy.get(Node ${randomIdx !== null ? randomIdx : 'null'}) = ${randomDest}.`,
        lineExecution: `copy.random = oldToCopy.get(curr.random) ?? null;`,
        variables: { curr: `Node ${currIdx}`, copy: `Copy ${currIdx}`, 'copy.random': randomDest }
      });

      // curr = curr.next
      currIdx++;
      stepsList.push({
        originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
        currIdx: currIdx < inputNodes.length ? currIdx : null,
        phase: 'pass2',
        mapEntries: { ...mapEntries },
        highlightedLines: [21],
        explanation: `Advance curr pointer to Node ${currIdx < inputNodes.length ? currIdx : 'null'}.`,
        lineExecution: `curr = curr.next;`,
        variables: { curr: currIdx < inputNodes.length ? `Node ${currIdx}` : "null", oldToCopy: JSON.stringify(mapEntries) }
      });
    }

    // Check while(curr) loop termination
    stepsList.push({
      originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
      currIdx: null,
      phase: 'return',
      mapEntries: { ...mapEntries },
      highlightedLines: [15],
      explanation: "Check while loop condition: curr is null. Exit the connections loop.",
      lineExecution: "while (curr) // curr is null",
      variables: { curr: "null", oldToCopy: JSON.stringify(mapEntries) }
    });

    // Return statement
    stepsList.push({
      originalNodes: getNodesState(new Set(copiedIdxs), new Set(nextConnectedIdxs), new Set(randomConnectedIdxs)),
      currIdx: null,
      phase: 'return',
      mapEntries: { ...mapEntries },
      highlightedLines: [24],
      explanation: "Retrieve the clone of the head node (Copy 0) from oldToCopy and return it. Deep copy complete!",
      lineExecution: "return oldToCopy.get(head) ?? null;",
      variables: { return: "Copy 0 (val: 7)", oldToCopy: JSON.stringify(mapEntries) }
    });

    return stepsList;
  }, []);

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Linked List SVG Arena */}
          <Card className="p-6 bg-card border border-border relative overflow-hidden">
            <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">
              Linked List Deep Copy Arena
            </h3>

            <div className="relative w-full overflow-x-auto pb-2">
              <svg viewBox="0 0 540 270" className="w-full min-w-[500px] h-auto bg-muted/10 rounded-lg border border-border/40">
                <defs>
                  {/* Standard Next Arrowhead */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-muted-foreground/60" />
                  </marker>
                  {/* Copy Next Arrowhead */}
                  <marker id="arrow-copy-next" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-emerald-500" />
                  </marker>
                  {/* Original Random Arrowhead */}
                  <marker id="arrow-random-orig" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-amber-500/70" />
                  </marker>
                  {/* Copy Random Arrowhead */}
                  <marker id="arrow-random-copy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-emerald-500" />
                  </marker>
                  {/* Map Connection Arrowhead */}
                  <marker id="arrow-map" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-primary/60" />
                  </marker>
                </defs>

                {/* ROW 1: Original Linked List Pointers */}
                {step.originalNodes.map((node, idx) => (
                  <g key={`orig-ptrs-${idx}`}>
                    {/* Next pointers */}
                    {idx < step.originalNodes.length - 1 && (
                      <line
                        x1={100 + idx * 100}
                        y1={62.5}
                        x2={140 + idx * 100}
                        y2={62.5}
                        className="stroke-muted-foreground/40 stroke-2"
                        markerEnd="url(#arrow)"
                      />
                    )}

                    {/* Random pointers */}
                    {node.randomIdx !== null && (() => {
                      const x_start = 70 + idx * 100;
                      const x_end = 70 + node.randomIdx * 100;
                      const dx = Math.abs(x_end - x_start);
                      const h = Math.min(dx * 0.35, 60);
                      const y_ctrl = 45 - h;
                      const path = `M ${x_start} 45 C ${x_start} ${y_ctrl}, ${x_end} ${y_ctrl}, ${x_end} 45`;
                      return (
                        <path
                          d={path}
                          fill="transparent"
                          className="stroke-amber-500/40 stroke-1.5"
                          markerEnd="url(#arrow-random-orig)"
                        />
                      );
                    })()}
                  </g>
                ))}

                {/* ROW 2: Copied Linked List Pointers */}
                {step.originalNodes.map((node, idx) => (
                  <g key={`copy-ptrs-${idx}`}>
                    {/* Next pointers copy */}
                    {idx < step.originalNodes.length - 1 && node.copied && node.nextConnected && (
                      <line
                        x1={100 + idx * 100}
                        y1={182.5}
                        x2={140 + idx * 100}
                        y2={182.5}
                        className="stroke-emerald-500 stroke-2 transition-all duration-300"
                        markerEnd="url(#arrow-copy-next)"
                      />
                    )}

                    {/* Random pointers copy */}
                    {node.copied && node.randomConnected && node.randomIdx !== null && (() => {
                      const x_start = 70 + idx * 100;
                      const x_end = 70 + node.randomIdx * 100;
                      const dx = Math.abs(x_end - x_start);
                      const h = Math.min(dx * 0.35, 60);
                      const y_ctrl = 200 + h;
                      const path = `M ${x_start} 200 C ${x_start} ${y_ctrl}, ${x_end} ${y_ctrl}, ${x_end} 200`;
                      return (
                        <path
                          d={path}
                          fill="transparent"
                          className="stroke-emerald-500 stroke-1.5 transition-all duration-300"
                          markerEnd="url(#arrow-random-copy)"
                        />
                      );
                    })()}
                  </g>
                ))}

                {/* Hash Map dashed connection lines */}
                {step.originalNodes.map((node, idx) => (
                  <g key={`map-line-${idx}`}>
                    {node.copied && (
                      <line
                        x1={70 + idx * 100}
                        y1={80}
                        x2={70 + idx * 100}
                        y2={160}
                        className="stroke-primary/50 stroke-1.5 stroke-dashed transition-all duration-300"
                        markerEnd="url(#arrow-map)"
                      />
                    )}
                  </g>
                ))}

                {/* ROW 1: Original Node Boxes */}
                {step.originalNodes.map((node, idx) => (
                  <g key={`orig-node-${idx}`}>
                    <rect
                      x={40 + idx * 100}
                      y={45}
                      width={60}
                      height={35}
                      rx={6}
                      className={`stroke-2 transition-all duration-300 ${
                        step.currIdx === idx && step.phase !== 'pass2'
                          ? 'fill-amber-500/10 stroke-amber-500 ring-2 ring-amber-500/10'
                          : step.currIdx === idx && step.phase === 'pass2'
                          ? 'fill-blue-500/10 stroke-blue-500'
                          : 'fill-card stroke-border'
                      }`}
                    />
                    <text
                      x={70 + idx * 100}
                      y={67}
                      textAnchor="middle"
                      className="text-xs font-bold fill-foreground select-none"
                    >
                      val: {node.val}
                    </text>
                    <text
                      x={70 + idx * 100}
                      y={36}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-muted-foreground select-none"
                    >
                      Node {idx}
                    </text>

                    {/* curr pointer label */}
                    {step.currIdx === idx && (
                      <g className="transition-all duration-200">
                        <rect
                          x={48 + idx * 100}
                          y={2}
                          width={44}
                          height={15}
                          rx={3}
                          className={`${
                            step.phase === 'pass2' ? 'fill-blue-500 stroke-blue-600' : 'fill-amber-500 stroke-amber-600'
                          } stroke`}
                        />
                        <text
                          x={70 + idx * 100}
                          y={12}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-white select-none"
                        >
                          curr
                        </text>
                      </g>
                    )}
                  </g>
                ))}

                {/* ROW 2: Copied Node Boxes */}
                {step.originalNodes.map((node, idx) => (
                  <g key={`copy-node-${idx}`}>
                    <rect
                      x={40 + idx * 100}
                      y={165}
                      width={60}
                      height={35}
                      rx={6}
                      className={`stroke-2 transition-all duration-300 ${
                        !node.copied
                          ? 'fill-transparent stroke-dashed stroke-muted-foreground/20'
                          : step.currIdx === idx && step.phase === 'pass2'
                          ? 'fill-emerald-500/10 stroke-emerald-500 ring-2 ring-emerald-500/10'
                          : 'fill-card stroke-border'
                      }`}
                    />
                    {node.copied && (
                      <text
                        x={70 + idx * 100}
                        y={187}
                        textAnchor="middle"
                        className="text-xs font-bold fill-foreground select-none"
                      >
                        val: {node.val}
                      </text>
                    )}
                    <text
                      x={70 + idx * 100}
                      y={215}
                      textAnchor="middle"
                      className={`text-[9px] font-bold transition-all duration-300 select-none ${
                        node.copied ? 'fill-muted-foreground' : 'fill-muted-foreground/20'
                      }`}
                    >
                      Copy {idx}
                    </text>

                    {/* copy pointer label */}
                    {step.currIdx === idx && step.phase === 'pass2' && node.copied && (
                      <g className="transition-all duration-200">
                        <rect
                          x={48 + idx * 100}
                          y={225}
                          width={44}
                          height={15}
                          rx={3}
                          className="fill-emerald-500 stroke-emerald-600 stroke"
                        />
                        <text
                          x={70 + idx * 100}
                          y={235}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-white select-none"
                        >
                          copy
                        </text>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground border-t border-border/60 pt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500" />
                <span>curr (Pass 1)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-blue-500/20 border border-blue-500" />
                <span>curr (Pass 2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500" />
                <span>copy / connections</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 border border-dashed border-primary/50" />
                <span>Map Mapping (oldToCopy)</span>
              </div>
            </div>
          </Card>

          {/* Interactive Guide Narrative Box at bottom */}
          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Interactive Guide
            </h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>

          {/* Variables panel below commentary */}
          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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
  );
};
