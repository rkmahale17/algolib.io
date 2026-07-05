import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  parent: number[];
  rank: number[];
  results: number[];
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
  activeNodes: number[];
  phase: 'init' | 'find' | 'union' | 'results' | 'done';
}

const N = 6;
const UNION_OPS: number[][] = [[0, 1], [2, 3], [4, 5], [0, 2], [0, 4]];
const FIND_OPS: number[] = [1, 5];

const languages: VisualizationLanguageMap = {
  typescript: `function solveUnionFind(
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
}`,

  python: `def solve_union_find(union_operations, find_operations, n):
    parent = list(range(n))
    rank = [0] * n
    def find(i):
        if parent[i] != i:
            parent[i] = find(parent[i])
        return parent[i]
    def union(x, y):
        rootX = find(x)
        rootY = find(y)
        if rootX != rootY:
            if rank[rootX] < rank[rootY]:
                parent[rootX] = rootY
            elif rank[rootX] > rank[rootY]:
                parent[rootY] = rootX
            else:
                parent[rootY] = rootX
                rank[rootX] += 1
    for x, y in union_operations:
        union(x, y)
    results = []
    for node in find_operations:
        results.append(find(node))
    return results`,

  java: `static int find(int[] parent, int i) {
    if (parent[i] == i) {
        return i;
    }
    return parent[i] = find(parent, parent[i]);
}
static void union(int[] parent, int[] rank, int x, int y) {
    int rootX = find(parent, x);
    int rootY = find(parent, y);
    if (rootX != rootY) {
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
static int[] solveUnionFind(int[][] union_operations, int[] find_operations, int n) {
    int[] parent = new int[n];
    int[] rank = new int[n];
    for (int i = 0; i < n; i++) {
        parent[i] = i;
        rank[i] = 0;
    }
    for (int[] operation : union_operations) {
        union(parent, rank, operation[0], operation[1]);
    }
    int[] results = new int[find_operations.length];
    for (int i = 0; i < find_operations.length; i++) {
        results[i] = find(parent, find_operations[i]);
    }
    return results;
}`,

  cpp: `int findRoot(vector<int>& parent, int i) {
    if (parent[i] != i) {
        parent[i] = findRoot(parent, parent[i]);
    }
    return parent[i];
}
void unionSet(vector<int>& parent, vector<int>& rank, int x, int y) {
    int rootX = findRoot(parent, x);
    int rootY = findRoot(parent, y);
    if (rootX != rootY) {
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        }
        else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        }
        else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}
vector<int> solveUnionFind(vector<vector<int>>& union_operations,
                           vector<int>& find_operations,
                           int n) {
    vector<int> parent(n);
    vector<int> rank(n, 0);
    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }
    for (auto& op : union_operations) {
        unionSet(parent, rank, op[0], op[1]);
    }
    vector<int> results;
    for (int node : find_operations) {
        results.push_back(findRoot(parent, node));
    }
    return results;
}`,
};

export const UnionFindByRankVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const parent: number[] = new Array(N);
    const rank: number[] = new Array(N).fill(0);
    const results: number[] = [];

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

    s.push({
      parent: [...parent], rank: [...rank], results: [],
      explanation: `Initialize solveUnionFind with n=${N}.`,
      pseudoStep: `CALL solveUnionFind(union_operations, find_operations, n = ${N})`,
      variables: { n: N, union_operations: JSON.stringify(UNION_OPS), find_operations: JSON.stringify(FIND_OPS) },
      activeNodes: [],
      phase: 'init'
    });
    addLines(1, 1, 21, 23);

    s.push({
      parent: [...parent], rank: [...rank], results: [],
      explanation: `Initialize parent and rank arrays. Ranks start at 0.`,
      pseudoStep: `SET parent = Array(n), rank = Array(n).fill(0)`,
      variables: { parent: 'uninitialized', rank: `[${rank.join(', ')}]` },
      activeNodes: [],
      phase: 'init'
    });
    addLines(6, 2, 22, 26);

    for (let i = 0; i < N; i++) {
      parent[i] = i;
    }

    s.push({
      parent: [...parent], rank: [...rank], results: [],
      explanation: `Set each node's parent to itself: [${parent.join(', ')}].`,
      pseudoStep: `FOR i = 0 to n-1: SET parent[i] = i`,
      variables: { parent: `[${parent.join(', ')}]` },
      activeNodes: Array.from({ length: N }, (_, index) => index),
      phase: 'init'
    });
    addLines(8, 2, 24, 28);

    const findFn = (i: number, isRecursiveCall = false): number => {
      if (!isRecursiveCall) {
        s.push({
          parent: [...parent], rank: [...rank], results: [...results],
          explanation: `find(${i}): starting search for representative.`,
          pseudoStep: `CALL find(i = ${i})`,
          variables: { i, 'parent[i]': parent[i] },
          activeNodes: [i],
          phase: 'find'
        });
        addLines(11, 4, 1, 1);
      }

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Checking if node ${i} is its own parent (root).`,
        pseudoStep: `IF parent[${i}] == ${i}`,
        variables: { i, 'parent[i]': parent[i] },
        activeNodes: [i],
        phase: 'find'
      });
      addLines(12, 5, 2, 2);

      if (parent[i] === i) {
        s.push({
          parent: [...parent], rank: [...rank], results: [...results],
          explanation: `Node ${i} is the root. Returning ${i}.`,
          pseudoStep: `RETURN ${i}`,
          variables: { i, root: i },
          activeNodes: [i],
          phase: 'find'
        });
        addLines(13, 5, 3, 3);
        return i;
      }

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Node ${i} is not root. Recursively find root of parent ${parent[i]} and apply path compression.`,
        pseudoStep: `SET parent[${i}] = find(parent[${i}] = ${parent[i]}) (Path Compression)`,
        variables: { i, 'parent[i]': parent[i] },
        activeNodes: [i, parent[i]],
        phase: 'find'
      });
      addLines(15, 6, 5, 3);

      const root = findFn(parent[i], true);
      parent[i] = root;

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Path compression: set parent of ${i} to ${root}. Returning ${root}.`,
        pseudoStep: `RETURN parent[${i}] = ${root}`,
        variables: { i, 'parent[i]': parent[i], root },
        activeNodes: [i, root],
        phase: 'find'
      });
      addLines(16, 7, 5, 5);

      return root;
    };

    const unionFn = (x: number, y: number): void => {
      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `union(${x}, ${y}): merging sets containing ${x} and ${y}.`,
        pseudoStep: `CALL union(x = ${x}, y = ${y})`,
        variables: { x, y },
        activeNodes: [x, y],
        phase: 'union'
      });
      addLines(18, 8, 7, 7);

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Finding root of x (${x}).`,
        pseudoStep: `SET rootX = find(${x})`,
        variables: { x, y },
        activeNodes: [x],
        phase: 'union'
      });
      addLines(19, 9, 8, 8);
      const rootX = findFn(x);

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Finding root of y (${y}).`,
        pseudoStep: `SET rootY = find(${y})`,
        variables: { x, y, rootX },
        activeNodes: [y],
        phase: 'union'
      });
      addLines(20, 10, 9, 9);
      const rootY = findFn(y);

      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Checking if roots are different: rootX=${rootX}, rootY=${rootY}.`,
        pseudoStep: `IF rootX (${rootX}) != rootY (${rootY})  →  ${rootX !== rootY ? 'YES ✓' : 'NO ✗'}`,
        variables: { x, y, rootX, rootY },
        activeNodes: [rootX, rootY],
        phase: 'union'
      });
      addLines(21, 11, 10, 10);

      if (rootX !== rootY) {
        s.push({
          parent: [...parent], rank: [...rank], results: [...results],
          explanation: `Comparing ranks: rank[${rootX}]=${rank[rootX]}, rank[${rootY}]=${rank[rootY]}.`,
          pseudoStep: `IF rank[rootX] (${rank[rootX]}) < rank[rootY] (${rank[rootY]})`,
          variables: { rootX, rootY, 'rank[rootX]': rank[rootX], 'rank[rootY]': rank[rootY] },
          activeNodes: [rootX, rootY],
          phase: 'union'
        });
        addLines(22, 12, 11, 11);

        if (rank[rootX] < rank[rootY]) {
          parent[rootX] = rootY;
          s.push({
            parent: [...parent], rank: [...rank], results: [...results],
            explanation: `rank[${rootX}] < rank[${rootY}]. Attach tree ${rootX} to ${rootY}.`,
            pseudoStep: `SET parent[rootX] = rootY  →  parent[${rootX}] = ${rootY}`,
            variables: { rootX, rootY, [`parent[${rootX}]`]: rootY },
            activeNodes: [rootX, rootY],
            phase: 'union'
          });
          addLines(23, 13, 12, 12);
        } else if (rank[rootX] > rank[rootY]) {
          parent[rootY] = rootX;
          s.push({
            parent: [...parent], rank: [...rank], results: [...results],
            explanation: `rank[${rootX}] > rank[${rootY}]. Attach tree ${rootY} to ${rootX}.`,
            pseudoStep: `SET parent[rootY] = rootX  →  parent[${rootY}] = ${rootX}`,
            variables: { rootX, rootY, [`parent[${rootY}]`]: rootX },
            activeNodes: [rootX, rootY],
            phase: 'union'
          });
          addLines(25, 15, 14, 15);
        } else {
          parent[rootY] = rootX;
          rank[rootX]++;
          s.push({
            parent: [...parent], rank: [...rank], results: [...results],
            explanation: `Ranks equal. Attach tree ${rootY} to ${rootX} and increment rank of ${rootX} to ${rank[rootX]}.`,
            pseudoStep: `SET parent[rootY] = rootX, rank[rootX]++  →  rank[${rootX}] = ${rank[rootX]}`,
            variables: { rootX, rootY, [`parent[${rootY}]`]: rootX, [`rank[${rootX}]`]: rank[rootX] },
            activeNodes: [rootX, rootY],
            phase: 'union'
          });
          addLines(27, 17, 16, 18);
        }
      } else {
        s.push({
          parent: [...parent], rank: [...rank], results: [...results],
          explanation: `Roots are the same (${rootX}). Already in the same set.`,
          pseudoStep: `ELSE: roots match, do nothing`,
          variables: { rootX, rootY },
          activeNodes: [rootX],
          phase: 'union'
        });
        addLines(21, 11, 10, 10);
      }
    };

    for (const op of UNION_OPS) {
      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Processing union operation [${op[0]}, ${op[1]}].`,
        pseudoStep: `FOR operation in union_operations: union(${op[0]}, ${op[1]})`,
        variables: { op: JSON.stringify(op) },
        activeNodes: [op[0], op[1]],
        phase: 'union'
      });
      addLines(32, 19, 28, 31);
      unionFn(op[0], op[1]);
    }

    s.push({
      parent: [...parent], rank: [...rank], results: [...results],
      explanation: `All union operations completed. Initializing results array.`,
      pseudoStep: `SET results = []`,
      variables: { results: '[]' },
      activeNodes: [],
      phase: 'results'
    });
    addLines(35, 21, 31, 34);

    for (const node of FIND_OPS) {
      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `Performing find operation for node ${node}.`,
        pseudoStep: `FOR node = ${node} in find_operations`,
        variables: { node, results: JSON.stringify(results) },
        activeNodes: [node],
        phase: 'results'
      });
      addLines(36, 22, 32, 35);
      const root = findFn(node);
      results.push(root);
      s.push({
        parent: [...parent], rank: [...rank], results: [...results],
        explanation: `find(${node}) returned root ${root}. Adding to results.`,
        pseudoStep: `ADD find(${node}) = ${root} TO results`,
        variables: { results: JSON.stringify(results) },
        activeNodes: [node, root],
        phase: 'results'
      });
      addLines(37, 23, 33, 36);
    }

    s.push({
      parent: [...parent], rank: [...rank], results: [...results],
      explanation: `Algorithm finished. Final results: [${results.join(', ')}].`,
      pseudoStep: `RETURN results`,
      variables: { results: JSON.stringify(results) },
      activeNodes: [],
      phase: 'done'
    });
    addLines(39, 24, 35, 38);

    return { steps: s, stepLineNumbers };
  }, []);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const computePositions = useMemo<{ x: number; y: number }[]>(() => {
    const children: Record<number, number[]> = {};
    for (let i = 0; i < N; i++) {
      if (currentStep.parent[i] !== i && currentStep.parent[i] !== undefined) {
        const p = currentStep.parent[i];
        if (!children[p]) children[p] = [];
        children[p].push(i);
      }
    }

    const rootNodes = Array.from({ length: N }, (_, i) => i).filter(i => currentStep.parent[i] === i || currentStep.parent[i] === undefined);
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
  }, [currentStep.parent]);

  const treeEdges = useMemo(() => {
    const edges: { from: number; to: number }[] = [];
    for (let i = 0; i < N; i++) {
      if (currentStep.parent[i] !== i && currentStep.parent[i] !== undefined) edges.push({ from: i, to: currentStep.parent[i] });
    }
    return edges;
  }, [currentStep.parent]);

  const getNodeStyle = (i: number) => {
    if (currentStep.activeNodes.includes(i)) return { isDefault: false, fill: '#84cc1622', stroke: '#84cc16', text: '#84cc16' };
    if (currentStep.parent[i] === i) return { isDefault: false, fill: '#34d39922', stroke: '#34d399', text: '#34d399' };
    return { isDefault: true, fill: '', stroke: '', text: '' };
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-5 flex flex-col h-full">
          <div>
            <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest">
                Union-Find Forest (Rank + Path Compression)
              </h3>

              <svg viewBox="0 0 520 260" className="w-full h-auto" style={{ minHeight: 200 }}>
                {treeEdges.map(({ from, to }, idx) => {
                  const fpos = computePositions[from];
                  const tpos = computePositions[to];
                  const active = currentStep.activeNodes.includes(from) || currentStep.activeNodes.includes(to);
                  return (
                    <line
                      key={idx}
                      x1={fpos.x} y1={fpos.y}
                      x2={tpos.x} y2={tpos.y}
                      stroke={active ? '#84cc16' : undefined}
                      className={active ? "" : "stroke-border"}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                  );
                })}

                {Array.from({ length: N }, (_, i) => i).map((i) => {
                  const pos = computePositions[i];
                  const { isDefault, fill, stroke, text } = getNodeStyle(i);
                  const isActive = currentStep.activeNodes.includes(i);
                  const isRoot = currentStep.parent[i] === i;
                  const r = isActive ? 22 : 18;
                  return (
                    <g key={i}>
                      {isRoot && (
                        <text x={pos.x} y={pos.y - r - 6} textAnchor="middle" fill="#34d399" fontSize={8} fontWeight="bold">
                          Root
                        </text>
                      )}
                      <circle cx={pos.x} cy={pos.y} r={r} fill={isDefault ? undefined : fill} stroke={isDefault ? undefined : stroke} strokeWidth={isActive ? 3 : 2} className={isDefault ? "fill-muted stroke-border" : ""} />
                      <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill={isDefault ? undefined : text} fontSize={isActive ? 14 : 13} fontWeight="bold" className={isDefault ? "fill-muted-foreground" : ""}>
                        {i}
                      </text>
                      <text x={pos.x} y={pos.y + r + 12} textAnchor="middle" fill="#64748b" fontSize={9} className="opacity-70">
                        rank:{currentStep.rank[i]}
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
                  <span className="w-2.5 h-2.5 rounded-full inline-block bg-muted border border-border" />
                  Node
                </span>
              </div>
            </Card>

            <Card className="p-4 bg-card/50 border-primary/20 mt-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">parent[ ] &amp; rank[ ]</h4>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: N }, (_, i) => i).map((i) => {
                  const isActive = currentStep.activeNodes.includes(i);
                  const isRoot = currentStep.parent[i] === i;
                  return (
                    <motion.div
                      key={i}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border-2 text-xs font-mono transition-all ${!isActive && !isRoot ? 'bg-muted border-border text-muted-foreground' : ''}`}
                      style={isActive || isRoot ? {
                        background: isActive ? 'rgba(132,204,22,0.12)' : 'rgba(52,211,153,0.12)',
                        borderColor: isActive ? '#84cc16' : '#34d399',
                        color: isActive ? '#84cc16' : '#34d399'
                      } : {}}
                    >
                      <span style={{ fontSize: '9px', opacity: 0.6 }}>node {i}</span>
                      <span className="font-bold">p:{currentStep.parent[i] !== undefined ? currentStep.parent[i] : '?'}</span>
                      <span style={{ fontSize: '9px' }}>r:{currentStep.rank[i]}</span>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step</h4>
                <p className="text-sm font-medium leading-relaxed min-h-[40px]">{currentStep.explanation}</p>
              </Card>

              <Card className="p-4 bg-secondary/10 border-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Results</h4>
                <div className="flex gap-2 flex-wrap min-h-[40px] items-center">
                  {currentStep.results.length === 0 ? <span className="text-xs text-muted-foreground italic">No results yet</span> :
                    currentStep.results.map((res, idx) => (
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
  );
};
