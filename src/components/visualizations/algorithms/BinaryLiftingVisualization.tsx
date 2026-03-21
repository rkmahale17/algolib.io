import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
  up: number[][];
  depth: number[];
  highlightedLines: number[];
  explanation: string;
  variables: Record<string, any>;
  activeNodes: number[];
  phase: 'precompute' | 'kthAncestor' | 'lca' | 'done';
}

const LOG = 4;
const TREE: number[][] = [
  [1, 2],       // 0
  [0, 3, 4],    // 1
  [0, 5],       // 2
  [1],          // 3
  [1],          // 4
  [2, 6, 7],    // 5
  [5],          // 6
  [5]           // 7
];
const ROOT = 0;

export const BinaryLiftingVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `const LOG = 4;

function binaryLifting(graph: number[][], root: number) {
  const n = graph.length;
  const up: number[][] = Array(n).fill(null).map(() => Array(LOG).fill(-1));
  const depth: number[] = Array(n).fill(0);

  function dfs(node: number, parent: number) {
    up[node][0] = parent;
    for (let j = 1; j < LOG; j++) {
      if (up[node][j - 1] !== -1) {
        up[node][j] = up[up[node][j - 1]][j - 1];
      }
    }
    for (const child of graph[node]) {
      if (child !== parent) {
        depth[child] = depth[node] + 1;
        dfs(child, node);
      }
    }
  }

  dfs(root, -1);

  function kthAncestor(node: number, k: number): number {
    for (let j = 0; j < LOG; j++) {
      if ((k & (1 << j)) !== 0) {
        node = up[node][j];
        if (node === -1) break;
      }
    }
    return node;
  }

  function lca(u: number, v: number): number {
    if (depth[u] < depth[v]) [u, v] = [v, u];
    let diff = depth[u] - depth[v];
    u = kthAncestor(u, diff);
    if (u === v) return u;
    for (let j = LOG - 1; j >= 0; j--) {
      if (up[u][j] !== up[v][j]) {
        u = up[u][j];
        v = up[v][j];
      }
    }
    return up[u][0];
  }

  return { up, depth, kthAncestor, lca };
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const n = TREE.length;
    const up: number[][] = Array(n).fill(null).map(() => Array(LOG).fill(-1));
    const depth: number[] = Array(n).fill(0);

    s.push({
      up: up.map(row => [...row]), depth: [...depth],
      highlightedLines: [3, 4, 5, 6],
      explanation: "Initialize binary lifting table 'up' and 'depth' array.",
      variables: { n, LOG, root: ROOT },
      activeNodes: [],
      phase: 'precompute'
    });

    const dfs = (node: number, parent: number) => {
      s.push({
        up: up.map(row => [...row]), depth: [...depth],
        highlightedLines: [8, 9],
        explanation: `DFS visiting node ${node}. Set its immediate parent up[${node}][0] = ${parent}.`,
        variables: { node, parent, depth: depth[node] },
        activeNodes: [node],
        phase: 'precompute'
      });

      up[node][0] = parent;

      for (let j = 1; j < LOG; j++) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [10, 11],
          explanation: `Compute 2^${j}-th ancestor for node ${node}.`,
          variables: { node, j, '2^j': 1 << j, 'up[node][j-1]': up[node][j - 1] },
          activeNodes: [node],
          phase: 'precompute'
        });

        if (up[node][j - 1] !== -1) {
          const midway = up[node][j - 1];
          const ancestor = up[midway][j - 1];
          up[node][j] = ancestor;
          s.push({
            up: up.map(row => [...row]), depth: [...depth],
            highlightedLines: [12],
            explanation: `up[${node}][${j}] = up[up[${node}][${j - 1}]][${j - 1}] = up[${midway}][${j - 1}] = ${ancestor}.`,
            variables: { node, j, midway, ancestor },
            activeNodes: [node, midway, ancestor].filter(id => id !== -1),
            phase: 'precompute'
          });
        }
      }

      for (const child of TREE[node]) {
        if (child !== parent) {
          depth[child] = depth[node] + 1;
          s.push({
            up: up.map(row => [...row]), depth: [...depth],
            highlightedLines: [15, 16, 17],
            explanation: `Recurse to child ${child}. Set depth[${child}] = ${depth[child]}.`,
            variables: { node, child, 'depth[child]': depth[child] },
            activeNodes: [node, child],
            phase: 'precompute'
          });
          dfs(child, node);
        }
      }
    };

    dfs(ROOT, -1);

    const kthAncestor = (node: number, k: number, isLcaCall = false): number => {
      let curr = node;
      const startNode = node;

      if (!isLcaCall) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [25],
          explanation: `kthAncestor(node=${node}, k=${k}): Start finding the ${k}-th ancestor.`,
          variables: { node, k },
          activeNodes: [node],
          phase: 'kthAncestor'
        });
      }

      for (let j = 0; j < LOG; j++) {
        const bitSet = (k & (1 << j)) !== 0;
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [26, 27],
          explanation: `Checking bit ${j} (2^${j} = ${1 << j}) of k=${k}. It is ${bitSet ? 'set' : 'not set'}.`,
          variables: { curr, k, j, '2^j': 1 << j, bitSet },
          activeNodes: [curr],
          phase: isLcaCall ? 'lca' : 'kthAncestor'
        });

        if (bitSet) {
          const prev = curr;
          curr = up[curr][j];
          s.push({
            up: up.map(row => [...row]), depth: [...depth],
            highlightedLines: [28],
            explanation: `Bit ${j} is set. Jump 2^${j} steps from ${prev} to ${curr}.`,
            variables: { curr, k, j, prev },
            activeNodes: [curr !== -1 ? curr : prev],
            phase: isLcaCall ? 'lca' : 'kthAncestor'
          });

          if (curr === -1) {
            s.push({
              up: up.map(row => [...row]), depth: [...depth],
              highlightedLines: [29],
              explanation: `Reached beyond root. break.`,
              variables: { curr, k },
              activeNodes: [],
              phase: isLcaCall ? 'lca' : 'kthAncestor'
            });
            break;
          }
        }
      }

      if (!isLcaCall) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [32],
          explanation: `Finished kthAncestor. The ${k}-th ancestor of ${startNode} is ${curr}.`,
          variables: { startNode, k, result: curr },
          activeNodes: [curr].filter(id => id !== -1),
          phase: 'kthAncestor'
        });
      }
      return curr;
    };

    const lca = (u: number, v: number): number => {
      let currU = u;
      let currV = v;

      s.push({
        up: up.map(row => [...row]), depth: [...depth],
        highlightedLines: [35],
        explanation: `lca(u=${u}, v=${v}): Find the lowest common ancestor.`,
        variables: { u, v, 'depth[u]': depth[u], 'depth[v]': depth[v] },
        activeNodes: [u, v],
        phase: 'lca'
      });

      if (depth[currU] < depth[currV]) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [36],
          explanation: `depth[u] < depth[v]. Swapping u and v.`,
          variables: { u: currV, v: currU },
          activeNodes: [currU, currV],
          phase: 'lca'
        });
        [currU, currV] = [currV, currU];
      }

      const diff = depth[currU] - depth[currV];
      if (diff > 0) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [37, 38],
          explanation: `Depths are different (diff=${diff}). Moving u up to the same depth as v.`,
          variables: { u: currU, v: currV, diff },
          activeNodes: [currU, currV],
          phase: 'lca'
        });
        currU = kthAncestor(currU, diff, true);
      }

      if (currU === currV) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [39],
          explanation: `u and v are now the same node (${currU}). This is the LCA.`,
          variables: { lca: currU },
          activeNodes: [currU],
          phase: 'lca'
        });
        return currU;
      }

      for (let j = LOG - 1; j >= 0; j--) {
        s.push({
          up: up.map(row => [...row]), depth: [...depth],
          highlightedLines: [40, 41],
          explanation: `Checking 2^${j}-th ancestors. up[u][${j}]=${up[currU][j]}, up[v][${j}]=${up[currV][j]}.`,
          variables: { u: currU, v: currV, j, 'up[u][j]': up[currU][j], 'up[v][j]': up[currV][j] },
          activeNodes: [currU, currV],
          phase: 'lca'
        });

        if (up[currU][j] !== up[currV][j]) {
          const prevU = currU;
          const prevV = currV;
          currU = up[currU][j];
          currV = up[currV][j];
          s.push({
            up: up.map(row => [...row]), depth: [...depth],
            highlightedLines: [42, 43],
            explanation: `Ancestors are different. Jump both nodes up by 2^${j} to ${currU} and ${currV}.`,
            variables: { u: currU, v: currV, j, prevU, prevV },
            activeNodes: [currU, currV],
            phase: 'lca'
          });
        }
      }

      const result = up[currU][0];
      s.push({
        up: up.map(row => [...row]), depth: [...depth],
        highlightedLines: [46],
        explanation: `LCA is the immediate parent of the current nodes: up[${currU}][0] = ${result}.`,
        variables: { u: currU, v: currV, result },
        activeNodes: [result],
        phase: 'lca'
      });
      return result;
    };

    // Run some examples for the visualization
    kthAncestor(7, 3);
    lca(6, 4);

    s.push({
      up: up.map(row => [...row]), depth: [...depth],
      highlightedLines: [49],
      explanation: `Binary Lifting visualization finished.`,
      variables: {},
      activeNodes: [],
      phase: 'done'
    });

    return s;
  }, []);

  const step = steps[currentStep] || steps[0];

  // Tree layout calculation
  const treePositions = useMemo(() => {
    const positions: { x: number, y: number }[] = new Array(TREE.length);
    const calculatePos = (node: number, parent: number, x: number, y: number, width: number) => {
      positions[node] = { x, y };
      const children = TREE[node].filter(n => n !== parent);
      if (children.length === 0) return;
      const stepX = width / children.length;
      let startX = x - width / 2 + stepX / 2;
      children.forEach(child => {
        calculatePos(child, node, startX, y + 60, stepX);
        startX += stepX;
      });
    };
    calculatePos(ROOT, -1, 260, 40, 400);
    return positions;
  }, []);

  const treeEdges = useMemo(() => {
    const edges: { from: number, to: number }[] = [];
    const findEdges = (node: number, parent: number) => {
      TREE[node].forEach(child => {
        if (child !== parent) {
          edges.push({ from: node, to: child });
          findEdges(child, node);
        }
      });
    };
    findEdges(ROOT, -1);
    return edges;
  }, []);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
              Tree Structure &amp; Depths
            </h3>
            <svg viewBox="0 0 520 280" className="w-full h-auto">
              {treeEdges.map((edge, i) => (
                <line
                  key={i}
                  x1={treePositions[edge.from].x}
                  y1={treePositions[edge.from].y}
                  x2={treePositions[edge.to].x}
                  y2={treePositions[edge.to].y}
                  stroke="#334155"
                  strokeWidth="1.5"
                />
              ))}
              {treePositions.map((pos, i) => {
                const isActive = step.activeNodes.includes(i);
                return (
                  <g key={i}>
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 22 : 18}
                      fill={isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.8)'}
                      stroke={isActive ? '#3b82f6' : '#475569'}
                      strokeWidth={isActive ? 3 : 2}
                      animate={{ r: isActive ? 22 : 18 }}
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isActive ? '#3b82f6' : '#94a3b8'}
                      className="text-xs font-bold"
                    >
                      {i}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 25}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[10px]"
                    >
                      d:{step.depth[i]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Card>

          <Card className="p-4 bg-card/50 border-primary/20 overflow-hidden">
            <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest">
              Binary Lifting Table (up[node][j])
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-border text-left">node \ j</th>
                    {Array.from({ length: LOG }).map((_, j) => (
                      <th key={j} className="p-2 border border-border text-center">2^{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {step.up.map((row, i) => (
                    <tr key={i} className={step.activeNodes.includes(i) ? 'bg-primary/10' : ''}>
                      <td className="p-2 border border-border font-bold">{i}</td>
                      {row.map((val, j) => (
                        <td key={j} className="p-2 border border-border text-center">
                          {val === -1 ? '-' : val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium leading-relaxed min-h-[40px]">{step.explanation}</p>
          </Card>
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
