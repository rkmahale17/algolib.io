import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  message: string;
  lineNumber: number;
}

export const BellmanFordVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function findCheapestPrice(n, flights, src, dst, k) {
  const prices = new Array(n).fill(Infinity);
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
}`;

  const generateSteps = () => {
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

    const newSteps: Step[] = [];
    let prices = Array(n).fill(Infinity);
    prices[src] = 0;

    newSteps.push({
      prices: [...prices],
      tmpPrices: [...prices],
      edges,
      currentEdge: null,
      iteration: -1,
      message: `Initialize prices: src ${src} is 0, others are Infinity`,
      lineNumber: 1
    });

    for (let i = 0; i <= k; i++) {
      let tmpPrices = [...prices];

      newSteps.push({
        prices: [...prices],
        tmpPrices: [...tmpPrices],
        edges,
        currentEdge: null,
        iteration: i,
        message: `Iteration ${i} (up to ${i} stops): Copy prices to tmpPrices`,
        lineNumber: 6
      });

      for (const edge of edges) {
        newSteps.push({
          prices: [...prices],
          tmpPrices: [...tmpPrices],
          edges,
          currentEdge: edge,
          iteration: i,
          message: `Check flight ${edge.from}→${edge.to} (price ${edge.weight})`,
          lineNumber: 8
        });

        if (prices[edge.from] === Infinity) {
          newSteps.push({
            prices: [...prices],
            tmpPrices: [...tmpPrices],
            edges,
            currentEdge: edge,
            iteration: i,
            message: `Node ${edge.from} is unreachable, skipping...`,
            lineNumber: 9
          });
          continue;
        }

        const newPrice = prices[edge.from] + edge.weight;
        if (newPrice < tmpPrices[edge.to]) {
          tmpPrices[edge.to] = newPrice;
          newSteps.push({
            prices: [...prices],
            tmpPrices: [...tmpPrices],
            edges,
            currentEdge: edge,
            iteration: i,
            message: `Found cheaper path to ${edge.to} via ${edge.from}: ${newPrice}`,
            lineNumber: 12
          });
        }
      }

      for (let j = 0; j < n; j++) {
        prices[j] = tmpPrices[j];
      }

      newSteps.push({
        prices: [...prices],
        tmpPrices: [...tmpPrices],
        edges,
        currentEdge: null,
        iteration: i,
        message: `End of iteration ${i}: Update prices from tmpPrices`,
        lineNumber: 17
      });
    }

    newSteps.push({
      prices: [...prices],
      tmpPrices: [...prices],
      edges,
      currentEdge: null,
      iteration: k + 1,
      message: `Algorithm complete. Cheapest price to ${dst}: ${prices[dst] === Infinity ? -1 : prices[dst]}`,
      lineNumber: 21
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  const nodePositions = [
    { x: 50, y: 110 },
    { x: 175, y: 50 },
    { x: 175, y: 170 },
    { x: 300, y: 110 }
  ];

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            <svg width="350" height="220" className="mx-auto">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="33"
                  refY="5"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-border" />
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
                      className={`transition-all duration-300 ${isCurrent ? 'stroke-primary stroke-[3px]' : 'stroke-border stroke-[2px]'
                        }`}
                      markerEnd="url(#arrowhead)"
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 10}
                      className="fill-foreground text-[10px] font-"
                      textAnchor="middle"
                    >
                      {edge.weight}
                    </text>
                  </g>
                );
              })}

              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    className={`transition-all duration-300 ${currentStep.prices[idx] !== Infinity ? 'fill-green-500/20 stroke-green-500' : 'fill-muted stroke-border'
                      }`}
                    strokeWidth="2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 5}
                    textAnchor="middle"
                    className="text-[10px] font- fill-foreground"
                  >
                    {idx}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 10}
                    textAnchor="middle"
                    className="text-[10px] font- fill-foreground"
                  >
                    {currentStep.tmpPrices[idx] === Infinity ? '∞' : currentStep.tmpPrices[idx]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                iteration: currentStep.iteration === -1 ? 'Init' : currentStep.iteration,
                'Prices (fixed)': currentStep.prices.map(p => p === Infinity ? '∞' : p).join(', '),
                'Tmp Prices': currentStep.tmpPrices.map(p => p === Infinity ? '∞' : p).join(', ')
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
        </div>
      </div>
    </div>
  );
};
