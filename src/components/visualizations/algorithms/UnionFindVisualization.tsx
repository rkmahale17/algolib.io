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
  result: number;
  highlightedLines: number[];
  explanation: string;
  variables: Record<string, any>;
  activeNodes: number[];
  phase: 'init' | 'find' | 'union' | 'done';
}

const N = 6;
const EDGES: number[][] = [[0, 1], [0, 2], [3, 4], [3, 5]];

export const UnionFindVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function countComponents(n: number, edges: number[][]): number {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(1);

  function find(node: number): number {
    let res = node;
    while (res !== parent[res]) {
      parent[res] = parent[parent[res]];
      res = parent[res];
    }
    return res;
  }

  function union(n1: number, n2: number): number {
    const p1 = find(n1);
    const p2 = find(n2);

    if (p1 === p2) {
      return 0;
    }

    if (rank[p2] > rank[p1]) {
      parent[p1] = p2;
      rank[p2] += rank[p1];
    } else {
      parent[p2] = p1;
      rank[p1] += rank[p2];
    }

    return 1;
  }

  let result = n;

  for (const [n1, n2] of edges) {
    result -= union(n1, n2);
  }

  return result;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const parent = Array.from({ length: N }, (_, i) => i);
    const rank = new Array(N).fill(1);
    let result = N;

    s.push({
      parent: [...parent], rank: [...rank], result,
      highlightedLines: [1],
      explanation: `Start countComponents: n=${N}, result=${result}.`,
      variables: { n: N, result },
      activeNodes: [],
      phase: 'init'
    });

    s.push({
      parent: [...parent], rank: [...rank], result,
      highlightedLines: [2],
      explanation: `Initialize parent: each node is its own representative.`,
      variables: { parent: `[${parent.join(',')}]` },
      activeNodes: parent,
      phase: 'init'
    });

    s.push({
      parent: [...parent], rank: [...rank], result,
      highlightedLines: [3],
      explanation: `Initialize rank: each set starts with size 1.`,
      variables: { rank: `[${rank.join(',')}]` },
      activeNodes: [],
      phase: 'init'
    });

    const findFn = (node: number): number => {
      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [5, 6],
        explanation: `find(${node}): starting traversal at res=${node}.`,
        variables: { node, res: node },
        activeNodes: [node],
        phase: 'find'
      });

      let res = node;
      while (res !== parent[res]) {
        const oldParent = parent[res];
        const gParent = parent[oldParent];
        s.push({
          parent: [...parent], rank: [...rank], result,
          highlightedLines: [7, 8],
          explanation: `res=${res} not root. parent[${res}] = grandparent ${gParent}.`,
          variables: { res, 'parent[res]': oldParent, 'grandparent': gParent },
          activeNodes: [res, oldParent, gParent],
          phase: 'find'
        });
        parent[res] = gParent;
        res = parent[res];
      }

      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [11],
        explanation: `Root found = ${res}.`,
        variables: { root: res },
        activeNodes: [res],
        phase: 'find'
      });
      return res;
    };

    const unionFn = (n1: number, n2: number): number => {
      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [14, 15],
        explanation: `union(${n1}, ${n2}): finding roots...`,
        variables: { n1, n2 },
        activeNodes: [n1, n2],
        phase: 'union'
      });

      const p1 = findFn(n1);
      const p2 = findFn(n2);

      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [16, 18],
        explanation: `p1=${p1}, p2=${p2}. ${p1 === p2 ? 'Already in same component.' : 'Different components — merging.'}`,
        variables: { p1, p2 },
        activeNodes: [p1, p2],
        phase: 'union'
      });

      if (p1 === p2) return 0;

      if (rank[p2] > rank[p1]) {
        parent[p1] = p2;
        rank[p2] += rank[p1];
        s.push({
          parent: [...parent], rank: [...rank], result,
          highlightedLines: [22, 23, 24],
          explanation: `rank[${p2}] > rank[${p1}]. Attach ${p1} to ${p2}. rank[${p2}] updated to ${rank[p2]}.`,
          variables: { [`parent[${p1}]`]: p2, [`rank[${p2}]`]: rank[p2] },
          activeNodes: [p1, p2],
          phase: 'union'
        });
      } else {
        parent[p2] = p1;
        rank[p1] += rank[p2];
        s.push({
          parent: [...parent], rank: [...rank], result,
          highlightedLines: [25, 26, 27],
          explanation: `rank[${p1}] >= rank[${p2}]. Attach ${p2} to ${p1}. rank[${p1}] updated to ${rank[p1]}.`,
          variables: { [`parent[${p2}]`]: p1, [`rank[${p1}]`]: rank[p1] },
          activeNodes: [p1, p2],
          phase: 'union'
        });
      }
      return 1;
    };

    s.push({
      parent: [...parent], rank: [...rank], result,
      highlightedLines: [33],
      explanation: `Set result = n = ${N}.`,
      variables: { result },
      activeNodes: [],
      phase: 'init'
    });

    for (const [n1, n2] of EDGES) {
      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [35],
        explanation: `Processing edge [${n1}, ${n2}].`,
        variables: { edge: `[${n1},${n2}]`, result },
        activeNodes: [n1, n2],
        phase: 'union'
      });
      const decrement = unionFn(n1, n2);
      result -= decrement;
      s.push({
        parent: [...parent], rank: [...rank], result,
        highlightedLines: [36],
        explanation: `Decrementing components by ${decrement}. result = ${result}.`,
        variables: { decrement, result },
        activeNodes: [],
        phase: 'union'
      });
    }

    s.push({
      parent: [...parent], rank: [...rank], result,
      highlightedLines: [39],
      explanation: `Done! Total components found: ${result}.`,
      variables: { result },
      activeNodes: [],
      phase: 'done'
    });

    return s;
  }, []);

  const step = steps[currentStep] || steps[0];

  const computePositions = useMemo<{ x: number, y: number }[]>(() => {
    const children: Record<number, number[]> = {};
    for (let i = 0; i < N; i++) {
      if (step.parent[i] !== i) {
        if (!children[step.parent[i]]) children[step.parent[i]] = [];
        children[step.parent[i]].push(i);
      }
    }

    const rootNodes = Array.from({ length: N }, (_, i) => i).filter(i => step.parent[i] === i);
    const pos: { x: number, y: number }[] = new Array(N).fill(null).map(() => ({ x: 0, y: 0 }));

    const svgW = 500;
    const colW = svgW / (rootNodes.length + 1);

    rootNodes.forEach((root, idx) => {
      const rx = colW * (idx + 1);
      pos[root] = { x: rx, y: 50 };

      const kids = children[root] || [];
      const spread = Math.min(colW * 0.8, 80);
      const startX = kids.length > 1 ? rx - spread / 2 : rx;
      const stepX = kids.length > 1 ? spread / (kids.length - 1) : 0;

      kids.forEach((k, ki) => {
        const kx = startX + stepX * ki;
        pos[k] = { x: kx, y: 140 };

        const grandkids = children[k] || [];
        const gSpread = 50;
        const gStartX = grandkids.length > 1 ? kx - gSpread / 2 : kx;
        const gStepX = grandkids.length > 1 ? gSpread / (grandkids.length - 1) : 0;
        grandkids.forEach((gk, gi) => {
          pos[gk] = { x: gStartX + gStepX * gi, y: 210 };
        });
      });
    });

    return pos;
  }, [step.parent]);

  const getNodeStyle = (i: number) => {
    if (step.activeNodes.includes(i)) return { fill: '#84cc1622', stroke: '#84cc16', text: '#84cc16' };
    if (step.parent[i] === i) return { fill: '#34d39911', stroke: '#34d399', text: '#34d399' };
    return { fill: '#1e1e1e', stroke: '#444444', text: '#eeeeee' };
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative">
            <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest text-center">Disjoint Set Forest</h3>

            <svg width="100%" height="260" viewBox="0 0 500 260">
              {step.parent.map((p, i) => {
                if (p === i) return null;
                const src = computePositions[i];
                const dst = computePositions[p];
                const active = step.activeNodes.includes(i) || step.activeNodes.includes(p);
                return (
                  <line
                    key={`edge-${i}`}
                    x1={src.x} y1={src.y} x2={dst.x} y2={dst.y}
                    stroke={active ? '#84cc16' : '#333'}
                    strokeWidth={active ? 3 : 1.5}
                    opacity={active ? 1 : 0.6}
                  />
                );
              })}

              {Array.from({ length: N }, (_, i) => i).map(i => {
                const { x, y } = computePositions[i];
                const s = getNodeStyle(i);
                const isActive = step.activeNodes.includes(i);
                const isRoot = step.parent[i] === i;
                const r = isActive ? 21 : 18;

                return (
                  <g key={`node-${i}`}>
                    {isRoot && <text x={x} y={y - r - 5} textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">ROOT</text>}
                    <circle
                      cx={x} cy={y} r={r}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth="2"
                    />
                    <text x={x} y={y} dy=".3em" textAnchor="middle" fill={s.text} fontSize="11" fontWeight="black">{i}</text>
                    <text x={x} y={y + r + 11} textAnchor="middle" fill="#555" fontSize="8">rank:{step.rank[i]}</text>
                  </g>
                );
              })}
            </svg>

            <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#34d399] bg-[#34d39922]" /> Root</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#84cc16] bg-[#84cc1622]" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#444] bg-[#1e1e1e]" /> Node</span>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
          </Card>

          <VariablePanel variables={{ ...step.variables, 'Components': step.result }} />
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
