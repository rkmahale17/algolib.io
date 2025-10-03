import { useEffect, useState } from 'react';

interface ArrayVisualizationProps {
  algorithmId: string;
}

export const ArrayVisualization = ({ algorithmId }: ArrayVisualizationProps) => {
  const [array, setArray] = useState<number[]>([5, 2, 8, 1, 9, 3, 7, 4, 6]);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getMaxValue = () => Math.max(...array);

  const animateTwoPointers = async () => {
    setIsAnimating(true);
    let left = 0;
    let right = array.length - 1;

    while (left < right) {
      setHighlightIndices([left, right]);
      await new Promise(resolve => setTimeout(resolve, 800));
      left++;
      right--;
    }

    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const animateSlidingWindow = async () => {
    setIsAnimating(true);
    const windowSize = 3;

    for (let i = 0; i <= array.length - windowSize; i++) {
      const window = Array.from({ length: windowSize }, (_, j) => i + j);
      setHighlightIndices(window);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const animateBinarySearch = async () => {
    setIsAnimating(true);
    const sortedArray = [...array].sort((a, b) => a - b);
    setArray(sortedArray);
    
    let left = 0;
    let right = sortedArray.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setHighlightIndices([left, mid, right]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (Math.random() > 0.5) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setHighlightIndices([]);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    if (isAnimating) return;

    switch (algorithmId) {
      case 'two-pointers':
        animateTwoPointers();
        break;
      case 'sliding-window':
        animateSlidingWindow();
        break;
      case 'binary-search':
        animateBinarySearch();
        break;
      default:
        animateTwoPointers();
    }
  };

  const resetArray = () => {
    setArray([5, 2, 8, 1, 9, 3, 7, 4, 6]);
    setHighlightIndices([]);
    setIsAnimating(false);
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
          onClick={resetArray}
          disabled={isAnimating}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex items-end justify-center gap-2 h-64 p-4 bg-muted/30 rounded-lg border border-border/50">
        {array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1 max-w-[60px]"
          >
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                highlightIndices.includes(index)
                  ? 'bg-primary shadow-lg shadow-primary/50'
                  : 'bg-gradient-to-t from-primary/60 to-primary/40'
              }`}
              style={{
                height: `${(value / getMaxValue()) * 100}%`,
                minHeight: '20px'
              }}
            />
            <span className={`text-xs font-mono transition-colors ${
              highlightIndices.includes(index) ? 'text-primary font-bold' : 'text-muted-foreground'
            }`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {highlightIndices.length > 0 && (
          <p>Highlighting indices: {highlightIndices.join(', ')}</p>
        )}
      </div>
    </div>
  );
};
