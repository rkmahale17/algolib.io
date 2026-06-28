import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Edge {
  from: number;
  to: number;
  weight: number;
}

interface Step {
  prices: number[];
  tmpPrices: number[];
  edges: Edge[];
  currentEdge: Edge | null;
  iteration: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    const prices: number[] = new Array(n).fill(Infinity);
    prices[src] = 0;
    for (let i = 0; i <= k; i++) {
        const tmpPrices = [...prices];
        for (const [s, d, p] of flights) {
            if (prices[s] === Infinity) continue;
            if (prices[s] + p < tmpPrices[d]) {
                tmpPrices[d] = prices[s] + p;
            }
        }
        for (let j = 0; j < n; j++) {
            prices[j] = tmpPrices[j];
        }
    }
    return prices[dst] === Infinity ? -1 : prices[dst];
}`,
  python: `def findCheapestPrice(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    prices = [float('inf')] * n
    prices[src] = 0
    for i in range(k + 1):
        tmp_prices = prices[:]
        for s, d, p in flights:
            if prices[s] == float('inf'):
                continue
            if prices[s] + p < tmp_prices[d]:
                tmp_prices[d] = prices[s] + p
        prices = tmp_prices[:]
    return prices[dst] if prices[dst] != float('inf') else -1`,
  java: `public static class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int[] prices = new int[n];
        Arrays.fill(prices, Integer.MAX_VALUE);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {
            int[] tmpPrices = Arrays.copyOf(prices, n);
            for (int[] flight : flights) {
                int s = flight[0];
                int d = flight[1];
                int p = flight[2];
                if (prices[s] == Integer.MAX_VALUE) continue;
                if (prices[s] + p < tmpPrices[d]) {
                    tmpPrices[d] = prices[s] + p;
                }
            }
            prices = Arrays.copyOf(tmpPrices, n);
        }
        return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];
    }
}`,
  cpp: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> prices(n, INT_MAX);
        prices[src] = 0;
        for (int i = 0; i <= k; i++) {
            vector<int> tmpPrices = prices;
            for (auto& flight : flights) {
                int s = flight[0];
                int d = flight[1];
                int p = flight[2];
                if (prices[s] == INT_MAX) continue;
                if (prices[s] + p < tmpPrices[d]) {
                    tmpPrices[d] = prices[s] + p;
                }
            }
            prices = tmpPrices;
        }
        return prices[dst] == INT_MAX ? -1 : prices[dst];
    }
};`,
};

function generateVisualizationData() {
  const n = 4;
  const src = 0;
  const dst = 3;
  const k = 1;
  const edges: Edge[] = [
    { from: 0, to: 1, weight: 100 },
    { from: 1, to: 2, weight: 100 },
    { from: 0, to: 2, weight: 500 },
    { from: 2, to: 3, weight: 100 }
  ];

  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  let prices = Array(n).fill(Infinity);

  steps.push({
    prices: [...prices],
    tmpPrices: [...prices],
    edges,
    currentEdge: null,
    iteration: -1,
    explanation: `Initialize prices array with Infinity for all nodes.`,
    pseudoStep: `SET prices = [Infinity] * ${n}`,
    variables: { iteration: 'Init', prices: '[]', tmpPrices: '[]' }
  });
  addLines(2, 2, 4, 4);

  prices[src] = 0;
  steps.push({
    prices: [...prices],
    tmpPrices: [...prices],
    edges,
    currentEdge: null,
    iteration: -1,
    explanation: `Set the price to reach the source node ${src} to 0.`,
    pseudoStep: `SET prices[src] = 0  →  prices[0] = 0`,
    variables: { iteration: 'Init', prices: `[${prices.map(p => p === Infinity ? '∞' : p).join(', ')}]` }
  });
  addLines(3, 3, 5, 5);

  for (let i = 0; i <= k; i++) {
    let tmpPrices = [...prices];
    steps.push({
      prices: [...prices],
      tmpPrices: [...tmpPrices],
      edges,
      currentEdge: null,
      iteration: i,
      explanation: `Iteration ${i} (up to ${i} stops). Copy prices array to tmpPrices.`,
      pseudoStep: `FOR i = ${i} (stops <= ${k}): SET tmpPrices = [...prices]`,
      variables: { iteration: i, prices: `[${prices.map(p => p === Infinity ? '∞' : p).join(', ')}]`, tmpPrices: `[${tmpPrices.map(p => p === Infinity ? '∞' : p).join(', ')}]` }
    });
    addLines(5, 5, 7, 7);

    for (const edge of edges) {
      steps.push({
        prices: [...prices],
        tmpPrices: [...tmpPrices],
        edges,
        currentEdge: edge,
        iteration: i,
        explanation: `Inspect flight edge (${edge.from} → ${edge.to}) with price ${edge.weight}. Check if source ${edge.from} is reachable.`,
        pseudoStep: `FOR flight IN flights: check if prices[${edge.from}] != Infinity`,
        variables: { iteration: i, s: edge.from, d: edge.to, p: edge.weight, prices: `[${prices.map(p => p === Infinity ? '∞' : p).join(', ')}]`, tmpPrices: `[${tmpPrices.map(p => p === Infinity ? '∞' : p).join(', ')}]` }
      });
      addLines(6, 6, 8, 8);

      if (prices[edge.from] === Infinity) {
        steps.push({
          prices: [...prices],
          tmpPrices: [...tmpPrices],
          edges,
          currentEdge: edge,
          iteration: i,
          explanation: `Source node ${edge.from} is currently unreachable. Skip flight.`,
          pseudoStep: `IF prices[${edge.from}] == Infinity → CONTINUE`,
          variables: { iteration: i, s: edge.from, d: edge.to }
        });
        addLines(7, 8, 12, 12);
        continue;
      }

      const newCost = prices[edge.from] + edge.weight;
      const isCheaper = newCost < tmpPrices[edge.to];

      steps.push({
        prices: [...prices],
        tmpPrices: [...tmpPrices],
        edges,
        currentEdge: edge,
        iteration: i,
        explanation: `Check if price via ${edge.from} (${prices[edge.from]} + ${edge.weight} = ${newCost}) is cheaper than current tmpPrices[${edge.to}] (${tmpPrices[edge.to] === Infinity ? '∞' : tmpPrices[edge.to]}).`,
        pseudoStep: `IF prices[${edge.from}] + ${edge.weight} < tmpPrices[${edge.to}]  →  ${isCheaper ? 'YES ✓' : 'NO ✗'}`,
        variables: { iteration: i, s: edge.from, d: edge.to, newCost, currentDestCost: tmpPrices[edge.to] === Infinity ? '∞' : tmpPrices[edge.to] }
      });
      addLines(8, 9, 13, 13);

      if (isCheaper) {
        tmpPrices[edge.to] = newCost;
        steps.push({
          prices: [...prices],
          tmpPrices: [...tmpPrices],
          edges,
          currentEdge: edge,
          iteration: i,
          explanation: `Cheaper path found! Update tmpPrices[${edge.to}] to ${newCost}.`,
          pseudoStep: `SET tmpPrices[${edge.to}] = ${newCost}`,
          variables: { iteration: i, s: edge.from, d: edge.to, tmpPrices: `[${tmpPrices.map(p => p === Infinity ? '∞' : p).join(', ')}]` }
        });
        addLines(9, 10, 14, 14);
      }
    }

    for (let j = 0; j < n; j++) {
      prices[j] = tmpPrices[j];
    }

    steps.push({
      prices: [...prices],
      tmpPrices: [...tmpPrices],
      edges,
      currentEdge: null,
      iteration: i,
      explanation: `Update prices array with tmpPrices at the end of iteration ${i}.`,
      pseudoStep: `prices = tmpPrices`,
      variables: { iteration: i, prices: `[${prices.map(p => p === Infinity ? '∞' : p).join(', ')}]` }
    });
    addLines(13, 11, 17, 17);
  }

  steps.push({
    prices: [...prices],
    tmpPrices: [...prices],
    edges,
    currentEdge: null,
    iteration: k,
    explanation: `Iterations completed. Check if destination ${dst} is reachable. Price is ${prices[dst] === Infinity ? 'Infinity' : prices[dst]}.`,
    pseudoStep: `RETURN prices[dst] == Infinity ? -1 : prices[dst]  →  ${prices[dst] === Infinity ? -1 : prices[dst]}`,
    variables: { prices: `[${prices.map(p => p === Infinity ? '∞' : p).join(', ')}]`, finalPrice: prices[dst] === Infinity ? -1 : prices[dst] }
  });
  addLines(16, 12, 19, 19);

  return { steps, stepLineNumbers };
}

const nodePositions = [
  { x: 50, y: 110 },
  { x: 175, y: 50 },
  { x: 175, y: 170 },
  { x: 300, y: 110 }
];

export const BellmanFordVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-hidden flex justify-center w-full">
            <svg viewBox="0 0 350 220" className="w-full max-w-[350px] h-auto mx-auto">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="17"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 6 3, 0 6" className="fill-muted-foreground/50" />
                </marker>
              </defs>

              {currentStep.edges.map((edge, idx) => {
                const from = nodePositions[edge.from];
                const to = nodePositions[edge.to];
                const isCurrent = currentStep.currentEdge &&
                  currentStep.currentEdge.from === edge.from &&
                  currentStep.currentEdge.to === edge.to;

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      className={`transition-all duration-200 ${isCurrent ? 'stroke-primary stroke-3' : 'stroke-border stroke-2'}`}
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 8}
                      className="fill-foreground font-semibold text-[10px]"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}

              {nodePositions.map((pos, idx) => {
                const isReached = currentStep.prices[idx] !== Infinity;
                return (
                  <g key={idx}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      className={`transition-all duration-200 ${isReached ? 'fill-green-500/20 stroke-green-500' : 'fill-muted stroke-border'}`}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 4}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-foreground"
                    >
                      {idx}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 8}
                      textAnchor="middle"
                      className="text-[9px] font-bold fill-foreground"
                    >
                      {currentStep.tmpPrices[idx] === Infinity ? '∞' : currentStep.tmpPrices[idx]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel
            variables={{
              iteration: currentStep.iteration === -1 ? 'Init' : currentStep.iteration,
              'Prices (fixed)': currentStep.prices.map(p => p === Infinity ? '∞' : p).join(', '),
              'Tmp Prices': currentStep.tmpPrices.map(p => p === Infinity ? '∞' : p).join(', '),
              ...currentStep.variables
            }}
          />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
