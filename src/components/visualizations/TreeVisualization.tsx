import { useState, useEffect } from 'react';
import { Play, Pause, StepForward, StepBack, RotateCcw } from 'lucide-react';

interface TreeNode {
  value: number;
  left: number | null;
  right: number | null;
}

interface TreeVisualizationProps {
  algorithmId: string;
}

export const TreeVisualization = ({ algorithmId }: TreeVisualizationProps) => {
  const tree: TreeNode[] = [
    { value: 4, left: 1, right: 2 },      // 0
    { value: 2, left: 3, right: 4 },      // 1
    { value: 6, left: 5, right: 6 },      // 2
    { value: 1, left: null, right: null }, // 3
    { value: 3, left: null, right: null }, // 4
    { value: 5, left: null, right: null }, // 5
    { value: 7, left: null, right: null }  // 6
  ];

  const [visitedSequence, setVisitedSequence] = useState<number[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Pre-compute sequences
  useEffect(() => {
    const getPreorderSequence = () => {
      const seq: number[] = [];
      const traverse = (nodeIndex: number | null) => {
        if (nodeIndex === null) return;
        seq.push(nodeIndex);
        traverse(tree[nodeIndex].left);
        traverse(tree[nodeIndex].right);
      };
      traverse(0);
      return seq;
    };

    const getInorderSequence = () => {
      const seq: number[] = [];
      const traverse = (nodeIndex: number | null) => {
        if (nodeIndex === null) return;
        traverse(tree[nodeIndex].left);
        seq.push(nodeIndex);
        traverse(tree[nodeIndex].right);
      };
      traverse(0);
      return seq;
    };

    const getPostorderSequence = () => {
      const seq: number[] = [];
      const traverse = (nodeIndex: number | null) => {
        if (nodeIndex === null) return;
        traverse(tree[nodeIndex].left);
        traverse(tree[nodeIndex].right);
        seq.push(nodeIndex);
      };
      traverse(0);
      return seq;
    };

    const getBfsSequence = () => {
      const seq: number[] = [];
      const queue = [0];
      while (queue.length > 0) {
        const nodeIndex = queue.shift()!;
        seq.push(nodeIndex);
        if (tree[nodeIndex].left !== null) queue.push(tree[nodeIndex].left!);
        if (tree[nodeIndex].right !== null) queue.push(tree[nodeIndex].right!);
      }
      return seq;
    };

    let sequence: number[] = [];
    switch (algorithmId) {
      case 'dfs-preorder': sequence = getPreorderSequence(); break;
      case 'dfs-inorder': sequence = getInorderSequence(); break;
      case 'dfs-postorder': sequence = getPostorderSequence(); break;
      case 'bfs-level-order': sequence = getBfsSequence(); break;
      default: sequence = getPreorderSequence();
    }
    setVisitedSequence(sequence);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
  }, [algorithmId]);

  // Handle playback interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < visitedSequence.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= visitedSequence.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    } else if (currentStepIndex >= visitedSequence.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, visitedSequence.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= visitedSequence.length - 1) {
      setCurrentStepIndex(-1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < visitedSequence.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > -1) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  };

  const currentVisitedNodes = visitedSequence.slice(0, currentStepIndex + 1);

  const renderNode = (index: number, x: number, y: number, offset: number) => {
    const node = tree[index];
    const isVisited = currentVisitedNodes.includes(index);
    const visitOrder = currentVisitedNodes.indexOf(index);

    return (
      <g key={index}>
        {node.left !== null && (
          <line
            x1={x}
            y1={y}
            x2={x - offset}
            y2={y + 60}
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
        )}
        {node.right !== null && (
          <line
            x1={x}
            y1={y}
            x2={x + offset}
            y2={y + 60}
            stroke="currentColor"
            className="text-border"
            strokeWidth="2"
          />
        )}
        <circle
          cx={x}
          cy={y}
          r="24"
          className={`transition-all duration-300 ${isVisited ? 'fill-primary' : 'fill-card'
            }`}
          stroke="currentColor"
          strokeWidth="2"
          style={{
            strokeDasharray: isVisited ? '0' : '150',
            strokeDashoffset: isVisited ? '0' : '150'
          }}
        />
        <text
          x={x}
          y={y + 6}
          textAnchor="middle"
          className={`text-sm font- transition-colors ${isVisited ? 'fill-primary-foreground' : 'fill-foreground'
            }`}
        >
          {node.value}
        </text>
        {isVisited && visitOrder >= 0 && (
          <text
            x={x}
            y={y + 45}
            textAnchor="middle"
            className="text-xs fill-primary font-"
          >
            {visitOrder + 1}
          </text>
        )}
      </g>
    );
  };

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, offset: 80 },   // 0
      { x: 120, y: 100, offset: 40 },  // 1
      { x: 280, y: 100, offset: 40 },  // 2
      { x: 80, y: 160, offset: 0 },    // 3
      { x: 160, y: 160, offset: 0 },   // 4
      { x: 240, y: 160, offset: 0 },   // 5
      { x: 320, y: 160, offset: 0 }    // 6
    ];

    return (
      <svg width="400" height="220" className="mx-auto">
        {positions.map((pos, index) =>
          renderNode(index, pos.x, pos.y, pos.offset)
        )}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Input Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">1. Input Tree</h3>
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          {renderTree()}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 justify-center p-3 bg-muted/20 border rounded-lg">
        <button
          onClick={handleStepBackward}
          disabled={currentStepIndex === -1}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground transition-all"
          title="Step Backward"
        >
          <StepBack className="w-5 h-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          {isPlaying ? (
            <><Pause className="w-4 h-4" /> Pause</>
          ) : (
            <><Play className="w-4 h-4" /> {currentStepIndex >= visitedSequence.length - 1 ? 'Replay' : 'Play'}</>
          )}
        </button>

        <button
          onClick={handleStepForward}
          disabled={currentStepIndex >= visitedSequence.length - 1}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 text-foreground transition-all"
          title="Step Forward"
        >
          <StepForward className="w-5 h-5" />
        </button>

        <button
          onClick={handleReset}
          disabled={currentStepIndex === -1 && !isPlaying}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 ml-2 text-muted-foreground hover:text-foreground transition-all"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Output Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">2. Output Order</h3>
        <div className="p-4 bg-card rounded-lg border border-border/50 min-h-[60px] flex items-center justify-center">
          <p className="font-mono text-sm">
            {currentStepIndex >= 0
              ? currentVisitedNodes.map(i => tree[i].value).join(' → ')
              : <span className="text-muted-foreground">Press Play or Step Forward to see sequence</span>}
          </p>
        </div>
      </div>
    </div>
  );
};
