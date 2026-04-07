import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';

interface Step {
  parent: number[];
  rank: number[];
  result: number;
  highlightedLines: number[];
  explanation: string;
  variables: Record<string, any>;
  activeNodes: number[];
}

const N = 5;
const EDGES: number[][] = [[0, 1], [1, 2], [3, 4]];

export const NumberOfConnectedComponentsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const code = `function countComponents(n: number, edges: number[][]): number {
  const par: number[] = Array.from({ length: n }, (_, i) => i);
  const rank: number[] = new Array(n).fill(1);

  const find = (n1: number): number => {
    let res = n1;
    while (res !== par[res]) {
      par[res] = par[par[res]];
      res = par[res];
    }
    return res;
  };

  const union = (n1: number, n2: number): number => {
    const p1 = find(n1);
    const p2 = find(n2);

    if (p1 === p2) return 0;

    if (rank[p2] > rank[p1]) {
      par[p1] = p2;
      rank[p2] += rank[p1];
    } else {
      par[p2] = p1;
      rank[p1] += rank[p2];
    }

    return 1;
  };

  let res = n;
  for (const [n1, n2] of edges) {
    res -= union(n1, n2);
  }
  return res;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const par = Array.from({ length: N }, (_, i) => i);
    const rank = new Array(N).fill(1);
    let res = N;

    s.push({
      parent: [...par],
      rank: [...rank],
      result: res,
      highlightedLines: [1],
      explanation: "Initialize countComponents with a graph of n nodes.",
      variables: { n: N, res },
      activeNodes: []
    });

    s.push({
      parent: [...par],
      rank: [...rank],
      result: res,
      highlightedLines: [2],
      explanation: "Initialize parent array: each node is its own parent initially.",
      variables: { par: `[${par.join(',')}]` },
      activeNodes: []
    });

    s.push({
      parent: [...par],
      rank: [...rank],
      result: res,
      highlightedLines: [3],
      explanation: "Initialize rank array to keep track of component sizes.",
      variables: { rank: `[${rank.join(',')}]` },
      activeNodes: []
    });

    s.push({
      parent: [...par],
      rank: [...rank],
      result: res,
      highlightedLines: [28],
      explanation: "Initially, the number of components equals the number of nodes.",
      variables: { res },
      activeNodes: []
    });

    const findFn = (n1: number): number => {
      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        highlightedLines: [5, 6],
        explanation: `Find root of node ${n1}.`,
        variables: { n1, traversal: n1 },
        activeNodes: [n1]
      });

      let curr = n1;
      while (curr !== par[curr]) {
        const oldPar = par[curr];
        const gPar = par[oldPar];
        s.push({
          parent: [...par],
          rank: [...rank],
          result: res,
          highlightedLines: [8, 9],
          explanation: `Path compression: make ${curr} point to its grandparent ${gPar}.`,
          variables: { curr, parent: oldPar, grandparent: gPar },
          activeNodes: [curr, oldPar, gPar]
        });
        par[curr] = gPar;
        curr = par[curr];
      }

      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        highlightedLines: [12],
        explanation: `Root found: ${curr}.`,
        variables: { root: curr },
        activeNodes: [curr]
      });
      return curr;
    };

    const unionFn = (n1: number, n2: number): number => {
      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        highlightedLines: [15, 16, 17],
        explanation: `Union operation for nodes ${n1} and ${n2}. First, find their roots.`,
        variables: { n1, n2 },
        activeNodes: [n1, n2]
      });

      const p1 = findFn(n1);
      const p2 = findFn(n2);

      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        highlightedLines: [19],
        explanation: `Roots are p1=${p1}, p2=${p2}. ${p1 === p2 ? 'Already connected.' : 'Merging components.'}`,
        variables: { p1, p2 },
        activeNodes: [p1, p2]
      });

      if (p1 === p2) return 0;

      if (rank[p2] > rank[p1]) {
        par[p1] = p2;
        rank[p2] += rank[p1];
        s.push({
          parent: [...par],
          rank: [...rank],
          result: res,
          highlightedLines: [21, 22, 23],
          explanation: `Attach smaller rank tree (${p1}) under larger rank tree (${p2}).`,
          variables: { [`par[${p1}]`]: p2, [`rank[${p2}]`]: rank[p2] },
          activeNodes: [p1, p2]
        });
      } else {
        par[p2] = p1;
        rank[p1] += rank[p2];
        s.push({
          parent: [...par],
          rank: [...rank],
          result: res,
          highlightedLines: [24, 25, 26],
          explanation: `Attach tree under root ${p1}. Update rank[${p1}] to ${rank[p1]}.`,
          variables: { [`par[${p2}]`]: p1, [`rank[${p1}]`]: rank[p1] },
          activeNodes: [p1, p2]
        });
      }
      return 1;
    };

    for (const [n1, n2] of EDGES) {
      s.push({
        parent: [...par],
        rank: [...rank],
        result: res,
        highlightedLines: [29, 30],
        explanation: `Process edge: [${n1}, ${n2}].`,
        variables: { n1, n2, res },
        activeNodes: [n1, n2]
      });

      const merged = unionFn(n1, n2);
      if (merged) {
        res -= 1;
        s.push({
          parent: [...par],
          rank: [...rank],
          result: res,
          highlightedLines: [31],
          explanation: `Merging successful. Decrement component count to ${res}.`,
          variables: { res },
          activeNodes: []
        });
      }
    }

    s.push({
      parent: [...par],
      rank: [...rank],
      result: res,
      highlightedLines: [34],
      explanation: `Algorithm finished. Total connected components: ${res}.`,
      variables: { res },
      activeNodes: []
    });

    return s;
  }, []);

  const step = steps[currentStep] || steps[0];

  const computePositions = useMemo(() => {
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
    if (step.activeNodes.includes(i)) return { fill: '#3b82f622', stroke: '#3b82f6', text: '#3b82f6' };
    if (step.parent[i] === i) return { fill: '#10b98111', stroke: '#10b981', text: '#10b981' };
    return { fill: '#1e1e1e', stroke: '#444444', text: '#eeeeee' };
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div key={`forest-${currentStep}`}>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative">
              <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest text-center">Connected Components Forest</h3>

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
                      stroke={active ? '#3b82f6' : '#333'}
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
                      {isRoot && <text x={x} y={y - r - 5} textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">ROOT</text>}
                      <circle
                        cx={x} cy={y} r={r}
                        fill={s.fill}
                        stroke={s.stroke}
                        strokeWidth="2"
                      />
                      <text x={x} y={y} dy=".3em" textAnchor="middle" fill={s.text} fontSize="11" fontWeight="black">{i}</text>
                    </g>
                  );
                })}
              </svg>

              <div className="flex justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#10b981] bg-[#10b98111]" /> Root</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#3b82f6] bg-[#3b82f622]" /> Active</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#444] bg-[#1e1e1e]" /> Node</span>
              </div>
            </Card>
          </div>

          <div key={`explanation-${currentStep}`}>
            <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Logic</h4>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'black' }}>{step.explanation}</p>
            </Card>
          </div>

          <div key={`variables-${currentStep}`}>
            <VariablePanel variables={{ ...step.variables, 'Components Found': step.result }} />
          </div>
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
