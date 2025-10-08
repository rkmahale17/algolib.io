import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface HuffmanNode {
  char: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
}

interface Step {
  text: string;
  frequencies: Map<string, number>;
  nodes: HuffmanNode[];
  codes: Map<string, string>;
  message: string;
  lineNumber: number;
}

export const HuffmanVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const intervalRef = useRef<number | null>(null);

  const code = `function buildHuffmanTree(text: string): Map<string, string> {
  // Calculate frequencies
  const freq = new Map<string, number>();
  for (const char of text) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  
  // Create leaf nodes
  const nodes: HuffmanNode[] = Array.from(freq.entries()).map(([char, f]) => ({
    char, freq: f
  }));
  
  // Build tree by combining lowest frequency nodes
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({
      char: left.char + right.char,
      freq: left.freq + right.freq,
      left, right
    });
  }
  
  // Generate codes
  const codes = new Map<string, string>();
  function traverse(node: HuffmanNode, code: string) {
    if (!node.left && !node.right) {
      codes.set(node.char, code || '0');
    } else {
      if (node.left) traverse(node.left, code + '0');
      if (node.right) traverse(node.right, code + '1');
    }
  }
  traverse(nodes[0], '');
  return codes;
}`;

  const generateSteps = () => {
    const text = 'AABBBCCCC';
    const newSteps: Step[] = [];
    
    const freq = new Map<string, number>();
    for (const char of text) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }

    newSteps.push({
      text,
      frequencies: new Map(freq),
      nodes: [],
      codes: new Map(),
      message: `Calculate character frequencies from "${text}"`,
      lineNumber: 3
    });

    const nodes: HuffmanNode[] = Array.from(freq.entries()).map(([char, f]) => ({
      char, freq: f
    }));

    newSteps.push({
      text,
      frequencies: new Map(freq),
      nodes: [...nodes],
      codes: new Map(),
      message: `Create leaf nodes for each character`,
      lineNumber: 8
    });

    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift()!;
      const right = nodes.shift()!;
      const newNode = {
        char: left.char + right.char,
        freq: left.freq + right.freq,
        left, right
      };
      nodes.push(newNode);

      newSteps.push({
        text,
        frequencies: new Map(freq),
        nodes: [...nodes],
        codes: new Map(),
        message: `Combine "${left.char}"(${left.freq}) + "${right.char}"(${right.freq}) = ${newNode.freq}`,
        lineNumber: 15
      });
    }

    const codes = new Map<string, string>();
    function traverse(node: HuffmanNode, code: string) {
      if (!node.left && !node.right) {
        codes.set(node.char, code || '0');
      } else {
        if (node.left) traverse(node.left, code + '0');
        if (node.right) traverse(node.right, code + '1');
      }
    }
    traverse(nodes[0], '');

    newSteps.push({
      text,
      frequencies: new Map(freq),
      nodes: [...nodes],
      codes: new Map(codes),
      message: `Huffman codes generated!`,
      lineNumber: 33
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Input: "{currentStep.text}"</h3>
        
        <h3 className="text-lg font-semibold mb-4">Character Frequencies</h3>
        <div className="flex gap-4 mb-6">
          {Array.from(currentStep.frequencies.entries()).map(([char, freq]) => (
            <div key={char} className="p-3 bg-muted rounded border">
              <div className="text-xl font-bold mb-1">{char}</div>
              <div className="text-sm text-muted-foreground">freq: {freq}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Huffman Tree Nodes ({currentStep.nodes.length})</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {currentStep.nodes.map((node, idx) => (
            <div key={idx} className="p-3 bg-blue-500/10 rounded border border-blue-500/50">
              <div className="text-sm font-mono font-bold">{node.char}</div>
              <div className="text-xs text-muted-foreground">freq: {node.freq}</div>
            </div>
          ))}
        </div>

        {currentStep.codes.size > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Huffman Codes</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Array.from(currentStep.codes.entries()).map(([char, code]) => (
                <div key={char} className="p-3 bg-green-500/10 rounded border border-green-500/50 flex justify-between">
                  <span className="font-bold">{char}:</span>
                  <span className="font-mono">{code}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'text length': currentStep.text.length,
          'unique chars': currentStep.frequencies.size,
          'nodes remaining': currentStep.nodes.length,
          'codes generated': currentStep.codes.size
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
