import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
    parent: number[];
    rank: number[];
    results: number[];
    highlightedLines: number[];
    explanation: string;
    variables: Record<string, any>;
    activeNodes: number[];
    phase: 'init' | 'find' | 'union' | 'results' | 'done';
}

const N = 6;
const UNION_OPS: number[][] = [[0, 1], [2, 3], [4, 5], [0, 2], [0, 4]];
const FIND_OPS: number[] = [1, 5];

export const UnionFindByRankVisualization = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const code = `function solveUnionFind(
  union_operations: number[][],
  find_operations: number[],
  n: number
): number[] {
  const parent: number[] = new Array(n);
  const rank: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    parent[i] = i;
  }

  function find(i: number): number {
    if (parent[i] === i) {
      return i;
    }
    parent[i] = find(parent[i]);
    return parent[i];
  }

  function union(x: number, y: number): void {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
    }
  }

  for (const operation of union_operations) {
    union(operation[0], operation[1]);
  }

  const results: number[] = [];
  for (const node of find_operations) {
    results.push(find(node));
  }

  return results;
}`;

    const steps: Step[] = useMemo(() => {
        const s: Step[] = [];
        const parent: number[] = new Array(N);
        const rank: number[] = new Array(N).fill(0);
        const results: number[] = [];

        s.push({
            parent: [...parent], rank: [...rank], results: [],
            highlightedLines: [1, 2, 3, 4, 5],
            explanation: `Initialize solveUnionFind with n=${N}.`,
            variables: { n: N, union_operations: JSON.stringify(UNION_OPS), find_operations: JSON.stringify(FIND_OPS) },
            activeNodes: [],
            phase: 'init'
        });

        s.push({
            parent: [...parent], rank: [...rank], results: [],
            highlightedLines: [6, 7],
            explanation: `Initialize parent and rank arrays. Ranks start at 0.`,
            variables: { parent: 'uninitialized', rank: `[${rank.join(', ')}]` },
            activeNodes: [],
            phase: 'init'
        });

        for (let i = 0; i < N; i++) {
            parent[i] = i;
        }

        s.push({
            parent: [...parent], rank: [...rank], results: [],
            highlightedLines: [9, 10, 11],
            explanation: `Set each node's parent to itself: [${parent.join(', ')}].`,
            variables: { parent: `[${parent.join(', ')}]` },
            activeNodes: Array.from({ length: N }, (_, index) => index),
            phase: 'init'
        });

        const findFn = (i: number, isRecursiveCall = false): number => {
            if (!isRecursiveCall) {
                s.push({
                    parent: [...parent], rank: [...rank], results: [...results],
                    highlightedLines: [13],
                    explanation: `find(${i}): starting search for representative.`,
                    variables: { i, 'parent[i]': parent[i] },
                    activeNodes: [i],
                    phase: 'find'
                });
            }

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [14],
                explanation: `Checking if node ${i} is its own parent (root).`,
                variables: { i, 'parent[i]': parent[i] },
                activeNodes: [i],
                phase: 'find'
            });

            if (parent[i] === i) {
                s.push({
                    parent: [...parent], rank: [...rank], results: [...results],
                    highlightedLines: [15],
                    explanation: `Node ${i} is the root. Returning ${i}.`,
                    variables: { i, root: i },
                    activeNodes: [i],
                    phase: 'find'
                });
                return i;
            }

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [17],
                explanation: `Node ${i} is not root. Recursively find root of parent ${parent[i]} and apply path compression.`,
                variables: { i, 'parent[i]': parent[i] },
                activeNodes: [i, parent[i]],
                phase: 'find'
            });

            const root = findFn(parent[i], true);
            parent[i] = root;

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [17, 18],
                explanation: `Path compression: set parent of ${i} to ${root}. Returning ${root}.`,
                variables: { i, 'parent[i]': parent[i], root },
                activeNodes: [i, root],
                phase: 'find'
            });

            return root;
        };

        const unionFn = (x: number, y: number): void => {
            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [21],
                explanation: `union(${x}, ${y}): merging sets containing ${x} and ${y}.`,
                variables: { x, y },
                activeNodes: [x, y],
                phase: 'union'
            });

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [22],
                explanation: `Finding root of x (${x}).`,
                variables: { x, y },
                activeNodes: [x],
                phase: 'union'
            });
            const rootX = findFn(x);

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [23],
                explanation: `Finding root of y (${y}).`,
                variables: { x, y, rootX },
                activeNodes: [y],
                phase: 'union'
            });
            const rootY = findFn(y);

            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [25],
                explanation: `Checking if roots are different: rootX=${rootX}, rootY=${rootY}.`,
                variables: { x, y, rootX, rootY },
                activeNodes: [rootX, rootY],
                phase: 'union'
            });

            if (rootX !== rootY) {
                s.push({
                    parent: [...parent], rank: [...rank], results: [...results],
                    highlightedLines: [26],
                    explanation: `Comparing ranks: rank[${rootX}]=${rank[rootX]}, rank[${rootY}]=${rank[rootY]}.`,
                    variables: { rootX, rootY, 'rank[rootX]': rank[rootX], 'rank[rootY]': rank[rootY] },
                    activeNodes: [rootX, rootY],
                    phase: 'union'
                });

                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                    s.push({
                        parent: [...parent], rank: [...rank], results: [...results],
                        highlightedLines: [27],
                        explanation: `rank[${rootX}] < rank[${rootY}]. Attach tree ${rootX} to ${rootY}.`,
                        variables: { rootX, rootY, [`parent[${rootX}]`]: rootY },
                        activeNodes: [rootX, rootY],
                        phase: 'union'
                    });
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                    s.push({
                        parent: [...parent], rank: [...rank], results: [...results],
                        highlightedLines: [28, 29],
                        explanation: `rank[${rootX}] > rank[${rootY}]. Attach tree ${rootY} to ${rootX}.`,
                        variables: { rootX, rootY, [`parent[${rootY}]`]: rootX },
                        activeNodes: [rootX, rootY],
                        phase: 'union'
                    });
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                    s.push({
                        parent: [...parent], rank: [...rank], results: [...results],
                        highlightedLines: [30, 31, 32],
                        explanation: `Ranks equal. Attach tree ${rootY} to ${rootX} and increment rank of ${rootX} to ${rank[rootX]}.`,
                        variables: { rootX, rootY, [`parent[${rootY}]`]: rootX, [`rank[${rootX}]`]: rank[rootX] },
                        activeNodes: [rootX, rootY],
                        phase: 'union'
                    });
                }
            } else {
                s.push({
                    parent: [...parent], rank: [...rank], results: [...results],
                    highlightedLines: [25],
                    explanation: `Roots are the same (${rootX}). Already in the same set.`,
                    variables: { rootX, rootY },
                    activeNodes: [rootX],
                    phase: 'union'
                });
            }
        };

        for (const op of UNION_OPS) {
            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [37, 38],
                explanation: `Processing union operation [${op[0]}, ${op[1]}].`,
                variables: { op: JSON.stringify(op) },
                activeNodes: [op[0], op[1]],
                phase: 'union'
            });
            unionFn(op[0], op[1]);
        }

        s.push({
            parent: [...parent], rank: [...rank], results: [...results],
            highlightedLines: [41],
            explanation: `All union operations completed. Initializing results array.`,
            variables: { results: '[]' },
            activeNodes: [],
            phase: 'results'
        });

        for (const node of FIND_OPS) {
            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [42, 43],
                explanation: `Performing find operation for node ${node}.`,
                variables: { node, results: JSON.stringify(results) },
                activeNodes: [node],
                phase: 'results'
            });
            const root = findFn(node);
            results.push(root);
            s.push({
                parent: [...parent], rank: [...rank], results: [...results],
                highlightedLines: [43],
                explanation: `find(${node}) returned ${root}. Adding to results.`,
                variables: { results: JSON.stringify(results) },
                activeNodes: [node, root],
                phase: 'results'
            });
        }

        s.push({
            parent: [...parent], rank: [...rank], results: [...results],
            highlightedLines: [46],
            explanation: `Algorithm finished. Final results: [${results.join(', ')}].`,
            variables: { results: JSON.stringify(results) },
            activeNodes: [],
            phase: 'done'
        });

        return s;
    }, []);

    const step = steps[currentStep] || steps[0];

    const computePositions = useMemo<{ x: number; y: number }[]>(() => {
        const children: Record<number, number[]> = {};
        for (let i = 0; i < N; i++) {
            if (step.parent[i] !== i && step.parent[i] !== undefined) {
                const p = step.parent[i];
                if (!children[p]) children[p] = [];
                children[p].push(i);
            }
        }

        const rootNodes = Array.from({ length: N }, (_, i) => i).filter(i => step.parent[i] === i);
        const pos: { x: number; y: number }[] = new Array(N).fill(null).map(() => ({ x: 0, y: 0 }));
        const svgW = 520;
        const colW = svgW / (rootNodes.length + 1);

        rootNodes.forEach((root, ri) => {
            const rootX = colW * (ri + 1);
            pos[root] = { x: rootX, y: 55 };

            const kids = children[root] || [];
            const spread = Math.min(colW * 0.7, 70);
            const step_x = kids.length > 1 ? spread / (kids.length - 1) : 0;
            const startX = kids.length > 1 ? rootX - spread / 2 : rootX;

            kids.forEach((child, ci) => {
                const cx = startX + step_x * ci;
                pos[child] = { x: cx, y: 145 };
                const grandkids = children[child] || [];
                const gSpread = 50;
                const gStep = grandkids.length > 1 ? gSpread / (grandkids.length - 1) : 0;
                const gStartX = grandkids.length > 1 ? cx - gSpread / 2 : cx;
                grandkids.forEach((gc, gi) => {
                    pos[gc] = { x: gStartX + gStep * gi, y: 220 };
                });
            });
        });

        return pos;
    }, [step.parent]);

    const treeEdges = useMemo(() => {
        const edges: { from: number; to: number }[] = [];
        for (let i = 0; i < N; i++) {
            if (step.parent[i] !== i && step.parent[i] !== undefined) edges.push({ from: i, to: step.parent[i] });
        }
        return edges;
    }, [step.parent]);

    const getNodeStyle = (i: number) => {
        if (step.activeNodes.includes(i)) return { fill: '#84cc1622', stroke: '#84cc16', text: '#84cc16' };
        if (step.parent[i] === i) return { fill: '#34d39922', stroke: '#34d399', text: '#34d399' };
        return { fill: '#1e293b', stroke: '#475569', text: '#94a3b8' };
    };

    return (
        <VisualizationLayout
            leftContent={
                <div className="space-y-5">
                    <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20">
                        <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
                            Union-Find Forest (Rank + Path Compression)
                        </h3>

                        <svg viewBox="0 0 520 260" className="w-full h-auto" style={{ minHeight: 200 }}>
                            {treeEdges.map(({ from, to }, idx) => {
                                const fpos = computePositions[from];
                                const tpos = computePositions[to];
                                const active = step.activeNodes.includes(from) || step.activeNodes.includes(to);
                                return (
                                    <line
                                        key={idx}
                                        x1={fpos.x} y1={fpos.y}
                                        x2={tpos.x} y2={tpos.y}
                                        stroke={active ? '#84cc16' : '#334155'}
                                        strokeWidth={active ? 2.5 : 1.5}
                                    />
                                );
                            })}

                            {Array.from({ length: N }, (_, i) => i).map((i) => {
                                const pos = computePositions[i];
                                const { fill, stroke, text } = getNodeStyle(i);
                                const isActive = step.activeNodes.includes(i);
                                const isRoot = step.parent[i] === i;
                                const r = isActive ? 22 : 18;
                                return (
                                    <g key={i}>
                                        {isRoot && (
                                            <text x={pos.x} y={pos.y - r - 6} textAnchor="middle" fill="#34d399" fontSize={8} fontWeight="bold">
                                                ROOT
                                            </text>
                                        )}
                                        <circle cx={pos.x} cy={pos.y} r={r} fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 2} />
                                        <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill={text} fontSize={isActive ? 14 : 13} fontWeight="bold">
                                            {i}
                                        </text>
                                        <text x={pos.x} y={pos.y + r + 12} textAnchor="middle" fill="#64748b" fontSize={9}>
                                            rank:{step.rank[i]}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#34d39922', border: '1px solid #34d399' }} />
                                Root
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#84cc1622', border: '1px solid #84cc16' }} />
                                Active
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#1e293b', border: '1px solid #475569' }} />
                                Child
                            </span>
                        </div>
                    </Card>

                    <Card className="p-4 bg-card/50 border-primary/20">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">parent[ ] &amp; rank[ ]</h4>
                        <div className="flex gap-2 flex-wrap">
                            {Array.from({ length: N }, (_, i) => i).map((i) => {
                                const isActive = step.activeNodes.includes(i);
                                const isRoot = step.parent[i] === i;
                                return (
                                    <motion.div
                                        key={i}
                                        animate={{ scale: isActive ? 1.1 : 1 }}
                                        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border-2 text-xs font-mono transition-all"
                                        style={{
                                            background: isActive ? 'rgba(132,204,22,0.12)' : isRoot ? 'rgba(52,211,153,0.12)' : 'rgba(30,41,59,0.5)',
                                            borderColor: isActive ? '#84cc16' : isRoot ? '#34d399' : '#334155',
                                            color: isActive ? '#84cc16' : isRoot ? '#34d399' : '#94a3b8'
                                        }}
                                    >
                                        <span style={{ fontSize: '9px', opacity: 0.6 }}>node {i}</span>
                                        <span className="font-bold">p:{step.parent[i] !== undefined ? step.parent[i] : '?'}</span>
                                        <span style={{ fontSize: '9px' }}>r:{step.rank[i]}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step</h4>
                            <p className="text-sm font-medium leading-relaxed min-h-[40px]">{step.explanation}</p>
                        </Card>

                        <Card className="p-4 bg-secondary/10 border-secondary/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Results</h4>
                            <div className="flex gap-2 flex-wrap min-h-[40px] items-center">
                                {step.results.length === 0 ? <span className="text-xs text-muted-foreground italic">No results yet</span> :
                                    step.results.map((res, idx) => (
                                        <motion.span
                                            key={idx}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="px-2 py-1 bg-secondary/20 rounded border border-secondary/30 text-xs font-bold"
                                        >
                                            {res}
                                        </motion.span>
                                    ))
                                }
                            </div>
                        </Card>
                    </div>
                </div>
            }
            rightContent={
                <div className="space-y-4">
                    <AnimatedCodeEditor
                        code={code}
                        language="typescript"
                        highlightedLines={step.highlightedLines}
                    />
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
