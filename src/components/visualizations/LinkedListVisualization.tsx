import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface Node {
  value: number;
  next: number | null;
}

interface LinkedListVisualizationProps {
  algorithmId: string;
}

export const LinkedListVisualization = ({ algorithmId }: LinkedListVisualizationProps) => {
  const initialNodes: Node[] = [
    { value: 1, next: 1 },
    { value: 2, next: 2 },
    { value: 3, next: 3 },
    { value: 4, next: 4 },
    { value: 5, next: null }
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateReverse = async () => {
    setIsAnimating(true);
    const newNodes = [...nodes];

    for (let i = 0; i < newNodes.length; i++) {
      setHighlightIndices([i]);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (i === 0) {
        newNodes[i].next = null;
      } else {
        newNodes[i].next = i - 1;
      }
      setNodes([...newNodes]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const animateFastSlow = async () => {
    setIsAnimating(true);
    let slow = 0;
    let fast = 0;

    while (fast < nodes.length - 1) {
      setHighlightIndices([slow, fast]);
      await new Promise(resolve => setTimeout(resolve, 800));

      slow++;
      fast = Math.min(fast + 2, nodes.length - 1);
    }

    setHighlightIndices([slow]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const resetList = () => {
    setNodes(initialNodes);
    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    if (isAnimating) return;

    switch (algorithmId) {
      case 'reverse-linked-list':
        animateReverse();
        break;
      case 'fast-slow-pointers':
        animateFastSlow();
        break;
      default:
        animateReverse();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? 'Animating...' : 'Start Animation'}
        </button>
        <button
          onClick={resetList}
          disabled={isAnimating}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 p-8 bg-muted/30 rounded-lg border border-border/50 overflow-x-auto">
        {nodes.map((node, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300 ${
                highlightIndices.includes(index)
                  ? 'border-primary bg-primary/20 shadow-lg shadow-primary/50 scale-110'
                  : 'border-border bg-card'
              }`}
            >
              <span className="text-lg font-bold">{node.value}</span>
            </div>
            {node.next !== null && (
              <ArrowRight className={`transition-colors ${
                highlightIndices.includes(index) ? 'text-primary' : 'text-muted-foreground'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {highlightIndices.length > 0 && (
          <p>Processing node(s): {highlightIndices.map(i => nodes[i].value).join(', ')}</p>
        )}
      </div>
    </div>
  );
};
